import React, { useState } from 'react';
import { ProjectData } from '../data/mockProjects';
import {
  checkDuplicateProject,
  DeduplicationCheckResult,
  ExistingProjectRef,
} from '../utils/realEstateCalculators';
import {
  FileCheck2,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  PlusCircle,
  Flag,
  Trash2,
} from 'lucide-react';

interface FlaggedListingItem {
  id: string;
  projectName: string;
  reraNumber: string;
  flagReason: string;
  reportedBy: string;
  hoursRemaining: number;
  status: 'In Review' | 'Resolved' | 'Merged';
}

interface SingleListingEngineProps {
  existingProjects: ProjectData[];
  onAddNewProject: (project: ProjectData) => void;
  flaggedListings: FlaggedListingItem[];
  onResolveFlag: (id: string, action: 'Dismiss' | 'Merge') => void;
}

export const SingleListingEngine: React.FC<SingleListingEngineProps> = ({
  existingProjects,
  onAddNewProject,
  flaggedListings,
  onResolveFlag,
}) => {
  const [reraInput, setReraInput] = useState<string>('P52100026772');
  const [nameInput, setNameInput] = useState<string>('VTP Sierra Panache');
  const [latInput, setLatInput] = useState<number>(18.5583);
  const [lngInput, setLngInput] = useState<number>(73.7749);
  const [checkResult, setCheckResult] = useState<DeduplicationCheckResult | null>(null);

  const existingRefs: ExistingProjectRef[] = existingProjects.map((p) => ({
    id: p.id,
    name: p.name,
    reraNumber: p.reraNumber,
    latitude: p.coordinates.lat,
    longitude: p.coordinates.lng,
    upi: p.upi,
  }));

  const handleRunCheck = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const result = checkDuplicateProject(
      reraInput,
      nameInput,
      latInput,
      lngInput,
      existingRefs
    );
    setCheckResult(result);
  };

  const loadPreset = (presetNumber: 1 | 2 | 3) => {
    if (presetNumber === 1) {
      // Preset 1: Exact Collision (FR-2.2)
      setReraInput('P52100026772');
      setNameInput('VTP Sierra Panache');
      setLatInput(18.5583);
      setLngInput(73.7749);
      const res = checkDuplicateProject('P52100026772', 'VTP Sierra Panache', 18.5583, 73.7749, existingRefs);
      setCheckResult(res);
    } else if (presetNumber === 2) {
      // Preset 2: Near Miss Typo / Same Address (FR-2.3)
      setReraInput('P52100088992');
      setNameInput('VTP Cierra Panache');
      setLatInput(18.5585);
      setLngInput(73.7751);
      const res = checkDuplicateProject('P52100088992', 'VTP Cierra Panache', 18.5585, 73.7751, existingRefs);
      setCheckResult(res);
    } else {
      // Preset 3: New Verified Project
      setReraInput('P52100067441');
      setNameInput('Godrej Meadows Phase 2');
      setLatInput(18.5712);
      setLngInput(73.7845);
      const res = checkDuplicateProject('P52100067441', 'Godrej Meadows Phase 2', 18.5712, 73.7845, existingRefs);
      setCheckResult(res);
    }
  };

  const handlePublishNew = () => {
    if (!checkResult || checkResult.status !== 'NEW_VERIFIED') return;
    const newProj: ProjectData = {
      id: `ef-pune-custom-${Date.now()}`,
      name: nameInput,
      developer: 'Godrej Properties (Verified A+)',
      reraNumber: reraInput,
      upi: checkResult.generatedUPI || 'EF-99AA-2026',
      location: 'Baner',
      subLocality: 'Mahalunge Baner Annexe',
      coordinates: { lat: latInput, lng: lngInput },
      stage: 'Under Construction',
      possessionDate: 'Dec 2027',
      possessionTimelineCategory: '1–3 Yrs',
      nearMetro: true,
      architecturalStyle: 'contemporary',
      overview: 'Newly published canonical project with zero duplicate listings.',
      configs: {
        '1 BHK': { available: true, basePrice: 5200000, carpetAreaSqFt: 480, expectedMonthlyRent: 20000, annualMaintenanceAndTax: 20000 },
        '2 BHK': { available: true, basePrice: 8500000, carpetAreaSqFt: 760, expectedMonthlyRent: 30000, annualMaintenanceAndTax: 32000 },
        '3 BHK': { available: true, basePrice: 12800000, carpetAreaSqFt: 1060, expectedMonthlyRent: 44000, annualMaintenanceAndTax: 46000 },
        '4 BHK': { available: false, basePrice: 0, carpetAreaSqFt: 0, expectedMonthlyRent: 0, annualMaintenanceAndTax: 0 },
        'Villa': { available: false, basePrice: 0, carpetAreaSqFt: 0, expectedMonthlyRent: 0, annualMaintenanceAndTax: 0 },
        'Plot': { available: false, basePrice: 0, carpetAreaSqFt: 0, expectedMonthlyRent: 0, annualMaintenanceAndTax: 0 },
        'Commercial': { available: false, basePrice: 0, carpetAreaSqFt: 0, expectedMonthlyRent: 0, annualMaintenanceAndTax: 0 },
      },
      livability: {
        compositeScore: 85,
        connectivity: 87,
        socialInfra: 84,
        environment: 84,
        aqi: 64,
        aqiStatus: 'Good',
        floodRisk: 'Low Risk Zone',
        transitTimes: {
          metro: '8 mins (Hinjewadi-Baner Link)',
          itHub: '12 mins',
          airport: '45 mins',
          expressway: '7 mins',
        },
        poi2km: { schools: 6, hospitals: 4, retail: 12, banks: 8 },
        poi5km: { schools: 18, hospitals: 12, retail: 32, banks: 24 },
      },
      valuation: {
        rrRatePerSqFt: 7500,
        developerQuotedPerSqFt: 11200,
        recentRegisteredAvgPerSqFt: 10800,
        trend5Yr: [
          { year: 2022, marketRate: 7800, rrRate: 6000, registrationVolume: 320 },
          { year: 2023, marketRate: 8600, rrRate: 6400, registrationVolume: 410 },
          { year: 2024, marketRate: 9500, rrRate: 6800, registrationVolume: 480 },
          { year: 2025, marketRate: 10400, rrRate: 7200, registrationVolume: 530 },
          { year: 2026, marketRate: 11200, rrRate: 7500, registrationVolume: 600 },
        ],
        trend10Yr: [
          { year: 2017, marketRate: 5100, rrRate: 4200, registrationVolume: 220 },
          { year: 2019, marketRate: 6000, rrRate: 4800, registrationVolume: 280 },
          { year: 2021, marketRate: 6900, rrRate: 5400, registrationVolume: 310 },
          { year: 2023, marketRate: 8600, rrRate: 6400, registrationVolume: 410 },
          { year: 2025, marketRate: 10400, rrRate: 7200, registrationVolume: 530 },
          { year: 2026, marketRate: 11200, rrRate: 7500, registrationVolume: 600 },
        ],
      },
      amenities: ['Clubhouse', 'Olympic Pool', 'Badminton Court', 'EV Charging'],
      constructionMilestones: [
        { stage: 'Piling Completed', progressPct: 100, targetDate: 'Q1 2024', completed: true },
        { stage: 'Superstructure 10/24 Floors', progressPct: 45, targetDate: 'Q3 2026', completed: false },
      ],
      overallProgress: 45,
      legalClearances: [
        { id: 'lc-g1', name: 'MahaRERA Registration', authority: 'MahaRERA', status: 'Approved', certificateNo: reraInput, date: '12 Jan 2024' },
      ],
      lastUpdated: '17 Oct 2026, 10:00 IST',
      dataSource: 'MahaRERA & IGR',
    };
    onAddNewProject(newProj);
    alert(`Success: "${nameInput}" published to live property list with UPI ${checkResult.generatedUPI}!`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      {/* Title Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                FR-2.1 TO FR-2.6 SPECIFICATION
              </span>
              <span className="text-xs text-slate-400">Single-Listing Guarantee Engine</span>
            </div>
            <h1 className="text-2xl font-bold mt-1 text-white">
              UPI Generation & Duplicate Collisions Simulator
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Strictly guarantees that each physical real estate development corresponds to exactly ONE canonical listing. Prevents spam, multiple agent duplicates, and phantom pricing.
            </p>
          </div>
          <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-xs font-mono space-y-1">
            <div className="text-slate-400">Active Canonical Database:</div>
            <div className="text-emerald-400 font-bold text-sm">
              {existingProjects.length} Verified Projects Registered
            </div>
          </div>
        </div>
      </div>

      {/* Preset Test Case Buttons */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
          One-Click Test Presets (Verify SRS Rules):
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Preset 1: Exact Collision */}
          <button
            type="button"
            onClick={() => loadPreset(1)}
            className="p-3 rounded-xl border border-red-200 bg-red-50/60 hover:bg-red-50 text-left transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-900 flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-red-600" />
                Preset 1: Exact Collision (FR-2.2)
              </span>
              <span className="text-[10px] font-mono bg-red-100 text-red-800 px-1.5 py-0.5 rounded">
                Blocked
              </span>
            </div>
            <p className="text-[11px] text-red-700 mt-1.5">
              Submits existing RERA (P52100026772). Triggers mandatory red error and blocks duplicate creation.
            </p>
          </button>

          {/* Preset 2: Fuzzy Near-Miss */}
          <button
            type="button"
            onClick={() => loadPreset(2)}
            className="p-3 rounded-xl border border-amber-300 bg-amber-50/70 hover:bg-amber-50 text-left transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Preset 2: Fuzzy Typo Match (FR-2.3)
              </span>
              <span className="text-[10px] font-mono bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded">
                24h Review
              </span>
            </div>
            <p className="text-[11px] text-amber-800 mt-1.5">
              "VTP Cierra Panache" (0.89 similarity score). Routes to manual senior review queue with 24h SLA.
            </p>
          </button>

          {/* Preset 3: New Verified Project */}
          <button
            type="button"
            onClick={() => loadPreset(3)}
            className="p-3 rounded-xl border border-emerald-300 bg-emerald-50/70 hover:bg-emerald-50 text-left transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Preset 3: New Project (FR-2.1)
              </span>
              <span className="text-[10px] font-mono bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded">
                Publishes
              </span>
            </div>
            <p className="text-[11px] text-emerald-800 mt-1.5">
              Unique RERA number & coordinates. Calculates persistent hash and publishes canonical card.
            </p>
          </button>
        </div>
      </div>

      {/* Simulator Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Parameters */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-blue-600" />
            Input Project Registration Parameters:
          </h3>

          <form onSubmit={handleRunCheck} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                State RERA Registration Number (FR-2.1)
              </label>
              <input
                type="text"
                value={reraInput}
                onChange={(e) => setReraInput(e.target.value)}
                placeholder="e.g. P52100026772"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm uppercase outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Project Marketing Name
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="e.g. VTP Sierra Panache"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Latitude (±0.0001 precision)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={latInput}
                  onChange={(e) => setLatInput(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Longitude (±0.0001 precision)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={lngInput}
                  onChange={(e) => setLngInput(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Execute Deduplication Hash Check</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Verification Engine Decision Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Engine Audit Decision & Status:
              </h3>
              <span className="text-[11px] font-mono text-slate-500">
                Deterministic Output
              </span>
            </div>

            {!checkResult ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <FileCheck2 className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-xs">
                  Click "Execute Deduplication Hash Check" or choose a preset above.
                </p>
              </div>
            ) : checkResult.status === 'EXACT_COLLISION' ? (
              <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#EF4444] text-[#B91C1C] space-y-3">
                <div className="flex items-center gap-2">
                  <AlertOctagon className="w-5 h-5 text-red-600" />
                  <span className="font-bold text-sm">
                    FR-2.2: Exact UPI Hash Collision — Creation Blocked
                  </span>
                </div>
                <p className="text-xs font-mono leading-relaxed">{checkResult.message}</p>
                <div className="bg-white/80 p-2.5 rounded border border-red-300 font-mono text-xs space-y-1">
                  <div>Existing UPI: <strong>{checkResult.generatedUPI}</strong></div>
                  <div>Resolution Action: Redirect buyer inquiries to single canonical listing.</div>
                </div>
              </div>
            ) : checkResult.status === 'NEAR_MISS_REVIEW' ? (
              <div className="p-4 rounded-xl bg-[#FFFBEB] border border-[#F59E0B] text-[#B45309] space-y-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span className="font-bold text-sm">
                    FR-2.3: Routed to Manual Review Queue (24h SLA)
                  </span>
                </div>
                <p className="text-xs leading-relaxed">{checkResult.message}</p>
                <div className="bg-white/90 p-2.5 rounded border border-amber-300 font-mono text-xs space-y-1">
                  <div>Similarity Score: <strong>{(checkResult.similarityScore! * 100).toFixed(0)}%</strong> (Threshold: &gt;= 85%)</div>
                  <div>SLA Timer: 23 hrs 48 mins remaining</div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#ECFDF5] border border-[#10B981] text-[#047857] space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold text-sm">
                    FR-2.1: Verification Passed — Canonical UPI Generated
                  </span>
                </div>
                <p className="text-xs leading-relaxed">{checkResult.message}</p>
                <div className="bg-white/90 p-3 rounded-lg border border-emerald-300 font-mono text-xs space-y-1">
                  <div>Generated Persistent Hash: <strong>{checkResult.generatedUPI}</strong></div>
                  <div>Jurisdiction: Maharashtra Real Estate Regulatory Authority (MahaRERA)</div>
                </div>

                <button
                  type="button"
                  onClick={handlePublishNew}
                  className="mt-2 w-full py-2 rounded-lg font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Publish to Active Discovery Grid</span>
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-[10px] text-slate-500 font-mono flex justify-between">
            <span>Algorithm: Levenshtein Distance &lt; 0.85 &amp; Geodetic Proximity</span>
            <span>Zero Phantom Inventory</span>
          </div>
        </div>
      </div>

      {/* Moderation Queue & Flagged Duplicate Reporting (FR-2.6) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Flag className="w-4 h-4 text-red-600" />
              Community Duplicate Flags & 48-Hour SLA Moderation Queue (FR-2.6)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live audit table for user and broker reports with strict 48-hour resolution SLA.
            </p>
          </div>
          <span className="text-xs font-mono font-bold bg-red-50 text-red-700 px-2.5 py-1 rounded-md border border-red-200">
            {flaggedListings.length} Active Items Under Review
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-3">Reported Listing</th>
                <th className="p-3">RERA ID</th>
                <th className="p-3">Flag Reason</th>
                <th className="p-3">Reporter</th>
                <th className="p-3">SLA Countdown</th>
                <th className="p-3 text-right">Moderator Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {flaggedListings.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="p-3 font-bold text-slate-900">{item.projectName}</td>
                  <td className="p-3 font-mono text-slate-600">{item.reraNumber}</td>
                  <td className="p-3 text-slate-700 font-medium">
                    <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200 font-mono text-[11px]">
                      {item.flagReason}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500 font-mono text-[11px]">{item.reportedBy}</td>
                  <td className="p-3 font-mono">
                    <span className="flex items-center gap-1 text-red-600 font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      {item.hoursRemaining}h remaining
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onResolveFlag(item.id, 'Merge')}
                      className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] cursor-pointer"
                    >
                      Merge Canonical
                    </button>
                    <button
                      type="button"
                      onClick={() => onResolveFlag(item.id, 'Dismiss')}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px] cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
