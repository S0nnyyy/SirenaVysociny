export type EmergencyStatus = 'active' | 'completed' | 'pending';

export type EmergencyType = 
  | 'fire' 
  | 'accident' 
  | 'rescue' 
  | 'technical' 
  | 'chemical' 
  | 'other';

export interface EmergencyCall {
  id: string;
  title: string;
  description: string;
  location: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  type: EmergencyType;
  status: EmergencyStatus;
  createdAt: string;
  updatedAt: string;
  units: string[];
  priority: 1 | 2 | 3; // 1 = highest, 3 = lowest
  region?: string; // Kraj
  district?: string; // Okres
  station?: string; // Stanice
}

export type ShiftType = 'A' | 'B' | 'C';

export interface ShiftDay {
  date: string; // ISO date string
  shift: ShiftType;
}

export interface FilterSettings {
  regions: string[];
  districts: string[];
  stations: string[];
  emergencyTypes: EmergencyType[];
  showActive: boolean;
  showCompleted: boolean;
  showPending: boolean;
}

export interface NotificationSettings {
  enabled: boolean;
  emergencyAlerts: boolean;
  statusUpdates: boolean;
  regionFilters: string[];
  districtFilters: string[];
  stationFilters: string[];
  typeFilters: EmergencyType[];
}