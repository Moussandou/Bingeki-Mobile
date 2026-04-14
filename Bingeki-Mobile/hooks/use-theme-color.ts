/**
 * Resolves theme colors based on current system appearance
 */
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useThemeColor<T extends keyof typeof Colors.light & keyof typeof Colors.dark>(
  props: { light?: string; dark?: string },
  colorName: T
): (typeof Colors.light)[T] {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps as (typeof Colors.light)[T];
  } else {
    return Colors[theme][colorName];
  }
}

