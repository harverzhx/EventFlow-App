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
import { CURRENT_USER } from '@/data/mock';
import { useResponsive } from '@/hooks/use-responsive';
import styles from '@/styles/create-event.styles';

import Animated,
  { FadeInDown } from 'react-native-reanimated';

export default function CreateEventScreen() {
  const blurTarget = useRef<View>(null);
  const { contentWidth, inset } = useResponsive();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState('');

  function handleSave() {
    Alert.alert(
      'Event created',
      `"${title || 'Untitled event'}" has been added to the event list. (Mock — no data was saved.)`
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
                  onChangeText={setTitle}
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
                  onChangeText={setVenue}
                />
                <FormField
                  label="Capacity"
                  icon="users"
                  placeholder="200"
                  value={capacity}
                  onChangeText={setCapacity}
                  keyboardType="number-pad"
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
