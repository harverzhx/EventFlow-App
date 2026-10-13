import { Feather } from '@expo/vector-icons';
import { BlurTargetView } from 'expo-blur';
import { router } from 'expo-router';
import { useRef } from 'react';
import { Alert, Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuroraBackground } from '@/components/aurora-background';
import { GlassSurface } from '@/components/glass-surface';
import { QrCode } from '@/components/qr-code';
import { Colors, FontSize, Fonts, Radius, Spacing } from '@/constants/theme';
import { CURRENT_USER, MOCK_EVENTS, MOCK_REGISTRATIONS } from '@/data/mock';
import { useResponsive } from '@/hooks/use-responsive';

/** The current participant's first registration (mock). */
const MY_REGISTRATION = MOCK_REGISTRATIONS.find(
  (registration) => registration.userKey === CURRENT_USER.key
) ?? MOCK_REGISTRATIONS[0];

const MY_EVENT = MOCK_EVENTS.find((event) => event.key === MY_REGISTRATION.eventKey)!;

export default function MyQrScreen() {
  const blurTarget = useRef<View>(null);
  const { contentWidth, inset } = useResponsive();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <BlurTargetView ref={blurTarget} style={StyleSheet.absoluteFill}>
        <AuroraBackground intensity={0.7} />
      </BlurTargetView>

      <View style={[styles.root, { paddingHorizontal: inset }]}>
        <ScrollView
          style={[styles.shell, { width: contentWidth }]}
          contentContainerStyle={styles.shellContent}
          showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(520)} style={styles.header}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={8}
              style={styles.backButton}
              onPress={() => router.back()}>
              <Feather name="chevron-left" size={22} color={Colors.navy} />
            </Pressable>

            <View style={styles.headerText}>
              <Text style={styles.eyebrow}>EVENTFLOW</Text>
              <Text style={styles.title}>My QR Code</Text>
              <Text style={styles.subtitle}>Present this at the check-in table.</Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(120).duration(480)} style={styles.qrWrap}>
            <GlassSurface
              style={styles.qrCard}
              borderRadius={Radius.lg}
              blurTarget={blurTarget}
              intensity={40}
              overlayColor="rgba(255, 255, 255, 0.85)"
              tintColor="rgba(255, 255, 255, 0.85)">
              <QrCode value={MY_REGISTRATION.qrCode} size={220} />

              <View style={styles.qrInfo}>
                <Text style={styles.qrCode}>{MY_REGISTRATION.qrCode}</Text>
                <Text style={styles.qrName}>{MY_REGISTRATION.name}</Text>
              </View>

              <View style={styles.eventPill}>
                <Feather name="calendar" size={14} color={Colors.primary} />
                <Text style={styles.eventPillText} numberOfLines={1}>
                  {MY_EVENT.title}
                </Text>
              </View>
            </GlassSurface>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(240).duration(480)} style={styles.hintRow}>
            <Feather name="info" size={16} color={Colors.textMuted} />
            <Text style={styles.hintText}>
              Staff will scan this code to record your attendance. (Mock QR — not scannable.)
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(320).duration(440)} style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              style={styles.shareButton}
              onPress={() => Alert.alert('Share', 'Sharing is part of the UI only for this activity.')}>
              <Feather name="share-2" size={18} color={Colors.primary} />
              <Text style={styles.shareLabel}>Share QR</Text>
            </Pressable>
          </Animated.View>

          <View style={styles.spacer} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

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
  spacer: {
    height: 120,
  },
});
