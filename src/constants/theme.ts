import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  primary: '#0274DF',
  primaryMid: '#0F6FD0',
  primaryLight: '#1675D4',
  primaryTint: '#E8F2FE',
  navy: '#0B1F3A',
  text: '#12233D',
  textMuted: '#5A6B82',
  background: '#FFFFFF',
  surface: '#F6F9FD',
  border: '#E2E9F2',
  danger: '#CE2A1E',
  dangerLight: '#D9382B',
  dangerTint: '#FEF3F2',
  white: '#FFFFFF',
} as const;

export const Fonts = Platform.select({
  web: {
    sans: 'var(--font-display)',
    mono: 'var(--font-mono)',
  },
  default: {
    sans: undefined,
    mono: undefined,
  },
})!;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 26,
  xxl: 32,
} as const;

export const Radius = {
  sm: 10,
  md: 14,
  lg: 20,
  pill: 999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

export const Shadows = {
  card: Platform.select({
    ios: {
      shadowColor: '#0B1F3A',
      shadowOpacity: 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
    },
    android: { elevation: 2 },
    default: { boxShadow: '0 4px 14px rgba(11, 31, 58, 0.08)' },
  }),
} as const;
