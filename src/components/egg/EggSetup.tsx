// 🔑 LEARNING: Egg Setup — Configuration screen for egg cooking.
// Similar pattern to SteakSetup but with a method selector (boiled vs fried)
// as an additional choice before doneness.
//
// 💡 CONCEPT: Conditional doneness options — The available doneness levels
// depend on the cooking method. Boiled eggs have soft/medium/hard.
// Fried eggs have sunny-side-up/over-easy/over-medium/over-hard.
// This is a "dependent dropdown" pattern common in forms.

import React, { useState } from 'react';
import type { EggMethod, EggDoneness, CookingParams } from '../../types/cooking';
import { BOILED_DONENESS_OPTIONS, FRIED_DONENESS_OPTIONS } from '../../data/cooking-presets';
import { calculateCookingPlan } from '../../utils/cooking-calculator';
import { PixelCard } from '../ui/PixelCard';
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
  { id: 'fried', label: 'Fried', icon: '🍳', description: 'Butter, medium-low heat' },
];

/**
 * EggSetup — Choose method + doneness, then start cooking.
 *
 * 💡 CONCEPT: Three-step selection flow —
 * Step 1: Pick method (boiled or fried)
 * Step 2: Pick doneness (options change based on method)
 * Step 3: Review plan and start
 */
export const EggSetup: React.FC<EggSetupProps> = ({ onStart, onBack }) => {
  const [method, setMethod] = useState<EggMethod | null>(null);
  const [doneness, setDoneness] = useState<EggDoneness | null>(null);

  // 🔑 LEARNING: Dependent doneness options — When the method changes,
  // the doneness options reset because the same "doneness" name might
  // mean different things for different methods.
  const donenessOptions = method === 'boiled' ? BOILED_DONENESS_OPTIONS : FRIED_DONENESS_OPTIONS;

  // Reset doneness when method changes (old selection may not be valid)
  const handleMethodChange = (newMethod: EggMethod) => {
    setMethod(newMethod);
    setDoneness(null); // 🔑 LEARNING: Reset dependent state — When the
                       // "parent" selection changes, reset the "child" selection
                       // to prevent invalid combinations.
  };

  const canStart = method !== null && doneness !== null;

  const previewPlan = canStart
    ? calculateCookingPlan({ food: 'egg', method, doneness })
    : null;

  const handleStart = () => {
    if (!method || !doneness) return;
    onStart({ food: 'egg', method, doneness });
  };

  return (
    <div className="flex flex-col gap-pixel-4 p-pixel-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center gap-pixel-3">
        <PixelButton variant="secondary" onClick={onBack}>
          ←
        </PixelButton>
        <h1 className="font-pixel text-sm text-gold-400">🍳 EGGS</h1>
      </div>

      {/* Step 1: Method Selection */}
      <PixelCard title="METHOD">
        <div className="flex gap-pixel-3">
          {METHOD_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              className={`
                flex-1 flex flex-col items-center gap-pixel-1 px-pixel-3 py-pixel-3
                border-2 border-solid transition-all duration-100
                ${
                  method === opt.id
                    ? 'border-gold-400 bg-sear-800'
                    : 'border-sear-700 bg-stove-950 hover:border-sear-500'
                }
              `}
              onClick={() => handleMethodChange(opt.id)}
            >
              <span className="text-2xl">{opt.icon}</span>
              <span
                className={`font-pixel text-[10px] ${
                  method === opt.id ? 'text-gold-300' : 'text-sear-300'
                }`}
              >
                {opt.label}
              </span>
              <span className="font-pixel text-[8px] text-sear-400">{opt.description}</span>
            </button>
          ))}
        </div>
      </PixelCard>

      {/* Step 2: Doneness Selection */}
      {method && (
        <PixelCard title="DONENESS">
          <div className="grid grid-cols-1 gap-pixel-2">
            {donenessOptions.map((option) => {
              const eggDoneness = option.id as EggDoneness;
              return (
                <button
                  key={option.id}
                  className={`
                    flex items-center gap-pixel-3 px-pixel-3 py-pixel-2
                    border-2 border-solid transition-all duration-100
                    ${
                      doneness === eggDoneness
                        ? 'border-gold-400 bg-sear-800'
                        : 'border-sear-700 bg-stove-950 hover:border-sear-500'
                    }
                  `}
                  onClick={() => setDoneness(eggDoneness)}
                >
                  <PixelDonenessPreview
                    imageKey={option.imageKey}
                    alt={option.label}
                    size="sm"
                  />
                  <div className="flex flex-col">
                    <span
                      className={`font-pixel text-[10px] ${
                        doneness === eggDoneness ? 'text-gold-300' : 'text-sear-200'
                      }`}
                    >
                      {option.label}
                    </span>
                    <span className="font-pixel text-[8px] text-sear-400">
                      {option.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </PixelCard>
      )}

      {/* Preview & Start */}
      {previewPlan && (
        <PixelCard title="COOKING PLAN">
          <div className="flex flex-col gap-pixel-2 text-[10px]">
            {previewPlan.phases
              .filter((p) => p.durationSeconds > 0)
              .map((phase) => (
                <div key={phase.id} className="flex justify-between text-sear-300">
                  <span>{phase.label}</span>
                  <span className="text-gold-400">
                    {Math.floor(phase.durationSeconds / 60)}:
                    {(phase.durationSeconds % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              ))}
          </div>
        </PixelCard>
      )}

      {/* Start Button */}
      <PixelButton
        variant="success"
        className="w-full py-pixel-4 text-sm"
        disabled={!canStart}
        onClick={handleStart}
      >
        {canStart ? '▶ START COOKING' : 'SELECT OPTIONS'}
      </PixelButton>
    </div>
  );
};
