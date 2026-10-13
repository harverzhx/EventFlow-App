import type { ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type EntryOrExitLayoutType,
} from 'react-native-reanimated';

import { Radius } from '@/constants/theme';

type AnimatedPressableProps = {
  children: ReactNode;
  onPress?: () => void;
  /** Layout styles for the animated wrapper. */
  style?: StyleProp<ViewStyle>;
  /** Visual styles for the pressable surface (background, padding, radius...). */
  surfaceStyle?: StyleProp<ViewStyle>;
  entering?: EntryOrExitLayoutType;
  accessibilityLabel?: string;
  accessibilityRole?: 'button' | 'link';
  hitSlop?: number;
  disabled?: boolean;
};

/**
 * Press feedback on every platform plus hover feedback on web, driven by
 * Reanimated shared values so no React re-render happens while interacting.
 */
export function AnimatedPressable({
  children,
  onPress,
  style,
  surfaceStyle,
  entering,
  accessibilityLabel,
  accessibilityRole = 'button',
  hitSlop,
  disabled,
}: AnimatedPressableProps) {
  const press = useSharedValue(0);
  const hover = useSharedValue(0);

  const wrapperStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: -3 * hover.value },
      { scale: (1 + 0.02 * hover.value) * (1 - 0.035 * press.value) },
    ],
    shadowOpacity: 0.08 + 0.14 * hover.value,
    shadowRadius: 12 + 10 * hover.value,
    shadowOffset: { width: 0, height: 4 + 4 * hover.value },
    elevation: 2 + 4 * hover.value,
  }));

  const hoverProps =
    Platform.OS === 'web'
      ? {
          onHoverIn: () => {
            hover.value = withTiming(1, { duration: 160 });
          },
          onHoverOut: () => {
            hover.value = withTiming(0, { duration: 220 });
          },
        }
      : {};

  return (
    <Animated.View entering={entering} style={[styles.wrapper, style]}>
      <Animated.View style={wrapperStyle}>
        <Pressable
          accessibilityRole={accessibilityRole}
          accessibilityLabel={accessibilityLabel}
          hitSlop={hitSlop}
          disabled={disabled}
          onPress={onPress}
          onPressIn={() => {
            press.value = withTiming(1, { duration: 90 });
          }}
          onPressOut={() => {
            press.value = withTiming(0, { duration: 160 });
          }}
          {...hoverProps}
          style={[styles.surface, surfaceStyle]}>
          {children}
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: Radius.lg,
    shadowColor: '#0B1F3A',
  },
  surface: {
    flexGrow: 1,
    borderRadius: Radius.lg,
  },
});
