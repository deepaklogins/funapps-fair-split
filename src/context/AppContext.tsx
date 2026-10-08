import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Room } from '../types';

const STORAGE_KEYS = {
  rooms: '@fairsplit_rooms',
  totalRent: '@fairsplit_totalRent',
  currency: '@fairsplit_currency',
} as const;

interface AppState {
  rooms: Room[];
  totalRent: string;
  currency: string;
  addRoom: (room: Room) => void;
  updateRoom: (id: string, room: Partial<Room>) => void;
  removeRoom: (id: string) => void;
  setTotalRent: (rent: string) => void;
  setCurrency: (currency: string) => void;
  reset: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [totalRent, setTotalRent] = useState('');
  const [currency, setCurrency] = useState('$');

  // Load saved data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [savedRooms, savedRent, savedCurrency] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.rooms),
          AsyncStorage.getItem(STORAGE_KEYS.totalRent),
          AsyncStorage.getItem(STORAGE_KEYS.currency),
        ]);
        if (savedRooms) setRooms(JSON.parse(savedRooms));
        if (savedRent) setTotalRent(savedRent);
        if (savedCurrency) setCurrency(savedCurrency);
      } catch (e) {
        // silently fail on load
      }
    };
    loadData();
  }, []);

  // Save rooms when they change
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.rooms, JSON.stringify(rooms)).catch(() => {});
  }, [rooms]);

  // Save totalRent when it changes
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.totalRent, totalRent).catch(() => {});
  }, [totalRent]);

  // Save currency when it changes
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.currency, currency).catch(() => {});
  }, [currency]);

  const addRoom = useCallback((room: Room) => {
    setRooms((prev) => [...prev, room]);
  }, []);

  const updateRoom = useCallback((id: string, updates: Partial<Room>) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  }, []);

  const removeRoom = useCallback((id: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const reset = useCallback(() => {
    setRooms([]);
    setTotalRent('');
  }, []);

  return (
    <AppContext.Provider
      value={{ rooms, totalRent, currency, addRoom, updateRoom, removeRoom, setTotalRent, setCurrency, reset }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
