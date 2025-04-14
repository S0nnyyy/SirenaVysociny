tsx
import React from 'react';
import { View, Text } from 'react-native';

const StatisticsCard: React.FC = () => {
  return (
    <View>
      <Text>Celkem zásahů: 0</Text>
      <Text>Aktivní: 0</Text>
      <Text>Čekající: 0</Text>
      <Text>Ukončené: 0</Text>
    </View>
  );
};

export default StatisticsCard;



  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  }, // Added semicolon
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: 'gray',
  },
});

export default StatisticsCard;