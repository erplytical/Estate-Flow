import React, { useState } from 'react';
import { ProjectData, ProjectConfigType } from '../data/mockProjects';
import {
  calculateTCO,
  formatNumberIndian,
  formatLakhCroreValue,
} from '../utils/realEstateCalculators';
import { Rupee } from './Rupee';
import { SvgArchitecturalThumb } from './SvgArchitecturalThumb';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Calculator,
  Scale,
  TrendingUp,
  Coins,
  Send,
  Flag,
  MapPin,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export type AnalyticsTab = 'emi' | 'tco' | 'rr_rate' | 'appreciation' | 'livability';

interface PropertyCardProps {
  project: ProjectData;
  selectedConfig: ProjectConfigType;
  matchType?: 'exact' | 'near';
  matchReason?: string;
  isCompared: boolean;
  onToggleCompare: (projectId: string) => void;
  onOpenAnalytics: (project: ProjectData, tab: AnalyticsTab) => void;
  onGetWhatsAppReport: (project: ProjectData) => void;
  onFlagDuplicate: (project: ProjectData) => void;
  onViewCanonicalDetails: (project: ProjectData) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  project,
  selectedConfig,
  matchType = 'exact',
  matchReason,
  isCompared,
  onToggleCompare,
  onOpenAnalytics,
  onGetWhatsAppReport,
  onFlagDuplicate,
  onViewCanonicalDetails,
}) => {
  const [tcoExpanded, setTcoExpanded] = useState<boolean>(false);
  const [includeParking, setIncludeParking] = useState<boolean>(true);

  // Look up unit details for the chosen config, or fallback to first available
  const configUnit = project.configs[selectedConfig];
  const isAvailable = configUnit && configUnit.available;

  // Fallback to 2 BHK or 3 BHK if not directly available
  const fallbackConfigKey = (
    Object.keys(project.configs) as ProjectConfigType[]
  ).find((k) => project.configs[k].available) || '2 BHK';
  const effectiveConfigKey = isAvailable ? selectedConfig : fallbackConfigKey;
  const effectiveUnit = project.configs[effectiveConfigKey];

  const basePrice = effectiveUnit.basePrice;
  const isReady = project.stage === 'Ready to Move';
  const tco = calculateTCO(basePrice, isReady, includeParking);

  return (
    <article
      data-testid={`property-card-${project.id}`}
      className={`bg-white rounded-2xl border transition-shadow duration-200 overflow-hidden shadow-sm hover:shadow-md flex flex-col justify-between ${
        matchType === 'near'
          ? 'border-amber-300 ring-1 ring-amber-200/60'
          : 'border-slate-200'
      }`}
    >
      <div>
        {/* Near Match Warning Banner if Tier 2 */}
        {matchType === 'near' && matchReason && (
          <div className="bg-amber-50 px-4 py-2 border-b border-amber-200 flex items-center justify-between text-xs text-amber-900 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              Near Match: <strong>{matchReason}</strong>
            </span>
            <span className="font-mono text-[11px] text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded">
              FR-6.5 Nearest Verified
            </span>
          </div>
        )}

        {/* Deterministic SVG Architectural Elevation Thumbnail */}
        <div className="relative">
          <SvgArchitecturalThumb
            styleType={project.architecturalStyle}
            projectName={project.name}
            location={project.location}
            stage={project.stage}
          />
          {/* Canonical Inspection Button on Image */}
          <button
            onClick={() => onViewCanonicalDetails(project)}
            className="absolute bottom-2 left-2 text-[11px] bg-slate-900/85 hover:bg-slate-900 text-white font-medium px-2.5 py-1 rounded-md border border-slate-700 backdrop-blur-xs flex items-center gap-1.5 transition-colors"
          >
            <span>View Full Canonical Project</span>
            <ExternalLink className="w-3 h-3 text-blue-400" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Row 1: Trust & Identity Bar (FR-7.5) */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {/* RERA Badge */}
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#ECFDF5] text-[#047857] border border-[#10B981]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                RERA VERIFIED
              </span>

              {/* Monospace RERA Number */}
              <span className="font-mono text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {project.reraNumber}
              </span>

              {/* Stage Pill */}
              <span
                className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                  isReady
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}
              >
                {project.stage}
              </span>
            </div>

            {/* Monospace UPI & Compare Checkbox */}
            <div className="flex items-center gap-2">
              <span
                className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-300"
                title="Unique Project Identifier (UPI) Hash"
              >
                UPI: {project.upi}
              </span>

              <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none bg-slate-50 hover:bg-slate-100 px-2 py-1 rounded border border-slate-200">
                <input
                  type="checkbox"
                  checked={isCompared}
                  onChange={() => onToggleCompare(project.id)}
                  className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 cursor-pointer"
                />
                <span className="font-medium">Compare</span>
              </label>
            </div>
          </div>

          {/* Row 2: Title & Dynamic Configuration-Specific Pricing (FR-7.1) */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors"
                  onClick={() => onViewCanonicalDetails(project)}
                >
                  {project.name}
                </h3>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                {project.developer}
              </p>
              <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {project.location} ({project.subLocality})
                </span>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => onOpenAnalytics(project, 'livability')}
                  className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 hover:bg-emerald-100 transition-colors"
                >
                  Livability: {project.livability.compositeScore}/100
                </button>
              </div>
            </div>

            {/* Dynamic Config-Specific Price Box (FR-7.1) */}
            <div className="bg-slate-50 sm:text-right p-2.5 rounded-xl border border-slate-200 min-w-[190px]">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                Price for Selected {effectiveConfigKey}
              </span>
              <div className="text-xl font-bold font-mono text-slate-900 mt-0.5 flex sm:justify-end items-center gap-1">
                <Rupee className="w-4 h-4 text-slate-900" />
                <span>{formatLakhCroreValue(basePrice)}</span>
              </div>
              <div className="text-xs font-mono text-slate-600 mt-0.5">
                Carpet: <strong>{effectiveUnit.carpetAreaSqFt} sq.ft.</strong> (<Rupee className="w-2.5 h-2.5 text-slate-500" />
                {Math.round(basePrice / effectiveUnit.carpetAreaSqFt).toLocaleString('en-IN')}/sq.ft.)
              </div>
              {!isAvailable && (
                <span className="text-[10px] text-amber-700 block font-medium mt-1">
                  ({selectedConfig} sold out, showing {effectiveConfigKey})
                </span>
              )}
            </div>
          </div>

          {/* Row 3: Inline TCO Summary & Accordion (FR-7.2) */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">
                  Total Cost of Ownership (TCO)
                </span>
                <span className="font-mono font-bold text-slate-900 text-base flex items-center gap-1">
                  <Rupee className="w-3.5 h-3.5 text-slate-800" />
                  <span>{formatNumberIndian(tco.totalTCO)}</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setTcoExpanded(!tcoExpanded)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-2xs hover:bg-slate-50 transition-colors"
              >
                <span>{tcoExpanded ? 'Hide Breakdown' : 'View Full Breakdown'}</span>
                {tcoExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Expanded Itemized Table (FR-7.2) */}
            {tcoExpanded && (
              <div className="mt-3 pt-3 border-t border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-slate-100 font-mono">
                  <span className="text-slate-600">1. Base Unit Price ({effectiveConfigKey})</span>
                  <span className="font-semibold text-slate-900 flex items-center gap-0.5">
                    <Rupee className="w-3 h-3 text-slate-700" />
                    <span>{formatNumberIndian(tco.basePrice)}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100 font-mono">
                  <span className="text-slate-600">
                    2. GST ({tco.gstPercent}% {isReady ? '• Ready-to-Move Exempt' : '• Under-Construction'})
                  </span>
                  <span className="font-semibold text-slate-900 flex items-center gap-0.5">
                    <Rupee className="w-3 h-3 text-slate-700" />
                    <span>{formatNumberIndian(tco.gstAmount)}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100 font-mono">
                  <span className="text-slate-600">
                    3. Stamp Duty ({tco.stampDutyPercent}% State RR-Rate Table)
                  </span>
                  <span className="font-semibold text-slate-900 flex items-center gap-0.5">
                    <Rupee className="w-3 h-3 text-slate-700" />
                    <span>{formatNumberIndian(tco.stampDutyAmount)}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100 font-mono">
                  <span className="text-slate-600">4. Registration Charges (Govt Standard Slab)</span>
                  <span className="font-semibold text-slate-900 flex items-center gap-0.5">
                    <Rupee className="w-3 h-3 text-slate-700" />
                    <span>{formatNumberIndian(tco.registrationCharges)}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100 font-mono">
                  <span className="text-slate-600">5. Maintenance Corpus & Clubhouse</span>
                  <span className="font-semibold text-slate-900 flex items-center gap-0.5">
                    <Rupee className="w-3 h-3 text-slate-700" />
                    <span>{formatNumberIndian(tco.maintenanceCorpus)}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100 font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-600">6. Covered Dedicated Parking</span>
                    <label className="text-[10px] text-blue-600 flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeParking}
                        onChange={(e) => setIncludeParking(e.target.checked)}
                        className="rounded h-3 w-3"
                      />
                      <span>(Toggle)</span>
                    </label>
                  </div>
                  <span className="font-semibold text-slate-900 flex items-center gap-0.5">
                    <Rupee className="w-3 h-3 text-slate-700" />
                    <span>{formatNumberIndian(tco.parkingCharges)}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100 font-mono text-emerald-700 bg-emerald-50 px-2 rounded">
                  <span className="font-medium">7. Brokerage (Direct Canonical Listing)</span>
                  <span className="font-bold flex items-center gap-0.5">
                    <Rupee className="w-3 h-3 text-emerald-700" />
                    <span>0 (Zero Brokerage)</span>
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 font-mono font-bold text-slate-900 text-sm">
                  <span>Total Calculated Acquisition Cost:</span>
                  <span className="text-blue-700 flex items-center gap-0.5">
                    <Rupee className="w-3.5 h-3.5 text-blue-700" />
                    <span>{formatNumberIndian(tco.totalTCO)}</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Row 4: Inline Analytics Tool Bar (FR-7.3) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            <button
              type="button"
              onClick={() => onOpenAnalytics(project, 'emi')}
              className="py-1.5 px-2 rounded-lg bg-blue-50/70 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              <Calculator className="w-3.5 h-3.5 text-blue-600" />
              <span>EMI Calc</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenAnalytics(project, 'rr_rate')}
              className="py-1.5 px-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              <Scale className="w-3.5 h-3.5 text-slate-600" />
              <span>RR-Rate vs Mkt</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenAnalytics(project, 'appreciation')}
              className="py-1.5 px-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              <TrendingUp className="w-3.5 h-3.5 text-slate-600" />
              <span>5/10Y Trend</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenAnalytics(project, 'appreciation')}
              className="py-1.5 px-2 rounded-lg bg-emerald-50/80 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              <Coins className="w-3.5 h-3.5 text-emerald-700" />
              <span>Rental Yield</span>
            </button>
          </div>
        </div>
      </div>

      {/* Row 5: Primary USP CTA & Compliance Footer (FR-7.4, FR-7.6) */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Compliance Timestamp & Source & Flag Duplicate (FR-2.6, FR-7.6) */}
        <div className="space-y-1">
          <div className="font-mono text-[10px] text-slate-500">
            Last updated: <strong>{project.lastUpdated}</strong>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-500">
            <span>Source: {project.dataSource}</span>
            <span>•</span>
            <button
              type="button"
              onClick={() => onFlagDuplicate(project)}
              className="text-red-600 hover:text-red-700 hover:underline flex items-center gap-0.5 font-medium cursor-pointer"
            >
              <Flag className="w-2.5 h-2.5" />
              Flag Duplicate (FR-2.6)
            </button>
          </div>
        </div>

        {/* Primary USP WhatsApp Button (FR-7.4) */}
        <button
          type="button"
          onClick={() => onGetWhatsAppReport(project)}
          className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#16A34A] hover:bg-[#15803D] text-white shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap active:scale-[0.98]"
        >
          <Send className="w-4 h-4 text-white" />
          <span>Get Report on WhatsApp</span>
        </button>
      </div>
    </article>
  );
};
