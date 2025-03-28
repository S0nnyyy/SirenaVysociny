import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { EmergencyCall } from '@/types/emergency';
import { useThemeColors } from '@/hooks/useThemeColors';

interface EmergencyTimelineProps {
  emergency: EmergencyCall;
}

export const EmergencyTimeline: React.FC<EmergencyTimelineProps> = ({ emergency }) => {
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
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // V reálné aplikaci bychom měli časovou osu událostí
  // Pro tuto ukázku vytvoříme jednoduchou časovou osu na základě časů vytvoření a aktualizace
  const timelineEvents = [
    {
      id: 'created',
      title: 'Výjezd nahlášen',
      time: emergency.createdAt,
      description: `Výjezd byl přijat a zaznamenán do systému.`
    },
    {
      id: 'units-assigned',
      title: 'Jednotky přiřazeny',
      time: new Date(new Date(emergency.createdAt).getTime() + 1000 * 60 * 2).toISOString(), // +2 minuty
      description: `K výjezdu bylo přiřazeno ${emergency.units.length} jednotek.`
    },
    {
      id: 'units-dispatched',
      title: 'Jednotky vyjely',
      time: new Date(new Date(emergency.createdAt).getTime() + 1000 * 60 * 5).toISOString(), // +5 minut
      description: `Jednotky vyjely k místu zásahu.`
    },
    {
      id: 'arrival',
      title: 'Příjezd na místo',
      time: new Date(new Date(emergency.createdAt).getTime() + 1000 * 60 * 15).toISOString(), // +15 minut
      description: `První jednotky dorazily na místo zásahu.`
    },
    {
      id: 'updated',
      title: 'Stav aktualizován',
      time: emergency.updatedAt,
      description: `Stav výjezdu byl aktualizován na ${emergency.status === 'active' ? 'aktivní' : emergency.status === 'completed' ? 'dokončený' : 'čekající'}.`
    }
  ];
  
  return (
    <View style={styles.container}>
      {timelineEvents.map((event, index) => (
        <View key={event.id} style={styles.timelineItem}>
          <View style={styles.timelineLeft}>
            <View style={[styles.timelineDot, { backgroundColor: colors.primary }]} />
            {index < timelineEvents.length - 1 && (
              <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />
            )}
          </View>
          
          <View style={styles.timelineContent}>
            <View style={styles.timelineHeader}>
              <Text style={[styles.timelineTitle, { color: colors.text }]}>{event.title}</Text>
              <Text style={[styles.timelineTime, { color: colors.textLight }]}>
                {formatTime(event.time)} - {formatDate(event.time)}
              </Text>
            </View>
            <Text style={[styles.timelineDescription, { color: colors.text }]}>
              {event.description}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineLeft: {
    width: 24,
    alignItems: 'center',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 4,
    marginBottom: -8,
  },
  timelineContent: {
    flex: 1,
    marginLeft: 12,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  timelineTime: {
    fontSize: 12,
  },
  timelineDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});