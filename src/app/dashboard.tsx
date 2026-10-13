import { Feather } from '@expo/vector-icons';
import { BlurTargetView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useRef } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedPressable } from '@/components/animated-pressable';
import { AuroraBackground } from '@/components/aurora-background';
import { BottomNav } from '@/components/bottom-nav';
import { GlassSurface } from '@/components/glass-surface';
import { Colors, FontSize, Fonts, Radius, Spacing } from '@/constants/theme';

const MENU_ITEMS = [
  { key: 'profile', label: 'Profile', caption: 'Your account details', icon: 'user' },
  { key: 'settings', label: 'Settings', caption: 'App preferences', icon: 'sliders' },
  { key: 'logout', label: 'Logout', caption: 'Sign out of EventFlow', icon: 'log-out' },
] as const;

const UPCOMING_EVENTS = [
  { key: 'e1', day: '12', month: 'SEP', title: 'Team Building Day', meta: '9:00 AM · Main Campus' },
  { key: 'e2', day: '18', month: 'SEP', title: 'Product Launch', meta: '2:30 PM · Grand Hall' },
  { key: 'e3', day: '25', month: 'SEP', title: 'Quarterly Review', meta: '10:00 AM · Meeting Room A' },
] as const;

const USERS = [
  { key: 'u1', name: 'Magsayo Dave Archie', role: 'Programmer / Documents' },
  { key: 'u2', name: 'Baje John Harvy', role: 'Programmer' },
  { key: 'u3', name: 'Marian Santos', role: 'UI Design Ideas' },
] as const;

export default function DashboardScreen() {
  const blurTarget = useRef<View>(null);

  function handlePress(key: (typeof MENU_ITEMS)[number]['key']) {
    if (key === 'logout') {
      Alert.alert('Logout', 'Are you sure you want to sign out?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => router.replace('/login') },
      ]);
      return;
    }

    Alert.alert('Coming soon', 'This menu item is part of the UI only for this activity.');
  }

  function handleEventPress(title: string) {
    Alert.alert(title, 'Event details are part of the UI only for this activity.');
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <BlurTargetView ref={blurTarget} style={StyleSheet.absoluteFill}>
        <AuroraBackground intensity={0.7} />
      </BlurTargetView>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(520)}>
          <LinearGradient
            colors={[Colors.primaryLight, Colors.primaryMid, Colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}>
            <View style={styles.headerRow}>
              <View style={styles.greeting}>
                <Text style={styles.eyebrow}>EVENTFLOW</Text>
                <Text style={styles.title}>Welcome, User!</Text>
                <Text style={styles.subtitle}>You have 3 upcoming events this week.</Text>
              </View>

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
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(120).duration(480)} style={styles.section}>
          <Text style={styles.sectionTitle}>Menu</Text>
          <Text style={styles.sectionHint}>Quick access to your EventFlow tools.</Text>
        </Animated.View>

        <View style={styles.grid}>
          {MENU_ITEMS.map((item, index) => {
            const danger = item.key === 'logout';

            return (
              <AnimatedPressable
                key={item.key}
                style={styles.gridItem}
                entering={FadeInDown.delay(180 + index * 70).duration(460)}
                onPress={() => handlePress(item.key)}>
                <GlassSurface
                  style={styles.card}
                  borderRadius={Radius.lg}
                  blurTarget={blurTarget}
                  intensity={40}
                  overlayColor="rgba(255, 255, 255, 0.7)"
                  tintColor="rgba(255, 255, 255, 0.7)"
                  isInteractive>
                  <View style={[styles.cardIcon, danger && styles.cardIconDanger]}>
                    <Feather
                      name={item.icon}
                      size={20}
                      color={danger ? Colors.danger : Colors.primary}
                    />
                  </View>

                  <Text style={[styles.cardLabel, danger && styles.cardLabelDanger]}>
                    {item.label}
                  </Text>
                  <Text style={styles.cardCaption}>{item.caption}</Text>
                </GlassSurface>
              </AnimatedPressable>
            );
          })}
        </View>

        <Animated.View entering={FadeInDown.delay(340).duration(480)} style={styles.section}>
          <Text style={styles.sectionTitle}>Users</Text>
          <Text style={styles.sectionHint}>Registered users of this application.</Text>
        </Animated.View>

        <View style={styles.eventList}>
          {USERS.map((user, index) => (
            <AnimatedPressable
              key={user.key}
              entering={FadeInDown.delay(400 + index * 70).duration(460)}
              onPress={() => Alert.alert(user.name, `Role: ${user.role}`)}>
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
                    {user.role}
                  </Text>
                </View>

                <Feather name="chevron-right" size={18} color={Colors.textMuted} />
              </GlassSurface>
            </AnimatedPressable>
          ))}
        </View>

        <Animated.View entering={FadeInDown.delay(480).duration(480)} style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <Text style={styles.sectionHint}>Your next 3 scheduled events.</Text>
        </Animated.View>

        <View style={styles.eventList}>
          {UPCOMING_EVENTS.map((event, index) => (
            <AnimatedPressable
              key={event.key}
              entering={FadeInDown.delay(680 + index * 70).duration(460)}
              onPress={() => handleEventPress(event.title)}>
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
                    {event.meta}
                  </Text>
                </View>

                <Feather name="chevron-right" size={18} color={Colors.textMuted} />
              </GlassSurface>
            </AnimatedPressable>
          ))}
        </View>
      </ScrollView>

      <BottomNav activeKey="home" blurTargetRef={blurTarget} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: Spacing.six,
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  gridItem: {
    flexGrow: 1,
    flexBasis: '46%',
    minWidth: 150,
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
  cardIconDanger: {
    backgroundColor: Colors.dangerTint,
  },
  cardLabel: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.md,
    lineHeight: 22,
    fontWeight: '700',
    color: Colors.navy,
  },
  cardLabelDanger: {
    color: Colors.danger,
  },
  cardCaption: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.xs,
    lineHeight: 18,
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
});
