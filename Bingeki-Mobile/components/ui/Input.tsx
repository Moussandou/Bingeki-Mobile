/**
 * Form input component
 * Includes focus effects and icon support
 */
import React, { useState } from 'react';
import { StyleSheet, TextInput, View, TextInputProps, ViewStyle } from 'react-native';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ThemedText } from '../themed-text';

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
    const primaryGlowColor = useThemeColor({}, 'primaryGlow');
    const primaryColor = useThemeColor({}, 'primary');
    const errorColor = useThemeColor({}, 'error');

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
      return 'rgba(0, 0, 0, 0.1)';
    };

    const getBackgroundColor = () => {
      if (isFocused) return surfaceHoverColor;
      return surfaceColor;
    };

    const getShadowStyles = () => {
      if (error && isFocused) {
        return {
          shadowColor: errorColor,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
          elevation: 2,
        };
      }
      if (isFocused) {
        return {
          shadowColor: primaryGlowColor,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 1,
          shadowRadius: 2,
          elevation: 2,
        };
      }
      return {};
    };

    return (
      <View style={[styles.wrapper, containerStyle]}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: getBackgroundColor(),
              borderColor: getBorderColor(),
            },
            getShadowStyles(),
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
        </View>
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
    borderWidth: 1,
    borderRadius: 4,
    minHeight: 48,
    backgroundColor: 'transparent',
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
