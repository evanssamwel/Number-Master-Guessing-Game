import React from 'react';
import { Flame, Award, Zap } from 'lucide-react';

interface StreakDisplayProps {
  currentStreak: number;
  bestStreak: number;
  currentScore: number;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({
  currentStreak,
  bestStreak,
  currentScore,
}) => {
  // Streak multiplier formula: each consecutive win adds +10% score multiplier (up to 2.5x max)
  const multiplier = Math.min(2.5, 1 + currentStreak * 0.1);

  return (
    <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800">
      {/* Current Streak */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
          <Flame className={`w-3.5 h-3.5 ${currentStreak > 0 ? 'text-amber-400 fill-amber-400/20' : 'text-slate-500'}`} />
          <span className="font-medium">Win Streak</span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold font-mono text-white tabular-nums">
            {currentStreak}
          </span>
          {currentStreak >= 3 && (
            <span className="text-[11px] font-semibold text-amber-400">On Fire!</span>
          )}
        </div>
      </div>

      {/* Streak Multiplier */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
          <Zap className="w-3.5 h-3.5 text-yellow-400" />
          <span className="font-medium">Multiplier</span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold font-mono text-amber-300 tabular-nums">
            {multiplier.toFixed(1)}x
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            {currentStreak > 0 ? `+${Math.round((multiplier - 1) * 100)}%` : 'Base'}
          </span>
        </div>
      </div>

      {/* High Score / Best Streak */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
          <Award className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-medium">Total Score</span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold font-mono text-emerald-300 tabular-nums">
            {currentScore.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-500 font-mono" title={`Best Streak: ${bestStreak}`}>
            (Best: {bestStreak}🔥)
          </span>
        </div>
      </div>
    </div>
  );
};
