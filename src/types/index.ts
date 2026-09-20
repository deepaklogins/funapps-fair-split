export interface Room {
  id: string;
  name: string;
  sqft: number;
  hasWindow: boolean;
  naturalLight: 1 | 2 | 3; // 1=low, 2=medium, 3=high
  hasCloset: boolean;
  closetSize: 1 | 2 | 3; // 1=small, 2=medium, 3=walk-in
  hasBathroom: boolean; // en-suite or private
  hasBalcony: boolean;
  noiseLevel: 1 | 2 | 3; // 1=quiet, 2=moderate, 3=noisy
}

export interface Roommate {
  id: string;
  name: string;
  assignedRoomId?: string;
}

export interface SplitResult {
  roomId: string;
  roomName: string;
  roommateName: string;
  score: number;
  percentage: number;
  rent: number;
}
