/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { ModeSelector } from './components/ModeSelector';
import { DifficultySelector } from './components/DifficultySelector';
import { CountdownTimer } from './components/CountdownTimer';
import { RangeVisualizer } from './components/RangeVisualizer';
import { NumberPad } from './components/NumberPad';
import { HintFeedback } from './components/HintFeedback';
import { GuessHistory } from './components/GuessHistory';
import { StreakDisplay } from './components/StreakDisplay';
import { DetectiveClues } from './components/DetectiveClues';
import { GameSummaryModal } from './components/GameSummaryModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { StatsModal } from './components/StatsModal';
import { AchievementsModal } from './components/AchievementsModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import {
  Difficulty,
  DIFFICULTY_CONFIGS,
  GameMode,
  GameStatus,
  GuessRecord,
  HintType,
  LifelinesState,
  ProximityType,
  ScoreBreakdown,
} from './types/game';
import {
  addLeaderboardEntry,
  getDailySeedNumber,
  getPlayerStats,
  getStoredPlayerName,
  updatePlayerStats,
} from './utils/storage';
import { soundManager } from './utils/audio';

export default function App() {
  // Game Setup & Mode State
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const config = DIFFICULTY_CONFIGS[difficulty];

  // Helper to generate a random number
  const getRandomNumber = useCallback((min: number, max: number, mode: GameMode): number => {
    if (mode === 'daily') {
      return getDailySeedNumber(min, max);
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }, []);

  // Game Engine State
  const [targetNumber, setTargetNumber] = useState<number>(() => getRandomNumber(config.min, config.max, 'classic'));
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [inputValue, setInputValue] = useState<string>('');
  const [history, setHistory] = useState<GuessRecord[]>([]);

  // Narrowing bounds for binary-search assistance
  const [currentMin, setCurrentMin] = useState<number>(config.min);
  const [currentMax, setCurrentMax] = useState<number>(config.max);

  // Lifelines
  const [lifelines, setLifelines] = useState<LifelinesState>({
    parityUsed: false,
    divisibilityUsed: false,
    rangeSqueezeUsed: false,
    revealedClues: [],
  });

  // Timer State
  const [timeRemaining, setTimeRemaining] = useState<number>(config.timeSeconds);
  const timerRef = useRef<number | null>(null);

  // Blitz mode streak counter
  const [blitzSolved, setBlitzSolved] = useState<number>(0);

  // Player & Streak State
  const [stats, setStats] = useState(getPlayerStats);
  const [currentStreak, setCurrentStreak] = useState<number>(() => getPlayerStats().currentStreak);
  const [scoreBreakdown, setScoreBreakdown] = useState<ScoreBreakdown | undefined>(undefined);
  const [hasSavedScore, setHasSavedScore] = useState<boolean>(false);
  const [newAchievements, setNewAchievements] = useState<string[]>([]);

  // Modals State
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState<boolean>(false);
  const [isStatsOpen, setIsStatsOpen] = useState<boolean>(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState<boolean>(false);

  // Calculate proximity based on difficulty range
  const calculateProximity = useCallback((diff: number, maxRange: number): ProximityType => {
    const ratio = diff / maxRange;
    if (diff <= 3 || ratio <= 0.02) return 'burning_hot';
    if (diff <= 10 || ratio <= 0.1) return 'warm';
    if (diff <= 25 || ratio <= 0.25) return 'cool';
    if (ratio <= 0.5) return 'cold';
    return 'freezing';
  }, []);

  // Start new round
  const startNewGame = useCallback(
    (diff: Difficulty = difficulty, mode: GameMode = gameMode, preserveBlitzClock = false) => {
      const newConfig = DIFFICULTY_CONFIGS[diff];
      const newSecret = getRandomNumber(newConfig.min, newConfig.max, mode);

      setDifficulty(diff);
      setGameMode(mode);
      setTargetNumber(newSecret);
      setGameStatus('playing');
      setInputValue('');
      setHistory([]);
      setCurrentMin(newConfig.min);
      setCurrentMax(newConfig.max);
      setLifelines({
        parityUsed: false,
        divisibilityUsed: false,
        rangeSqueezeUsed: false,
        revealedClues: [],
      });
      setScoreBreakdown(undefined);
      setHasSavedScore(false);
      setNewAchievements([]);

      if (!preserveBlitzClock) {
        setTimeRemaining(mode === 'blitz' ? 60 : newConfig.timeSeconds);
        if (mode !== 'blitz') setBlitzSolved(0);
      }

      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    },
    [difficulty, gameMode, getRandomNumber]
  );

  // Check achievements after a win
  const evaluateAchievements = useCallback(
    (attemptsCount: number, timeLeft: number, streakCount: number, score: number): string[] => {
      const currentUnlocked = stats.unlockedAchievements;
      const newlyUnlocked: string[] = [];

      const check = (id: string, condition: boolean) => {
        if (condition && !currentUnlocked.includes(id) && !newlyUnlocked.includes(id)) {
          newlyUnlocked.push(id);
        }
      };

      check('first_win', true);
      check('fast_guess', timeLeft >= 25 && gameMode !== 'zen');
      check('sniper', attemptsCount <= 3);
      check('streak_3', streakCount >= 3);
      check('streak_5', streakCount >= 5);
      check('score_5k', score >= 5000);
      check('used_clue', lifelines.parityUsed || lifelines.divisibilityUsed || lifelines.rangeSqueezeUsed);
      check('daily_done', gameMode === 'daily');

      if (newlyUnlocked.length > 0) {
        soundManager.playAchievementSound();
      }

      return newlyUnlocked;
    },
    [gameMode, lifelines, stats.unlockedAchievements]
  );

  // Handle Loss
  const handleGameLoss = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setGameStatus('lost');
    setCurrentStreak(0);
    setBlitzSolved(0);
    const updatedStats = updatePlayerStats(false, 0, difficulty, gameMode);
    setStats(updatedStats);
  }, [difficulty, gameMode]);

  // Handle Win
  const handleGameWin = useCallback(
    (attemptsCount: number, timeLeft: number) => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }

      const newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);

      const nextBlitzSolved = gameMode === 'blitz' ? blitzSolved + 1 : 0;
      setBlitzSolved(nextBlitzSolved);

      // Compute score
      const baseScore = config.baseScore;
      const timeMultiplier = difficulty === 'hard' ? 80 : difficulty === 'medium' ? 50 : 30;
      const timeBonus = gameMode === 'zen' ? 0 : timeLeft * timeMultiplier;
      const unusedAttempts = Math.max(0, config.maxAttempts - attemptsCount);
      const attemptMultiplier = difficulty === 'hard' ? 350 : difficulty === 'medium' ? 200 : 100;
      const attemptsBonus = unusedAttempts * attemptMultiplier;

      const streakMultiplier = Math.min(2.5, 1 + currentStreak * 0.1);
      const rawTotal = (baseScore + timeBonus + attemptsBonus) * streakMultiplier;
      const totalScore = Math.round(rawTotal);

      const breakdown: ScoreBreakdown = {
        baseScore,
        timeBonus,
        attemptsBonus,
        streakMultiplier,
        cluesDeduction: 0,
        totalScore,
      };

      setScoreBreakdown(breakdown);
      setGameStatus('won');

      // Check achievements
      const newlyEarned = evaluateAchievements(attemptsCount, timeLeft, newStreak, totalScore);
      setNewAchievements(newlyEarned);

      const updatedStats = updatePlayerStats(true, totalScore, difficulty, gameMode, newlyEarned);
      setStats(updatedStats);

      // Auto-save to leaderboard
      const storedName = getStoredPlayerName();
      addLeaderboardEntry({
        playerName: storedName,
        score: totalScore,
        difficulty,
        mode: gameMode,
        attempts: attemptsCount,
        maxAttempts: config.maxAttempts,
        timeRemaining: timeLeft,
        timeElapsed: config.timeSeconds - timeLeft,
        streak: newStreak,
        targetNumber,
      });
      setHasSavedScore(true);

      // In blitz mode, award extra bonus time!
      if (gameMode === 'blitz') {
        soundManager.playTimeBonusSound();
        setTimeRemaining((prev) => Math.min(90, prev + 12));
      }
    },
    [blitzSolved, config.baseScore, config.maxAttempts, config.timeSeconds, currentStreak, difficulty, evaluateAchievements, gameMode, targetNumber]
  );

  // Lifeline handlers
  const handleUseParity = () => {
    const isEven = targetNumber % 2 === 0;
    setLifelines((prev) => ({
      ...prev,
      parityUsed: true,
      revealedClues: [
        ...prev.revealedClues,
        {
          id: `clue-${Date.now()}`,
          type: 'parity',
          text: `Target is ${isEven ? 'EVEN' : 'ODD'}`,
        },
      ],
    }));
  };

  const handleUseDivisibility = () => {
    let text = 'Target is NOT divisible by 3, 5, or 10';
    if (targetNumber % 10 === 0) text = 'Target is divisible by 10 (and 5, 2)';
    else if (targetNumber % 5 === 0) text = 'Target is divisible by 5 (ends in 5)';
    else if (targetNumber % 3 === 0) text = 'Target is divisible by 3';
    else if (targetNumber % 4 === 0) text = 'Target is divisible by 4';

    setLifelines((prev) => ({
      ...prev,
      divisibilityUsed: true,
      revealedClues: [
        ...prev.revealedClues,
        {
          id: `clue-${Date.now()}`,
          type: 'divisibility',
          text,
        },
      ],
    }));
  };

  const handleUseRangeSqueeze = () => {
    // Squeeze the unviable boundaries towards the target
    const lowerMargin = Math.floor((targetNumber - currentMin) * 0.4);
    const upperMargin = Math.floor((currentMax - targetNumber) * 0.4);

    const nextMin = Math.max(currentMin, currentMin + Math.max(1, lowerMargin));
    const nextMax = Math.min(currentMax, currentMax - Math.max(1, upperMargin));

    if (nextMin <= nextMax) {
      setCurrentMin(nextMin);
      setCurrentMax(nextMax);
    }

    setLifelines((prev) => ({
      ...prev,
      rangeSqueezeUsed: true,
      revealedClues: [
        ...prev.revealedClues,
        {
          id: `clue-${Date.now()}`,
          type: 'range',
          text: `Range squeezed to [${nextMin} ... ${nextMax}]`,
        },
      ],
    }));
  };

  // Main Guess Processing
  const handleGuessSubmit = (guess: number) => {
    if (gameStatus !== 'playing') return;

    const diff = Math.abs(guess - targetNumber);
    let hint: HintType = 'correct';
    if (guess < targetNumber) hint = 'too_low';
    else if (guess > targetNumber) hint = 'too_high';

    const proximity = calculateProximity(diff, config.max - config.min);

    // Audio with proximity scaling
    if (hint === 'correct') {
      // handled on win
    } else if (hint === 'too_low') {
      soundManager.playTooLow(proximity);
    } else {
      soundManager.playTooHigh(proximity);
    }

    // Narrow down search bounds
    let nextMin = currentMin;
    let nextMax = currentMax;
    if (hint === 'too_low') {
      nextMin = Math.max(currentMin, guess + 1);
      setCurrentMin(nextMin);
    } else if (hint === 'too_high') {
      nextMax = Math.min(currentMax, guess - 1);
      setCurrentMax(nextMax);
    }

    const nextRecord: GuessRecord = {
      id: `guess-${Date.now()}`,
      guessNumber: history.length + 1,
      guess,
      hint,
      proximity,
      diff,
      timestamp: Date.now(),
      rangeSnapshot: { min: nextMin, max: nextMax },
    };

    const newHistory = [nextRecord, ...history];
    setHistory(newHistory);
    setInputValue('');

    // Check Win/Loss conditions
    if (hint === 'correct') {
      handleGameWin(newHistory.length, timeRemaining);
    } else if (gameMode !== 'zen' && newHistory.length >= config.maxAttempts) {
      handleGameLoss();
    }
  };

  // Timer loop (bypassed in Zen mode)
  useEffect(() => {
    if (gameStatus !== 'playing' || gameMode === 'zen') {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = window.setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleGameLoss();
          return 0;
        }
        if (prev <= 6) {
          soundManager.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameMode, gameStatus, handleGameLoss]);

  // Keyboard shortcut listener ('M' for midpoint)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'm' || e.key === 'M') {
        const mid = Math.floor((currentMin + currentMax) / 2);
        setInputValue(String(mid));
        soundManager.playClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentMin, currentMax]);

  const attemptsRemaining =
    gameMode === 'zen' ? 999 : Math.max(0, config.maxAttempts - history.length);
  const lastGuess = history[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Bar Navigation */}
      <Header
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onOpenAchievements={() => setIsAchievementsOpen(true)}
        onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        onRestartGame={() => startNewGame()}
        isPlaying={gameStatus === 'playing'}
      />

      {/* Main Game Arena */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* Mode Selector & Difficulty Strip */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-6">
            <ModeSelector
              currentMode={gameMode}
              onSelectMode={(mode) => startNewGame(difficulty, mode)}
              disabled={gameStatus !== 'playing' && history.length === 0}
            />
          </div>

          <div className="md:col-span-6">
            <DifficultySelector
              currentDifficulty={difficulty}
              onSelectDifficulty={(diff) => startNewGame(diff, gameMode)}
              disabled={gameStatus !== 'playing' && history.length === 0}
            />
          </div>
        </section>

        {/* Meters Strip: Countdown Timer & Winning Streak Hub */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-4 flex justify-center md:justify-start">
            <CountdownTimer
              timeRemaining={timeRemaining}
              totalTime={gameMode === 'blitz' ? 60 : config.timeSeconds}
              isPaused={gameStatus !== 'playing'}
              isZen={gameMode === 'zen'}
            />
          </div>

          <div className="md:col-span-8">
            <StreakDisplay
              currentStreak={currentStreak}
              bestStreak={stats.bestStreak}
              currentScore={stats.totalScore}
            />
          </div>
        </section>

        {/* Interactive Number Line & Binary Search Visualizer */}
        <section>
          <RangeVisualizer
            absoluteMin={config.min}
            absoluteMax={config.max}
            currentMin={currentMin}
            currentMax={currentMax}
            history={history}
            lastGuess={lastGuess?.guess}
            onSelectSuggestion={(val) => setInputValue(String(val))}
            disabled={gameStatus !== 'playing'}
          />
        </section>

        {/* Interactive Play Arena: Two-column split */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
          {/* Left Column: Hint Feedback banner + Number Input Pad + Detective Clues */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Clue & Direction Banner */}
            <HintFeedback
              lastGuess={lastGuess}
              attemptsRemaining={attemptsRemaining}
            />

            {/* Input & Keypad */}
            <NumberPad
              value={inputValue}
              onChange={setInputValue}
              onSubmit={handleGuessSubmit}
              min={config.min}
              max={config.max}
              disabled={gameStatus !== 'playing'}
              attemptsRemaining={attemptsRemaining}
              maxAttempts={config.maxAttempts}
            />

            {/* Beginner Detective Lifelines */}
            <DetectiveClues
              lifelines={lifelines}
              targetNumber={targetNumber}
              currentMin={currentMin}
              currentMax={currentMax}
              onUseParity={handleUseParity}
              onUseDivisibility={handleUseDivisibility}
              onUseRangeSqueeze={handleUseRangeSqueeze}
              disabled={gameStatus !== 'playing'}
            />
          </div>

          {/* Right Column: Round Attempt History */}
          <div className="lg:col-span-5 h-full">
            <GuessHistory
              history={history}
              maxAttempts={config.maxAttempts}
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-4 px-6 border-t border-slate-900 text-center text-xs text-slate-500">
        <div className="flex items-center justify-center gap-2">
          <span>Number Master</span>
          <span aria-hidden="true">·</span>
          <span>Binary Search Detective</span>
          <span aria-hidden="true">·</span>
          <button
            onClick={() => setIsHowToPlayOpen(true)}
            className="hover:text-slate-300 underline underline-offset-2 transition-colors cursor-pointer"
          >
            Rules & Strategy Guide
          </button>
        </div>
      </footer>

      {/* Modals & Dialogs */}
      {(gameStatus === 'won' || gameStatus === 'lost') && (
        <GameSummaryModal
          status={gameStatus}
          targetNumber={targetNumber}
          difficultyConfig={config}
          mode={gameMode}
          attemptsTaken={history.length}
          timeRemaining={timeRemaining}
          timeElapsed={config.timeSeconds - timeRemaining}
          scoreBreakdown={scoreBreakdown}
          streak={currentStreak}
          blitzSolved={blitzSolved}
          newAchievements={newAchievements}
          onPlayAgain={(newDiff) =>
            startNewGame(newDiff || difficulty, gameMode, gameMode === 'blitz' && gameStatus === 'won')
          }
          onSaveScore={(name) => {
            if (scoreBreakdown) {
              addLeaderboardEntry({
                playerName: name,
                score: scoreBreakdown.totalScore,
                difficulty,
                mode: gameMode,
                attempts: history.length,
                maxAttempts: config.maxAttempts,
                timeRemaining,
                timeElapsed: config.timeSeconds - timeRemaining,
                streak: currentStreak,
                targetNumber,
              });
              setHasSavedScore(true);
            }
          }}
          hasSavedScore={hasSavedScore}
        />
      )}

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />

      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        unlockedIds={stats.unlockedAchievements}
      />

      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
        onStatsReset={() => setStats(getPlayerStats())}
      />

      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />
    </div>
  );
}
