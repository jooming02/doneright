import { useEffect } from 'react';
import { getTheme } from '../data/themes';

/**
 * Applies the selected theme's CSS variables to :root whenever themeId changes.
 * All Tailwind color tokens resolve through these variables, so the entire UI
 * re-colors without any component changes.
 *
 * To add or change a theme: edit src/data/themes.ts only.
 */
export function useTheme(themeId: string): void {
  useEffect(() => {
    const { vars } = getTheme(themeId);
    const root = document.documentElement;

    // 60% — Canvas
    root.style.setProperty('--canvas',      vars.canvas);
    root.style.setProperty('--surface',     vars.surface);
    // 30% — Structure
    root.style.setProperty('--panel',       vars.panel);
    root.style.setProperty('--panel-hover', vars.panelHover);
    root.style.setProperty('--outline',     vars.outline);
    root.style.setProperty('--body',        vars.body);
    root.style.setProperty('--body-sub',    vars.bodySub);
    root.style.setProperty('--body-muted',  vars.bodyMuted);
    // 30% — Highlight
    root.style.setProperty('--hi',          vars.hi);
    // 10% — CTA
    root.style.setProperty('--cta',         vars.cta);
    root.style.setProperty('--cta-dim',     vars.ctaDim);
    root.style.setProperty('--cta-ink',     vars.ctaInk);
    root.style.setProperty('--cta-ring',    vars.ctaRing);
    // Timer
    root.style.setProperty('--timer-ok',       vars.timerOk);
    root.style.setProperty('--timer-warn',     vars.timerWarn);
    root.style.setProperty('--timer-danger',   vars.timerDanger);
    root.style.setProperty('--timer-critical', vars.timerCritical);
  }, [themeId]);
}
