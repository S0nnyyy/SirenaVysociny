from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from flask import Flask, jsonify, request
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import json
from datetime import datetime
import threading
import time
import logging
import random
from webdriver_manager.chrome import ChromeDriverManager

# Nastavení logování
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('scraper.log'),
        logging.StreamHandler()
    ]
)

app = Flask(__name__)

# SQLAlchemy nastavení
Base = declarative_base()

class Zasah(Base):
    __tablename__ = 'zasahy'
    id = Column(Integer, primary_key=True)
    datum_ohlaseni = Column(DateTime, index=True)
    stav = Column(String)
    typ_udalosti = Column(String)
    podtyp_udalosti = Column(String)
    kraj = Column(String)
    okres = Column(String)
    orp = Column(String)
    obec = Column(String)
    cast_obce = Column(String)
    ulice = Column(String)
    silnice = Column(String)
    poznamka_pro_media = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Vytvoření databáze
engine = create_engine('sqlite:///zasahy.db')
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)

# Funkce pro parsování data
def parse_datum(datum_str):
    try:
        return datetime.strptime(datum_str, "%d.%m.%Y %H:%M")
    except ValueError as e:
        logging.error(f"Nepodařilo se parsovat datum {datum_str}: {e}")
        return None

# Funkce pro scraping dat
def scrapuj_data():
    url = "http://webohled.hasici-vysocina.cz/udalosti"
    
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")
    
    try:
        logging.info("Inicializace ChromeDriveru...")
        driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
        driver.get(url)
        
        logging.info("Hledám řádky tabulky...")
        tabulka = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "table"))
        )
        WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, "table tr td:nth-child(12)"))
        )
        radky = tabulka.find_elements(By.TAG_NAME, "tr")[1:]  # Přeskočíme hlavičku
        
        zasahy = []
        for radek in radky:
            try:
                sloupce = radek.find_elements(By.TAG_NAME, "td")
                logging.debug(f"Počet sloupců v řádku: {len(sloupce)}")
                if len(sloupce) >= 12:
                    zasah = {
                        "datum_ohlaseni": sloupce[0].text.strip(),
                        "stav": sloupce[1].text.strip(),
                        "typ_udalosti": sloupce[2].text.strip(),
                        "podtyp_udalosti": sloupce[3].text.strip(),
                        "kraj": sloupce[4].text.strip(),
                        "okres": sloupce[5].text.strip(),
                        "orp": sloupce[6].text.strip(),
                        "obec": sloupce[7].text.strip(),
                        "cast_obce": sloupce[8].text.strip() if sloupce[8].text.strip() else "Není uvedena",
                        "ulice": sloupce[9].text.strip() if sloupce[9].text.strip() else "Není uvedena",
                        "silnice": sloupce[10].text.strip() if sloupce[10].text.strip() else "Není uvedena",
                        "poznamka_pro_media": sloupce[11].text.strip() if sloupce[11].text.strip() else "Není uvedena"
                    }
                    zasahy.append(zasah)
                    logging.info(f"Načten zásah: {zasah['datum_ohlaseni']}")
                else:
                    logging.warning(f"Nedostatečný počet sloupců v řádku: {len(sloupce)}")
            except Exception as e:
                logging.error(f"Chyba při zpracování řádku: {e}")
                continue
        
        driver.quit()
        logging.info(f"Celkem načteno {len(zasahy)} zásahů v {datetime.now()}")
        return zasahy
    
    except Exception as e:
        logging.error(f"Chyba při scrapování dat: {e}")
        if 'driver' in locals():
            driver.quit()
        return []

# Funkce pro načtení posledního záznamu z JSON
def nacti_posledni_zasah():
    try:
        with open('posledni_zasah.json', 'r') as file:
            data = json.load(file)
        posledni_cas = data.get('cas_posledniho_zasahu', None)
        logging.info(f"Načten poslední čas zásahu z JSON: {posledni_cas}")
        return posledni_cas
    except FileNotFoundError:
        logging.warning("Soubor 'posledni_zasah.json' nebyl nalezen.")
        return None

# Funkce pro uložení posledního záznamu do JSON
def uloz_posledni_zasah(cas):
    with open('posledni_zasah.json', 'w') as file:
        json.dump({'cas_posledniho_zasahu': cas}, file)
    logging.info(f"Uložen čas posledního zásahu do JSON: {cas}")

# Funkce pro zpracování a aktualizaci dat
def zpracuj_data():
    session = Session()
    try:
        zasahy = scrapuj_data()
        if not zasahy:
            logging.info("Žádná data nebyla načtena ze scrapování.")
            return

        posledni_cas = nacti_posledni_zasah()
        nove_zasahy = []

        logging.info("Kontrola zásahů...")
        for zasah in zasahy:
            datum_zasahu = zasah["datum_ohlaseni"]
            datum_zasahu_dt = parse_datum(datum_zasahu)
            posledni_cas_dt = parse_datum(posledni_cas) if posledni_cas else None

            if datum_zasahu_dt is None:
                logging.warning(f"Přeskočen zásah s neplatným datem: {datum_zasahu}")
                continue

            # Kontrola, zda je zásah nový
            if posledni_cas_dt is None or datum_zasahu_dt > posledni_cas_dt:
                # Kontrola duplicity v databázi
                existing_zasah = session.query(Zasah).filter_by(datum_ohlaseni=datum_zasahu_dt).first()
                if not existing_zasah:
                    novy_zasah = Zasah(
                        datum_ohlaseni=datum_zasahu_dt,
                        stav="Otevřená OS",  # Nový zásah má výchozí stav
                        typ_udalosti=zasah["typ_udalosti"],
                        podtyp_udalosti=zasah["podtyp_udalosti"],
                        kraj=zasah["kraj"],
                        okres=zasah["okres"],
                        orp=zasah["orp"],
                        obec=zasah["obec"],
                        cast_obce=zasah["cast_obce"],
                        ulice=zasah["ulice"],
                        silnice=zasah["silnice"],
                        poznamka_pro_media=zasah["poznamka_pro_media"]
                    )
                    session.add(novy_zasah)
                    nove_zasahy.append(zasah)
                    print(f"\n=== Nový zásah nalezen ===")
                    print(f"Datum ohlášení: {zasah['datum_ohlaseni']}")
                    print(f"Stav: Otevřená OS")
                    print(f"Typ události: {zasah['typ_udalosti']}")
                    print(f"Podtyp události: {zasah['podtyp_udalosti']}")
                    print(f"Kraj: {zasah['kraj']}")
                    print(f"Okres: {zasah['okres']}")
                    print(f"ORP: {zasah['orp']}")
                    print(f"Obec: {zasah['obec']}")
                    print(f"Část obce: {zasah['cast_obce']}")
                    print(f"Ulice: {zasah['ulice']}")
                    print(f"Silnice: {zasah['silnice']}")
                    print(f"Poznámka pro média: {zasah['poznamka_pro_media']}")
                    print("========================\n")
                    logging.info(f"Nový zásah přidán: {datum_zasahu}")

            # Kontrola aktualizace stavu existujícího zásahu
            existing_zasah = session.query(Zasah).filter_by(datum_ohlaseni=datum_zasahu_dt).first()
            if existing_zasah and existing_zasah.stav != zasah["stav"]:
                old_stav = existing_zasah.stav
                existing_zasah.stav = zasah["stav"]
                existing_zasah.updated_at = datetime.utcnow()
                session.add(existing_zasah)
                print(f"\n=== Aktualizace zásahu ===")
                print(f"Datum ohlášení: {zasah['datum_ohlaseni']}")
                print(f"Původní stav: {old_stav}")
                print(f"Nový stav: {zasah['stav']}")
                print("========================\n")
                logging.info(f"Aktualizován stav zásahu {datum_zasahu}: {old_stav} -> {zasah['stav']}")

        if nove_zasahy:
            session.commit()
            uloz_posledni_zasah(nove_zasahy[0]["datum_ohlaseni"])
            logging.info(f"Přidáno {len(nove_zasahy)} nových zásahů.")
        else:
            session.commit()
            logging.info("Žádné nové zásahy nebyly nalezeny.")

    except Exception as e:
        session.rollback()
        logging.error(f"Chyba při zpracování dat: {e}")
    finally:
        session.close()

# API endpoint pro získání zásahů (pro mobilní aplikaci)
@app.route('/api/zasahy', methods=['GET'])
def get_zasahy():
    session = Session()
    try:
        limit = int(request.args.get('limit', 5))
        offset = int(request.args.get('offset', 0))
        zasahy = session.query(Zasah).order_by(Zasah.datum_ohlaseni.desc()).limit(limit).offset(offset).all()
        result = [{
            "id": z.id,
            "datum_ohlaseni": z.datum_ohlaseni.strftime("%d.%m.%Y %H:%M"),
            "stav": z.stav,
            "typ_udalosti": z.typ_udalosti,
            "podtyp_udalosti": z.podtyp_udalosti,
            "kraj": z.kraj,
            "okres": z.okres,
            "orp": z.orp,
            "obec": z.obec,
            "cast_obce": z.cast_obce,
            "ulice": z.ulice,
            "silnice": z.silnice,
            "poznamka_pro_media": z.poznamka_pro_media
        } for z in zasahy]
        return jsonify({"zasahy": result})
    except Exception as e:
        logging.error(f"Chyba při načítání zásahů: {e}")
        return jsonify({"error": "Nepodařilo se načíst data"}), 500
    finally:
        session.close()

# API endpoint pro kontrolu nových zásahů
@app.route('/api/novy-zasah', methods=['GET'])
def check_novy_zasah():
    session = Session()
    try:
        posledni_datum = request.args.get('posledni_datum')
        if not posledni_datum:
            return jsonify({"novy_zasah": False})

        posledni_datum_dt = datetime.strptime(posledni_datum, "%d.%m.%Y %H:%M")
        novy_zasah = session.query(Zasah).filter(Zasah.datum_ohlaseni > posledni_datum_dt).order_by(Zasah.datum_ohlaseni.desc()).first()
        
        if novy_zasah:
            return jsonify({
                "novy_zasah": True,
                "zasah": {
                    "id": novy_zasah.id,
                    "datum_ohlaseni": novy_zasah.datum_ohlaseni.strftime("%d.%m.%Y %H:%M"),
                    "stav": novy_zasah.stav,
                    "typ_udalosti": novy_zasah.typ_udalosti,
                    "podtyp_udalosti": novy_zasah.podtyp_udalosti,
                    "kraj": novy_zasah.kraj,
                    "okres": novy_zasah.okres,
                    "orp": novy_zasah.orp,
                    "obec": novy_zasah.obec,
                    "cast_obce": novy_zasah.cast_obce,
                    "ulice": novy_zasah.ulice,
                    "silnice": novy_zasah.silnice,
                    "poznamka_pro_media": novy_zasah.poznamka_pro_media
                }
            })
        return jsonify({"novy_zasah": False})
    except Exception as e:
        logging.error(f"Chyba při kontrole nového zásahu: {e}")
        return jsonify({"error": "Chyba při kontrole nového zásahu"}), 500
    finally:
        session.close()

# API endpoint pro stav API
@app.route('/api/status', methods=['GET'])
def get_api_status():
    try:
        session = Session()
        session.query(Zasah).limit(1).all()
        session.close()
        return jsonify({"status": "online"})
    except Exception as e:
        logging.error(f"Chyba při kontrole stavu API: {e}")
        return jsonify({"status": "offline"})

# Funkce pro pravidelné scrapování
def pravidelne_scrapovani():
    while True:
        logging.info("Začínám scrapovat data...")
        zpracuj_data()
        cekani = random.randint(30, 240)
        logging.info(f"Vygenerován čas čekání: {cekani} sekund")
        print(f"Vygenerován čas čekání: {cekani} sekund")
        time.sleep(cekani)

# Spuštění Flask serveru
def spustit_server():
    app.run(host='0.0.0.0', port=5000)

if __name__ == "__main__":
    scrapovani_vlakno = threading.Thread(target=pravidelne_scrapovani)
    scrapovani_vlakno.daemon = True
    scrapovani_vlakno.start()
    spustit_server()