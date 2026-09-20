import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../src/context/AppContext';
import { calculateSplit } from '../src/utils/scoring';
import { colors, spacing } from '../src/theme';

const BAR_COLORS = ['#e94560', '#f39c12', '#2ecc71', '#3498db', '#9b59b6', '#1abc9c'];

export default function ResultsScreen() {
  const { rooms, totalRent } = useApp();
  const rent = Number(totalRent) || 0;

  const results = useMemo(() => {
    const splits = calculateSplit(rooms, rent);
    return splits.sort((a, b) => b.rent - a.rent);
  }, [rooms, rent]);

  const maxScore = Math.max(...results.map((r) => r.score), 1);

  const shareText = useMemo(() => {
    let text = `🏠 Fair Rent Split — Total: $${rent}/mo\n\n`;
    results.forEach((r) => {
      text += `${r.roomName}: $${r.rent}/mo (${r.percentage}%)\n`;
    });
    text += `\nCalculated with Fair Split app ✨`;
    return text;
  }, [results, rent]);

  const handleShare = async () => {
    try {
      await Share.share({ message: shareText });
    } catch {
      Alert.alert('Error', 'Could not share results');
    }
  };

  if (rent === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Stack.Screen options={{ title: 'Results' }} />
        <Text style={styles.emptyEmoji}>💰</Text>
        <Text style={styles.emptyText}>Enter total rent first!</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Stack.Screen options={{ title: 'Results' }} />

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Total Rent</Text>
        <Text style={styles.summaryAmount}>${rent.toLocaleString()}</Text>
        <Text style={styles.summaryLabel}>/month split across {rooms.length} rooms</Text>
      </View>

      {/* Breakdown */}
      <Text style={styles.sectionTitle}>Fair Split Breakdown</Text>

      {results.map((result, idx) => {
        const barWidth = `${(result.score / maxScore) * 100}%`;
        const color = BAR_COLORS[idx % BAR_COLORS.length];

        return (
          <View key={result.roomId} style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <View>
                <Text style={styles.roomName}>{result.roomName}</Text>
                <Text style={styles.scoreLine}>
                  Score: {result.score} pts · {result.percentage}%
                </Text>
              </View>
              <View style={styles.rentBadge}>
                <Text style={styles.rentAmount}>${result.rent}</Text>
                <Text style={styles.rentPer}>/mo</Text>
              </View>
            </View>

            {/* Score Bar */}
            <View style={styles.barBg}>
              <View
                style={[styles.barFill, { width: barWidth as any, backgroundColor: color }]}
              />
            </View>

            {/* Room features */}
            <View style={styles.featureTags}>
              {rooms
                .filter((r) => r.id === result.roomId)
                .map((room) => (
                  <React.Fragment key={room.id}>
                    <Text style={styles.featureTag}>{room.sqft} sqft</Text>
                    {room.hasBathroom && <Text style={styles.featureTag}>🚿 Bath</Text>}
                    {room.hasBalcony && <Text style={styles.featureTag}>🌿 Balcony</Text>}
                    {room.hasWindow && (
                      <Text style={styles.featureTag}>
                        ☀️ {'●'.repeat(room.naturalLight)}
                      </Text>
                    )}
                    {room.noiseLevel === 1 && <Text style={styles.featureTag}>🤫 Quiet</Text>}
                  </React.Fragment>
                ))}
            </View>
          </View>
        );
      })}

      {/* How it works */}
      <View style={styles.explainerCard}>
        <Text style={styles.explainerTitle}>How scoring works</Text>
        <Text style={styles.explainerText}>
          Each room is scored based on: size (40%), private bathroom (20%), natural
          light (10%), closet (10%), balcony (10%), and noise level (10%). The rent
          is split proportionally to each room's score.
        </Text>
      </View>

      {/* Share */}
      <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
        <Ionicons name="share-outline" size={22} color="#fff" />
        <Text style={styles.shareBtnText}>Share with Roommates</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: spacing.md },
  summaryCard: {
    backgroundColor: colors.accent,
    borderRadius: 20,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  summaryLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  summaryAmount: {
    color: '#fff',
    fontSize: 42,
    fontWeight: '800',
    marginVertical: 4,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  resultCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  roomName: { color: colors.white, fontSize: 17, fontWeight: '700' },
  scoreLine: { color: colors.textDim, fontSize: 13, marginTop: 2 },
  rentBadge: { flexDirection: 'row', alignItems: 'baseline' },
  rentAmount: { color: colors.accent, fontSize: 26, fontWeight: '800' },
  rentPer: { color: colors.textDim, fontSize: 13, marginLeft: 2 },
  barBg: {
    height: 8,
    backgroundColor: colors.cardLight,
    borderRadius: 4,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  barFill: { height: 8, borderRadius: 4 },
  featureTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: spacing.sm,
  },
  featureTag: {
    backgroundColor: colors.cardLight,
    color: colors.textDim,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    fontSize: 11,
    overflow: 'hidden',
  },
  explainerCard: {
    backgroundColor: colors.cardLight,
    borderRadius: 16,
    padding: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  explainerTitle: { color: colors.text, fontSize: 14, fontWeight: '600', marginBottom: 6 },
  explainerText: { color: colors.textDim, fontSize: 13, lineHeight: 20 },
  shareBtn: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  shareBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  emptyEmoji: { fontSize: 56 },
  emptyText: { color: colors.text, fontSize: 18, marginTop: spacing.md },
});
