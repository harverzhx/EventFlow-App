import { Feather } from '@expo/vector-icons';
import { BlurTargetView } from 'expo-blur';
import { router } from 'expo-router';
import { useRef } from 'react';
import { Alert, Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuroraBackground } from '@/components/aurora-background';
import { GlassSurface } from '@/components/glass-surface';
import { PrimaryButton } from '@/components/primary-button';
import { Colors, FontSize, Fonts, Radius, Spacing } from '@/constants/theme';
import { MOCK_EVENTS } from '@/data/mock';
import { useResponsive } from '@/hooks/use-responsive';

export default function ReportsScreen() {
  const blurTarget = useRef<View>(null);
  const { contentWidth, inset } = useResponsive();

  const totalEvents = MOCK_EVENTS.length;
  const totalRegistered = MOCK_EVENTS.reduce((sum, event) => sum + event.registered, 0);
  const totalAttended = MOCK_EVENTS.reduce((sum, event) => sum + event.attended, 0);
  const attendanceRate = totalRegistered > 0 ? Math.round((totalAttended / totalRegistered) * 100) : 0;

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
              <Text style={styles.title}>Reports</Text>
              <Text style={styles.subtitle}>Attendance & registration summary</Text>
            </View>
          </Animated.View>

          {/* Overview stats */}
          <Animated.View entering={FadeInDown.delay(120).duration(480)} style={styles.statsRow}>
            <GlassSurface
              style={styles.statCard}
              borderRadius={Radius.lg}
              blurTarget={blurTarget}
              intensity={40}
              overlayColor="rgba(255, 255, 255, 0.75)"
              tintColor="rgba(255, 255, 255, 0.75)">
              <Feather name="calendar" size={18} color={Colors.primary} />
              <Text style={styles.statValue}>{totalEvents}</Text>
              <Text style={styles.statLabel}>Events</Text>
            </GlassSurface>

            <GlassSurface
              style={styles.statCard}
              borderRadius={Radius.lg}
              blurTarget={blurTarget}
              intensity={40}
              overlayColor="rgba(255, 255, 255, 0.75)"
              tintColor="rgba(255, 255, 255, 0.75)">
              <Feather name="users" size={18} color={Colors.primary} />
              <Text style={styles.statValue}>{totalRegistered}</Text>
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
              <Text style={styles.statValue}>{totalAttended}</Text>
              <Text style={styles.statLabel}>Attended</Text>
            </GlassSurface>
          </Animated.View>

          {/* Attendance rate banner */}
          <Animated.View entering={FadeInDown.delay(200).duration(480)} style={styles.rateWrap}>
            <GlassSurface
              style={styles.rateCard}
              borderRadius={Radius.lg}
              blurTarget={blurTarget}
              intensity={40}
              overlayColor="rgba(255, 255, 255, 0.75)"
              tintColor="rgba(255, 255, 255, 0.75)">
              <Text style={styles.rateLabel}>Overall attendance rate</Text>
              <Text style={styles.rateValue}>{attendanceRate}%</Text>
              <View style={styles.rateBar}>
                <View style={[styles.rateFill, { width: `${attendanceRate}%` }]} />
              </View>
            </GlassSurface>
          </Animated.View>

          {/* Per-event breakdown */}
          <Animated.View entering={FadeInDown.delay(280).duration(480)} style={styles.section}>
            <Text style={styles.sectionTitle}>Per Event</Text>
            <Text style={styles.sectionHint}>Registration and attendance by event.</Text>
          </Animated.View>

          <ScrollView style={styles.list}>
            {MOCK_EVENTS.map((event, index) => {
              const rate = event.registered > 0 ? Math.round((event.attended / event.registered) * 100) : 0;
              return (
                <Animated.View
                  key={event.key}
                  entering={FadeInDown.delay(320 + index * 60).duration(440)}>
                  <GlassSurface
                    style={styles.row}
                    borderRadius={Radius.lg}
                    blurTarget={blurTarget}
                    intensity={40}
                    overlayColor="rgba(255, 255, 255, 0.7)"
                    tintColor="rgba(255, 255, 255, 0.7)">
                    <View style={styles.rowInfo}>
                      <Text style={styles.rowName} numberOfLines={1}>
                        {event.title}
                      </Text>
                      <Text style={styles.rowMeta}>
                        {event.registered} registered · {event.attended} attended
                      </Text>
                    </View>
                    <Text style={styles.rowRate}>{rate}%</Text>
                  </GlassSurface>
                </Animated.View>
              );
            })}
          </ScrollView>

          <Animated.View entering={FadeInDown.delay(640).duration(440)} style={styles.actions}>
            <PrimaryButton
              label="Generate Report"
              icon="file-text"
              onPress={() =>
                Alert.alert('Report generated', 'A summary report would be exported here. (Mock)')
              }
            />
          </Animated.View>

          <View style={styles.spacer} />
        </ScrollView>
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
  shellContent: {
    paddingBottom: Spacing.six,
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
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    paddingTop: Spacing.three,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    padding: Spacing.three,
  },
  statValue: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.xl,
    lineHeight: 32,
    fontWeight: '700',
    color: Colors.navy,
  },
  statLabel: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.xs,
    lineHeight: 18,
    color: Colors.textMuted,
  },
  rateWrap: {
    paddingTop: Spacing.three,
  },
  rateCard: {
    padding: Spacing.four,
    gap: Spacing.two,
  },
  rateLabel: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.sm,
    lineHeight: 20,
    color: Colors.textMuted,
  },
  rateValue: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.xxl,
    lineHeight: 40,
    fontWeight: '700',
    color: Colors.navy,
  },
  rateBar: {
    height: 10,
    borderRadius: Radius.pill,
    backgroundColor: Colors.border,
    overflow: 'hidden',
  },
  rateFill: {
    height: '100%',
    borderRadius: Radius.pill,
    backgroundColor: Colors.primary,
  },
  section: {
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
  list: {
    maxHeight: 220,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    marginBottom: Spacing.two,
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
    fontFamily: Fonts.sans,
    fontSize: FontSize.xs,
    lineHeight: 18,
    color: Colors.textMuted,
  },
  rowRate: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.lg,
    lineHeight: 26,
    fontWeight: '700',
    color: Colors.primary,
  },
  actions: {
    paddingTop: Spacing.three,
  },
  spacer: {
    height: 120,
  },
});
