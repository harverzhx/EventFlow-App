import { Feather } from '@expo/vector-icons';
import { BlurTargetView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedPressable } from '@/components/animated-pressable';
import { AuroraBackground } from '@/components/aurora-background';
import { BottomNav } from '@/components/bottom-nav';
import { GlassSurface } from '@/components/glass-surface';
import { Colors, FontSize, Fonts, Radius, Spacing } from '@/constants/theme';
import { CURRENT_USER, MOCK_EVENTS, MOCK_USERS, ROLE_LABEL, quickActionsForRole } from '@/data/mock';
import { useResponsive } from '@/hooks/use-responsive';

const QUICK_ACTIONS = quickActionsForRole(CURRENT_USER.role);

const UPCOMING_EVENTS = MOCK_EVENTS.slice(0, 3);

const USERS = MOCK_USERS.filter((user) => user.key !== CURRENT_USER.key);

export default function DashboardScreen() {
  const blurTarget = useRef<View>(null);
  const { contentWidth, inset } = useResponsive();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <BlurTargetView ref={blurTarget} style={StyleSheet.absoluteFill}>
        <AuroraBackground intensity={0.7} />
      </BlurTargetView>

      <View style={[styles.root, { paddingHorizontal: inset }]}>
        <View style={[styles.shell, { width: contentWidth }]}>
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

          {/* Users */}
          <Animated.View
            entering={FadeInDown.delay(120).duration(480)}
            style={styles.section}>
            <Text style={styles.sectionTitle}>Users</Text>
            <Text style={styles.sectionHint}>Registered users of this application.</Text>
          </Animated.View>

          <View style={styles.eventList}>
            {USERS.map((user, index) => (
              <AnimatedPressable
                key={user.key}
                entering={FadeInDown.delay(180 + index * 70).duration(460)}
                onPress={() => router.push('/profile')}>
                <GlassSurface
                  style={styles.eventRow}
                  borderRadius={Radius.lg}
                  blurTarget={blurTarget}
                  intensity={40}
                  overlayColor="rgba(255, 255, 255, 0.7)"
                  tintColor="rgba(255, 255, 255, 0.7)"
                  isInteractive>
                  <View style={styles.avatarBadge}>
                    <Feather name="user" size={22} color={Colors.primary} />
                  </View>

                  <View style={styles.eventInfo}>
                    <Text style={styles.eventTitle} numberOfLines={1}>
                      {user.name}
                    </Text>
                    <Text style={styles.eventMeta} numberOfLines={1}>
                      {ROLE_LABEL[user.role]}
                    </Text>
                  </View>

                  <Feather name="chevron-right" size={18} color={Colors.textMuted} />
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
        </View>
      </View>

      <BottomNav activeKey="home" blurTargetRef={blurTarget} />
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
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.five,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  greeting: {
    flex: 1,
    gap: Spacing.one,
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
  avatar: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.three,
    gap: Spacing.one,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  gridItem: {
    flexGrow: 1,
    flexBasis: '44%',
    minWidth: 140,
  },
  card: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryTint,
  },
  cardLabel: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.md,
    lineHeight: 22,
    fontWeight: '700',
    color: Colors.navy,
  },
  cardCaption: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.xs,
    lineHeight: 18,
    color: Colors.textMuted,
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
  avatarBadge: {
    width: 48,
    height: 48,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
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
