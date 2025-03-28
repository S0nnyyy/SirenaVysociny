import React, { useMemo } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useEmergencyStore } from '@/store/emergency-store';
import { ShiftType } from '@/types/emergency';

export const ShiftCalendar: React.FC = () => {
  const colors = useThemeColors();
  const { shifts } = useEmergencyStore();
  
  const getShiftColor = (shift: ShiftType) => {
    switch (shift) {
      case 'A': return colors.shiftA;
      case 'B': return colors.shiftB;
      case 'C': return colors.shiftC;
      default: return colors.white;
    }
  };
  
  const getShiftTextColor = (shift: ShiftType) => {
    // Pro světlý režim je C bílá, takže text musí být tmavý
    // Pro tmavý režim je C tmavá, takže text musí být světlý
    if (shift === 'C') {
      return colors === COLORS.light ? colors.text : colors.text;
    }
    return colors.white;
  };
  
  const visibleShifts = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Získat směny pro dnešek a 14 dní dopředu
    return shifts.filter(shift => {
      const shiftDate = new Date(shift.date);
      const diffTime = shiftDate.getTime() - today.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      return diffDays >= 0 && diffDays <= 14;
    });
  }, [shifts]);
  
  const isToday = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const shiftDate = new Date(dateString);
    shiftDate.setHours(0, 0, 0, 0);
    return today.getTime() === shiftDate.getTime();
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.getDate().toString();
  };
  
  const formatDayName = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'];
    return days[date.getDay()];
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.white }]}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={50} // Přidáno pro lepší scrollování na Androidu
        decelerationRate="fast" // Přidáno pro lepší scrollování na Androidu
      >
        {visibleShifts.map((shiftDay) => (
          <View 
            key={shiftDay.date} 
            style={[
              styles.dayContainer,
              isToday(shiftDay.date) && [styles.todayContainer, { backgroundColor: colors.primary }]
            ]}
          >
            <View 
              style={[
                styles.shiftIndicator, 
                { backgroundColor: getShiftColor(shiftDay.shift) },
                isToday(shiftDay.date) && styles.todayShiftIndicator
              ]}
            >
              <Text style={[styles.shiftText, { color: getShiftTextColor(shiftDay.shift) }]}>
                {shiftDay.shift}
              </Text>
            </View>
            <Text style={[
              styles.dateText, 
              { color: colors.text },
              isToday(shiftDay.date) && { color: colors.white }
            ]}>
              {formatDate(shiftDay.date)}
            </Text>
            <Text style={[
              styles.dayText, 
              { color: colors.textLight },
              isToday(shiftDay.date) && { color: colors.white }
            ]}>
              {formatDayName(shiftDay.date)}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

import { COLORS } from '@/constants/colors';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginTop: 8, // Add some margin at the top
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingRight: 32, // Přidáno více prostoru na konci pro Android
  },
  dayContainer: {
    alignItems: 'center',
    marginRight: 12,
    width: 50,
    paddingVertical: 4,
  },
  todayContainer: {
    borderRadius: 8,
    paddingVertical: 4,
  },
  shiftIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  todayShiftIndicator: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  shiftText: {
    fontWeight: '700',
    fontSize: 14,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
  },
  dayText: {
    fontSize: 12,
  },
});