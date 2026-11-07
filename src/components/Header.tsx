import React from 'react';
import { Volume2, VolumeX, Trophy, HelpCircle, BarChart3, RotateCcw, Award } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface HeaderProps {
  onOpenLeaderboard: () => void;
  onOpenAchievements: () => void;
  onOpenHowToPlay: () => void;
  onOpenStats: () => void;
  onRestartGame: () => void;
  isPlaying: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenLeaderboard,
  onOpenAchievements,
  onOpenHowToPlay,
  onOpenStats,
  onRestartGame,
  isPlaying,
}) => {
  const [muted, setMuted] = React.useState<boolean>(soundManager.isMuted());

  const handleToggleMute = () => {
    const isNowMuted = soundManager.toggleMute();
    setMuted(isNowMuted);
    if (!isNowMuted) {
      soundManager.playClick();
    }
  };

  return (
    <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black text-lg">
          #
        </div>
        <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
          Number Master
        </span>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-300">
        <button
          onClick={() => {
            soundManager.playClick();
            onOpenLeaderboard();
          }}
          className="flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap shrink-0"
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Leaderboard</span>
        </button>
        <button
          onClick={() => {
            soundManager.playClick();
            onOpenAchievements();
          }}
          className="flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap shrink-0"
        >
          <Award className="w-4 h-4 text-amber-300" />
          <span>Badges</span>
        </button>
        <button
          onClick={() => {
            soundManager.playClick();
            onOpenStats();
          }}
          className="flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap shrink-0"
        >
          <BarChart3 className="w-4 h-4 text-sky-400" />
          <span>My Stats</span>
        </button>
        <button
          onClick={() => {
            soundManager.playClick();
            onOpenHowToPlay();
          }}
          className="flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap shrink-0"
        >
          <HelpCircle className="w-4 h-4 text-emerald-400" />
          <span>How to Play</span>
        </button>
      </nav>

      {/* Zone 3: Primary Action / Tools */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={handleToggleMute}
          aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors"
          title={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            onRestartGame();
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700/80 rounded-lg transition-colors whitespace-nowrap"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{isPlaying ? 'Reset Round' : 'New Round'}</span>
        </button>
      </div>
    </header>
  );
};
