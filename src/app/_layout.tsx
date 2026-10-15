import { useState } from 'react';
import { View } from 'react-native';
import { Colors } from '@/constants/theme';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { EventsProvider } from '@/context/events';
import { RegistrationsProvider } from '@/context/registrations';
import {
  DemoSessionContext,
  DEMO_SESSION_INITIAL,
  type DemoSession,
  DEMO_ACCOUNTS,
} from '@/context/demo-session';
import styles from '@/styles/_layout.styles';

export default function RootLayout() {
  const [session, setSession] = useState<DemoSession>(DEMO_SESSION_INITIAL);

  function signIn(role: DemoSession['role']) {
    if (!role) {
      setSession(DEMO_SESSION_INITIAL);
      return;
    }
    setSession({ user: DEMO_ACCOUNTS[role], role, isDemo: true });
  }

  function signOut() {
    setSession(DEMO_SESSION_INITIAL);
  }

  return (
    <DemoSessionContext.Provider value={{ ...session, signIn, signOut }}>
      <EventsProvider>
        <RegistrationsProvider>
          <View style={styles.root}>
            <StatusBar style="dark" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: Colors.background },
                animation: 'slide_from_right',
              }}>
                <Stack.Screen name="login" />
                <Stack.Screen name="sign-up" />
                <Stack.Screen name="dashboard" />
                <Stack.Screen name="events" />
                <Stack.Screen name="event-detail" />
                <Stack.Screen name="edit-event" />
                <Stack.Screen name="profile" />
                <Stack.Screen name="create-event" />
                <Stack.Screen name="register-event" />
                <Stack.Screen name="my-qr" />
                <Stack.Screen name="scan-qr" />
                <Stack.Screen name="participants" />
                <Stack.Screen name="attendance" />
                <Stack.Screen name="reports" />
                <Stack.Screen name="my-registrations" />
                <Stack.Screen name="user-management" />
              </Stack>
          </View>
        </RegistrationsProvider>
      </EventsProvider>
    </DemoSessionContext.Provider>
  );
}
