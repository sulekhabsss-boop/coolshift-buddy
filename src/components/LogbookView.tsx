import React, { useState } from 'react';
import { HeatLogEntry, Language, WorkerProfile } from '../types';
import { getT } from '../data/translations';
import { calculateShiftAnalytics, generateAdvocacyReportText } from '../utils/logbookStorage';
import { AlertCircle, FileText, Check, Plus, Trash2, Clock, MapPin, Droplets, ShieldAlert, Share2 } from 'lucide-react';

interface LogbookViewProps {
  logs: HeatLogEntry[];
  profile: WorkerProfile;
  lang: Language;
  onSimulateCheckpoint: () => void;
  onClearLogs: () => void;
}

export const LogbookView: React.FC<LogbookViewProps> = ({
  logs,
  profile,
  lang,
  onSimulateCheckpoint,
  onClearLogs,
}) => {
  const t = getT(lang);
  const stats = calculateShiftAnalytics(logs);
  const [copied, setCopied] = useState(false);
  const [viewTab, setViewTab] = useState<'today' | 'timeline'>('today');

  const handleExportReport = () => {
    const reportText = generateAdvocacyReportText(profile, logs, lang);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(reportText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const totalPoints = stats.totalCheckpoints || 1;
  const greenPct = Math.round((stats.greenCount / totalPoints) * 100);
  const yellowPct = Math.round((stats.yellowCount / totalPoints) * 100);
  const orangePct = Math.round((stats.orangeCount / totalPoints) * 100);
  const redPct = Math.round((stats.redCount / totalPoints) * 100);

  return (
    <div className="flex flex-col gap-5">
      {/* Header card with export evidence CTA */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-stone-900 tracking-tight">{t.logbookTitle}</h2>
            <p className="text-xs text-stone-500 mt-0.5">{t.logbookSubtitle}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onSimulateCheckpoint}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl transition-colors shadow-xs"
              title="Add simulated checkpoint"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Simulate Shift Point</span>
            </button>

            <button
              onClick={handleExportReport}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-xs transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
              <span>{copied ? t.exportSuccess : t.exportReport}</span>
            </button>
          </div>
        </div>

        {/* Primary Metric: Hours in Extreme Heat with Zero Sanitation Access */}
        <div className="mt-5 p-4 rounded-xl bg-red-50 border border-red-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-100 text-red-700 rounded-lg shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-red-900 uppercase tracking-wider">
                Vulnerability Indicator (SPC Survey Baseline)
              </div>
              <div className="text-sm font-semibold text-red-950 mt-0.5">
                {stats.hoursNoToiletInHeat} {t.hours} in High Heat with Zero Nearby Toilets
              </div>
              <p className="text-xs text-red-800 mt-1">
                {stats.percentNoToiletInHeat}% of your dangerous heat shifts lacked a sanitary restroom within 450m.
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-2xl font-extrabold font-mono text-red-700 tabular-nums">
              {stats.hoursOrangeRed} {t.hours}
            </div>
            <div className="text-[11px] text-red-600">Peak Heat Total</div>
          </div>
        </div>

        {/* Exposure Risk Band Stacked Bar */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs text-stone-600 mb-1.5 font-medium">
            <span>Exposure Distribution</span>
            <span>{stats.totalCheckpoints} checkpoints logged</span>
          </div>

          <div className="h-4 w-full bg-stone-100 rounded-full overflow-hidden flex shadow-inner">
            <div
              style={{ width: `${greenPct}%` }}
              className="bg-emerald-500 h-full transition-all"
              title={`Green: ${greenPct}%`}
            />
            <div
              style={{ width: `${yellowPct}%` }}
              className="bg-amber-400 h-full transition-all"
              title={`Yellow: ${yellowPct}%`}
            />
            <div
              style={{ width: `${orangePct}%` }}
              className="bg-orange-500 h-full transition-all"
              title={`Orange: ${orangePct}%`}
            />
            <div
              style={{ width: `${redPct}%` }}
              className="bg-red-600 h-full transition-all"
              title={`Red: ${redPct}%`}
            />
          </div>

          {/* Unboxed legend with bullet separators */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600 mt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Safe ({greenPct}%)</span>
            </div>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>Caution ({yellowPct}%)</span>
            </div>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              <span>Very Hot ({orangePct}%)</span>
            </div>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
              <span>Extreme Danger ({redPct}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Checkpoint Timeline List */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-sm text-stone-900">{t.timelineTitle}</h3>

          <button
            onClick={onClearLogs}
            className="text-stone-400 hover:text-red-600 p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
            title={t.deleteLogbook}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>

        {logs.length === 0 ? (
          <div className="py-8 text-center text-xs text-stone-500">
            No logs recorded yet. Tap "Simulate Shift Point" to start.
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {logs.slice(0, 15).map((log) => {
              const time = new Date(log.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div key={log.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-3 h-3 rounded-full shrink-0 ${
                        log.riskLevel === 'red'
                          ? 'bg-red-600 ring-2 ring-red-200'
                          : log.riskLevel === 'orange'
                          ? 'bg-orange-500 ring-2 ring-orange-200'
                          : log.riskLevel === 'yellow'
                          ? 'bg-amber-400 ring-2 ring-amber-200'
                          : 'bg-emerald-500 ring-2 ring-emerald-200'
                      }`}
                    />

                    <div>
                      <div className="font-semibold text-stone-900 flex items-center gap-2">
                        <span className="font-mono">{time}</span>
                        <span aria-hidden="true" className="text-stone-300">·</span>
                        <span className="font-mono tabular-nums">{log.heatIndex}°C Feels Like</span>
                        {log.workerAction === 'water_logged' && (
                          <span className="text-[10px] text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded-md font-medium">
                            💧 Water Logged
                          </span>
                        )}
                        {log.workerAction === 'break_logged' && (
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md font-medium">
                            🌳 Rest Taken
                          </span>
                        )}
                      </div>

                      <div className="text-stone-500 flex items-center gap-2 text-[11px] mt-0.5">
                        <span>Near: {log.nearbyToiletsCount} Toilets</span>
                        <span aria-hidden="true">·</span>
                        <span>{log.nearbyWaterCount} Water Taps</span>
                        <span aria-hidden="true">·</span>
                        <span>{log.nearbyShadeCount} Shaded Spots</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono text-stone-400 text-[10px]">
                      {log.gridId}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
