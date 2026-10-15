import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors, Radius } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import { BlurTargetView } from 'expo-blur';
import { router } from 'expo-router';
import { useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuroraBackground } from '@/components/aurora-background';
import { GlassSurface } from '@/components/glass-surface';
import { PrimaryButton } from '@/components/primary-button';
import { MOCK_EVENTS } from '@/data/mock';
import { useResponsive } from '@/hooks/use-responsive';
import { useRouteGuard } from '@/hooks/use-route-guard';
import styles from '@/styles/reports.styles';

import Animated,
  { FadeInDown } from 'react-native-reanimated';

export default function ReportsScreen() {
  useRouteGuard('/reports');
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
