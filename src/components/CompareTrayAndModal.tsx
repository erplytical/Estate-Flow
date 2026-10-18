import React, { useState } from 'react';
import { ProjectData, ProjectConfigType } from '../data/mockProjects';
import {
  calculateTCO,
  calculateRentalYield,
  formatNumberIndian,
  formatLakhCroreValue,
} from '../utils/realEstateCalculators';
import { Rupee } from './Rupee';
import {
  Scale,
  X,
  FileText,
  Share2,
  CheckCircle2,
  Copy,
  Check,
  Eye,
  Building2,
  ExternalLink,
} from 'lucide-react';

interface CompareTrayAndModalProps {
  selectedProjectIds: string[];
  allProjects: ProjectData[];
  selectedConfig: ProjectConfigType;
  onRemoveProject: (id: string) => void;
  onClearAll: () => void;
  isOpenModal: boolean;
  onOpenModal: () => void;
  onCloseModal: () => void;
}

export const CompareTrayAndModal: React.FC<CompareTrayAndModalProps> = ({
  selectedProjectIds,
  allProjects,
  selectedConfig,
  onRemoveProject,
  onClearAll,
  isOpenModal,
  onOpenModal,
  onCloseModal,
}) => {
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [trackedLink, setTrackedLink] = useState<string | null>(null);
  const [liveViewCount, setLiveViewCount] = useState<number>(0);
  const [lastViewTimestamp, setLastViewTimestamp] = useState<string | null>(null);

  const selectedProjects = allProjects.filter((p) =>
    selectedProjectIds.includes(p.id)
  );

  if (selectedProjectIds.length === 0) return null;

  const handleGenerateLink = () => {
    const randomHash = Math.random().toString(36).substring(2, 7).toUpperCase();
    const link = `https://estateflow.in/r/EF-TRK-${randomHash}`;
    setTrackedLink(link);
    setCopiedLink(true);
    navigator.clipboard?.writeText(link);

    // Simulate an initial view event after 2.5 seconds
    setTimeout(() => {
      setLiveViewCount((prev) => prev + 1);
      setLastViewTimestamp(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 2500);

    setTimeout(() => {
      setCopiedLink(false);
    }, 3000);
  };

  return (
    <>
      {/* Floating Bottom Compare Tray Bar */}
      <aside
        aria-label="Property comparison tray"
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700/80 backdrop-blur-md flex items-center gap-4 max-w-2xl w-[92vw] sm:w-auto transition-all animate-bounce-once"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xs text-white">
            {selectedProjects.length}
          </div>
          <div className="hidden sm:block text-xs">
            <div className="font-semibold text-white">Compare Tray</div>
            <div className="text-slate-400 text-[11px]">Up to 4 projects</div>
          </div>
        </div>

        {/* Selected Project Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-[280px] sm:max-w-xs py-1">
          {selectedProjects.map((p) => (
            <span
              key={p.id}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-xs font-mono text-slate-200 border border-slate-700 whitespace-nowrap"
            >
              <span className="truncate max-w-[90px]">{p.name}</span>
              <button
                type="button"
                onClick={() => onRemoveProject(p.id)}
                className="text-slate-400 hover:text-white ml-0.5"
                title="Remove from compare"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs text-slate-400 hover:text-white underline px-1 cursor-pointer"
          >
            Clear
          </button>

          <button
            type="button"
            onClick={onOpenModal}
            className="px-4 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Build Client Report</span>
          </button>
        </div>
      </aside>

      {/* Client Report Builder Modal (FR-5.2, FR-5.5) */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 bg-slate-900 text-white flex items-start justify-between border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">
                    FR-5.2 CLIENT REPORT ENGINE
                  </span>
                  <span className="text-xs text-slate-400">
                    Configuration: <strong>{selectedConfig}</strong>
                  </span>
                </div>
                <h2 className="text-xl font-bold mt-1 text-white">
                  Multi-Project Canonical Comparison Matrix
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Side-by-side RERA status, exact TCO, circle rate spreads, and livability indices.
                </p>
              </div>
              <button
                type="button"
                onClick={onCloseModal}
                aria-label="Close comparison modal"
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body: Comparison Table */}
            <div className="flex-1 overflow-x-auto p-6">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="p-3 text-slate-500 font-semibold uppercase tracking-wider w-44 bg-slate-50">
                      Criteria / Metric
                    </th>
                    {selectedProjects.map((p) => (
                      <th
                        key={p.id}
                        className="p-3 text-slate-900 font-bold text-sm min-w-[210px] bg-slate-50 border-l border-slate-200"
                      >
                        <div className="flex items-center justify-between">
                          <span>{p.name}</span>
                          <span className="text-[10px] font-mono text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                            {p.location}
                          </span>
                        </div>
                        <div className="text-[11px] font-normal text-slate-500 mt-0.5">
                          {p.developer}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {/* RERA ID & Status */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-700 bg-slate-50/50">
                      RERA Number & Stage
                    </td>
                    {selectedProjects.map((p) => (
                      <td key={p.id} className="p-3 font-mono border-l border-slate-200">
                        <span className="font-semibold text-emerald-700 block">
                          ✓ {p.reraNumber}
                        </span>
                        <span className="text-[11px] text-slate-500">{p.stage}</span>
                      </td>
                    ))}
                  </tr>

                  {/* UPI Hash */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-700 bg-slate-50/50">
                      Unique Project UPI
                    </td>
                    {selectedProjects.map((p) => (
                      <td key={p.id} className="p-3 font-mono text-slate-700 border-l border-slate-200">
                        <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                          {p.upi}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Price for Selected Config */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-700 bg-slate-50/50">
                      Price for {selectedConfig}
                    </td>
                    {selectedProjects.map((p) => {
                      const c = p.configs[selectedConfig];
                      const eff = c?.available ? c : p.configs['2 BHK'];
                      return (
                        <td key={p.id} className="p-3 font-mono border-l border-slate-200">
                          <span className="text-base font-bold text-slate-900 flex items-center gap-0.5">
                            <Rupee className="w-3.5 h-3.5 text-slate-900" />
                            <span>{formatLakhCroreValue(eff.basePrice)}</span>
                          </span>
                          <span className="text-[11px] text-slate-500 flex items-center gap-0.5 mt-0.5">
                            {eff.carpetAreaSqFt} sq.ft. (<Rupee className="w-2.5 h-2.5 text-slate-400" />{Math.round(eff.basePrice / eff.carpetAreaSqFt).toLocaleString()}/sq.ft.)
                          </span>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Total Cost of Ownership (TCO) */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-700 bg-slate-50/50">
                      Total Cost of Ownership (TCO)
                    </td>
                    {selectedProjects.map((p) => {
                      const c = p.configs[selectedConfig];
                      const eff = c?.available ? c : p.configs['2 BHK'];
                      const isReady = p.stage === 'Ready to Move';
                      const tco = calculateTCO(eff.basePrice, isReady, true);
                      return (
                        <td key={p.id} className="p-3 font-mono font-bold text-blue-700 border-l border-slate-200">
                          <span className="text-sm flex items-center gap-0.5">
                            <Rupee className="w-3.5 h-3.5 text-blue-700" />
                            <span>{formatNumberIndian(tco.totalTCO)}</span>
                          </span>
                          <span className="text-[10px] text-slate-500 font-normal">
                            Includes GST + 6% Stamp + Reg + Parking
                          </span>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Ready Reckoner Spread */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-700 bg-slate-50/50">
                      Govt RR vs Market Rate
                    </td>
                    {selectedProjects.map((p) => {
                      const markup = Math.round(
                        ((p.valuation.developerQuotedPerSqFt - p.valuation.rrRatePerSqFt) /
                          p.valuation.rrRatePerSqFt) *
                          100
                      );
                      return (
                        <td key={p.id} className="p-3 font-mono border-l border-slate-200">
                          <span className="text-slate-800 font-bold flex items-center gap-0.5">
                            <Rupee className="w-3 h-3 text-slate-700" />
                            <span>{p.valuation.developerQuotedPerSqFt.toLocaleString()} / sq.ft.</span>
                          </span>
                          <span className="text-[11px] text-amber-700 flex items-center gap-0.5">
                            +{markup}% over RR <Rupee className="w-2.5 h-2.5 text-amber-600" />{p.valuation.rrRatePerSqFt.toLocaleString()}
                          </span>
                        </td>
                      );
                    })}
                  </tr>

                  {/* 5-Year Historical Appreciation */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-700 bg-slate-50/50">
                      5-Year Locality CAGR
                    </td>
                    {selectedProjects.map((p) => {
                      const first = p.valuation.trend5Yr[0].marketRate;
                      const last = p.valuation.trend5Yr[p.valuation.trend5Yr.length - 1].marketRate;
                      const cagr = ((Math.pow(last / first, 1 / 4) - 1) * 100).toFixed(1);
                      return (
                        <td key={p.id} className="p-3 font-mono border-l border-slate-200">
                          <span className="text-emerald-700 font-bold text-sm block">
                            +{cagr}% CAGR
                          </span>
                          <span className="text-[10px] text-slate-500 font-normal flex items-center gap-0.5 mt-0.5">
                            <Rupee className="w-2.5 h-2.5 text-slate-400" />{first.toLocaleString()} → <Rupee className="w-2.5 h-2.5 text-slate-400" />{last.toLocaleString()}
                          </span>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Net Rental Yield % */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-700 bg-slate-50/50">
                      Estimated Net Yield %
                    </td>
                    {selectedProjects.map((p) => {
                      const c = p.configs[selectedConfig];
                      const eff = c?.available ? c : p.configs['2 BHK'];
                      const yld = calculateRentalYield(
                        eff.expectedMonthlyRent,
                        eff.annualMaintenanceAndTax,
                        eff.basePrice
                      );
                      return (
                        <td key={p.id} className="p-3 font-mono border-l border-slate-200">
                          <span className="font-bold text-slate-900 block text-sm">
                            {yld.netYieldPct}% Net
                          </span>
                          <span className="text-[11px] text-slate-500 flex items-center gap-0.5 mt-0.5">
                            ~<Rupee className="w-2.5 h-2.5 text-slate-400" />{formatNumberIndian(eff.expectedMonthlyRent)} / month rent
                          </span>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Livability Composite Score */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-700 bg-slate-50/50">
                      Livability Index
                    </td>
                    {selectedProjects.map((p) => (
                      <td key={p.id} className="p-3 border-l border-slate-200">
                        <span className="inline-flex items-center gap-1 font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                          {p.livability.compositeScore} / 100
                        </span>
                        <div className="text-[10px] text-slate-500 mt-1">
                          AQI: {p.livability.aqi} • {p.livability.floodRisk}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Modal Footer: Trackable Client Link & Audit Events (FR-5.5) */}
            <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-600">
                  <span className="font-bold text-slate-900 block">
                    Branded Client Link Sharing (FR-5.5):
                  </span>
                  Share this verified comparative appraisal with clients with real-time open analytics.
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleGenerateLink}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                    <span>{copiedLink ? 'Link Copied!' : 'Generate Trackable Client Link'}</span>
                  </button>
                </div>
              </div>

              {/* Simulated Live View Tracking Badges */}
              {trackedLink && (
                <div className="p-3 bg-white rounded-xl border border-blue-200 shadow-2xs flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {trackedLink}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(trackedLink);
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 2000);
                      }}
                      className="text-slate-500 hover:text-slate-900 p-1"
                      title="Copy link"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-100 text-emerald-800">
                      <Eye className="w-3.5 h-3.5 text-emerald-600" />
                      Client Opens Tracked: {liveViewCount}
                    </span>
                    {lastViewTimestamp && (
                      <span className="text-[10px] text-slate-500 font-mono">
                        Last opened at {lastViewTimestamp}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
