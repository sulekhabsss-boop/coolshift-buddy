export type Language = 'ta' | 'en';

export type RiskLevel = 'green' | 'yellow' | 'orange' | 'red';

export type FacilityType = 'water' | 'toilet' | 'shade';

export interface Facility {
  id: string;
  name: string;
  nameTa: string;
  type: FacilityType;
  lat: number;
  lon: number;
  isFree: boolean;
  cleanlinessRating: number; // 1 to 5
  operatingHours: string;
  address: string;
  addressTa: string;
  city: 'chennai' | 'madurai' | 'coimbatore' | 'trichy';
  verified: boolean;
  addedByUser?: boolean;
  notes?: string;
  notesTa?: string;
  waterType?: 'cold_pot' | 'purified_tap' | 'temple_tank' | 'metro_water';
}

export type WorkerRole = 
  | 'delivery' // Swiggy/Zomato/Dunzo/Zepto/Amazon
  | 'auto_tempo' // Auto/Tempo drivers
  | 'construction' // Daily wage construction
  | 'sanitation' // Sweeper/Waste collector
  | 'vendor' // Tea, tender coconut, flower vendor
  | 'other';

export interface WorkerProfile {
  role: WorkerRole;
  city: 'chennai' | 'madurai' | 'coimbatore' | 'trichy';
  typicalShiftHours: string;
  anonymousSharingOptIn: boolean;
  soundAlertsEnabled: boolean;
  voiceAlertsEnabled: boolean;
  lowDataMode: boolean;
}

export interface WeatherData {
  city: string;
  cityTa: string;
  lat: number;
  lon: number;
  tempC: number;
  humidity: number;
  heatIndexC: number;
  feelsLikeC: number;
  riskLevel: RiskLevel;
  uvIndex: number;
  windKmh: number;
  summaryEn: string;
  summaryTa: string;
  recordedAt: string;
}

export interface HeatLogEntry {
  id: string;
  timestamp: string;
  lat: number; // rounded to 4 decimals (~11m approx for local calculation)
  lon: number;
  gridId: string; // e.g. "CHN_13.08_80.27"
  heatIndex: number;
  tempC: number;
  humidity: number;
  riskLevel: RiskLevel;
  nearbyToiletsCount: number;
  nearbyWaterCount: number;
  nearbyShadeCount: number;
  workerAction?: 'water_logged' | 'break_logged' | 'skipped' | 'none';
  synced: boolean;
}

export interface ReminderConfig {
  hydrationEnabled: boolean;
  breakEnabled: boolean;
  workIntensity: 'light' | 'normal' | 'hard';
  hydrationIntervalMinutes: number; // e.g. 30 in orange/red
  breakIntervalMinutes: number; // e.g. 60
  lastHydrationAt?: string;
  lastBreakAt?: string;
}

export interface ReminderLogItem {
  id: string;
  timestamp: string;
  type: 'hydration' | 'break';
  action: 'completed' | 'skipped';
  heatRiskAtTime: RiskLevel;
}

export interface HotspotArea {
  id: string;
  name: string;
  nameTa: string;
  city: string;
  cityTa: string;
  riskRating: 'critical' | 'high' | 'moderate';
  reportedExposures: number;
  avgHeatIndex: number;
  toiletDeficitPercent: number; // e.g. 84% time with 0 toilets
  waterDeficitPercent: number;
  workerCountEstimate: number;
  lat: number;
  lon: number;
  urgencyNote: string;
  urgencyNoteTa: string;
}
