import React, { useRef } from 'react';
import { Target, Sparkles, SlidersHorizontal } from 'lucide-react';
import { GuessRecord } from '../types/game';
import { soundManager } from '../utils/audio';

interface RangeVisualizerProps {
  absoluteMin: number;
  absoluteMax: number;
  currentMin: number;
  currentMax: number;
  history?: GuessRecord[];
  lastGuess?: number;
  onSelectSuggestion?: (num: number) => void;
  disabled?: boolean;
}

export const RangeVisualizer: React.FC<RangeVisualizerProps> = ({
  absoluteMin,
  absoluteMax,
  currentMin,
  currentMax,
  history = [],
  lastGuess,
  onSelectSuggestion,
  disabled = false,
}) => {
  const barRef = useRef<HTMLDivElement>(null);
  const totalRange = absoluteMax - absoluteMin || 1;
  const leftPercent = Math.max(0, ((currentMin - absoluteMin) / totalRange) * 100);
  const widthPercent = Math.max(2, Math.min(100 - leftPercent, ((currentMax - currentMin) / totalRange) * 100));

  const midpoint = Math.floor((currentMin + currentMax) / 2);
  const remainingNumbers = currentMax - currentMin + 1;
  const totalNumbers = absoluteMax - absoluteMin + 1;
  const eliminatedPercent = Math.round(((totalNumbers - remainingNumbers) / totalNumbers) * 100);

  // Position of last guess on the track
  const lastGuessPercent =
    lastGuess !== undefined
      ? Math.max(0, Math.min(100, ((lastGuess - absoluteMin) / totalRange) * 100))
      : null;

  // Handle clicking on the visual bar to stage that number
  const handleBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !barRef.current || !onSelectSuggestion) return;
    const rect = barRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickRatio = Math.max(0, Math.min(1, clickX / rect.width));
    const selectedNum = Math.round(absoluteMin + clickRatio * (absoluteMax - absoluteMin));
    soundManager.playClick();
    onSelectSuggestion(selectedNum);
  };

  return (
    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Active Search Window
          </span>
          <span className="hidden sm:inline-block text-[11px] text-slate-500 font-mono">
            ({eliminatedPercent}% eliminated)
          </span>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          <span className="text-white font-semibold">{remainingNumbers}</span> candidates remaining
        </div>
      </div>

      {/* Interactive Visual Bar */}
      <div
        ref={barRef}
        onClick={handleBarClick}
        className={`relative h-7 bg-slate-950 rounded-lg overflow-hidden border border-slate-800/80 mb-2.5 select-none ${
          disabled ? 'cursor-not-allowed' : 'cursor-crosshair hover:border-slate-700'
        }`}
        title={disabled ? undefined : 'Click anywhere on the number line to target that value'}
      >
        {/* Eliminated Left Area */}
        <div
          className="absolute top-0 bottom-0 left-0 bg-slate-900/60 border-r border-slate-800"
          style={{ width: `${leftPercent}%` }}
        />

        {/* Active Range Highlight */}
        <div
          className="absolute top-0 bottom-0 bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 border-x-2 border-amber-400 transition-all duration-300 ease-out"
          style={{
            left: `${leftPercent}%`,
            width: `${widthPercent}%`,
          }}
        />

        {/* Render markers for previous guesses */}
        {history.slice(0, 15).map((record) => {
          const guessPercent = Math.max(
            0,
            Math.min(100, ((record.guess - absoluteMin) / totalRange) * 100)
          );
          const isLow = record.hint === 'too_low';

          return (
            <div
              key={record.id}
              className={`absolute top-0 bottom-0 w-0.5 pointer-events-none transition-all ${
                isLow ? 'bg-amber-400/70' : 'bg-rose-400/70'
              }`}
              style={{ left: `${guessPercent}%` }}
              title={`#${record.guessNumber}: ${record.guess} (${isLow ? 'Too Low' : 'Too High'})`}
            >
              <div
                className={`absolute -top-0.5 -left-1 w-2.5 h-2.5 rounded-full ${
                  isLow ? 'bg-amber-400' : 'bg-rose-400'
                }`}
              />
            </div>
          );
        })}

        {/* Prominent marker for the latest guess */}
        {lastGuessPercent !== null && (
          <div
            className="absolute top-0 bottom-0 w-1 bg-white z-20 pointer-events-none"
            style={{ left: `${lastGuessPercent}%` }}
          >
            <div className="absolute -top-1 -left-1.5 w-4 h-4 bg-white rounded-full shadow-lg ring-2 ring-amber-400" />
          </div>
        )}
      </div>

      {/* Numerical Bounds & Smart Binary-Search Midpoint Button */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 font-mono text-slate-400">
          <span>Min:</span>
          <span className="text-amber-400 font-bold tabular-nums text-sm">{currentMin}</span>
        </div>

        <div className="flex items-center gap-2">
          {onSelectSuggestion && !disabled && (
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onSelectSuggestion(midpoint);
              }}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-lg transition-colors cursor-pointer"
              title="Binary search midpoint (statistically optimal guess)"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>
                Optimal Midpoint: <strong className="font-mono text-white">{midpoint}</strong>
              </span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 font-mono text-slate-400">
          <span>Max:</span>
          <span className="text-amber-400 font-bold tabular-nums text-sm">{currentMax}</span>
        </div>
      </div>
    </div>
  );
};
