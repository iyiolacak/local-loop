# Productivity at Localhost

A **local-first**, **frictionless**, gamified productivity tool. From intention to impact in a single line and no plans, no pause, just progress.

Drop the chore of to-do lists **Inspired by the flow state and reward loops of gaming (e.g., League of Legends)**, Productivity\@Localhost requires **zero task maintenance**, you simply type what you did or want to do, hit Enter, and get instant XP and feedback.

Productivity@Localhost lives right in your browser—no backend, no telemetry, so every action is private, persistent, and lightning-fast. Simply type what you did
---

## 🎯 Key Features

* **Ambient Input Bar**: A single persistent input field; no to-do lists, no multi-step forms.
* **Instant Logging & Completion**: Type in natural language to **create** or **complete** tasks with one keystroke.
* **Ephemeral Feedback**: Micro-animations and toasts flash (300–500ms) to reward actions without breaking flow.
* **LLM-Driven Logic**: The model handles intent detection, state transitions, and summary generation via function calls.
* **Local-First & Private**: All data is stored in-browser (localStorage/IndexedDB) via Zustand; nothing is sent externally.
* **Session Summaries & Evolution**: On-demand recaps and growth narratives powered by LLM functions.
* **Modular Architecture**: React + TypeScript + Tailwind CSS, with clean separation of UI, hooks/services, and state.

---

## 📦 Installation

Requires Node.js 18+ and npm.

```bash
# Clone the repo
git clone https://github.com/iyiolacak/productivity-at-localhost.git
cd productivity-at-localhost

# Install dependencies
npm install

# Start development server\ nnpm run dev
```

Open `http://localhost:3000` in your browser. The app runs entirely in your browser—no backend required.

---

## 🏗️ Architecture Overview

```
+------------------+      +--------------------+
|  UI Components   |      |    Services/Hooks  |
|------------------|      |--------------------|
| - AppShell       |<---->| - llmClient        |
| - AmbientInputBar|      | - useIntentParser  |
| - ToastManager   |      | - useRewardEngine  |
| - OverlayContainer|     | - useOverlayHooks  |
+------------------+      +--------------------+
        |                           |
        v                           v
+------------------------------------------+
|            State Layer (Zustand)         |
|------------------------------------------|
| session: { entries[], startTime, isActive}
| history: [{…session}]                    |
| actions: addEntry, removeEntry, start/end|
+------------------------------------------+
```

### Component Breakdown

* **AppShell**: Initializes global listeners (hotkeys) and renders core components.
* **AmbientInputBar**: Captures user text input and submits for processing.
* **ToastManager**: Renders ephemeral toasts for immediate feedback.
* **OverlayContainer**: Hosts off-screen overlays: Session Summary, Evolution, Journal, Pre-Quest Lobby.

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

## ⚙️ Configuration

Optional config in `~/.config/productivity-localhost/config.yaml`:

```yaml
userName: "Your Name"
apppearance:
  theme: "light" # or "dark"
affirmationStyle: "motivational" # or "reflective"
```

If the file is missing, defaults will be used.

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
* **Maximize Motivation:** Instant XP, rare loot bursts (10% chance), and reflective narratives drive dopamine loops.
* **Local & Private:** Your data never leaves your browser. No accounts or telemetry.

---

## 🛠️ Development & Contributing

* **Testing:** `npm run test` (Jest + React Testing Library)
* **Linting:** `npm run lint` (ESLint + Prettier)
* **Make changes** on a feature branch, open a PR, and I'll review.

---

## 📜 License

MIT © Mehmet Karabacak

*With Productivity\@Localhost, every word you throw is a tracked and encouraged further progress. No lists. No distractions. Just flow.*
