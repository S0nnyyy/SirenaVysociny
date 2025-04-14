from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from flask import Flask, jsonify
import json
from datetime import datetime
import threading
import time
import logging
from webdriver_manager.chrome import ChromeDriverManager

# Nastavení logování do souboru i konzole
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('scraper.log'),
        logging.StreamHandler()  # Přidá výstup do konzole
    ]
)

app = Flask(__name__)

# Globální proměnná pro uchování nových zásahů
nove_zasahy_data = []

# Funkce pro parsování data
def parse_datum(datum_str):
    try:
        return datetime.strptime(datum_str, "%d.%m.%Y %H:%M")
    except ValueError as e:
        logging.error(f"Nepodařilo se parsovat datum {datum_str}: {e}")
        return None

# Funkce pro scraping dat z hlavní stránky
def scrapuj_data():
    url = "http://webohled.hasici-vysocina.cz/udalosti"
    
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")
    
    try:
        logging.info("Inicializace ChromeDriveru pro hlavní stránku...")
        driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
        driver.get(url)
        time.sleep(5)  # Čekáme na načtení tabulky
        
        logging.info("Hledám řádky tabulky na hlavní stránce...")
        tabulka = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "table"))
        )
        radky = tabulka.find_elements(By.TAG_NAME, "tr")[1:]  # Přeskočíme hlavičku
        
        zasahy = []
        for radek in radky:
            try:
                sloupce = radek.find_elements(By.TAG_NAME, "td")
                logging.debug(f"Počet sloupců v řádku: {len(sloupce)}")
                if len(sloupce) >= 11:
                    zasah = {
                        "datum": sloupce[0].text.strip(),
                        "stav": sloupce[1].text.strip(),
                        "typ_udalosti": sloupce[2].text.strip(),
                        "podtyp_udalosti": sloupce[3].text.strip(),
                        "okres": sloupce[5].text.strip(),
                        "obec": sloupce[6].text.strip(),
                        "ulice": sloupce[8].text.strip() if sloupce[8].text.strip() else "N/A",
                        "poznamka": sloupce[10].text.strip() if sloupce[10].text.strip() else "N/A"
                    }
                    zasahy.append(zasah)
                    logging.info(f"Načten zásah: {zasah['datum']}")
                else:
                    logging.warning(f"Nedostatečný počet sloupců v řádku: {len(sloupce)}")
            except Exception as e:
                logging.error(f"Chyba při zpracování řádku: {e}")
                continue
        
        driver.quit()
        logging.info(f"Celkem načteno {len(zasahy)} zásahů z webu v {datetime.now()}")
        return zasahy
    
    except Exception as e:
        logging.error(f"Chyba při scrapování dat: {e}")
        if 'driver' in locals():
            driver.quit()
        return []

# Funkce pro načtení posledního záznamu z JSON souboru
def nacti_posledni_zasah():
    try:
        with open('posledni_zasah.json', 'r') as file:
            data = json.load(file)
        posledni_cas = data.get('cas_posledniho_zasahu', None)
        logging.info(f"Načten poslední čas zásahu z JSON: {posledni_cas}")
        return posledni_cas
    except FileNotFoundError:
        logging.warning("Soubor 'posledni_zasah.json' nebyl nalezen. Pravděpodobně první spuštění.")
        return None

# Funkce pro uložení posledního záznamu do JSON souboru
def uloz_posledni_zasah(cas):
    with open('posledni_zasah.json', 'w') as file:
        json.dump({'cas_posledniho_zasahu': cas}, file)
    logging.info(f"Uložen čas posledního zásahu do JSON: {cas}")

# Funkce pro zpracování scraped dat
def zpracuj_data():
    global nove_zasahy_data
    try:
        zasahy = scrapuj_data()
        if not zasahy:
            logging.info("Žádná data nebyla načtena ze scrapování.")
            nove_zasahy_data = []
            return

        posledni_cas = nacti_posledni_zasah()
        nove_zasahy = []

        logging.info("Kontrola nových zásahů...")
        for zasah in zasahy:
            datum_zasahu = zasah["datum"]
            datum_zasahu_dt = parse_datum(datum_zasahu)
            posledni_cas_dt = parse_datum(posledni_cas) if posledni_cas else None

            if datum_zasahu_dt is None:
                logging.warning(f"Přeskočen zásah s neplatným datem: {datum_zasahu}")
                continue

            if posledni_cas_dt is None or datum_zasahu_dt > posledni_cas_dt:
                nove_zasahy.append(zasah)
                # Vypíše základní údaje nového zásahu do konzole
                print(f"\n=== Nový zásah nalezen ===")
                print(f"Datum: {zasah['datum']}")
                print(f"Typ události: {zasah['typ_udalosti']}")
                print(f"Podtyp události: {zasah['podtyp_udalosti']}")
                print(f"Okres: {zasah['okres']}")
                print(f"Obec: {zasah['obec']}")
                print(f"Ulice: {zasah['ulice']}")
                print(f"Poznámka: {zasah['poznamka']}")
                print("========================\n")
                logging.info(f"Nový zásah nalezen: {datum_zasahu}")
            else:
                logging.debug(f"Zásah {datum_zasahu} není nový, poslední čas: {posledni_cas}")

        if nove_zasahy:
            nove_zasahy_data = nove_zasahy[::-1]  # Seřazení od nejnovějšího
            uloz_posledni_zasah(nove_zasahy[0]["datum"])
            logging.info(f"Nalezeno {len(nove_zasahy)} nových zásahů.")
        else:
            logging.info("Žádné nové zásahy nebyly nalezeny.")
            nove_zasahy_data = []

    except Exception as e:
        logging.error(f"Chyba při zpracování dat: {e}")
        nove_zasahy_data = []

# API endpoint pro získání nových zásahů
@app.route('/api/nove-zasahy', methods=['GET'])
def get_nove_zasahy():
    return jsonify({"nove_zasahy": nove_zasahy_data})

# Nový API endpoint pro stav API
@app.route('/api/status', methods=['GET'])
def get_api_status():
    try:
        # Zkusíme scrapovat data, pokud se to podaří, API je online
        scrapuj_data()
        return jsonify({"status": "online"})
    except:
        # Pokud scrapování selže, API je offline
        return jsonify({"status": "offline"})

# Funkce pro pravidelné scrapování a zpracování dat
def pravidelne_scrapovani():
    while True:
        logging.info("Začínám scrapovat data...")
        zpracuj_data()
        time.sleep(61)  # Čekání 61 sekund mezi kontrolami

# Spuštění Flask serveru v samostatném vlákně
def spustit_server():
    app.run(host='0.0.0.0', port=5000)

if __name__ == "__main__":
    # Spuštění pravidelného scrapování v samostatném vlákně
    scrapovani_vlakno = threading.Thread(target=pravidelne_scrapovani)
    scrapovani_vlakno.daemon = True
    scrapovani_vlakno.start()

    # Spuštění Flask serveru
    spustit_server()