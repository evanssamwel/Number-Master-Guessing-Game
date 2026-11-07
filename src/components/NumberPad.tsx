import React, { useEffect, useRef } from 'react';
import { Send, Delete, RotateCcw } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface NumberPadProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: (guess: number) => void;
  min: number;
  max: number;
  disabled?: boolean;
  attemptsRemaining: number;
  maxAttempts: number;
}

export const NumberPad: React.FC<NumberPadProps> = ({
  value,
  onChange,
  onSubmit,
  min,
  max,
  disabled = false,
  attemptsRemaining,
  maxAttempts,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleKeyPress = (num: string) => {
    if (disabled) return;
    soundManager.playClick();
    if (value.length >= 4) return; // Prevent huge overflows
    const nextVal = value === '0' ? num : value + num;
    onChange(nextVal);
  };

  const handleBackspace = () => {
    if (disabled) return;
    soundManager.playClick();
    onChange(value.slice(0, -1));
  };

  const handleClear = () => {
    if (disabled) return;
    soundManager.playClick();
    onChange('');
  };

  const handleDelta = (delta: number) => {
    if (disabled) return;
    soundManager.playClick();
    const current = parseInt(value, 10);
    const base = isNaN(current) ? Math.floor((min + max) / 2) : current;
    const adjusted = Math.max(min, Math.min(max, base + delta));
    onChange(String(adjusted));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (disabled) return;
    const num = parseInt(value, 10);
    if (isNaN(num)) return;
    if (num < min || num > max) return;
    onSubmit(num);
  };

  const parsedNum = parseInt(value, 10);
  const isValid = !isNaN(parsedNum) && parsedNum >= min && parsedNum <= max;

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      {/* Primary Input Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="guess-input" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Enter Your Guess
          </label>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400">Attempts left:</span>
            <span className="font-mono font-bold text-amber-400 tabular-nums">
              {attemptsRemaining} / {maxAttempts}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              id="guess-input"
              type="number"
              min={min}
              max={max}
              value={value}
              disabled={disabled}
              onChange={(e) => onChange(e.target.value)}
              placeholder={`Between ${min} and ${max}`}
              className="w-full h-14 px-4 bg-slate-950 border-2 border-slate-800 focus:border-amber-400 rounded-xl text-2xl font-bold font-mono text-center text-white placeholder:text-slate-600 focus:outline-none transition-colors tabular-nums"
              autoComplete="off"
            />
            {value && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-slate-300 rounded-md transition-colors"
                title="Clear"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={disabled || !isValid}
            className={`h-14 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              isValid && !disabled
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/25 cursor-pointer active:scale-[0.98]'
                : 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed'
            }`}
          >
            <span>Guess</span>
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Validation warning if out of bounds */}
        {!isNaN(parsedNum) && (parsedNum < min || parsedNum > max) && (
          <p className="mt-1.5 text-xs text-rose-400 text-center font-medium">
            Please enter a number between {min} and {max}
          </p>
        )}
      </form>

      {/* Quick Adjuster Strip */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[-10, -1, 1, 10].map((delta) => (
          <button
            key={delta}
            type="button"
            disabled={disabled}
            onClick={() => handleDelta(delta)}
            className="py-1.5 text-xs font-mono font-medium rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors disabled:opacity-50"
          >
            {delta > 0 ? `+${delta}` : delta}
          </button>
        ))}
      </div>

      {/* On-screen Keypad for Quick Click or Mobile */}
      <div className="grid grid-cols-3 gap-2">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
          <button
            key={digit}
            type="button"
            disabled={disabled}
            onClick={() => handleKeyPress(digit)}
            className="h-11 rounded-lg bg-slate-950/70 hover:bg-slate-800 text-white font-mono text-base font-semibold border border-slate-800/80 transition-colors active:scale-[0.97] disabled:opacity-40"
          >
            {digit}
          </button>
        ))}

        {/* Bottom row: Clear, 0, Backspace */}
        <button
          type="button"
          disabled={disabled || !value}
          onClick={handleClear}
          className="h-11 rounded-lg bg-slate-950/70 hover:bg-slate-800 text-slate-400 hover:text-rose-400 font-medium text-xs border border-slate-800/80 transition-colors disabled:opacity-40"
        >
          Clear
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => handleKeyPress('0')}
          className="h-11 rounded-lg bg-slate-950/70 hover:bg-slate-800 text-white font-mono text-base font-semibold border border-slate-800/80 transition-colors active:scale-[0.97] disabled:opacity-40"
        >
          0
        </button>
        <button
          type="button"
          disabled={disabled || !value}
          onClick={handleBackspace}
          className="h-11 rounded-lg bg-slate-950/70 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center border border-slate-800/80 transition-colors disabled:opacity-40"
          title="Backspace"
        >
          <Delete className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
