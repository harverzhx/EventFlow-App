import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors, Radius } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import { BlurTargetView } from 'expo-blur';
import { router } from 'expo-router';
import { useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuroraBackground } from '@/components/aurora-background';
import { GlassSurface } from '@/components/glass-surface';
import { useDemoSession } from '@/context/demo-session';
import { MOCK_USERS, ROLE_LABEL, type MockUser } from '@/data/mock';
import { useResponsive } from '@/hooks/use-responsive';
import { useRouteGuard } from '@/hooks/use-route-guard';
import styles from '@/styles/user-management.styles';

import Animated,
  { FadeInDown } from 'react-native-reanimated';

const ROLE_TINT: Record<MockUser['role'], string> = {
  admin: '#FEF3C7',
  staff: '#DBEAFE',
  participant: '#DCFCE7',
};

const ROLE_TEXT: Record<MockUser['role'], string> = {
  admin: '#92400E',
  staff: '#1E40AF',
  participant: '#166534',
};

export default function UserManagementScreen() {
  useRouteGuard('/user-management');
  const { signIn } = useDemoSession();
  const blurTarget = useRef<View>(null);
  const { contentWidth, inset } = useResponsive();

  /** Switches the demo to another account — prototype convenience only. */
  function handleSwitch(user: MockUser) {
    Alert.alert(
      'Switch demo user?',
      `You will sign in as ${user.name} (${ROLE_LABEL[user.role]}). This only changes the demo role.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Switch',
          onPress: () => {
            signIn(user.role);
            router.replace('/dashboard');
          },
        },
      ]
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
              <Text style={styles.title}>User Management</Text>
              <Text style={styles.subtitle}>Sample accounts — no real data</Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(80).duration(480)} style={styles.noteWrap}>
            <Feather name="info" size={15} color={Colors.textMuted} />
            <Text style={styles.noteText}>
              These are sample accounts for the prototype. Switching signs you in as that demo
              role; no account is created, updated, or deleted.
            </Text>
          </Animated.View>

          <View style={styles.list}>
            {MOCK_USERS.map((user, index) => (
              <Animated.View
                key={user.key}
                entering={FadeInDown.delay(140 + index * 60).duration(440)}>
                <GlassSurface
                  style={styles.row}
                  borderRadius={Radius.lg}
                  blurTarget={blurTarget}
                  intensity={40}
                  overlayColor="rgba(255, 255, 255, 0.7)"
                  tintColor="rgba(255, 255, 255, 0.7">
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {user.name
                        .split(' ')
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()}
                    </Text>
                  </View>

                  <View style={styles.rowInfo}>
                    <Text style={styles.rowName} numberOfLines={1}>
                      {user.name}
                    </Text>
                    <Text style={styles.rowMeta} numberOfLines={1}>
                      {user.email}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.roleBadge,
                      { backgroundColor: ROLE_TINT[user.role] },
                    ]}>
                    <Text style={[styles.roleBadgeText, { color: ROLE_TEXT[user.role] }]}>
                      {ROLE_LABEL[user.role].split(' / ')[0]}
                    </Text>
                  </View>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Switch to ${user.name}`}
                    hitSlop={8}
                    style={styles.switchButton}
                    onPress={() => handleSwitch(user)}>
                    <Feather name="repeat" size={17} color={Colors.primary} />
                  </Pressable>
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
