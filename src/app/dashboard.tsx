import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors, Radius } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import { BlurTargetView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AnimatedPressable } from '@/components/animated-pressable';
import { AuroraBackground } from '@/components/aurora-background';
import { BottomNav } from '@/components/bottom-nav';
import { GlassSurface } from '@/components/glass-surface';
import { useDemoSession } from '@/context/demo-session';
import { useEvents } from '@/context/events';
import { useRegistrations } from '@/context/registrations';
import { ROLE_LABEL, quickActionsForRole } from '@/data/mock';
import { computeEventStats } from '@/utils/event-stats';
import { useResponsive } from '@/hooks/use-responsive';
import { useRouteGuard } from '@/hooks/use-route-guard';
import styles from '@/styles/dashboard.styles';

import Animated,
  { FadeInDown } from 'react-native-reanimated';

export default function DashboardScreen() {
  useRouteGuard('/dashboard');
  const { user } = useDemoSession();
  const { events } = useEvents();
  const { registrations } = useRegistrations();
  const blurTarget = useRef<View>(null);
  const { contentWidth, inset } = useResponsive();

  const activeRole = user?.role ?? 'participant';
  const displayName = user?.name.split(' ')[0] ?? 'there';
  const QUICK_ACTIONS = quickActionsForRole(activeRole);
  const UPCOMING_EVENTS = events.slice(0, 3);

  const eventStats = computeEventStats(events, registrations);

  /** Summary stats derived from live registration/check-in state (no backend). */
  const stats: { key: string; label: string; value: number; icon: 'calendar' | 'users' | 'check-square' | 'grid' }[] = [
    { key: 'events', label: 'Total Events', value: events.length, icon: 'calendar' },
    {
      key: 'registered',
      label: 'Registrations',
      value: events.reduce(
        (sum, event) => sum + (eventStats.get(event.key)?.registered ?? 0),
        0
      ),
      icon: 'users',
    },
    {
      key: 'attended',
      label: 'Attended',
      value: events.reduce(
        (sum, event) => sum + (eventStats.get(event.key)?.attended ?? 0),
        0
      ),
      icon: 'check-square',
    },
    {
      key: 'capacity',
      label: 'Total Seats',
      value: events.reduce((sum, event) => sum + event.capacity, 0),
      icon: 'grid',
    },
  ];

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
          {/* Header: greeting + avatar (taps through to the profile screen) */}
          <Animated.View entering={FadeInDown.duration(520)}>
            <LinearGradient
              colors={[Colors.primaryLight, Colors.primaryMid, Colors.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.header}>
              <View style={styles.headerRow}>
                <View style={styles.greeting}>
                  <Text style={styles.eyebrow}>EVENTFLOW</Text>
                  <Text style={styles.title}>Welcome, {displayName}!</Text>
                  <Text style={styles.subtitle}>You have {UPCOMING_EVENTS.length} upcoming events this week.</Text>
                </View>

                <AnimatedPressable
                  accessibilityLabel="View profile"
                  onPress={() => router.push('/profile')}>
                  <GlassSurface
                    style={styles.avatar}
                    borderRadius={Radius.pill}
                    blurTarget={blurTarget}
                    intensity={60}
                    overlayColor="rgba(255, 255, 255, 0.9)"
                    tintColor="rgba(255, 255, 255, 0.9)"
                    isInteractive>
                    <Feather name="user" size={26} color={Colors.primary} />
                  </GlassSurface>
                </AnimatedPressable>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Summary stats — derived from sample event data, admin priority */}
          <Animated.View
            entering={FadeInDown.delay(80).duration(480)}
            style={styles.statsWrap}>
            {stats.map((stat) => (
              <GlassSurface
                key={stat.key}
                style={styles.statCard}
                borderRadius={Radius.lg}
                blurTarget={blurTarget}
                intensity={40}
                overlayColor="rgba(255, 255, 255, 0.7)"
                tintColor="rgba(255, 255, 255, 0.7)">
                <View style={styles.statIcon}>
                  <Feather name={stat.icon} size={16} color={Colors.primary} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </GlassSurface>
            ))}
          </Animated.View>

          {/* Role-aware quick actions */}
          <Animated.View
            entering={FadeInDown.delay(120).duration(480)}
            style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <Text style={styles.sectionHint}>Tools for your {ROLE_LABEL[activeRole].split(' / ')[0]} role.</Text>
          </Animated.View>

          <View style={styles.grid}>
            {QUICK_ACTIONS.map((action, index) => (
              <AnimatedPressable
                key={action.key}
                style={styles.gridItem}
                entering={FadeInDown.delay(180 + index * 70).duration(460)}
                onPress={() => router.push(action.route)}>
                <GlassSurface
                  style={styles.card}
                  borderRadius={Radius.lg}
                  blurTarget={blurTarget}
                  intensity={40}
                  overlayColor="rgba(255, 255, 255, 0.7)"
                  tintColor="rgba(255, 255, 255, 0.7)"
                  isInteractive>
                  <View style={styles.cardIcon}>
                    <Feather name={action.icon} size={20} color={Colors.primary} />
                  </View>

                  <Text style={styles.cardLabel}>{action.label}</Text>
                  <Text style={styles.cardCaption}>{action.caption}</Text>
                </GlassSurface>
              </AnimatedPressable>
            ))}
          </View>

         

          {/* Upcoming events */}
          <Animated.View
            entering={FadeInDown.delay(480).duration(480)}
            style={styles.section}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            <Text style={styles.sectionHint}>Your next 3 scheduled events.</Text>
          </Animated.View>

          <View style={styles.eventList}>
            {UPCOMING_EVENTS.map((event, index) => (
              <AnimatedPressable
                key={event.key}
                entering={FadeInDown.delay(680 + index * 70).duration(460)}
                onPress={() => router.push('/events')}>
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
                  </View>

                  <Feather name="chevron-right" size={18} color={Colors.textMuted} />
                </GlassSurface>
              </AnimatedPressable>
            ))}
          </View>

          <View style={styles.spacer} />
        </ScrollView>
      </View>

      <BottomNav activeKey="home" blurTargetRef={blurTarget} />
    </SafeAreaView>
  );
}
