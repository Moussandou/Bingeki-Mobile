/**
 * Rank calculation logic ported from the web version.
 */

export type Rank = 'F' | 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS';

export function calculateRank(level: number): Rank {
  if (level >= 100) return 'SSS';
  if (level >= 80) return 'SS';
  if (level >= 60) return 'S';
  if (level >= 45) return 'A';
  if (level >= 30) return 'B';
  if (level >= 20) return 'C';
  if (level >= 10) return 'D';
  if (level >= 5) return 'E';
  return 'F';
}

export function getRankColor(rank: Rank): string {
  switch (rank) {
    case 'SSS': return '#FFD700'; // Gold
    case 'SS': return '#FF4500';  // OrangeRed
    case 'S': return '#FF2E63';   // Primary Pink
    case 'A': return '#A020F0';   // Purple
    case 'B': return '#0000FF';   // Blue
    case 'C': return '#08D9D6';   // Secondary Cyan
    case 'D': return '#4CAF50';   // Green
    case 'E': return '#8BC34A';   // Light Green
    case 'F': return '#9E9E9E';   // Grey
    default: return '#9E9E9E';
  }
}
