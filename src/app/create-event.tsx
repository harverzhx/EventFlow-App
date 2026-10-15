import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors, Radius } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import { BlurTargetView } from 'expo-blur';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuroraBackground } from '@/components/aurora-background';
import { FormField } from '@/components/form-field';
import { GlassSurface } from '@/components/glass-surface';
import { PrimaryButton } from '@/components/primary-button';
import { useEvents } from '@/context/events';
import { CURRENT_USER } from '@/data/mock';
import { useResponsive } from '@/hooks/use-responsive';
import { useRouteGuard } from '@/hooks/use-route-guard';
import styles from '@/styles/create-event.styles';

import Animated,
  { FadeInDown } from 'react-native-reanimated';

export default function CreateEventScreen() {
  useRouteGuard('/create-event');
  const { addEvent } = useEvents();
  const blurTarget = useRef<View>(null);
  const { contentWidth, inset } = useResponsive();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState('');
  const [errors, setErrors] = useState<{ title?: string; venue?: string; capacity?: string }>({});

  function validate(): boolean {
    const next: typeof errors = {};

    if (!title.trim()) {
      next.title = 'Event title is required.';
    }
    if (!venue.trim()) {
      next.venue = 'Venue is required.';
    }
    const parsedCapacity = Number(capacity);
    if (!capacity.trim() || Number.isNaN(parsedCapacity) || parsedCapacity <= 0) {
      next.capacity = 'Enter a capacity greater than 0.';
    }

    setErrors(next);
    return !next.title && !next.venue && !next.capacity;
  }

  function handleSave() {
    if (!validate()) {
      return;
    }

    // Date text is split into day/month for the demo badge.
    const dateParts = date.trim().split(/\s+/);

    addEvent({
      title: title.trim(),
      day: dateParts[0] ?? 'TBA',
      month: dateParts[1]?.toUpperCase() ?? '',
      time: time.trim() || 'TBA',
      venue: venue.trim(),
      description: description.trim() || 'No description provided.',
      capacity: Number(capacity) || 0,
      organizer: CURRENT_USER.name,
    });

    Alert.alert(
      'Event created',
      `"${title.trim()}" has been added to the event list. (Prototype — in-memory only, resets on refresh.)`
    );
    router.back();
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
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
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
              <Text style={styles.title}>Create Event</Text>
              <Text style={styles.subtitle}>Organizer: {CURRENT_USER.name}</Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(120).duration(480)}>
            <GlassSurface
              style={styles.card}
              borderRadius={Radius.lg}
              blurTarget={blurTarget}
              intensity={40}
              overlayColor="rgba(255, 255, 255, 0.72)"
              tintColor="rgba(255, 255, 255, 0.72)">
              <View style={styles.form}>
                <FormField
                  label="Event Title"
                  icon="type"
                  placeholder="Tech Seminar 2026"
                  value={title}
                  onChangeText={(value) => {
                    setTitle(value);
                    setErrors((prev) => ({ ...prev, title: undefined }));
                  }}
                  error={errors.title}
                />
                <FormField
                  label="Date"
                  icon="calendar"
                  placeholder="DD MMM YYYY"
                  value={date}
                  onChangeText={setDate}
                />
                <FormField
                  label="Time"
                  icon="clock"
                  placeholder="9:00 AM – 12:00 PM"
                  value={time}
                  onChangeText={setTime}
                />
                <FormField
                  label="Venue"
                  icon="map-pin"
                  placeholder="Main Auditorium"
                  value={venue}
                  onChangeText={(value) => {
                    setVenue(value);
                    setErrors((prev) => ({ ...prev, venue: undefined }));
                  }}
                  error={errors.venue}
                />
                <FormField
                  label="Capacity"
                  icon="users"
                  placeholder="200"
                  value={capacity}
                  onChangeText={(value) => {
                    setCapacity(value);
                    setErrors((prev) => ({ ...prev, capacity: undefined }));
                  }}
                  keyboardType="number-pad"
                  error={errors.capacity}
                />
                <FormField
                  label="Description"
                  icon="file-text"
                  placeholder="What is this event about?"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={3}
                  style={styles.multiline}
                />

                <PrimaryButton label="Save Event" icon="check" onPress={handleSave} />
              </View>
            </GlassSurface>
          </Animated.View>

          <View style={styles.spacer} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
