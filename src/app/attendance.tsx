import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors, Radius } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import { BlurTargetView } from 'expo-blur';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuroraBackground } from '@/components/aurora-background';
import { GlassSurface } from '@/components/glass-surface';
import { PrimaryButton } from '@/components/primary-button';
import { useEvents } from '@/context/events';
import { useRegistrations } from '@/context/registrations';
import { useResponsive } from '@/hooks/use-responsive';
import { useRouteGuard } from '@/hooks/use-route-guard';
import styles from '@/styles/attendance.styles';

import Animated,
  { FadeInDown } from 'react-native-reanimated';

export default function AttendanceScreen() {
  useRouteGuard('/attendance');
  const { events } = useEvents();
  const { registrationsForEvent } = useRegistrations();
  const blurTarget = useRef<View>(null);
  const { contentWidth, inset } = useResponsive();

  const [eventKey, setEventKey] = useState(events[0]?.key ?? '');
  const registrations = registrationsForEvent(eventKey);
  const attended = registrations.filter((reg) => reg.attended).length;

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
              <Text style={styles.title}>Attendance</Text>
              <Text style={styles.subtitle}>Check-in records</Text>
            </View>
          </Animated.View>

          {/* Event selector */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.selector}
            contentContainerStyle={styles.selectorContent}>
            {events.map((item) => {
              const selected = item.key === eventKey;
              return (
                <Pressable
                  key={item.key}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${item.title}`}
                  onPress={() => setEventKey(item.key)}
                  style={[styles.chip, selected && styles.chipSelected]}>
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                    {item.title}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Stats */}
          <Animated.View entering={FadeInDown.delay(120).duration(480)} style={styles.statsRow}>
            <GlassSurface
              style={styles.statCard}
              borderRadius={Radius.lg}
              blurTarget={blurTarget}
              intensity={40}
              overlayColor="rgba(255, 255, 255, 0.75)"
              tintColor="rgba(255, 255, 255, 0.75)">
              <Feather name="users" size={18} color={Colors.primary} />
              <Text style={styles.statValue}>{registrations.length}</Text>
              <Text style={styles.statLabel}>Registered</Text>
            </GlassSurface>

            <GlassSurface
              style={styles.statCard}
              borderRadius={Radius.lg}
              blurTarget={blurTarget}
              intensity={40}
              overlayColor="rgba(255, 255, 255, 0.75)"
              tintColor="rgba(255, 255, 255, 0.75)">
              <Feather name="check-square" size={18} color={Colors.primary} />
              <Text style={styles.statValue}>{attended}</Text>
              <Text style={styles.statLabel}>Present</Text>
            </GlassSurface>

            <GlassSurface
              style={styles.statCard}
              borderRadius={Radius.lg}
              blurTarget={blurTarget}
              intensity={40}
              overlayColor="rgba(255, 255, 255, 0.75)"
              tintColor="rgba(255, 255, 255, 0.75)">
              <Feather name="x-square" size={18} color={Colors.textMuted} />
              <Text style={styles.statValue}>{registrations.length - attended}</Text>
              <Text style={styles.statLabel}>Absent</Text>
            </GlassSurface>
          </Animated.View>

          {/* Records */}
          <View style={styles.list}>
            {registrations.length === 0 ? (
              <View style={styles.empty}>
                <Feather name="check-square" size={40} color={Colors.textMuted} />
                <Text style={styles.emptyTitle}>No attendance records</Text>
                <Text style={styles.emptyText}>
                  Participants will appear here once they register for this event.
                </Text>
              </View>
            ) : (
              registrations.map((reg, index) => (
                <Animated.View
                  key={reg.key}
                  entering={FadeInDown.delay(180 + index * 60).duration(440)}>
                  <GlassSurface
                    style={styles.row}
                    borderRadius={Radius.lg}
                    blurTarget={blurTarget}
                    intensity={40}
                    overlayColor="rgba(255, 255, 255, 0.7)"
                    tintColor="rgba(255, 255, 255, 0.7">
                    <View style={styles.avatarBadge}>
                      <Feather name="user" size={20} color={Colors.primary} />
                    </View>

                    <View style={styles.rowInfo}>
                      <Text style={styles.rowName} numberOfLines={1}>
                        {reg.name}
                      </Text>
                      <Text style={styles.rowMeta} numberOfLines={1}>
                        {reg.qrCode}
                      </Text>
                    </View>

                    <View style={[styles.badge, reg.attended ? styles.badgeOn : styles.badgeOff]}>
                      <Feather
                        name={reg.attended ? 'check' : 'x'}
                        size={12}
                        color={reg.attended ? Colors.primary : Colors.textMuted}
                      />
                      <Text style={[styles.badgeText, reg.attended ? styles.badgeTextOn : styles.badgeTextOff]}>
                        {reg.attended ? 'Present' : 'Absent'}
                      </Text>
                    </View>
                  </GlassSurface>
                </Animated.View>
              ))
            )}
          </View>

          <Animated.View entering={FadeInDown.delay(320).duration(440)} style={styles.actions}>
            <PrimaryButton
              label="Scan Next Participant"
              icon="maximize"
              onPress={() => router.push('/scan-qr')}
            />
          </Animated.View>

          <View style={styles.spacer} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
