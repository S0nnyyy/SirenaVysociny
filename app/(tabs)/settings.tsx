import React from 'react';
import { StyleSheet, View, Text, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Moon, Sun, Filter, Bell, MapPin, ChevronRight } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useEmergencyStore } from '@/store/emergency-store';
import { useThemeStore } from '@/store/theme-store';

export default function SettingsScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { theme, setTheme } = useThemeStore();
  
  const { 
    filterSettings,
    updateFilterSettings
  } = useEmergencyStore();
  
  const navigateToNotificationSettings = () => {
    router.push('/settings/notification');
  };
  
  const navigateToRegionFilter = () => {
    router.push('/settings/region-filter');
  };
  
  const navigateToTypeFilter = () => {
    router.push('/settings/type-filter');
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text, borderBottomColor: colors.border }]}>Vzhled</Text>
          
          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <View style={styles.settingInfo}>
              <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}10` }]}>
                {theme === 'dark' ? (
                  <Moon size={20} color={colors.primary} />
                ) : (
                  <Sun size={20} color={colors.primary} />
                )}
              </View>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Tmavý režim</Text>
            </View>
            <Switch
              value={theme === 'dark'}
              onValueChange={(value) => setTheme(value ? 'dark' : 'light')}
              trackColor={{ false: colors.border, true: `${colors.primary}80` }}
              thumbColor={theme === 'dark' ? colors.primary : colors.textLight}
            />
          </View>
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text, borderBottomColor: colors.border }]}>Oznámení</Text>
          
          <TouchableOpacity 
            style={[styles.linkItem, { borderBottomColor: colors.border }]}
            onPress={navigateToNotificationSettings}
          >
            <View style={styles.settingInfo}>
              <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}10` }]}>
                <Bell size={20} color={colors.primary} />
              </View>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Nastavení oznámení</Text>
            </View>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text, borderBottomColor: colors.border }]}>Filtry výjezdů</Text>
          
          <TouchableOpacity 
            style={[styles.linkItem, { borderBottomColor: colors.border }]}
            onPress={navigateToRegionFilter}
          >
            <View style={styles.settingInfo}>
              <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}10` }]}>
                <MapPin size={20} color={colors.primary} />
              </View>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Kraje a okresy</Text>
              <Text style={[styles.settingValue, { color: colors.textLight }]}>
                {filterSettings.districts.length > 0 
                  ? `${filterSettings.districts.length} vybráno` 
                  : 'Všechny'}
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.linkItem, { borderBottomColor: colors.border }]}
            onPress={navigateToTypeFilter}
          >
            <View style={styles.settingInfo}>
              <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}10` }]}>
                <Filter size={20} color={colors.primary} />
              </View>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Typy výjezdů</Text>
              <Text style={[styles.settingValue, { color: colors.textLight }]}>
                {filterSettings.emergencyTypes.length > 0 
                  ? `${filterSettings.emergencyTypes.length} vybráno` 
                  : 'Všechny'}
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>
          
          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <View style={styles.settingInfo}>
              <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}10` }]}>
                <Filter size={20} color={colors.primary} />
              </View>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Zobrazit aktivní</Text>
            </View>
            <Switch
              value={filterSettings.showActive}
              onValueChange={(value) => updateFilterSettings({ showActive: value })}
              trackColor={{ false: colors.border, true: `${colors.primary}80` }}
              thumbColor={filterSettings.showActive ? colors.primary : colors.textLight}
            />
          </View>
          
          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <View style={styles.settingInfo}>
              <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}10` }]}>
                <Filter size={20} color={colors.primary} />
              </View>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Zobrazit dokončené</Text>
            </View>
            <Switch
              value={filterSettings.showCompleted}
              onValueChange={(value) => updateFilterSettings({ showCompleted: value })}
              trackColor={{ false: colors.border, true: `${colors.primary}80` }}
              thumbColor={filterSettings.showCompleted ? colors.primary : colors.textLight}
            />
          </View>
          
          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <View style={styles.settingInfo}>
              <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}10` }]}>
                <Filter size={20} color={colors.primary} />
              </View>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Zobrazit čekající</Text>
            </View>
            <Switch
              value={filterSettings.showPending}
              onValueChange={(value) => updateFilterSettings({ showPending: value })}
              trackColor={{ false: colors.border, true: `${colors.primary}80` }}
              thumbColor={filterSettings.showPending ? colors.primary : colors.textLight}
            />
          </View>
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text, borderBottomColor: colors.border }]}>Aplikace</Text>
          
          <TouchableOpacity style={[styles.linkItem, { borderBottomColor: colors.border }]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Jazyk</Text>
              <Text style={[styles.settingValue, { color: colors.textLight }]}>Čeština</Text>
            </View>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.linkItem, { borderBottomColor: colors.border }]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Vymazat mezipaměť</Text>
            </View>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>
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
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
  },
  settingValue: {
    fontSize: 14,
    marginLeft: 8,
  },
  linkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
});