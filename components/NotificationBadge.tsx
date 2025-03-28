import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

interface NotificationBadgeProps {
  count: number;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({ count }) => {
  const colors = useThemeColors();
  
  if (count <= 0) return null;
  
  return (
    <View style={[styles.container, { backgroundColor: colors.secondary }]}>
      <Text style={styles.text}>
        {count > 99 ? '99+' : count}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -5,
    right: -5,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});