import React from 'react';
import { StyleSheet, View, Text, Switch, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Bell, BellOff, Filter } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useEmergencyStore } from '@/store/emergency-store';
import { useThemeStore } from '@/store/theme-store';
import { EmergencyType } from '@/types/emergency';

export default function NotificationSettingsScreen() {
  const colors = useThemeColors();
  const { theme } = useThemeStore();
  const { notificationSettings, updateNotificationSettings } = useEmergencyStore();
  
  const toggleNotifications = (value: boolean) => {
    updateNotificationSettings({ enabled: value });
  };
  
  const toggleEmergencyAlerts = (value: boolean) => {
    updateNotificationSettings({ emergencyAlerts: value });
  };
  
  const toggleStatusUpdates = (value: boolean) => {
    updateNotificationSettings({ statusUpdates: value });
  };
  
  const getTypeLabel = (type: EmergencyType) => {
    switch (type) {
      case 'fire': return 'Požáry';
      case 'accident': return 'Nehody';
      case 'rescue': return 'Záchranné akce';
      case 'technical': return 'Technická pomoc';
      case 'chemical': return 'Chemické úniky';
      case 'other': return 'Ostatní';
      default: return type;
    }
  };
  
  const toggleTypeFilter = (type: EmergencyType) => {
    const currentFilters = [...notificationSettings.typeFilters];
    const index = currentFilters.indexOf(type);
    
    if (index > -1) {
      currentFilters.splice(index, 1);
    } else {
      currentFilters.push(type);
    }
    
    updateNotificationSettings({ typeFilters: currentFilters });
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <Stack.Screen 
        options={{ 
          title: 'Nastavení oznámení',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
        }} 
      />
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text, borderBottomColor: colors.border }]}>
            Obecné nastavení
          </Text>
          
          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <View style={styles.settingInfo}>
              <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}20` }]}>
                {notificationSettings.enabled ? (
                  <Bell size={20} color={colors.primary} />
                ) : (
                  <BellOff size={20} color={colors.primary} />
                )}
              </View>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Povolit oznámení</Text>
            </View>
            <Switch
              value={notificationSettings.enabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: colors.border, true: `${colors.primary}80` }}
              thumbColor={notificationSettings.enabled ? colors.primary : colors.textLight}
            />
          </View>
          
          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <View style={styles.settingInfo}>
              <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}20` }]}>
                <Bell size={20} color={colors.primary} />
              </View>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Nové výjezdy</Text>
            </View>
            <Switch
              value={notificationSettings.emergencyAlerts}
              onValueChange={toggleEmergencyAlerts}
              trackColor={{ false: colors.border, true: `${colors.primary}80` }}
              thumbColor={notificationSettings.emergencyAlerts ? colors.primary : colors.textLight}
              disabled={!notificationSettings.enabled}
            />
          </View>
          
          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <View style={styles.settingInfo}>
              <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}20` }]}>
                <Bell size={20} color={colors.primary} />
              </View>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Aktualizace stavu</Text>
            </View>
            <Switch
              value={notificationSettings.statusUpdates}
              onValueChange={toggleStatusUpdates}
              trackColor={{ false: colors.border, true: `${colors.primary}80` }}
              thumbColor={notificationSettings.statusUpdates ? colors.primary : colors.textLight}
              disabled={!notificationSettings.enabled}
            />
          </View>
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text, borderBottomColor: colors.border }]}>
            Filtry typů výjezdů
          </Text>
          
          <Text style={[styles.filterDescription, { color: colors.textLight }]}>
            Vyberte typy výjezdů, o kterých chcete dostávat oznámení:
          </Text>
          
          {(['fire', 'accident', 'rescue', 'technical', 'chemical', 'other'] as EmergencyType[]).map((type) => (
            <View key={type} style={[styles.settingItem, { borderBottomColor: colors.border }]}>
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}20` }]}>
                  <Filter size={20} color={colors.primary} />
                </View>
                <Text style={[styles.settingTitle, { color: colors.text }]}>{getTypeLabel(type)}</Text>
              </View>
              <Switch
                value={notificationSettings.typeFilters.includes(type)}
                onValueChange={() => toggleTypeFilter(type)}
                trackColor={{ false: colors.border, true: `${colors.primary}80` }}
                thumbColor={notificationSettings.typeFilters.includes(type) ? colors.primary : colors.textLight}
                disabled={!notificationSettings.enabled}
              />
            </View>
          ))}
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
  filterDescription: {
    fontSize: 14,
    padding: 16,
    paddingBottom: 8,
  },
});