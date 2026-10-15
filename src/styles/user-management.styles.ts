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
  noteWrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
    paddingTop: Spacing.three,
    paddingHorizontal: Spacing.four,
  },
  noteText: {
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: FontSize.sm,
    lineHeight: 20,
    color: Colors.textMuted,
  },
  list: {
    paddingTop: Spacing.three,
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryTint,
  },
  avatarText: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.sm,
    lineHeight: 20,
    fontWeight: '700',
    color: Colors.primary,
  },
  rowInfo: {
    flex: 1,
    gap: 2,
  },
  rowName: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.md,
    lineHeight: 22,
    fontWeight: '700',
    color: Colors.navy,
  },
  rowMeta: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.xs,
    lineHeight: 18,
    color: Colors.textMuted,
  },
  roleBadge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.sm,
  },
  roleBadgeText: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.xs,
    lineHeight: 16,
    fontWeight: '700',
  },
  switchButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryTint,
  },
  spacer: {
    height: 120,
  },
});

export default styles;
