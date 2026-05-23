// ─────────────────────────────────────────────────────────────────────────────
// THEME CONFIGURATION
// To add or change a theme, edit ONLY this file.
// The CSS variable → Tailwind token mapping never needs to change.
// ─────────────────────────────────────────────────────────────────────────────
//
// 60-30-10 color rule:
//   60% canvas   — dominant, quiet backdrop (canvas, surface)
//   30% structure — depth, text hierarchy, borders (panel, outline, body-*, hi)
//   10% action    — ONE vivid CTA color, used only on primary buttons (cta-*)
//
// CSS variable → Tailwind class:
//   --canvas        → bg-canvas          (page background)
//   --surface       → bg-surface         (card background)
//   --panel         → bg-panel           (selected bg, secondary btn)
//   --panel-hover   → bg-panel-hover     (secondary btn hover bg)
//   --outline       → border-outline     (all standard borders)
//   --body          → text-body          (primary text — applied to body in CSS)
//   --body-sub      → text-body-sub      (labels, descriptions)
//   --body-muted    → text-body-muted    (placeholder, disabled, version)
//   --hi            → text-hi / border-hi (headings, active selection ring)
//   --cta           → bg-cta             (primary button)
//   --cta-dim       → bg-cta-dim         (primary button hover)
//   --cta-ink       → text-cta-ink       (text on primary button)
//   --cta-ring      → border-cta-ring    (primary button border)
//   --timer-ok      → text/bg-timer-ok   (>50% remaining)
//   --timer-warn    → text/bg-timer-warn (25-50%)
//   --timer-danger  → text/bg-timer-danger (<25%)
//   --timer-critical→ text/bg-timer-critical (<10%)

export interface ThemeVars {
  // 60% — Canvas (dominant, quiet backdrop)
  canvas: string;
  surface: string;

  // 30% — Structure (depth, hierarchy, navigation)
  panel: string;
  panelHover: string;
  outline: string;
  body: string;
  bodySub: string;
  bodyMuted: string;

  // 30% — Highlight (structural accent — headings & active selection ONLY, never on buttons)
  hi: string;

  // 10% — CTA (THE single action color — primary buttons only)
  cta: string;
  ctaDim: string;
  ctaInk: string;
  ctaRing: string;

  // Timer (semantic, consistent across themes — functional clarity > aesthetics)
  timerOk: string;
  timerWarn: string;
  timerDanger: string;
  timerCritical: string;
}

export interface AppTheme {
  id: string;
  name: string;
  vars: ThemeVars;
  swatches: [string, string, string, string]; // [hi, cta, canvas, body]
}

// Timer colors are the same for every theme.
// Semantic meaning (safe → caution → danger) must never be sacrificed for aesthetics.
const TIMER: Pick<ThemeVars, 'timerOk' | 'timerWarn' | 'timerDanger' | 'timerCritical'> = {
  timerOk:       '#4ade80',
  timerWarn:     '#facc15',
  timerDanger:   '#f87171',
  timerCritical: '#ef4444',
};

export const THEMES: AppTheme[] = [
  {
    id: 'modern-minimalist',
    name: 'Modern Minimalist',
    swatches: ['#8ca8e0', '#4d7fe8', '#0f1520', '#eef0f4'],
    vars: {
      canvas:     '#0f1520',
      surface:    '#18202c',
      panel:      '#222c3a',
      panelHover: '#283444',
      outline:    '#2c3848',
      body:       '#eef0f4',
      bodySub:    '#6878a0',
      bodyMuted:  '#38486a',
      hi:         '#8ca8e0',
      cta:        '#4d7fe8',
      ctaDim:     '#3868d0',
      ctaInk:     '#f0f4ff',
      ctaRing:    '#2850b0',
      ...TIMER,
    },
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    swatches: ['#f0a020', '#c84838', '#120a04', '#f8eacc'],
    vars: {
      canvas:     '#120a04',
      surface:    '#1c1008',
      panel:      '#281808',
      panelHover: '#301e10',
      outline:    '#402a14',
      body:       '#f8eacc',
      bodySub:    '#a07850',
      bodyMuted:  '#5a3e28',
      hi:         '#f0a020',
      cta:        '#c84838',
      ctaDim:     '#a83028',
      ctaInk:     '#fff5f0',
      ctaRing:    '#882018',
      ...TIMER,
    },
  },
  {
    id: 'desert-rose',
    name: 'Desert Rose',
    swatches: ['#c87888', '#b04050', '#140810', '#f8e5de'],
    vars: {
      canvas:     '#140810',
      surface:    '#201018',
      panel:      '#2c1a24',
      panelHover: '#34202c',
      outline:    '#402434',
      body:       '#f8e5de',
      bodySub:    '#a06878',
      bodyMuted:  '#604050',
      hi:         '#c87888',
      cta:        '#b04050',
      ctaDim:     '#903040',
      ctaInk:     '#fff0f0',
      ctaRing:    '#702030',
      ...TIMER,
    },
  },
  {
    id: 'forest-canopy',
    name: 'Forest Canopy',
    swatches: ['#88c060', '#3c8828', '#060c06', '#e8f0e0'],
    vars: {
      canvas:     '#060c06',
      surface:    '#0e160c',
      panel:      '#162014',
      panelHover: '#1c2818',
      outline:    '#243020',
      body:       '#e8f0e0',
      bodySub:    '#5a7850',
      bodyMuted:  '#324830',
      hi:         '#88c060',
      cta:        '#3c8828',
      ctaDim:     '#2e6c20',
      ctaInk:     '#f0fff0',
      ctaRing:    '#206010',
      ...TIMER,
    },
  },
  {
    id: 'botanical-garden',
    name: 'Botanical Garden',
    swatches: ['#e8a020', '#b04020', '#080c06', '#f0ede0'],
    vars: {
      canvas:     '#080c06',
      surface:    '#101808',
      panel:      '#182410',
      panelHover: '#1e2c14',
      outline:    '#263418',
      body:       '#f0ede0',
      bodySub:    '#6a8840',
      bodyMuted:  '#3c5020',
      hi:         '#e8a020',
      cta:        '#b04020',
      ctaDim:     '#903010',
      ctaInk:     '#fff8e8',
      ctaRing:    '#702010',
      ...TIMER,
    },
  },
];

export const DEFAULT_THEME_ID = 'golden-hour';

export function getTheme(id: string): AppTheme {
  return THEMES.find((t) => t.id === id) ?? (THEMES[0] as AppTheme);
}
