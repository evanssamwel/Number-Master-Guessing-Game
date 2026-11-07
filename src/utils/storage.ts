import { Difficulty, GameMode, LeaderboardEntry, PlayerStats, Achievement } from '../types/game';

const LEADERBOARD_KEY = 'number_master_leaderboard_v2';
const STATS_KEY = 'number_master_stats_v2';
const PLAYER_NAME_KEY = 'number_master_player_name';

export const ALL_ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  {
    id: 'first_win',
    title: 'First Triumph',
    description: 'Solve your first secret number.',
    iconName: 'Trophy',
  },
  {
    id: 'fast_guess',
    title: 'Speed Demon',
    description: 'Crack the code with at least 25 seconds remaining.',
    iconName: 'Zap',
  },
  {
    id: 'sniper',
    title: 'Sharpshooter',
    description: 'Solve the number in 3 or fewer attempts.',
    iconName: 'Target',
  },
  {
    id: 'streak_3',
    title: 'On a Roll',
    description: 'Reach a 3-game winning streak.',
    iconName: 'Flame',
  },
  {
    id: 'streak_5',
    title: 'Grandmaster',
    description: 'Achieve a 5-game winning streak.',
    iconName: 'Crown',
  },
  {
    id: 'score_5k',
    title: 'High Roller',
    description: 'Score 5,000 points or more in a single game.',
    iconName: 'Sparkles',
  },
  {
    id: 'used_clue',
    title: "Detective's Intuition",
    description: 'Win a round after using a detective lifeline clue.',
    iconName: 'Brain',
  },
  {
    id: 'daily_done',
    title: 'Daily Sleuth',
    description: 'Complete today’s global Daily Puzzle.',
    iconName: 'Calendar',
  },
];

const INITIAL_CHAMPIONS: LeaderboardEntry[] = [
  {
    id: 'seed-1',
    playerName: 'Ada Lovelace',
    score: 8450,
    difficulty: 'hard',
    mode: 'classic',
    attempts: 4,
    maxAttempts: 7,
    timeRemaining: 21,
    timeElapsed: 14,
    streak: 6,
    targetNumber: 342,
    date: '2026-11-01',
    isCurrentUser: false,
  },
  {
    id: 'seed-2',
    playerName: 'Alan Turing',
    score: 7200,
    difficulty: 'hard',
    mode: 'classic',
    attempts: 5,
    maxAttempts: 7,
    timeRemaining: 18,
    timeElapsed: 17,
    streak: 4,
    targetNumber: 189,
    date: '2026-11-03',
    isCurrentUser: false,
  },
  {
    id: 'seed-3',
    playerName: 'Grace Hopper',
    score: 4650,
    difficulty: 'medium',
    mode: 'classic',
    attempts: 3,
    maxAttempts: 8,
    timeRemaining: 32,
    timeElapsed: 13,
    streak: 5,
    targetNumber: 73,
    date: '2026-11-04',
    isCurrentUser: false,
  },
  {
    id: 'seed-4',
    playerName: 'Katherine Johnson',
    score: 4120,
    difficulty: 'medium',
    mode: 'blitz',
    attempts: 4,
    maxAttempts: 8,
    timeRemaining: 27,
    timeElapsed: 18,
    streak: 3,
    targetNumber: 48,
    date: '2026-11-05',
    isCurrentUser: false,
  },
  {
    id: 'seed-5',
    playerName: 'Claude Shannon',
    score: 2180,
    difficulty: 'easy',
    mode: 'classic',
    attempts: 3,
    maxAttempts: 10,
    timeRemaining: 48,
    timeElapsed: 12,
    streak: 4,
    targetNumber: 27,
    date: '2026-11-06',
    isCurrentUser: false,
  },
  {
    id: 'seed-6',
    playerName: 'Srinivasa Ramanujan',
    score: 2040,
    difficulty: 'easy',
    mode: 'daily',
    attempts: 4,
    maxAttempts: 10,
    timeRemaining: 44,
    timeElapsed: 16,
    streak: 2,
    targetNumber: 17,
    date: '2026-11-06',
    isCurrentUser: false,
  },
];

const INITIAL_STATS: PlayerStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  bestStreak: 0,
  totalScore: 0,
  highScore: 0,
  favoriteDifficulty: 'easy',
  blitzSolvedCount: 0,
  dailyStreak: 0,
  unlockedAchievements: [],
};

export function getStoredPlayerName(): string {
  try {
    return localStorage.getItem(PLAYER_NAME_KEY) || 'Number Prodigy';
  } catch {
    return 'Number Prodigy';
  }
}

export function saveStoredPlayerName(name: string): void {
  try {
    localStorage.setItem(PLAYER_NAME_KEY, name.trim() || 'Number Prodigy');
  } catch {
    // ignore
  }
}

export function getLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    if (!raw) {
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(INITIAL_CHAMPIONS));
      return INITIAL_CHAMPIONS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_CHAMPIONS;
  } catch {
    return INITIAL_CHAMPIONS;
  }
}

export function addLeaderboardEntry(entry: Omit<LeaderboardEntry, 'id' | 'date'>): LeaderboardEntry {
  const current = getLeaderboard();
  const newEntry: LeaderboardEntry = {
    ...entry,
    id: `entry-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    date: new Date().toISOString().split('T')[0],
    isCurrentUser: true,
  };

  const updated = [newEntry, ...current].sort((a, b) => b.score - a.score).slice(0, 50);

  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }

  return newEntry;
}

export function clearUserLeaderboard(): void {
  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(INITIAL_CHAMPIONS));
  } catch {
    // ignore
  }
}

export function getPlayerStats(): PlayerStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return INITIAL_STATS;
    return { ...INITIAL_STATS, ...JSON.parse(raw) };
  } catch {
    return INITIAL_STATS;
  }
}

export function updatePlayerStats(
  won: boolean,
  score: number = 0,
  difficulty: Difficulty = 'easy',
  mode: GameMode = 'classic',
  newAchievements: string[] = []
): PlayerStats {
  const current = getPlayerStats();
  const nextGamesPlayed = current.gamesPlayed + 1;
  const nextGamesWon = won ? current.gamesWon + 1 : current.gamesWon;
  const nextCurrentStreak = won ? current.currentStreak + 1 : 0;
  const nextBestStreak = Math.max(current.bestStreak, nextCurrentStreak);
  const nextTotalScore = current.totalScore + score;
  const nextHighScore = Math.max(current.highScore, score);

  const mergedAchievements = Array.from(new Set([...current.unlockedAchievements, ...newAchievements]));

  const updated: PlayerStats = {
    ...current,
    gamesPlayed: nextGamesPlayed,
    gamesWon: nextGamesWon,
    currentStreak: nextCurrentStreak,
    bestStreak: nextBestStreak,
    totalScore: nextTotalScore,
    highScore: nextHighScore,
    favoriteDifficulty: difficulty,
    unlockedAchievements: mergedAchievements,
  };

  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }

  return updated;
}

export function resetPlayerStats(): PlayerStats {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(INITIAL_STATS));
  } catch {
    // ignore
  }
  return INITIAL_STATS;
}

// Generate seeded deterministic number for today's date
export function getDailySeedNumber(min: number, max: number): number {
  const today = new Date().toISOString().split('T')[0];
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = (hash << 5) - hash + today.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = Math.abs(hash);
  return min + (positiveHash % (max - min + 1));
}
