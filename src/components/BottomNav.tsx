import React from 'react';
import { Language } from '../types';
import { getT } from '../data/translations';
import { AlertTriangle, MapPin, Droplets, BookOpen, Users } from 'lucide-react';

interface BottomNavProps {
  currentTab: 'home' | 'map' | 'reminders' | 'logbook' | 'advocacy';
  onSelectTab: (tab: 'home' | 'map' | 'reminders' | 'logbook' | 'advocacy') => void;
  lang: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab, lang }) => {
  const t = getT(lang);

  const items = [
    { id: 'home' as const, label: t.navHome, icon: AlertTriangle },
    { id: 'map' as const, label: t.navMap, icon: MapPin },
    { id: 'reminders' as const, label: t.navReminders, icon: Droplets },
    { id: 'logbook' as const, label: t.navLogbook, icon: BookOpen },
    { id: 'advocacy' as const, label: t.navAdvocacy, icon: Users },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-lg pb-safe">
      <div className="grid grid-cols-5 h-16 items-center px-1">
        {items.map((item) => {
          const isActive = currentTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] transition-colors ${
                isActive ? 'text-orange-600 font-bold' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-orange-600 rounded-full" />
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1 line-clamp-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
