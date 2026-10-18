import React, { useState } from 'react';
import { ProjectData, ProjectConfigType } from '../data/mockProjects';
import {
  calculateTCO,
  calculateRentalYield,
  formatNumberIndian,
  formatLakhCroreValue,
} from '../utils/realEstateCalculators';
import { Rupee } from './Rupee';
import { SvgArchitecturalThumb } from './SvgArchitecturalThumb';
import {
  ArrowLeft,
  CheckCircle2,
  FileCheck,
  Building,
  Layers,
  MapPin,
  Calendar,
  Send,
  ShieldCheck,
  Check,
  Clock,
  Compass,
  Maximize2,
} from 'lucide-react';

interface CanonicalProjectDetailProps {
  project: ProjectData;
  selectedConfig: ProjectConfigType;
  onBackToDiscovery: () => void;
  onOpenWhatsAppReport: (project: ProjectData) => void;
  onSelectConfig: (config: ProjectConfigType) => void;
}

export const CanonicalProjectDetail: React.FC<CanonicalProjectDetailProps> = ({
  project,
  selectedConfig,
  onBackToDiscovery,
  onOpenWhatsAppReport,
  onSelectConfig,
}) => {
  const [activeFloorConfig, setActiveFloorConfig] = useState<ProjectConfigType>(
    project.configs[selectedConfig]?.available ? selectedConfig : '2 BHK'
  );

  const unit = project.configs[activeFloorConfig]?.available
    ? project.configs[activeFloorConfig]
    : project.configs['2 BHK'];

  const isReady = project.stage === 'Ready to Move';
  const tco = calculateTCO(unit.basePrice, isReady, true);
  const yieldData = calculateRentalYield(
    unit.expectedMonthlyRent,
    unit.annualMaintenanceAndTax,
    unit.basePrice
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToDiscovery}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-blue-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Discovery Grid</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
            Canonical UPI: <strong>{project.upi}</strong>
          </span>
          <span className="text-xs font-mono font-semibold px-2 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-300">
            MahaRERA: {project.reraNumber}
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="relative">
          <SvgArchitecturalThumb
            styleType={project.architecturalStyle}
            projectName={project.name}
            location={project.location}
            stage={project.stage}
            className="w-full h-72 sm:h-80"
          />
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#ECFDF5] text-[#047857] border border-[#10B981]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                  RERA VERIFIED CANONICAL LISTING
                </span>
                <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                  {project.stage}
                </span>
                <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                  Possession: {project.possessionDate}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-slate-900 mt-2">{project.name}</h1>
              <p className="text-sm font-semibold text-slate-600 mt-1">{project.developer}</p>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {project.location} ({project.subLocality}) • Coordinates: {project.coordinates.lat}, {project.coordinates.lng}
              </p>
            </div>

            {/* Quick Action Box */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 min-w-[220px] text-right space-y-2">
              <span className="text-xs text-slate-500 uppercase tracking-wider block font-semibold">
                Price for {activeFloorConfig}
              </span>
              <div className="text-2xl font-bold font-mono text-slate-900 flex sm:justify-end items-center gap-1">
                <Rupee className="w-5 h-5 text-slate-900" />
                <span>{formatLakhCroreValue(unit.basePrice)}</span>
              </div>
              <div className="text-xs font-mono text-slate-600 flex sm:justify-end items-center gap-1">
                <span>All-in TCO: </span>
                <strong className="flex items-center gap-0.5"><Rupee className="w-3 h-3 text-slate-700" />{formatNumberIndian(tco.totalTCO)}</strong>
              </div>
              <button
                type="button"
                onClick={() => onOpenWhatsAppReport(project)}
                className="w-full mt-2 py-2 px-3 rounded-xl font-bold text-xs bg-[#16A34A] hover:bg-[#15803D] text-white shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-white" />
                <span>Get Report on WhatsApp</span>
              </button>
            </div>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed max-w-4xl">
            {project.overview}
          </p>
        </div>
      </div>

      {/* Available Unit Pricing Matrix */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            Verified Unit Configurations & Pricing Schedule (FR-7.1)
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            Click any config to switch active inspection
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(Object.keys(project.configs) as ProjectConfigType[]).map((cfgKey) => {
            const c = project.configs[cfgKey];
            if (!c.available) return null;
            const isSelected = activeFloorConfig === cfgKey;
            return (
              <button
                key={cfgKey}
                type="button"
                onClick={() => {
                  setActiveFloorConfig(cfgKey);
                  onSelectConfig(cfgKey);
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20 shadow-sm'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">{cfgKey}</span>
                  {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                </div>
                <div className="text-lg font-bold font-mono text-slate-900 mt-1 flex items-center gap-0.5">
                  <Rupee className="w-4 h-4 text-slate-900" />
                  <span>{formatLakhCroreValue(c.basePrice)}</span>
                </div>
                <div className="text-xs font-mono text-slate-600 mt-0.5 flex items-center gap-0.5">
                  <span>{c.carpetAreaSqFt} sq.ft. (</span>
                  <Rupee className="w-2.5 h-2.5 text-slate-500" />
                  <span>{Math.round(c.basePrice / c.carpetAreaSqFt).toLocaleString()}/sq.ft.)</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {c.typicalFloor || 'Mid-High Rise Floors'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive SVG Floor Plan Wireframe Render */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-600" />
              Architectural CAD Floor Plan Wireframe — {activeFloorConfig}
            </h2>
            <p className="text-xs text-slate-500">
              Deterministic vector layout with carpet dimensions ({unit.carpetAreaSqFt} sq.ft. RERA Net Carpet Area)
            </p>
          </div>
          <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded border border-slate-200">
            North-Facing Vastu Compliant
          </span>
        </div>

        {/* Clean Blueprint SVG Canvas */}
        <div className="bg-[#0B192C] p-4 rounded-xl border border-slate-800 overflow-x-auto flex justify-center">
          <svg viewBox="0 0 640 360" className="w-full max-w-2xl h-64 sm:h-80" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1E3E62" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="640" height="360" fill="#0B192C" />
            <rect width="640" height="360" fill="url(#grid)" />

            {/* Outer Wall Boundary */}
            <rect x="80" y="40" width="480" height="280" fill="none" stroke="#38BDF8" strokeWidth="3" rx="4" />

            {/* Living & Dining Hall */}
            <rect x="90" y="50" width="260" height="180" fill="#1E293B" stroke="#60A5FA" strokeWidth="1.5" />
            <text x="220" y="140" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
              LIVING &amp; DINING ROOM
            </text>
            <text x="220" y="160" textAnchor="middle" fill="#93C5FD" fontSize="10" fontFamily="monospace">
              18'6" × 12'0" (222 sq.ft.)
            </text>

            {/* Kitchen & Utility */}
            <rect x="360" y="50" width="190" height="120" fill="#1E293B" stroke="#60A5FA" strokeWidth="1.5" />
            <text x="455" y="105" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold" fontFamily="sans-serif">
              KITCHEN + DRY BALCONY
            </text>
            <text x="455" y="122" textAnchor="middle" fill="#93C5FD" fontSize="10" fontFamily="monospace">
              10'0" × 8'6" (85 sq.ft.)
            </text>

            {/* Master Bedroom */}
            <rect x="90" y="240" width="220" height="70" fill="#1E293B" stroke="#60A5FA" strokeWidth="1.5" />
            <text x="200" y="275" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold" fontFamily="sans-serif">
              MASTER BEDROOM
            </text>
            <text x="200" y="292" textAnchor="middle" fill="#93C5FD" fontSize="10" fontFamily="monospace">
              14'0" × 11'6" (En-Suite)
            </text>

            {/* Guest / Children Bedroom */}
            <rect x="320" y="180" width="230" height="130" fill="#1E293B" stroke="#60A5FA" strokeWidth="1.5" />
            <text x="435" y="245" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold" fontFamily="sans-serif">
              BEDROOM 2
            </text>
            <text x="435" y="262" textAnchor="middle" fill="#93C5FD" fontSize="10" fontFamily="monospace">
              12'0" × 10'0" (120 sq.ft.)
            </text>

            {/* Cantilever Deck */}
            <rect x="40" y="90" width="40" height="100" fill="#0369A1" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="60" y="145" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" transform="rotate(-90 60 145)">
              SUN DECK BALCONY
            </text>
          </svg>
        </div>
      </div>

      {/* Construction Progress Milestones */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            Construction Milestones & Handover Progress ({project.overallProgress}% Complete)
          </h2>
          <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 font-semibold">
            On Schedule • PMC Audited
          </span>
        </div>

        <div className="space-y-3">
          {project.constructionMilestones.map((m, idx) => (
            <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex justify-between text-xs font-medium text-slate-800">
                <span className="flex items-center gap-1.5">
                  {m.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-blue-500 flex items-center justify-center text-[10px] text-blue-600 font-bold">
                      {idx + 1}
                    </span>
                  )}
                  <strong>{m.stage}</strong>
                </span>
                <span className="font-mono text-slate-600">
                  Target: {m.targetDate} ({m.progressPct}%)
                </span>
              </div>
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div
                  style={{ width: `${m.progressPct}%` }}
                  className={`h-full transition-all duration-500 ${
                    m.completed ? 'bg-emerald-500' : 'bg-blue-600'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legal & Clearances Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Statutory Approvals & Title Clearances Audit (MahaRERA Registered)
        </h2>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] border-b border-slate-200 font-semibold">
              <tr>
                <th className="p-3 font-sans">Clearance / Certificate</th>
                <th className="p-3 font-sans">Issuing Authority</th>
                <th className="p-3">Reference Certificate No</th>
                <th className="p-3">Approval Date</th>
                <th className="p-3 text-right font-sans">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {project.legalClearances.map((lc) => (
                <tr key={lc.id} className="hover:bg-slate-50/50">
                  <td className="p-3 font-sans font-semibold text-slate-900">{lc.name}</td>
                  <td className="p-3 font-sans text-slate-600">{lc.authority}</td>
                  <td className="p-3 text-slate-700">{lc.certificateNo}</td>
                  <td className="p-3 text-slate-600">{lc.date}</td>
                  <td className="p-3 text-right font-sans">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      {lc.status}
                    </span>
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
