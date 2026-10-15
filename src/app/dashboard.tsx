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
import { CURRENT_USER, MOCK_EVENTS, ROLE_LABEL, quickActionsForRole } from '@/data/mock';
import { useResponsive } from '@/hooks/use-responsive';
import styles from '@/styles/dashboard.styles';

import Animated,
  { FadeInDown } from 'react-native-reanimated';

/** The signed-in demo user — falls back to the admin sample account. */
const ACTIVE_USER = CURRENT_USER;

const QUICK_ACTIONS = quickActionsForRole(ACTIVE_USER.role);

const UPCOMING_EVENTS = MOCK_EVENTS.slice(0, 3);

type StatIcon = 'calendar' | 'users' | 'check-square' | 'grid';

/** Summary stats derived from the sample event data (no backend). */
const STATS: { key: string; label: string; value: number; icon: StatIcon }[] = [
  { key: 'events', label: 'Total Events', value: MOCK_EVENTS.length, icon: 'calendar' },
  {
    key: 'registered',
    label: 'Registrations',
    value: MOCK_EVENTS.reduce((sum, event) => sum + event.registered, 0),
    icon: 'users',
  },
  {
    key: 'attended',
    label: 'Attended',
    value: MOCK_EVENTS.reduce((sum, event) => sum + event.attended, 0),
    icon: 'check-square',
  },
  {
    key: 'capacity',
    label: 'Total Seats',
    value: MOCK_EVENTS.reduce((sum, event) => sum + event.capacity, 0),
    icon: 'grid',
  },
];

export default function DashboardScreen() {
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
                  <Text style={styles.title}>Welcome, {CURRENT_USER.name.split(' ')[0]}!</Text>
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
            {STATS.map((stat) => (
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
            <Text style={styles.sectionHint}>Tools for your {ROLE_LABEL[CURRENT_USER.role].split(' / ')[0]} role.</Text>
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
