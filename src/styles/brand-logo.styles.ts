import { StyleSheet } from 'react-native';

import { Colors, FontSize, Fonts, Spacing } from '@/constants/theme';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  glow: {
    position: 'absolute',
    overflow: 'hidden',
  },
  glowFill: {
    flex: 1,
    borderRadius: 999,
  },
  wordmark: {
    fontFamily: Fonts.sans,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: Colors.navy,
  },
  wordmarkAccent: {
    color: Colors.primary,
  },
  subtitle: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.md,
    lineHeight: 22,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});

export default styles;
