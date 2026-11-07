import React from 'react';
import { HelpCircle, X, ArrowUp, ArrowDown, Flame, Timer, Zap, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">How to Play & Win</h2>
              <p className="text-xs text-slate-400">Beginner guide to becoming a Number Master</p>
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

        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs text-slate-300">
          {/* Step 1: Game Modes */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
            <h3 className="text-sm font-bold text-white mb-1.5 flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs">
                1
              </span>
              4 Exciting Game Modes
            </h3>
            <ul className="mt-2 space-y-1.5 text-slate-300 font-mono text-[11px]">
              <li><strong className="text-amber-400">Classic:</strong> Standard countdown timer & limited attempts.</li>
              <li><strong className="text-yellow-400">Time Blitz:</strong> 60s total clock. Each victory awards +12s and chains rapid score multipliers!</li>
              <li><strong className="text-emerald-400">Zen Practice:</strong> Zero timer stress. Unlimited tries to master binary search.</li>
              <li><strong className="text-sky-400">Daily Puzzle:</strong> Same secret number worldwide every calendar day.</li>
            </ul>
          </div>

          {/* Step 2: Clues & Hints */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
            <h3 className="text-sm font-bold text-white mb-1.5 flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs">
                2
              </span>
              Directional Clues & Proximity Radar
            </h3>
            <div className="space-y-2 mt-2">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-950/30 border border-amber-500/20">
                <ArrowUp className="w-4 h-4 text-amber-400 shrink-0" />
                <span><strong>Too Low:</strong> The secret number is greater than your guess. Aim higher!</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-950/30 border border-rose-500/20">
                <ArrowDown className="w-4 h-4 text-rose-400 shrink-0" />
                <span><strong>Too High:</strong> The secret number is less than your guess. Aim lower!</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800">
                <Flame className="w-4 h-4 text-amber-400 shrink-0" />
                <span><strong>Proximity Radar:</strong> Burning Hot (within 3 numbers), Warm (within 10), Cool, or Cold.</span>
              </div>
            </div>
          </div>

          {/* Step 3: Detective Lifelines */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
            <h3 className="text-sm font-bold text-white mb-1.5 flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs">
                3
              </span>
              Detective Lifelines (Beginner Powers)
            </h3>
            <p className="text-slate-400 leading-relaxed">
              When stuck on a round, activate your 3 detective powers:
            </p>
            <ul className="mt-2 space-y-1 list-disc list-inside text-slate-300 text-[11px]">
              <li><strong>Parity Clue:</strong> Reveals whether the target number is Even or Odd.</li>
              <li><strong>Divisibility:</strong> Checks if divisible by 3, 4, 5, or 10.</li>
              <li><strong>Range Squeezer:</strong> Eliminates outer unviable extremes to narrow your target range!</li>
            </ul>
          </div>

          {/* Step 4: Pro Strategy & Scoring */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
            <h3 className="text-sm font-bold text-white mb-1.5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Optimal Strategy: Binary Search
            </h3>
            <p className="text-slate-400 leading-relaxed">
              Always guess the <strong>Optimal Midpoint</strong> on the search bar or click directly on the interactive number line! This eliminates 50% of the numbers with every turn, giving the highest score and speed bonuses.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 mt-4">
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
          >
            Ready to Play!
          </button>
        </div>
      </div>
    </div>
  );
};
