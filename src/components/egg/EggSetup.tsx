// 🔑 LEARNING: Egg Setup — Configuration screen for egg cooking.
// Similar step-based pattern to SteakSetup: method first, then doneness carousel.
//
// 💡 CONCEPT: Conditional doneness options — The available doneness levels
// depend on the cooking method. Boiled eggs have soft/medium/hard.
// Fried eggs have sunny-side-up/over-easy/over-medium/over-hard.
// This is a "dependent dropdown" pattern common in forms.

import React, { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import useEmblaCarousel from 'embla-carousel-react';
import type { EggMethod, EggDoneness, CookingParams } from '../../types/cooking';
import { BOILED_DONENESS_OPTIONS, FRIED_DONENESS_OPTIONS } from '../../data/cooking-presets';
import { PixelButton } from '../ui/PixelButton';
import { PixelDonenessPreview } from '../ui/PixelDonenessPreview';

interface EggSetupProps {
  onStart: (params: CookingParams) => void;
  onBack: () => void;
}

// 🔑 LEARNING: Method options as data — Instead of hardcoding in JSX,
// we define method options as data. This makes it easy to add new methods
// (e.g., "poached") later without touching the JSX.
const METHOD_OPTIONS: { id: EggMethod; label: string; icon: string; description: string }[] = [
  { id: 'boiled', label: 'Boiled', icon: '🫧', description: 'From boiling water' },
  { id: 'fried',  label: 'Fried',  icon: '🍳', description: 'Butter, medium-low heat' },
];

type Step = 'method' | 'doneness';

/**
 * EggSetup — Choose method (tap to advance), then pick doneness from a carousel.
 *
 * 💡 CONCEPT: Step-based flow (no scrolling) —
 * Tapping a method auto-advances to the doneness step — no separate "Next" button.
 * The doneness options shown in the carousel depend on the chosen method.
 * Back within the flow goes to the previous step, not all the way home.
 */
export const EggSetup: React.FC<EggSetupProps> = ({ onStart, onBack }) => {
  const [step, setStep] = useState<Step>('method');
  const [method, setMethod] = useState<EggMethod | null>(null);

  // 🔑 LEARNING: direction controls which axis the step animation slides along.
  // 1 = going forward (enters from right), -1 = going back (enters from left).
  const [direction, setDirection] = useState<1 | -1>(1);

  // 💡 CONCEPT: Embla carousel — handles swipe/touch/snap mechanics.
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'center' });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onEmblaSelect = useCallback(() => {
    if (emblaApi) setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onEmblaSelect);
    return () => { emblaApi.off('select', onEmblaSelect); };
  }, [emblaApi, onEmblaSelect]);

  // 🔑 LEARNING: Dependent doneness options — When the method changes,
  // the doneness options reset because the same "doneness" name might
  // mean different things for different methods.
  const donenessOptions = method === 'boiled' ? BOILED_DONENESS_OPTIONS : FRIED_DONENESS_OPTIONS;

  const handleMethodSelect = (m: EggMethod) => {
    setMethod(m);
    // Reset carousel to first slide when method changes so a stale index
    // doesn't point at a non-existent option in the new options list.
    setSelectedIndex(0);
    if (emblaApi) emblaApi.scrollTo(0);
    setDirection(1);
    setStep('doneness');
  };

  const handleBack = () => {
    if (step === 'doneness') {
      setDirection(-1);
      setStep('method');
    } else {
      onBack();
    }
  };

  const handleStart = () => {
    if (!method) return;
    const doneness = donenessOptions[selectedIndex]?.id as EggDoneness;
    onStart({ food: 'egg', method, doneness });
  };

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
        <PixelButton variant="ghost" onClick={handleBack}>← Back</PixelButton>
        <h1 className="font-heading text-xl text-hi">
          🍳 {step === 'method' ? 'Eggs' : (method === 'boiled' ? 'Boiled' : 'Fried')}
        </h1>
      </div>

      <AnimatePresence mode="wait">

        {/* ─── STEP 1: Method ───────────────────────────────── */}
        {step === 'method' && (
          <motion.div key="method" {...stepTransition} className="flex flex-col gap-pixel-3 flex-1">
            <p className="font-heading text-base text-body-sub mb-pixel-4">
              How are you cooking?
            </p>
            {/* 🔑 LEARNING: flex-1 on each button + flex-col on parent = equal-height
                buttons that fill the remaining screen. With 2 methods, each card
                takes exactly half the remaining height — no wasted space. */}
            {METHOD_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleMethodSelect(opt.id)}
                className="
                  flex items-center gap-pixel-4 px-pixel-4 py-pixel-4
                  border border-solid border-outline rounded-lg
                  bg-surface hover:border-hi hover:bg-panel
                  transition-all duration-150
                "
              >
                <span className="text-4xl">{opt.icon}</span>
                <div className="text-left">
                  <div className="font-heading text-xl text-hi">{opt.label}</div>
                  <div className="font-pixel text-[8px] text-body-muted mt-1">{opt.description}</div>
                </div>
              </button>
            ))}
          </motion.div>
        )}

        {/* ─── STEP 2: Doneness carousel ────────────────────── */}
        {step === 'doneness' && (
          <motion.div key="doneness" {...stepTransition} className="flex flex-col flex-1">
            <p className="font-heading text-base text-body-sub mb-pixel-4">
              Pick your doneness
            </p>

            <div className="overflow-hidden flex-1 flex flex-col justify-center" ref={emblaRef}>
              <div className="flex">
                {donenessOptions.map((option, i) => (
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
                      <div className={`font-heading text-lg ${i === selectedIndex ? 'text-hi' : 'text-body-sub'}`}>
                        {option.label}
                      </div>
                      <div className="font-pixel text-xs text-body-muted mt-1">{option.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

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
