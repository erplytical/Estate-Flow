import React, { useState } from 'react';
import { ProjectConfigType } from '../data/mockProjects';
import { BuyerPreferences } from './PreferenceBar';
import { formatLakhCroreValue } from '../utils/realEstateCalculators';
import { Rupee } from './Rupee';
import {
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Train,
  Check,
  X,
  Sparkles,
} from 'lucide-react';

interface IntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPreferences: BuyerPreferences;
  onApplyPreferences: (prefs: BuyerPreferences) => void;
}

const CONFIG_OPTIONS: Array<{ type: ProjectConfigType; label: string; desc: string }> = [
  { type: '1 BHK', label: '1 BHK Compact', desc: '480–550 sq.ft. • Entry starter' },
  { type: '2 BHK', label: '2 BHK Standard', desc: '720–850 sq.ft. • Most popular' },
  { type: '3 BHK', label: '3 BHK Premium', desc: '1,050–1,350 sq.ft. • Family living' },
  { type: '4 BHK', label: '4 BHK Luxury', desc: '1,700–3,200 sq.ft. • Penthouses' },
  { type: 'Villa', label: 'Signature Villa', desc: '3,500+ sq.ft. • Private land' },
  { type: 'Plot', label: 'RERA NA Plot', desc: 'Gated community layout' },
  { type: 'Commercial', label: 'High Street Retail', desc: 'Assured rental yield' },
];

const MICRO_MARKETS = [
  { name: 'Baner', zone: 'West Pune • Expressway & Metro' },
  { name: 'Wakad', zone: 'West Pune • Tech Corridor' },
  { name: 'Hinjewadi', zone: 'West Pune • IT Park SEZ' },
  { name: 'Kharadi', zone: 'East Pune • World Trade Center' },
  { name: 'Koregaon Park', zone: 'Central Pune • Ultra Heritage' },
  { name: 'Balewadi', zone: 'West Pune • High Street Hub' },
];

export const IntakeModal: React.FC<IntakeModalProps> = ({
  isOpen,
  onClose,
  currentPreferences,
  onApplyPreferences,
}) => {
  const [config, setConfig] = useState<ProjectConfigType>(currentPreferences.configuration);
  const [selectedLocations, setSelectedLocations] = useState<string[]>(
    currentPreferences.locations.length > 0 ? currentPreferences.locations : ['Baner', 'Wakad']
  );
  const [minBudget, setMinBudget] = useState<number>(currentPreferences.minBudget);
  const [maxBudget, setMaxBudget] = useState<number>(currentPreferences.maxBudget);
  const [nearMetro, setNearMetro] = useState<boolean>(currentPreferences.nearMetroOnly);
  const [possession, setPossession] = useState<BuyerPreferences['possessionTimeline']>(
    currentPreferences.possessionTimeline
  );
  const [purpose, setPurpose] = useState<BuyerPreferences['purpose']>(
    currentPreferences.purpose
  );
  const [homeLoan, setHomeLoan] = useState<boolean>(currentPreferences.homeLoanRequired);
  const [accordionOpen, setAccordionOpen] = useState<boolean>(false);

  if (!isOpen) return null;

  const toggleLocation = (locName: string) => {
    if (selectedLocations.includes(locName)) {
      if (selectedLocations.length > 1) {
        setSelectedLocations(selectedLocations.filter((l) => l !== locName));
      }
    } else {
      setSelectedLocations([...selectedLocations, locName]);
    }
  };

  const handleSave = () => {
    onApplyPreferences({
      configuration: config,
      locations: selectedLocations,
      minBudget,
      maxBudget,
      nearMetroOnly: nearMetro,
      possessionTimeline: possession,
      purpose,
      homeLoanRequired: homeLoan,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-start justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                FR-6.1 MANDATORY INTAKE
              </span>
              <span className="text-xs text-slate-400">Step 1 of 1 Pre-Qualification</span>
            </div>
            <h2 className="text-xl font-bold mt-1 text-white">
              Buyer Criteria & Budget Qualification
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Every property card dynamically maps exact unit pricing, statutory taxes, and TCO to your selections.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close intake dialog"
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: 4 Steps */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Step 1: Configuration Selector Grid (Mandatory) */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-mono">
                  1
                </span>
                Target Configuration (Mandatory)
              </label>
              <span className="text-xs font-mono text-blue-600 font-medium">
                Active: {config}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CONFIG_OPTIONS.map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setConfig(item.type)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    config === item.type
                      ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500/20 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs sm:text-sm text-slate-900">
                      {item.type}
                    </span>
                    {config === item.type && (
                      <Check className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                    {item.desc}
                  </p>
                </button>
              ))}
            </div>
          </section>

          {/* Step 2: City & Micro-Market Multi-Select Chips (Mandatory) */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-mono">
                  2
                </span>
                Target Pune Micro-Markets (Select 1 or more)
              </label>
              <span className="text-xs text-slate-500">
                {selectedLocations.length} selected
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {MICRO_MARKETS.map((m) => {
                const isSelected = selectedLocations.includes(m.name);
                return (
                  <button
                    key={m.name}
                    type="button"
                    onClick={() => toggleLocation(m.name)}
                    className={`p-2 rounded-lg border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">{m.name}</span>
                      {isSelected ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full border border-slate-300" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal truncate mt-0.5">
                      {m.zone}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Landmark Radius Toggle */}
            <div className="mt-3 flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2">
                <Train className="w-4 h-4 text-emerald-600" />
                <div>
                  <div className="text-xs font-semibold text-slate-900">
                    High Transit Priority (Within 3 km of Pune Metro)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Filters projects adjacent to Line 3 Hinjewadi-Shivajinagar Metro corridor
                  </div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={nearMetro}
                  onChange={(e) => setNearMetro(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </section>

          {/* Step 3: Dual-range Budget Slider (Mandatory) */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-mono">
                  3
                </span>
                Target Budget Range (<Rupee className="w-3.5 h-3.5 text-slate-700" />40 L to <Rupee className="w-3.5 h-3.5 text-slate-700" />5.00 Cr)
              </label>
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 flex items-center gap-0.5">
                <Rupee className="w-3 h-3 text-blue-700" />
                <span>{formatLakhCroreValue(minBudget)}</span>
                <span>–</span>
                <Rupee className="w-3 h-3 text-blue-700" />
                <span>{formatLakhCroreValue(maxBudget)}</span>
              </span>
            </div>

            <div className="space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Minimum Budget:</span>
                  <span className="font-mono font-semibold flex items-center gap-0.5">
                    <Rupee className="w-3 h-3 text-slate-600" />
                    <span>{formatLakhCroreValue(minBudget)}</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="4000000"
                  max="30000000"
                  step="500000"
                  value={minBudget}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val < maxBudget) setMinBudget(val);
                  }}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Maximum Budget:</span>
                  <span className="font-mono font-semibold flex items-center gap-0.5">
                    <Rupee className="w-3 h-3 text-slate-600" />
                    <span>{formatLakhCroreValue(maxBudget)}</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="5000000"
                  max="50000000"
                  step="1000000"
                  value={maxBudget}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val > minBudget) setMaxBudget(val);
                  }}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[11px] text-slate-500 mr-1 self-center">Quick Presets:</span>
                {[
                  { label: '60L–1.0Cr', min: 6000000, max: 10000000 },
                  { label: '80L–1.5Cr', min: 8000000, max: 15000000 },
                  { label: '1.5Cr–3.0Cr', min: 15000000, max: 30000000 },
                  { label: '3.0Cr+', min: 25000000, max: 50000000 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setMinBudget(preset.min);
                      setMaxBudget(preset.max);
                    }}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 flex items-center gap-0.5"
                  >
                    <Rupee className="w-2.5 h-2.5 text-slate-500" />
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Step 4: Optional Accordion - Refine Matching */}
          <section className="border border-slate-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setAccordionOpen(!accordionOpen)}
              className="w-full px-4 py-3 bg-slate-50 flex items-center justify-between text-left text-xs font-semibold text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Step 4: Refine Matching (Optional - Skip if preferred)</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-500 transition-transform ${
                  accordionOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {accordionOpen && (
              <div className="p-4 space-y-4 bg-white border-t border-slate-200">
                {/* Possession Timeline */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Possession Timeline
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['All', 'Ready to Move', 'Within 1 Yr', '1–3 Yrs'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setPossession(t)}
                        className={`py-1.5 px-2 text-xs rounded-lg border text-center font-medium ${
                          possession === t
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Purpose & Loan Requirement */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                      Purchase Purpose
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['Self-Use', 'Investment'] as const).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPurpose(p)}
                          className={`py-1.5 px-2 text-xs rounded-lg border text-center font-medium ${
                            purpose === p
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                      Bank Loan Required
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Yes (80% LTV)', val: true },
                        { label: 'No (Own Funds)', val: false },
                      ].map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => setHomeLoan(item.val)}
                          className={`py-1.5 px-2 text-xs rounded-lg border text-center font-medium ${
                            homeLoan === item.val
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>MahaRERA Algorithm Enforced</span>
          </div>

          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            <span>Show Pre-Qualified Properties</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
