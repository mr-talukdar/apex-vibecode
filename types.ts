export enum RideLevel {
  A = 'A', // Sport/Track
  B = 'B', // Sport Touring
  C = 'C', // Cruiser/Touring
  D = 'D'  // Rookie/Relaxed
}

export type TerrainType = 'Mountains' | 'Highway' | 'Trail' | 'Beach' | 'Urban';

export interface User {
  id: string;
  name: string;
  points: number;
  avatarUrl: string;
  joinedGroups: string[]; // group IDs
  joinedRides: string[]; // ride IDs
  requestedRides: string[]; // ride IDs where user requested access
}

export interface Group {
  id: string;
  name: string;
  description: string;
  image: string;
  code: string; // Unique code to join
  isPrivate: boolean;
  memberCount: number;
  adminId: string;
}

export interface Ride {
  id: string;
  groupId: string; // Linked to a group
  title: string;
  description: string;
  date: string;
  time: string;
  distance: number; // in miles
  elevation: number; // in feet
  level: RideLevel;
  terrain: TerrainType;
  minPoints: number;
  maxRiders: number;
  currentRiders: number;
  leaderName: string;
  marshallName?: string;
  tailName?: string;
  routeImage?: string;
}

export const LEVEL_CONFIG = {
  [RideLevel.A]: { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Sport/Aggr.', minPoints: 2000, avgSpeed: 'Spirited Pace' },
  [RideLevel.B]: { color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20', label: 'Sport Touring', minPoints: 1500, avgSpeed: 'Brisk Pace' },
  [RideLevel.C]: { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'Cruiser', minPoints: 800, avgSpeed: 'Moderate Pace' },
  [RideLevel.D]: { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Rookie/Chill', minPoints: 0, avgSpeed: 'Relaxed Pace' },
};