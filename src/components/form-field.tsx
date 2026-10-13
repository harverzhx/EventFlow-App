import { Feather } from '@expo/vector-icons';
import { forwardRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Colors, FontSize, Fonts, Radius, Spacing } from '@/constants/theme';

type FormFieldProps = TextInputProps & {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  error?: string;
};

export const FormField = forwardRef<TextInput, FormFieldProps>(function FormField(
  { label, icon, error, secureTextEntry, style, ...rest },
  ref
) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(secureTextEntry ?? false);
  const focusProgress = useSharedValue(0);

  const rowStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      focusProgress.value,
      [0, 1],
      [error ? Colors.danger : Colors.border, Colors.primary]
    ),
    shadowOpacity: interpolate(focusProgress.value, [0, 1], [0, 0.16]),
    shadowRadius: interpolate(focusProgress.value, [0, 1], [4, 14]),
    elevation: interpolate(focusProgress.value, [0, 1], [0, 3]),
    transform: [{ scale: interpolate(focusProgress.value, [0, 1], [1, 1.01]) }],
  }));

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <Animated.View style={[styles.inputRow, rowStyle]}>
        <Feather name={icon} size={18} color={focused ? Colors.primary : Colors.textMuted} />

        <TextInput
          ref={ref}
          style={[styles.input, style]}
          placeholderTextColor={Colors.textMuted}
          secureTextEntry={secureTextEntry ? hidden : false}
          onFocus={(event) => {
            setFocused(true);
            focusProgress.value = withTiming(1, { duration: 180 });
            rest.onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            focusProgress.value = withTiming(0, { duration: 220 });
            rest.onBlur?.(event);
          }}
          {...rest}
        />

        {secureTextEntry ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
            hitSlop={8}
            onPress={() => setHidden((value) => !value)}>
            <Feather name={hidden ? 'eye' : 'eye-off'} size={18} color={Colors.textMuted} />
          </Pressable>
        ) : null}
      </Animated.View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  field: {
    gap: Spacing.two,
  },
  label: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.sm,
    lineHeight: 20,
    fontWeight: '600',
    color: Colors.text,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    height: 56,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
    shadowColor: Colors.primary,
  },
  input: {
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: FontSize.md,
    lineHeight: 22,
    color: Colors.text,
  },
  error: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.xs,
    lineHeight: 18,
    color: Colors.danger,
  },
});
