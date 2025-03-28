import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

interface StatisticsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
}

export const StatisticsCard: React.FC<StatisticsCardProps> = ({ 
  title, 
  value, 
  icon,
  color
}) => {
  const colors = useThemeColors();
  
  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: colors.card,
        borderLeftColor: color || colors.primary,
        shadowColor: colors.shadow
      }
    ]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textLight }]}>{title}</Text>
        <Text style={[styles.value, { color: color || colors.primary }]}>{value}</Text>
      </View>
      <View style={[
        styles.iconContainer, 
        { backgroundColor: `${color || colors.primary}20` }
      ]}>
        {icon}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});