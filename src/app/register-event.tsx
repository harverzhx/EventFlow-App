import { Feather } from '@expo/vector-icons';
import { BlurTargetView } from 'expo-blur';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuroraBackground } from '@/components/aurora-background';
import { GlassSurface } from '@/components/glass-surface';
import { PrimaryButton } from '@/components/primary-button';
import { Colors, FontSize, Fonts, Radius, Spacing } from '@/constants/theme';
import { CURRENT_USER, MOCK_EVENTS } from '@/data/mock';
import { useResponsive } from '@/hooks/use-responsive';

export default function RegisterEventScreen() {
  const blurTarget = useRef<View>(null);
  const { contentWidth, inset } = useResponsive();

  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [registered, setRegistered] = useState(false);

  function handleRegister() {
    setRegistered(true);
    Alert.alert(
      'Registration complete',
      'Your QR code is ready. Show it at the check-in table. (Mock — no data was saved.)'
    );
  }

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
              <Text style={styles.title}>Register for an Event</Text>
              <Text style={styles.subtitle}>Participant: {CURRENT_USER.name}</Text>
            </View>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(120).duration(480)}
            style={styles.section}>
            <Text style={styles.sectionTitle}>Select an event</Text>
            <Text style={styles.sectionHint}>Choose which event you want to join.</Text>
          </Animated.View>

          <View style={styles.eventList}>
            {MOCK_EVENTS.map((event, index) => {
              const selected = selectedEvent === event.key;

              return (
                <Animated.View
                  key={event.key}
                  entering={FadeInDown.delay(180 + index * 60).duration(440)}>
                  <GlassSurface
                    style={[styles.eventRow, selected && styles.eventRowSelected]}
                    borderRadius={Radius.lg}
                    blurTarget={blurTarget}
                    intensity={40}
                    overlayColor="rgba(255, 255, 255, 0.7)"
                    tintColor="rgba(255, 255, 255, 0.7)"
                    isInteractive>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Select ${event.title}`}
                      onPress={() => {
                        setSelectedEvent(event.key);
                        setRegistered(false);
                      }}>
                      <View style={styles.eventRowInner}>
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

                        <View style={[styles.radio, selected && styles.radioSelected]}>
                          {selected ? <Feather name="check" size={14} color={Colors.white} /> : null}
                        </View>
                      </View>
                    </Pressable>
                  </GlassSurface>
                </Animated.View>
              );
            })}
          </View>

          {selectedEvent ? (
            <Animated.View entering={FadeInDown.delay(240).duration(440)} style={styles.actions}>
              <PrimaryButton
                label={registered ? 'View My QR Code' : 'Register Now'}
                icon={registered ? 'grid' : 'user-plus'}
                onPress={() => (registered ? router.push('/my-qr') : handleRegister())}
              />
            </Animated.View>
          ) : null}

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
  section: {
    paddingTop: Spacing.three,
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
    gap: Spacing.three,
  },
  eventRow: {
    padding: Spacing.three,
  },
  eventRowSelected: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  eventRowInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
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
  radio: {
    width: 24,
    height: 24,
    borderRadius: Radius.pill,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  actions: {
    paddingTop: Spacing.three,
  },
  spacer: {
    height: 120,
  },
});
