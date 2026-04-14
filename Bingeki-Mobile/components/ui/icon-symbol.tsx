/**
 * Universal icon component
 * Maps SF Symbols (iOS) to Material Icons (Android/Web)
 */
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type MaterialIconName = ComponentProps<typeof MaterialIcons>['name'];

const MAPPING: Record<string, MaterialIconName> = {
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
  'tray': 'inbox',
  'eye': 'visibility',
  'eye.slash': 'visibility-off',
  'trash': 'delete-outline',
  'checkmark': 'check',
  'chevron.left': 'chevron-left',
  'envelope.fill': 'email',
  'lock.fill': 'lock',
  'lock.shield.fill': 'security',
  'logo-google': 'login', // MaterialIcons doesn't have google logo, using login icon
  'logo-discord': 'discord', 
};

export type IconSymbolName = keyof typeof MAPPING;

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
