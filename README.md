# Locally Loop

**Frictionless, gamified productivity. Zero to-do maintenance, 100% flow.**

[![Version](https://img.shields.io/badge/version-1.0.0-alpha-yellow.svg)](#) [![License: GPLv3](https://img.shields.io/badge/license-GPLv3-green.svg)](#) [![Status: Early Access](https://img.shields.io/badge/status-early_access-orange.svg)](#)

---

## What is Locally Loop?

Locally Loop is a **local-only**, **privacy-first**, gamified productivity tool that keeps you in your flow state. Inspired by reward loops in modern games (e.g., League of Legends), it removes the friction of traditional task apps: just type what you did or plan to do, press **Enter**, and instantly earn XP and feedback.

Everything runs entirely in your browser. No backend, no telemetry, no middleman so your data stays yours, lightning-fast and always private.

<img width="1477" height="255" alt="image" src="https://github.com/user-attachments/assets/14c2aaba-7164-474c-a990-6217d9c918bf" />

---

## Table of Contents

1. [Key Features](#key-features)
2. [Getting Started](#getting-started)
3. [Usage](#usage)
4. [Architecture & LLM Integration](#architecture--llm-integration)
5. [Security & Privacy](#security--privacy)
6. [Roadmap](#roadmap)
7. [Contributing](#contributing)
8. [License](#license)

---

## Key Features

* **Ambient Input**: Single, persistent input bar—no to-do lists, no modals, no distractions.
* **Instant Logging & Completion**: Natural-language commands like `Fixed import bug` instantly create or complete tasks.
* **Micro‑feedback & XP**: Tiny animations(inspired from [tetr.io](https://tetr.io/)) powered by (Pixi.js)[https://pixijs.com/] and toast notifications reward progress in real time.
* **Next‑Step Suggestions**: LLM-driven prompts suggest your next micro-step to maintain momentum.
* **Local Database**: Powered by **RxDB** with **Dexie** for robust, reactive IndexedDB storage; preferences and settings persist via **Zustand** in localStorage.
* **Session Summaries & Evolution**: Generate on‑demand summaries (`S`) and growth narratives (`E`) to reflect and iterate.
* **Local‑First & Private**: All data stays on-device; **no cloud sync**, no telemetry, no accounts.
* **Modular & Extendable**: Built with React, TypeScript, and Tailwind CSS—easily plug in new UI components or reward mechanics.
* **Voice Recording**: Speak your actions instead of typing—hit the mic button or press V to record a voice entry that’s transcribed with OpenAI Whisper API(or Google API support in the future) and processed.
---

## Getting Started

### Prerequisites

* **Node.js 18+**
* **npm 8+**

### Installation & Run

```bash
# Clone the repo
git clone https://github.com/iyiolacak/local-loop.git
cd local-loop

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to begin.
*CLI client coming soon!* 🚀

---

## Usage

### 1. Log or Complete

* Focus the input bar (hotkey `/`).
* Type an action, e.g., `Start blog outline` or `Write test cases`, and press **Enter**.
* Watch your XP increase: `Write test cases logged! +10 XP (Planning↑)`.

```bash
/> Fixed import bug
```

### 2. Accept Next Step

If you log a forward‑looking item, the app may suggest your next micro‑step:

```
Next: Write unit tests (+10 XP)
```

Press **Enter** or click **Go** to accept and log it.

### 3. Overlays

* **Session Summary** (`S`): Text‑rich recap of your current session.
* **Evolution** (`E`): Cumulative skill bars and growth narrative.
* **Journal** (`J`): Chronological log of all past sessions.
* **Pre‑Quest Lobby** (`L`): Countdown for upcoming high-stakes quests.

### 4. Data Persistence

All data persists automatically in your browser via RxDB/Dexie and Zustand's `persist` middleware.

---

## Architecture & LLM Integration

* **Database**: RxDB for reactive data handling and Dexie for IndexedDB abstraction.
* **State & Settings**: Zustand with `persist` stores preferences in localStorage.
* **Frontend**: React + TypeScript + Tailwind CSS
* **Animations & UI**: Framer Motion for micro‑animations and toasts
* **LLM Function API**: Inputs are sent to an LLM endpoint for intent detection, reward calculation, and summaries via functions:

  1. `list_active_tasks`
  2. `create_new_task`
  3. `complete_task`
  4. `skip_task`
  5. `calculate_reward` (black‑box, dynamic XP logic)
  6. `get_session_summary`
  7. `get_evolution_stats`
  8. `generate_reflective_quote`

Requests payload:

```json
{
  "inputText": "...",
  "context": {
    "activeTasks": [...],
    "recentEntries": [...],
    "userStats": {...},
    "timestamp": 1690000000000
  }
}
```

---

## Security & Privacy

* **Local‑Only Storage**: All logs and stats remain on-device.
* **No Cloud Sync (yet)**: No backend replication—your data never leaves your browser.
* **No Telemetry**: We never collect usage data or analytics.

---

## Roadmap

* **Cloud Sync (Privacy‑oriented)**: Exploring P2P replication via RxDB plugins.
* **XP Configurability**: API for custom reward rules (WIP).
* **CLI Client**: Native terminal interface (Node.js + Ink).
* **Plugin System**: Custom XP modules, UI overlays, and LLM hooks.
* **Mobile PWA**: Offline‑first mobile web experience.
* **Alpha Launch**: Stabilize core features and publish v1.0.

Have ideas or feedback? File an issue or open a PR! 🔌

---

## Contributing

1. Fork the repo and create a feature branch.
2. Write tests and ensure ESLint/Prettier pass.
3. Open a pull request describing your changes.
4. We’ll review and iterate — together, we’ll build the ultimate flow‑state tool.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for more details.

---

## License

GPLv3 © 2025 [iyiolacak](https://github.com/iyiolacak)

*Turn every intention into compounding progress. The  progress you can feel and measure*
