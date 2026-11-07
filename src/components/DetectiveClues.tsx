import React from 'react';
import { Eye, HelpCircle, Compass, Scissors, Check, Sparkles } from 'lucide-react';
import { LifelinesState } from '../types/game';
import { soundManager } from '../utils/audio';

interface DetectiveCluesProps {
  lifelines: LifelinesState;
  targetNumber: number;
  currentMin: number;
  currentMax: number;
  onUseParity: () => void;
  onUseDivisibility: () => void;
  onUseRangeSqueeze: () => void;
  disabled?: boolean;
}

export const DetectiveClues: React.FC<DetectiveCluesProps> = ({
  lifelines,
  targetNumber,
  currentMin,
  currentMax,
  onUseParity,
  onUseDivisibility,
  onUseRangeSqueeze,
  disabled = false,
}) => {
  const isEven = targetNumber % 2 === 0;

  // Find a meaningful divisibility clue
  let divClue = 'Not divisible by 3, 5, or 10';
  if (targetNumber % 10 === 0) divClue = 'Divisible by 10 (and 5, 2)';
  else if (targetNumber % 5 === 0) divClue = 'Divisible by 5 (ends in 5)';
  else if (targetNumber % 3 === 0) divClue = 'Divisible by 3';
  else if (targetNumber % 4 === 0) divClue = 'Divisible by 4';

  const handleParityClick = () => {
    if (lifelines.parityUsed || disabled) return;
    soundManager.playClueSound();
    onUseParity();
  };

  const handleDivisibilityClick = () => {
    if (lifelines.divisibilityUsed || disabled) return;
    soundManager.playClueSound();
    onUseDivisibility();
  };

  const handleSqueezeClick = () => {
    if (lifelines.rangeSqueezeUsed || disabled) return;
    soundManager.playClueSound();
    onUseRangeSqueeze();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Detective Lifelines
          </span>
        </div>
        <span className="text-xs text-slate-500 font-mono">
          Beginner Clues · 1 use each
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {/* Parity Lifeline */}
        <button
          type="button"
          disabled={lifelines.parityUsed || disabled}
          onClick={handleParityClick}
          className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
            lifelines.parityUsed
              ? 'bg-slate-950/60 border-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-slate-950 hover:bg-slate-800/80 border-slate-800 hover:border-amber-500/50 text-slate-200 cursor-pointer active:scale-[0.98]'
          }`}
        >
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-1.5">
            {lifelines.parityUsed ? <Check className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </div>
          <span className="text-xs font-bold leading-tight">Parity Clue</span>
          <span className="text-[10px] text-slate-400 mt-0.5">
            {lifelines.parityUsed ? (isEven ? 'Even number' : 'Odd number') : 'Even or Odd?'}
          </span>
        </button>

        {/* Divisibility Lifeline */}
        <button
          type="button"
          disabled={lifelines.divisibilityUsed || disabled}
          onClick={handleDivisibilityClick}
          className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
            lifelines.divisibilityUsed
              ? 'bg-slate-950/60 border-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-slate-950 hover:bg-slate-800/80 border-slate-800 hover:border-sky-500/50 text-slate-200 cursor-pointer active:scale-[0.98]'
          }`}
        >
          <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center mb-1.5">
            {lifelines.divisibilityUsed ? <Check className="w-3.5 h-3.5" /> : <HelpCircle className="w-3.5 h-3.5" />}
          </div>
          <span className="text-xs font-bold leading-tight">Divisibility</span>
          <span className="text-[10px] text-slate-400 mt-0.5 truncate max-w-full px-1">
            {lifelines.divisibilityUsed ? divClue : 'Divisible by?'}
          </span>
        </button>

        {/* Range Squeezer Lifeline */}
        <button
          type="button"
          disabled={lifelines.rangeSqueezeUsed || disabled}
          onClick={handleSqueezeClick}
          className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
            lifelines.rangeSqueezeUsed
              ? 'bg-slate-950/60 border-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-slate-950 hover:bg-slate-800/80 border-slate-800 hover:border-emerald-500/50 text-slate-200 cursor-pointer active:scale-[0.98]'
          }`}
        >
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-1.5">
            {lifelines.rangeSqueezeUsed ? <Check className="w-3.5 h-3.5" /> : <Scissors className="w-3.5 h-3.5" />}
          </div>
          <span className="text-xs font-bold leading-tight">Squeezer</span>
          <span className="text-[10px] text-slate-400 mt-0.5">
            {lifelines.rangeSqueezeUsed ? 'Bounds Trimmed' : 'Shrink Bounds'}
          </span>
        </button>
      </div>

      {/* Clue Notes Drawer */}
      {lifelines.revealedClues.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5">
          {lifelines.revealedClues.map((clue) => (
            <div
              key={clue.id}
              className="flex items-center gap-2 text-xs text-amber-300 bg-amber-950/30 border border-amber-500/30 px-3 py-1.5 rounded-lg"
            >
              <Compass className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span>{clue.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
