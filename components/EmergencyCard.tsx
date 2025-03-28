import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { AlertTriangle, Clock, MapPin, Flame, Car, Beaker, LifeBuoy, Wrench, HelpCircle } from 'lucide-react-native';
import { EmergencyCall, EmergencyType } from '@/types/emergency';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useEmergencyStore } from '@/store/emergency-store';

interface EmergencyCardProps {
  emergency: EmergencyCall;
}

export const EmergencyCard: React.FC<EmergencyCardProps> = ({ emergency }) => {
  const colors = useThemeColors();
  const router = useRouter();
  const { markNotificationAsRead } = useEmergencyStore();
  
  const handlePress = () => {
    markNotificationAsRead(emergency.id);
    router.push(`/emergency/${emergency.id}`);
  };
  
  const getStatusColor = () => {
    switch (emergency.status) {
      case 'active': return colors.active;
      case 'completed': return colors.completed;
      case 'pending': return colors.pending;
      default: return colors.textLight;
    }
  };
  
  const getPriorityLabel = () => {
    switch (emergency.priority) {
      case 1: return 'Vysoká priorita';
      case 2: return 'Střední priorita';
      case 3: return 'Nízká priorita';
      default: return 'Neznámá priorita';
    }
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getEmergencyTypeIcon = (type: EmergencyType) => {
    switch (type) {
      case 'fire': return <Flame size={20} color={colors.primary} />;
      case 'accident': return <Car size={20} color={colors.primary} />;
      case 'chemical': return <Beaker size={20} color={colors.primary} />;
      case 'rescue': return <LifeBuoy size={20} color={colors.primary} />;
      case 'technical': return <Wrench size={20} color={colors.primary} />;
      default: return <HelpCircle size={20} color={colors.primary} />;
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
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.card }]} 
      onPress={handlePress}
    >
      <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            {getEmergencyTypeIcon(emergency.type)}
            <Text style={[styles.title, { color: colors.text }]}>{emergency.title}</Text>
          </View>
          <View style={[styles.priorityBadge, { 
            backgroundColor: emergency.priority === 1 
              ? colors.active 
              : emergency.priority === 2 
                ? colors.pending 
                : colors.textLight
          }]}>
            <Text style={styles.priorityText}>{getPriorityLabel()}</Text>
          </View>
        </View>
        
        <View style={styles.locationContainer}>
          <MapPin size={16} color={colors.primary} />
          <Text style={[styles.locationText, { color: colors.textLight }]}>{emergency.location}</Text>
        </View>
        
        <Text style={[styles.description, { color: colors.text }]} numberOfLines={2}>
          {emergency.description}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.timeContainer}>
            <Clock size={14} color={colors.primary} />
            <Text style={[styles.timeText, { color: colors.textLight }]}>{formatTime(emergency.createdAt)}</Text>
          </View>
          
          <View style={styles.typeContainer}>
            <AlertTriangle size={14} color={colors.primary} />
            <Text style={[styles.typeText, { color: colors.textLight }]}>{getEmergencyTypeText(emergency.type)}</Text>
          </View>
          
          <Text style={[styles.unitsText, { color: colors.textLight }]}>
            {emergency.units.length} {emergency.units.length === 1 ? 'jednotka' : emergency.units.length >= 2 && emergency.units.length <= 4 ? 'jednotky' : 'jednotek'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  statusIndicator: {
    width: 6,
    height: '100%',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  priorityText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    marginLeft: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  timeText: {
    fontSize: 12,
    marginLeft: 4,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  typeText: {
    fontSize: 12,
    marginLeft: 4,
  },
  unitsText: {
    fontSize: 12,
  },
});