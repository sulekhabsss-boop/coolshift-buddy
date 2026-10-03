import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Facility, FacilityType, Language } from '../types';
import { getT } from '../data/translations';
import { calculateDistanceMeters } from '../utils/heatIndex';
import { Droplet, HelpCircle, Navigation, Plus, Star, Trees, CheckCircle2, Search, X } from 'lucide-react';

interface FacilityMapProps {
  facilities: Facility[];
  userLat: number;
  userLon: number;
  lang: Language;
  onAddFacility: (facility: Omit<Facility, 'id' | 'verified'>) => void;
  selectedCity: 'chennai' | 'madurai' | 'coimbatore' | 'trichy';
}

export const FacilityMap: React.FC<FacilityMapProps> = ({
  facilities,
  userLat,
  userLon,
  lang,
  onAddFacility,
  selectedCity,
}) => {
  const t = getT(lang);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [activeFilter, setActiveFilter] = useState<'all' | FacilityType>('all');
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form state for adding new spot
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<FacilityType>('water');
  const [newIsFree, setNewIsFree] = useState(true);
  const [newRating, setNewRating] = useState(4);
  const [newNotes, setNewNotes] = useState('');

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [userLat, userLon],
        zoom: 14,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // OpenStreetMap Tiles (Fast, hermetic, zero API key requirement)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Worker live location pulsing marker
      const workerIcon = L.divIcon({
        className: 'custom-worker-pin',
        html: `
          <div class="relative flex items-center justify-center w-8 h-8">
            <div class="absolute w-8 h-8 bg-orange-500/40 rounded-full worker-pulse-marker"></div>
            <div class="w-4 h-4 bg-orange-600 border-2 border-white rounded-full shadow-md z-10"></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      L.marker([userLat, userLon], { icon: workerIcon })
        .addTo(map)
        .bindTooltip(lang === 'ta' ? 'உங்கள் இடம் (Your Location)' : 'Your GPS Location', {
          permanent: false,
          direction: 'top',
        });

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([userLat, userLon], 14);
    }

    return () => {
      // Clean up on component unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [userLat, userLon]);

  // Update Markers when facilities or activeFilter changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    const filtered = facilities.filter((f) => {
      const matchesFilter = activeFilter === 'all' || f.type === activeFilter;
      const matchesSearch = searchQuery === '' || 
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.nameTa.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    filtered.forEach((fac) => {
      let iconColor = '#0284c7'; // blue water
      let iconBg = 'bg-sky-500';
      let iconChar = '💧';

      if (fac.type === 'toilet') {
        iconColor = '#6366f1'; // indigo
        iconBg = 'bg-indigo-600';
        iconChar = '🚻';
      } else if (fac.type === 'shade') {
        iconColor = '#10b981'; // emerald
        iconBg = 'bg-emerald-600';
        iconChar = '🌳';
      }

      const customIcon = L.divIcon({
        className: 'facility-marker-pin',
        html: `
          <div style="background-color: ${iconColor}; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 2.5px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.25); cursor: pointer;">
            ${iconChar}
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const marker = L.marker([fac.lat, fac.lon], { icon: customIcon });

      marker.on('click', () => {
        setSelectedFacility(fac);
        mapInstanceRef.current?.panTo([fac.lat, fac.lon]);
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [facilities, activeFilter, searchQuery]);

  // Handle adding custom place
  const handleSubmitNewPlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    // Place new facility slightly offset from user's current GPS so it shows right near them
    const jitterLat = userLat + (Math.random() - 0.5) * 0.003;
    const jitterLon = userLon + (Math.random() - 0.5) * 0.003;

    onAddFacility({
      name: newName,
      nameTa: newName,
      type: newType,
      lat: jitterLat,
      lon: jitterLon,
      isFree: newIsFree,
      cleanlinessRating: newRating,
      operatingHours: 'Daytime / Open',
      address: 'Reported by local gig worker',
      addressTa: 'உள்ளூர் தொழிலாளரால் பதிவு செய்யப்பட்டது',
      city: selectedCity,
      notes: newNotes || 'Added by an outdoor worker via CoolShift Buddy',
      notesTa: newNotes || 'கூல்ஷிப்ட் செயலி மூலம் சேர்க்கப்பட்டது',
      addedByUser: true,
    });

    setIsAddModalOpen(false);
    setNewName('');
    setNewNotes('');
  };

  const calculateDist = (f: Facility) => {
    const meters = calculateDistanceMeters(userLat, userLon, f.lat, f.lon);
    if (meters < 1000) return `${meters} ${t.meters}`;
    return `${(meters / 1000).toFixed(1)} km`;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] sm:h-[680px] bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200 relative">
      {/* Top Filter & Search Controls */}
      <div className="p-3 bg-white border-b border-stone-200 z-10 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={lang === 'ta' ? 'இடங்களைத் தேடுக (எ.கா. கோயம்பேடு)...' : 'Search facilities (e.g. Koyambedu)...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-100 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-semibold whitespace-nowrap shadow-xs min-h-[34px]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.addPlaceBtn}</span>
          </button>
        </div>

        {/* Filter Tabs (Interactive filter buttons) */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              activeFilter === 'all'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:text-stone-900'
            }`}
          >
            {t.filterAll}
          </button>

          <button
            onClick={() => setActiveFilter('water')}
            className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              activeFilter === 'water'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>💧</span>
            <span>{t.filterWater}</span>
          </button>

          <button
            onClick={() => setActiveFilter('toilet')}
            className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              activeFilter === 'toilet'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>🚻</span>
            <span>{t.filterToilet}</span>
          </button>

          <button
            onClick={() => setActiveFilter('shade')}
            className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              activeFilter === 'shade'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>🌳</span>
            <span>{t.filterShade}</span>
          </button>
        </div>
      </div>

      {/* Leaflet Map Canvas */}
      <div className="flex-1 relative w-full h-full min-h-[300px]">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Selected Facility Details Card (Floating Bottom Card) */}
        {selectedFacility && (
          <div className="absolute bottom-3 left-3 right-3 sm:left-4 sm:right-auto sm:max-w-md bg-white rounded-2xl p-4 shadow-xl border border-stone-200 z-20">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                    selectedFacility.type === 'water'
                      ? 'bg-sky-100 text-sky-700'
                      : selectedFacility.type === 'toilet'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {selectedFacility.type === 'water' ? '💧' : selectedFacility.type === 'toilet' ? '🚻' : '🌳'}
                </div>

                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-bold text-sm text-stone-900 leading-tight">
                      {lang === 'ta' ? selectedFacility.nameTa : selectedFacility.name}
                    </h3>
                    {selectedFacility.verified && (
                      <span title="Verified Safe Facility" className="inline-flex">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">
                    {lang === 'ta' ? selectedFacility.addressTa : selectedFacility.address}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedFacility(null)}
                className="text-stone-400 hover:text-stone-700 p-1 -mr-1 -mt-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Metadata line (Unboxed text with bullet separators) */}
            <div className="flex items-center gap-2 text-xs text-stone-600 mt-2.5 pt-2 border-t border-stone-100">
              <span className="font-semibold text-stone-900">{calculateDist(selectedFacility)}</span>
              <span aria-hidden="true">·</span>
              <span className={selectedFacility.isFree ? 'text-emerald-700 font-medium' : 'text-stone-700'}>
                {selectedFacility.isFree ? t.free : t.paid}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="font-mono tabular-nums">{selectedFacility.cleanlinessRating}.0</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>{selectedFacility.operatingHours}</span>
            </div>

            {selectedFacility.notes && (
              <p className="text-xs text-stone-600 mt-2 bg-stone-50 p-2 rounded-lg leading-relaxed">
                {lang === 'ta' && selectedFacility.notesTa ? selectedFacility.notesTa : selectedFacility.notes}
              </p>
            )}

            {/* Direct Google Maps Deep Link */}
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${selectedFacility.lat},${selectedFacility.lon}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 w-full py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{t.directions}</span>
            </a>
          </div>
        )}
      </div>

      {/* Add Place Crowdsource Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h2 className="font-bold text-base text-stone-900">{t.addPlaceTitle}</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewPlace} className="mt-4 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t.placeType}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewType('water')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border flex flex-col items-center gap-1 transition-colors ${
                      newType === 'water'
                        ? 'border-sky-500 bg-sky-50 text-sky-800'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <span className="text-base">💧</span>
                    <span>{t.filterWater}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewType('toilet')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border flex flex-col items-center gap-1 transition-colors ${
                      newType === 'toilet'
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-800'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <span className="text-base">🚻</span>
                    <span>{t.filterToilet}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewType('shade')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border flex flex-col items-center gap-1 transition-colors ${
                      newType === 'shade'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <span className="text-base">🌳</span>
                    <span>{t.filterShade}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t.placeName}
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'ta' ? 'எ.கா. பார்க் கேட் அருகில் குடிநீர் பந்தல்' : 'e.g. Free water tap outside bus depot'}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t.isFreeOrPaid}
                  </label>
                  <select
                    value={newIsFree ? 'free' : 'paid'}
                    onChange={(e) => setNewIsFree(e.target.value === 'free')}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none"
                  >
                    <option value="free">{t.isFreeLabel}</option>
                    <option value="paid">{t.isPaidLabel}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t.cleanRating}
                  </label>
                  <select
                    value={newRating}
                    onChange={(e) => setNewRating(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none font-mono"
                  >
                    <option value="5">★★★★★ (Very Clean)</option>
                    <option value="4">★★★★☆ (Clean)</option>
                    <option value="3">★★★☆☆ (Usable)</option>
                    <option value="2">★★☆☆☆ (Fair)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Helpful Notes for Other Riders
                </label>
                <textarea
                  rows={2}
                  placeholder={lang === 'ta' ? 'குளிர்ந்த தண்ணீர் உள்ளதா? மொபைல் சார்ஜிங் வசதி உள்ளதா?' : 'Is water cold? Any bike parking spot?'}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-lg"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-xs"
                >
                  {t.submitPlace}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
