import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Colors, FontSize, Fonts } from '@/constants/theme';

type LinkButtonProps = {
  label: string;
  onPress: () => void;
};

/** Underline that wipes in on hover (web) and on press (every platform). */
export function LinkButton({ label, onPress }: LinkButtonProps) {
  const progress = useSharedValue(0);

  const underlineStyle = useAnimatedStyle(() => ({
    opacity: 0.2 + 0.8 * progress.value,
    transform: [{ scaleX: 0.55 + 0.45 * progress.value }],
  }));

  const hoverProps =
    Platform.OS === 'web'
      ? {
          onHoverIn: () => {
            progress.value = withTiming(1, { duration: 220 });
          },
          onHoverOut: () => {
            progress.value = withTiming(0, { duration: 260 });
          },
        }
      : {};

  return (
    <Pressable
      accessibilityRole="link"
      onPress={onPress}
      hitSlop={8}
      onPressIn={() => {
        progress.value = withTiming(1, { duration: 140 });
      }}
      onPressOut={() => {
        progress.value = withTiming(0, { duration: 240 });
      }}
      {...hoverProps}>
      <View>
        <Text style={styles.label}>{label}</Text>
        <Animated.View style={[styles.underline, underlineStyle]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.sm,
    lineHeight: 20,
    fontWeight: '700',
    color: Colors.primary,
  },
  underline: {
    height: 1.5,
    borderRadius: 1,
    backgroundColor: Colors.primary,
    transformOrigin: 'left',
  },
});
