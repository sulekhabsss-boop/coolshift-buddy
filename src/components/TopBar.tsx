import React from 'react';
import { Language, RiskLevel } from '../types';
import { getT } from '../data/translations';
import { Volume2, VolumeX, Sliders, Globe } from 'lucide-react';

interface TopBarProps {
  currentTab: 'home' | 'map' | 'reminders' | 'logbook' | 'advocacy';
  onSelectTab: (tab: 'home' | 'map' | 'reminders' | 'logbook' | 'advocacy') => void;
  lang: Language;
  onToggleLang: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSimModal: () => void;
  riskLevel: RiskLevel;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  onSelectTab,
  lang,
  onToggleLang,
  soundEnabled,
  onToggleSound,
  onOpenSimModal,
}) => {
  const t = getT(lang);

  const navItems = [
    { id: 'home' as const, label: t.navHome },
    { id: 'map' as const, label: t.navMap },
    { id: 'reminders' as const, label: t.navReminders },
    { id: 'logbook' as const, label: t.navLogbook },
    { id: 'advocacy' as const, label: t.navAdvocacy },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-2">
        {/* Zone 1: Single element Brand wordmark */}
        <button
          onClick={() => onSelectTab('home')}
          className="text-left font-bold text-lg tracking-tight text-stone-900 flex items-center gap-2 shrink-0 hover:opacity-90 transition-opacity"
        >
          <span className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center font-black text-base shadow-xs">
            CS
          </span>
          <span className="truncate">CoolShift Buddy</span>
        </button>

        {/* Zone 2: Navigation Links (single-line controls) */}
        <nav className="hidden md:flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 Primary Action controls */}
        <div className="flex items-center gap-2">
          {/* Weather Simulation Trigger */}
          <button
            onClick={onOpenSimModal}
            title={t.actionSimulateConditions}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors whitespace-nowrap min-h-[36px]"
          >
            <Sliders className="w-3.5 h-3.5 text-orange-600" />
            <span className="hidden sm:inline">Simulate Heat</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute Alerts' : 'Enable Chime Alerts'}
            className="p-2 text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-stone-400" />
            )}
          </button>

          {/* Language Toggle (Tamil / English) */}
          <button
            onClick={onToggleLang}
            className="px-2.5 py-1.5 text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap min-h-[36px]"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{lang === 'ta' ? 'English' : 'தமிழ்'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
