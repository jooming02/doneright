// 🔑 LEARNING: Steak Setup — Configuration screen where the user picks
// thickness and doneness before starting the timer. This screen demonstrates:
//
// 1. Controlled components — React state drives the form values
// 2. Step-based navigation — Thickness first, then doneness, each on its own screen
// 3. Derived data — The cooking plan is calculated from selections before starting
//
// 💡 CONCEPT: "Setup" pattern — Many timer apps jump straight to a timer with
// default values. We use a setup screen because cooking is NOT forgiving —
// you can't un-cook a steak. The setup screen forces intentional choices.

import React, { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import useEmblaCarousel from 'embla-carousel-react';
import type { SteakDoneness, SteakThickness, CookingParams } from '../../types/cooking';
import { STEAK_THICKNESS_LABELS, STEAK_DONENESS_OPTIONS } from '../../data/cooking-presets';
import { PixelButton } from '../ui/PixelButton';
import { PixelDonenessPreview } from '../ui/PixelDonenessPreview';

interface SteakSetupProps {
  onStart: (params: CookingParams) => void;
  onBack: () => void;
}

// 🔑 LEARNING: All possible thickness values as an array — We need this
// for mapping over in the UI. TypeScript's Record type gives us type safety,
// but we still need a runtime array for iteration.
const THICKNESS_OPTIONS: SteakThickness[] = ['0.5in', '0.75in', '1in', '1.5in', '2in'];

type Step = 'thickness' | 'doneness';

/**
 * SteakSetup — Choose thickness (tap to advance), then pick doneness from a carousel.
 *
 * 💡 CONCEPT: Step-based flow (no scrolling) —
 * Tapping a thickness auto-advances to the doneness step — no separate "Next" button.
 * The doneness carousel keeps the selected item centred; swipe to change.
 * Back within the flow goes to the previous step, not all the way home.
 */
export const SteakSetup: React.FC<SteakSetupProps> = ({ onStart, onBack }) => {
  const [step, setStep] = useState<Step>('thickness');
  const [thickness, setThickness] = useState<SteakThickness | null>(null);

  // 🔑 LEARNING: direction controls which axis the step animation slides along.
  // 1 = going forward (enters from right), -1 = going back (enters from left).
  const [direction, setDirection] = useState<1 | -1>(1);

  // 💡 CONCEPT: Embla carousel — an external library handles swipe/touch/snap
  // mechanics so we don't hand-roll that logic. align:'center' keeps the active
  // slide centred; loop:false stops naturally at the ends.
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'center' });
  const [selectedIndex, setSelectedIndex] = useState(0);

  // 🔑 LEARNING: Syncing React state with Embla's internal state via its event
  // system. 'select' fires every time the centred slide changes.
  const onEmblaSelect = useCallback(() => {
    if (emblaApi) setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onEmblaSelect);
    return () => { emblaApi.off('select', onEmblaSelect); };
  }, [emblaApi, onEmblaSelect]);

  const handleThicknessSelect = (t: SteakThickness) => {
    setThickness(t);
    setDirection(1);
    setStep('doneness');
  };

  const handleBack = () => {
    if (step === 'doneness') {
      setDirection(-1);
      setStep('thickness');
    } else {
      onBack();
    }
  };

  const handleStart = () => {
    if (!thickness) return;
    const doneness = STEAK_DONENESS_OPTIONS[selectedIndex]?.id as SteakDoneness;
    onStart({ food: 'steak', thickness, doneness });
  };

  // Step transitions slide horizontally — distinct from App's vertical screen transitions.
  // direction drives the sign so forward slides right→left and back slides left→right.
  const stepTransition = {
    initial:    { opacity: 0, x: direction * 30 },
    animate:    { opacity: 1, x: 0 },
    exit:       { opacity: 0, x: direction * -30 },
    transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] as const },
  };

  return (
    <div className="flex flex-col min-h-screen px-pixel-4 pt-pixel-4 pb-pixel-6 max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center gap-pixel-3 mb-pixel-6">
        <PixelButton variant="secondary" onClick={handleBack}>←</PixelButton>
        <h1 className="font-heading text-xl text-hi">
          🥩 {step === 'thickness' ? 'Steak' : STEAK_THICKNESS_LABELS[thickness!]}
        </h1>
      </div>

      <AnimatePresence mode="wait">

        {/* ─── STEP 1: Thickness ────────────────────────────── */}
        {step === 'thickness' && (
          <motion.div key="thickness" {...stepTransition} className="flex flex-col gap-pixel-2 flex-1">
            <p className="font-pixel text-[8px] text-body-muted mb-pixel-2 tracking-widest">
              HOW THICK IS YOUR STEAK?
            </p>
            {/* 🔑 LEARNING: flex-1 on each button + flex-col on parent = equal-height
                buttons that fill the remaining screen. No fixed heights needed. */}
            {THICKNESS_OPTIONS.map((t) => (
              <button
                key={t}
                onClick={() => handleThicknessSelect(t)}
                className="
                  flex-1 text-left px-pixel-4
                  border border-solid border-outline rounded-lg
                  bg-surface hover:border-hi hover:bg-panel
                  transition-all duration-150
                  font-pixel text-[10px] text-body-sub hover:text-hi
                "
              >
                {STEAK_THICKNESS_LABELS[t]}
              </button>
            ))}
          </motion.div>
        )}

        {/* ─── STEP 2: Doneness carousel ────────────────────── */}
        {step === 'doneness' && (
          <motion.div key="doneness" {...stepTransition} className="flex flex-col flex-1">
            <p className="font-pixel text-[8px] text-body-muted mb-pixel-4 tracking-widest">
              SWIPE TO PICK DONENESS
            </p>

            {/* 💡 CONCEPT: Embla carousel — flex-[0_0_68%] on each slide means the
                active slide takes 68% of the container width, with ~16% of the
                adjacent slides peeking from each side. This naturally hints
                "there is more to swipe" without any extra UI chrome. */}
            <div className="overflow-hidden flex-1 flex flex-col justify-center" ref={emblaRef}>
              <div className="flex">
                {STEAK_DONENESS_OPTIONS.map((option, i) => (
                  <div
                    key={option.id}
                    className={`
                      flex-[0_0_68%] flex flex-col items-center gap-pixel-3 px-pixel-2
                      transition-all duration-300
                      ${i === selectedIndex ? 'opacity-100 scale-100' : 'opacity-40 scale-95'}
                    `}
                  >
                    <PixelDonenessPreview imageKey={option.imageKey} alt={option.label} size="xl" />
                    <div className="text-center">
                      <div className={`font-pixel text-xs ${i === selectedIndex ? 'text-hi' : 'text-body-sub'}`}>
                        {option.label}
                      </div>
                      <div className="font-pixel text-[8px] text-body-muted mt-1">{option.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Start — centred slide is always the selection, so always enabled */}
            <PixelButton
              variant="success"
              className="w-full py-pixel-4 text-sm mt-pixel-4"
              onClick={handleStart}
            >
              ▶ START COOKING
            </PixelButton>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};
