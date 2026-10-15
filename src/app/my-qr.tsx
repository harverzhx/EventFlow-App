import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors, Radius } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import { BlurTargetView } from 'expo-blur';
import { router } from 'expo-router';
import { useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuroraBackground } from '@/components/aurora-background';
import { GlassSurface } from '@/components/glass-surface';
import { QrCode } from '@/components/qr-code';
import { CURRENT_USER, MOCK_EVENTS, MOCK_REGISTRATIONS } from '@/data/mock';
import { useResponsive } from '@/hooks/use-responsive';
import { useRouteGuard } from '@/hooks/use-route-guard';
import styles from '@/styles/my-qr.styles';

import Animated,
  { FadeInDown } from 'react-native-reanimated';

/** The current participant's first registration (mock). */
const MY_REGISTRATION = MOCK_REGISTRATIONS.find(
  (registration) => registration.userKey === CURRENT_USER.key
) ?? MOCK_REGISTRATIONS[0];

const MY_EVENT = MOCK_EVENTS.find((event) => event.key === MY_REGISTRATION.eventKey)!;

export default function MyQrScreen() {
  useRouteGuard('/my-qr');
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
