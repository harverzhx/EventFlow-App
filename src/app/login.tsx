import { BlurTargetView } from 'expo-blur';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuroraBackground } from '@/components/aurora-background';
import { BrandLogo } from '@/components/brand-logo';
import { FormField } from '@/components/form-field';
import { GlassSurface } from '@/components/glass-surface';
import { LinkButton } from '@/components/link-button';
import { PrimaryButton } from '@/components/primary-button';
import { Colors, FontSize, Fonts, Radius, Spacing } from '@/constants/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const passwordRef = useRef<TextInput>(null);
  const blurTarget = useRef<View>(null);

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
                <FormField
                  label="Email / Username"
                  icon="mail"
                  placeholder="you@example.com"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  keyboardType="email-address"
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                />

                <FormField
                  ref={passwordRef}
                  label="Password"
                  icon="lock"
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  autoCapitalize="none"
                  autoComplete="current-password"
                  secureTextEntry
                  returnKeyType="go"
                  onSubmitEditing={() => router.replace('/dashboard')}
                />

                <Pressable
                  accessibilityRole="link"
                  hitSlop={8}
                  style={styles.forgot}
                  onPress={() =>
                    Alert.alert('Forgot password?', 'A reset link will be sent to your email address.')
                  }>
                  <Text style={styles.forgotLabel}>Forgot password?</Text>
                </Pressable>

                <PrimaryButton
                  label="Login"
                  icon="log-in"
                  onPress={() => router.replace('/dashboard')}
                />
              </View>
            </GlassSurface>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(240).duration(520)} style={styles.footer}>
            <Text style={styles.footerText}>Don&apos;t have an account?</Text>
            <LinkButton label="Sign Up" onPress={() => router.push('/sign-up')} />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
    gap: Spacing.five,
  },
  header: {
    alignItems: 'center',
    gap: Spacing.three,
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
    fontSize: FontSize.md,
    lineHeight: 22,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  card: {
    padding: Spacing.four,
  },
  form: {
    gap: Spacing.four,
  },
  forgot: {
    alignSelf: 'flex-end',
    marginTop: -Spacing.two,
  },
  forgotLabel: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.sm,
    lineHeight: 20,
    fontWeight: '600',
    color: Colors.primary,
  },
  footer: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
  },
  footerText: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.sm,
    lineHeight: 20,
    color: Colors.textMuted,
  },
});
