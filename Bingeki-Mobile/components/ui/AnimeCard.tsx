/**
 * Compact anime/manga card
 * Displays title, image, and score for discovery lists
 */
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { type JikanResult } from '@/services/api';

interface AnimeCardProps {
  item: JikanResult;
  onPress: () => void;
  width?: number;
}

export function AnimeCard({ item, onPress, width = 130 }: AnimeCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={{ width }}>
      <View style={styles.imageContainer}>
        <Image
          source={item.images?.jpg?.image_url}
          style={styles.image}
          contentFit="cover"
        />
        {item.score != null ? (
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>{item.score}</Text>
          </View>
        ) : null}
      </View>
      <ThemedText numberOfLines={2} style={styles.title}>{item.title}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    height: 185,
    borderWidth: 3,
    borderColor: '#000000',
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  scoreBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF2E63',
    borderWidth: 2,
    borderColor: '#000000',
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  scoreText: {
    color: '#FFFFFF',
    fontFamily: 'Outfit_900Black',
    fontSize: 9,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    lineHeight: 15,
  },
});
