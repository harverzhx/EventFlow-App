import { Feather } from '@expo/vector-icons';
import { BlurTargetView } from 'expo-blur';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuroraBackground } from '@/components/aurora-background';
import { GlassSurface } from '@/components/glass-surface';
import { Colors, FontSize, Fonts, Radius, Spacing } from '@/constants/theme';
import { MOCK_EVENTS, MOCK_REGISTRATIONS } from '@/data/mock';
import { useResponsive } from '@/hooks/use-responsive';

export default function ParticipantsScreen() {
  const blurTarget = useRef<View>(null);
  const { contentWidth, inset } = useResponsive();

  const [eventKey, setEventKey] = useState(MOCK_EVENTS[0].key);
  const registrations = MOCK_REGISTRATIONS.filter((reg) => reg.eventKey === eventKey);
  const event = MOCK_EVENTS.find((item) => item.key === eventKey)!;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <BlurTargetView ref={blurTarget} style={StyleSheet.absoluteFill}>
        <AuroraBackground intensity={0.7} />
      </BlurTargetView>

      <View style={[styles.root, { paddingHorizontal: inset }]}>
        <View style={[styles.shell, { width: contentWidth }]}>
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
              <Text style={styles.title}>Participants</Text>
              <Text style={styles.subtitle}>Registered per event</Text>
            </View>
          </Animated.View>

          {/* Event selector */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.selector}
            contentContainerStyle={styles.selectorContent}>
            {MOCK_EVENTS.map((item) => {
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

          <Animated.View entering={FadeInDown.delay(120).duration(480)} style={styles.summaryCard}>
            <GlassSurface
              style={styles.summary}
              borderRadius={Radius.lg}
              blurTarget={blurTarget}
              intensity={40}
              overlayColor="rgba(255, 255, 255, 0.75)"
              tintColor="rgba(255, 255, 255, 0.75)">
              <Text style={styles.summaryTitle}>{event.title}</Text>
              <Text style={styles.summaryMeta}>
                {event.registered} registered · {event.capacity} capacity
              </Text>
            </GlassSurface>
          </Animated.View>

          <View style={styles.list}>
            {registrations.map((reg, index) => (
              <Animated.View
                key={reg.key}
                entering={FadeInDown.delay(180 + index * 60).duration(440)}>
                <GlassSurface
                  style={styles.row}
                  borderRadius={Radius.lg}
                  blurTarget={blurTarget}
                  intensity={40}
                  overlayColor="rgba(255, 255, 255, 0.7)"
                  tintColor="rgba(255, 255, 255, 0.7)">
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
                    <Text style={[styles.badgeText, reg.attended ? styles.badgeTextOn : styles.badgeTextOff]}>
                      {reg.attended ? 'Present' : 'Registered'}
                    </Text>
                  </View>
                </GlassSurface>
              </Animated.View>
            ))}
          </View>

          <View style={styles.spacer} />
        </View>
      </View>
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
    color: Colors.primary,
  },
  title: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.xl,
    lineHeight: 32,
    fontWeight: '700',
    color: Colors.navy,
  },
  subtitle: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.sm,
    lineHeight: 20,
    color: Colors.textMuted,
  },
  selector: {
    maxHeight: 48,
    paddingTop: Spacing.three,
  },
  selectorContent: {
    gap: Spacing.two,
    paddingRight: Spacing.four,
  },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  chipSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryTint,
  },
  chipText: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.sm,
    lineHeight: 20,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  chipTextSelected: {
    color: Colors.primary,
  },
  summaryCard: {
    paddingTop: Spacing.three,
  },
  summary: {
    padding: Spacing.three,
    gap: 2,
  },
  summaryTitle: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.md,
    lineHeight: 22,
    fontWeight: '700',
    color: Colors.navy,
  },
  summaryMeta: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.xs,
    lineHeight: 18,
    color: Colors.textMuted,
  },
  list: {
    paddingTop: Spacing.three,
    gap: Spacing.three,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
  },
  avatarBadge: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryTint,
  },
  rowInfo: {
    flex: 1,
    gap: 2,
  },
  rowName: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.md,
    lineHeight: 22,
    fontWeight: '700',
    color: Colors.navy,
  },
  rowMeta: {
    fontFamily: Fonts.mono,
    fontSize: FontSize.xs,
    lineHeight: 18,
    color: Colors.textMuted,
  },
  badge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  badgeOn: {
    backgroundColor: Colors.primaryTint,
  },
  badgeOff: {
    backgroundColor: Colors.surface,
  },
  badgeText: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.xs,
    lineHeight: 18,
    fontWeight: '700',
  },
  badgeTextOn: {
    color: Colors.primary,
  },
  badgeTextOff: {
    color: Colors.textMuted,
  },
  spacer: {
    height: 120,
  },
});
