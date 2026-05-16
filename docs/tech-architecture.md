# DoneRight — Tech Architecture, Cost & Learning Guide

> **Purpose**: DoneRight is a **technical learning vehicle** for a frontend developer (1yr+ React/TS) transitioning into mobile & full-stack development. Product features are chosen based on what **new technical skill** they unlock — not just "more buttons to click."
>
> Date: 2026-05-16 | Status: Pre-build Planning (v2 — refocused on technical learning)

---

## 1. The Real Goal — What You'll Learn

Every feature in this project exists because it teaches you something **technically new**. Here's the mapping:

| Feature | Why It's Here (Technical Skill) | NOT Because |
|---------|--------------------------------|-------------|
| PWA + Service Worker | Learn offline-first architecture, caching strategies | "PWAs are cool" |
| Custom useTimer hook | Learn hook patterns, requestAnimationFrame, absolute timestamps | "We need a timer" |
| Wake Lock API | Learn Device APIs, feature detection, graceful degradation | "Screen should stay on" |
| Zustand state management | Learn global state patterns, stores, selectors | "We have complex state" |
| IndexedDB persistence | Learn browser storage beyond localStorage, async storage APIs | "We need to save data" |
| Custom doneness presets | **Learn IndexedDB read/write, Zustand persistence** | "Users want custom settings" |
| Timer history | **Learn IndexedDB querying, data pagination** | "Users want to see past cooks" |
| AI pixel art generation | **Learn AI API integration (Replicate), prompt engineering, asset pipeline** | "We need pretty images" |
| Testing (Vitest + RTL) | Learn unit/integration testing, testing hooks, testing components | "Code should be tested" |
| CI/CD (GitHub Actions) | Learn DevOps, automated pipelines, deployment workflows | "We need CI" |
| Supabase Auth | **Learn OAuth flows, JWT, session management, Row Level Security** | "Users need accounts" |
| Supabase PostgreSQL | **Learn SQL, database schema design, migrations, RLS** | "We need a database" |
| React Native migration | **Learn native mobile dev, Expo, native APIs, background tasks** | "We need an app store app" |
| App Store deployment | **Learn mobile release process, TestFlight, review guidelines** | "We need distribution" |

### Features We're NOT Building (and why)

| Rejected Feature | Why Not |
|-----------------|---------|
| More food types (chicken, salmon, tuna) | Just adding UI buttons — no new technical skill |
| Cooking method selector (pan, grill, oven) | Just more UI toggles — same data lookup pattern |
| Egg size adjustment | Minor math change — no new technical concept |
| Cut-specific guides (ribeye vs sirloin) | Content work, not technical work |
| Recipe/tip sharing | Social features = scope explosion, distracts from core learning |
| Cooking journal | CRUD on top of CRUD — no new concept after we've learned it once |

### Skills Progression Map

```
YOUR SKILLS NOW              WHAT YOU'LL LEARN              INTERVIEW-READY FOR
────────────────             ─────────────────              ───────────────────
React + TypeScript    ──►    PWA Architecture               Frontend Engineer
                             Service Workers
                             Custom Hooks                    ↑
                             Device APIs                     
                             Mobile-first CSS                │
                                                             │ Progressive
Zustand               ──►    IndexedDB                       │ depth, not
                             Testing (Vitest/RTL)            │ breadth
                             CI/CD (GitHub Actions)           │
                             AI API Integration              ↓
                                                             Full-Stack Engineer
Supabase              ──►    SQL & Database Design           
                             Auth (OAuth, JWT, RLS)          ↑
                             REST API patterns                │
                             Real-time subscriptions          │
                                                             │
React Native          ──►    Native mobile dev               │
                             Expo workflow                    │
                             Background tasks                 │
                             App Store deployment            ↓
                                                             Mobile Engineer
```

---

## 2. Pixel Art Design System

### The Vision

DoneRight will have a **retro pixel-art aesthetic** — think NES/SNES era meets modern mobile UX. The steak doneness visualization will use AI-generated pixel art that morphs from raw to cooked.

### Design Approach

| Element | Approach | Why |
|---------|----------|-----|
| Font | **Press Start 2P** (Google Fonts) | THE pixel art font, free, widely used |
| Color palette | Warm reds/browns for steak, yellows/whites for eggs | Food-appropriate, high contrast |
| Buttons | Chunky pixel borders, 8-bit hover effects | Tactile, finger-friendly |
| Timer display | Pixel-art circular timer (like a clock in a Zelda game) | Nostalgic + glanceable |
| Doneness preview | AI-generated pixel art of steak cross-section at each doneness level | Unique visual identity |
| Background | Subtle CRT scanline effect (CSS only) | Atmosphere without distraction |

### CSS Framework Options for Pixel Art

| Framework | Style | Tailwind-compatible | Components | Our Pick? |
|-----------|-------|---------------------|------------|-----------|
| **NES.css** | NES/Famicom | Can coexist | Buttons, dialogs, radios, lists | ⭐ Best fit |
| **Peexel** | General 8-bit | Bootstrap-based | 20+ components | Good alternative |
| **RetroUI** | Retro + Tailwind | ✅ Built on Tailwind | Shadcn-style | Interesting but new |
| **Gameboy.css** | Game Boy specific | Standalone | Basic | Too narrow |
| **Custom Tailwind** | Whatever you want | ✅ Native | You build them | Most work, most learning |

**Recommendation**: Use **Tailwind CSS as the base** + **Press Start 2P font** + **custom pixel-art components** built with Tailwind utilities. This gives you the most learning value (you understand every CSS property) while achieving the pixel aesthetic. If you want a head start, borrow specific patterns from NES.css.

**Key learning**: Building your own pixel-art component library teaches you CSS custom properties, `image-rendering: pixelated`, border tricks for pixel-perfect edges, and animation with CSS keyframes.

### AI Pixel Art Generation — For Steak & Egg Visuals

This is one of the most exciting technical additions — you'll learn how to integrate an AI image generation API into your app.

#### What We Need to Generate

| Image | Description | Size | Used Where |
|-------|-------------|------|-----------|
| Steak cross-section (5 images) | Rare → Well Done doneness levels | 64×64 or 128×128 | Doneness picker, timer preview |
| Steak cooking animation (3-5 frames) | Raw → flip → cooked → rest | 64×64 spritesheet | Timer animation |
| Egg boiled (3 images) | Soft / Medium / Hard | 64×64 | Doneness picker |
| Egg fried (4 images) | Sunny Side Up / Over Easy / Medium / Hard | 64×64 | Doneness picker |
| App icon | Pixel art steak + egg | 512×512 | PWA icon |
| Splash/loading screen | Kitchen scene pixel art | 320×568 | PWA splash |

#### AI Generation Tools Compared

| Tool | Pixel Art Quality | API Access | Free Tier | Cost After | Best For |
|------|-------------------|-----------|-----------|------------|----------|
| **Retro Diffusion** (on Replicate) | ⭐⭐⭐⭐⭐ Best in class | ✅ REST API | Free trial credits | ~$0.002/image | Exact pixel sizes, style consistency |
| **Sprite AI** | ⭐⭐⭐⭐ | ✅ Coming soon | Free tier | $5/mo | Game-ready sprites |
| **DALL-E 3** (OpenAI) | ⭐⭐⭐ | ✅ REST API | None | $0.04/image | General purpose, not pixel-specific |
| **Stable Diffusion** (various) | ⭐⭐⭐ | ✅ | Varies | Varies | Needs pixel-art LoRA |
| **Midjourney** | ⭐⭐⭐⭐ | ❌ No API | $10/mo | $10/mo | Manual generation, no automation |

**Recommendation**: **Retro Diffusion on Replicate** for the actual generation. Here's why:
1. Purpose-built for pixel art — generates at exact pixel sizes (16×16 through 128×128)
2. REST API → you learn real API integration
3. `remove_bg` option → transparent backgrounds, game-ready
4. Style consistency across generations → your steak images look like they belong together
5. Cheap: ~$0.002 per image after free credits. Total for all assets: < $0.10

**Alternative (simpler)**: Generate all images manually once using a free tool like **Piskel** (browser-based pixel art editor, no account needed). This skips the API learning but gives you full artistic control.

#### Technical Implementation (if you choose API route)

```typescript
// src/services/pixel-art-generator.ts
// This is where you learn: async/await, API integration, error handling,
// environment variables, type-safe API responses

interface GenerationParams {
  prompt: string;
  width: number;
  height: number;
  style: string;
  removeBg: boolean;
}

async function generatePixelArt(params: GenerationParams): Promise<string> {
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${import.meta.env.VITE_REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: 'retro-diffusion/rd-fast',  // Model version hash
      input: {
        prompt: params.prompt,
        width: params.width,
        height: params.height,
        style: params.style,
        num_images: 1,
        remove_bg: params.removeBg,
      },
    }),
  });

  const prediction = await response.json();
  // Poll for completion (async prediction pattern)
  return pollForResult(prediction.id);
}
```

**What you learn from this**:
- External API integration patterns (async request → poll for result)
- Environment variables for API keys (`import.meta.env.VITE_*`)
- Error handling for network requests
- Asset pipeline: generate → download → optimize → include in build

**When to generate**: Do this as a **build-time script** (not at runtime in the user's browser). Run the script once, save the images to `public/images/`, and ship them as static assets. This way:
- No API key exposed to the user
- No latency when the app loads
- Works offline (images are cached by service worker)
- You still learn the API integration skill

---

## 3. Architecture by Phase — Refocused

### Phase 0: PWA Prototype (Week 1)

**Technical focus**: PWA fundamentals, custom hooks, device APIs, mobile-first CSS, pixel art UI

```
┌─────────────────────────────────────────────────┐
│                  DoneRight PWA                   │
│                                                  │
│  ┌──────────┐  ┌──────────┐                     │
│  │  Steak    │  │   Egg    │  Pixel art UI       │
│  │  Module   │  │  Module  │  (Tailwind +        │
│  └─────┬─────┘  └─────┬────┘  Press Start 2P)    │
│        │               │                          │
│  ┌─────▼───────────────▼──────────────────────┐  │
│  │            Technical Core                    │  │
│  │  - useTimer (rAF, absolute timestamps)      │  │
│  │  - useAudioAlert (Web Audio API)            │  │
│  │  - useWakeLock (Wake Lock API)              │  │
│  │  - useNotification (Notification API)       │  │
│  │  - cooking-presets.ts (typed constants)     │  │
│  │  - cooking-calculator.ts (pure functions)   │  │
│  └─────────────────────────────────────────────┘  │
│                        │                          │
│  ┌─────────────────────▼───────────────────────┐  │
│  │       Service Worker (Workbox)              │  │
│  │  - Cache-first for all static assets        │  │
│  │  - Offline-first, zero network dependency   │  │
│  └─────────────────────────────────────────────┘  │
│                                                   │
│  Build-time: generate-pixel-art.ts (Replicate API)│
│  → outputs to public/images/                      │
│                                                   │
│  Storage: localStorage (unit prefs only)          │
└─────────────────────────────────────────────────┘
```

**What you build this phase**:
1. ✅ Steak timer with doneness + thickness
2. ✅ Egg timer (boiled + fried)
3. ✅ Pixel art UI with Press Start 2P font
4. ✅ AI-generated pixel art for doneness visualization
5. ✅ PWA with offline support
6. ✅ Audio alerts (flip, done, rest)
7. ✅ Wake Lock to keep screen on

### Phase 1: State, Storage & Quality (Weeks 2-3)

**Technical focus**: State management, browser storage, testing, CI/CD

```
┌─────────────────────────────────────────────────┐
│              DoneRight PWA v1                    │
│                                                  │
│  [Same UI as v0 — no new product features]      │
│                                                  │
│  ┌─────────────────────────────────────────────┐│
│  │    NEW: State Management (Zustand)           ││
│  │  - preferencesStore (units, theme)           ││
│  │  - timersStore (concurrent timers)           ││
│  │  - historyStore (past cooks) ← NEW           ││
│  │  - presetsStore (custom doneness) ← NEW      ││
│  └─────────────────────────────────────────────┘│
│                        │                         │
│  ┌─────────────────────▼───────────────────────┐│
│  │    NEW: IndexedDB Persistence                ││
│  │  - Timer history (queries, pagination)       ││
│  │  - Custom presets (CRUD operations)          ││
│  │  - Preferences (sync with localStorage)      ││
│  └─────────────────────────────────────────────┘│
│                                                  │
│  NEW: Testing Suite                              │
│  ┌─────────────────────────────────────────────┐│
│  │  - Unit: cooking-calculator (pure functions) ││
│  │  - Unit: useTimer hook (hook testing)        ││
│  │  - Integration: Steak flow (RTL)             ││
│  │  - Integration: Egg flow (RTL)               ││
│  └─────────────────────────────────────────────┘│
│                                                  │
│  NEW: CI/CD Pipeline                             │
│  GitHub Push → GitHub Actions → Vercel          │
│    1. ESLint                                     │
│    2. TypeScript (tsc --noEmit)                  │
│    3. Vitest                                     │
│    4. Build verification                         │
│    5. Deploy to Vercel                           │
└─────────────────────────────────────────────────┘
```

**What you build this phase** (all chosen for technical learning, not product expansion):
1. ✅ Zustand store for global state — **learn state management patterns**
2. ✅ Custom doneness presets (save/load from IndexedDB) — **learn IndexedDB CRUD**
3. ✅ Timer history with query/pagination — **learn IndexedDB queries**
4. ✅ Unit + integration tests — **learn Vitest, RTL, hook testing**
5. ✅ CI/CD pipeline — **learn GitHub Actions, DevOps**
6. ✅ Pre-commit hooks (Husky + lint-staged) — **learn Git hooks**

### Phase 2: Backend + Native (Months 1-3)

**Technical focus**: Backend-as-a-Service, auth, database design, React Native, app store deployment

```
┌──────────────────────────────────────────────────────────────┐
│                    DoneRight v2                               │
│                                                               │
│  ┌─────────────────────┐    ┌─────────────────────────────┐  │
│  │   React Native App  │    │      PWA (Web)              │  │
│  │   (Expo Router)     │    │      (existing codebase)     │  │
│  └──────────┬──────────┘    └──────────────┬──────────────┘  │
│             │                               │                 │
│             │    ┌──────────────────┐       │                 │
│             └───►│  Shared Logic    │◄──────┘                 │
│                  │  - timer logic    │                         │
│                  │  - calculations   │                         │
│                  │  - types          │                         │
│                  └────────┬─────────┘                         │
│                           │                                   │
│  ┌────────────────────────▼────────────────────────────────┐  │
│  │              Supabase Backend                            │  │
│  │                                                          │  │
│  │  ┌──────────┐ ┌──────────┐ ┌───────────┐               │  │
│  │  │  Auth    │ │ Database │ │  Realtime  │               │  │
│  │  │  OAuth   │ │ PostgreSQL│ │  Presence  │               │  │
│  │  │  Email   │ │ RLS      │ │  Sync      │               │  │
│  │  └──────────┘ └──────────┘ └───────────┘               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  Build: EAS (Expo Application Services)                        │
│  Deploy: App Store + Play Store + Vercel                       │
│  Monitor: Sentry (errors) + PostHog (analytics)               │
└──────────────────────────────────────────────────────────────┘
```

**What you build this phase** (each chosen for maximum technical learning):
1. ✅ User accounts (Supabase Auth) — **learn OAuth, JWT, session management, RLS**
2. ✅ Sync presets/history to cloud — **learn real-time data sync, conflict resolution**
3. ✅ React Native version (Expo) — **learn native mobile dev, Expo Router, native modules**
4. ✅ Background timer (native) — **learn native background tasks** (fixes iOS PWA limitation!)
5. ✅ Push notifications — **learn Expo Push, notification permissions**
6. ✅ App Store + Play Store submission — **learn mobile release process**
7. ✅ Production monitoring (Sentry + PostHog) — **learn error tracking, product analytics**

**What we're NOT building** (intentionally cut for scope):
- ❌ Recipe/tip sharing — social features, scope explosion
- ❌ Cut-specific guides — content work, not technical
- ❌ Cooking journal — CRUD we already learned from presets/history
- ❌ Community features — maybe later, but not in this learning cycle

---

## 4. Database Schema (V2)

Only the tables we need — no feature bloat:

```sql
-- Users (managed by Supabase Auth, this extends it)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE,
  unit_system TEXT DEFAULT 'imperial' CHECK (unit_system IN ('metric', 'imperial')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Custom doneness presets (synced from IndexedDB)
CREATE TABLE user_presets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  food_type TEXT NOT NULL CHECK (food_type IN ('steak', 'egg')),
  doneness TEXT NOT NULL,
  custom_time_seconds INTEGER,
  notes TEXT,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Timer history (synced from IndexedDB)
CREATE TABLE cook_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  food_type TEXT NOT NULL,
  doneness TEXT NOT NULL,
  actual_time_seconds INTEGER,
  rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
  cooked_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security — users can only see their own data
ALTER TABLE user_presets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own presets" ON user_presets
  FOR ALL USING (user_id = auth.uid());

ALTER TABLE cook_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own history" ON cook_history
  FOR ALL USING (user_id = auth.uid());
```

**Why this schema is minimal**: 3 tables. That's it. Each teaches you something:
- `profiles` → extending Supabase Auth, one-to-one with auth.users
- `user_presets` → CRUD + RLS, user-owned data
- `cook_history` → time-series data, pagination, aggregation queries

---

## 5. Cost Analysis — Updated

### Phase 0: PWA Prototype

| Item | Service | Cost |
|------|---------|------|
| Hosting | Vercel Hobby | **$0/mo** |
| Domain | .vercel.app subdomain | **$0** |
| Pixel art generation | Replicate (Retro Diffusion free credits) | **$0** |
| Dev tools | VS Code, Chrome DevTools | **$0** |
| Font | Press Start 2P (Google Fonts) | **$0** |
| **Total** | | **$0/mo** |

### Phase 1: Enhanced PWA

| Item | Service | Cost |
|------|---------|------|
| Hosting | Vercel Hobby | **$0/mo** |
| CI/CD | GitHub Actions (public repo) | **$0/mo** |
| **Total** | | **$0/mo** |

### Phase 2: Backend + Native

| Item | Service | Cost |
|------|---------|------|
| Web hosting | Vercel Hobby | **$0/mo** |
| Backend | Supabase Free | **$0/mo** |
| Mobile build | EAS Build Free | **$0/mo** |
| Error tracking | Sentry Free | **$0/mo** |
| Analytics | PostHog Free | **$0/mo** |
| Push notifications | Expo Push | **$0/mo** |
| Apple Developer | (yearly) | **$99/yr** |
| Google Play | (one-time) | **$25 once** |
| **Total (without stores)** | | **$0/mo** |
| **Total (with stores)** | | **~$10/mo** amortized |

### AI Image Generation Cost

| Task | Images | Cost (Replicate) |
|------|--------|-----------------|
| Steak doneness (5 levels) | 5 | ~$0.01 |
| Steak animation frames | 5 | ~$0.01 |
| Egg boiled (3 levels) | 3 | ~$0.006 |
| Egg fried (4 styles) | 4 | ~$0.008 |
| App icon | 1 | ~$0.002 |
| Splash screen | 1 | ~$0.002 |
| **Total** | **19 images** | **< $0.05** |

You could also use the free credits and pay nothing. Or use Piskel (free, manual) instead.

---

## 6. File Structure — Updated

```
doneright/
├── public/
│   ├── images/
│   │   ├── steak/                    # AI-generated pixel art
│   │   │   ├── rare.png
│   │   │   ├── medium-rare.png
│   │   │   ├── medium.png
│   │   │   ├── medium-well.png
│   │   │   ├── well-done.png
│   │   │   └── cooking-spritesheet.png
│   │   ├── egg/
│   │   │   ├── soft-boiled.png
│   │   │   ├── medium-boiled.png
│   │   │   ├── hard-boiled.png
│   │   │   ├── sunny-side-up.png
│   │   │   ├── over-easy.png
│   │   │   ├── over-medium.png
│   │   │   └── over-hard.png
│   │   ├── icon-192.png
│   │   └── icon-512.png
│   ├── sounds/
│   │   ├── flip.mp3
│   │   ├── done.mp3
│   │   └── rest-done.mp3
│   └── manifest.json
├── scripts/
│   └── generate-pixel-art.ts         # Build-time script to call Replicate API
├── src/
│   ├── components/
│   │   ├── ui/                       # Pixel art UI primitives
│   │   │   ├── PixelButton.tsx
│   │   │   ├── PixelCard.tsx
│   │   │   ├── PixelTimer.tsx        # Circular pixel-art timer
│   │   │   ├── PixelProgress.tsx     # 8-bit progress bar
│   │   │   └── PixelDonenessPreview.tsx  # Animated doneness image
│   │   ├── steak/
│   │   │   ├── SteakSetup.tsx        # Thickness + Doneness picker
│   │   │   └── SteakTimer.tsx        # Steak cooking flow
│   │   ├── egg/
│   │   │   ├── EggSetup.tsx          # Method + Doneness picker
│   │   │   └── EggTimer.tsx          # Egg cooking flow
│   │   └── Settings.tsx              # Unit prefs (v0), presets (v1)
│   ├── hooks/
│   │   ├── useTimer.ts              # Core: rAF + absolute timestamps
│   │   ├── useAudioAlert.ts         # Web Audio API
│   │   ├── useWakeLock.ts           # Keep screen on
│   │   ├── useNotification.ts       # Browser notifications
│   │   └── usePreferences.ts        # localStorage (v0) → Zustand+IDB (v1)
│   ├── data/
│   │   └── cooking-presets.ts       # Typed constants
│   ├── types/
│   │   └── cooking.ts               # All interfaces
│   ├── utils/
│   │   ├── cooking-calculator.ts    # Pure functions (time calc)
│   │   └── audio-manager.ts         # Sound loading & playback
│   ├── App.tsx
│   ├── App.css                      # Pixel art global styles
│   └── main.tsx
├── .github/
│   └── workflows/
│       └── ci.yml                   # Phase 1+
├── index.html
├── vite.config.ts
├── tailwind.config.ts               # Pixel art custom theme
├── tsconfig.json
└── package.json
```

---

## 7. Key Technical Patterns You'll Learn

### Pattern 1: Absolute Timestamp Timer (Phase 0)

```typescript
// The most important technical decision in the app.
// Using Date.now() instead of decrementing a counter means:
// - If JS is suspended (iOS background), timer self-corrects on resume
// - No drift from setInterval imprecision
// - Same pattern used in distributed systems (NTP-style)

function useTimer(durationSeconds: number) {
  const [endAt, setEndAt] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(durationSeconds);

  const start = () => setEndAt(Date.now() + durationSeconds * 1000);

  useEffect(() => {
    if (!endAt) return;
    const tick = () => {
      const left = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      setRemaining(left);
      if (left <= 0) onTimerComplete();
    };
    tick(); // immediate first tick
    const id = setInterval(tick, 200); // 200ms for smooth display
    return () => clearInterval(id);
  }, [endAt]);

  return { remaining, start, isRunning: endAt !== null };
}
```

### Pattern 2: Plugin Architecture for Food Types (Phase 0)

```typescript
// Strategy Pattern: each food implements the same interface
// Adding a new food = implementing this interface + adding to array
// Zero changes to existing code (Open/Closed Principle)

interface FoodPlugin {
  id: string;
  name: string;
  icon: string;
  image: string;                        // Pixel art path
  getDonenessOptions(): DonenessOption[];
  calculateTime(params: CookingParams): CookingPlan;
}

// Steak and Egg are just different implementations
const steakPlugin: FoodPlugin = { ... };
const eggPlugin: FoodPlugin = { ... };

// Registry pattern — dynamic rendering
const foodRegistry: FoodPlugin[] = [steakPlugin, eggPlugin];
```

### Pattern 3: IndexedDB with Zustand Persistence (Phase 1)

```typescript
// This teaches you: async storage, Zustand middleware, optimistic updates

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Custom IndexedDB storage adapter for Zustand
const indexedDBStorage = {
  getItem: async (name: string) => { /* IDB get */ },
  setItem: async (name: string, value: any) => { /* IDB set */ },
  removeItem: async (name: string) => { /* IDB delete */ },
};

const useHistoryStore = create(
  persist(
    (set) => ({
      history: [],
      addCook: (cook: CookRecord) =>
        set((state) => ({ history: [cook, ...state.history] })),
    }),
    { name: 'cook-history', storage: createJSONStorage(() => indexedDBStorage) }
  )
);
```

### Pattern 4: Supabase Auth + RLS (Phase 2)

```typescript
// This teaches you: OAuth flows, session management, database-level security

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Sign in with Google OAuth
const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });
};

// Listen for auth state changes (JWT lifecycle)
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    // JWT is now in session.access_token
    // All subsequent Supabase calls use this token automatically
    // RLS policies in PostgreSQL use auth.uid() to filter data
  }
});

// Data access is automatically filtered by RLS
// This query only returns the current user's presets
const { data } = await supabase.from('user_presets').select('*');
// PostgreSQL RLS: WHERE user_id = auth.uid()
```

---

## 8. The iOS Background Timer — Your Best Interview Story

This is worth calling out separately because it's the perfect "technical challenge" narrative:

### The Problem
iOS Safari suspends JavaScript when PWA is backgrounded → timer stops → user gets overcooked steak

### The Learning Journey
```
Phase 0: "Let's try PWA first"
  → Learn: Service Workers, Wake Lock API, absolute timestamps
  → Result: Works 80% of the time, but iOS still kills timers sometimes

Phase 1: "Let's optimize the PWA approach"
  → Learn: Web Push Notifications, Background Sync API
  → Result: Better, but still not reliable on iOS

Phase 2: "Time to go native"
  → Learn: React Native, native background tasks, Expo
  → Result: Bulletproof. Native apps don't have this limitation.

Interview answer: "I chose PWA for rapid prototyping, hit the iOS
background timer limitation, mitigated it with absolute timestamps
and Wake Lock, and ultimately migrated to React Native for reliable
background execution. Each step was driven by actual user need,
not premature optimization."
```

This narrative demonstrates: pragmatic decision-making, understanding tradeoffs, progressive enhancement, and the ability to migrate when requirements demand it.

---

## 9. Timeline — Learning-First

```
WEEK 1: Phase 0 — PWA Prototype
├── Day 1-2: Setup + Steak timer + Pixel UI
│   ├── NEW SKILL: Vite + PWA setup
│   ├── NEW SKILL: Tailwind pixel-art theming
│   ├── NEW SKILL: Custom hook (useTimer with rAF)
│   └── NEW SKILL: Mobile-first responsive design
│
├── Day 3: Egg timer + Audio + Notifications
│   ├── NEW SKILL: Web Audio API
│   ├── NEW SKILL: Notification API
│   └── NEW SKILL: Component composition patterns
│
├── Day 4: PWA + Offline + Wake Lock
│   ├── NEW SKILL: Service Worker caching strategies
│   ├── NEW SKILL: Wake Lock API + feature detection
│   └── NEW SKILL: PWA manifest + installability
│
└── Day 5: AI Pixel Art + Deploy
    ├── NEW SKILL: Replicate API integration
    ├── NEW SKILL: Build-time asset generation scripts
    └── NEW SKILL: Vercel deployment


WEEK 2-3: Phase 1 — State, Storage & Quality
├── Week 2: Zustand + IndexedDB
│   ├── NEW SKILL: Zustand store + middleware
│   ├── NEW SKILL: IndexedDB CRUD + queries
│   ├── NEW SKILL: Custom storage adapter for Zustand
│   └── NEW SKILL: Optimistic UI patterns
│
└── Week 3: Testing + CI/CD
    ├── NEW SKILL: Vitest + React Testing Library
    ├── NEW SKILL: Hook testing patterns
    ├── NEW SKILL: GitHub Actions workflows
    └── NEW SKILL: Husky + lint-staged pre-commit hooks


MONTH 2-3: Phase 2 — Backend + Native
├── Month 2: Supabase
│   ├── NEW SKILL: PostgreSQL schema design
│   ├── NEW SKILL: Row Level Security
│   ├── NEW SKILL: OAuth authentication flow
│   ├── NEW SKILL: JWT session management
│   └── NEW SKILL: Real-time subscriptions
│
└── Month 3: React Native
    ├── NEW SKILL: Expo setup + Expo Router
    ├── NEW SKILL: Native background tasks
    ├── NEW SKILL: Push notifications (Expo Push)
    ├── NEW SKILL: EAS Build + OTA updates
    ├── NEW SKILL: App Store + Play Store submission
    └── NEW SKILL: Production monitoring (Sentry + PostHog)
```

---

## 10. Decision Summary

| Decision | Choice | Technical Learning Value |
|----------|--------|------------------------|
| V0: Platform | PWA (React + Vite) | Service Workers, Device APIs, offline-first |
| V0: Styling | Tailwind + custom pixel UI | CSS architecture, design systems |
| V0: Art | AI-generated pixel art (Replicate) | API integration, asset pipelines |
| V1: State | Zustand | Global state patterns, middleware |
| V1: Storage | IndexedDB | Async browser storage, queries |
| V1: Testing | Vitest + RTL | Testing patterns, CI/CD |
| V1: CI/CD | GitHub Actions → Vercel | DevOps, automation |
| V2: Backend | Supabase | SQL, Auth, RLS, real-time |
| V2: Mobile | React Native (Expo) | Native dev, background tasks |
| V2: Deploy | EAS + App Store | Mobile release process |
| V2: Monitor | Sentry + PostHog | Production observability |

**Total cost: $0/month (until App Store: ~$10/month)**

---

*Next step: Ready to build? Let's start Phase 0.*
