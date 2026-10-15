import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { Radius } from '@/constants/theme';
import { BlurTargetView } from 'expo-blur';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuroraBackground } from '@/components/aurora-background';
import { BrandLogo } from '@/components/brand-logo';
import { FormField } from '@/components/form-field';
import { GlassSurface } from '@/components/glass-surface';
import { LinkButton } from '@/components/link-button';
import { PrimaryButton } from '@/components/primary-button';
import { DEMO_ACCOUNTS, useDemoSession } from '@/context/demo-session';
import type { UserRole } from '@/data/mock';
import styles from '@/styles/login.styles';

import Animated,
  { FadeIn,
  FadeInDown } from 'react-native-reanimated';

const DEMO_ROLES: { key: UserRole; label: string; caption: string }[] = [
  { key: 'admin', label: 'Admin / Organizer', caption: 'Full event & user management' },
  { key: 'staff', label: 'Staff / Assistant', caption: 'QR check-in & attendance' },
  { key: 'participant', label: 'Participant / Attendee', caption: 'Register & own QR code' },
];

export default function LoginScreen() {
  const { signIn } = useDemoSession();

  const [email, setEmail] = useState(DEMO_ACCOUNTS.admin.email);
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('admin');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const passwordRef = useRef<TextInput>(null);
  const blurTarget = useRef<View>(null);

  function selectRole(next: UserRole) {
    setRole(next);
    setErrors({});
    // Pre-fill the demo account email so the prototype feels like a real sign-in.
    setEmail(DEMO_ACCOUNTS[next].email);
  }

  function handleLogin() {
    const next: { email?: string; password?: string } = {};

    if (!email.trim()) {
      next.email = 'Email or username is required.';
    }
    if (!password.trim()) {
      next.password = 'Password is required.';
    }

    setErrors(next);

    if (next.email || next.password) {
      return;
    }

    signIn(role);
    router.replace('/dashboard');
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <BlurTargetView ref={blurTarget} style={StyleSheet.absoluteFill}>
        <AuroraBackground />
      </BlurTargetView>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeIn.duration(600)} style={styles.header}>
            <BrandLogo size={92} animated />
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to continue to your EventFlow dashboard.</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(120).duration(520)}>
            <GlassSurface
              style={styles.card}
              borderRadius={Radius.lg}
              blurTarget={blurTarget}
              intensity={50}
              overlayColor="rgba(255, 255, 255, 0.76)"
              tintColor="rgba(255, 255, 255, 0.72)">
              <View style={styles.form}>
                {/* Demo role selector — prototype only, not identity verification */}
                <View style={styles.roleGroup}>
                  <Text style={styles.roleLabel}>Demo role (prototype only)</Text>

                  {DEMO_ROLES.map((option) => {
                    const active = option.key === role;

                    return (
                      <Pressable
                        key={option.key}
                        accessibilityRole="radio"
                        accessibilityState={{ checked: active }}
                        accessibilityLabel={option.label}
                        hitSlop={8}
                        style={[styles.roleOption, active && styles.roleOptionActive]}
                        onPress={() => selectRole(option.key)}>
                        <View style={[styles.radioOuter, active && styles.radioOuterActive]}>
                          {active ? <View style={styles.radioInner} /> : null}
                        </View>

                        <View style={styles.roleText}>
                          <Text style={styles.roleName}>{option.label}</Text>
                          <Text style={styles.roleCaption}>{option.caption}</Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>

                <FormField
                  label="Email / Username"
                  icon="mail"
                  placeholder="you@example.com"
                  value={email}
                  onChangeText={(value) => {
                    setEmail(value);
                    setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  keyboardType="email-address"
                  returnKeyType="next"
                  error={errors.email}
                  onSubmitEditing={() => passwordRef.current?.focus()}
                />

                <FormField
                  ref={passwordRef}
                  label="Password"
                  icon="lock"
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={(value) => {
                    setPassword(value);
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  autoCapitalize="none"
                  autoComplete="current-password"
                  secureTextEntry
                  returnKeyType="go"
                  error={errors.password}
                  onSubmitEditing={handleLogin}
                />

                <Pressable
                  accessibilityRole="link"
                  hitSlop={8}
                  style={styles.forgot}
                  onPress={() =>
                    Alert.alert(
                      'Forgot password?',
                      'This is a prototype with no backend, so password recovery is not available.'
                    )
                  }>
                  <Text style={styles.forgotLabel}>Forgot password?</Text>
                </Pressable>

                <PrimaryButton
                  label="Login"
                  icon="log-in"
                  onPress={handleLogin}
                />
              </View>
            </GlassSurface>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(240).duration(520)} style={styles.footer}>
            <Text style={styles.footerNote}>Don&apos;t have an account?</Text>
            <LinkButton label="Sign Up" onPress={() => router.push('/sign-up')} />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
