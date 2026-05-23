import React from 'react';
import type { Preferences, TemperatureUnit, LengthUnit } from '../types/cooking';
import { THEMES } from '../data/themes';
import { PixelCard } from './ui/PixelCard';
import { PixelButton } from './ui/PixelButton';

interface SettingsProps {
  preferences: Preferences;
  onUpdate: (update: Partial<Preferences>) => void;
  onBack: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ preferences, onUpdate, onBack }) => {
  const tempOptions: { value: TemperatureUnit; label: string }[] = [
    { value: 'fahrenheit', label: '°F' },
    { value: 'celsius',    label: '°C' },
  ];

  const lengthOptions: { value: LengthUnit; label: string }[] = [
    { value: 'inch', label: 'inch' },
    { value: 'cm',   label: 'cm'   },
  ];

  return (
    <div className="flex flex-col gap-pixel-4 p-pixel-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center gap-pixel-3">
        <PixelButton variant="secondary" onClick={onBack}>←</PixelButton>
        <h1 className="font-heading text-xl text-hi">⚙ Settings</h1>
      </div>

      {/* Theme picker */}
      <PixelCard title="THEME">
        <div className="grid grid-cols-2 gap-pixel-2">
          {THEMES.map((theme) => {
            const isActive = preferences.themeId === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => onUpdate({ themeId: theme.id })}
                aria-pressed={isActive}
                className={`
                  flex flex-col items-start gap-1 px-pixel-3 py-pixel-3
                  border rounded-md transition-all duration-150 text-left
                  ${isActive
                    ? 'border-hi bg-panel'
                    : 'border-outline bg-canvas hover:border-hi/50'
                  }
                `}
              >
                {/* Color swatches — shows theme palette preview */}
                <div className="flex gap-1">
                  {theme.swatches.map((color) => (
                    <span
                      key={color}
                      className="w-4 h-4 rounded-full flex-shrink-0 border border-black/20"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <span className={`font-pixel text-[9px] leading-tight ${
                  isActive ? 'text-hi' : 'text-body-sub'
                }`}>
                  {theme.name}
                </span>
                {isActive && (
                  <span className="font-pixel text-[7px] text-hi">✓ active</span>
                )}
              </button>
            );
          })}
        </div>
      </PixelCard>

      {/* Temperature unit */}
      <PixelCard title="TEMPERATURE">
        <div className="flex gap-pixel-2">
          {tempOptions.map((opt) => (
            <button
              key={opt.value}
              className={`
                flex-1 font-pixel text-xs px-pixel-4 py-pixel-3
                border border-solid rounded-md transition-all duration-150
                ${preferences.temperatureUnit === opt.value
                  ? 'border-hi bg-panel text-hi'
                  : 'border-outline bg-canvas text-body-sub hover:border-hi/50'
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

      {/* Length unit */}
      <PixelCard title="LENGTH">
        <div className="flex gap-pixel-2">
          {lengthOptions.map((opt) => (
            <button
              key={opt.value}
              className={`
                flex-1 font-pixel text-xs px-pixel-4 py-pixel-3
                border border-solid rounded-md transition-all duration-150
                ${preferences.lengthUnit === opt.value
                  ? 'border-hi bg-panel text-hi'
                  : 'border-outline bg-canvas text-body-sub hover:border-hi/50'
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
        <div className="flex flex-col gap-pixel-1 text-[8px] text-body-muted">
          <span className="font-pixel">DoneRight v0.1.0</span>
          <span className="font-pixel">A cooking timer PWA</span>
          <span className="font-pixel">60-30-10 color system</span>
        </div>
      </PixelCard>
    </div>
  );
};
