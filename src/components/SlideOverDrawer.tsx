import React, { useState } from 'react';
import { ProjectData, ProjectConfigType } from '../data/mockProjects';
import {
  calculateEMI,
  calculateTCO,
  calculateRentalYield,
  formatNumberIndian,
  formatLakhCroreValue,
} from '../utils/realEstateCalculators';
import { Rupee } from './Rupee';
import { AnalyticsTab } from './PropertyCard';
import {
  X,
  Calculator,
  Scale,
  TrendingUp,
  Activity,
  Layers,
  MapPin,
  Calendar,
  Building,
  CheckCircle2,
  AlertCircle,
  Wind,
  Shield,
  Clock,
  Coins,
} from 'lucide-react';

interface SlideOverDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectData | null;
  selectedConfig: ProjectConfigType;
  initialTab?: AnalyticsTab;
}

const BANK_RATES = [
  { name: 'SBI', rate: 8.40, desc: 'Public Sector Benchmark' },
  { name: 'HDFC Bank', rate: 8.50, desc: 'Express Approval' },
  { name: 'ICICI Bank', rate: 8.60, desc: 'Pre-Approved Project' },
  { name: 'Kotak Bank', rate: 8.55, desc: 'Special NRI Slab' },
];

export const SlideOverDrawer: React.FC<SlideOverDrawerProps> = ({
  isOpen,
  onClose,
  project,
  selectedConfig,
  initialTab = 'emi',
}) => {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>(initialTab);

  // Synchronize initialTab when opening
  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  if (!isOpen || !project) return null;

  // Configuration details
  const configUnit = project.configs[selectedConfig];
  const effectiveConfigKey = configUnit?.available
    ? selectedConfig
    : ((Object.keys(project.configs) as ProjectConfigType[]).find(
        (k) => project.configs[k].available
      ) || '2 BHK');
  const unit = project.configs[effectiveConfigKey];
  const basePrice = unit.basePrice;
  const isReady = project.stage === 'Ready to Move';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white shadow-2xl border-l border-slate-200 flex flex-col">
          {/* Sticky Drawer Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {project.upi}
                </span>
                <span className="text-xs text-slate-400">RERA: {project.reraNumber}</span>
              </div>
              <h2 className="text-lg font-bold text-white">{project.name}</h2>
              <p className="text-xs text-slate-300 flex items-center gap-1">
                Config: <strong className="text-emerald-400">{effectiveConfigKey}</strong> • Base: <Rupee className="w-3 h-3 text-slate-300" />{formatLakhCroreValue(basePrice)}
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close analytics drawer"
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* 5 Tab Navigation Buttons */}
          <div className="flex border-b border-slate-200 bg-slate-50 px-2 overflow-x-auto">
            {[
              { id: 'emi', label: '1. EMI Calc', icon: Calculator },
              { id: 'tco', label: '2. TCO Breakdown', icon: Layers },
              { id: 'rr_rate', label: '3. RR-Rate vs Mkt', icon: Scale },
              { id: 'appreciation', label: '4. Appreciation & Yield', icon: TrendingUp },
              { id: 'livability', label: '5. Livability Index', icon: Activity },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as AnalyticsTab)}
                  className={`px-3 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isActive
                      ? 'border-blue-600 text-blue-600 bg-white'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Drawer Body: Tab Views */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {activeTab === 'emi' && (
              <EMICalculatorTab basePrice={basePrice} />
            )}

            {activeTab === 'tco' && (
              <TCOTab basePrice={basePrice} isReady={isReady} configName={effectiveConfigKey} />
            )}

            {activeTab === 'rr_rate' && (
              <RRRateComparisonTab project={project} />
            )}

            {activeTab === 'appreciation' && (
              <AppreciationAndYieldTab project={project} basePrice={basePrice} defaultRent={unit.expectedMonthlyRent} defaultExpense={unit.annualMaintenanceAndTax} />
            )}

            {activeTab === 'livability' && (
              <LivabilityTab project={project} />
            )}
          </div>

          {/* Sticky Drawer Footer */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between font-mono">
            <span>Last audited: {project.lastUpdated}</span>
            <span>Source: {project.dataSource}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* TAB 1: EMI CALCULATOR COMPONENT (FR-3.1)                                  */
/* -------------------------------------------------------------------------- */
const EMICalculatorTab: React.FC<{ basePrice: number }> = ({ basePrice }) => {
  const [loanPrincipal, setLoanPrincipal] = useState<number>(Math.round(basePrice * 0.8));
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(20);

  const emiData = calculateEMI(loanPrincipal, interestRate, tenureYears);
  const principalPct = Math.round((emiData.principal / emiData.totalPayment) * 100) || 50;
  const interestPct = 100 - principalPct;

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
          <Calculator className="w-4 h-4 text-blue-600" />
          Reducing-Balance Monthly EMI Calculator (FR-3.1)
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Standard formula: EMI = [P × r × (1+r)ⁿ] / [(1+r)ⁿ − 1]
        </p>
      </div>

      {/* Primary Highlight Result Card */}
      <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white p-5 rounded-2xl shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase text-blue-300">
            Calculated Monthly EMI
          </span>
          <span className="text-[11px] font-mono bg-blue-500/20 px-2 py-0.5 rounded text-blue-200 border border-blue-400/30">
            {tenureYears * 12} Months
          </span>
        </div>
        <div className="text-3xl font-bold font-mono text-white flex items-center gap-1">
          <Rupee className="w-6 h-6 text-emerald-400" />
          <span>{formatNumberIndian(emiData.monthlyEMI)}</span>
          <span className="text-sm font-normal text-slate-300 font-sans"> / month</span>
        </div>

        {/* Visual Proportional Bar */}
        <div className="space-y-1 pt-1">
          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${principalPct}%` }}
              className="bg-emerald-500 transition-all duration-300"
              title={`Principal: ${principalPct}%`}
            />
            <div
              style={{ width: `${interestPct}%` }}
              className="bg-amber-500 transition-all duration-300"
              title={`Interest: ${interestPct}%`}
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-slate-300">
            <span className="text-emerald-400 flex items-center gap-0.5">
              Principal: <Rupee className="w-2.5 h-2.5 text-emerald-400" />{formatNumberIndian(emiData.principal)} ({principalPct}%)
            </span>
            <span className="text-amber-400 flex items-center gap-0.5">
              Interest: <Rupee className="w-2.5 h-2.5 text-amber-400" />{formatNumberIndian(emiData.totalInterest)} ({interestPct}%)
            </span>
          </div>
        </div>
      </div>

      {/* 1-Click Partner Bank Rate Pills */}
      <div>
        <label className="text-xs font-semibold text-slate-700 block mb-1.5">
          Live Partner Bank Home Loan Rates:
        </label>
        <div className="grid grid-cols-2 gap-2">
          {BANK_RATES.map((b) => (
            <button
              key={b.name}
              type="button"
              onClick={() => setInterestRate(b.rate)}
              className={`p-2 rounded-xl border text-left transition-all ${
                interestRate === b.rate
                  ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{b.name}</span>
                <span className="text-xs font-mono font-bold text-blue-700">{b.rate}%</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">{b.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div>
          <div className="flex justify-between text-xs text-slate-700 mb-1">
            <span>Loan Principal Amount:</span>
            <span className="font-mono font-bold text-slate-900 flex items-center gap-0.5">
              <Rupee className="w-3 h-3 text-slate-700" />
              <span>{formatNumberIndian(loanPrincipal)}</span>
            </span>
          </div>
          <input
            type="range"
            min="1000000"
            max={Math.max(10000000, basePrice)}
            step="100000"
            value={loanPrincipal}
            onChange={(e) => setLoanPrincipal(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs text-slate-700 mb-1">
            <span>Interest Rate (% per annum):</span>
            <span className="font-mono font-bold text-slate-900">{interestRate.toFixed(2)}%</span>
          </div>
          <input
            type="range"
            min="7.0"
            max="12.0"
            step="0.05"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs text-slate-700 mb-1">
            <span>Loan Tenure (Years):</span>
            <span className="font-mono font-bold text-slate-900">{tenureYears} Years</span>
          </div>
          <input
            type="range"
            min="5"
            max="30"
            step="1"
            value={tenureYears}
            onChange={(e) => setTenureYears(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* TAB 2: TCO BREAKDOWN (FR-3.2)                                             */
/* -------------------------------------------------------------------------- */
const TCOTab: React.FC<{ basePrice: number; isReady: boolean; configName: string }> = ({
  basePrice,
  isReady,
  configName,
}) => {
  const [includeParking, setIncludeParking] = useState<boolean>(true);
  const tco = calculateTCO(basePrice, isReady, includeParking);

  const basePct = Math.round((tco.basePrice / tco.totalTCO) * 100);
  const taxPct = Math.round(((tco.gstAmount + tco.stampDutyAmount + tco.registrationCharges) / tco.totalTCO) * 100);
  const addlPct = 100 - basePct - taxPct;

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-blue-600" />
          Total Cost of Ownership (TCO) Breakdown (FR-3.2)
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Statutory taxes, state stamp duties, and direct builder levies for {configName}.
        </p>
      </div>

      {/* Visual Stacked Bar Chart */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
        <div className="flex justify-between text-xs font-mono font-semibold text-slate-800">
          <span>Net Acquisition Cost:</span>
          <span className="text-blue-700 text-sm flex items-center gap-0.5">
            <Rupee className="w-3.5 h-3.5 text-blue-700" />
            <span>{formatNumberIndian(tco.totalTCO)}</span>
          </span>
        </div>
        <div className="h-4 w-full rounded-full overflow-hidden flex shadow-inner">
          <div style={{ width: `${basePct}%` }} className="bg-blue-600" title={`Base Price: ${basePct}%`} />
          <div style={{ width: `${taxPct}%` }} className="bg-amber-500" title={`Govt Taxes & Stamp Duty: ${taxPct}%`} />
          <div style={{ width: `${addlPct}%` }} className="bg-emerald-600" title={`Clubhouse & Parking: ${addlPct}%`} />
        </div>
        <div className="flex flex-wrap gap-3 text-[11px] font-mono text-slate-600 pt-1">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span> Base ({basePct}%)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> Govt Taxes ({taxPct}%)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Corpus & Parking ({addlPct}%)
          </span>
        </div>
      </div>

      {/* Itemized Statutory Table */}
      <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200 text-xs font-mono">
        <div className="p-3 flex justify-between bg-white">
          <span className="text-slate-600">Base Unit Agreement Price</span>
          <span className="font-bold text-slate-900 flex items-center gap-0.5">
            <Rupee className="w-3 h-3 text-slate-700" />
            <span>{formatNumberIndian(tco.basePrice)}</span>
          </span>
        </div>
        <div className="p-3 flex justify-between bg-slate-50">
          <div>
            <span className="text-slate-700 font-semibold block">Goods & Services Tax (GST)</span>
            <span className="text-[10px] text-slate-500">
              {isReady ? '0% slab (OC received projects exempt)' : '5% residential under-construction slab'}
            </span>
          </div>
          <span className="font-bold text-slate-900 flex items-center gap-0.5">
            <Rupee className="w-3 h-3 text-slate-700" />
            <span>{formatNumberIndian(tco.gstAmount)}</span>
          </span>
        </div>
        <div className="p-3 flex justify-between bg-white">
          <div>
            <span className="text-slate-700 font-semibold block">Maharashtra Stamp Duty</span>
            <span className="text-[10px] text-slate-500">6% (5% Stamp Duty + 1% Local Body Tax)</span>
          </div>
          <span className="font-bold text-slate-900 flex items-center gap-0.5">
            <Rupee className="w-3 h-3 text-slate-700" />
            <span>{formatNumberIndian(tco.stampDutyAmount)}</span>
          </span>
        </div>
        <div className="p-3 flex justify-between bg-slate-50">
          <div>
            <span className="text-slate-700 font-semibold block">IGR Registration Charges</span>
            <span className="text-[10px] text-slate-500">Standard Maharashtra statutory ceiling slab</span>
          </div>
          <span className="font-bold text-slate-900 flex items-center gap-0.5">
            <Rupee className="w-3 h-3 text-slate-700" />
            <span>{formatNumberIndian(tco.registrationCharges)}</span>
          </span>
        </div>
        <div className="p-3 flex justify-between bg-white">
          <div>
            <span className="text-slate-700 font-semibold block">Maintenance Corpus & Clubhouse</span>
            <span className="text-[10px] text-slate-500">Society reserve fund deposit</span>
          </div>
          <span className="font-bold text-slate-900 flex items-center gap-0.5">
            <Rupee className="w-3 h-3 text-slate-700" />
            <span>{formatNumberIndian(tco.maintenanceCorpus)}</span>
          </span>
        </div>
        <div className="p-3 flex justify-between bg-slate-50 items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-slate-700 font-semibold">Covered Basement Parking</span>
              <label className="text-[11px] text-blue-600 flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeParking}
                  onChange={(e) => setIncludeParking(e.target.checked)}
                  className="rounded"
                />
                <span>Include</span>
              </label>
            </div>
            <span className="text-[10px] text-slate-500">Reserved dedicated bay with EV conduit</span>
          </div>
          <span className="font-bold text-slate-900 flex items-center gap-0.5">
            <Rupee className="w-3 h-3 text-slate-700" />
            <span>{formatNumberIndian(tco.parkingCharges)}</span>
          </span>
        </div>
        <div className="p-3 flex justify-between bg-emerald-50 text-emerald-800 font-semibold">
          <div>
            <span>Direct Canonical Listing Brokerage</span>
            <span className="text-[10px] text-emerald-600 block">No intermediary commissions charged</span>
          </div>
          <span className="font-bold text-emerald-700 flex items-center gap-0.5">
            <Rupee className="w-3 h-3 text-emerald-700" />
            <span>0 (Zero Brokerage)</span>
          </span>
        </div>
        <div className="p-3.5 flex justify-between bg-slate-900 text-white font-bold text-sm">
          <span>Total Calculated TCO:</span>
          <span className="text-emerald-400 font-mono flex items-center gap-0.5">
            <Rupee className="w-3.5 h-3.5 text-emerald-400" />
            <span>{formatNumberIndian(tco.totalTCO)}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* TAB 3: RR-RATE 3-BAR COMPARISON CHART (FR-3.3)                            */
/* Pure Inline Responsive SVG (Zero external chart library failure)          */
/* -------------------------------------------------------------------------- */
const RRRateComparisonTab: React.FC<{ project: ProjectData }> = ({ project }) => {
  const { rrRatePerSqFt, developerQuotedPerSqFt, recentRegisteredAvgPerSqFt } = project.valuation;

  const maxRate = Math.max(rrRatePerSqFt, developerQuotedPerSqFt, recentRegisteredAvgPerSqFt) * 1.15;
  const rrHeight = (rrRatePerSqFt / maxRate) * 180;
  const devHeight = (developerQuotedPerSqFt / maxRate) * 180;
  const regHeight = (recentRegisteredAvgPerSqFt / maxRate) * 180;

  const markupPct = Math.round(((developerQuotedPerSqFt - rrRatePerSqFt) / rrRatePerSqFt) * 100);
  const discountFromQuoted = Math.round(
    ((developerQuotedPerSqFt - recentRegisteredAvgPerSqFt) / developerQuotedPerSqFt) * 100
  );

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
          <Scale className="w-4 h-4 text-blue-600" />
          Ready Reckoner (RR) vs Market Price Spread (FR-3.3)
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Pure inline SVG comparative analysis of government circle rates versus market transacted values.
        </p>
      </div>

      {/* SVG 3-Bar Comparison Chart */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="w-full flex justify-center">
          <svg viewBox="0 0 460 260" className="w-full max-w-md h-56" xmlns="http://www.w3.org/2000/svg">
            {/* Grid Lines */}
            <line x1="40" y1="210" x2="430" y2="210" stroke="#CBD5E1" strokeWidth="1" />
            <line x1="40" y1="140" x2="430" y2="140" stroke="#E2E8F0" strokeDasharray="4 4" strokeWidth="1" />
            <line x1="40" y1="70" x2="430" y2="70" stroke="#E2E8F0" strokeDasharray="4 4" strokeWidth="1" />

            {/* Y Axis Reference Labels */}
            <text x="35" y="213" textAnchor="end" fontSize="9" fill="#94A3B8" fontFamily="monospace">₹0</text>
            <text x="35" y="143" textAnchor="end" fontSize="9" fill="#94A3B8" fontFamily="monospace">₹{Math.round(maxRate * 0.45).toLocaleString()}</text>
            <text x="35" y="73" textAnchor="end" fontSize="9" fill="#94A3B8" fontFamily="monospace">₹{Math.round(maxRate * 0.85).toLocaleString()}</text>

            {/* BAR 1: Govt RR Rate */}
            <rect
              x="65"
              y={210 - rrHeight}
              width="90"
              height={rrHeight}
              rx="4"
              fill="#2563EB"
              className="transition-all duration-500 hover:opacity-90"
            />
            <text x="110" y={200 - rrHeight} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1E293B" fontFamily="monospace">
              ₹{rrRatePerSqFt.toLocaleString()}
            </text>
            <text x="110" y="226" textAnchor="middle" fontSize="10" fontWeight="600" fill="#475569">
              Govt RR Rate
            </text>
            <text x="110" y="238" textAnchor="middle" fontSize="9" fill="#94A3B8">
              Circle Benchmark
            </text>

            {/* BAR 2: Developer Quoted Rate */}
            <rect
              x="185"
              y={210 - devHeight}
              width="90"
              height={devHeight}
              rx="4"
              fill="#F59E0B"
              className="transition-all duration-500 hover:opacity-90"
            />
            <text x="230" y={200 - devHeight} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1E293B" fontFamily="monospace">
              ₹{developerQuotedPerSqFt.toLocaleString()}
            </text>
            <text x="230" y="226" textAnchor="middle" fontSize="10" fontWeight="600" fill="#475569">
              Dev Quoted
            </text>
            <text x="230" y="238" textAnchor="middle" fontSize="9" fill="#94A3B8">
              Asking Price
            </text>

            {/* BAR 3: Recent Registered Avg */}
            <rect
              x="305"
              y={210 - regHeight}
              width="90"
              height={regHeight}
              rx="4"
              fill="#10B981"
              className="transition-all duration-500 hover:opacity-90"
            />
            <text x="350" y={200 - regHeight} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1E293B" fontFamily="monospace">
              ₹{recentRegisteredAvgPerSqFt.toLocaleString()}
            </text>
            <text x="350" y="226" textAnchor="middle" fontSize="10" fontWeight="600" fill="#475569">
              IGR Registered
            </text>
            <text x="350" y="238" textAnchor="middle" fontSize="9" fill="#94A3B8">
              Recent Actuals
            </text>
          </svg>
        </div>
      </div>

      {/* Insight Spread Cards */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
          <span className="text-amber-800 font-semibold block">Market vs Govt RR Spread:</span>
          <div className="text-lg font-bold font-mono text-amber-900 mt-1">
            +{markupPct}% Premium
          </div>
          <p className="text-[11px] text-amber-700 mt-0.5">
            Reflects developer brand equity and superior amenities over the base government registry value.
          </p>
        </div>

        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
          <span className="text-emerald-800 font-semibold block">Negotiation Margin:</span>
          <div className="text-lg font-bold font-mono text-emerald-900 mt-1">
            ~{discountFromQuoted}% Spread
          </div>
          <p className="text-[11px] text-emerald-700 mt-0.5">
            Actual deeds registered at IGR average ₹{recentRegisteredAvgPerSqFt.toLocaleString()}/sq.ft.
          </p>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* TAB 4: APPRECIATION & YIELD CALCULATOR (FR-3.4, FR-3.5)                   */
/* -------------------------------------------------------------------------- */
const AppreciationAndYieldTab: React.FC<{
  project: ProjectData;
  basePrice: number;
  defaultRent: number;
  defaultExpense: number;
}> = ({ project, basePrice, defaultRent, defaultExpense }) => {
  const [timeframe, setTimeframe] = useState<'5Y' | '10Y'>('5Y');
  const [monthlyRent, setMonthlyRent] = useState<number>(defaultRent);
  const [annualExpense, setAnnualExpense] = useState<number>(defaultExpense);

  const series = timeframe === '5Y' ? project.valuation.trend5Yr : project.valuation.trend10Yr;
  const yieldResult = calculateRentalYield(monthlyRent, annualExpense, basePrice);

  // SVG Trendline Coordinate Calculations
  const minRate = Math.min(...series.map((d) => Math.min(d.marketRate, d.rrRate))) * 0.9;
  const maxRate = Math.max(...series.map((d) => Math.max(d.marketRate, d.rrRate))) * 1.1;

  const pointsMarket = series
    .map((d, i) => {
      const x = 50 + (i / (series.length - 1)) * 340;
      const y = 170 - ((d.marketRate - minRate) / (maxRate - minRate)) * 130;
      return `${x},${y}`;
    })
    .join(' ');

  const pointsRR = series
    .map((d, i) => {
      const x = 50 + (i / (series.length - 1)) * 340;
      const y = 170 - ((d.rrRate - minRate) / (maxRate - minRate)) * 130;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="space-y-6">
      {/* SECTION 1: SVG 5/10Y Appreciation Trendline */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Micro-Market Appreciation Trendline (FR-3.4)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Historical transacted values overlaid with Ready Reckoner circle rate revisions.
            </p>
          </div>
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-mono">
            <button
              onClick={() => setTimeframe('5Y')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                timeframe === '5Y' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-600'
              }`}
            >
              5-Year
            </button>
            <button
              onClick={() => setTimeframe('10Y')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                timeframe === '10Y' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-600'
              }`}
            >
              10-Year
            </button>
          </div>
        </div>

        {/* Pure SVG Line Chart */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <svg viewBox="0 0 440 210" className="w-full h-48" xmlns="http://www.w3.org/2000/svg">
            {/* Axis grid */}
            <line x1="50" y1="170" x2="400" y2="170" stroke="#CBD5E1" strokeWidth="1" />
            <line x1="50" y1="105" x2="400" y2="105" stroke="#E2E8F0" strokeDasharray="3 3" strokeWidth="1" />
            <line x1="50" y1="40" x2="400" y2="40" stroke="#E2E8F0" strokeDasharray="3 3" strokeWidth="1" />

            {/* Y axis tags */}
            <text x="45" y="173" textAnchor="end" fontSize="9" fill="#94A3B8" fontFamily="monospace">
              ₹{Math.round(minRate).toLocaleString()}
            </text>
            <text x="45" y="44" textAnchor="end" fontSize="9" fill="#94A3B8" fontFamily="monospace">
              ₹{Math.round(maxRate).toLocaleString()}
            </text>

            {/* RR Rate Line (Dashed Slate) */}
            <polyline fill="none" stroke="#64748B" strokeWidth="2" strokeDasharray="4 4" points={pointsRR} />

            {/* Market Rate Line (Solid Blue) */}
            <polyline fill="none" stroke="#2563EB" strokeWidth="3" points={pointsMarket} />

            {/* Data Points */}
            {series.map((d, i) => {
              const x = 50 + (i / (series.length - 1)) * 340;
              const yM = 170 - ((d.marketRate - minRate) / (maxRate - minRate)) * 130;
              return (
                <g key={d.year}>
                  <circle cx={x} cy={yM} r="4" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1.5" />
                  <text x={x} y="190" textAnchor="middle" fontSize="10" fill="#475569" fontWeight="600" fontFamily="monospace">
                    {d.year}
                  </text>
                  <text x={x} y={yM - 8} textAnchor="middle" fontSize="9" fill="#1E293B" fontWeight="bold" fontFamily="monospace">
                    ₹{d.marketRate.toLocaleString()}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="flex justify-center gap-6 text-xs font-mono pt-2 border-t border-slate-200">
            <span className="flex items-center gap-1.5 text-blue-700 font-semibold">
              <span className="w-3 h-0.5 bg-blue-600"></span> Transacted Market Rate
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-0.5 border-t border-dashed border-slate-500"></span> Govt RR Circle Rate
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 2: Gross & Net Rental Yield Calculator (FR-3.5) */}
      <div className="space-y-3 pt-2 border-t border-slate-200">
        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-emerald-600" />
            Interactive Rental Yield Calculator (FR-3.5)
          </h4>
          <p className="text-xs text-slate-500">
            Net Yield % = ((Annual Rent − Annual Maint & Tax) / Total Cost) × 100
          </p>
        </div>

        {/* Highlight Yield Output Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
            <span className="text-[11px] font-semibold text-emerald-800 uppercase block">
              Estimated Net Yield %
            </span>
            <div className="text-2xl font-bold font-mono text-emerald-900 mt-1">
              {yieldResult.netYieldPct}%
            </div>
            <span className="text-[10px] text-emerald-700 mt-0.5 block">
              Post-maintenance & taxes
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-600 uppercase block">
              Gross Yield %
            </span>
            <div className="text-2xl font-bold font-mono text-slate-800 mt-1">
              {yieldResult.grossYieldPct}%
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-0.5">
              Annual Rent: <Rupee className="w-2.5 h-2.5 text-slate-500" />{formatNumberIndian(yieldResult.annualRent)}
            </span>
          </div>
        </div>

        {/* Inputs */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3 text-xs">
          <div>
            <div className="flex justify-between text-slate-700 mb-1">
              <span>Expected Monthly Rent:</span>
              <span className="font-mono font-bold flex items-center gap-0.5">
                <Rupee className="w-3 h-3 text-slate-700" />
                <span>{formatNumberIndian(monthlyRent)} / mo</span>
              </span>
            </div>
            <input
              type="range"
              min="15000"
              max="250000"
              step="1000"
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-700 mb-1">
              <span>Annual Maintenance & Property Tax:</span>
              <span className="font-mono font-bold flex items-center gap-0.5">
                <Rupee className="w-3 h-3 text-slate-700" />
                <span>{formatNumberIndian(annualExpense)} / yr</span>
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max="150000"
              step="2000"
              value={annualExpense}
              onChange={(e) => setAnnualExpense(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* TAB 5: LIVABILITY INDEX COMPONENT (FR-4.1 to FR-4.5)                      */
/* -------------------------------------------------------------------------- */
const LivabilityTab: React.FC<{ project: ProjectData }> = ({ project }) => {
  const [radius, setRadius] = useState<'2km' | '5km'>('2km');
  const { livability } = project;
  const poi = radius === '2km' ? livability.poi2km : livability.poi5km;

  // Composite formula weightages
  // Connectivity: 35%, Social: 40%, Environment: 25%
  const compositeCalc = Math.round(
    livability.connectivity * 0.35 +
    livability.socialInfra * 0.40 +
    livability.environment * 0.25
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-emerald-600" />
          Livability Index & Environmental Audit (FR-4.1 to FR-4.5)
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Standardized score grounded in open infrastructure datasets and municipal disclosures.
        </p>
      </div>

      {/* Radial Composite Gauge & Transparent Formula */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* SVG Circular Radial Gauge */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#334155"
              strokeWidth="10"
            />
            {/* Progress ring */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#10B981"
              strokeWidth="10"
              strokeDasharray={2 * Math.PI * 40}
              strokeDashoffset={2 * Math.PI * 40 * (1 - compositeCalc / 100)}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-mono font-bold text-white">{compositeCalc}</span>
            <span className="text-[10px] uppercase font-mono text-emerald-400">/ 100</span>
          </div>
        </div>

        {/* Transparent Formula Legend */}
        <div className="flex-1 space-y-2 text-xs">
          <span className="text-[11px] font-mono uppercase text-slate-400 block">
            Transparent Weightage Formula (FR-4.1):
          </span>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center bg-slate-800/80 px-2.5 py-1 rounded">
              <span className="text-slate-300">Connectivity (35% weight)</span>
              <span className="font-mono font-bold text-emerald-400">{livability.connectivity}/100</span>
            </div>
            <div className="flex justify-between items-center bg-slate-800/80 px-2.5 py-1 rounded">
              <span className="text-slate-300">Social Infra (40% weight)</span>
              <span className="font-mono font-bold text-emerald-400">{livability.socialInfra}/100</span>
            </div>
            <div className="flex justify-between items-center bg-slate-800/80 px-2.5 py-1 rounded">
              <span className="text-slate-300">Environment (25% weight)</span>
              <span className="font-mono font-bold text-emerald-400">{livability.environment}/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Environmental & Risk Indicators */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
          <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
            <Wind className="w-4 h-4 text-emerald-600" />
            <span>Air Quality Index (AQI)</span>
          </div>
          <div className="text-xl font-mono font-bold text-emerald-800 mt-1">
            AQI: {livability.aqi} ({livability.aqiStatus})
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-700 mt-1">
            <Clock className="w-3 h-3" />
            <span>Refreshed Daily (06:00 IST)</span>
          </div>
        </div>

        <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-center gap-1.5 text-blue-900 font-bold">
            <Shield className="w-4 h-4 text-blue-600" />
            <span>PMC Flood-Risk Zone</span>
          </div>
          <div className="text-base font-bold text-blue-800 mt-1">
            {livability.floodRisk}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-blue-600 mt-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>50-Year Flood History Audited</span>
          </div>
        </div>
      </div>

      {/* Radius Toggle for POI Counts (FR-4.2) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-900">
            Social Infrastructure POI Density (FR-4.2)
          </label>
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-mono">
            <button
              onClick={() => setRadius('2km')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                radius === '2km' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-600'
              }`}
            >
              2 km Radius
            </button>
            <button
              onClick={() => setRadius('5km')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                radius === '5km' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-600'
              }`}
            >
              5 km Radius
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 block">Schools</span>
            <span className="text-xl font-bold font-mono text-slate-900">{poi.schools}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">CBSE / IB / ICSE</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 block">Hospitals</span>
            <span className="text-xl font-bold font-mono text-slate-900">{poi.hospitals}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">NABH Accredited</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 block">Retail Hubs</span>
            <span className="text-xl font-bold font-mono text-slate-900">{poi.retail}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Malls & High-Street</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 block">Banks / ATMs</span>
            <span className="text-xl font-bold font-mono text-slate-900">{poi.banks}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Tier 1 Branches</span>
          </div>
        </div>
      </div>

      {/* Commute Transit Times */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-900 block">
          Key Transit Commute Times (Peak Traffic)
        </label>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-600">Metro Station:</span>
            <span className="font-semibold text-slate-900">{livability.transitTimes.metro}</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-600">Primary IT / Employment Hub:</span>
            <span className="font-semibold text-slate-900">{livability.transitTimes.itHub}</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-600">Pune International Airport:</span>
            <span className="font-semibold text-slate-900">{livability.transitTimes.airport}</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-600">Expressway Highway Corridor:</span>
            <span className="font-semibold text-slate-900">{livability.transitTimes.expressway}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
