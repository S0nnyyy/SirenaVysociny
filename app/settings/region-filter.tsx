import React, { useState } from 'react';
import { StyleSheet, View, Text, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { MapPin, Check } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useEmergencyStore } from '@/store/emergency-store';
import { useThemeStore } from '@/store/theme-store';
import { REGIONS, DISTRICTS, STATIONS } from '@/mocks/regions';

export default function RegionFilterScreen() {
  const colors = useThemeColors();
  const { theme } = useThemeStore();
  const { filterSettings, updateFilterSettings } = useEmergencyStore();
  
  const [selectedRegion, setSelectedRegion] = useState<string | null>(
    filterSettings.regions.length > 0 ? filterSettings.regions[0] : null
  );
  
  const toggleDistrict = (district: string) => {
    const currentDistricts = [...filterSettings.districts];
    const index = currentDistricts.indexOf(district);
    
    if (index > -1) {
      // Odebrat okres
      const newDistricts = currentDistricts.filter(d => d !== district);
      
      // Odebrat také všechny stanice v tomto okrese
      const districtStations = STATIONS[selectedRegion || 'Kraj Vysočina'][district] || [];
      const newStations = filterSettings.stations.filter(s => !districtStations.includes(s));
      
      updateFilterSettings({ 
        districts: newDistricts,
        stations: newStations
      });
    } else {
      // Přidat okres
      updateFilterSettings({ 
        districts: [...currentDistricts, district] 
      });
    }
  };
  
  const toggleStation = (station: string) => {
    const currentStations = [...filterSettings.stations];
    const index = currentStations.indexOf(station);
    
    if (index > -1) {
      // Odebrat stanici
      updateFilterSettings({ 
        stations: currentStations.filter(s => s !== station) 
      });
    } else {
      // Přidat stanici
      updateFilterSettings({ 
        stations: [...currentStations, station] 
      });
    }
  };
  
  const selectAllDistricts = () => {
    if (!selectedRegion) return;
    
    const allDistricts = DISTRICTS[selectedRegion];
    updateFilterSettings({ districts: allDistricts });
  };
  
  const clearAllDistricts = () => {
    updateFilterSettings({ 
      districts: [],
      stations: []
    });
  };
  
  const selectAllStations = (district: string) => {
    if (!selectedRegion) return;
    
    const districtStations = STATIONS[selectedRegion][district] || [];
    const currentStations = [...filterSettings.stations];
    
    // Přidat všechny stanice z okresu, které ještě nejsou vybrané
    const newStations = [...new Set([...currentStations, ...districtStations])];
    
    updateFilterSettings({ stations: newStations });
  };
  
  const clearAllStations = (district: string) => {
    if (!selectedRegion) return;
    
    const districtStations = STATIONS[selectedRegion][district] || [];
    const newStations = filterSettings.stations.filter(s => !districtStations.includes(s));
    
    updateFilterSettings({ stations: newStations });
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <Stack.Screen 
        options={{ 
          title: 'Filtry regionů',
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
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Kraj</Text>
          </View>
          
          {REGIONS.map((region) => (
            <TouchableOpacity 
              key={region}
              style={[styles.regionItem, { borderBottomColor: colors.border }]}
              onPress={() => {
                if (selectedRegion === region) {
                  setSelectedRegion(null);
                  updateFilterSettings({ regions: [] });
                } else {
                  setSelectedRegion(region);
                  updateFilterSettings({ regions: [region] });
                }
              }}
            >
              <View style={styles.regionInfo}>
                <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}20` }]}>
                  <MapPin size={20} color={colors.primary} />
                </View>
                <Text style={[styles.regionName, { color: colors.text }]}>{region}</Text>
              </View>
              {selectedRegion === region && (
                <Check size={20} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
        
        {selectedRegion && (
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <View style={[styles.sectionHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Okresy</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: colors.primary }]}
                  onPress={selectAllDistricts}
                >
                  <Text style={styles.actionButtonText}>Vybrat vše</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: colors.border }]}
                  onPress={clearAllDistricts}
                >
                  <Text style={[styles.actionButtonText, { color: colors.text }]}>Zrušit vše</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {DISTRICTS[selectedRegion].map((district) => (
              <View key={district}>
                <TouchableOpacity 
                  style={[styles.districtItem, { borderBottomColor: colors.border }]}
                  onPress={() => toggleDistrict(district)}
                >
                  <View style={styles.districtInfo}>
                    <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}20` }]}>
                      <MapPin size={20} color={colors.primary} />
                    </View>
                    <Text style={[styles.districtName, { color: colors.text }]}>{district}</Text>
                  </View>
                  <View style={styles.checkboxContainer}>
                    <View style={[
                      styles.checkbox, 
                      { 
                        borderColor: colors.primary,
                        backgroundColor: filterSettings.districts.includes(district) 
                          ? colors.primary 
                          : 'transparent' 
                      }
                    ]}>
                      {filterSettings.districts.includes(district) && (
                        <Check size={16} color={colors.white} />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
                
                {filterSettings.districts.includes(district) && (
                  <View style={[styles.stationsContainer, { backgroundColor: colors.background }]}>
                    <View style={styles.stationsHeader}>
                      <Text style={[styles.stationsTitle, { color: colors.text }]}>Stanice</Text>
                      <View style={styles.actionButtons}>
                        <TouchableOpacity 
                          style={[styles.actionButton, { backgroundColor: colors.primary }]}
                          onPress={() => selectAllStations(district)}
                        >
                          <Text style={styles.actionButtonText}>Vybrat vše</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={[styles.actionButton, { backgroundColor: colors.border }]}
                          onPress={() => clearAllStations(district)}
                        >
                          <Text style={[styles.actionButtonText, { color: colors.text }]}>Zrušit vše</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    
                    {STATIONS[selectedRegion][district].map((station) => (
                      <TouchableOpacity 
                        key={station}
                        style={[styles.stationItem, { borderBottomColor: colors.border }]}
                        onPress={() => toggleStation(station)}
                      >
                        <Text style={[styles.stationName, { color: colors.text }]}>{station}</Text>
                        <View style={styles.checkboxContainer}>
                          <View style={[
                            styles.checkbox, 
                            { 
                              borderColor: colors.primary,
                              backgroundColor: filterSettings.stations.includes(station) 
                                ? colors.primary 
                                : 'transparent' 
                            }
                          ]}>
                            {filterSettings.stations.includes(station) && (
                              <Check size={16} color={colors.white} />
                            )}
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
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
  regionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  regionInfo: {
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
  regionName: {
    fontSize: 16,
  },
  districtItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  districtInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  districtName: {
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
  stationsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  stationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stationsTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  stationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  stationName: {
    fontSize: 14,
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
});