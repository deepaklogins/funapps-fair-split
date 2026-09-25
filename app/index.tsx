import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../src/context/AppContext';
import { colors, spacing } from '../src/theme';

function sanitizeRent(value: string): string {
  return value.replace(/,/g, '');
}

export default function HomeScreen() {
  const router = useRouter();
  const { rooms, totalRent, setTotalRent, removeRoom } = useApp();

  const canCalculate = rooms.length >= 2 && Number(sanitizeRent(totalRent)) > 0;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Fair Split',
          headerRight: () =>
            rooms.length >= 2 ? (
              <TouchableOpacity onPress={() => router.push('/results')}>
                <Ionicons name="calculator" size={24} color={colors.accent} />
              </TouchableOpacity>
            ) : null,
        }}
      />

      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>🏠</Text>
        <Text style={styles.heroTitle}>Fair Rent Splitter</Text>
        <Text style={styles.heroSub}>
          Score each room. Split rent fairly. No more arguments.
        </Text>
      </View>

      {/* Total Rent Input */}
      <View style={styles.rentCard}>
        <Text style={styles.label}>Total Monthly Rent</Text>
        <View style={styles.rentInputRow}>
          <Text style={styles.currency}>$</Text>
          <TextInput
            style={styles.rentInput}
            value={totalRent}
            onChangeText={(text) => setTotalRent(sanitizeRent(text))}
            keyboardType="numeric"
            placeholder="2,400"
            placeholderTextColor={colors.textDim}
          />
        </View>
      </View>

      {/* Rooms List */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Rooms ({rooms.length})
        </Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push('/add-room')}
        >
          <Ionicons name="add-circle" size={20} color={colors.accent} />
          <Text style={styles.addBtnText}>Add Room</Text>
        </TouchableOpacity>
      </View>

      {rooms.length === 0 ? (
        <TouchableOpacity
          style={styles.emptyCard}
          onPress={() => router.push('/add-room')}
        >
          <Ionicons name="bed-outline" size={48} color={colors.textDim} />
          <Text style={styles.emptyText}>Tap to add your first room</Text>
          <Text style={styles.emptySubText}>
            Add at least 2 rooms to calculate fair rent
          </Text>
        </TouchableOpacity>
      ) : (
        <FlatList
          data={rooms}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View style={styles.roomCard}>
              <View style={styles.roomInfo}>
                <Text style={styles.roomName}>{item.name}</Text>
                <View style={styles.roomTags}>
                  <Text style={styles.tag}>{item.sqft} sqft</Text>
                  {item.hasBathroom && (
                    <Text style={[styles.tag, styles.tagGreen]}>🚿 Bath</Text>
                  )}
                  {item.hasBalcony && (
                    <Text style={[styles.tag, styles.tagBlue]}>🌿 Balcony</Text>
                  )}
                  {item.hasWindow && (
                    <Text style={styles.tag}>
                      ☀️ {'●'.repeat(item.naturalLight)}
                    </Text>
                  )}
                  {item.noiseLevel === 1 && (
                    <Text style={[styles.tag, styles.tagGreen]}>🤫 Quiet</Text>
                  )}
                  {item.noiseLevel === 3 && (
                    <Text style={[styles.tag, styles.tagRed]}>📢 Noisy</Text>
                  )}
                </View>
              </View>
              <TouchableOpacity
                onPress={() =>
                  Alert.alert('Remove Room', `Delete "${item.name}"?`, [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: () => removeRoom(item.id),
                    },
                  ])
                }
              >
                <Ionicons name="trash-outline" size={22} color={colors.accent} />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {/* Calculate Button */}
      {rooms.length >= 2 && (
        <TouchableOpacity
          style={[styles.calcBtn, !canCalculate && styles.calcBtnDisabled]}
          disabled={!canCalculate}
          onPress={() => router.push('/results')}
        >
          <Ionicons name="calculator" size={22} color="#fff" />
          <Text style={styles.calcBtnText}>Calculate Fair Split</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: spacing.md },
  hero: { alignItems: 'center', paddingVertical: spacing.lg },
  heroEmoji: { fontSize: 56 },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.white,
    marginTop: spacing.sm,
  },
  heroSub: {
    fontSize: 14,
    color: colors.textDim,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  rentCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  label: { color: colors.textDim, fontSize: 13, marginBottom: spacing.xs },
  rentInputRow: { flexDirection: 'row', alignItems: 'center' },
  currency: { color: colors.accent, fontSize: 28, fontWeight: '700', marginRight: spacing.sm },
  rentInput: {
    flex: 1,
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: { color: colors.text, fontSize: 16, fontWeight: '600' },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  addBtnText: { color: colors.accent, fontWeight: '600' },
  emptyCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  emptyText: { color: colors.text, fontSize: 16, marginTop: spacing.md },
  emptySubText: { color: colors.textDim, fontSize: 13, marginTop: spacing.xs },
  roomCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  roomInfo: { flex: 1 },
  roomName: { color: colors.white, fontSize: 17, fontWeight: '700' },
  roomTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  tag: {
    backgroundColor: colors.cardLight,
    color: colors.textDim,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    fontSize: 12,
    overflow: 'hidden',
  },
  tagGreen: { color: colors.success },
  tagBlue: { color: '#3498db' },
  tagRed: { color: colors.accent },
  calcBtn: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.md,
    right: spacing.md,
    backgroundColor: colors.accent,
    borderRadius: 16,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  calcBtnDisabled: { opacity: 0.5 },
  calcBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
