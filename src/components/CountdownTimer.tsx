import React from 'react';
import { Timer } from 'lucide-react';

interface CountdownTimerProps {
  timeRemaining: number;
  totalTime: number;
  isPaused?: boolean;
  isZen?: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  timeRemaining,
  totalTime,
  isPaused = false,
  isZen = false,
}) => {
  if (isZen) {
    return (
      <div className="relative flex items-center gap-3 px-4 py-2.5 rounded-xl border bg-slate-900/90 border-slate-800">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-lg">
          ∞
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
            Practice Pace
          </span>
          <span className="text-sm font-bold text-emerald-300">
            Zen Mode
          </span>
        </div>
      </div>
    );
  }

  const percentage = Math.max(0, Math.min(100, (timeRemaining / totalTime) * 100));
  const isUrgent = timeRemaining <= 10 && timeRemaining > 0;
  const isCritical = timeRemaining <= 5 && timeRemaining > 0;

  // Determine accent color
  let strokeColor = '#10B981'; // Emerald
  let textColor = 'text-emerald-400';
  if (percentage <= 25) {
    strokeColor = '#F43F5E'; // Rose
    textColor = 'text-rose-400';
  } else if (percentage <= 55) {
    strokeColor = '#F59E0B'; // Amber
    textColor = 'text-amber-400';
  }

  // SVG circular metrics
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className={`relative flex items-center gap-3.5 px-4 py-2.5 rounded-xl border transition-all ${
        isCritical
          ? 'bg-rose-950/40 border-rose-500/50 animate-pulse'
          : isUrgent
          ? 'bg-amber-950/30 border-amber-500/40'
          : 'bg-slate-900/90 border-slate-800'
      }`}
    >
      {/* Radial Progress Ring */}
      <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
        <svg className="w-14 h-14 -rotate-90" viewBox="0 0 64 64">
          {/* Background circle */}
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="4"
            className="text-slate-800"
          />
          {/* Progress circle */}
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="transparent"
            stroke={strokeColor}
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>

        {/* Center icon or label */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Timer className={`w-5 h-5 ${textColor}`} />
        </div>
      </div>

      {/* Numerical readout */}
      <div className="flex flex-col">
        <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
          {isPaused ? 'Timer Paused' : 'Time Left'}
        </span>
        <div className="flex items-baseline gap-1">
          <span className={`text-2xl font-bold font-mono tabular-nums leading-none ${textColor}`}>
            {timeRemaining}
          </span>
          <span className="text-xs text-slate-500 font-mono">s / {totalTime}s</span>
        </div>
      </div>
    </div>
  );
};
