import { Text, View, type View as ViewType } from 'react-native';
import { Colors, Radius } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import { type RefObject } from 'react';
import { router } from 'expo-router';
import { FadeInDown } from 'react-native-reanimated';
import { AnimatedPressable } from '@/components/animated-pressable';
import { GlassSurface } from '@/components/glass-surface';
import { useDemoSession } from '@/context/demo-session';
import type { UserRole } from '@/data/mock';
import { useResponsive } from '@/hooks/use-responsive';
import styles from '@/styles/bottom-nav.styles';

type NavItem = { key: string; label: string; icon: 'home' | 'calendar' | 'maximize' | 'user' };

/** Role-aware bottom navigation items (demo). */
function navItemsForRole(role: UserRole | null): NavItem[] {
  if (role === 'staff') {
    return [
      { key: 'home', label: 'Home', icon: 'home' },
      { key: 'events', label: 'Events', icon: 'calendar' },
      { key: 'scan', label: 'Scan', icon: 'maximize' },
      { key: 'profile', label: 'Profile', icon: 'user' },
    ];
  }

  // admin and participant both browse events
  return [
    { key: 'home', label: 'Home', icon: 'home' },
    { key: 'events', label: 'Events', icon: 'calendar' },
    { key: 'profile', label: 'Profile', icon: 'user' },
  ];
}

type BottomNavProps = {
  activeKey: string;
  blurTargetRef: RefObject<ViewType | null>;
};

/** Floating glass bottom navigation; the active tab sits on a blue pill. */
export function BottomNav({ activeKey, blurTargetRef }: BottomNavProps) {
  const { role } = useDemoSession();
  const { inset } = useResponsive();
  const items = navItemsForRole(role);

  return (
    <View
      style={[styles.container, { paddingHorizontal: inset }]}
      pointerEvents="box-none">
      <GlassSurface
        style={styles.surface}
        borderRadius={Radius.pill}
        blurTarget={blurTargetRef}
        intensity={60}
        overlayColor="rgba(255, 255, 255, 0.82)"
        tintColor="rgba(255, 255, 255, 0.82)"
        isInteractive>
        <View style={styles.row}>
          {items.map((item, index) => {
            const active = item.key === activeKey;

            return (
              <AnimatedPressable
                key={item.key}
                style={styles.item}
                entering={FadeInDown.delay(560 + index * 60).duration(460)}
                onPress={() => {
                  if (active) {
                    return;
                  }

                  if (item.key === 'home') {
                    router.replace('/dashboard');
                  } else if (item.key === 'events') {
                    router.push('/events');
                  } else if (item.key === 'scan') {
                    router.push('/scan-qr');
                  } else if (item.key === 'profile') {
                    router.push('/profile');
                  }
                }}>
                <View style={[styles.pill, active && styles.pillActive]}>
                  <Feather
                    name={item.icon}
                    size={20}
                    color={active ? Colors.white : Colors.primary}
                  />
                </View>
                <Text style={[styles.label, active && styles.labelActive]}>{item.label}</Text>
              </AnimatedPressable>
            );
          })}
        </View>
      </GlassSurface>
    </View>
  );
}
