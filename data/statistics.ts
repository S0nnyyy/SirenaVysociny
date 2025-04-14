// data/statistics.ts

import { EmergencyCall } from '@/types/emergency'; // Assuming this type definition exists

export const EMERGENCY_CALLS: EmergencyCall[] = [];

if (EMERGENCY_CALLS.length === 0) {
  EMERGENCY_CALLS.push({
    id: 'placeholder',
    title: 'No data',
    description: 'No data available',
    location: 'No data',
    coordinates: {
      latitude: 0,
      longitude: 0,
    },
    type: 'placeholder',
    status: 'placeholder',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    units: [],
    priority: 0,
    region: 'No data',
    district: 'No data',
    station: 'No data',
  });
}