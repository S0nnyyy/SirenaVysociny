import { useColorScheme } from 'react-native';
import { COLORS } from '@/constants/colors';
import { useThemeStore } from '@/store/theme-store';

export function useThemeColors() {
  const systemColorScheme = useColorScheme();
  const { theme } = useThemeStore();
  
  // Use the user's preference, or fall back to system preference, or default to light
  const colorScheme = theme === 'system' ? systemColorScheme : theme;
  const isDark = colorScheme === 'dark';
  
  return isDark ? COLORS.dark : COLORS.light;
}