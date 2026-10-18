import React from 'react';
import { ProjectConfigType } from '../data/mockProjects';
import { formatLakhCroreValue } from '../utils/realEstateCalculators';
import { Rupee } from './Rupee';
import { SlidersHorizontal, AlertTriangle, CheckCircle2 } from 'lucide-react';

export interface BuyerPreferences {
  configuration: ProjectConfigType;
  locations: string[];
  minBudget: number; // INR
  maxBudget: number; // INR
  nearMetroOnly: boolean;
  possessionTimeline: 'All' | 'Ready to Move' | 'Within 1 Yr' | '1–3 Yrs';
  purpose: 'Self-Use' | 'Investment';
  homeLoanRequired: boolean;
}

interface PreferenceBarProps {
  preferences: BuyerPreferences;
  onEditPreferences: () => void;
  simulateZeroExactMatch: boolean;
  onToggleSimulateZeroMatch: () => void;
}

export const PreferenceBar: React.FC<PreferenceBarProps> = ({
  preferences,
  onEditPreferences,
  simulateZeroExactMatch,
  onToggleSimulateZeroMatch,
}) => {
  return (
    <div className="sticky top-16 z-30 h-auto min-h-[52px] bg-white border-b border-slate-200 shadow-xs px-4 sm:px-6 py-2 sm:py-0 flex flex-wrap items-center justify-between gap-2">
      {/* Left: Active Live Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
          Active Criteria:
        </span>

        {/* Selected Config Pill */}
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
          Config: <strong>{preferences.configuration}</strong>
        </span>

        {/* Locations Pill */}
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200 whitespace-nowrap">
          Location:{' '}
          <span className="font-semibold">
            {preferences.locations.length === 0
              ? 'All Micro-Markets'
              : preferences.locations.join(', ')}
          </span>
        </span>

        {/* Budget Range Pill */}
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-slate-100 text-slate-800 border border-slate-200 whitespace-nowrap">
          Budget:{' '}
          <span className="font-semibold flex items-center gap-0.5">
            <Rupee className="w-3 h-3 text-slate-700" />
            <span>{formatLakhCroreValue(preferences.minBudget)}</span>
            <span>–</span>
            <Rupee className="w-3 h-3 text-slate-700" />
            <span>{formatLakhCroreValue(preferences.maxBudget)}</span>
          </span>
        </span>

        {/* Metro Radius Pill */}
        {preferences.nearMetroOnly && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
            Metro &lt;3km
          </span>
        )}

        {/* Possession & Purpose */}
        <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200 whitespace-nowrap">
          {preferences.possessionTimeline} • {preferences.purpose}
        </span>
      </div>

      {/* Right: Actions & Demo Toggle for FR-6.5 */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSimulateZeroMatch}
          className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            simulateZeroExactMatch
              ? 'bg-amber-100 text-amber-900 border-amber-400 font-semibold shadow-xs'
              : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
          }`}
          title="Click to test requirement FR-6.5: Zero blank states, automatically falls back to closest verified options with amber warning banner"
        >
          {simulateZeroExactMatch ? (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
          )}
          <span>Simulate 0 Exact Match (FR-6.5)</span>
        </button>

        <button
          onClick={onEditPreferences}
          className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 px-2 py-1"
        >
          <SlidersHorizontal className="w-3 h-3" />
          Edit My Preferences
        </button>
      </div>
    </div>
  );
};
