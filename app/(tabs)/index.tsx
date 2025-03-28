import React, { useCallback } from 'react';
import { StyleSheet, View, FlatList, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/useThemeColors';
import { EmergencyCard } from '@/components/EmergencyCard';
import { ShiftCalendar } from '@/components/ShiftCalendar';
import { useEmergencyStore } from '@/store/emergency-store';
import { useThemeStore } from '@/store/theme-store';
import { EmergencyCall } from '@/types/emergency';

export default function HomeScreen() {
  const colors = useThemeColors();
  const { theme } = useThemeStore();
  const getFilteredEmergencyCalls = useEmergencyStore(state => state.getFilteredEmergencyCalls);
  const [refreshing, setRefreshing] = React.useState(false);
  
  // Získání filtrovaných výjezdů
  const emergencyCalls = getFilteredEmergencyCalls();
  
  // Simulace obnovení
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);
  
  // Resetování vybraného výjezdu při návratu na tuto obrazovku
  useFocusEffect(
    useCallback(() => {
      const { setSelectedEmergencyId } = useEmergencyStore.getState();
      setSelectedEmergencyId(null);
    }, [])
  );
  
  const renderItem = ({ item }: { item: EmergencyCall }) => (
    <EmergencyCard emergency={item} />
  );
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      
      <FlatList
        data={emergencyCalls}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<ShiftCalendar />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
});