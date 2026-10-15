import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import styles from '@/styles/aurora-background.styles';

type AuroraBackgroundProps = {
  /** Keeps the wash subtle on screens that already have a coloured header. */
  intensity?: number;
};

type GlowProps = {
  size: number;
  top: number;
  left: number;
  color: string;
  maxAlpha: number;
  driftX: number;
  driftY: number;
  scaleX: number;
  /** Offsets the drift so the glows do not move in lockstep. */
  phase: number;
};

function Glow({ size, top, left, color, maxAlpha, driftX, driftY, scaleX, phase }: GlowProps) {
  const progress = useSharedValue(phase);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 12000, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const value = (progress.value + phase) % 1;

    return {
      transform: [
        { translateX: driftX * (value - 0.5) },
        { translateY: driftY * (value - 0.5) },
        { scale: 1 + scaleX * (value - 0.5) },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.glow,
        { width: size, height: size, borderRadius: size / 2, top, left },
        animatedStyle,
      ]}>
      <LinearGradient
        colors={[`${color}${Math.round(maxAlpha * 255).toString(16).padStart(2, '0')}`, `${color}00`]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.glowFill}
      />
    </Animated.View>
  );
}

/**
 * Slow drifting colour wash used as the backdrop for glass surfaces.
 * Purely decorative: never intercepts touches.
 */
export function AuroraBackground({ intensity = 1 }: AuroraBackgroundProps) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Glow
        size={360}
        top={-140}
        left={-120}
        color="#0274DF"
        maxAlpha={0.16 * intensity}
        driftX={44}
        driftY={30}
        scaleX={0.18}
        phase={0}
      />
      <Glow
        size={300}
        top={40}
        left={210}
        color="#3C9FFE"
        maxAlpha={0.14 * intensity}
        driftX={-38}
        driftY={26}
        scaleX={0.16}
        phase={0.33}
      />
      <Glow
        size={280}
        top={260}
        left={-90}
        color="#208AEF"
        maxAlpha={0.12 * intensity}
        driftX={30}
        driftY={-34}
        scaleX={0.2}
        phase={0.66}
      />
    </View>
  );
}
