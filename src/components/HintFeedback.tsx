import React from 'react';
import { ArrowUp, ArrowDown, CheckCircle2, Flame, ThermometerSnowflake, Compass } from 'lucide-react';
import { GuessRecord } from '../types/game';

interface HintFeedbackProps {
  lastGuess?: GuessRecord;
  attemptsRemaining: number;
}

export const HintFeedback: React.FC<HintFeedbackProps> = ({ lastGuess }) => {
  if (!lastGuess) {
    return (
      <div className="flex items-center justify-center p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs">
        <Compass className="w-4 h-4 mr-2 text-slate-500" />
        <span>Make your first guess to receive direction and proximity clues!</span>
      </div>
    );
  }

  const isTooLow = lastGuess.hint === 'too_low';
  const isTooHigh = lastGuess.hint === 'too_high';
  const isCorrect = lastGuess.hint === 'correct';

  const proximityConfig = {
    burning_hot: {
      label: 'Burning Hot!',
      detail: `Within ${lastGuess.diff} numbers! Very close!`,
      color: 'text-amber-400',
      bgColor: 'bg-amber-950/40 border-amber-500/40',
      icon: Flame,
    },
    warm: {
      label: 'Warm',
      detail: 'Within striking distance.',
      color: 'text-orange-400',
      bgColor: 'bg-orange-950/30 border-orange-500/30',
      icon: Flame,
    },
    cool: {
      label: 'Cool',
      detail: 'Getting in the neighborhood.',
      color: 'text-sky-400',
      bgColor: 'bg-sky-950/30 border-sky-500/30',
      icon: ThermometerSnowflake,
    },
    cold: {
      label: 'Cold',
      detail: 'Still a fair distance away.',
      color: 'text-blue-400',
      bgColor: 'bg-blue-950/30 border-blue-500/30',
      icon: ThermometerSnowflake,
    },
    freezing: {
      label: 'Freezing',
      detail: 'Quite far from the target.',
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-950/30 border-indigo-500/30',
      icon: ThermometerSnowflake,
    },
  }[lastGuess.proximity];

  const ProximityIcon = proximityConfig.icon;

  return (
    <div
      className={`p-4 rounded-xl border transition-all animate-in fade-in duration-200 ${
        isCorrect
          ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-300'
          : isTooLow
          ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
          : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        {/* Main direction hint */}
        <div className="flex items-center gap-2">
          {isCorrect ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : isTooLow ? (
            <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <ArrowUp className="w-4 h-4 stroke-[3]" />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-lg bg-rose-500 text-white flex items-center justify-center font-bold">
              <ArrowDown className="w-4 h-4 stroke-[3]" />
            </div>
          )}

          <div>
            <div className="text-xs uppercase tracking-wider font-semibold opacity-75">
              Guess #{lastGuess.guessNumber}: {lastGuess.guess}
            </div>
            <div className="text-base font-extrabold tracking-tight">
              {isCorrect && 'Spot On! That is the secret number!'}
              {isTooLow && 'Too Low — Aim Higher!'}
              {isTooHigh && 'Too High — Aim Lower!'}
            </div>
          </div>
        </div>

        {/* Proximity thermometer tag */}
        {!isCorrect && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950/70 border border-slate-800 text-xs">
            <ProximityIcon className={`w-3.5 h-3.5 ${proximityConfig.color}`} />
            <span className={`font-semibold ${proximityConfig.color}`}>
              {proximityConfig.label}
            </span>
          </div>
        )}
      </div>

      {!isCorrect && (
        <p className="text-xs text-slate-300 ml-9">
          {isTooLow
            ? `The target is greater than ${lastGuess.guess}. ${proximityConfig.detail}`
            : `The target is less than ${lastGuess.guess}. ${proximityConfig.detail}`}
        </p>
      )}
    </div>
  );
};
