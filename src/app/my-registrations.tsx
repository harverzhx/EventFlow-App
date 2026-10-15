import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors, Radius } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import { BlurTargetView } from 'expo-blur';
import { router } from 'expo-router';
import { useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuroraBackground } from '@/components/aurora-background';
import { GlassSurface } from '@/components/glass-surface';
import { CURRENT_USER, MOCK_EVENTS, MOCK_REGISTRATIONS } from '@/data/mock';
import { useResponsive } from '@/hooks/use-responsive';
import styles from '@/styles/my-registrations.styles';

import Animated,
  { FadeInDown } from 'react-native-reanimated';

export default function MyRegistrationsScreen() {
  const blurTarget = useRef<View>(null);
  const { contentWidth, inset } = useResponsive();

  const myRegistrations = MOCK_REGISTRATIONS.filter(
    (registration) => registration.userKey === CURRENT_USER.key
  );

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
              <Text style={styles.title}>My Registrations</Text>
              <Text style={styles.subtitle}>Events you have joined</Text>
            </View>
          </Animated.View>

          <View style={styles.list}>
            {myRegistrations.length === 0 ? (
              <Animated.View entering={FadeInDown.delay(120).duration(480)}>
                <GlassSurface
                  style={styles.emptyCard}
                  borderRadius={Radius.lg}
                  blurTarget={blurTarget}
                  intensity={40}
                  overlayColor="rgba(255, 255, 255, 0.75)"
                  tintColor="rgba(255, 255, 255, 0.75)">
                  <Feather name="calendar" size={32} color={Colors.textMuted} />
                  <Text style={styles.emptyTitle}>No registrations yet</Text>
                  <Text style={styles.emptyHint}>
                    Register for an event to see it here. (Mock — no data saved.)
                  </Text>
                </GlassSurface>
              </Animated.View>
            ) : (
              myRegistrations.map((registration, index) => {
                const event = MOCK_EVENTS.find((item) => item.key === registration.eventKey)!;
                return (
                  <Animated.View
                    key={registration.key}
                    entering={FadeInDown.delay(180 + index * 60).duration(440)}>
                    <GlassSurface
                      style={styles.row}
                      borderRadius={Radius.lg}
                      blurTarget={blurTarget}
                      intensity={40}
                      overlayColor="rgba(255, 255, 255, 0.7)"
                      tintColor="rgba(255, 255, 255, 0.7)">
                      <View style={styles.dateBadge}>
                        <Text style={styles.dateDay}>{event.day}</Text>
                        <Text style={styles.dateMonth}>{event.month}</Text>
                      </View>

                      <View style={styles.rowInfo}>
                        <Text style={styles.rowName} numberOfLines={1}>
                          {event.title}
                        </Text>
                        <Text style={styles.rowMeta} numberOfLines={1}>
                          {event.time} · {event.venue}
                        </Text>
                        <Text style={styles.rowMeta} numberOfLines={1}>
                          QR: {registration.qrCode}
                        </Text>
                      </View>

                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="View QR code"
                        hitSlop={8}
                        style={styles.qrButton}
                        onPress={() => router.push('/my-qr')}>
                        <Feather name="grid" size={18} color={Colors.primary} />
                      </Pressable>
                    </GlassSurface>
                  </Animated.View>
                );
              })
            )}
          </View>

          <View style={styles.spacer} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
