import React from 'react';
import { WeatherData, Language, RiskLevel } from '../types';
import { getT } from '../data/translations';
import { getRiskColorClass } from '../utils/heatIndex';
import { soundEngine } from '../utils/audioAlerts';
import { Sun, AlertOctagon, Flame, ShieldCheck, Volume2, MapPin, Wind, Droplets } from 'lucide-react';

interface HeatRiskBannerProps {
  weather: WeatherData;
  lang: Language;
  onSelectCity: (cityKey: 'chennai' | 'madurai' | 'coimbatore' | 'trichy') => void;
  selectedCityKey: 'chennai' | 'madurai' | 'coimbatore' | 'trichy';
  isSimulated?: boolean;
}

export const HeatRiskBanner: React.FC<HeatRiskBannerProps> = ({
  weather,
  lang,
  onSelectCity,
  selectedCityKey,
  isSimulated,
}) => {
  const t = getT(lang);
  const color = getRiskColorClass(weather.riskLevel);

  const getRiskIcon = (level: RiskLevel) => {
    switch (level) {
      case 'green':
        return ShieldCheck;
      case 'yellow':
        return Sun;
      case 'orange':
        return Flame;
      case 'red':
        return AlertOctagon;
    }
  };

  const Icon = getRiskIcon(weather.riskLevel);

  const getRiskTitle = (level: RiskLevel) => {
    switch (level) {
      case 'green':
        return t.riskGreen;
      case 'yellow':
        return t.riskYellow;
      case 'orange':
        return t.riskOrange;
      case 'red':
        return t.riskRed;
    }
  };

  const getRiskDescription = (level: RiskLevel) => {
    switch (level) {
      case 'green':
        return t.riskDescGreen;
      case 'yellow':
        return t.riskDescYellow;
      case 'orange':
        return t.riskDescOrange;
      case 'red':
        return t.riskDescRed;
    }
  };

  const handleSpeak = () => {
    const textToSpeak = lang === 'ta'
      ? `${getRiskTitle(weather.riskLevel)}. உணரப்படும் வெப்பம் ${Math.round(weather.heatIndexC)} டிகிரி செல்சியஸ். ${getRiskDescription(weather.riskLevel)}`
      : `${getRiskTitle(weather.riskLevel)}. Heat index ${Math.round(weather.heatIndexC)} degrees Celsius. ${getRiskDescription(weather.riskLevel)}`;
    soundEngine.speakAlert(textToSpeak, lang);
  };

  return (
    <div
      className={`rounded-2xl transition-all duration-300 overflow-hidden shadow-sm border ${
        weather.riskLevel === 'red'
          ? 'bg-red-600 text-white border-red-700'
          : weather.riskLevel === 'orange'
          ? 'bg-gradient-to-br from-orange-500 to-amber-600 text-white border-orange-600'
          : weather.riskLevel === 'yellow'
          ? 'bg-amber-400 text-amber-950 border-amber-500'
          : 'bg-emerald-600 text-white border-emerald-700'
      }`}
    >
      <div className="p-4 sm:p-5">
        {/* Top bar with location selector and speech trigger */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 bg-black/15 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-semibold">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <select
              value={selectedCityKey}
              onChange={(e) => onSelectCity(e.target.value as 'chennai' | 'madurai' | 'coimbatore' | 'trichy')}
              className="bg-transparent border-none text-inherit font-semibold text-xs cursor-pointer focus:outline-none pr-1"
            >
              <option value="chennai" className="text-stone-900">Chennai / சென்னை</option>
              <option value="madurai" className="text-stone-900">Madurai / மதுரை</option>
              <option value="coimbatore" className="text-stone-900">Coimbatore / கோவை</option>
              <option value="trichy" className="text-stone-900">Tiruchirappalli / திருச்சி</option>
            </select>
            {isSimulated && <span className="opacity-80 text-[10px]">· sim</span>}
          </div>

          <button
            onClick={handleSpeak}
            className="flex items-center gap-1 px-2.5 py-1 bg-black/20 hover:bg-black/30 rounded-lg text-xs font-medium transition-colors min-h-[32px] cursor-pointer"
            title="Read Alert Aloud"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{lang === 'ta' ? 'குரல்' : 'Listen'}</span>
          </button>
        </div>

        {/* Main Status Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-white/20 backdrop-blur-xs rounded-xl shrink-0 mt-0.5">
              <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider font-extrabold opacity-90">
                {t.selectedCity}: {lang === 'ta' ? weather.cityTa : weather.city}
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
                {getRiskTitle(weather.riskLevel)}
              </h1>
              <p className="text-xs sm:text-sm font-medium mt-1 leading-snug max-w-xl opacity-95">
                {getRiskDescription(weather.riskLevel)}
              </p>
            </div>
          </div>

          {/* Big Heat Index readout with tabular numbers */}
          <div className="flex items-baseline sm:flex-col sm:items-end shrink-0 gap-2 sm:gap-0 bg-black/15 p-3 rounded-xl">
            <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider opacity-85">
              {t.heatIndex}
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono tabular-nums tracking-tight">
              {weather.heatIndexC}°C
            </div>
            <div className="text-xs opacity-90 sm:mt-0.5">
              {t.temperature}: {weather.tempC}°C · {weather.humidity}% {t.humidity}
            </div>
          </div>
        </div>

        {/* Secondary atmospheric strip */}
        <div className="mt-3 pt-3 border-t border-white/20 flex flex-wrap items-center justify-between gap-2 text-xs font-medium opacity-90">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5" />
              <span>{weather.humidity}% Humidity</span>
            </span>
            <span className="flex items-center gap-1">
              <Wind className="w-3.5 h-3.5" />
              <span>{weather.windKmh} km/h Wind</span>
            </span>
            <span>UV Index: {weather.uvIndex} (Extreme)</span>
          </div>

          <div className="text-[11px] opacity-80">
            NOAA Rothfusz Algorithmic Index
          </div>
        </div>
      </div>
    </div>
  );
};
