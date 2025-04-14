import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
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
    const [dailyStats, setDailyStats] = useState<string | number>('-');
    const [yearlyStats, setYearlyStats] = useState<string | number>('-');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await fetch('http://192.168.1.101:5000/api/statistics');
                if (!response.ok) {
                    throw new Error('Failed to fetch statistics');
                }
                const data = await response.json();
                setDailyStats(data.daily_stats || 0);
                setYearlyStats(data.yearly_stats || 0);
            } catch (error) {
                console.error('Error fetching statistics:', error);
                setDailyStats('N/A');
                setYearlyStats('N/A');
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);

    const renderValue = () => {
        if (loading) {
            return <ActivityIndicator size="small" color={color || colors.primary} />;
        }
        if (title.toLowerCase().includes('den')) { // Simple check for "daily"
            return <Text style={[styles.value, { color: color || colors.primary }]}>{dailyStats}</Text>;
        } else if (title.toLowerCase().includes('rok')) { // Simple check for "yearly"
            return <Text style={[styles.value, { color: color || colors.primary }]}>{yearlyStats}</Text>;
        }
        return <Text style={[styles.value, { color: color || colors.primary }]}>{value}</Text>;
    };
  
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
          {renderValue()}
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