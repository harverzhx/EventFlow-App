import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Colors, FontSize, Fonts, Radius, Spacing } from '@/constants/theme';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Feather.glyphMap;
  variant?: 'primary' | 'danger';
};

export function PrimaryButton({ label, onPress, icon, variant = 'primary' }: PrimaryButtonProps) {
  const danger = variant === 'danger';
  const press = useSharedValue(0);
  const hover = useSharedValue(0);
  const sheen = useSharedValue(0);

  const wrapperStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: -2 * hover.value },
      { scale: (1 + 0.015 * hover.value) * (1 - 0.04 * press.value) },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    shadowOpacity: 0.22 + 0.16 * hover.value,
    shadowRadius: 14 + 8 * hover.value,
    elevation: 6 + 4 * hover.value,
  }));

  const sheenStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -160 + 320 * sheen.value }, { rotate: '18deg' }],
    opacity: sheen.value > 0 && sheen.value < 1 ? 0.5 : 0,
  }));

  const runSheen = () => {
    sheen.value = 0;
    sheen.value = withTiming(1, { duration: 650 });
  };

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
    <Animated.View style={[styles.wrapper, wrapperStyle, glowStyle]}>
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          runSheen();
          onPress();
        }}
        onPressIn={() => {
          press.value = withTiming(1, { duration: 90 });
        }}
        onPressOut={() => {
          press.value = withTiming(0, { duration: 160 });
        }}
        {...hoverProps}
        style={styles.pressable}>
        <LinearGradient
          colors={danger ? [Colors.dangerLight, Colors.danger] : [Colors.primaryLight, Colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}>
          <View style={styles.content}>
            <Text style={styles.label}>{label}</Text>
            {icon ? <Feather name={icon} size={18} color={Colors.white} /> : null}
          </View>

          <Animated.View style={[styles.sheen, sheenStyle]} pointerEvents="none">
            <LinearGradient
              colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.85)', 'rgba(255,255,255,0)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sheenFill}
            />
          </Animated.View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
  },
  pressable: {
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  gradient: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  label: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.md,
    lineHeight: 22,
    fontWeight: '700',
    color: Colors.white,
  },
  sheen: {
    position: 'absolute',
    top: -40,
    bottom: -40,
    left: '50%',
    width: 70,
  },
  sheenFill: {
    flex: 1,
  },
});
