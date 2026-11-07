import React from 'react';
import { BarChart3, X, Award, Flame, Target, Trophy, RotateCcw } from 'lucide-react';
import { PlayerStats } from '../types/game';
import { resetPlayerStats } from '../utils/storage';
import { soundManager } from '../utils/audio';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: PlayerStats;
  onStatsReset: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  stats,
  onStatsReset,
}) => {
  if (!isOpen) return null;

  const winRate =
    stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your personal game statistics?')) {
      resetPlayerStats();
      onStatsReset();
      soundManager.playClick();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Your Career Stats</h2>
              <p className="text-xs text-slate-400">Track your number guessing mastery</p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2x2 Grid of Key Stats */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Target className="w-4 h-4 text-emerald-400" />
              <span>Win Rate</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white tabular-nums">
              {winRate}%
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {stats.gamesWon} won / {stats.gamesPlayed} played
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Winning Streak</span>
            </div>
            <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
              {stats.currentStreak} 🔥
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Career Best: {stats.bestStreak}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span>High Score</span>
            </div>
            <div className="text-2xl font-bold font-mono text-yellow-300 tabular-nums">
              {stats.highScore.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Single round best
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Award className="w-4 h-4 text-sky-400" />
              <span>Total Points</span>
            </div>
            <div className="text-2xl font-bold font-mono text-sky-300 tabular-nums">
              {stats.totalScore.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Accumulated career points
            </div>
          </div>
        </div>

        {/* Reset Action */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-400 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Career Stats</span>
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
