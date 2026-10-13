import { Feather } from '@expo/vector-icons';
import { BlurTargetView } from 'expo-blur';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuroraBackground } from '@/components/aurora-background';
import { GlassSurface } from '@/components/glass-surface';
import { PrimaryButton } from '@/components/primary-button';
import { Colors, FontSize, Fonts, Radius, Spacing } from '@/constants/theme';
import { CURRENT_USER, MOCK_EVENTS, MOCK_REGISTRATIONS, ROLE_LABEL, type MockRegistration } from '@/data/mock';
import { useResponsive } from '@/hooks/use-responsive';

type ScanState = 'idle' | 'scanning' | 'verified';

export default function ScanQrScreen() {
  const blurTarget = useRef<View>(null);
  const { contentWidth, inset } = useResponsive();

  const [state, setState] = useState<ScanState>('idle');
  const [scanned, setScanned] = useState<MockRegistration | null>(null);

  function handleScan() {
    setState('scanning');

    // Simulated: pick the first not-yet-checked-in registration (mock only)
    setTimeout(() => {
      const next = MOCK_REGISTRATIONS.find((registration) => !registration.attended) ?? MOCK_REGISTRATIONS[0];
      setScanned(next);
      setState('verified');
    }, 800);
  }

  function handleMarkPresent() {
    if (!scanned) return;
    Alert.alert(
      'Attendance recorded',
      `${scanned.name} has been marked present. (Mock — no data was saved.)`
    );
    setScanned(null);
    setState('idle');
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <BlurTargetView ref={blurTarget} style={StyleSheet.absoluteFill}>
        <AuroraBackground intensity={0.7} />
      </BlurTargetView>

      <View style={[styles.root, { paddingHorizontal: inset }]}>
        <View style={[styles.shell, { width: contentWidth }]}>
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
              <Text style={styles.title}>Scan QR Check-in</Text>
              <Text style={styles.subtitle}>{ROLE_LABEL[CURRENT_USER.role]}</Text>
            </View>
          </Animated.View>

          {/* Mock scanner frame */}
          <Animated.View entering={FadeInDown.delay(120).duration(480)} style={styles.scannerWrap}>
            <View style={[styles.scanner, state === 'scanning' && styles.scannerActive]}>
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />

              {state === 'scanning' ? (
                <Text style={styles.scannerText}>Scanning…</Text>
              ) : (
                <Feather name="maximize" size={40} color={Colors.textMuted} />
              )}
            </View>

            {state !== 'verified' ? (
              <PrimaryButton
                label={state === 'scanning' ? 'Scanning…' : 'Simulate Scan'}
                icon="maximize"
                onPress={handleScan}
              />
            ) : null}
          </Animated.View>

          {/* Verified result */}
          {state === 'verified' && scanned ? (
            <Animated.View entering={FadeInDown.delay(240).duration(440)}>
              <GlassSurface
                style={styles.resultCard}
                borderRadius={Radius.lg}
                blurTarget={blurTarget}
                intensity={40}
                overlayColor="rgba(255, 255, 255, 0.75)"
                tintColor="rgba(255, 255, 255, 0.75)">
                <View style={styles.verifiedRow}>
                  <View style={styles.verifiedIcon}>
                    <Feather name="check-circle" size={22} color={Colors.primary} />
                  </View>
                  <View style={styles.verifiedText}>
                    <Text style={styles.verifiedLabel}>Registration verified</Text>
                    <Text style={styles.verifiedName}>{scanned.name}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>QR Code</Text>
                  <Text style={styles.metaValue}>{scanned.qrCode}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Event</Text>
                  <Text style={styles.metaValue} numberOfLines={1}>
                    {MOCK_EVENTS.find((event) => event.key === scanned.eventKey)?.title ?? '—'}
                  </Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Status</Text>
                  <Text style={[styles.metaValue, styles.metaStatus]}>Registered ✓</Text>
                </View>

                <View style={styles.resultActions}>
                  <PrimaryButton label="Mark Present" icon="check" onPress={handleMarkPresent} />
                </View>
              </GlassSurface>
            </Animated.View>
          ) : null}

          <View style={styles.spacer} />
        </View>
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
  scannerWrap: {
    paddingTop: Spacing.four,
    gap: Spacing.three,
    alignItems: 'center',
  },
  scanner: {
    width: 240,
    height: 240,
    borderRadius: Radius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  scannerActive: {
    borderColor: Colors.primary,
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: Colors.primary,
  },
  cornerTL: {
    top: 10,
    left: 10,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 8,
  },
  cornerTR: {
    top: 10,
    right: 10,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 8,
  },
  cornerBL: {
    bottom: 10,
    left: 10,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 8,
  },
  cornerBR: {
    bottom: 10,
    right: 10,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 8,
  },
  scannerText: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.md,
    lineHeight: 22,
    fontWeight: '600',
    color: Colors.primary,
  },
  resultCard: {
    marginTop: Spacing.three,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  verifiedIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryTint,
  },
  verifiedText: {
    flex: 1,
    gap: 2,
  },
  verifiedLabel: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.xs,
    lineHeight: 18,
    fontWeight: '600',
    color: Colors.primary,
    letterSpacing: 0.4,
  },
  verifiedName: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.lg,
    lineHeight: 26,
    fontWeight: '700',
    color: Colors.navy,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  metaLabel: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.sm,
    lineHeight: 20,
    color: Colors.textMuted,
  },
  metaValue: {
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: FontSize.md,
    lineHeight: 22,
    fontWeight: '600',
    color: Colors.navy,
    textAlign: 'right',
  },
  metaStatus: {
    color: Colors.primary,
  },
  resultActions: {
    paddingTop: Spacing.two,
  },
  spacer: {
    height: 120,
  },
});
