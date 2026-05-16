// 🔑 LEARNING: Settings component — User preferences for unit display.
// This is a simple form that demonstrates:
//
// 1. Controlled form inputs — React state drives the form values
// 2. Preference persistence — Using the usePreferences hook to save to localStorage
// 3. Bi-directional unit display — Show both °C/°F or cm/inch simultaneously
//
// 💡 CONCEPT: Settings as a separate screen — In v0 we use a simple screen.
// In v1, this could become a modal/drawer. The important thing is that
// the preference logic (usePreferences hook) is decoupled from the UI.

import React from 'react';
import type { Preferences, TemperatureUnit, LengthUnit } from '../types/cooking';
import { PixelCard } from './ui/PixelCard';
import { PixelButton } from './ui/PixelButton';

interface SettingsProps {
  preferences: Preferences;
  onUpdate: (update: Partial<Preferences>) => void;
  onBack: () => void;
}

/**
 * Settings — Unit preferences screen.
 *
 * 🔑 LEARNING: Radio-button style selectors — Instead of native radio inputs,
 * we use styled buttons that look like our pixel art UI. This gives us
 * full visual control while maintaining accessibility (keyboard nav, ARIA).
 */
export const Settings: React.FC<SettingsProps> = ({ preferences, onUpdate, onBack }) => {
  const tempOptions: { value: TemperatureUnit; label: string }[] = [
    { value: 'fahrenheit', label: '°F' },
    { value: 'celsius', label: '°C' },
  ];

  const lengthOptions: { value: LengthUnit; label: string }[] = [
    { value: 'inch', label: 'inch' },
    { value: 'cm', label: 'cm' },
  ];

  return (
    <div className="flex flex-col gap-pixel-4 p-pixel-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center gap-pixel-3">
        <PixelButton variant="secondary" onClick={onBack}>
          ←
        </PixelButton>
        <h1 className="font-pixel text-sm text-gold-400">⚙ SETTINGS</h1>
      </div>

      {/* Temperature Unit */}
      <PixelCard title="TEMPERATURE">
        <div className="flex gap-pixel-2">
          {tempOptions.map((opt) => (
            <button
              key={opt.value}
              className={`
                flex-1 font-pixel text-xs px-pixel-4 py-pixel-3
                border-2 border-solid transition-all duration-100
                ${
                  preferences.temperatureUnit === opt.value
                    ? 'border-gold-400 bg-sear-800 text-gold-300'
                    : 'border-sear-700 bg-stove-950 text-sear-300 hover:border-sear-500'
                }
              `}
              onClick={() => onUpdate({ temperatureUnit: opt.value })}
              aria-pressed={preferences.temperatureUnit === opt.value}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </PixelCard>

      {/* Length Unit */}
      <PixelCard title="LENGTH">
        <div className="flex gap-pixel-2">
          {lengthOptions.map((opt) => (
            <button
              key={opt.value}
              className={`
                flex-1 font-pixel text-xs px-pixel-4 py-pixel-3
                border-2 border-solid transition-all duration-100
                ${
                  preferences.lengthUnit === opt.value
                    ? 'border-gold-400 bg-sear-800 text-gold-300'
                    : 'border-sear-700 bg-stove-950 text-sear-300 hover:border-sear-500'
                }
              `}
              onClick={() => onUpdate({ lengthUnit: opt.value })}
              aria-pressed={preferences.lengthUnit === opt.value}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </PixelCard>

      {/* About */}
      <PixelCard title="ABOUT">
        <div className="flex flex-col gap-pixel-1 text-[8px] text-sear-400">
          <span className="font-pixel">DoneRight v0.1.0</span>
          <span className="font-pixel">A cooking timer PWA</span>
          <span className="font-pixel">with pixel art aesthetics</span>
        </div>
      </PixelCard>
    </div>
  );
};
