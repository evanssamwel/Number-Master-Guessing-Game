import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Flame, Check, X, ArrowRight, Star, Award, Zap } from 'lucide-react';
import { Difficulty, DifficultyConfig, GameMode, ScoreBreakdown } from '../types/game';
import { getStoredPlayerName, saveStoredPlayerName, ALL_ACHIEVEMENTS } from '../utils/storage';
import { soundManager } from '../utils/audio';

interface GameSummaryModalProps {
  status: 'won' | 'lost';
  targetNumber: number;
  difficultyConfig: DifficultyConfig;
  mode: GameMode;
  attemptsTaken: number;
  timeRemaining: number;
  timeElapsed: number;
  scoreBreakdown?: ScoreBreakdown;
  streak: number;
  blitzSolved?: number;
  newAchievements?: string[];
  onPlayAgain: (difficulty?: Difficulty) => void;
  onSaveScore: (playerName: string) => void;
  hasSavedScore: boolean;
}

export const GameSummaryModal: React.FC<GameSummaryModalProps> = ({
  status,
  targetNumber,
  difficultyConfig,
  mode,
  attemptsTaken,
  timeRemaining,
  scoreBreakdown,
  streak,
  blitzSolved = 0,
  newAchievements = [],
  onPlayAgain,
  onSaveScore,
  hasSavedScore,
}) => {
  const [playerName, setPlayerName] = useState(getStoredPlayerName());
  const isWon = status === 'won';

  useEffect(() => {
    if (isWon) {
      soundManager.playVictory();
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#10B981', '#38BDF8', '#EC4899', '#A855F7'],
        });
      } catch {
        // ignore
      }
    } else {
      soundManager.playDefeat();
    }
  }, [isWon]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || hasSavedScore) return;
    saveStoredPlayerName(playerName.trim());
    onSaveScore(playerName.trim());
    soundManager.playClick();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        {/* Subtle top accent gradient */}
        <div
          className={`absolute top-0 left-0 right-0 h-1.5 ${
            isWon
              ? 'bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-500'
              : 'bg-rose-500'
          }`}
        />

        {/* Modal Header */}
        <div className="text-center mb-5">
          <div
            className={`w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center shadow-lg ${
              isWon
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}
          >
            {isWon ? <Trophy className="w-8 h-8" /> : <X className="w-8 h-8" />}
          </div>

          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            {isWon ? 'Mission Accomplished!' : 'Round Over'}
          </h2>

          <p className="text-xs text-slate-400 mt-1">
            {isWon
              ? mode === 'blitz'
                ? `Blitz target solved! Keep your momentum roaring!`
                : `You cracked the code on ${difficultyConfig.name} difficulty!`
              : timeRemaining <= 0 && mode !== 'zen'
              ? 'Time ran out before the secret was cracked.'
              : 'Out of remaining attempts.'}
          </p>
        </div>

        {/* Secret Number Reveal Card */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 text-center mb-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            The Secret Number Was
          </span>
          <div className="text-4xl font-extrabold font-mono text-amber-400 mt-1 tracking-wider tabular-nums">
            {targetNumber}
          </div>
          <div className="flex items-center justify-center gap-2 mt-2 text-xs text-slate-400">
            <span>Guessed in <strong>{attemptsTaken}</strong> attempts</span>
            {mode !== 'zen' && (
              <>
                <span aria-hidden="true">·</span>
                <span>{timeRemaining}s remaining</span>
              </>
            )}
          </div>
        </div>

        {/* New Unlocked Achievement Announcement */}
        {newAchievements.length > 0 && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 mb-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
                New Achievement Unlocked!
              </span>
              <p className="text-xs font-bold text-white">
                {ALL_ACHIEVEMENTS.find((a) => a.id === newAchievements[0])?.title || 'Badge Earned!'}
              </p>
            </div>
          </div>
        )}

        {/* Score Breakdown (if won) */}
        {isWon && scoreBreakdown && (
          <div className="space-y-1.5 mb-4 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Base Points ({difficultyConfig.name})</span>
              <span className="font-mono tabular-nums text-slate-200">
                +{scoreBreakdown.baseScore}
              </span>
            </div>
            {mode !== 'zen' && (
              <div className="flex justify-between text-slate-400">
                <span>Speed Bonus ({timeRemaining}s left)</span>
                <span className="font-mono tabular-nums text-emerald-400">
                  +{scoreBreakdown.timeBonus}
                </span>
              </div>
            )}
            <div className="flex justify-between text-slate-400">
              <span>Attempts Bonus ({Math.max(0, difficultyConfig.maxAttempts - attemptsTaken)} left)</span>
              <span className="font-mono tabular-nums text-sky-400">
                +{scoreBreakdown.attemptsBonus}
              </span>
            </div>
            {scoreBreakdown.streakMultiplier > 1 && (
              <div className="flex justify-between text-amber-400 font-medium">
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" />
                  Streak Multiplier ({streak} wins)
                </span>
                <span className="font-mono tabular-nums">
                  {scoreBreakdown.streakMultiplier.toFixed(1)}x
                </span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline text-sm font-bold text-white">
              <span>Total Points</span>
              <span className="text-xl font-mono text-amber-400 tabular-nums">
                {scoreBreakdown.totalScore.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Winning Streak Notice */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 mb-4 text-xs">
          <div className="flex items-center gap-2">
            <Flame className={`w-4 h-4 ${streak > 0 ? 'text-amber-400' : 'text-slate-600'}`} />
            <span className="text-slate-300 font-medium">
              {isWon ? `Winning Streak: ${streak} in a row!` : 'Streak Reset to 0'}
            </span>
          </div>
          {isWon && (
            <span className="text-amber-400 font-mono font-bold text-[11px]">
              +{Math.min(150, streak * 10)}% Next Game
            </span>
          )}
        </div>

        {/* Save to Leaderboard Form (if won) */}
        {isWon && (
          <form onSubmit={handleSave} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={20}
                value={playerName}
                disabled={hasSavedScore}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter player name..."
                className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={hasSavedScore || !playerName.trim()}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  hasSavedScore
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40 cursor-default'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold cursor-pointer'
                }`}
              >
                {hasSavedScore ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Star className="w-3.5 h-3.5" />
                    <span>Record</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onPlayAgain();
            }}
            className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-colors"
          >
            <span>{mode === 'blitz' && isWon ? 'Continue Blitz Rush (+12s)' : 'Play Next Round'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onPlayAgain('easy');
            }}
            className="py-3 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 border border-slate-700 transition-colors"
            title="Reset to Easy"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
