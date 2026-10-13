import { Feather } from '@expo/vector-icons';
import { BlurTargetView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedPressable } from '@/components/animated-pressable';
import { AuroraBackground } from '@/components/aurora-background';
import { BottomNav } from '@/components/bottom-nav';
import { GlassSurface } from '@/components/glass-surface';
import { Colors, FontSize, Fonts, Radius, Spacing } from '@/constants/theme';

const EVENTS = [
  { key: 'e1', day: '12', month: 'SEP', title: 'Team Building Day', meta: '9:00 AM · Main Campus' },
  { key: 'e2', day: '18', month: 'SEP', title: 'Product Launch', meta: '2:30 PM · Grand Hall' },
  { key: 'e3', day: '25', month: 'SEP', title: 'Quarterly Review', meta: '10:00 AM · Meeting Room A' },
  { key: 'e4', day: '02', month: 'OCT', title: 'Expo Go Workshop', meta: '1:00 PM · Lab 3' },
  { key: 'e5', day: '09', month: 'OCT', title: 'Project Defense', meta: '8:30 AM · Room 204' },
  { key: 'e6', day: '16', month: 'OCT', title: 'Hackathon Night', meta: '5:00 PM · Innovation Hub' },
] as const;

export default function EventsScreen() {
  const blurTarget = useRef<View>(null);

  function handlePress(title: string) {
    Alert.alert(title, 'Event details are part of the UI only for this activity.');
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
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
              <View style={styles.headerText}>
                <Text style={styles.eyebrow}>EVENTFLOW</Text>
                <Text style={styles.title}>Events</Text>
                <Text style={styles.subtitle}>Browse your scheduled events.</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(120).duration(480)} style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <Text style={styles.sectionHint}>All scheduled events at a glance.</Text>
        </Animated.View>

        <View style={styles.eventList}>
          {EVENTS.map((event, index) => (
            <AnimatedPressable
              key={event.key}
              entering={FadeInDown.delay(180 + index * 70).duration(460)}
              onPress={() => handlePress(event.title)}>
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

      <BottomNav activeKey="events" blurTargetRef={blurTarget} />
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
  },
  headerText: {
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
});