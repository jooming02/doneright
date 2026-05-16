# DoneRight — Cooking Doneness Timer

> **Get it right, every time.** A pixel-art cooking timer PWA for steak and eggs.

## What Is This?

DoneRight is a **cooking doneness timer** — select your food, pick how done you want it, and get a precise countdown with flip alerts and rest reminders. Built with a retro NES/pixel-art aesthetic.

## Why Does This Project Exist?

This is a **resume-building learning project**. The real goal isn't the product — it's learning the full software development lifecycle. Every feature was chosen because it teaches a **new technical skill**, not just because it adds UI buttons.

**The developer**: 1yr+ frontend (React/TS), transitioning into mobile & full-stack development.

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | React 18 + TypeScript | Familiar territory, great PWA support |
| Build | Vite | Fast dev server, PWA plugin ecosystem |
| Styling | Tailwind CSS + custom pixel theme | Utility-first + retro aesthetic |
| PWA | vite-plugin-pwa (Workbox) | Offline-first, zero network dependency |
| State (v0) | React useState + localStorage | Keep it simple for prototype |
| State (v1) | Zustand + IndexedDB | Learn global state + async storage |
| Backend (v2) | Supabase (PostgreSQL) | Learn SQL, Auth, RLS |
| Mobile (v2) | React Native (Expo) | Solve iOS background timer limitation |
| Deploy | Vercel (web) / EAS (mobile) | Free tier, automatic HTTPS |

## Architecture Docs

These documents explain the full project context — read them in order:

1. **[docs/product-strategy.md](./docs/product-strategy.md)** — Competitive analysis, feature specs, cooking time data, user flows
2. **[docs/tech-architecture.md](./docs/tech-architecture.md)** — Feature→skill mapping, architecture diagrams, key patterns, timeline, cost analysis

## Phase Roadmap

| Phase | Focus | What You Learn | Status |
|-------|-------|---------------|--------|
| **Phase 0** | PWA Prototype | Service Workers, custom hooks, Device APIs, pixel art UI | ✅ Complete |
| **Phase 1** | State & Quality | Zustand, IndexedDB, Vitest, RTL, GitHub Actions | 🔜 Next |
| **Phase 2** | Backend & Native | Supabase Auth/SQL/RLS, React Native, App Store | 📋 Planned |

## Project Structure

```
src/
├── types/cooking.ts              # All TypeScript interfaces
├── data/cooking-presets.ts       # Steak thickness×doneness matrix, egg params
├── utils/
│   ├── cooking-calculator.ts     # Pure functions + Strategy Pattern
│   └── audio-manager.ts          # 8-bit square wave synthesizer
├── hooks/
│   ├── useTimer.ts               # ⭐ Absolute timestamp timer (iOS fix)
│   ├── useAudioAlert.ts          # Web Audio API + feature detection
│   ├── useWakeLock.ts            # Screen wake lock + auto re-acquire
│   ├── useNotification.ts        # Browser notifications + permissions
│   └── usePreferences.ts         # localStorage persistence
├── components/
│   ├── ui/                       # Pixel art primitives (Button, Card, Timer, etc.)
│   ├── steak/                    # SteakSetup + SteakTimer
│   ├── egg/                      # EggSetup + EggTimer
│   └── Settings.tsx
├── App.tsx                       # Screen routing (home→setup→timer)
├── App.css                       # CRT scanlines, pixel font, animations
└── main.tsx                      # React 18 entry + PWA registration
```

## Key Technical Patterns

1. **Absolute Timestamp Timer** — Uses `Date.now()` instead of decrementing counters. Self-corrects when iOS suspends JavaScript in the background.
2. **Strategy/Plugin Pattern** — Each food type implements the `FoodPlugin` interface. Adding a new food = zero changes to existing code.
3. **Synthesized 8-bit Audio** — No MP3 files. Web Audio API generates square wave beeps that fit the pixel aesthetic.
4. **Phase-based Timer** — `CookingPlan.phases[]` drives the flow: cook → flip → cook → rest → serve.
5. **Graceful Degradation** — All Device APIs (Wake Lock, Notification, Audio) feature-detect and degrade silently.

## Quick Start

```bash
npm install
npm run dev        # Start dev server at localhost:5173
npm run build      # Production build
npm run preview    # Preview production build
```

## Inline Learning Comments

Every source file contains two types of learning annotations:

- `🔑 LEARNING:` — Explains a specific technical concept you'll learn from this code
- `💡 CONCEPT:` — Explains a design pattern, principle, or architectural decision

Search for these in the codebase to find the teaching moments.

## Cost

| Phase | Monthly Cost |
|-------|-------------|
| Phase 0 | $0 |
| Phase 1 | $0 |
| Phase 2 (before stores) | $0 |
| Phase 2 (with stores) | ~$10/mo |

All free tiers: Vercel hosting, Supabase backend, EAS Build.

## Cooking Data Reference

All timing data is research-backed and stored in `src/data/cooking-presets.ts`. Covers:
- Steak: 5 thicknesses × 5 doneness levels (pan-sear times per side)
- Steak: Internal temperature reference (°F and °C)
- Eggs: 3 boiled styles (soft/medium/hard)
- Eggs: 4 fried styles (sunny-side-up through over-hard)
