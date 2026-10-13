import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/theme';

export default function RootLayout() {
  return (
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
        <Stack.Screen name="profile" />
        <Stack.Screen name="create-event" />
        <Stack.Screen name="register-event" />
        <Stack.Screen name="my-qr" />
        <Stack.Screen name="scan-qr" />
        <Stack.Screen name="participants" />
        <Stack.Screen name="attendance" />
        <Stack.Screen name="reports" />
        <Stack.Screen name="my-registrations" />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
