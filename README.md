# Study Timer

A cross-platform desktop study timer built with Electron, React, and TypeScript. Plan focused study sessions with timed blocks, get random challenges during breaks, and track progress with a clean dark-mode UI.

## Features

- **Schedule builder** — Create study and break blocks with custom labels and durations
- **Drag-and-drop reordering** — Rearrange blocks before starting
- **Inline editing** — Edit any block in place without leaving the builder
- **Saved plans** — Save and reload preset schedules via localStorage
- **Active timer** — Countdown with progress bar, pause/resume, and ±1m/±5m nudge controls
- **Break challenges** — Random activity suggestion during every break (Wordle, Wikipedia Race, physical exercises, and more)
- **Sound effects** — Subtle Web Audio API tones on block completion and session end
- **Confetti** — CSS animation on session complete
- **Dark / Light theme** — Toggle in the titlebar, persists across sessions
- **Frameless window** — Custom titlebar with native minimize / maximize / close

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20+
- npm v9+

### Install dependencies

```bash
npm install
```

### Run in development

```bash
npm run dev
```

### Build for your platform

```bash
npm run build:win    # Windows (.exe)
npm run build:mac    # macOS (.dmg)
npm run build:linux  # Linux (.AppImage, .deb, .snap)
```

Built installers are placed in the `dist/` folder.

## CI / Automated Builds

Pushing to `main` or `master` triggers GitHub Actions to build for all three platforms automatically.

**To download built artifacts:**
1. Go to your GitHub repo → **Actions** tab
2. Click the latest workflow run
3. Scroll to the **Artifacts** section at the bottom
4. Download the zip for your platform:
   - `app-windows-latest` → `.exe` installer
   - `app-macos-latest` → `.dmg` installer
   - `app-ubuntu-latest` → `.AppImage`

## Project Structure

```
src/
├── main/               # Electron main process (window creation, IPC)
├── preload/            # Context bridge (window controls)
└── renderer/src/
    ├── App.tsx         # Root component, theme management
    ├── types.ts        # Shared TypeScript types
    ├── components/
    │   ├── TitleBar.tsx          # Custom frameless titlebar
    │   ├── ScheduleBuilder.tsx   # Block creation and management UI
    │   ├── TimerView.tsx         # Active session timer
    │   └── Confetti.tsx          # CSS confetti animation
    └── utils/
        ├── challenges.ts         # Random break challenge generator
        ├── sound.ts              # Web Audio API sound effects
        └── storage.ts            # localStorage plan persistence
```

## Tech Stack

| Layer | Technology |
|---|---|
| Desktop shell | Electron 39 |
| Build system | electron-vite 5 |
| UI | React 19 + TypeScript |
| Bundler | Vite 7 |
| Packaging | electron-builder |
| Styling | Custom CSS (no UI library) |
| CI | GitHub Actions |
