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
  MOCK_EVENTS,
  ROLE_LABEL,
  type MockRegistration
} from '@/data/mock';
import { useRegistrations } from '@/context/registrations';
import { useDemoSession } from '@/context/demo-session';
import { useResponsive } from '@/hooks/use-responsive';
import { useRouteGuard } from '@/hooks/use-route-guard';
import styles from '@/styles/scan-qr.styles';

import Animated,
  { FadeInDown } from 'react-native-reanimated';

type ScanState = 'idle' | 'scanning' | 'verified' | 'invalid' | 'checked-in';

export default function ScanQrScreen() {
  useRouteGuard('/scan-qr');
  const { registrations, markAttended } = useRegistrations();
  const { user } = useDemoSession();
  const blurTarget = useRef<View>(null);
  const { contentWidth, inset } = useResponsive();

  const [state, setState] = useState<ScanState>('idle');
  const [scanned, setScanned] = useState<MockRegistration | null>(null);

  function handleScan() {
    setState('scanning');

    // Simulated: pick the next not-yet-checked-in registration (mock only)
    setTimeout(() => {
      const next = registrations.find((registration) => !registration.attended) ?? null;
      if (next) {
        setScanned(next);
        setState('verified');
      } else {
        setScanned(null);
        setState('invalid');
      }
    }, 800);
  }

  function handleMarkPresent() {
    if (!scanned) return;
    markAttended(scanned.qrCode);
    Alert.alert(
      'Attendance recorded',
      `${scanned.name} has been marked present. (Prototype — in-memory only.)`
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
              <Text style={styles.subtitle}>{user ? ROLE_LABEL[user.role] : 'Demo'}</Text>
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

          {/* Invalid result — everyone already checked in */}
          {state === 'invalid' ? (
            <Animated.View entering={FadeInDown.delay(240).duration(440)}>
              <GlassSurface
                style={styles.resultCard}
                borderRadius={Radius.lg}
                blurTarget={blurTarget}
                intensity={40}
                overlayColor="rgba(255, 255, 255, 0.75)"
                tintColor="rgba(255, 255, 255, 0.75">
                <View style={styles.verifiedRow}>
                  <View style={[styles.verifiedIcon, styles.verifiedIconOff]}>
                    <Feather name="alert-circle" size={22} color={Colors.textMuted} />
                  </View>
                  <View style={styles.verifiedText}>
                    <Text style={styles.verifiedLabel}>All checked in</Text>
                    <Text style={styles.verifiedName}>No pending registrations</Text>
                  </View>
                </View>
                <View style={styles.divider} />
                <Text style={styles.invalidNote}>
                  Every sample registration has already been marked present. Try again after a
                  new participant registers.
                </Text>
              </GlassSurface>
            </Animated.View>
          ) : null}

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
