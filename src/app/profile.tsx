import { Feather } from '@expo/vector-icons';
import { BlurTargetView } from 'expo-blur';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuroraBackground } from '@/components/aurora-background';
import { BottomNav } from '@/components/bottom-nav';
import { FormField } from '@/components/form-field';
import { GlassSurface } from '@/components/glass-surface';
import { PrimaryButton } from '@/components/primary-button';
import { Colors, FontSize, Fonts, Radius, Spacing } from '@/constants/theme';
import { CURRENT_USER, ROLE_LABEL } from '@/data/mock';
import { useResponsive } from '@/hooks/use-responsive';

type UserInfo = {
  name: string;
  email: string;
  role: string;
  phone: string;
  location: string;
};

const INITIAL_INFO: UserInfo = {
  name: CURRENT_USER.name,
  email: CURRENT_USER.email,
  role: ROLE_LABEL[CURRENT_USER.role],
  phone: '+63 917 123 4567',
  location: 'Cagayan de Oro, Philippines',
};

const FIELDS = [
  { key: 'name', label: 'Full Name', icon: 'user', placeholder: 'Your full name' },
  { key: 'email', label: 'Email', icon: 'mail', placeholder: 'you@example.com' },
  { key: 'role', label: 'Role', icon: 'briefcase', placeholder: 'Your role' },
  { key: 'phone', label: 'Phone', icon: 'phone', placeholder: '+63 ...' },
  { key: 'location', label: 'Location', icon: 'map-pin', placeholder: 'City, Country' },
] as const;

export default function ProfileScreen() {
  const blurTarget = useRef<View>(null);
  const { contentWidth, inset } = useResponsive();

  const [info, setInfo] = useState<UserInfo>(INITIAL_INFO);
  const [draft, setDraft] = useState<UserInfo>(INITIAL_INFO);
  const [editing, setEditing] = useState(false);

  function startEdit() {
    setDraft(info);
    setEditing(true);
  }

  function cancelEdit() {
    setDraft(info);
    setEditing(false);
  }

  function saveEdit() {
    setInfo(draft);
    setEditing(false);
    Alert.alert('Saved', 'Your profile information has been updated.');
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <BlurTargetView ref={blurTarget} style={StyleSheet.absoluteFill}>
        <AuroraBackground intensity={0.7} />
      </BlurTargetView>

      <View style={[styles.root, { paddingHorizontal: inset }]}>
        <View style={[styles.shell, { width: contentWidth }]}>
          {/* Header: back button + title + edit toggle */}
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
              <Text style={styles.title}>Profile</Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={editing ? 'Cancel editing' : 'Edit profile'}
              hitSlop={8}
              style={[styles.editToggle, editing && styles.editToggleActive]}
              onPress={editing ? cancelEdit : startEdit}>
              <Feather
                name={editing ? 'x' : 'edit-2'}
                size={18}
                color={editing ? Colors.white : Colors.primary}
              />
            </Pressable>
          </Animated.View>

          {/* Identity card: avatar + summary */}
          <Animated.View entering={FadeInDown.delay(80).duration(480)} style={styles.identityWrap}>
            <GlassSurface
              style={styles.identityCard}
              borderRadius={Radius.lg}
              blurTarget={blurTarget}
              intensity={40}
              overlayColor="rgba(255, 255, 255, 0.72)"
              tintColor="rgba(255, 255, 255, 0.72)">
              <View style={styles.avatarLarge}>
                <Text style={styles.avatarInitials}>
                  {info.name
                    .split(' ')
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()}
                </Text>
              </View>

              <View style={styles.identityText}>
                <Text style={styles.identityName} numberOfLines={1}>
                  {info.name}
                </Text>
                <Text style={styles.identityRole} numberOfLines={1}>
                  {info.role}
                </Text>
              </View>
            </GlassSurface>
          </Animated.View>

          {/* Detail rows / edit fields */}
          <Animated.View entering={FadeInDown.delay(160).duration(480)} style={styles.detailWrap}>
            <GlassSurface
              style={styles.detailCard}
              borderRadius={Radius.lg}
              blurTarget={blurTarget}
              intensity={40}
              overlayColor="rgba(255, 255, 255, 0.72)"
              tintColor="rgba(255, 255, 255, 0.72)">
              {editing ? (
                <View style={styles.editForm}>
                  {FIELDS.map((field) => (
                    <FormField
                      key={field.key}
                      label={field.label}
                      icon={field.icon}
                      placeholder={field.placeholder}
                      value={draft[field.key]}
                      onChangeText={(value) =>
                        setDraft((prev) => ({ ...prev, [field.key]: value }))
                      }
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType={field.key === 'email' ? 'email-address' : 'default'}
                    />
                  ))}
                </View>
              ) : (
                <View style={styles.readForm}>
                  {FIELDS.map((field, index) => (
                    <View
                      key={field.key}
                      style={[styles.detailRow, index === 0 && styles.detailRowFirst]}>
                      <View style={styles.detailIcon}>
                        <Feather name={field.icon} size={18} color={Colors.primary} />
                      </View>

                      <View style={styles.detailText}>
                        <Text style={styles.detailLabel}>{field.label}</Text>
                        <Text style={styles.detailValue} numberOfLines={1}>
                          {info[field.key]}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </GlassSurface>
          </Animated.View>

          {/* Save action (edit mode only) */}
          {editing ? (
            <Animated.View entering={FadeInDown.delay(240).duration(440)} style={styles.actions}>
              <PrimaryButton label="Save Changes" icon="check" onPress={saveEdit} />
            </Animated.View>
          ) : null}

          <View style={styles.spacer} />
        </View>
      </View>

      <BottomNav activeKey="profile" blurTargetRef={blurTarget} />
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
  editToggle: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryTint,
  },
  editToggleActive: {
    backgroundColor: Colors.danger,
  },
  identityWrap: {
    paddingTop: Spacing.three,
  },
  identityCard: {
    padding: Spacing.four,
    gap: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarLarge: {
    width: 72,
    height: 72,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryTint,
  },
  avatarInitials: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.xl,
    lineHeight: 32,
    fontWeight: '700',
    color: Colors.primary,
  },
  identityText: {
    flex: 1,
    gap: 4,
  },
  identityName: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.lg,
    lineHeight: 26,
    fontWeight: '700',
    color: Colors.navy,
  },
  identityRole: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.sm,
    lineHeight: 20,
    color: Colors.textMuted,
  },
  detailWrap: {
    paddingTop: Spacing.three,
  },
  detailCard: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  readForm: {
    gap: Spacing.three,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  detailRowFirst: {
    marginTop: 0,
  },
  detailIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryTint,
  },
  detailText: {
    flex: 1,
    gap: 2,
  },
  detailLabel: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.xs,
    lineHeight: 18,
    fontWeight: '600',
    color: Colors.textMuted,
    letterSpacing: 0.4,
  },
  detailValue: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.md,
    lineHeight: 22,
    color: Colors.text,
  },
  editForm: {
    gap: Spacing.three,
  },
  actions: {
    paddingTop: Spacing.three,
  },
  spacer: {
    height: 120,
  },
});
