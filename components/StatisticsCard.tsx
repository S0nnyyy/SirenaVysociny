import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatisticsCardProps {
  title: string;
  value: string | number;
  icon: JSX.Element;
  color: string;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({ title, value, icon, color }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        {icon}
      </View>
      <View style={styles.content}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
};
export default StatisticsCard;



const styles = StyleSheet.create({
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
      },
      container: {
        flex: 1,
        backgroundColor: '#f0f0f0', // Light background color
        borderRadius: 8,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
      },
      iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
      },
      content: {
        flex: 1,
      },
      value: {
        fontSize: 20,
        fontWeight: 'bold',
      },
      title: {
        fontSize: 14,
        color: 'gray',
      },
});