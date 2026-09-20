import React, { createContext, useContext, useState, useCallback } from 'react';
import { Room } from '../types';

interface AppState {
  rooms: Room[];
  totalRent: string;
  addRoom: (room: Room) => void;
  updateRoom: (id: string, room: Partial<Room>) => void;
  removeRoom: (id: string) => void;
  setTotalRent: (rent: string) => void;
  reset: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [totalRent, setTotalRent] = useState('');

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
      value={{ rooms, totalRent, addRoom, updateRoom, removeRoom, setTotalRent, reset }}
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
