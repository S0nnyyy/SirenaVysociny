import React, { useCallback, useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, RefreshControl, AppState } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/useThemeColors';
import { EmergencyCard } from '@/components/EmergencyCard';
import { Text } from 'react-native';
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
  const getFilteredEmergencyCalls = useEmergencyStore(state => state.getFilteredEmergencyCalls);
  const setEmergencyCalls = useEmergencyStore(state => state.setEmergencyCalls);
  const appendEmergencyCalls = useEmergencyStore(state => state.appendEmergencyCalls);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);

  const fetchEmergencyCalls = async (initialLoad = true) => {
    if (initialLoad) setRefreshing(true);
    else setLoadingMore(true);
    setError(null); // Clear any previous errors
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/zasahy?limit=5&offset=${offset}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      const data = await response.json();

      if (data?.zasahy && Array.isArray(data.zasahy) && data.zasahy.length > 0) {
        const mappedCalls = data.zasahy.map((item: any) => {
          const parsedDate = new Date(item.datum_ohlaseni.split('.').reverse().join('-').replace(' ', 'T') + ':00'); // Append ':00' for seconds
          return {
            id: item.id,
            date: parsedDate.toISOString(),
            status: "Probíhá",
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
          setEmergencyCalls([]); // Ensure empty state is handled
        }
      }
    } catch (err: any) {
      console.error("Error fetching emergency calls:", err);
      setError(err.message || "An error occurred while fetching data.");
    } finally {
      if (initialLoad) setRefreshing(false);
      else setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchEmergencyCalls(); // Initial fetch
    const intervalId = setInterval(() => fetchEmergencyCalls(true), 60000); // Fetch every 60 seconds
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const loadMoreEmergencyCalls = () => {
    if (!loadingMore) {
      setOffset(prevOffset => {
        const newOffset = prevOffset + 5;
        fetchEmergencyCalls(false);
        return newOffset;
      });
    }
  };


  const onRefresh = useCallback(() => {
    fetchEmergencyCalls();
  }, [getFilteredEmergencyCalls]);

  useFocusEffect(
    useCallback(() => {
      const subscription = AppState.addEventListener('change', nextAppState => {
        if (appState === 'active' && nextAppState === 'background') {
          //console.log("App went to background");
        }

        if (appState === 'background' && nextAppState === 'active') {
          console.log("App came to foreground");
          fetchEmergencyCalls();
        }
        setAppState(nextAppState);
      });

      return () => {
        subscription.remove();
      };
    }, [appState, getFilteredEmergencyCalls])
  );

  const emergencyCalls = getFilteredEmergencyCalls();
  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      {error ? (
        <Text style={styles.emptyStateText}>{error}</Text>
      ) : emergencyCalls.length === 0 && refreshing ? (
        <Text style={styles.emptyStateText}>Loading...</Text>
      ) : (
        <Text style={styles.emptyStateText}>No incidents found</Text>
      )}
    </View>
  );

  const renderItem = ({ item }: { item: any }) => (
    <EmergencyCard emergency={item} />
  );

  return (
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />

      <FlatList
        data={emergencyCalls}
        renderItem={renderItem}
        keyExtractor={item => item.id}
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
        ListFooterComponent={loadingMore && <Text style={styles.loadingMore}>Loading more...</Text>}        
      />




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
  },  