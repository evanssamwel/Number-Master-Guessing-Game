import React from 'react';
import { Difficulty, DIFFICULTY_CONFIGS } from '../types/game';
import { soundManager } from '../utils/audio';

interface DifficultySelectorProps {
  currentDifficulty: Difficulty;
  onSelectDifficulty: (difficulty: Difficulty) => void;
  disabled?: boolean;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  currentDifficulty,
  onSelectDifficulty,
  disabled = false,
}) => {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Difficulty Level
        </label>
        <span className="text-xs text-slate-500 font-medium">
          {DIFFICULTY_CONFIGS[currentDifficulty].badge}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl">
        {difficulties.map((diff) => {
          const config = DIFFICULTY_CONFIGS[diff];
          const isSelected = currentDifficulty === diff;

          return (
            <button
              key={diff}
              type="button"
              disabled={disabled}
              onClick={() => {
                if (!isSelected) {
                  soundManager.playClick();
                  onSelectDifficulty(diff);
                }
              }}
              className={`flex flex-col items-center justify-center py-2.5 px-3 rounded-lg text-center transition-all ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60 font-medium'
              } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span className="text-sm tracking-wide">{config.name}</span>
              <span
                className={`text-[11px] mt-0.5 tabular-nums ${
                  isSelected ? 'text-slate-950/80 font-semibold' : 'text-slate-400'
                }`}
              >
                1 – {config.max}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
