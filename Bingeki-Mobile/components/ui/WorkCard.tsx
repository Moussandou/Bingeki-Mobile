import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { type Work } from '@/store/libraryStore';
import { BrutalView } from './BrutalView';

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
      <View style={styles.shadowOuter}>
        <View style={styles.brutalShadow} />

        <View style={styles.card}>
            <View style={styles.imageArea}>
                <Image source={item.image} style={styles.image} contentFit="cover" />
                
                {item.score != null && (
                    <View style={styles.badgeTopRight}>
                        <BrutalView offset={2} borderRadius={0} contentStyle={styles.scoreBadge}>
                            <Text style={styles.badgeText}>{item.score}</Text>
                        </BrutalView>
                    </View>
                )}

                <View style={styles.badgeTopLeft}>
                    <BrutalView 
                        offset={2} 
                        borderRadius={0} 
                        contentStyle={[styles.typeBadge, { backgroundColor: item.type === 'manga' ? '#08D9D6' : '#FF2E63' }]}
                    >
                        <Text style={[styles.badgeText, styles.typeBadgeText]}>{item.type.toUpperCase()}</Text>
                    </BrutalView>
                </View>

                <View style={styles.titleOverlay}>
                    <Text style={styles.titleText} numberOfLines={2}>{item.title}</Text>
                </View>
            </View>

            <View style={styles.footer}>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${progressPct}%`, backgroundColor: getProgressColor(item.status) }]} />
                </View>
                <View style={styles.footerRow}>
                    <BrutalView offset={2} borderRadius={0} contentStyle={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
                        <Text style={[styles.statusText, { color: statusColor.text }]}>
                            {item.status.replace('_', ' ').toUpperCase()}
                        </Text>
                    </BrutalView>

                    <BrutalView offset={2} borderRadius={0} contentStyle={styles.incrementBtn}>
                        <TouchableOpacity onPress={onIncrement} activeOpacity={0.7} style={styles.incrementInner}>
                            <Text style={styles.incrementText}>+</Text>
                        </TouchableOpacity>
                    </BrutalView>
                </View>
            </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  shadowOuter: {
    marginBottom: 20,
    position: 'relative',
  },
  brutalShadow: {
    position: 'absolute',
    inset: 0,
    backgroundColor: '#000000',
    transform: [{ translateX: 4 }, { translateY: 4 }],
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#000000',
    overflow: 'hidden',
  },
  imageArea: {
    height: 140,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeTopRight: {
    position: 'absolute',
    top: 6,
    right: 6,
  },
  badgeTopLeft: {
    position: 'absolute',
    top: 6,
    left: 6,
  },
  scoreBadge: {
    backgroundColor: '#FF2E63',
    borderWidth: 1.5,
    borderColor: '#000000',
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  typeBadge: {
    borderWidth: 1.5,
    borderColor: '#000000',
    paddingHorizontal: 6,
    paddingVertical: 3,
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
    padding: 6,
  },
  titleText: {
    color: '#FFFFFF',
    fontFamily: 'Outfit_900Black',
    fontSize: 10,
  },
  footer: {
    padding: 10,
    gap: 10,
  },
  progressBar: {
    backgroundColor: '#F0F0F0',
    borderWidth: 1.5,
    borderColor: '#000000',
    height: 10,
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.2)',
  },
  statusText: {
    fontSize: 9,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.5,
  },
  incrementBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
  },
  incrementInner: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  incrementText: {
    color: '#000000',
    fontFamily: 'Outfit_900Black',
    fontSize: 18,
    lineHeight: 20,
  },
});
