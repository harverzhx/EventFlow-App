import { BlurView } from 'expo-blur';
import { GlassView, isGlassEffectAPIAvailable } from 'expo-glass-effect';
import type { ReactNode, RefObject } from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Radius } from '@/constants/theme';

const supportsLiquidGlass = Platform.OS === 'ios' && isGlassEffectAPIAvailable();

type GlassSurfaceProps = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
  intensity?: number;
  /** Translucent colour layered on top of the blur. */
  overlayColor?: string;
  /** iOS 26+ liquid glass tint. */
  tintColor?: string;
  glassStyle?: 'clear' | 'regular';
  isInteractive?: boolean;
  /** Android needs a BlurTargetView ref for the blur to render. */
  blurTarget?: RefObject<View | null>;
};

export function GlassSurface({
  children,
  style,
  borderRadius = Radius.lg,
  intensity = 45,
  overlayColor = 'rgba(255, 255, 255, 0.78)',
  tintColor,
  glassStyle = 'regular',
  isInteractive = false,
  blurTarget,
}: GlassSurfaceProps) {
  if (supportsLiquidGlass) {
    return (
      <GlassView
        style={[{ borderRadius }, style]}
        glassEffectStyle={glassStyle}
        isInteractive={isInteractive}
        tintColor={tintColor}>
        {children}
      </GlassView>
    );
  }

  return (
    <View style={[styles.clip, { borderRadius }, style]}>
      <BlurView
        style={StyleSheet.absoluteFill}
        intensity={intensity}
        tint="light"
        blurMethod="dimezisBlurViewSdk31Plus"
        blurTarget={blurTarget}
      />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: overlayColor }]} pointerEvents="none" />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  clip: {
    overflow: 'hidden',
  },
});
