import React from 'react';
import { WeatherData, Language, RiskLevel, HeatLogEntry } from '../types';
import { getT } from '../data/translations';
import { HeatRiskBanner } from './HeatRiskBanner';
import { calculateShiftAnalytics } from '../utils/logbookStorage';
import {
  MapPin,
  Droplet,
  Coffee,
  BookOpen,
  AlertTriangle,
  HeartPulse,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  SunMedium,
  ThermometerSnowflake,
} from 'lucide-react';

interface HomeDashboardProps {
  weather: WeatherData;
  lang: Language;
  onSelectCity: (cityKey: 'chennai' | 'madurai' | 'coimbatore' | 'trichy') => void;
  selectedCityKey: 'chennai' | 'madurai' | 'coimbatore' | 'trichy';
  onNavigateTab: (tab: 'home' | 'map' | 'reminders' | 'logbook' | 'advocacy') => void;
  onLogWater: () => void;
  onLogBreak: () => void;
  logs: HeatLogEntry[];
  isSimulated?: boolean;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  weather,
  lang,
  onSelectCity,
  selectedCityKey,
  onNavigateTab,
  onLogWater,
  onLogBreak,
  logs,
  isSimulated,
}) => {
  const t = getT(lang);
  const stats = calculateShiftAnalytics(logs);

  return (
    <div className="flex flex-col gap-5">
      {/* 1. Real-Time Heat Risk Alert Hero */}
      <HeatRiskBanner
        weather={weather}
        lang={lang}
        onSelectCity={onSelectCity}
        selectedCityKey={selectedCityKey}
        isSimulated={isSimulated}
      />

      {/* 2. Quick Action Grid (Big tactile touch targets >= 44px) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Action 1: Find Facility Map */}
        <button
          onClick={() => onNavigateTab('map')}
          className="p-3.5 bg-white hover:bg-stone-50 border border-stone-200 rounded-2xl text-left flex flex-col justify-between shadow-xs transition-all active:scale-[0.98] min-h-[92px]"
        >
          <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center text-base">
            🗺️
          </div>
          <div>
            <div className="font-bold text-xs text-stone-900 leading-tight">
              {t.actionFindMap}
            </div>
            <div className="text-[10px] text-stone-500 mt-0.5">Nearby spots</div>
          </div>
        </button>

        {/* Action 2: Log Water */}
        <button
          onClick={onLogWater}
          className="p-3.5 bg-white hover:bg-sky-50 border border-stone-200 hover:border-sky-300 rounded-2xl text-left flex flex-col justify-between shadow-xs transition-all active:scale-[0.98] min-h-[92px]"
        >
          <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center text-base">
            💧
          </div>
          <div>
            <div className="font-bold text-xs text-sky-950 leading-tight">
              {t.actionDrankWater}
            </div>
            <div className="text-[10px] text-sky-700 mt-0.5 font-mono">
              {stats.waterCount} {t.glasses} today
            </div>
          </div>
        </button>

        {/* Action 3: Log Break */}
        <button
          onClick={onLogBreak}
          className="p-3.5 bg-white hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 rounded-2xl text-left flex flex-col justify-between shadow-xs transition-all active:scale-[0.98] min-h-[92px]"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-base">
            🌳
          </div>
          <div>
            <div className="font-bold text-xs text-emerald-950 leading-tight">
              {t.actionTookBreak}
            </div>
            <div className="text-[10px] text-emerald-700 mt-0.5 font-mono">
              {stats.breakCount} breaks today
            </div>
          </div>
        </button>

        {/* Action 4: Exposure Summary */}
        <button
          onClick={() => onNavigateTab('logbook')}
          className="p-3.5 bg-white hover:bg-stone-50 border border-stone-200 rounded-2xl text-left flex flex-col justify-between shadow-xs transition-all active:scale-[0.98] min-h-[92px]"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-base">
            📊
          </div>
          <div>
            <div className="font-bold text-xs text-stone-900 leading-tight">
              {t.actionViewSummary}
            </div>
            <div className="text-[10px] text-stone-500 mt-0.5">Shift Logbook</div>
          </div>
        </button>
      </div>

      {/* 3. Today's Exposure Summary & Sanitation Deficit Bar */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-sm text-stone-900">{t.todayStats}</h2>
          <button
            onClick={() => onNavigateTab('logbook')}
            className="text-xs text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-0.5"
          >
            <span>View Full Log</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
            <div className="text-[11px] text-stone-500">{t.timeInHighHeat}</div>
            <div className="text-xl sm:text-2xl font-black font-mono text-stone-900 tabular-nums mt-0.5">
              {stats.hoursOrangeRed} <span className="text-xs font-normal text-stone-500">{t.hours}</span>
            </div>
          </div>

          <div className="p-3 bg-red-50/70 rounded-xl border border-red-100">
            <div className="text-[11px] text-red-700 font-medium">{t.timeWithoutToilet}</div>
            <div className="text-xl sm:text-2xl font-black font-mono text-red-700 tabular-nums mt-0.5">
              {stats.hoursNoToiletInHeat} <span className="text-xs font-normal text-red-600">{t.hours}</span>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3 bg-sky-50/70 rounded-xl border border-sky-100">
            <div className="text-[11px] text-sky-800 font-medium">{t.waterTakenToday}</div>
            <div className="text-xl sm:text-2xl font-black font-mono text-sky-900 tabular-nums mt-0.5">
              {stats.waterCount} <span className="text-xs font-normal text-sky-700">{t.glasses}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Outdoor Worker Heat Safety Guidelines */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
        <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
          <HeartPulse className="w-4 h-4 text-red-600" />
          <span>Recognizing Heat Illness on Two-Wheelers</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/70 text-xs">
            <div className="font-bold text-amber-900 flex items-center gap-1.5">
              <span>⚠️</span>
              <span>Heat Exhaustion (Early Warning)</span>
            </div>
            <p className="text-amber-800 mt-1 leading-relaxed text-[11px]">
              Heavy sweating, dizziness, muscle cramps, cold clammy skin. 
              <strong> Action: </strong> Stop bike immediately, sit in deep shade, drink salted lime water or ORS.
            </p>
          </div>

          <div className="p-3 bg-red-50/60 rounded-xl border border-red-200/70 text-xs">
            <div className="font-bold text-red-950 flex items-center gap-1.5">
              <span>🚨</span>
              <span>Heat Stroke (Medical Emergency)</span>
            </div>
            <p className="text-red-900 mt-1 leading-relaxed text-[11px]">
              High body temperature, hot dry skin (no sweat), confusion, vomiting. 
              <strong> Action: </strong> Call 108 emergency ambulance. Pour water over rider's head and neck.
            </p>
          </div>
        </div>

        {/* Practical tips */}
        <div className="mt-3.5 pt-3 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-stone-600">
          <div className="flex items-start gap-2">
            <span className="text-stone-400 font-bold">•</span>
            <span>Cover neck with wet cotton cloth under motorcycle helmet.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-stone-400 font-bold">•</span>
            <span>Carry 2L stainless steel flask; refill at verified Thanner Pandals.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-stone-400 font-bold">•</span>
            <span>Park under flyovers or trees during delivery app wait times.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
