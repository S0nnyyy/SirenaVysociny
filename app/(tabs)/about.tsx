import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Phone, Globe, ChevronRight, Flame } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useThemeStore } from '@/store/theme-store';

export default function AboutScreen() {
  const colors = useThemeColors();
  const { theme } = useThemeStore();
  const appVersion = '1.0.0';
  
  const handleEmailPress = () => {
    Linking.openURL('mailto:podpora@hzs-app.cz');
  };
  
  const handlePhonePress = () => {
    Linking.openURL('tel:+420123456789');
  };
  
  const handleWebsitePress = () => {
    Linking.openURL('https://www.hzs-app.cz');
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={[styles.logoContainer, { backgroundColor: colors.primary }]}>
            <Flame size={60} color={colors.white} />
          </View>
          <Text style={[styles.appName, { color: colors.text }]}>Aplikace HZS</Text>
          <Text style={[styles.appVersion, { color: colors.textLight }]}>Verze {appVersion}</Text>
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text, borderBottomColor: colors.border }]}>O aplikaci</Text>
          <Text style={[styles.aboutText, { color: colors.text }]}>
            Tato aplikace poskytuje sledování výjezdů hasičského záchranného sboru v reálném čase. 
            Umožňuje hasičům a záchranářům být informováni o aktuálních událostech, 
            zobrazovat podrobné informace o každém výjezdu a sledovat statistiky zásahů.
          </Text>
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text, borderBottomColor: colors.border }]}>Kontakt</Text>
          
          <TouchableOpacity 
            style={[styles.contactItem, { borderBottomColor: colors.border }]} 
            onPress={handleEmailPress}
          >
            <View style={[styles.contactIconContainer, { backgroundColor: `${colors.primary}20` }]}>
              <Mail size={20} color={colors.primary} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={[styles.contactLabel, { color: colors.textLight }]}>Email</Text>
              <Text style={[styles.contactValue, { color: colors.text }]}>podpora@hzs-app.cz</Text>
            </View>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.contactItem, { borderBottomColor: colors.border }]} 
            onPress={handlePhonePress}
          >
            <View style={[styles.contactIconContainer, { backgroundColor: `${colors.primary}20` }]}>
              <Phone size={20} color={colors.primary} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={[styles.contactLabel, { color: colors.textLight }]}>Telefon</Text>
              <Text style={[styles.contactValue, { color: colors.text }]}>+420 123 456 789</Text>
            </View>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.contactItem, { borderBottomColor: colors.border }]} 
            onPress={handleWebsitePress}
          >
            <View style={[styles.contactIconContainer, { backgroundColor: `${colors.primary}20` }]}>
              <Globe size={20} color={colors.primary} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={[styles.contactLabel, { color: colors.textLight }]}>Webové stránky</Text>
              <Text style={[styles.contactValue, { color: colors.text }]}>www.hzs-app.cz</Text>
            </View>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text, borderBottomColor: colors.border }]}>Právní informace</Text>
          
          <TouchableOpacity style={[styles.linkItem, { borderBottomColor: colors.border }]}>
            <Text style={[styles.linkText, { color: colors.text }]}>Podmínky služby</Text>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.linkItem, { borderBottomColor: colors.border }]}>
            <Text style={[styles.linkText, { color: colors.text }]}>Zásady ochrany soukromí</Text>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.linkItem, { borderBottomColor: colors.border }]}>
            <Text style={[styles.linkText, { color: colors.text }]}>Licence</Text>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.copyright, { color: colors.textLight }]}>
          © {new Date().getFullYear()} Aplikace HZS. Všechna práva vyhrazena.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 12,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
  },
  section: {
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    padding: 16,
    borderBottomWidth: 1,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 22,
    padding: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  contactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 16,
  },
  linkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  linkText: {
    fontSize: 16,
  },
  copyright: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 24,
  },
});