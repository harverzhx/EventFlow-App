import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors, Radius } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import { BlurTargetView } from 'expo-blur';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuroraBackground } from '@/components/aurora-background';
import { GlassSurface } from '@/components/glass-surface';
import { PrimaryButton } from '@/components/primary-button';
import {
  CURRENT_USER,
  MOCK_EVENTS,
  MOCK_REGISTRATIONS,
  ROLE_LABEL,
  type MockRegistration
} from '@/data/mock';
import { useResponsive } from '@/hooks/use-responsive';
import styles from '@/styles/scan-qr.styles';

import Animated,
  { FadeInDown } from 'react-native-reanimated';

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
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
