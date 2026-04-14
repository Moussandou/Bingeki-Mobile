import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { type Work } from '@/store/libraryStore';

interface WorkCardProps {
  item: Work;
  onPress: () => void;
  onIncrement: () => void;
}

const STATUS_COLORS: Record<Work['status'], { bg: string; text: string }> = {
  reading: { bg: '#1a2a1a', text: '#4CAF50' },
  completed: { bg: '#081a14', text: '#08D9D6' },
  on_hold: { bg: '#1a1a2a', text: '#8888ff' },
  dropped: { bg: '#2a1a1a', text: '#ff4444' },
  plan_to_read: { bg: '#1a1a1a', text: '#666666' },
};

function getProgressColor(status: Work['status']): string {
  if (status === 'reading') return '#FF2E63';
  if (status === 'completed') return '#08D9D6';
  return '#666666';
}

export function WorkCard({ item, onPress, onIncrement }: WorkCardProps) {
  const statusColor = STATUS_COLORS[item.status] ?? STATUS_COLORS.plan_to_read;
  const progressPct = ((item.currentChapter || 0) / (item.totalChapters || 1)) * 100;

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <View style={styles.card}>
        {/* Image area */}
        <View style={styles.imageArea}>
          <Image source={item.image} style={styles.image} contentFit="cover" />
          {item.score != null && (
            <View style={styles.scoreBadge}>
              <Text style={styles.badgeText}>{item.score}</Text>
            </View>
          )}
          <View style={[styles.typeBadge, { backgroundColor: item.type === 'manga' ? '#08D9D6' : '#FF2E63' }]}>
            <Text style={[styles.badgeText, styles.typeBadgeText]}>{item.type.toUpperCase()}</Text>
          </View>
          <View style={styles.titleOverlay}>
            <Text style={styles.titleText} numberOfLines={2}>{item.title}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPct}%`, backgroundColor: getProgressColor(item.status) }]} />
          </View>
          <View style={styles.footerRow}>
            <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
              <Text style={[styles.statusText, { color: statusColor.text }]}>
                {item.status.replace('_', ' ').toUpperCase()}
              </Text>
            </View>
            <TouchableOpacity style={styles.incrementBtn} onPress={onIncrement} activeOpacity={0.8}>
              <Text style={styles.incrementText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e1e1e',
    borderWidth: 2.5,
    borderColor: '#000000',
    borderRadius: 6,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  imageArea: {
    height: 140,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  scoreBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF2E63',
    borderWidth: 1.5,
    borderColor: '#000000',
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  typeBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    borderWidth: 1.5,
    borderColor: '#000000',
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#FFFFFF',
    fontFamily: 'Outfit_900Black',
    fontSize: 8,
  },
  typeBadgeText: {
    color: '#000000',
  },
  titleOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    padding: 4,
  },
  titleText: {
    color: '#FFFFFF',
    fontFamily: 'Outfit_900Black',
    fontSize: 9,
  },
  footer: {
    padding: 6,
    gap: 6,
  },
  progressBar: {
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#222222',
    height: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  statusText: {
    fontSize: 8,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.5,
  },
  incrementBtn: {
    width: 28,
    height: 28,
    backgroundColor: '#FF2E63',
    borderWidth: 1.5,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  incrementText: {
    color: '#FFFFFF',
    fontFamily: 'Outfit_900Black',
    fontSize: 16,
  },
});
