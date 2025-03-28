import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { EmergencyStatus } from '@/types/emergency';
import { useThemeColors } from '@/hooks/useThemeColors';

interface EmergencyStatusBadgeProps {
  status: EmergencyStatus;
  size?: 'small' | 'medium' | 'large';
}

export const EmergencyStatusBadge: React.FC<EmergencyStatusBadgeProps> = ({ 
  status, 
  size = 'medium' 
}) => {
  const colors = useThemeColors();
  
  const getStatusColor = () => {
    switch (status) {
      case 'active': return colors.active;
      case 'completed': return colors.completed;
      case 'pending': return colors.pending;
      default: return colors.textLight;
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case 'active': return 'Aktivní';
      case 'completed': return 'Dokončeno';
      case 'pending': return 'Čekající';
      default: return 'Neznámý';
    }
  };
  
  const getFontSize = () => {
    switch (size) {
      case 'small': return 10;
      case 'large': return 14;
      default: return 12;
    }
  };
  
  const getPadding = () => {
    switch (size) {
      case 'small': return { paddingHorizontal: 6, paddingVertical: 2 };
      case 'large': return { paddingHorizontal: 12, paddingVertical: 6 };
      default: return { paddingHorizontal: 8, paddingVertical: 4 };
    }
  };
  
  return (
    <View style={[
      styles.container, 
      { backgroundColor: getStatusColor() },
      getPadding()
    ]}>
      <Text style={[styles.text, { fontSize: getFontSize() }]}>
        {getStatusText()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '600',
  }
});