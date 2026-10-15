import { Colors } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import { forwardRef, useState } from 'react';
import { Pressable, Text, TextInput, View, type TextInputProps } from 'react-native';
import Animated, { interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import styles from '@/styles/form-field.styles';

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
