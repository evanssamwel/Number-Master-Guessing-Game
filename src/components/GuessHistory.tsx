import React from 'react';
import { ArrowUp, ArrowDown, History, Check } from 'lucide-react';
import { GuessRecord } from '../types/game';

interface GuessHistoryProps {
  history: GuessRecord[];
  maxAttempts: number;
}

export const GuessHistory: React.FC<GuessHistoryProps> = ({ history, maxAttempts }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Round History
          </span>
        </div>
        <span className="text-xs text-slate-400 font-mono tabular-nums">
          {history.length} / {maxAttempts} used
        </span>
      </div>

      {history.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-500 text-xs">
          <p>No guesses submitted yet.</p>
          <p className="mt-1 text-slate-600">Your attempts and clues will appear here.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[340px]">
          {history.map((record) => {
            const isLow = record.hint === 'too_low';
            const isHigh = record.hint === 'too_high';
            const isCorrect = record.hint === 'correct';

            return (
              <div
                key={record.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700/80 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 text-[11px] font-mono text-slate-500">
                    #{record.guessNumber}
                  </span>

                  <span className="text-base font-bold font-mono text-white tabular-nums">
                    {record.guess}
                  </span>

                  <div className="flex items-center gap-1 text-xs">
                    {isCorrect ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        Correct!
                      </span>
                    ) : isLow ? (
                      <span className="text-amber-400 font-medium flex items-center gap-1">
                        <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
                        Too Low
                      </span>
                    ) : (
                      <span className="text-rose-400 font-medium flex items-center gap-1">
                        <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
                        Too High
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  {!isCorrect && (
                    <span className="font-mono text-[11px] text-slate-500">
                      off by {record.diff}
                    </span>
                  )}
                  <span
                    className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md ${
                      record.proximity === 'burning_hot'
                        ? 'bg-amber-500/20 text-amber-300'
                        : record.proximity === 'warm'
                        ? 'bg-orange-500/20 text-orange-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {record.proximity.replace('_', ' ')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
