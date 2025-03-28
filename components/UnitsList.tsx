import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Truck } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

interface UnitsListProps {
  units: string[];
}

export const UnitsList: React.FC<UnitsListProps> = ({ units }) => {
  const colors = useThemeColors();
  
  if (units.length === 0) {
    return (
      <Text style={[styles.emptyText, { color: colors.textLight }]}>Žádné přiřazené jednotky</Text>
    );
  }
  
  return (
    <View style={styles.container}>
      {units.map((unit, index) => (
        <View key={index} style={[styles.unitItem, { backgroundColor: colors.background }]}>
          <Truck size={16} color={colors.primary} />
          <Text style={[styles.unitText, { color: colors.text }]}>{unit}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  unitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  unitText: {
    fontSize: 14,
    marginLeft: 8,
  },
  emptyText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
});