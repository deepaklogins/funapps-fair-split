import { Room, SplitResult } from '../types';

const BASE_SCORE = 30; // Every room gets a minimum score

export function scoreRoom(room: Room): number {
  let score = BASE_SCORE;

  // Size: 1 point per 10 sqft (biggest factor)
  score += room.sqft / 10;

  // Natural light (0-10 points)
  if (room.hasWindow) {
    score += room.naturalLight * 3; // 3, 6, or 9
  }

  // Closet (0-9 points)
  if (room.hasCloset) {
    score += room.closetSize * 3; // 3, 6, or 9
  }

  // Private bathroom (big perk: 15 points)
  if (room.hasBathroom) {
    score += 15;
  }

  // Balcony (8 points)
  if (room.hasBalcony) {
    score += 8;
  }

  // Noise penalty (quiet=0, moderate=-4, noisy=-8)
  score -= (room.noiseLevel - 1) * 4;

  return score;
}

export function calculateSplit(
  rooms: Room[],
  totalRent: number
): SplitResult[] {
  if (rooms.length === 0) return [];

  const scores = rooms.map((room) => ({
    room,
    score: scoreRoom(room),
  }));

  const totalScore = scores.reduce((sum, s) => sum + s.score, 0);

  const results = scores.map(({ room, score }) => {
    const percentage = totalScore > 0 ? (score / totalScore) * 100 : 100 / rooms.length;
    const rent = Math.round((percentage / 100) * totalRent);

    return {
      roomId: room.id,
      roomName: room.name,
      roommateName: '',
      score: Math.round(score * 10) / 10,
      percentage: Math.round(percentage * 10) / 10,
      rent,
    };
  });

  // Fix rounding remainder: assign difference to the highest-scoring room
  const roundedSum = results.reduce((sum, r) => sum + r.rent, 0);
  const remainder = totalRent - roundedSum;
  if (remainder !== 0 && results.length > 0) {
    const highestIdx = results.reduce(
      (maxIdx, r, idx, arr) => (r.score > arr[maxIdx].score ? idx : maxIdx),
      0
    );
    results[highestIdx].rent += remainder;
  }

  return results;
}
