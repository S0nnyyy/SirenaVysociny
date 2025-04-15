import React, { useCallback, useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, RefreshControl, AppState, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useThemeColors } from '@/hooks/useThemeColors';
import { EmergencyCard } from '@/components/EmergencyCard';
import { useEmergencyStore } from '@/store/emergency-store';
import { useThemeStore } from '@/store/theme-store';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function HomeScreen() {
  const [appState, setAppState] = useState(AppState.currentState);
  const colors = useThemeColors();
  const { theme } = useThemeStore();
  const getFilteredEmergencyCalls = useEmergencyStore((state) => state.getFilteredEmergencyCalls);
  const setEmergencyCalls = useEmergencyStore((state) => state.setEmergencyCalls);
  const appendEmergencyCalls = useEmergencyStore((state) => state.appendEmergencyCalls);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);

  const fetchEmergencyCalls = async (initialLoad = true) => {
    if (initialLoad) setRefreshing(true);
    else setLoadingMore(true);
    setError(null); // Vymazanie predchádzajúcich chýb
    try {
      const response = await fetch(`http://10.0.0.27:5000/api/zasahy?limit=5&offset=${offset}`);
      if (!response.ok) {
        throw new Error(`Nepodařilo se načíst data: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);

      if (data?.zasahy && Array.isArray(data.zasahy) && data.zasahy.length > 0) {
        const mappedCalls = data.zasahy.map((item: any) => {
          const parsedDate = new Date(
            item.datum_ohlaseni.split('.').reverse().join('-').replace(' ', 'T') + ':00'
          );
          return {
            id: item.id,
            date: parsedDate.toISOString(),
            status: 'Probíhá',
            type: item.typ_udalosti,
            subtype: item.podtyp_udalosti,
            region: item.okres,
            location: item.obec,
            address: item.ulice,
            note: item.poznamka,
          };
        });

        if (initialLoad) {
          setEmergencyCalls(mappedCalls);
        } else {
          appendEmergencyCalls(mappedCalls);
        }
      } else {
        if (initialLoad) {
          setEmergencyCalls([]); // Zaistenie prázdneho stavu
        }
      }
    } catch (err: any) {
      console.error('Chyba při načítání tísňových volání:', err);
      setError(err.message || 'Nastala chyba při načítání dat.');
    } finally {
      if (initialLoad) setRefreshing(false);
      else setLoadingMore(false)
    }
  };

  useEffect(() => {
    fetchEmergencyCalls(); // Počiatočné načítanie
    const intervalId = setInterval(() => fetchEmergencyCalls(true), 2000); // Načítanie každé 2 sekundy
    return () => clearInterval(intervalId); // Vyčistenie pri odmontovaní
  }, []);

  const loadMoreEmergencyCalls = () => {
    if (!loadingMore) {
      setOffset((prevOffset) => {
        const newOffset = prevOffset + 5;
        fetchEmergencyCalls(false);
        return newOffset;
      });
    }
  };

  const onRefresh = useCallback(() => {
    fetchEmergencyCalls();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const subscription = AppState.addEventListener('change', (nextAppState) => {
        if (appState === 'active' && nextAppState === 'background') {
          // Aplikace přešla do pozadí
        }

        if (appState === 'background' && nextAppState === 'active') {
          console.log('Aplikace se vrátila do popředí');
          fetchEmergencyCalls();
        }
        setAppState(nextAppState);
      });

      return () => {
        subscription.remove();
      };
    }, [appState])
  );

  const emergencyCalls = getFilteredEmergencyCalls();

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      {error ? (
        <Text style={styles.emptyStateText}>{error}</Text>
      ) : emergencyCalls.length === 0 && refreshing ? (
        <Text style={styles.emptyStateText}>Načítám...</Text>
      ) : (
        <Text style={styles.emptyStateText}>Nebyly nalezeny žádné incidenty</Text>
      )}
    </View>
  );

  const renderItem = ({ item }: { item: any }) => <EmergencyCard emergency={item} />;

  return (
    <View style={styles.container}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <FlatList
        data={emergencyCalls}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        onEndReached={loadMoreEmergencyCalls}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loadingMore ? <Text style={styles.loadingMore}>Načítám více...</Text> : null}
      />
    </View>
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
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
  loadingMore: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    padding: 10,
  },
});