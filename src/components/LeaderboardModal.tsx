import React, { useState } from 'react';
import { Trophy, X, Medal, Flame, Calendar, Trash2 } from 'lucide-react';
import { Difficulty, LeaderboardEntry } from '../types/game';
import { getLeaderboard, clearUserLeaderboard } from '../utils/storage';
import { soundManager } from '../utils/audio';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
  const [filter, setFilter] = useState<Difficulty | 'all'>('all');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      setEntries(getLeaderboard());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = entries
    .filter((e) => filter === 'all' || e.difficulty === filter)
    .sort((a, b) => b.score - a.score);

  const handleClear = () => {
    if (window.confirm('Reset leaderboard to initial records?')) {
      clearUserLeaderboard();
      setEntries(getLeaderboard());
      soundManager.playClick();
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Medal className="w-4 h-4 text-amber-400" />;
    if (rank === 2) return <Medal className="w-4 h-4 text-slate-300" />;
    if (rank === 3) return <Medal className="w-4 h-4 text-amber-600" />;
    return <span className="text-xs font-mono text-slate-500 tabular-nums">#{rank}</span>;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Hall of Champions</h2>
              <p className="text-xs text-slate-400">Top number guessing masters across all difficulties</p>
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

        {/* Filter Tabs */}
        <div className="flex items-center justify-between mt-4 mb-3">
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
            {(['all', 'easy', 'medium', 'hard'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => {
                  soundManager.playClick();
                  setFilter(diff);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                  filter === diff
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {diff === 'all' ? 'All Difficulties' : diff}
              </button>
            ))}
          </div>

          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-400 transition-colors"
            title="Reset Leaderboard"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* List Table */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[240px]">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-slate-500 text-sm">
              <p>No champions in this category yet.</p>
              <p className="text-xs text-slate-600 mt-1">Win a game to claim the top spot!</p>
            </div>
          ) : (
            filtered.map((item, idx) => {
              const rank = idx + 1;
              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                    item.isCurrentUser
                      ? 'bg-amber-950/20 border-amber-500/40 text-white'
                      : 'bg-slate-950/50 border-slate-800/80 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 flex items-center justify-center">
                      {getRankBadge(rank)}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">
                          {item.playerName}
                        </span>
                        {item.isCurrentUser && (
                          <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
                            You
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="capitalize text-slate-300 font-medium">
                          {item.difficulty}
                        </span>
                        {item.mode && item.mode !== 'classic' && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-amber-300 font-semibold uppercase text-[10px]">
                              {item.mode}
                            </span>
                          </>
                        )}
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">{item.attempts} attempts</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">{item.timeRemaining}s left</span>
                        {item.streak > 1 && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="flex items-center gap-0.5 text-amber-400 font-mono">
                              <Flame className="w-3 h-3" />
                              {item.streak} streak
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-base font-extrabold font-mono text-amber-400 tabular-nums">
                      {item.score.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
