import { RiskLevel, WeatherData } from '../types';

/**
 * Calculates Heat Index using the National Oceanic and Atmospheric Administration (NOAA)
 * Rothfusz regression equation.
 * Input: tempC (Celsius), humidity (Percentage 0-100)
 * Output: Heat Index in Celsius
 */
export function calculateHeatIndex(tempC: number, humidity: number): number {
  // Convert Celsius to Fahrenheit
  const T = (tempC * 9) / 5 + 32;
  const RH = humidity;

  // Simple average first
  let HI_f = 0.5 * (T + 61.0 + ((T - 68.0) * 1.2) + (RH * 0.094));

  // If HI >= 80°F, apply full Rothfusz regression
  if (HI_f >= 80) {
    HI_f =
      -42.379 +
      2.04901523 * T +
      10.14333127 * RH -
      0.22475541 * T * RH -
      0.00683783 * T * T -
      0.05481717 * RH * RH +
      0.00122874 * T * T * RH +
      0.00085282 * T * RH * RH -
      0.00000199 * T * T * RH * RH;

    // Adjustments
    if (RH < 13 && T >= 80 && T <= 112) {
      const adjustment = ((13 - RH) / 4) * Math.sqrt((17 - Math.abs(T - 95.0)) / 17);
      HI_f -= adjustment;
    } else if (RH > 85 && T >= 80 && T <= 87) {
      const adjustment = ((RH - 85) / 10) * ((87 - T) / 5);
      HI_f += adjustment;
    }
  }

  // Convert back to Celsius
  const HI_c = ((HI_f - 32) * 5) / 9;
  return Math.round(HI_c * 10) / 10;
}

/**
 * Classifies heat index into risk tiers as specified in the project requirements:
 * Green: < 32°C
 * Yellow: 32–38°C
 * Orange: 38–45°C
 * Red: > 45°C
 */
export function getRiskLevel(heatIndexC: number): RiskLevel {
  if (heatIndexC < 32) return 'green';
  if (heatIndexC < 38) return 'yellow';
  if (heatIndexC <= 45) return 'orange';
  return 'red';
}

export function getRiskColorClass(level: RiskLevel): {
  bg: string;
  border: string;
  text: string;
  badge: string;
  accent: string;
  ring: string;
} {
  switch (level) {
    case 'green':
      return {
        bg: 'bg-emerald-500',
        border: 'border-emerald-600',
        text: 'text-emerald-950',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        accent: '#10b981',
        ring: 'ring-emerald-400',
      };
    case 'yellow':
      return {
        bg: 'bg-amber-400',
        border: 'border-amber-500',
        text: 'text-amber-950',
        badge: 'bg-amber-100 text-amber-900 border-amber-300',
        accent: '#f59e0b',
        ring: 'ring-amber-400',
      };
    case 'orange':
      return {
        bg: 'bg-orange-500',
        border: 'border-orange-600',
        text: 'text-white',
        badge: 'bg-orange-100 text-orange-900 border-orange-300',
        accent: '#f97316',
        ring: 'ring-orange-500',
      };
    case 'red':
      return {
        bg: 'bg-red-600',
        border: 'border-red-700',
        text: 'text-white',
        badge: 'bg-red-100 text-red-950 border-red-300',
        accent: '#dc2626',
        ring: 'ring-red-600',
      };
  }
}

/**
 * Calculates straight line distance in meters using Haversine formula
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Generates an anonymous ~300m grid cell ID from lat/lon to protect worker privacy
 */
export function getGridId(lat: number, lon: number): string {
  // Round to approx 0.003 degrees (~300m)
  const gridLat = (Math.round(lat / 0.003) * 0.003).toFixed(3);
  const gridLon = (Math.round(lon / 0.003) * 0.003).toFixed(3);
  return `GRID_${gridLat}_${gridLon}`;
}

export const CITIES_CONFIG = {
  chennai: {
    name: 'Chennai',
    nameTa: 'சென்னை',
    lat: 13.0827,
    lon: 80.2707,
    defaultTemp: 38.5,
    defaultHumidity: 68,
  },
  madurai: {
    name: 'Madurai',
    nameTa: 'மதுரை',
    lat: 9.9252,
    lon: 78.1198,
    defaultTemp: 40.2,
    defaultHumidity: 54,
  },
  coimbatore: {
    name: 'Coimbatore',
    nameTa: 'கோயம்புத்தூர்',
    lat: 11.0168,
    lon: 76.9558,
    defaultTemp: 36.8,
    defaultHumidity: 58,
  },
  trichy: {
    name: 'Tiruchirappalli',
    nameTa: 'திருச்சிராப்பள்ளி',
    lat: 10.7905,
    lon: 78.7047,
    defaultTemp: 39.4,
    defaultHumidity: 60,
  }
};

export function getMockWeather(cityKey: 'chennai' | 'madurai' | 'coimbatore' | 'trichy', tempOffset = 0, humOffset = 0): WeatherData {
  const city = CITIES_CONFIG[cityKey] || CITIES_CONFIG.chennai;
  const tempC = Math.round((city.defaultTemp + tempOffset) * 10) / 10;
  const humidity = Math.min(95, Math.max(20, Math.round(city.defaultHumidity + humOffset)));
  const heatIndexC = calculateHeatIndex(tempC, humidity);
  const riskLevel = getRiskLevel(heatIndexC);

  const summaryEn = riskLevel === 'red'
    ? 'CRITICAL HEATWAVE! Extreme risk of heat stroke. Drink electrolytes and rest in AC or deep shade.'
    : riskLevel === 'orange'
    ? 'Dangerous Heat Index. High humidity makes sweat evaporation ineffective. Hydrate every 30m.'
    : riskLevel === 'yellow'
    ? 'Warm conditions with high humidity. Drink water regularly and wear light breathable cotton.'
    : 'Pleasant to moderate conditions. Stay hydrated.';

  const summaryTa = riskLevel === 'red'
    ? 'கடும் வெப்ப அலை! உயிருக்கு ஆபத்தான வெப்பம். உடனடியாக நிழலில் ஓய்வெடுத்து நீர் அருந்துங்கள்.'
    : riskLevel === 'orange'
    ? 'ஆபத்தான அதிக வெப்பம். வியர்வை உலராமல் உடல் சூடாகும். 30 நிமிடத்திற்கு ஒருமுறை தண்ணீர் குடிக்கவும்.'
    : riskLevel === 'yellow'
    ? 'சூடு அதிகரிக்கிறது. சீரான இடைவெளியில் தண்ணீர் அருந்தவும்.'
    : 'இயல்பான சூழல். போதுமான அளவு நீர் அருந்துங்கள்.';

  return {
    city: city.name,
    cityTa: city.nameTa,
    lat: city.lat,
    lon: city.lon,
    tempC,
    humidity,
    heatIndexC,
    feelsLikeC: heatIndexC,
    riskLevel,
    uvIndex: riskLevel === 'red' ? 11 : riskLevel === 'orange' ? 9 : 7,
    windKmh: 14,
    summaryEn,
    summaryTa,
    recordedAt: new Date().toISOString(),
  };
}
