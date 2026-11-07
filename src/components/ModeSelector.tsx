import React from 'react';
import { Play, Zap, Coffee, Calendar } from 'lucide-react';
import { GameMode, GAME_MODE_CONFIGS } from '../types/game';
import { soundManager } from '../utils/audio';

interface ModeSelectorProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  disabled?: boolean;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  currentMode,
  onSelectMode,
  disabled = false,
}) => {
  const modes: GameMode[] = ['classic', 'blitz', 'zen', 'daily'];

  const getIcon = (mode: GameMode) => {
    switch (mode) {
      case 'classic':
        return <Play className="w-3.5 h-3.5" />;
      case 'blitz':
        return <Zap className="w-3.5 h-3.5 text-yellow-400" />;
      case 'zen':
        return <Coffee className="w-3.5 h-3.5 text-emerald-400" />;
      case 'daily':
        return <Calendar className="w-3.5 h-3.5 text-sky-400" />;
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Game Mode
        </label>
        <span className="text-xs text-slate-500 font-medium">
          {GAME_MODE_CONFIGS[currentMode].tagline}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl">
        {modes.map((mode) => {
          const config = GAME_MODE_CONFIGS[mode];
          const isSelected = currentMode === mode;

          return (
            <button
              key={mode}
              type="button"
              disabled={disabled}
              onClick={() => {
                if (!isSelected) {
                  soundManager.playClick();
                  onSelectMode(mode);
                }
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              title={config.description}
            >
              {getIcon(mode)}
              <span>{config.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
