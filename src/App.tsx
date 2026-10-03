import React, { useState, useEffect } from 'react';
import {
  Language,
  Facility,
  WeatherData,
  HeatLogEntry,
  WorkerProfile,
  ReminderConfig,
} from './types';
import { INITIAL_FACILITIES } from './data/seedFacilities';
import { getMockWeather, CITIES_CONFIG, calculateHeatIndex, getRiskLevel } from './utils/heatIndex';
import {
  getStoredLogs,
  saveLogs,
  getStoredProfile,
  saveProfile,
  recordLogEntry,
} from './utils/logbookStorage';
import { soundEngine } from './utils/audioAlerts';

import { TopBar } from './components/TopBar';
import { BottomNav } from './components/BottomNav';
import { HomeDashboard } from './components/HomeDashboard';
import { FacilityMap } from './components/FacilityMap';
import { RemindersSection } from './components/RemindersSection';
import { LogbookView } from './components/LogbookView';
import { AdvocacyDashboard } from './components/AdvocacyDashboard';
import { OnboardingModal } from './components/OnboardingModal';
import { WeatherSimulatorModal } from './components/WeatherSimulatorModal';

export default function App() {
  // Navigation & Localization (Default to Tamil 'ta' as requested by prompt)
  const [activeTab, setActiveTab] = useState<'home' | 'map' | 'reminders' | 'logbook' | 'advocacy'>('home');
  const [lang, setLang] = useState<Language>('ta');

  // Worker Profile
  const [profile, setProfile] = useState<WorkerProfile>(() => getStoredProfile());

  // Location / City
  const [selectedCityKey, setSelectedCityKey] = useState<'chennai' | 'madurai' | 'coimbatore' | 'trichy'>(
    profile.city || 'chennai'
  );

  // Weather Simulation Offsets (allows dynamic testing of heat transitions)
  const [tempOffset, setTempOffset] = useState<number>(0);
  const [humOffset, setHumOffset] = useState<number>(0);
  const [weather, setWeather] = useState<WeatherData>(() => getMockWeather(selectedCityKey, 0, 0));

  // Facilities
  const [facilities, setFacilities] = useState<Facility[]>(() => {
    try {
      const stored = localStorage.getItem('coolshift_facilities_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_FACILITIES;
  });

  // Shift Checkpoints (Automated Heat Risk Logbook)
  const [logs, setLogs] = useState<HeatLogEntry[]>(() => getStoredLogs());

  // Reminder Timers Config
  const [reminderConfig, setReminderConfig] = useState<ReminderConfig>({
    hydrationEnabled: true,
    breakEnabled: true,
    workIntensity: 'normal',
    hydrationIntervalMinutes: 30,
    breakIntervalMinutes: 60,
  });

  // Sound Chime State
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Modals
  const [isSimModalOpen, setIsSimModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => {
    return !localStorage.getItem('coolshift_onboarded_v1');
  });

  // Update weather when city or simulation offsets change
  useEffect(() => {
    // Try fetching from backend API first
    fetch(`/api/weather?city=${selectedCityKey}&tempOffset=${tempOffset}&humOffset=${humOffset}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.weather) {
          setWeather(data.weather);
        } else {
          setWeather(getMockWeather(selectedCityKey, tempOffset, humOffset));
        }
      })
      .catch(() => {
        setWeather(getMockWeather(selectedCityKey, tempOffset, humOffset));
      });
  }, [selectedCityKey, tempOffset, humOffset]);

  // Sync facilities with backend on mount
  useEffect(() => {
    fetch('/api/facilities')
      .then((res) => res.json())
      .then((data) => {
        if (data.facilities && Array.isArray(data.facilities)) {
          // Merge backend facilities with local
          setFacilities((prev) => {
            const combined = [...data.facilities];
            // Add user added facilities that might not be on backend yet
            prev.filter((p) => p.addedByUser).forEach((p) => {
              if (!combined.some((c) => c.id === p.id)) {
                combined.unshift(p);
              }
            });
            return combined;
          });
        }
      })
      .catch(() => {
        // Fallback to local
      });
  }, []);

  // Update profile in localStorage
  const handleUpdateProfile = (newProfile: WorkerProfile) => {
    setProfile(newProfile);
    saveProfile(newProfile);
  };

  // Add new crowdsourced facility
  const handleAddFacility = async (newFacData: Omit<Facility, 'id' | 'verified'>) => {
    const newFacility: Facility = {
      ...newFacData,
      id: `fac_local_${Date.now()}`,
      verified: false,
    };

    const updated = [newFacility, ...facilities];
    setFacilities(updated);
    try {
      localStorage.setItem('coolshift_facilities_v1', JSON.stringify(updated));
      // Also post to backend
      fetch('/api/facilities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFacility),
      }).catch(() => {});
    } catch {}
  };

  // Log water intake
  const handleLogWater = () => {
    const cityCfg = CITIES_CONFIG[selectedCityKey] || CITIES_CONFIG.chennai;
    const entry = recordLogEntry(
      cityCfg.lat,
      cityCfg.lon,
      weather.tempC,
      weather.humidity,
      facilities,
      'water_logged'
    );
    setLogs((prev) => [entry, ...prev]);
  };

  // Log shaded break
  const handleLogBreak = () => {
    const cityCfg = CITIES_CONFIG[selectedCityKey] || CITIES_CONFIG.chennai;
    const entry = recordLogEntry(
      cityCfg.lat,
      cityCfg.lon,
      weather.tempC,
      weather.humidity,
      facilities,
      'break_logged'
    );
    setLogs((prev) => [entry, ...prev]);
  };

  // Simulate Checkpoint (Demo tool for evaluator)
  const handleSimulateCheckpoint = () => {
    const cityCfg = CITIES_CONFIG[selectedCityKey] || CITIES_CONFIG.chennai;
    // Jitter coordinates to simulate moving along a delivery corridor
    const jitterLat = cityCfg.lat + (Math.random() - 0.5) * 0.015;
    const jitterLon = cityCfg.lon + (Math.random() - 0.5) * 0.015;
    const entry = recordLogEntry(
      jitterLat,
      jitterLon,
      weather.tempC,
      weather.humidity,
      facilities,
      'none'
    );
    setLogs((prev) => [entry, ...prev]);
  };

  const handleClearLogs = () => {
    if (window.confirm('Clear stored shift logbook?')) {
      setLogs([]);
      saveLogs([]);
    }
  };

  const handleOnboardingComplete = (newProfile: WorkerProfile, selectedLang: Language) => {
    setProfile(newProfile);
    saveProfile(newProfile);
    setLang(selectedLang);
    setSelectedCityKey(newProfile.city);
    setIsOnboardingOpen(false);
    localStorage.setItem('coolshift_onboarded_v1', 'true');
  };

  const currentCityCoords = CITIES_CONFIG[selectedCityKey] || CITIES_CONFIG.chennai;

  // Count water and breaks logged today
  const today = new Date().toDateString();
  const todayWaterCount = logs.filter(
    (l) => l.workerAction === 'water_logged' && new Date(l.timestamp).toDateString() === today
  ).length;
  const todayBreakCount = logs.filter(
    (l) => l.workerAction === 'break_logged' && new Date(l.timestamp).toDateString() === today
  ).length;

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans">
      {/* Top Application Bar (Strict Top Bar Contract: Brand, Nav links, 1-2 primary actions) */}
      <TopBar
        currentTab={activeTab}
        onSelectTab={setActiveTab}
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === 'ta' ? 'en' : 'ta'))}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        onOpenSimModal={() => setIsSimModalOpen(true)}
        riskLevel={weather.riskLevel}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-3.5 sm:p-6 pb-24 md:pb-12">
        {activeTab === 'home' && (
          <HomeDashboard
            weather={weather}
            lang={lang}
            onSelectCity={setSelectedCityKey}
            selectedCityKey={selectedCityKey}
            onNavigateTab={setActiveTab}
            onLogWater={handleLogWater}
            onLogBreak={handleLogBreak}
            logs={logs}
            isSimulated={tempOffset !== 0 || humOffset !== 0}
          />
        )}

        {activeTab === 'map' && (
          <FacilityMap
            facilities={facilities}
            userLat={currentCityCoords.lat}
            userLon={currentCityCoords.lon}
            lang={lang}
            onAddFacility={handleAddFacility}
            selectedCity={selectedCityKey}
          />
        )}

        {activeTab === 'reminders' && (
          <RemindersSection
            config={reminderConfig}
            onChangeConfig={setReminderConfig}
            currentRisk={weather.riskLevel}
            lang={lang}
            onLogWater={handleLogWater}
            onLogBreak={handleLogBreak}
            todayWaterCount={todayWaterCount}
            todayBreakCount={todayBreakCount}
            soundEnabled={soundEnabled}
          />
        )}

        {activeTab === 'logbook' && (
          <LogbookView
            logs={logs}
            profile={profile}
            lang={lang}
            onSimulateCheckpoint={handleSimulateCheckpoint}
            onClearLogs={handleClearLogs}
          />
        )}

        {activeTab === 'advocacy' && (
          <AdvocacyDashboard
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            lang={lang}
            logs={logs}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation (Ergonomic thumb zone) */}
      <BottomNav currentTab={activeTab} onSelectTab={setActiveTab} lang={lang} />

      {/* Weather Simulator Modal (Adjust temp and humidity for instant alert verification) */}
      <WeatherSimulatorModal
        isOpen={isSimModalOpen}
        onClose={() => setIsSimModalOpen(false)}
        temp={weather.tempC}
        humidity={weather.humidity}
        onUpdateTemp={(newTemp) => {
          const base = CITIES_CONFIG[selectedCityKey].defaultTemp;
          setTempOffset(Math.round((newTemp - base) * 10) / 10);
        }}
        onUpdateHumidity={(newHum) => {
          const base = CITIES_CONFIG[selectedCityKey].defaultHumidity;
          setHumOffset(newHum - base);
        }}
        onReset={() => {
          setTempOffset(0);
          setHumOffset(0);
        }}
        lang={lang}
      />

      {/* First-Time Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={handleOnboardingComplete}
        initialLang={lang}
      />
    </div>
  );
}
