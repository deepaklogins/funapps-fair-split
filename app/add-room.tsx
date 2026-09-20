import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useApp } from '../src/context/AppContext';
import { Room } from '../src/types';
import { colors, spacing } from '../src/theme';

type Level = 1 | 2 | 3;

function LevelPicker({
  label,
  value,
  onChange,
  labels,
}: {
  label: string;
  value: Level;
  onChange: (v: Level) => void;
  labels: [string, string, string];
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.levelRow}>
        {([1, 2, 3] as Level[]).map((lvl) => (
          <TouchableOpacity
            key={lvl}
            style={[styles.levelBtn, value === lvl && styles.levelBtnActive]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onChange(lvl);
            }}
          >
            <Text
              style={[
                styles.levelBtnText,
                value === lvl && styles.levelBtnTextActive,
              ]}
            >
              {labels[lvl - 1]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function ToggleRow({
  label,
  icon,
  value,
  onChange,
}: {
  label: string;
  icon: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleIcon}>{icon}</Text>
      <Text style={styles.toggleLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={(v) => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onChange(v);
        }}
        trackColor={{ false: colors.border, true: colors.accent }}
        thumbColor={colors.white}
      />
    </View>
  );
}

export default function AddRoomScreen() {
  const router = useRouter();
  const { addRoom, rooms } = useApp();

  const [name, setName] = useState(`Room ${rooms.length + 1}`);
  const [sqft, setSqft] = useState('');
  const [hasWindow, setHasWindow] = useState(true);
  const [naturalLight, setNaturalLight] = useState<Level>(2);
  const [hasCloset, setHasCloset] = useState(true);
  const [closetSize, setClosetSize] = useState<Level>(2);
  const [hasBathroom, setHasBathroom] = useState(false);
  const [hasBalcony, setHasBalcony] = useState(false);
  const [noiseLevel, setNoiseLevel] = useState<Level>(2);

  const canSave = name.trim().length > 0 && Number(sqft) > 0;

  const handleSave = () => {
    const room: Room = {
      id: Date.now().toString(),
      name: name.trim(),
      sqft: Number(sqft),
      hasWindow,
      naturalLight: hasWindow ? naturalLight : 1,
      hasCloset,
      closetSize: hasCloset ? closetSize : 1,
      hasBathroom,
      hasBalcony,
      noiseLevel,
    };
    addRoom(room);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Stack.Screen options={{ title: 'Add Room' }} />

      {/* Name */}
      <View style={styles.card}>
        <Text style={styles.fieldLabel}>Room Name</Text>
        <TextInput
          style={styles.textInput}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Master Bedroom"
          placeholderTextColor={colors.textDim}
        />
      </View>

      {/* Size */}
      <View style={styles.card}>
        <Text style={styles.fieldLabel}>Room Size (sq ft)</Text>
        <TextInput
          style={styles.textInput}
          value={sqft}
          onChangeText={setSqft}
          keyboardType="numeric"
          placeholder="e.g. 150"
          placeholderTextColor={colors.textDim}
        />
      </View>

      {/* Features */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Features</Text>

        <ToggleRow
          label="Has Windows"
          icon="🪟"
          value={hasWindow}
          onChange={setHasWindow}
        />
        {hasWindow && (
          <LevelPicker
            label="Natural Light"
            value={naturalLight}
            onChange={setNaturalLight}
            labels={['Low', 'Medium', 'Bright']}
          />
        )}

        <View style={styles.divider} />

        <ToggleRow
          label="Has Closet"
          icon="🚪"
          value={hasCloset}
          onChange={setHasCloset}
        />
        {hasCloset && (
          <LevelPicker
            label="Closet Size"
            value={closetSize}
            onChange={setClosetSize}
            labels={['Small', 'Medium', 'Walk-in']}
          />
        )}

        <View style={styles.divider} />

        <ToggleRow
          label="Private Bathroom"
          icon="🚿"
          value={hasBathroom}
          onChange={setHasBathroom}
        />

        <View style={styles.divider} />

        <ToggleRow
          label="Has Balcony / Patio"
          icon="🌿"
          value={hasBalcony}
          onChange={setHasBalcony}
        />

        <View style={styles.divider} />

        <LevelPicker
          label="🔊 Noise Level"
          value={noiseLevel}
          onChange={setNoiseLevel}
          labels={['Quiet', 'Moderate', 'Noisy']}
        />
      </View>

      {/* Save */}
      <TouchableOpacity
        style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]}
        disabled={!canSave}
        onPress={handleSave}
      >
        <Ionicons name="checkmark-circle" size={22} color="#fff" />
        <Text style={styles.saveBtnText}>Add Room</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: spacing.md },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardTitle: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  fieldGroup: { marginTop: spacing.sm },
  fieldLabel: {
    color: colors.textDim,
    fontSize: 13,
    marginBottom: spacing.xs,
  },
  textInput: {
    backgroundColor: colors.cardLight,
    borderRadius: 12,
    padding: spacing.md,
    color: colors.white,
    fontSize: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  toggleIcon: { fontSize: 20, marginRight: spacing.sm },
  toggleLabel: { flex: 1, color: colors.text, fontSize: 15 },
  levelRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  levelBtn: {
    flex: 1,
    backgroundColor: colors.cardLight,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  levelBtnActive: { backgroundColor: colors.accent },
  levelBtnText: { color: colors.textDim, fontSize: 13, fontWeight: '600' },
  levelBtnTextActive: { color: colors.white },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  saveBtn: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: spacing.sm,
  },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
