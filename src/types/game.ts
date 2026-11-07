export type Difficulty = 'easy' | 'medium' | 'hard';

export interface DifficultyConfig {
  id: Difficulty;
  name: string;
  min: number;
  max: number;
  maxAttempts: number;
  timeSeconds: number;
  baseScore: number;
  description: string;
  badge: string;
}

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    id: 'easy',
    name: 'Easy',
    min: 1,
    max: 50,
    maxAttempts: 10,
    timeSeconds: 60,
    baseScore: 1000,
    description: 'Range 1 to 50 · 10 attempts · 60s timer',
    badge: 'Beginner Friendly',
  },
  medium: {
    id: 'medium',
    name: 'Medium',
    min: 1,
    max: 100,
    maxAttempts: 8,
    timeSeconds: 45,
    baseScore: 2500,
    description: 'Range 1 to 100 · 8 attempts · 45s timer',
    badge: 'Standard Challenge',
  },
  hard: {
    id: 'hard',
    name: 'Hard',
    min: 1,
    max: 500,
    maxAttempts: 7,
    timeSeconds: 35,
    baseScore: 5000,
    description: 'Range 1 to 500 · 7 attempts · 35s timer',
    badge: 'Master Detective',
  },
};

export type HintType = 'too_low' | 'too_high' | 'correct';

export type ProximityType = 'burning_hot' | 'warm' | 'cool' | 'cold' | 'freezing';

export interface GuessRecord {
  id: string;
  guessNumber: number;
  guess: number;
  hint: HintType;
  proximity: ProximityType;
  diff: number;
  timestamp: number;
  rangeSnapshot: {
    min: number;
    max: number;
  };
}

export type GameStatus = 'idle' | 'playing' | 'won' | 'lost' | 'paused';

export type GameMode = 'classic' | 'blitz' | 'zen' | 'daily';

export interface GameModeConfig {
  id: GameMode;
  name: string;
  tagline: string;
  description: string;
}

export const GAME_MODE_CONFIGS: Record<GameMode, GameModeConfig> = {
  classic: {
    id: 'classic',
    name: 'Classic',
    tagline: 'Standard timer & attempts',
    description: 'Solve the secret number before the countdown timer or attempts run out.',
  },
  blitz: {
    id: 'blitz',
    name: 'Time Blitz',
    tagline: 'Rapid streak challenge',
    description: '60s continuous clock. Every correct guess adds +12s and builds exponential points!',
  },
  zen: {
    id: 'zen',
    name: 'Zen Practice',
    tagline: 'No timer pressure',
    description: 'Relaxed mode with unlimited attempts and binary search guidance for beginners.',
  },
  daily: {
    id: 'daily',
    name: 'Daily Puzzle',
    tagline: 'Same secret worldwide',
    description: 'A shared global number seeded once per calendar day. Complete daily streaks!',
  },
};

export interface LifelinesState {
  parityUsed: boolean;
  divisibilityUsed: boolean;
  rangeSqueezeUsed: boolean;
  revealedClues: {
    id: string;
    type: 'parity' | 'divisibility' | 'range';
    text: string;
  }[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: 'Trophy' | 'Zap' | 'Target' | 'Flame' | 'Crown' | 'Sparkles' | 'Calendar' | 'Brain';
  unlocked: boolean;
  unlockedAt?: string;
}

export interface ScoreBreakdown {
  baseScore: number;
  timeBonus: number;
  attemptsBonus: number;
  streakMultiplier: number;
  cluesDeduction: number;
  totalScore: number;
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  difficulty: Difficulty;
  mode: GameMode;
  attempts: number;
  maxAttempts: number;
  timeRemaining: number;
  timeElapsed: number;
  streak: number;
  targetNumber: number;
  date: string;
  isCurrentUser?: boolean;
}

export interface PlayerStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  bestStreak: number;
  totalScore: number;
  highScore: number;
  favoriteDifficulty: Difficulty;
  blitzSolvedCount: number;
  dailyStreak: number;
  lastDailyDate?: string;
  unlockedAchievements: string[];
}

