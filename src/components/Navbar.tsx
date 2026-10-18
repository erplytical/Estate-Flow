import React from 'react';
import {
  Building2,
  ShieldCheck,
  Layers,
  FileCheck2,
  SlidersHorizontal,
  Scale,
} from 'lucide-react';

export type ActiveView = 'discovery' | 'dedup_engine' | 'canonical_detail';

interface NavbarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  compareCount: number;
  onOpenCompare: () => void;
  onOpenPreferences: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  compareCount,
  onOpenCompare,
  onOpenPreferences,
}) => {
  return (
    <header className="sticky top-0 left-0 right-0 min-h-16 bg-[#0F172A] text-white z-40 border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto min-h-16 px-3 sm:px-6 py-2 sm:py-0 flex flex-wrap items-center justify-between gap-2">
        {/* Left: Brand Identity & Trust Subtitle */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-blue-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base sm:text-lg tracking-tight text-white">Estate Flow</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3 h-3" />
                SRS v1.1
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              RERA-Verified Single-Listing Marketplace
            </p>
          </div>
        </div>

        {/* Center: View Switcher Tabs */}
        <nav className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveView('discovery')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeView === 'discovery'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Discovery & Property Cards
          </button>
          <button
            onClick={() => setActiveView('dedup_engine')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeView === 'dedup_engine'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            Single-Listing & UPI Engine
          </button>
          <button
            onClick={() => setActiveView('canonical_detail')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeView === 'canonical_detail'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Canonical Project Detail
          </button>
        </nav>

        {/* Right: Compare Tray + Edit Preferences */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCompare}
            disabled={compareCount === 0}
            className={`relative px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
              compareCount > 0
                ? 'bg-slate-800 text-white border-blue-500 hover:bg-slate-700 shadow-sm cursor-pointer'
                : 'bg-slate-900/60 text-slate-500 border-slate-800 cursor-not-allowed'
            }`}
            title={compareCount === 0 ? 'Select up to 4 projects to compare' : 'Open comparison matrix'}
          >
            <Scale className="w-3.5 h-3.5 text-blue-400" />
            <span>Compare ({compareCount}/4)</span>
            {compareCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            )}
          </button>

          <button
            onClick={onOpenPreferences}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Edit Intake</span>
            <span className="sm:hidden">Intake</span>
          </button>
        </div>
      </div>
    </header>
  );
};
