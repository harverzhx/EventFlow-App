import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors, Radius } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import { BlurTargetView } from 'expo-blur';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuroraBackground } from '@/components/aurora-background';
import { GlassSurface } from '@/components/glass-surface';
import { MOCK_EVENTS, MOCK_REGISTRATIONS } from '@/data/mock';
import { useResponsive } from '@/hooks/use-responsive';
import { useRouteGuard } from '@/hooks/use-route-guard';
import styles from '@/styles/participants.styles';

import Animated,
  { FadeInDown } from 'react-native-reanimated';

export default function ParticipantsScreen() {
  useRouteGuard('/participants');
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
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
