import { Feather } from '@expo/vector-icons';
import { type RefObject } from 'react';
import { StyleSheet, Text, View, type View as ViewType } from 'react-native';
import { router } from 'expo-router';
import { FadeInDown } from 'react-native-reanimated';

import { AnimatedPressable } from '@/components/animated-pressable';
import { GlassSurface } from '@/components/glass-surface';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useResponsive } from '@/hooks/use-responsive';

export const NAV_ITEMS = [
  { key: 'home', label: 'Home', icon: 'home' },
  { key: 'events', label: 'Events', icon: 'calendar' },
  { key: 'profile', label: 'Profile', icon: 'user' },
] as const;

export type NavKey = (typeof NAV_ITEMS)[number]['key'];

type BottomNavProps = {
  activeKey: NavKey;
  blurTargetRef: RefObject<ViewType | null>;
};

/** Floating glass bottom navigation; the active tab sits on a blue pill. */
export function BottomNav({ activeKey, blurTargetRef }: BottomNavProps) {
  const { inset } = useResponsive();

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
          {NAV_ITEMS.map((item, index) => {
            const active = item.key === activeKey;

            return (
              <AnimatedPressable
                key={item.key}
                style={styles.item}
                entering={FadeInDown.delay(560 + index * 60).duration(460)}
                onPress={() => {
                  if (item.key === 'home') {
                    if (activeKey !== 'home') {
                      router.replace('/dashboard');
                    }
                    return;
                  }

                  if (item.key === 'events') {
                    if (activeKey !== 'events') {
                      router.push('/events');
                    }
                    return;
                  }

                  if (item.key === 'profile') {
                    if (activeKey !== 'profile') {
                      router.push('/profile');
                    }
                    return;
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

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingBottom: Spacing.three,
  },
  surface: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  item: {
    flex: 1,
    minWidth: 56,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: Spacing.two,
  },
  pill: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillActive: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  label: {
    fontFamily: 'System',
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  labelActive: {
    color: Colors.primary,
  },
});