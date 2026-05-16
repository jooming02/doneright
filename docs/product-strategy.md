# DoneRight — Product Strategy Document

> **Cooking Doneness Timer** — Get it right, every time.
> Date: 2026-05-16 | Status: Pre-build Planning

---

## 1. Vision & Mission

**Vision**: Become the go-to cooking companion that eliminates guesswork from the kitchen, starting with steak and eggs.

**Mission**: Build a dead-simple, offline-first cooking timer that tells you *exactly* when your food is done the way you like it — no thermometer required, no account needed, no fuss.

**Core Insight**: Most cooking apps are either too complex (recipe managers) or too generic (kitchen timers). There's a gap for a **doneness-focused** timer that combines food science data with a frictionless UX.

---

## 2. Competitive Analysis

### 2.1 Direct Competitors

| App | Platform | Steak | Eggs | Thickness | PWA | Offline | Price | Rating |
|-----|----------|-------|------|-----------|-----|---------|-------|--------|
| **SteakMate** | iOS/Android | ✅ Full | ❌ | ✅ | ❌ | ✅ | Free | 3.8★ (682 reviews) |
| **FRYY** | iOS/Android | ✅ Full | ❌ | ✅ | ❌ | ✅ | Paid | #42 Food & Drink |
| **Steak Timer** | Android | ✅ Full | ❌ | ✅ | ❌ | ✅ | Free | 3.9★ (520 reviews) |
| **ChefPerfect** | iOS | ✅ AI-based | ❌ | ✅ (AI detect) | ❌ | ❌ | Free | New |
| **Steak & Eggs** | iOS | ✅ | ✅ | ✅ | ❌ | ✅ | Paid | Low ratings |
| **SuperTimer** | Web | ✅ Basic | ✅ Basic | ❌ | ✅ | ❌ | Free | — |
| **Steak Timer (OSS)** | Web (React) | ✅ | ❌ | ✅ (cm) | ✅ | ❌ | Free | Open Source |

### 2.2 Key Findings

**What competitors get right:**
- Thickness-based timing (SteakMate, FRYY, Steak Timer)
- Flip reminders mid-cook
- Rest time after cooking
- Queue for multiple steaks (SteakMate)

**What competitors get wrong:**
- **Nobody covers steak + eggs well together** — "Steak & Eggs" exists but has poor UX and low ratings
- **No PWA with offline support** — all native apps or online-only web apps
- **No free app does both steak AND eggs well** — you pick one or the other
- **Steak Timer (OSS)** is closest to our approach (React + Vite + PWA) but only covers steak and has no egg support

**Our Differentiation:**
1. 🥩🍳 **Steak AND Eggs** in one app — the "breakfast combo" angle
2. 📱 **PWA-first, offline-ready** — works in the kitchen, no signal needed
3. 🆓 **Free, no account, no ads** — personal tool first
4. 🎯 **Doneness-centric UX** — the entire flow revolves around "how done do you want it?"
5. 🧪 **Research-backed timing data** — aggregated from multiple authoritative sources

### 2.3 Opportunity Map

```
                    ┌──────────────────────────────────┐
                    │        HIGH COMPLEXITY            │
                    │   ChefPerfect (AI photo)          │
                    │   MEATER (hardware + app)         │
                    │                                   │
                    │          ⭐ DoneRight             │
                    │      (Simple + Doneness)          │
                    │                                   │
                    │   SteakMate / FRYY                │
                    │   (Native, steak-only)            │
  LOW ─────────────────────────────────────────── HIGH
  FUNCTIONALITY      SuperTimer (generic)              FUNCTIONALITY
                    │   (Web, basic)                    │
                    │                                   │
                    │   Kitchen Timer (OS default)      │
                    │   (Just a timer)                  │
                    │                                   │
                    └──────────────────────────────────┘
                    LOW COMPLEXITY
```

---

## 3. Feature Specification

### 3.1 V0 — Personal Prototype (Build First)

> **Goal**: A working PWA on your phone within one build session. No deploy, no backend, no account.

#### Core User Flows

**Flow A: Cook a Steak**
1. Open app → Tap "Steak"
2. Select thickness (½", ¾", 1", 1½", 2")
3. Select doneness (Rare → Well Done)
4. See: time per side, flip reminder, rest time
5. Tap "Start" → Timer counts down
6. At 50%: "Flip your steak!" alert (sound + visual)
7. Timer ends: "Rest for X minutes" notification
8. Done 🎉

**Flow B: Cook Eggs**
1. Open app → Tap "Eggs"
2. Select cooking method (Boiled / Fried)
3. Select doneness:
   - Boiled: Soft (6 min) / Medium (7-8 min) / Hard (9-10 min)
   - Fried: Sunny Side Up / Over Easy / Over Medium / Over Hard
4. Tap "Start" → Timer counts down
5. Timer ends: Audio + visual alert
6. Done 🎉

**Flow C: Cook Both**
1. Start steak timer
2. Add egg timer (both run concurrently)
3. Each timer operates independently with its own alerts

#### Feature List — V0

| # | Feature | Priority | Notes |
|---|---------|----------|-------|
| 1 | Steak doneness selector | P0 | 5 levels: Rare → Well Done |
| 2 | Steak thickness selector | P0 | 5 sizes: ½" → 2" |
| 3 | Steak timer (per-side) | P0 | Flip alert at halfway |
| 4 | Steak rest timer | P0 | Auto-starts after cook timer |
| 5 | Egg boiled timer | P0 | Soft / Medium / Hard |
| 6 | Egg fried timer | P0 | Sunny / Easy / Medium / Hard |
| 7 | Concurrent timers | P1 | Run steak + egg at same time |
| 8 | Audio alert | P0 | Distinct sounds for flip, done, rest |
| 9 | PWA install | P0 | Add to Home Screen |
| 10 | Offline support | P0 | Service worker, no network needed |
| 11 | Visual doneness preview | P1 | Color gradient showing raw → cooked |
| 12 | Dark mode | P2 | Kitchen lighting varies |
| 13 | °C/°F toggle | P1 | Show internal temp reference |
| 14 | cm/inch toggle | P1 | Thickness unit preference |

#### Cooking Time Data (Research-Backed)

**Steak — Pan-Sear / Grill (High Heat), Time Per Side**

| Thickness | Rare | Medium Rare | Medium | Medium Well | Well Done |
|-----------|------|-------------|--------|-------------|-----------|
| ½" (1.3cm) | 1 min | 2 min | 3 min | 4 min | 5 min |
| ¾" (2cm) | 2 min | 3 min | 4 min | 5 min | 6 min |
| 1" (2.5cm) | 3 min | 4 min | 5 min | 6 min | 7-8 min |
| 1½" (3.8cm) | 4 min | 5 min | 6 min | 7-8 min | 9-10 min |
| 2" (5cm) | 5 min | 6-7 min | 8 min | 10 min | 12+ min |

**Steak — Internal Temperature Reference**

| Doneness | Pull Temp | Final Temp (after rest) |
|----------|-----------|------------------------|
| Rare | 115-120°F / 46-49°C | 125°F / 52°C |
| Medium Rare | 125-130°F / 52-54°C | 135°F / 57°C |
| Medium | 135-140°F / 57-60°C | 145°F / 63°C |
| Medium Well | 140-145°F / 60-63°C | 150°F / 66°C |
| Well Done | 160°F+ / 71°C+ | 165°F / 74°C |

**Steak — Rest Time**: 5 minutes (all doneness levels)

**Eggs — Boiled (from boiling water, room temp eggs)**

| Style | Time | Yolk | White |
|-------|------|------|-------|
| Soft Boiled | 6 min | Runny, warm | Firm |
| Medium Boiled (Jammy) | 7-8 min | Semi-solid, custardy | Firm |
| Hard Boiled | 9-10 min | Fully set | Firm |

**Eggs — Fried (medium-low heat, butter)**

| Style | Total Time | Yolk | White |
|-------|-----------|------|-------|
| Sunny Side Up | 2-3 min | Completely runny | Barely set |
| Over Easy | 3 min (2+flip 10sec) | Runny | Fully set |
| Over Medium | 4 min (2+flip 2min) | Jammy, slightly runny center | Set, slightly browned |
| Over Hard | 5 min (2+flip 3min) | Fully cooked, firm | Set, browned |

---

### 3.2 V1 — Enhanced Personal Tool

| Feature | Notes |
|---------|-------|
| Custom doneness presets | Save "my perfect medium-rare" |
| More foods | Chicken breast, salmon, tuna |
| Cooking method selector | Pan, grill, oven, sous vide |
| Egg size adjustment | Small / Medium / Large / XL (affects boil time) |
| °C/°F + cm/inch preferences | Saved in localStorage |
| Timer history | Last 10 cooks saved locally |
| Visual steak cross-section | Animated doneness preview |

### 3.3 V2 — Community Steak Lover App

| Feature | Notes |
|---------|-------|
| User accounts | Auth via email/social |
| Shared presets | "Gordon Ramsay's medium-rare" |
| Recipe/tip sharing | Community cooking tips |
| Cut-specific guides | Ribeye vs Sirloin vs Filet timing differences |
| Cooking journal | Log every cook with notes |
| Social features | Share results, challenge friends |
| App Store deployment | iOS App Store + Google Play |
| Premium features | AI thickness detection (camera), Bluetooth thermometer integration |

---

## 4. Product Roadmap

```
Phase 0 (NOW)          Phase 1               Phase 2
Personal Prototype     Enhanced Tool          Community App
─────────────         ───────────            ────────────
 Steak timer           Custom presets         User accounts
 Egg timer             More foods             Shared presets
 PWA + Offline         Cooking methods        Recipe sharing
 Flip + Rest alerts    Egg size adjust        Cooking journal
 Concurrent timers     Timer history          Social features
 Doneness preview      Dark mode              App Store launch
                       Cut-specific guides    AI detection
                       Preferences saved      Thermometer BT

 1-2 days              1-2 weeks              1-3 months
```

### Milestone Timeline

| Milestone | Target | Deliverable |
|-----------|--------|-------------|
| M0: Working PWA | Day 1 | App running on your phone via localhost |
| M1: Add to Home Screen | Day 1 | Installable PWA with offline support |
| M2: Both timers working | Day 1 | Steak + Egg timers with audio alerts |
| M3: Polish & deploy | Day 2-3 | Hosted on Vercel/Netlify, shareable link |
| M4: V1 features | Week 1-2 | More foods, presets, preferences |
| M5: V2 MVP | Month 1-2 | Accounts, sharing, community |

---

## 5. Technical Architecture

### 5.1 Tech Stack (V0)

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | React 18 + TypeScript | Familiar, component-based, great PWA support |
| Build | Vite | Fast dev server, easy PWA plugin |
| Styling | Tailwind CSS | Utility-first, fast prototyping, responsive |
| PWA | vite-plugin-pwa | Auto service worker generation |
| State | React useState + localStorage | No database needed for v0 |
| Audio | Web Audio API | Native browser audio, no dependencies |
| Timer | requestAnimationFrame | Precise, battery-efficient |
| Deploy (later) | Vercel | Free, automatic HTTPS, easy CI |

### 5.2 Architecture Diagram

```
┌─────────────────────────────────────────────┐
│                    PWA                       │
│                                              │
│  ┌─────────┐  ┌──────────┐  ┌───────────┐  │
│  │  Steak   │  │   Egg    │  │  Settings  │  │
│  │  Module  │  │  Module  │  │  Module    │  │
│  └────┬─────┘  └────┬─────┘  └─────┬─────┘  │
│       │              │              │         │
│  ┌────▼──────────────▼──────────────▼─────┐  │
│  │           useTimer Hook                │  │
│  │  - start / pause / resume / reset      │  │
│  │  - flip alert at 50%                   │  │
│  │  - rest timer auto-start               │  │
│  └────────────────┬───────────────────────┘  │
│                   │                           │
│  ┌────────────────▼───────────────────────┐  │
│  │         Cooking Data Layer             │  │
│  │  - cooking-presets.json                │  │
│  │  - getSteakTime(thickness, doneness)   │  │
│  │  - getEggTime(method, doneness)        │  │
│  └────────────────────────────────────────┘  │
│                   │                           │
│  ┌────────────────▼───────────────────────┐  │
│  │         Service Worker                 │  │
│  │  - Cache all assets                    │  │
│  │  - Work offline                        │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │         localStorage                   │  │
│  │  - unit preferences (°C/°F, cm/in)    │  │
│  │  - saved presets (v1+)                │  │
│  │  - timer history (v1+)                │  │
│  └────────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

### 5.3 File Structure

```
doneright/
├── public/
│   ├── icons/                    # PWA icons (192x192, 512x512)
│   ├── sounds/                   # Alert audio files
│   │   ├── flip.mp3
│   │   ├── done.mp3
│   │   └── rest-done.mp3
│   └── manifest.json            # PWA manifest
├── src/
│   ├── data/
│   │   └── cooking-presets.ts    # All timing data (typed constants)
│   ├── components/
│   │   ├── FoodSelector.tsx      # Tab: Steak | Eggs
│   │   ├── steak/
│   │   │   ├── ThicknessPicker.tsx
│   │   │   ├── DonenessPicker.tsx
│   │   │   └── SteakTimer.tsx
│   │   ├── egg/
│   │   │   ├── EggMethodPicker.tsx   # Boiled | Fried
│   │   │   ├── EggDonenessPicker.tsx
│   │   │   └── EggTimer.tsx
│   │   ├── shared/
│   │   │   ├── TimerDisplay.tsx      # Circular timer UI
│   │   │   ├── TimerControls.tsx     # Start/Pause/Reset
│   │   │   └── TimerAlert.tsx        # Audio + visual alert
│   │   └── Settings.tsx
│   ├── hooks/
│   │   ├── useTimer.ts           # Core timer logic (reusable)
│   │   ├── useAudioAlert.ts      # Sound playback
│   │   └── usePreferences.ts     # localStorage persistence
│   ├── types/
│   │   └── cooking.ts            # All TypeScript interfaces
│   ├── utils/
│   │   └── cooking-calculator.ts # Time calculation functions
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

### 5.4 Scalability Decisions

| Decision | V0 Implementation | Future Migration Path |
|----------|-------------------|----------------------|
| Cooking data | Static TypeScript constants | JSON API or CMS (v2+) |
| State management | useState + localStorage | Zustand or Context (v1) |
| Timer logic | useTimer hook | Same hook, more options |
| New food types | Add to cooking-presets.ts | Plugin system (v2) |
| User data | localStorage | IndexedDB (v1) → Backend DB (v2) |
| Auth | None | Firebase Auth or Supabase (v2) |
| Deploy | Local dev server | Vercel (v0 later) → App Store (v2) |
| Internationalization | English only | i18next (v1) |

---

## 6. Design Principles

1. **3 taps to timer** — Food → Doneness → Start. That's it.
2. **Kitchen-friendly** — Large touch targets, high contrast, works with wet hands
3. **Glanceable** — Timer visible from 2 feet away, progress obvious
4. **Offline-first** — Zero dependency on network after install
5. **One-handed** — Everything reachable with thumb on a phone
6. **Sound matters** — Distinct sounds for flip, done, rest-done. You're not staring at the phone while cooking.

---

## 7. Success Metrics (V0)

Since this is a personal tool, "success" is simple:

| Metric | Target |
|--------|--------|
| Time from "I want steak" to timer running | < 10 seconds |
| Times I actually use it per week | 3+ |
| Did my steak come out right? | Yes, consistently |
| Does it work without internet? | Yes, always |

---

## 8. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Timer times are inaccurate for different pans/heats | High | Medium | Add disclaimer + temp reference; v2 adds thermometer |
| PWA audio limitations on iOS | Medium | High | Test iOS audio early; fallback to vibration |
| iOS PWA background timer kills | High | High | Use Web Push or keep screen on option |
| Motivation drops after v0 | Medium | Low | V0 is genuinely useful → natural motivation |
| Scope creep | Medium | Medium | Strict v0 feature lock; v1/v2 are separate milestones |

**⚠️ Key iOS Risk**: iOS Safari suspends PWA timers when the screen locks or app backgrounds. This is the #1 technical risk. Mitigations:
- Option to keep screen awake (Wake Lock API)
- Send notification at flip/done time (Web Push)
- Show "timer was paused" message when returning

---

*Next step: Build v0 prototype.*
