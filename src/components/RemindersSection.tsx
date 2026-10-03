import React, { useState, useEffect } from 'react';
import { ReminderConfig, RiskLevel, Language } from '../types';
import { getT } from '../data/translations';
import { soundEngine } from '../utils/audioAlerts';
import { Droplet, Coffee, Bell, Check, Clock, ShieldAlert, Sparkles, Volume2 } from 'lucide-react';

interface RemindersSectionProps {
  config: ReminderConfig;
  onChangeConfig: (newConfig: ReminderConfig) => void;
  currentRisk: RiskLevel;
  lang: Language;
  onLogWater: () => void;
  onLogBreak: () => void;
  todayWaterCount: number;
  todayBreakCount: number;
  soundEnabled: boolean;
}

export const RemindersSection: React.FC<RemindersSectionProps> = ({
  config,
  onChangeConfig,
  currentRisk,
  lang,
  onLogWater,
  onLogBreak,
  todayWaterCount,
  todayBreakCount,
  soundEnabled,
}) => {
  const t = getT(lang);

  // Active timers in seconds for demo/live countdown
  const [waterSecondsLeft, setWaterSecondsLeft] = useState(config.hydrationIntervalMinutes * 60);
  const [breakSecondsLeft, setBreakSecondsLeft] = useState(config.breakIntervalMinutes * 60);
  const [showCelebration, setShowCelebration] = useState<'water' | 'break' | null>(null);

  // Auto-tune interval based on heat level if in Orange or Red
  const effectiveWaterInterval =
    (currentRisk === 'orange' || currentRisk === 'red')
      ? Math.min(30, config.hydrationIntervalMinutes)
      : config.hydrationIntervalMinutes;

  const effectiveBreakInterval =
    currentRisk === 'red'
      ? Math.min(45, config.breakIntervalMinutes)
      : currentRisk === 'orange'
      ? Math.min(60, config.breakIntervalMinutes)
      : config.breakIntervalMinutes;

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setWaterSecondsLeft((prev) => {
        if (prev <= 1) {
          if (soundEnabled) soundEngine.playWaterChime();
          return effectiveWaterInterval * 60;
        }
        return prev - 1;
      });

      setBreakSecondsLeft((prev) => {
        if (prev <= 1) {
          if (soundEnabled) soundEngine.playHeatWarning();
          return effectiveBreakInterval * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [effectiveWaterInterval, effectiveBreakInterval, soundEnabled]);

  const handleWaterClick = () => {
    onLogWater();
    setWaterSecondsLeft(effectiveWaterInterval * 60);
    if (soundEnabled) soundEngine.playWaterChime();
    setShowCelebration('water');
    setTimeout(() => setShowCelebration(null), 2500);
  };

  const handleBreakClick = () => {
    onLogBreak();
    setBreakSecondsLeft(effectiveBreakInterval * 60);
    if (soundEnabled) soundEngine.playWaterChime();
    setShowCelebration('break');
    setTimeout(() => setShowCelebration(null), 2500);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header card with feedback toast */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs relative overflow-hidden">
        {showCelebration && (
          <div className="absolute inset-0 bg-emerald-600 text-white flex items-center justify-center p-4 z-20 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
              <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
              <span>{showCelebration === 'water' ? t.logWaterSuccess : t.logBreakSuccess}</span>
            </div>
          </div>
        )}

        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-stone-900 tracking-tight">{t.remindersTitle}</h2>
            <p className="text-xs text-stone-500 mt-0.5">{t.remindersSubtitle}</p>
          </div>

          {(currentRisk === 'orange' || currentRisk === 'red') && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-900 rounded-lg text-xs font-semibold shrink-0">
              <ShieldAlert className="w-4 h-4 text-orange-600" />
              <span>Auto-Boost Active</span>
            </div>
          )}
        </div>

        {/* Dual Countdown Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
          {/* Card 1: Hydration Tracker */}
          <div className="bg-sky-50/70 border border-sky-200/80 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-sky-900 uppercase tracking-wider">
                  <Droplet className="w-4 h-4 text-sky-600 fill-sky-600" />
                  <span>{t.nextWaterIn}</span>
                </span>
                <span className="text-xs font-semibold text-sky-700">
                  {todayWaterCount} {t.glasses} {lang === 'ta' ? 'இன்று' : 'today'}
                </span>
              </div>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold font-mono text-sky-950 tabular-nums">
                  {formatTime(waterSecondsLeft)}
                </span>
                <span className="text-xs text-sky-700">
                  (every {effectiveWaterInterval}m)
                </span>
              </div>
            </div>

            <button
              onClick={handleWaterClick}
              className="mt-4 w-full py-2.5 bg-sky-600 hover:bg-sky-700 active:scale-[0.98] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-transform min-h-[44px]"
            >
              <Check className="w-4 h-4" />
              <span>{t.actionDrankWater}</span>
            </button>
          </div>

          {/* Card 2: Shaded Break Tracker */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  <Coffee className="w-4 h-4 text-emerald-600" />
                  <span>{t.nextRestIn}</span>
                </span>
                <span className="text-xs font-semibold text-emerald-700">
                  {todayBreakCount} {lang === 'ta' ? 'ஓய்வுகள்' : 'breaks'}
                </span>
              </div>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-950 tabular-nums">
                  {formatTime(breakSecondsLeft)}
                </span>
                <span className="text-xs text-emerald-700">
                  (every {effectiveBreakInterval}m)
                </span>
              </div>
            </div>

            <button
              onClick={handleBreakClick}
              className="mt-4 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-transform min-h-[44px]"
            >
              <Check className="w-4 h-4" />
              <span>{t.actionTookBreak}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preset Settings Card */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
        <h3 className="text-sm font-bold text-stone-900 tracking-tight">{t.workloadSetting}</h3>
        <p className="text-xs text-stone-500 mt-0.5">
          Select your work type to set optimal hydration intervals for Tamil Nadu weather
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3">
          <button
            onClick={() =>
              onChangeConfig({
                ...config,
                workIntensity: 'light',
                hydrationIntervalMinutes: 45,
                breakIntervalMinutes: 90,
              })
            }
            className={`p-3 rounded-xl border text-left transition-colors min-h-[44px] ${
              config.workIntensity === 'light'
                ? 'border-orange-500 bg-orange-50/50'
                : 'border-stone-200 hover:bg-stone-50'
            }`}
          >
            <div className="font-bold text-xs text-stone-900">{t.lightWork}</div>
            <div className="text-[11px] text-stone-500 mt-0.5">Water: 45m · Break: 90m</div>
          </button>

          <button
            onClick={() =>
              onChangeConfig({
                ...config,
                workIntensity: 'normal',
                hydrationIntervalMinutes: 30,
                breakIntervalMinutes: 60,
              })
            }
            className={`p-3 rounded-xl border text-left transition-colors min-h-[44px] ${
              config.workIntensity === 'normal'
                ? 'border-orange-500 bg-orange-50/50 ring-1 ring-orange-500'
                : 'border-stone-200 hover:bg-stone-50'
            }`}
          >
            <div className="font-bold text-xs text-stone-900">{t.normalWork}</div>
            <div className="text-[11px] text-stone-500 mt-0.5">Water: 30m · Break: 60m</div>
          </button>

          <button
            onClick={() =>
              onChangeConfig({
                ...config,
                workIntensity: 'hard',
                hydrationIntervalMinutes: 20,
                breakIntervalMinutes: 45,
              })
            }
            className={`p-3 rounded-xl border text-left transition-colors min-h-[44px] ${
              config.workIntensity === 'hard'
                ? 'border-orange-500 bg-orange-50/50'
                : 'border-stone-200 hover:bg-stone-50'
            }`}
          >
            <div className="font-bold text-xs text-stone-900">{t.hardWork}</div>
            <div className="text-[11px] text-stone-500 mt-0.5">Water: 20m · Break: 45m</div>
          </button>
        </div>

        {/* Guidance tip box */}
        <div className="mt-4 p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-xs text-stone-600 leading-relaxed">
          <strong className="text-stone-900">Dr. Guidance for Gig Riders: </strong>
          In 38°C+ heat, the body loses up to 1 litre of sweat per hour. Never wait until you feel thirsty—by then, early dehydration has already slowed your reflexes and strained your kidneys. Add a pinch of salt/lemon or oral rehydration salts (ORS) to your water bottle.
        </div>
      </div>
    </div>
  );
};
