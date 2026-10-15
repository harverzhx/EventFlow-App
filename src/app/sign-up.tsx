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
import { Colors, Radius } from '@/constants/theme';
import { BlurTargetView } from 'expo-blur';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuroraBackground } from '@/components/aurora-background';
import { FormField } from '@/components/form-field';
import { GlassSurface } from '@/components/glass-surface';
import { LinkButton } from '@/components/link-button';
import { PrimaryButton } from '@/components/primary-button';
import styles from '@/styles/sign-up.styles';

import Animated,
  { FadeIn,
  FadeInDown,
  FadeInUp } from 'react-native-reanimated';

export default function SignUpScreen() {
  const [name, setName] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);
  const blurTarget = useRef<View>(null);

  function handleSignUp() {
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError(undefined);
    Alert.alert('Account created', 'Welcome to EventFlow! Please log in to continue.', [
      { text: 'Go to Login', onPress: () => router.replace('/login') },
    ]);
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <BlurTargetView ref={blurTarget} style={StyleSheet.absoluteFill}>
        <AuroraBackground intensity={0.85} />
      </BlurTargetView>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeIn.duration(400)}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={8}
              style={styles.back}
              onPress={() => router.back()}>
              <Feather name="chevron-left" size={22} color={Colors.navy} />
            </Pressable>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(100).duration(520)}>
            <GlassSurface
              style={styles.card}
              borderRadius={Radius.lg}
              blurTarget={blurTarget}
              intensity={50}
              overlayColor="rgba(255, 255, 255, 0.78)"
              tintColor="rgba(255, 255, 255, 0.72)">
              <View style={styles.header}>
                <Text style={styles.title}>Create your account</Text>
                <Text style={styles.subtitle}>Start planning and managing your events in minutes.</Text>
              </View>

              <View style={styles.form}>
                <FormField
                  label="Full Name"
                  icon="user"
                  placeholder="Juan Dela Cruz"
                  value={name}
                  onChangeText={setName}
                  autoComplete="name"
                  returnKeyType="next"
                  onSubmitEditing={() => emailRef.current?.focus()}
                />

                <FormField
                  ref={emailRef}
                  label="Email"
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
                  placeholder="Create a password"
                  value={password}
                  onChangeText={(value) => {
                    setPassword(value);
                    setError(undefined);
                  }}
                  autoCapitalize="none"
                  autoComplete="new-password"
                  secureTextEntry
                  returnKeyType="next"
                  onSubmitEditing={() => confirmRef.current?.focus()}
                />

                <FormField
                  ref={confirmRef}
                  label="Confirm Password"
                  icon="check-circle"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChangeText={(value) => {
                    setConfirmPassword(value);
                    setError(undefined);
                  }}
                  autoCapitalize="none"
                  autoComplete="new-password"
                  secureTextEntry
                  error={error}
                  returnKeyType="go"
                  onSubmitEditing={handleSignUp}
                />

                <PrimaryButton label="Sign Up" icon="user-plus" onPress={handleSignUp} />
              </View>
            </GlassSurface>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(220).duration(520)} style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <LinkButton label="Login" onPress={() => router.replace('/login')} />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
