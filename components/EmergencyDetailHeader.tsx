import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { AlertTriangle, Clock, MapPin, Flame, Car, Beaker, LifeBuoy, Wrench, HelpCircle } from 'lucide-react-native';
import { EmergencyCall, EmergencyType } from '@/types/emergency';
import { useThemeColors } from '@/hooks/useThemeColors';
import { EmergencyStatusBadge } from './EmergencyStatusBadge';

interface EmergencyDetailHeaderProps {
  emergency: EmergencyCall;
}

export const EmergencyDetailHeader: React.FC<EmergencyDetailHeaderProps> = ({ emergency }) => {
  const colors = useThemeColors();
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('cs-CZ', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getEmergencyTypeIcon = (type: EmergencyType) => {
    switch (type) {
      case 'fire': return <Flame size={22} color={colors.primary} />;
      case 'accident': return <Car size={22} color={colors.primary} />;
      case 'chemical': return <Beaker size={22} color={colors.primary} />;
      case 'rescue': return <LifeBuoy size={22} color={colors.primary} />;
      case 'technical': return <Wrench size={22} color={colors.primary} />;
      default: return <HelpCircle size={22} color={colors.primary} />;
    }
  };

  const getEmergencyTypeText = (type: EmergencyType) => {
    switch (type) {
      case 'fire': return 'Požár';
      case 'accident': return 'Nehoda';
      case 'chemical': return 'Chemický únik';
      case 'rescue': return 'Záchrana';
      case 'technical': return 'Technická pomoc';
      default: return 'Ostatní';
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          {getEmergencyTypeIcon(emergency.type)}
          <Text style={[styles.title, { color: colors.text }]}>{emergency.title}</Text>
        </View>
        <EmergencyStatusBadge status={emergency.status} size="large" />
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <MapPin size={18} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.text }]}>{emergency.location}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Clock size={18} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.text }]}>
            {formatTime(emergency.createdAt)} · {formatDate(emergency.createdAt)}
          </Text>
        </View>
        
        <View style={styles.infoItem}>
          <AlertTriangle size={18} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.text }]}>
            {getEmergencyTypeText(emergency.type)} · 
            Priorita {emergency.priority}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginLeft: 8,
  },
  infoContainer: {
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    marginLeft: 8,
  },
});