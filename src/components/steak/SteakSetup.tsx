// 🔑 LEARNING: Steak Setup — One screen does everything. The user picks a
// doneness (swipe or tap a pill), then START turns this same page dynamic:
// the steak image becomes a sizzling pan and the static time becomes a live
// countdown. No second "timer page" — the cooking state machine lives in the
// useSteakCook hook and we just overlay the running UI on top of the picker.

import React, { useState, useCallback, useEffect } from 'react';
import { Drawer } from 'vaul';
import useEmblaCarousel from 'embla-carousel-react';
import type { SteakDoneness, SteakThickness } from '../../types/cooking';
import {
  STEAK_DONENESS_OPTIONS,
  STEAK_THICKNESS_LABELS,
  STEAK_TIMES,
  STEAK_REST_SECONDS,
} from '../../data/cooking-presets';
import { calculateCookingPlan, formatTime } from '../../utils/cooking-calculator';
import { useSteakCook } from '../../hooks/useSteakCook';
import { Button } from '../ui/Button';
import { DonenessPreview } from '../ui/DonenessPreview';

interface SteakSetupProps {
  onOpenSettings: () => void;
}

const THICKNESS_OPTIONS: SteakThickness[] = ['0.5in', '0.75in', '1in', '1.5in', '2in'];
const DEFAULT_INDEX = 1; // medium-rare

export const SteakSetup: React.FC<SteakSetupProps> = ({ onOpenSettings }) => {
  const [thickness, setThickness] = useState<SteakThickness>('0.5in');
  const [thicknessOpen, setThicknessOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(DEFAULT_INDEX);

  const cook = useSteakCook();
  const isIdle = cook.status === 'idle';

  // 💡 CONCEPT: startIndex makes embla open on medium-rare rather than rare.
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'center',
    startIndex: DEFAULT_INDEX,
  });

  // 🔑 LEARNING: Bidirectional sync — carousel drives pill highlight,
  // pill click drives carousel scroll. Both update selectedIndex.
  const onEmblaSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onEmblaSelect);
    return () => { emblaApi.off('select', onEmblaSelect); };
  }, [emblaApi, onEmblaSelect]);

  const scrollTo = useCallback((index: number) => {
    emblaApi?.scrollTo(index);
  }, [emblaApi]);

  const selectedOption = STEAK_DONENESS_OPTIONS[selectedIndex]!;
  const doneness = selectedOption.id as SteakDoneness;

  // Derived: total cook time updates live as doneness / thickness changes
  const minutesPerSide = STEAK_TIMES[thickness][doneness];
  const totalSeconds = Math.round(minutesPerSide * 60) * 2 + STEAK_REST_SECONDS;

  const handleStart = () => {
    cook.start(calculateCookingPlan({ food: 'steak', thickness, doneness }));
  };

  return (
    <div className="relative flex flex-col min-h-screen max-w-sm mx-auto">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-pixel-4 pt-pixel-4 pb-pixel-2">
        <button
          onClick={onOpenSettings}
          className="text-body-muted hover:text-body transition-colors p-2 -ml-2"
          aria-label="Open menu"
        >
          <span className="text-2xl leading-none">≡</span>
        </button>
        <span className="font-pixel text-xs text-body-muted">{STEAK_THICKNESS_LABELS[thickness]}</span>
      </div>

      {/* ── Pill nav — always exactly 3 visible, equal width columns.
          A sliding window (prev / selected / next) shifts as the carousel
          changes, so there's always a pill on each side to hint direction. */}
      {(() => {
        const winStart = Math.max(0, Math.min(selectedIndex - 1, STEAK_DONENESS_OPTIONS.length - 3));
        const visible = STEAK_DONENESS_OPTIONS.slice(winStart, winStart + 3);
        return (
          <div className="grid grid-cols-3 gap-pixel-2 px-pixel-4 pb-pixel-3">
            {visible.map((opt) => {
              const realIdx = STEAK_DONENESS_OPTIONS.findIndex(o => o.id === opt.id);
              return (
                <button
                  key={opt.id}
                  onClick={() => scrollTo(realIdx)}
                  className={`
                    py-pixel-2 rounded-full
                    font-pixel text-sm border border-solid transition-all duration-150
                    ${realIdx === selectedIndex
                      ? 'bg-cta text-cta-ink border-cta'
                      : 'bg-surface text-body-sub border-outline hover:border-hi/50'
                    }
                  `}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        );
      })()}

      {/* ── Doneness carousel — vertically centred in available space ── */}
      <div className="flex-1 flex flex-col justify-center overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {STEAK_DONENESS_OPTIONS.map((option, i) => (
            <div
              key={option.id}
              className={`
                flex-[0_0_65%] flex flex-col items-center px-pixel-2
                transition-all duration-300
                ${i === selectedIndex ? 'opacity-100 scale-100' : 'opacity-35 scale-90'}
              `}
            >
              <DonenessPreview imageKey={option.imageKey} alt={option.label} size="xl" />
            </div>
          ))}
        </div>
      </div>

      {/* ── Time display — beneath the image, prominent ── */}
      <div className="flex flex-col items-center py-pixel-4 gap-1">
        <span
          className="font-heading text-hi leading-none"
          style={{ fontSize: 'clamp(2.5rem, 12vw, 3.5rem)' }}
        >
          {formatTime(totalSeconds)}
        </span>
        <span className="font-pixel text-[9px] text-body-muted tracking-widest uppercase">total time</span>
      </div>

      {/* ── Bottom: START + thickness trigger ── */}
      <div className="mt-auto px-pixel-4 pb-pixel-6 flex flex-col gap-pixel-3">
        <Button variant="primary" className="w-full" onClick={handleStart}>
          START
        </Button>
        <button
          onClick={() => setThicknessOpen(true)}
          className="text-center font-pixel text-xs text-body-muted py-1 hover:text-body-sub transition-colors"
        >
          ↑ {STEAK_THICKNESS_LABELS[thickness]} · tap to change thickness
        </button>
      </div>

      {/* ── Thickness bottom drawer ── */}
      <Drawer.Root open={thicknessOpen} onOpenChange={setThicknessOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/50 z-40" />
          <Drawer.Content
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl border-t border-outline pb-8"
            style={{ background: 'var(--canvas)' }}
          >
            <div className="flex justify-center pt-3 pb-3">
              <div className="w-10 h-1 rounded-full" style={{ background: 'var(--outline)' }} />
            </div>
            <p className="font-pixel text-xs text-body-muted text-center mb-pixel-3">STEAK THICKNESS</p>
            <div className="flex flex-col gap-pixel-2 px-pixel-4">
              {THICKNESS_OPTIONS.map(t => (
                <button
                  key={t}
                  onClick={() => { setThickness(t); setThicknessOpen(false); }}
                  className={`
                    px-pixel-4 py-pixel-3 rounded-lg border border-solid
                    font-pixel text-xs transition-all duration-150 flex items-center justify-between
                    ${thickness === t
                      ? 'border-hi bg-panel text-hi'
                      : 'border-outline bg-surface text-body-sub hover:border-hi/50'
                    }
                  `}
                >
                  <span>{STEAK_THICKNESS_LABELS[t]}</span>
                  {thickness === t && <span>✓</span>}
                </button>
              ))}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      {/* ── Running / Done overlay ──────────────────────────────
          💡 CONCEPT: Overlay instead of a new page — sits on top of the picker
          so the carousel underneath keeps its state. The same layout language
          (menu top, big image centre, big time below) carries over for a
          seamless "the page came alive" feel. */}
      {!isIdle && (
        <div
          className="absolute inset-0 z-30 flex flex-col px-pixel-4 pb-pixel-6"
          style={{ background: 'var(--canvas)' }}
        >
          {/* Top bar mirrors the idle one */}
          <div className="flex items-center justify-between pt-pixel-4 pb-pixel-2 -mx-pixel-4 px-pixel-4">
            <button
              onClick={onOpenSettings}
              className="text-body-muted hover:text-body transition-colors p-2 -ml-2"
              aria-label="Open menu"
            >
              <span className="text-2xl leading-none">≡</span>
            </button>
            <span className="font-pixel text-xs text-body-muted">
              {selectedOption.label} · {STEAK_THICKNESS_LABELS[thickness]}
            </span>
          </div>

          {/* Centre: sizzling pan only while actively cooking; otherwise the
              plated doneness result (resting, cooling, or done). */}
          <div className="flex-1 flex flex-col items-center justify-center gap-pixel-4">
            {cook.currentType === 'cook' && cook.status === 'cooking' ? (
              <img
                src="/images/steak-cooking.png"
                alt="Steak cooking"
                className="w-56 h-56 object-contain animate-sizzle"
              />
            ) : (
              <DonenessPreview imageKey={selectedOption.imageKey} alt={selectedOption.label} size="xl" />
            )}
            {cook.status === 'done' && (
              <div className="text-center">
                <p className="font-heading text-3xl text-timer-ok">Ready to serve!</p>
                <p className="font-pixel text-xs text-body-muted mt-1">Your {selectedOption.label.toLowerCase()} steak is done</p>
              </div>
            )}
          </div>

          {/* Big segment time + current stage */}
          {cook.status !== 'done' && (
            <div className="flex flex-col items-center py-pixel-4 gap-1">
              <span
                className="font-heading text-hi leading-none tabular-nums"
                style={{ fontSize: 'clamp(2.5rem, 12vw, 3.5rem)' }}
              >
                {formatTime(cook.remaining)}
              </span>
              <span className="font-pixel text-[9px] text-body-muted tracking-widest uppercase">
                {cook.isPaused
                  ? 'paused'
                  : cook.status === 'awaiting'
                    ? `next · ${cook.stageLabel}`
                    : cook.stageLabel}
              </span>
            </div>
          )}

          {/* Controls */}
          <div className="flex flex-col gap-pixel-2">
            {cook.status === 'done' ? (
              <Button variant="primary" className="w-full" onClick={cook.reset}>
                DONE
              </Button>
            ) : cook.status === 'awaiting' ? (
              // Cooking finished — timer stopped, user starts the next segment.
              <>
                <Button variant="primary" className="w-full" onClick={cook.startNext}>
                  ▶ START {cook.stageLabel.toUpperCase()} ({formatTime(cook.remaining)})
                </Button>
                <button
                  onClick={cook.reset}
                  className="text-center font-pixel text-xs text-body-muted py-1 hover:text-body-sub transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                {cook.isPaused ? (
                  <Button variant="primary" className="w-full" onClick={cook.resume}>
                    ▶ RESUME
                  </Button>
                ) : (
                  <Button variant="secondary" className="w-full" onClick={cook.pause}>
                    ⏸ PAUSE
                  </Button>
                )}
                <button
                  onClick={cook.reset}
                  className="text-center font-pixel text-xs text-body-muted py-1 hover:text-body-sub transition-colors"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
