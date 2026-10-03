import React, { useState } from 'react';
import { Language, WorkerProfile, WorkerRole } from '../types';
import { getT } from '../data/translations';
import { Shield, Check, Globe, ChevronRight, Droplet, Trees, MapPin } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (profile: WorkerProfile, lang: Language) => void;
  initialLang: Language;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  initialLang,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [lang, setLang] = useState<Language>(initialLang || 'ta');
  const [role, setRole] = useState<WorkerRole>('delivery');
  const [city, setCity] = useState<'chennai' | 'madurai' | 'coimbatore' | 'trichy'>('chennai');
  const [sharingOptIn, setSharingOptIn] = useState(true);

  const t = getT(lang);

  const handleFinish = () => {
    onComplete(
      {
        role,
        city,
        typicalShiftHours: '10:00 - 22:00',
        anonymousSharingOptIn: sharingOptIn,
        soundAlertsEnabled: true,
        voiceAlertsEnabled: false,
        lowDataMode: false,
      },
      lang
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-100">
          <div className="flex items-center gap-1.5">
            <span className="w-6 h-6 rounded-full bg-orange-600 text-white font-bold text-xs flex items-center justify-center">
              {step}
            </span>
            <span className="text-xs font-semibold text-stone-500">Step {step} of 3</span>
          </div>

          <div className="flex gap-1">
            <button
              onClick={() => setLang('ta')}
              className={`px-2 py-1 text-xs font-bold rounded-md ${
                lang === 'ta' ? 'bg-orange-600 text-white' : 'text-stone-600 bg-stone-100'
              }`}
            >
              தமிழ்
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-1 text-xs font-bold rounded-md ${
                lang === 'en' ? 'bg-orange-600 text-white' : 'text-stone-600 bg-stone-100'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Step 1: Welcome & Mission */}
        {step === 1 && (
          <div>
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-2xl font-black mb-3">
              ☀️
            </div>
            <h2 className="text-lg sm:text-xl font-black text-stone-900 tracking-tight">
              {t.welcomeTitle}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1.5 leading-relaxed">
              {t.welcomeSubtitle}
            </p>

            <div className="space-y-2.5 mt-5">
              <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-lg">🔥</span>
                <div className="text-xs">
                  <strong className="block text-stone-900">Real-Time Heat Alerts:</strong>
                  <span className="text-stone-500">Know when outdoor heat reaches dangerous thresholds.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-lg">🚻</span>
                <div className="text-xs">
                  <strong className="block text-stone-900">Find Water, Toilets & Shade:</strong>
                  <span className="text-stone-500">Locate free water pots, clean restrooms, and shaded benches nearby.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-lg">✊</span>
                <div className="text-xs">
                  <strong className="block text-stone-900">Collective Worker Evidence:</strong>
                  <span className="text-stone-500">Proves to government and platforms that workers need facilities.</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="mt-6 w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors min-h-[44px]"
            >
              <span>Continue / தொடர்க</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Worker Profile & Operating City */}
        {step === 2 && (
          <div>
            <h2 className="text-lg font-bold text-stone-900 tracking-tight">
              {t.selectRole}
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Helps customize hydration intervals and heat action recommendations.
            </p>

            <div className="space-y-2 mt-4 max-h-56 overflow-y-auto pr-1">
              {[
                { id: 'delivery' as const, label: t.roleDelivery, icon: '🛵' },
                { id: 'auto_tempo' as const, label: t.roleAuto, icon: '🛺' },
                { id: 'vendor' as const, label: t.roleVendor, icon: '🛒' },
                { id: 'sanitation' as const, label: t.roleSanitation, icon: '🧹' },
                { id: 'construction' as const, label: t.roleConstruction, icon: '🧱' },
                { id: 'other' as const, label: t.roleOther, icon: '👷' },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs flex items-center justify-between transition-colors min-h-[44px] ${
                    role === r.id
                      ? 'border-orange-500 bg-orange-50 text-stone-900 font-bold'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-lg">{r.icon}</span>
                    <span>{r.label}</span>
                  </span>
                  {role === r.id && <Check className="w-4 h-4 text-orange-600" />}
                </button>
              ))}
            </div>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t.selectCity}
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value as 'chennai' | 'madurai' | 'coimbatore' | 'trichy')}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none font-semibold text-stone-800"
              >
                <option value="chennai">Chennai (சென்னை)</option>
                <option value="madurai">Madurai (மதுரை)</option>
                <option value="coimbatore">Coimbatore (கோயம்புத்தூர்)</option>
                <option value="trichy">Tiruchirappalli (திருச்சிராப்பள்ளி)</option>
              </select>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setStep(1)}
                className="py-2.5 px-4 text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors min-h-[44px]"
              >
                <span>Next / அடுத்தது</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Privacy & Anonymous Sharing */}
        {step === 3 && (
          <div>
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center mb-3">
              <Shield className="w-5 h-5" />
            </div>

            <h2 className="text-lg font-bold text-stone-900 tracking-tight">
              Anonymous Data Sharing
            </h2>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Help gig worker unions and researchers demand toilets, drinking water, and rest shelters.
            </p>

            <div className="mt-4 p-4 rounded-xl border border-stone-200 bg-stone-50 flex items-start justify-between gap-3">
              <div>
                <div className="font-bold text-xs text-stone-900">
                  {sharingOptIn ? 'Yes, share my data anonymously' : 'Keep data only on my phone'}
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  Coordinates are blurred to 300m. No phone numbers, customer names, or delivery addresses are ever transmitted.
                </div>
              </div>

              <input
                type="checkbox"
                checked={sharingOptIn}
                onChange={(e) => setSharingOptIn(e.target.checked)}
                className="w-5 h-5 accent-orange-600 cursor-pointer mt-0.5"
              />
            </div>

            <div className="mt-4 p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-[11px] text-amber-900 leading-relaxed">
              <strong>Privacy Commitment: </strong> {t.privacyPromise}
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setStep(2)}
                className="py-2.5 px-4 text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                Back
              </button>
              <button
                onClick={handleFinish}
                className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors min-h-[44px]"
              >
                <span>{t.getStarted}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
