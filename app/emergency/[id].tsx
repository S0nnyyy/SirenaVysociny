import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, Dimensions } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';
import { useEmergencyStore } from '@/store/emergency-store';
import { EmergencyDetailHeader } from '@/components/EmergencyDetailHeader';
import { EmergencyDetailSection } from '@/components/EmergencyDetailSection';
import { UnitsList } from '@/components/UnitsList';
import { EmergencyTimeline } from '@/components/EmergencyTimeline';
import { useThemeColors } from '@/hooks/useThemeColors';

const { width } = Dimensions.get('window');

export default function EmergencyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useThemeColors();
  const { getEmergencyById, setSelectedEmergencyId } = useEmergencyStore();
  
  const emergency = getEmergencyById(id);
  
  useEffect(() => {
    if (id) {
      setSelectedEmergencyId(id);
    }
    
    return () => {
      setSelectedEmergencyId(null);
    };
  }, [id]);
  
  if (!emergency) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Detail výjezdu' }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Výjezd nebyl nalezen</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <Stack.Screen 
        options={{ 
          title: 'Detail výjezdu',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
        }} 
      />
      <StatusBar style="light" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <EmergencyDetailHeader emergency={emergency} />
        
        <View style={styles.content}>
          {/* Fotografie výjezdu */}
          <EmergencyDetailSection title="Fotografie">
            <View style={[styles.photoContainer, { backgroundColor: colors.border }]}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1599171041466-8a2f6c1aab4c?q=80&w=1000&auto=format&fit=crop' }}
                style={styles.photo}
                resizeMode="cover"
              />
            </View>
          </EmergencyDetailSection>
          
          {/* Mapa s lokací */}
          <EmergencyDetailSection title="Lokace">
            <View style={styles.mapContainer}>
              {emergency.coordinates ? (
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?q=80&w=1000&auto=format&fit=crop' }}
                  style={styles.map}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.mapPlaceholder, { backgroundColor: colors.border }]}>
                  <MapPin size={32} color={colors.primary} />
                  <Text style={[styles.mapText, { color: colors.text }]}>
                    {emergency.location}
                  </Text>
                </View>
              )}
            </View>
          </EmergencyDetailSection>
          
          <EmergencyDetailSection title="Popis">
            <Text style={[styles.descriptionText, { color: colors.text }]}>
              {emergency.description}
            </Text>
          </EmergencyDetailSection>
          
          <EmergencyDetailSection title="Přiřazené jednotky">
            <UnitsList units={emergency.units} />
          </EmergencyDetailSection>
          
          <EmergencyDetailSection title="Časová osa">
            <EmergencyTimeline emergency={emergency} />
          </EmergencyDetailSection>
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
    flexGrow: 1,
  },
  content: {
    padding: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  photoContainer: {
    height: 200,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  mapContainer: {
    height: 180,
    borderRadius: 8,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapPlaceholder: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  mapText: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  coordinatesText: {
    fontSize: 14,
    marginTop: 4,
  },
});