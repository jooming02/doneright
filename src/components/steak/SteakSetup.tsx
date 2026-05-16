// 🔑 LEARNING: Steak Setup — Configuration screen where the user picks
// thickness and doneness before starting the timer. This screen demonstrates:
//
// 1. Controlled components — React state drives the form values
// 2. Derived data — The preview updates automatically when selections change
// 3. Progressive disclosure — Thickness first, then doneness (logical order)
//
// 💡 CONCEPT: "Setup" pattern — Many timer apps jump straight to a timer with
// default values. We use a setup screen because cooking is NOT forgiving —
// you can't un-cook a steak. The setup screen forces intentional choices.

import React, { useState } from 'react';
import type { SteakDoneness, SteakThickness, CookingParams } from '../../types/cooking';
import { STEAK_THICKNESS_LABELS, STEAK_DONENESS_OPTIONS } from '../../data/cooking-presets';
import { calculateCookingPlan } from '../../utils/cooking-calculator';
import { PixelCard } from '../ui/PixelCard';
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

/**
 * SteakSetup — Choose thickness + doneness, then start cooking.
 *
 * 💡 CONCEPT: Two-step selection flow —
 * Step 1: Pick thickness (determines base time)
 * Step 2: Pick doneness (determines multiplier)
 * Both selections are required before the Start button enables.
 * This prevents the user from starting with invalid/incomplete params.
 */
export const SteakSetup: React.FC<SteakSetupProps> = ({ onStart, onBack }) => {
  const [thickness, setThickness] = useState<SteakThickness | null>(null);
  const [doneness, setDoneness] = useState<SteakDoneness | null>(null);

  // 🔑 LEARNING: Can start = all required fields filled.
  // This is "derived state" — computed from existing state, not stored separately.
  const canStart = thickness !== null && doneness !== null;

  // 💡 CONCEPT: Preview cooking plan — We calculate the plan on-the-fly
  // to show the user what they're committing to before they press Start.
  // This is a "dry run" — we don't store it, just display it.
  const previewPlan = canStart
    ? calculateCookingPlan({ food: 'steak', thickness, doneness })
    : null;

  const handleStart = () => {
    if (!thickness || !doneness) return;
    onStart({ food: 'steak', thickness, doneness });
  };

  return (
    <div className="flex flex-col gap-pixel-4 p-pixel-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center gap-pixel-3">
        <PixelButton variant="secondary" onClick={onBack}>
          ←
        </PixelButton>
        <h1 className="font-pixel text-sm text-gold-400">🥩 STEAK</h1>
      </div>

      {/* Step 1: Thickness Selection */}
      <PixelCard title="THICKNESS">
        <div className="flex flex-col gap-pixel-2">
          {THICKNESS_OPTIONS.map((t) => (
            <button
              key={t}
              className={`
                font-pixel text-[10px] text-left px-pixel-3 py-pixel-2
                border-2 border-solid transition-all duration-100
                ${
                  thickness === t
                    ? 'border-gold-400 bg-sear-800 text-gold-300'
                    : 'border-sear-700 bg-stove-950 text-sear-300 hover:border-sear-500'
                }
              `}
              onClick={() => setThickness(t)}
            >
              {STEAK_THICKNESS_LABELS[t]}
            </button>
          ))}
        </div>
      </PixelCard>

      {/* Step 2: Doneness Selection — only shown after thickness is picked */}
      {/* 🔑 LEARNING: Conditional rendering — We don't show doneness options
          until thickness is selected. This is "progressive disclosure" —
          don't overwhelm the user with choices they can't act on yet. */}
      {thickness && (
        <PixelCard title="DONENESS">
          <div className="grid grid-cols-1 gap-pixel-2">
            {STEAK_DONENESS_OPTIONS.map((option) => {
              const steakDoneness = option.id as SteakDoneness;
              return (
                <button
                  key={option.id}
                  className={`
                    flex items-center gap-pixel-3 px-pixel-3 py-pixel-2
                    border-2 border-solid transition-all duration-100
                    ${
                      doneness === steakDoneness
                        ? 'border-gold-400 bg-sear-800'
                        : 'border-sear-700 bg-stove-950 hover:border-sear-500'
                    }
                  `}
                  onClick={() => setDoneness(steakDoneness)}
                >
                  <PixelDonenessPreview
                    imageKey={option.imageKey}
                    alt={option.label}
                    size="sm"
                  />
                  <div className="flex flex-col">
                    <span
                      className={`font-pixel text-[10px] ${
                        doneness === steakDoneness ? 'text-gold-300' : 'text-sear-200'
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
            {/* 🔑 LEARNING: Mapping over phases to display the plan —
                The cooking plan is an array of phases. By mapping over them,
                we display the plan dynamically. If we add more phases later
                (e.g., "baste with butter"), they automatically appear here. */}
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

            {/* Internal temperature reference */}
            {previewPlan.internalTemp && (
              <div className="mt-pixel-2 pt-pixel-2 border-t border-sear-700">
                <div className="text-sear-400">Pull temp: {previewPlan.internalTemp.pullTempF[0]}-{previewPlan.internalTemp.pullTempF[1]}°F</div>
                <div className="text-sear-400">Final temp: {previewPlan.internalTemp.finalTempF}°F</div>
              </div>
            )}
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
