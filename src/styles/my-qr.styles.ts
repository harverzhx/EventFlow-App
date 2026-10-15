import { StyleSheet } from 'react-native';

import { Colors, FontSize, Fonts, Radius, Spacing } from '@/constants/theme';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  root: {
    flex: 1,
    alignItems: 'center',
  },
  shell: {
    flex: 1,
    paddingTop: Spacing.three,
  },
  shellContent: {
    paddingBottom: Spacing.six,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  eyebrow: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.xs,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: Colors.primary,
  },
  title: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.xl,
    lineHeight: 32,
    fontWeight: '700',
    color: Colors.navy,
  },
  subtitle: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.sm,
    lineHeight: 20,
    color: Colors.textMuted,
  },
  qrWrap: {
    paddingTop: Spacing.four,
    alignItems: 'center',
  },
  qrCard: {
    padding: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
    alignSelf: 'stretch',
  },
  qrInfo: {
    alignItems: 'center',
    gap: 2,
  },
  qrCode: {
    fontFamily: Fonts.mono,
    fontSize: FontSize.md,
    lineHeight: 22,
    fontWeight: '700',
    color: Colors.navy,
  },
  qrName: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.sm,
    lineHeight: 20,
    color: Colors.textMuted,
  },
  eventPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
    backgroundColor: Colors.primaryTint,
    alignSelf: 'stretch',
  },
  eventPillText: {
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: FontSize.sm,
    lineHeight: 20,
    fontWeight: '600',
    color: Colors.primary,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingTop: Spacing.three,
  },
  hintText: {
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: FontSize.xs,
    lineHeight: 18,
    color: Colors.textMuted,
  },
  actions: {
    paddingTop: Spacing.four,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    height: 56,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryTint,
  },
  shareLabel: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.md,
    lineHeight: 22,
    fontWeight: '700',
    color: Colors.primary,
  },
  emptyCard: {
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.six,
  },
  emptyTitle: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.lg,
    lineHeight: 26,
    fontWeight: '700',
    color: Colors.navy,
  },
  emptyHint: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.sm,
    lineHeight: 20,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  spacer: {
    height: 120,
  },
});

export default styles;
