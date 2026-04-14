/**
 * Form input component
 * Includes focus effects and icon support
 */
import React, { useState } from 'react';
import { StyleSheet, TextInput, View, TextInputProps, ViewStyle, Pressable } from 'react-native';
import { Colors, Fonts, Spacing, Borders } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ThemedText } from '../themed-text';
import { BrutalView } from './BrutalView';

export interface InputProps extends TextInputProps {
  error?: string | boolean;
  icon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export const Input = React.forwardRef<TextInput, InputProps>(
  ({ style, error, icon, containerStyle, onFocus, onBlur, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    const textColor = useThemeColor({}, 'text');
    const textDimColor = useThemeColor({}, 'textDim');
    const surfaceColor = useThemeColor({}, 'surface');
    const surfaceHoverColor = useThemeColor({}, 'surfaceHover');
    const primaryColor = useThemeColor({}, 'primary');
    const errorColor = useThemeColor({}, 'error');
    const borderHeavyColor = useThemeColor({}, 'borderHeavy');

    const handleFocus = (e: any) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: any) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const getBorderColor = () => {
      if (error) return errorColor;
      if (isFocused) return primaryColor;
      return borderHeavyColor;
    };

    const getBackgroundColor = () => {
      if (isFocused) return surfaceHoverColor;
      return surfaceColor;
    };

    return (
      <View style={[styles.wrapper, containerStyle]}>
        <BrutalView
          isPressed={isFocused}
          offset={4}
          borderRadius={Borders.mangaRadius}
          contentStyle={[
            styles.container,
            {
              backgroundColor: getBackgroundColor(),
              borderColor: getBorderColor(),
              borderWidth: Borders.width,
              borderRadius: Borders.mangaRadius,
            }
          ]}
        >
          {icon && <View style={styles.icon}>{icon}</View>}
          <TextInput
            ref={ref}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholderTextColor={textDimColor}
            style={[
              styles.input,
              { color: textColor },
              icon ? { paddingLeft: 44 } : {},
              style,
            ]}
            {...props}
          />
        </BrutalView>
        {typeof error === 'string' && (
          <ThemedText style={[styles.errorText, { color: errorColor }]}>
            {error}
          </ThemedText>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginBottom: Spacing.md,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    fontFamily: Fonts.body,
    height: '100%',
  },
  icon: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: Fonts.body,
  },
});
