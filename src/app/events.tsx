import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors, Radius } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import { BlurTargetView } from 'expo-blur';
import { router } from 'expo-router';
import { useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AnimatedPressable } from '@/components/animated-pressable';
import { AuroraBackground } from '@/components/aurora-background';
import { BottomNav } from '@/components/bottom-nav';
import { GlassSurface } from '@/components/glass-surface';
import { useEvents } from '@/context/events';
import { useDemoSession } from '@/context/demo-session';
import { useResponsive } from '@/hooks/use-responsive';
import { useRouteGuard } from '@/hooks/use-route-guard';
import styles from '@/styles/events.styles';

import Animated,
  { FadeInDown } from 'react-native-reanimated';

export default function EventsScreen() {
  useRouteGuard('/events');
  const { events } = useEvents();
  const { role } = useDemoSession();
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
            {role === 'admin' ? (
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
            {events.length === 0 ? (
              <View style={styles.empty}>
                <Feather name="calendar" size={40} color={Colors.textMuted} />
                <Text style={styles.emptyTitle}>No events yet</Text>
                <Text style={styles.emptyText}>
                  {role === 'admin'
                    ? 'Create your first event using the + button above.'
                    : 'There are no scheduled events right now. Check back later.'}
                </Text>
              </View>
            ) : (
              events.map((event, index) => (
                <AnimatedPressable
                  key={event.key}
                  entering={FadeInDown.delay(180 + index * 70).duration(460)}
                  onPress={() =>
                    router.push({ pathname: '/event-detail', params: { eventKey: event.key } })
                  }>
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
              ))
            )}
          </View>

          <View style={styles.spacer} />
        </ScrollView>
      </View>

      <BottomNav activeKey="events" blurTargetRef={blurTarget} />
    </SafeAreaView>
  );
}
