import React from 'react';
import { StyleSheet, View, Text, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Flame, Car, Beaker, LifeBuoy, Wrench, HelpCircle, Check } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useEmergencyStore } from '@/store/emergency-store';
import { useThemeStore } from '@/store/theme-store';
import { EmergencyType } from '@/types/emergency';

export default function TypeFilterScreen() {
  const colors = useThemeColors();
  const { theme } = useThemeStore();
  const { filterSettings, updateFilterSettings } = useEmergencyStore();
  
  const getTypeIcon = (type: EmergencyType) => {
    switch (type) {
      case 'fire': return <Flame size={20} color={colors.primary} />;
      case 'accident': return <Car size={20} color={colors.primary} />;
      case 'chemical': return <Beaker size={20} color={colors.primary} />;
      case 'rescue': return <LifeBuoy size={20} color={colors.primary} />;
      case 'technical': return <Wrench size={20} color={colors.primary} />;
      default: return <HelpCircle size={20} color={colors.primary} />;
    }
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
  
  const toggleType = (type: EmergencyType) => {
    const currentTypes = [...filterSettings.emergencyTypes];
    const index = currentTypes.indexOf(type);
    
    if (index > -1) {
      // Odebrat typ
      updateFilterSettings({ 
        emergencyTypes: currentTypes.filter(t => t !== type) 
      });
    } else {
      // Přidat typ
      updateFilterSettings({ 
        emergencyTypes: [...currentTypes, type] 
      });
    }
  };
  
  const selectAllTypes = () => {
    updateFilterSettings({ 
      emergencyTypes: ['fire', 'accident', 'rescue', 'technical', 'chemical', 'other'] 
    });
  };
  
  const clearAllTypes = () => {
    updateFilterSettings({ emergencyTypes: [] });
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <Stack.Screen 
        options={{ 
          title: 'Typy výjezdů',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
        }} 
      />
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <View style={[styles.sectionHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Typy výjezdů</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: colors.primary }]}
                onPress={selectAllTypes}
              >
                <Text style={styles.actionButtonText}>Vybrat vše</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: colors.border }]}
                onPress={clearAllTypes}
              >
                <Text style={[styles.actionButtonText, { color: colors.text }]}>Zrušit vše</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {(['fire', 'accident', 'rescue', 'technical', 'chemical', 'other'] as EmergencyType[]).map((type) => (
            <TouchableOpacity 
              key={type}
              style={[styles.typeItem, { borderBottomColor: colors.border }]}
              onPress={() => toggleType(type)}
            >
              <View style={styles.typeInfo}>
                <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}20` }]}>
                  {getTypeIcon(type)}
                </View>
                <Text style={[styles.typeName, { color: colors.text }]}>{getTypeLabel(type)}</Text>
              </View>
              <View style={styles.checkboxContainer}>
                <View style={[
                  styles.checkbox, 
                  { 
                    borderColor: colors.primary,
                    backgroundColor: filterSettings.emergencyTypes.includes(type) 
                      ? colors.primary 
                      : 'transparent' 
                  }
                ]}>
                  {filterSettings.emergencyTypes.includes(type) && (
                    <Check size={16} color={colors.white} />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        <Text style={[styles.note, { color: colors.textLight }]}>
          Poznámka: Pokud není vybrán žádný typ, budou zobrazeny všechny typy výjezdů.
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
  section: {
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  typeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  typeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  typeName: {
    fontSize: 16,
  },
  checkboxContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  note: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 20,
    textAlign: 'center',
  },
});