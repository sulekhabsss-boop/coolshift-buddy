import React from 'react';
import { Language, RiskLevel } from '../types';
import { getT } from '../data/translations';
import { calculateHeatIndex, getRiskLevel, getRiskColorClass } from '../utils/heatIndex';
import { X, Flame, Sliders, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';

interface WeatherSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  temp: number;
  humidity: number;
  onUpdateTemp: (temp: number) => void;
  onUpdateHumidity: (humidity: number) => void;
  onReset: () => void;
  lang: Language;
}

export const WeatherSimulatorModal: React.FC<WeatherSimulatorModalProps> = ({
  isOpen,
  onClose,
  temp,
  humidity,
  onUpdateTemp,
  onUpdateHumidity,
  onReset,
  lang,
}) => {
  if (!isOpen) return null;

  const t = getT(lang);
  const calculatedHI = calculateHeatIndex(temp, humidity);
  const risk = getRiskLevel(calculatedHI);
  const colors = getRiskColorClass(risk);

  const presets = [
    { label: 'Morning Breeze (Green)', temp: 30, hum: 55 },
    { label: 'Afternoon Heat (Yellow)', temp: 35, hum: 50 },
    { label: 'Peak Delivery Rush (Orange)', temp: 39, hum: 65 },
    { label: '2027 Super El Niño (RED CRISIS)', temp: 44, hum: 75 },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-orange-600" />
            <h2 className="font-bold text-sm sm:text-base text-stone-900">
              Live Heat Index Simulator
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-stone-500 mt-2">
          Adjust temperature & humidity or select a preset to test real-time heat index transitions and alert triggers.
        </p>

        {/* Live Calculation Output Card */}
        <div className={`mt-4 p-4 rounded-xl text-white transition-colors ${colors.bg}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider opacity-90">
              Calculated Risk Level
            </span>
            <span className="text-xs font-mono font-bold bg-black/20 px-2 py-0.5 rounded-md uppercase">
              {risk}
            </span>
          </div>

          <div className="mt-2 flex items-baseline justify-between">
            <div>
              <div className="text-3xl font-black font-mono tracking-tight tabular-nums">
                {calculatedHI}°C
              </div>
              <div className="text-xs opacity-90 mt-0.5">
                Feels-Like Heat Index (NOAA Rothfusz)
              </div>
            </div>

            <div className="text-right text-xs opacity-90">
              <div>Temp: {temp}°C</div>
              <div>Humidity: {humidity}%</div>
            </div>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="mt-4">
          <label className="block text-xs font-semibold text-stone-700 mb-1.5">
            Test Scenarios / Presets
          </label>
          <div className="grid grid-cols-2 gap-2">
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onUpdateTemp(p.temp);
                  onUpdateHumidity(p.hum);
                }}
                className="p-2 text-left text-xs bg-stone-50 hover:bg-orange-50 border border-stone-200 hover:border-orange-300 rounded-lg transition-colors"
              >
                <div className="font-semibold text-stone-900">{p.label}</div>
                <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                  {p.temp}°C · {p.hum}% RH
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sliders */}
        <div className="mt-4 space-y-3">
          <div>
            <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
              <span>Air Temperature (°C)</span>
              <span className="font-mono font-bold">{temp}°C</span>
            </div>
            <input
              type="range"
              min="28"
              max="48"
              step="0.5"
              value={temp}
              onChange={(e) => onUpdateTemp(Number(e.target.value))}
              className="w-full accent-orange-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
              <span>Relative Humidity (%)</span>
              <span className="font-mono font-bold">{humidity}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="95"
              step="1"
              value={humidity}
              onChange={(e) => onUpdateHumidity(Number(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 mt-5 pt-3 border-t border-stone-200">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Live</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
