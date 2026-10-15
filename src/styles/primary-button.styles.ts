import { StyleSheet } from 'react-native';

import { Colors, FontSize, Fonts, Radius, Spacing } from '@/constants/theme';

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
  },
  pressable: {
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  gradient: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  label: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.md,
    lineHeight: 22,
    fontWeight: '700',
    color: Colors.white,
  },
  sheen: {
    position: 'absolute',
    top: -40,
    bottom: -40,
    left: '50%',
    width: 70,
  },
  sheenFill: {
    flex: 1,
  },
});

export default styles;
