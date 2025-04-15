import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertTriangle, Clock, Flame, Car, Beaker, LifeBuoy } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { StatisticsCard } from '@/components/StatisticsCard';
import { useEmergencyStore } from '@/store/emergency-store';
import { EmergencyType } from '@/types/emergency';
import { useThemeStore } from '@/store/theme-store';

export default function StatisticsScreen() {
  const colors = useThemeColors();
  const { theme } = useThemeStore();
  const emergencyCalls = useEmergencyStore(state => state.emergencyCalls);
  
  // Výpočet statistik
  const activeEmergencies = emergencyCalls.filter(call => call.status === 'active').length;
  const completedEmergencies = emergencyCalls.filter(call => call.status === 'completed').length;
  const pendingEmergencies = emergencyCalls.filter(call => call.status === 'pending').length;
  
  // Výpočet typů výjezdů
  const countByType = (type: EmergencyType) => {
    return emergencyCalls.filter(call => call.type === type).length;
  };
  
  const fireEmergencies = countByType('fire');
  const accidentEmergencies = countByType('accident');
  const chemicalEmergencies = countByType('chemical');
  const rescueEmergencies = countByType('rescue');
  
  // Výpočet průměrné doby odezvy (simulovaná data pro ukázku)
  const averageResponseTime = '8,5 min';
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Aktuální stav</Text>
        <View style={styles.statsRow}>
          <View style={styles.statsColumn}>
            <StatisticsCard
              title="Aktivní výjezdy"
              value={activeEmergencies}
              icon={<AlertTriangle size={24} color={colors.active} />}
              color={colors.active}
            />
          </View>
          <View style={styles.statsColumn}>
            <StatisticsCard              
              title="Prům. doba odezvy"
              value={averageResponseTime}
              icon={<Clock size={24} color={colors.primary} />}
              color={colors.primary}
            />
          </View>
        </View>
        
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Typy výjezdů</Text>
        <View style={styles.statsRow}>
          <View style={styles.statsColumn}>
            <StatisticsCard
              title="Požáry"
              value={fireEmergencies}
              icon={<Flame size={24} color="#FF6B35" />}
              color="#FF6B35"
            />
          </View>
          <View style={styles.statsColumn}>
            <StatisticsCard
              title="Nehody"
              value={accidentEmergencies}
              icon={<Car size={24} color="#4361EE" />}
              color="#4361EE"
            />
          </View>
        </View>
        
        <View style={styles.statsRow}>
          <View style={styles.statsColumn}>
            <StatisticsCard
              title="Chemické úniky"
              value={chemicalEmergencies}
              icon={<Beaker size={24} color="#7209B7" />}
              color="#7209B7"
            />
          </View>
          <View style={styles.statsColumn}>
            <StatisticsCard
              title="Záchranné akce"
              value={rescueEmergencies}
              icon={<LifeBuoy size={24} color="#4CC9F0" />}
              color="#4CC9F0"
            />
          </View>
        </View>
        
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Souhrn stavů</Text>
        <View style={styles.statsRow}>
          <View style={styles.statsColumn}>
            <StatisticsCard
              title="Dokončené"
              value={completedEmergencies}
              icon={<Clock size={24} color={colors.completed} />}
              color={colors.completed}
            />
          </View>
          <View style={styles.statsColumn}>
            <StatisticsCard
              title="Čekající"
              value={pendingEmergencies}
              icon={<Clock size={24} color={colors.pending} />}
              color={colors.pending}
            />
          </View>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 16,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  statsColumn: {
    flex: 1,
  },
});