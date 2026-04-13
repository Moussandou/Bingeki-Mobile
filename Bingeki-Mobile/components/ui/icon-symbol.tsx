/**
 * Abstract icon component
 * Maps SF Symbols (iOS) to Material Icons (Android/Web)
 */
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Partial<Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>>;
type IconSymbolName = keyof typeof MAPPING;

const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'book.closed.fill': 'book',
  'person.3.fill': 'people',
  'person.fill': 'person-outline',
  'magnifyingglass': 'search',
  'squareshape.fill': 'dashboard',
  'safari': 'explore',
  'rectangle.portrait.and.arrow.right': 'exit-to-app', // logout
  'gearshape.fill': 'settings', // settings
  'clock.arrow.circlepath': 'history', // history
  'calendar': 'calendar-today', // calendar
  'bubble.left': 'chat-bubble-outline', // chat
  'ticket.fill': 'confirmation-number',
  'star.fill': 'rate-review',
  'camera.viewfinder': 'filter-center-focus',
  'newspaper.fill': 'article',
  'person.2.fill': 'people-outline',
  'ellipsis': 'more-horiz',
  'xmark': 'close',
  'line.3.horizontal': 'menu',
  'chevron.down.2': 'keyboard-double-arrow-down',
  'flame.fill': 'local-fire-department',
  'target': 'track-changes',
  'chart.bar.fill': 'bar-chart',
  'plus': 'add',
  'arrow.up.right': 'show-chart',
  'book.fill': 'book',
} as const satisfies IconMapping;


export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
