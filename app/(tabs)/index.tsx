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
import { EmergencyCall } from '@/types/emergency';
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
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const fetchEmergencyCalls = async () => {
    setRefreshing(true);
    setError(null); // Clear any previous errors
    try {
      const response = await fetch('http://192.168.1.101:5000/api/nove-zasahy');
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      const data = await response.json();

      if (data?.nove_zasahy && Array.isArray(data.nove_zasahy) && data.nove_zasahy.length > 0) {
        const mappedCalls: EmergencyCall[] = data.nove_zasahy.map((item: any) => {
          const parsedDate = new Date(item.datum.split('.').reverse().join('-').replace(' ', 'T') + ':00');
          return {
            id: Date.now().toString() + Math.random().toString(), // Generate a unique ID
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
        const currentCalls = getFilteredEmergencyCalls();
        const newCalls = mappedCalls.filter(newCall => 
          !currentCalls.some(call => call.id === newCall.id)
        );
        if (newCalls.length > 0) {
          setEmergencyCalls([...currentCalls, ...newCalls]);
          if (appState === 'active') {
            newCalls.forEach(call => {
              Notifications.scheduleNotificationAsync({
                content: {
                  title: "Nový výjezd",
                  body: `${call.type} - ${call.location}`,
                  data: { id: call.id },
                },
                trigger: null,
              });
            });
          }
        }
      } else {
        if (!(data?.nove_zasahy && Array.isArray(data.nove_zasahy) && data.nove_zasahy.length === 0)) {
          throw new Error('Invalid data format received from the API');
        }
      }
    } catch (err: any) {
      if (err.message !== 'Invalid data format received from the API' || (data?.nove_zasahy && Array.isArray(data.nove_zasahy) && data.nove_zasahy.length !== 0)) {
      
      console.error("Error fetching emergency calls:", err);
      setError(err.message || "An error occurred while fetching data.");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(fetchEmergencyCalls, 60000); // Fetch every 60 seconds
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [getFilteredEmergencyCalls]);

  const onRefresh = useCallback(() => {
    fetchEmergencyCalls();
  }, [getFilteredEmergencyCalls]);

  useFocusEffect(
    useCallback(() => {
      const subscription = AppState.addEventListener('change', nextAppState => {
        if (appState === 'active' && nextAppState === 'background') {
          console.log("App went to background");
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
    useCallback(() => {
      const { setSelectedEmergencyId } = useEmergencyStore.getState();
      setSelectedEmergencyId(null);
    }, [])
  );

  const emergencyCalls = getFilteredEmergencyCalls();

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      {error ? (
        <Text style={styles.emptyStateText}>{error}</Text>
      ) : (
        <Text style={styles.emptyStateText}>No emergencies found.</Text>
      )}
    </View>
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
        ListEmptyComponent={renderEmptyState}
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
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
});