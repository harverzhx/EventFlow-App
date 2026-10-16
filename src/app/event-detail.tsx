import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors, Radius } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import { BlurTargetView } from 'expo-blur';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuroraBackground } from '@/components/aurora-background';
import { GlassSurface } from '@/components/glass-surface';
import { PrimaryButton } from '@/components/primary-button';
import { useEvents } from '@/context/events';
import { useRegistrations } from '@/context/registrations';
import { useDemoSession } from '@/context/demo-session';
import { useResponsive } from '@/hooks/use-responsive';
import { useRouteGuard } from '@/hooks/use-route-guard';
import { computeEventStats } from '@/utils/event-stats';
import styles from '@/styles/event-detail.styles';

import Animated,
  { FadeInDown } from 'react-native-reanimated';

export default function EventDetailScreen() {
  useRouteGuard('/event-detail');
  const { eventKey } = useLocalSearchParams<{ eventKey: string }>();
  const { events, getEvent, deleteEvent } = useEvents();
  const { register, isRegistered, registrations } = useRegistrations();
  const { role, user } = useDemoSession();
  const blurTarget = useRef<View>(null);
  const { contentWidth, inset } = useResponsive();

  const event = eventKey ? getEvent(eventKey) : undefined;

  if (!event) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={[styles.root, { paddingHorizontal: inset }]}>
          <View style={styles.empty}>
            <Feather name="alert-circle" size={40} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>Event not found</Text>
            <Text style={styles.emptyText}>This event may have been deleted.</Text>
            <PrimaryButton label="Back to Events" icon="arrow-left" onPress={() => router.back()} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const eventStats = computeEventStats(events, registrations);
  const eventStat = eventStats.get(event.key) ?? { registered: 0, attended: 0 };

  const isAdmin = role === 'admin';
  const seatsLeft = Math.max(event.capacity - eventStat.registered, 0);
  const registeredPct = Math.min(
    Math.round((eventStat.registered / Math.max(event.capacity, 1)) * 100),
    100
  );

  const alreadyRegistered = user ? isRegistered(user.key, event.key) : false;

  function handleDelete() {
    Alert.alert(
      'Delete event?',
      `"${event?.title}" will be removed. This is a prototype — nothing is permanently saved.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (eventKey) {
              deleteEvent(eventKey);
            }
            router.replace('/events');
          },
        },
      ]
    );
  }

  function handleRegister() {
    if (!event || !user) {
      return;
    }

    if (isRegistered(user.key, event.key)) {
      Alert.alert('Already registered', 'You are already registered for this event.');
      return;
    }

    register(user.key, event.key, user.name);
    Alert.alert(
      'Registered',
      `You are registered for "${event.title}". Your QR code is ready. (Prototype — in-memory only.)`
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
              <Text style={styles.title} numberOfLines={2}>
                {event.title}
              </Text>
            </View>
          </Animated.View>

          {/* Hero card: date badge + schedule */}
          <Animated.View entering={FadeInDown.delay(80).duration(480)} style={styles.section}>
            <GlassSurface
              style={styles.card}
              borderRadius={Radius.lg}
              blurTarget={blurTarget}
              intensity={40}
              overlayColor="rgba(255, 255, 255, 0.72)"
              tintColor="rgba(255, 255, 255, 0.72)">
              <View style={styles.heroRow}>
                <View style={styles.dateBadge}>
                  <Text style={styles.dateDay}>{event.day}</Text>
                  <Text style={styles.dateMonth}>{event.month}</Text>
                </View>

                <View style={styles.heroInfo}>
                  <View style={styles.metaRow}>
                    <Feather name="clock" size={15} color={Colors.primary} />
                    <Text style={styles.metaText}>{event.time}</Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Feather name="map-pin" size={15} color={Colors.primary} />
                    <Text style={styles.metaText}>{event.venue}</Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Feather name="user" size={15} color={Colors.primary} />
                    <Text style={styles.metaText}>Organizer: {event.organizer}</Text>
                  </View>
                </View>
              </View>
            </GlassSurface>
          </Animated.View>

          {/* Description */}
          <Animated.View entering={FadeInDown.delay(160).duration(480)} style={styles.section}>
            <Text style={styles.sectionTitle}>About this event</Text>
            <GlassSurface
              style={styles.card}
              borderRadius={Radius.lg}
              blurTarget={blurTarget}
              intensity={40}
              overlayColor="rgba(255, 255, 255, 0.72)"
              tintColor="rgba(255, 255, 255, 0.72)">
              <Text style={styles.description}>{event.description}</Text>
            </GlassSurface>
          </Animated.View>

          {/* Registration progress */}
          <Animated.View entering={FadeInDown.delay(240).duration(480)} style={styles.section}>
            <Text style={styles.sectionTitle}>Registration</Text>
            <GlassSurface
              style={styles.card}
              borderRadius={Radius.lg}
              blurTarget={blurTarget}
              intensity={40}
              overlayColor="rgba(255, 255, 255, 0.72)"
              tintColor="rgba(255, 255, 255, 0.72)">
              <View style={styles.countsRow}>
                <View style={styles.countItem}>
                  <Text style={styles.countValue}>{eventStat.registered}</Text>
                  <Text style={styles.countLabel}>Registered</Text>
                </View>
                <View style={styles.countItem}>
                  <Text style={styles.countValue}>{seatsLeft}</Text>
                  <Text style={styles.countLabel}>Seats left</Text>
                </View>
                <View style={styles.countItem}>
                  <Text style={styles.countValue}>{eventStat.attended}</Text>
                  <Text style={styles.countLabel}>Attended</Text>
                </View>
              </View>

              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${registeredPct}%` }]} />
              </View>
              <Text style={styles.progressLabel}>
                {registeredPct}% of {event.capacity} seats filled
              </Text>
            </GlassSurface>
          </Animated.View>

          {/* Actions: role-aware */}
          <Animated.View entering={FadeInDown.delay(320).duration(480)} style={styles.actions}>
            {isAdmin ? (
              <>
                <PrimaryButton
                  label="Edit Event"
                  icon="edit-2"
                  onPress={() => router.push({ pathname: '/edit-event', params: { eventKey: event.key } })}
                />
                <PrimaryButton label="Delete Event" icon="trash-2" variant="danger" onPress={handleDelete} />
              </>
            ) : role === 'participant' ? (
              <PrimaryButton
                label={alreadyRegistered ? 'Already Registered — View QR' : 'Register for this Event'}
                icon={alreadyRegistered ? 'grid' : 'edit-3'}
                onPress={() =>
                  alreadyRegistered ? router.push('/my-qr') : handleRegister()
                }
              />
            ) : null}
          </Animated.View>

          <View style={styles.spacer} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
