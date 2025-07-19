# Locally Loop | Productivity at Localhost

A **local-first**, **frictionless**, gamified productivity tool. From intention to impact in a single line and no plans, no pause, just progress.

Drop the chore of to-do lists **Inspired by the flow state and reward loops of gaming (e.g., League of Legends)**, Locally Loop requires **zero task maintenance**, you simply type what you did or want to do, hit Enter, and get instant XP and feedback.
<img width="1477" height="255" alt="image" src="https://github.com/user-attachments/assets/14c2aaba-7164-474c-a990-6217d9c918bf" />

Locally Loop lives right in your browser(CLI soon). No backend, no telemetry, so every action is private, persistent, and lightning-fast. Simply type what you did("fed my car")
---

## 🎯 Key Features

* **Ambient Input Bar**: A single persistent input field; no to-do lists, no multi-step forms.
* **Instant Logging & Completion**: Type in natural language to **create** or **complete** tasks with one keystroke.
* **Ephemeral Feedback**: Micro-animations and toasts flash to reward actions without breaking flow.
* **LLM-Driven Logic**: The model handles intent detection, state transitions, and summary generation via function calls.
* **Local-First & Private**: All data is stored in-browser (localStorage/IndexedDB); nothing is sent externally*.
* **Session Summaries & Evolution**: On-demand recaps and growth narratives powered by LLM functions.
* **Modular Architecture**: React + TypeScript + Tailwind CSS, with clean separation of UI, hooks/services, and state.

*: Although Locally Loop is fully local in storage and architecture, it leverages an external LLM endpoint to interpret inputs, generate rewards, and craft summaries. Treat it like ChatGPT: your inputs are sent to a language model service, but no persistent account data, telemetry, or analytics are ever transmitted.

---

## Quick Start

```bash
# Prerequisites: Node.js 18+
git clone https://github.com/iyiolacak/local-loop.git
cd local-loop
npm i
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) – the entire app runs client‑side; no backend required.

---

## 🖥️ Usage

1. **Log or Complete**

   * Click or focus the ambient input bar (hotkey `/`).
   * Type your action, e.g., `Fixed import bug` or `Start blog outline`, and press Enter.
   * Instantly see a toast:
     `Fixed import bug logged! +25 XP (Execution↑)`

2. **Next Micro-Step**

   * For forward-looking inputs, the app may suggest the next step:
     `Next: Write test cases (+10 XP)`
   * Press Enter again or click "Go" in the toast to accept.

3. **Open Overlays**

   * **Session Summary**: Press `S` to open a text-rich recap of your current session.
   * **Evolution**: Press `E` to view your cumulative skill bars and growth narrative.
   * **Journal**: Press `J` to browse chronological logs of all sessions.
   * **Pre-Quest Lobby**: Press `L` to see the lobby countdown for high-stakes quests.

4. **Persisting Data**

   * All session entries and history are automatically persisted using Zustand's `persist` middleware in your browser’s localStorage.

---

## 🔌 LLM Integration & Function API

The app communicates with an LLM endpoint via these functions:

1. `list_active_tasks`
2. `create_new_task`
3. `complete_task`
4. `skip_task`
5. `calculate_reward`
6. `get_session_summary`
7. `get_evolution_stats`
8. `generate_reflective_quote`

Invoke the LLM by sending:

```json
{ "inputText": "…", "context": { activeTasks, recentEntries, userStats, timestamp } }
```

The model returns one of the function calls, which the client handles and updates state.

---

## 🔍 Why This Exists

* **Eliminate Friction:** Traditional TODO apps trap you in lists and upkeep. Here, you **only type**.
* **Protect Flow:** No modals, dashboards, or clicks—just an ambient bar & micro-feedback.
* **Maximize Motivation:** Instant XP, rare loot bursts, and reflective narratives drive dopamine loops.
* **Local & Private:** Your data never leaves your browser. No accounts or telemetry.

---

## 🛠️ Development & Contributing

* **Testing:** `npm run test` (Jest + React Testing Library)
* **Linting:** `npm run lint` (ESLint + Prettier)
* **Make changes** on a feature branch, open a PR, and I'll review.

---

## 📜 License

GPLv3 © iyiolacak

*Locally Loop – turn every intention into compounding progress.*
