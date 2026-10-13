import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Colors, FontSize, Fonts, Spacing } from '@/constants/theme';

type BrandLogoProps = {
  size?: number;
  subtitle?: string;
  /** Adds a slow floating motion and a soft glow behind the mark. */
  animated?: boolean;
};

export function BrandLogo({ size = 96, subtitle, animated = false }: BrandLogoProps) {
  const float = useSharedValue(0);

  useEffect(() => {
    if (!animated) {
      return;
    }

    float.value = withDelay(
      200,
      withRepeat(
        withSequence(withTiming(1, { duration: 2600 }), withTiming(0, { duration: 2600 })),
        -1,
        false
      )
    );
  }, [animated, float]);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -7 * float.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.55 + 0.35 * float.value,
  }));

  const mark = (
    <Image
      source={require('@/assets/brand/png/mark-512.png')}
      style={{ width: size, height: size, borderRadius: size * 0.234 }}
      contentFit="contain"
    />
  );

  return (
    <View style={styles.container}>
      <View style={{ width: size, height: size }}>
        {animated ? (
          <Animated.View
            style={[
              styles.glow,
              {
                width: size * 1.7,
                height: size * 1.7,
                borderRadius: size * 0.85,
                top: -size * 0.35,
                left: -size * 0.35,
              },
              glowStyle,
            ]}>
            <LinearGradient
              colors={['rgba(60, 159, 254, 0.55)', 'rgba(60, 159, 254, 0)']}
              start={{ x: 0.2, y: 0.1 }}
              end={{ x: 0.8, y: 0.9 }}
              style={styles.glowFill}
            />
          </Animated.View>
        ) : null}

        {animated ? <Animated.View style={floatStyle}>{mark}</Animated.View> : mark}
      </View>

      <Text style={[styles.wordmark, { fontSize: size * 0.34 }]}>
        Event<Text style={styles.wordmarkAccent}>Flow</Text>
      </Text>

      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  glow: {
    position: 'absolute',
    overflow: 'hidden',
  },
  glowFill: {
    flex: 1,
    borderRadius: 999,
  },
  wordmark: {
    fontFamily: Fonts.sans,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: Colors.navy,
  },
  wordmarkAccent: {
    color: Colors.primary,
  },
  subtitle: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.md,
    lineHeight: 22,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
