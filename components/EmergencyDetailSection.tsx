import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

interface EmergencyDetailSectionProps {
  title: string;
  children: React.ReactNode;
}

export const EmergencyDetailSection: React.FC<EmergencyDetailSectionProps> = ({ 
  title, 
  children 
}) => {
  const colors = useThemeColors();
  
  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: colors.card,
        shadowColor: colors.shadow
      }
    ]}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  content: {
    // Styly obsahu budou řešeny v dětech
  },
});