import { Platform } from 'react-native';

export type ThemeMode = 'light' | 'dark';

const shared = {
  primary: '#FF4FA3',
  primaryLight: '#FF7FBF',
  primaryDark: '#E03A8C',
  primaryFaded: '#FFF0F7',

  accent: '#FFD54A',
  accentLight: '#FFE680',
  accentDark: '#F5C200',
  accentFaded: '#FFFBEB',

  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  info: '#3B82F6',
  infoLight: '#DBEAFE',

  radiusSmall: 8,
  radiusMedium: 14,
  radiusLarge: 20,
  radiusFull: 999,

  fontBody: 16,
  fontSmall: 13,
  fontCaption: 11,
  fontTitle: 22,
  fontSection: 18,
  fontButton: 15,
};

export const lightTheme = {
  ...shared,
  mode: 'light' as ThemeMode,

  background: '#FFFFFF',
  backgroundSecondary: '#F7F7F7',
  surface: '#FFFFFF',
  surfaceSecondary: '#F3F4F6',
  surfaceElevated: '#FFFFFF',

  textPrimary: '#1A1A2E',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textInverse: '#FFFFFF',

  border: '#E5E7EB',
  borderLight: '#F3F4F6',

  tabBarBg: '#FFFFFF',
  headerBg: '#FFFFFF',

  shadow: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
    },
    android: { elevation: 2 },
    default: {},
  }) as any,

  shadowElevated: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
    },
    android: { elevation: 6 },
    default: {},
  }) as any,
};

export const darkTheme: typeof lightTheme = {
  ...shared,
  mode: 'dark' as ThemeMode,

  background: '#0F0F18',
  backgroundSecondary: '#161625',
  surface: '#1C1C2E',
  surfaceSecondary: '#262640',
  surfaceElevated: '#222238',

  primaryFaded: '#3D1A2E',
  accentFaded: '#332D15',
  successLight: '#0D3D2E',
  warningLight: '#3D2E0D',
  errorLight: '#3D1515',
  infoLight: '#152340',

  textPrimary: '#F3F4F6',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  textInverse: '#1A1A2E',

  border: '#2D2D45',
  borderLight: '#232338',

  tabBarBg: '#161625',
  headerBg: '#0F0F18',

  shadow: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    android: { elevation: 2 },
    default: {},
  }) as any,

  shadowElevated: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
    },
    android: { elevation: 6 },
    default: {},
  }) as any,
};

export type Theme = typeof lightTheme;

// Default export for backward compat
export const theme = lightTheme;
