import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EmergencyCall, ShiftDay, FilterSettings, NotificationSettings } from '@/types/emergency';
import { EMERGENCY_CALLS } from '@/mocks/emergency-calls';
import { SHIFTS } from '@/mocks/shifts';

interface EmergencyState {
  emergencyCalls: EmergencyCall[];
  shifts: ShiftDay[];
  selectedEmergencyId: string | null;
  notifications: { id: string; read: boolean }[];
  filterSettings: FilterSettings;
  notificationSettings: NotificationSettings;
  
  // Actions
  setSelectedEmergencyId: (id: string | null) => void;
  addEmergencyCall: (call: EmergencyCall) => void;
  updateEmergencyCall: (id: string, updates: Partial<EmergencyCall>) => void;
  markNotificationAsRead: (id: string) => void;
  getUnreadNotificationsCount: () => number;
  getEmergencyById: (id: string) => EmergencyCall | undefined;
  updateFilterSettings: (settings: Partial<FilterSettings>) => void;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  getFilteredEmergencyCalls: () => EmergencyCall[];
}

export const useEmergencyStore = create<EmergencyState>()(
  persist(
    (set, get) => ({
      emergencyCalls: EMERGENCY_CALLS,
      shifts: SHIFTS,
      selectedEmergencyId: null,
      notifications: EMERGENCY_CALLS.map(call => ({ id: call.id, read: false })),
      
      filterSettings: {
        regions: [],
        districts: [],
        stations: [],
        emergencyTypes: [],
        showActive: true,
        showCompleted: true,
        showPending: true
      },
      
      notificationSettings: {
        enabled: true,
        emergencyAlerts: true,
        statusUpdates: true,
        regionFilters: [],
        districtFilters: [],
        stationFilters: [],
        typeFilters: []
      },
      
      setSelectedEmergencyId: (id) => set({ selectedEmergencyId: id }),
      
      addEmergencyCall: (call) => set(state => ({
        emergencyCalls: [call, ...state.emergencyCalls],
        notifications: [{ id: call.id, read: false }, ...state.notifications]
      })),
      
      updateEmergencyCall: (id, updates) => set(state => ({
        emergencyCalls: state.emergencyCalls.map(call => 
          call.id === id ? { ...call, ...updates, updatedAt: new Date().toISOString() } : call
        )
      })),
      
      markNotificationAsRead: (id) => set(state => ({
        notifications: state.notifications.map(notification => 
          notification.id === id ? { ...notification, read: true } : notification
        )
      })),
      
      getUnreadNotificationsCount: () => {
        const { notifications } = get();
        return notifications.filter(notification => !notification.read).length;
      },
      
      getEmergencyById: (id) => {
        const { emergencyCalls } = get();
        return emergencyCalls.find(call => call.id === id);
      },
      
      updateFilterSettings: (settings) => set(state => ({
        filterSettings: { ...state.filterSettings, ...settings }
      })),
      
      updateNotificationSettings: (settings) => set(state => ({
        notificationSettings: { ...state.notificationSettings, ...settings }
      })),
      
      getFilteredEmergencyCalls: () => {
        const { emergencyCalls, filterSettings } = get();
        
        return emergencyCalls.filter(call => {
          // Filtrování podle stavu
          if (call.status === 'active' && !filterSettings.showActive) return false;
          if (call.status === 'completed' && !filterSettings.showCompleted) return false;
          if (call.status === 'pending' && !filterSettings.showPending) return false;
          
          // Filtrování podle typu výjezdu
          if (filterSettings.emergencyTypes.length > 0 && 
              !filterSettings.emergencyTypes.includes(call.type)) return false;
          
          // Filtrování podle kraje
          if (filterSettings.regions.length > 0 && 
              call.region && 
              !filterSettings.regions.includes(call.region)) return false;
          
          // Filtrování podle okresu
          if (filterSettings.districts.length > 0 && 
              call.district && 
              !filterSettings.districts.includes(call.district)) return false;
          
          // Filtrování podle stanice
          if (filterSettings.stations.length > 0 && 
              call.station && 
              !filterSettings.stations.includes(call.station)) return false;
          
          return true;
        });
      }
    }),
    {
      name: 'emergency-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);