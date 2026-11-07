# Number Master – Guessing Game

> An engaging, beginner-friendly number guessing game featuring interactive binary search visualization, 4 game modes, smart proximity radar, detective lifelines, countdown timers, winning streak multipliers, and local leaderboards.

![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)

---

## 🎯 Highlights & Features

- **🎮 4 Diverse Game Modes**:
  - **Classic**: The quintessential challenge with difficulty-tiered countdown timers and attempt limits.
  - **Time Blitz**: Fast-paced arcade action starting with 60 seconds. Each solved puzzle awards **+12s** and chains massive point multipliers!
  - **Zen Practice**: Calm, zero-timer-stress mode with unlimited attempts for beginners mastering binary search.
  - **Daily Puzzle**: A deterministic, daily-seeded puzzle shared by players worldwide every calendar day.

- **🎚️ 3 Difficulty Tiers**:
  - **Easy**: Range `1 – 50` · 10 attempts · 60s timer · 1,000 base pts
  - **Medium**: Range `1 – 100` · 8 attempts · 45s timer · 2,500 base pts
  - **Hard**: Range `1 – 500` · 7 attempts · 35s timer · 5,000 base pts

- **🧭 Directional & Proximity Clues**:
  - **Directional Feedback**: Clear **"Too Low — Aim Higher"** and **"Too High — Aim Lower"** indicators with directional arrows.
  - **Proximity Radar**: Clues ranging from **"Burning Hot"** (within 3 numbers) to **"Warm"**, **"Cool"**, **"Cold"**, and **"Freezing"**.
  - **Dynamic Audio Pitch**: Web Audio synthesizer dynamically raises the frequency of the chime as your guess gets closer to the secret number.

- **📊 Interactive Range Visualizer**:
  - Live visual bar showing active search boundaries narrowing down as you make guesses.
  - **Interactive Number Line**: Click anywhere on the bar to instantly select that candidate number.
  - **Optimal Midpoint Shortcut**: One-click button or keyboard shortcut (`M`) to automatically stage the binary search midpoint.
  - Historical guess pins plotted along the track with directional color coding.

- **🔍 Detective Lifelines**:
  - **Parity Clue**: Reveals whether the secret number is **Even** or **Odd**.
  - **Divisibility Clue**: Checks whether the secret number is divisible by 3, 4, 5, or 10.
  - **Range Squeezer**: Squeezes outer unviable boundaries by 40% towards the target.

- **🔥 Scoring & Winning Streaks**:
  - Dynamic score calculation combining base difficulty points, speed bonus (remaining seconds), and precision bonus (unused attempts).
  - Consecutive wins increase your **Streak Multiplier** by **+10% per consecutive win** (up to 2.5×).

- **🏆 Hall of Fame & Career Stats**:
  - Persistent local leaderboard filterable by difficulty and game mode.
  - Preloaded historical computing champions (*Ada Lovelace*, *Alan Turing*, *Grace Hopper*, *Katherine Johnson*, *Claude Shannon*, *Srinivasa Ramanujan*).
  - Career stats tracking total games, games won, win rate %, personal best streak, and all-time high score.

- **🎖️ 8 Unlockable Achievements & Badges**:
  - *First Triumph*, *Speed Demon*, *Sharpshooter*, *On a Roll*, *Grandmaster*, *High Roller*, *Detective's Intuition*, and *Daily Sleuth*.

- **🔊 Audio & Celebration**:
  - Built-in Web Audio API sound generator (no external audio assets required; immune to broken links).
  - High-energy HTML5 Canvas confetti bursts on victory.
  - Audio mute/unmute toggle persisted across sessions.

---

## 🕹️ Controls & Keyboard Shortcuts

| Input / Shortcut | Action |
| :--- | :--- |
| **Number Keys (`0` – `9`)** | Type your guess into the active input box |
| **Enter / Return** | Submit your current guess |
| **`M` or `m`** | Auto-fill the **Optimal Midpoint** (Binary Search) |
| **`-10` / `-1` / `+1` / `+10`** | Quick adjustment buttons |
| **Interactive Number Line** | Click anywhere along the visual bar to stage that number |
| **Touch Keypad** | On-screen numerical keypad for mobile and touch devices |
| **Mute Button** | Toggle synthesized audio sound effects on/off |

---

## 📐 Scoring Formula

When you crack the secret number, your round score is calculated as follows:

$$\text{Total Score} = \Big(\text{Base Score} + (\text{Seconds Remaining} \times \text{Speed Multiplier}) + (\text{Unused Attempts} \times \text{Precision Multiplier})\Big) \times \text{Streak Multiplier}$$

| Difficulty | Base Score | Speed Multiplier | Precision Multiplier | Max Attempts |
| :--- | :---: | :---: | :---: | :---: |
| **Easy** | 1,000 pts | 30 pts/s | 100 pts/attempt | 10 |
| **Medium** | 2,500 pts | 50 pts/s | 200 pts/attempt | 8 |
| **Hard** | 5,000 pts | 80 pts/s | 350 pts/attempt | 7 |

*Consecutive wins add +10% per win to the Streak Multiplier, capped at 2.5×.*

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: [React 19](https://react.dev/) with functional components and hooks
- **Language**: [TypeScript](https://www.typescriptlang.org/) for strict type safety
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with custom dark theme palette
- **Icons**: [Lucide React](https://lucide.dev/)
- **FX**: [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
- **Audio**: Web Audio API oscillator synthesis (sine, square, sawtooth, triangle waves)
- **Persistence**: `localStorage` with JSON serialization for leaderboards, player stats, and badges
- **Build Tool**: [Vite 8](https://vitejs.dev/)

---

## 📁 Project Structure

```text
├── index.html                   # HTML entry point with metadata & Google Fonts
├── metadata.json                # AI Studio application metadata
├── package.json                 # Dependencies & scripts
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite configuration with Tailwind CSS v4 plugin
├── src/
│   ├── main.tsx                 # React DOM root entry
│   ├── index.css                # Global Tailwind CSS directives & scrollbar styling
│   ├── App.tsx                  # Core game state engine & main view container
│   ├── types/
│   │   └── game.ts              # TypeScript interfaces for modes, difficulties, records
│   ├── utils/
│   │   ├── audio.ts             # Web Audio API synthesized sound effects
│   │   └── storage.ts           # LocalStorage helpers for leaderboard, stats, & seeds
│   └── components/
│       ├── Header.tsx           # 3-zone top bar navigation
│       ├── ModeSelector.tsx     # Classic / Blitz / Zen / Daily mode selector
│       ├── DifficultySelector.tsx # Easy / Medium / Hard segmented control
│       ├── CountdownTimer.tsx   # Circular SVG progress ring timer
│       ├── RangeVisualizer.tsx  # Interactive number line & binary search bounds
│       ├── NumberPad.tsx        # Direct input, quick adjusters, & touch keypad
│       ├── HintFeedback.tsx     # Directional banner & temperature proximity radar
│       ├── GuessHistory.tsx     # Attempt history table with deltas
│       ├── StreakDisplay.tsx    # Streak counter, multiplier HUD, and career score
│       ├── DetectiveClues.tsx   # Parity, divisibility, and range squeezer lifelines
│       ├── GameSummaryModal.tsx # Victory celebration, confetti, & score recording
│       ├── LeaderboardModal.tsx # Hall of Fame champions table with filters
│       ├── AchievementsModal.tsx# Unlocked badges & career milestones
│       ├── StatsModal.tsx       # Win rate, total games, & career statistics
│       └── HowToPlayModal.tsx   # Beginner guide and binary search tutorial
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm** or **bun** / **pnpm**

### Installation

1. Clone or download the repository:
   ```bash
   git clone <repository-url>
   cd number-master
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

### Production Build

To build the optimized static bundle:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 🧠 Optimal Strategy Tip (Binary Search)

Number Master is designed to reward computational thinking. On any given round, guessing the **midpoint** of your remaining range eliminates 50% of the remaining search space regardless of whether the hint is "Too High" or "Too Low":

- In **Easy Mode (1–50)**: Solvable in at most $\lceil\log_2 50\rceil = 6$ guesses.
- In **Medium Mode (1–100)**: Solvable in at most $\lceil\log_2 100\rceil = 7$ guesses.
- In **Hard Mode (1–500)**: Solvable in at most $\lceil\log_2 500\rceil = 9$ guesses.

Use the **Optimal Midpoint** button or press `M` to execute binary search with speed!

---

## 📄 License

This project is licensed under the **Apache-2.0 License**.
