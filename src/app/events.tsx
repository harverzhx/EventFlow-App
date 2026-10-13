import { Feather } from '@expo/vector-icons';
import { BlurTargetView } from 'expo-blur';
import { router } from 'expo-router';
import { useRef } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedPressable } from '@/components/animated-pressable';
import { AuroraBackground } from '@/components/aurora-background';
import { BottomNav } from '@/components/bottom-nav';
import { GlassSurface } from '@/components/glass-surface';
import { Colors, FontSize, Fonts, Radius, Spacing } from '@/constants/theme';
import { CURRENT_USER, MOCK_EVENTS } from '@/data/mock';
import { useResponsive } from '@/hooks/use-responsive';

const EVENTS = MOCK_EVENTS;

export default function EventsScreen() {
  const blurTarget = useRef<View>(null);
  const { contentWidth, inset } = useResponsive();

  function handleEventPress(eventKey: string, title: string) {
    Alert.alert(title, 'Event details are part of the UI only for this activity.');
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <BlurTargetView ref={blurTarget} style={StyleSheet.absoluteFill}>
        <AuroraBackground intensity={0.7} />
      </BlurTargetView>

      <View style={[styles.root, { paddingHorizontal: inset }]}>
        <View style={[styles.shell, { width: contentWidth }]}>
          {/* Header: back button + title */}
          <Animated.View entering={FadeInDown.duration(520)} style={styles.headerBar}>
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
              <Text style={styles.title}>Events</Text>
              <Text style={styles.subtitle}>Browse your scheduled events.</Text>
            </View>
            {CURRENT_USER.role === 'admin' ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Create event"
                hitSlop={8}
                style={styles.createButton}
                onPress={() => router.push('/create-event')}>
                <Feather name="plus" size={20} color={Colors.white} />
              </Pressable>
            ) : null}
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(120).duration(480)}
            style={styles.section}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            <Text style={styles.sectionHint}>All scheduled events at a glance.</Text>
          </Animated.View>

          <View style={styles.eventList}>
            {EVENTS.map((event, index) => (
              <AnimatedPressable
                key={event.key}
                entering={FadeInDown.delay(180 + index * 70).duration(460)}
                onPress={() => handleEventPress(event.key, event.title)}>
                <GlassSurface
                  style={styles.eventRow}
                  borderRadius={Radius.lg}
                  blurTarget={blurTarget}
                  intensity={40}
                  overlayColor="rgba(255, 255, 255, 0.7)"
                  tintColor="rgba(255, 255, 255, 0.7)"
                  isInteractive>
                  <View style={styles.dateBadge}>
                    <Text style={styles.dateDay}>{event.day}</Text>
                    <Text style={styles.dateMonth}>{event.month}</Text>
                  </View>

                  <View style={styles.eventInfo}>
                    <Text style={styles.eventTitle} numberOfLines={1}>
                      {event.title}
                    </Text>
                    <Text style={styles.eventMeta} numberOfLines={1}>
                      {event.time} · {event.venue}
                    </Text>
                    <Text style={styles.eventMeta} numberOfLines={1}>
                      {event.registered}/{event.capacity} registered
                    </Text>
                  </View>

                  <Feather name="chevron-right" size={18} color={Colors.textMuted} />
                </GlassSurface>
              </AnimatedPressable>
            ))}
          </View>

          <View style={styles.spacer} />
        </View>
      </View>

      <BottomNav activeKey="events" blurTargetRef={blurTarget} />
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
  headerBar: {
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
  createButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
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
    color: 'rgba(255, 255, 255, 0.75)',
  },
  title: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.xxl,
    lineHeight: 38,
    fontWeight: '700',
    color: Colors.white,
  },
  subtitle: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.sm,
    lineHeight: 20,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  section: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.three,
    gap: Spacing.one,
  },
  sectionTitle: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.lg,
    lineHeight: 26,
    fontWeight: '700',
    color: Colors.navy,
  },
  sectionHint: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.sm,
    lineHeight: 20,
    color: Colors.textMuted,
  },
  eventList: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
  },
  dateBadge: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    backgroundColor: Colors.primaryTint,
  },
  dateDay: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.lg,
    lineHeight: 22,
    fontWeight: '700',
    color: Colors.primary,
  },
  dateMonth: {
    fontFamily: Fonts.sans,
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: Colors.primary,
  },
  eventInfo: {
    flex: 1,
    gap: 2,
  },
  eventTitle: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.md,
    lineHeight: 22,
    fontWeight: '700',
    color: Colors.navy,
  },
  eventMeta: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.xs,
    lineHeight: 18,
    color: Colors.textMuted,
  },
  spacer: {
    height: 120,
  },
});