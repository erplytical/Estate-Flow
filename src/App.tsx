/**
 * Estate Flow — Verified Real Estate Marketplace Platform (SRS v1.1)
 * Principal Frontend Architecture
 */

import React, { useState, useMemo } from 'react';
import { MOCK_PROJECTS, ProjectData, ProjectConfigType } from './data/mockProjects';
import { Navbar, ActiveView } from './components/Navbar';
import { PreferenceBar, BuyerPreferences } from './components/PreferenceBar';
import { IntakeModal } from './components/IntakeModal';
import { PropertyCard, AnalyticsTab } from './components/PropertyCard';
import { SlideOverDrawer } from './components/SlideOverDrawer';
import { CompareTrayAndModal } from './components/CompareTrayAndModal';
import { WhatsAppModal } from './components/WhatsAppModal';
import { SingleListingEngine } from './components/SingleListingEngine';
import { CanonicalProjectDetail } from './components/CanonicalProjectDetail';
import {
  AlertTriangle,
  CheckCircle2,
  Compass,
  Sparkles,
  SlidersHorizontal,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

const INITIAL_PREFERENCES: BuyerPreferences = {
  configuration: '2 BHK',
  locations: ['Baner', 'Wakad'],
  minBudget: 7500000, // 75 Lakhs
  maxBudget: 12000000, // 1.20 Crore
  nearMetroOnly: false,
  possessionTimeline: 'All',
  purpose: 'Self-Use',
  homeLoanRequired: true,
};

interface FlaggedItem {
  id: string;
  projectName: string;
  reraNumber: string;
  flagReason: string;
  reportedBy: string;
  hoursRemaining: number;
  status: 'In Review' | 'Resolved' | 'Merged';
}

const INITIAL_FLAGS: FlaggedItem[] = [
  {
    id: 'flag-01',
    projectName: 'Sierra Panache Phase 1 (Duplicate Agent Post)',
    reraNumber: 'P52100026772',
    flagReason: 'Duplicate RERA listing with conflicting floor pricing',
    reportedBy: 'Kunal Verma (PropTiger Partner)',
    hoursRemaining: 18,
    status: 'In Review',
  },
  {
    id: 'flag-02',
    projectName: 'Park Connect Boulevard (Typo Address)',
    reraNumber: 'P52100020766',
    flagReason: 'Incorrect sub-locality tag listed as Hinjewadi Phase 3',
    reportedBy: 'Archana S. (Verified Buyer)',
    hoursRemaining: 34,
    status: 'In Review',
  },
];

export default function App() {
  // Navigation & View State
  const [activeView, setActiveView] = useState<ActiveView>('discovery');

  // All Projects in Canonical Store
  const [projectsList, setProjectsList] = useState<ProjectData[]>(MOCK_PROJECTS);

  // Active Canonical Detail Project
  const [canonicalProject, setCanonicalProject] = useState<ProjectData>(MOCK_PROJECTS[0]);

  // Buyer Intake Preferences & Modal
  const [preferences, setPreferences] = useState<BuyerPreferences>(INITIAL_PREFERENCES);
  // Auto-open Guided Intake Modal unless autostart query param is present
  const [intakeModalOpen, setIntakeModalOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('autostart') !== '1';
    }
    return true;
  });

  // FR-6.5 Zero Exact Match Simulation Toggle
  const [simulateZeroExactMatch, setSimulateZeroExactMatch] = useState<boolean>(false);

  // Compare Tray State (max 4)
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareModalOpen, setCompareModalOpen] = useState<boolean>(false);

  // Slide-Over Drawer State
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [drawerProject, setDrawerProject] = useState<ProjectData | null>(null);
  const [drawerInitialTab, setDrawerInitialTab] = useState<AnalyticsTab>('emi');

  // WhatsApp Report Modal State
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState<boolean>(false);
  const [whatsAppProject, setWhatsAppProject] = useState<ProjectData | null>(null);

  // Moderation Flags State
  const [flaggedListings, setFlaggedListings] = useState<FlaggedItem[]>(INITIAL_FLAGS);

  // ---------------------------------------------------------------------------
  // FILTERING LOGIC (2-TIER ARCHITECTURE WITH MANDATORY ZERO-BLANK-STATE FALLBACK)
  // ---------------------------------------------------------------------------
  const { exactMatches, nearMatches } = useMemo(() => {
    if (simulateZeroExactMatch) {
      // Intentionally simulate 0 exact matches to test requirement FR-6.5
      return {
        exactMatches: [] as ProjectData[],
        nearMatches: projectsList.map((p) => {
          let reason = 'Closest match by configuration';
          if (!preferences.locations.includes(p.location)) {
            reason = `Adjacent Micro-Market: ${p.location} (West/East Pune Corridor)`;
          } else {
            reason = `Alternative pricing slab in ${p.location}`;
          }
          return { project: p, reason };
        }),
      };
    }

    const exact: ProjectData[] = [];
    const near: Array<{ project: ProjectData; reason: string }> = [];

    projectsList.forEach((proj) => {
      const config = proj.configs[preferences.configuration];
      const hasConfig = config && config.available;
      const matchesLocation =
        preferences.locations.length === 0 || preferences.locations.includes(proj.location);
      const matchesMetro = !preferences.nearMetroOnly || proj.nearMetro;
      const matchesTimeline =
        preferences.possessionTimeline === 'All' ||
        proj.possessionTimelineCategory === preferences.possessionTimeline;

      const price = hasConfig ? config.basePrice : 0;
      const matchesBudget =
        hasConfig && price >= preferences.minBudget && price <= preferences.maxBudget;

      if (hasConfig && matchesLocation && matchesBudget && matchesMetro && matchesTimeline) {
        exact.push(proj);
      } else {
        // Derive explanatory reason for Tier 2 Near-Matches
        let reason = '';
        if (hasConfig && !matchesLocation) {
          reason = `Adjacent Locality: ${proj.location} (Matches ${preferences.configuration})`;
        } else if (hasConfig && price > preferences.maxBudget) {
          const deltaPct = Math.round(((price - preferences.maxBudget) / preferences.maxBudget) * 100);
          reason = `+${deltaPct}% Above Max Budget (${proj.location})`;
        } else if (hasConfig && price < preferences.minBudget) {
          reason = `Under Budget Value Option (${proj.location})`;
        } else if (!hasConfig) {
          reason = `Config Alternative in ${proj.location}`;
        } else if (!matchesMetro) {
          reason = `${proj.location} (Non-Metro Transit Corridor)`;
        } else {
          reason = `Alternative Timeline in ${proj.location}`;
        }
        near.push({ project: proj, reason });
      }
    });

    return { exactMatches: exact, nearMatches: near };
  }, [projectsList, preferences, simulateZeroExactMatch]);

  // ---------------------------------------------------------------------------
  // INTERACTION HANDLERS
  // ---------------------------------------------------------------------------
  const handleToggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((pId) => pId !== id);
      }
      if (prev.length >= 4) {
        alert('Compare tray limit reached: You can compare up to 4 projects at a time.');
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleOpenAnalytics = (project: ProjectData, tab: AnalyticsTab) => {
    setDrawerProject(project);
    setDrawerInitialTab(tab);
    setDrawerOpen(true);
  };

  const handleOpenWhatsApp = (project: ProjectData) => {
    setWhatsAppProject(project);
    setWhatsAppModalOpen(true);
  };

  const handleViewCanonical = (project: ProjectData) => {
    setCanonicalProject(project);
    setActiveView('canonical_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFlagDuplicate = (project: ProjectData) => {
    const existing = flaggedListings.find((f) => f.reraNumber === project.reraNumber);
    if (existing) {
      alert(`Report noted: Listing ${project.name} is already under 48h active SLA review.`);
      return;
    }
    const newFlag: FlaggedItem = {
      id: `flag-${Date.now()}`,
      projectName: `${project.name} (User Flagged)`,
      reraNumber: project.reraNumber,
      flagReason: 'Suspected duplicate / mismatched pricing reporting',
      reportedBy: 'Verified User Portal',
      hoursRemaining: 48,
      status: 'In Review',
    };
    setFlaggedListings([newFlag, ...flaggedListings]);
    alert(`Success: "${project.name}" has been flagged for Senior Analyst review. SLA countdown: 48 Hours.`);
  };

  const handleResolveFlag = (id: string, action: 'Dismiss' | 'Merge') => {
    setFlaggedListings((prev) => prev.filter((f) => f.id !== id));
    alert(`Moderation Action: Flag ${id} has been marked as ${action === 'Merge' ? 'Merged to Canonical UPI' : 'Dismissed'}.`);
  };

  const handleAddNewProject = (newProject: ProjectData) => {
    setProjectsList((prev) => [newProject, ...prev]);
    setActiveView('discovery');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* ZONE A: TOP GLOBAL NAVIGATION BAR */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        compareCount={compareIds.length}
        onOpenCompare={() => setCompareModalOpen(true)}
        onOpenPreferences={() => setIntakeModalOpen(true)}
      />

      {/* ZONE B: STICKY BUYER PREFERENCE BAR */}
      <PreferenceBar
        preferences={preferences}
        onEditPreferences={() => setIntakeModalOpen(true)}
        simulateZeroExactMatch={simulateZeroExactMatch}
        onToggleSimulateZeroMatch={() => setSimulateZeroExactMatch(!simulateZeroExactMatch)}
      />

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-24">
        {/* VIEW 1: DISCOVERY & 2-TIER PROPERTY CARDS */}
        {activeView === 'discovery' && (
          <div className="space-y-8">
            {/* TIER 1: EXACT MATCHES SECTION */}
            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-xs shadow-emerald-400"></span>
                  <h2 className="text-xl font-bold text-slate-900">
                    Exact Matches for Your Criteria
                  </h2>
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {exactMatches.length} Projects
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  Target Config: <strong className="text-slate-800">{preferences.configuration}</strong>
                </div>
              </div>

              {/* MANDATORY FR-6.5 ZERO-MATCH FALLBACK ALERT */}
              {exactMatches.length === 0 && (
                <div
                  data-testid="zero-match-fallback-banner"
                  className="bg-[#FFFBEB] border border-[#F59E0B] rounded-2xl p-5 text-[#B45309] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm sm:text-base text-amber-950">
                          FR-6.5 Mandatory Fallback: No Exact Match Found
                        </h3>
                        <span className="text-[10px] font-mono font-bold bg-amber-200/80 px-2 py-0.5 rounded text-amber-900">
                          Zero Blank State Guarantee
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-amber-800 mt-1 leading-relaxed">
                        No exact match for your strict budget and micro-market criteria. Showing the <strong>closest verified options</strong> based on your {preferences.configuration} configuration and adjacent Pune hubs below.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIntakeModalOpen(true)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-sm flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap self-end sm:self-center"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Broaden Filters</span>
                  </button>
                </div>
              )}

              {/* Exact Match Cards Grid (2 Columns Desktop) */}
              {exactMatches.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {exactMatches.map((project) => (
                    <PropertyCard
                      key={project.id}
                      project={project}
                      selectedConfig={preferences.configuration}
                      matchType="exact"
                      isCompared={compareIds.includes(project.id)}
                      onToggleCompare={handleToggleCompare}
                      onOpenAnalytics={handleOpenAnalytics}
                      onGetWhatsAppReport={handleOpenWhatsApp}
                      onFlagDuplicate={handleFlagDuplicate}
                      onViewCanonicalDetails={handleViewCanonical}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* TIER 2: SIMILAR PROPERTIES FOUND — NEAR YOUR CRITERIA */}
            <section className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                  <h2 className="text-lg font-bold text-slate-800">
                    Similar Properties Found — Near Your Criteria
                  </h2>
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    {nearMatches.length} Verified Alternatives
                  </span>
                </div>
                <span className="text-xs text-slate-500">
                  Ranked by proximity to target micro-markets &amp; price band
                </span>
              </div>

              {/* Near Match Cards Grid (2 Columns Desktop) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {nearMatches.map(({ project, reason }) => (
                  <PropertyCard
                    key={`near-${project.id}`}
                    project={project}
                    selectedConfig={preferences.configuration}
                    matchType="near"
                    matchReason={reason}
                    isCompared={compareIds.includes(project.id)}
                    onToggleCompare={handleToggleCompare}
                    onOpenAnalytics={handleOpenAnalytics}
                    onGetWhatsAppReport={handleOpenWhatsApp}
                    onFlagDuplicate={handleFlagDuplicate}
                    onViewCanonicalDetails={handleViewCanonical}
                  />
                ))}
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: SINGLE-LISTING & UPI ENGINE TAB (FR-2.1 TO FR-2.6) */}
        {activeView === 'dedup_engine' && (
          <SingleListingEngine
            existingProjects={projectsList}
            onAddNewProject={handleAddNewProject}
            flaggedListings={flaggedListings}
            onResolveFlag={handleResolveFlag}
          />
        )}

        {/* VIEW 3: CANONICAL PROJECT DETAIL VIEW */}
        {activeView === 'canonical_detail' && (
          <CanonicalProjectDetail
            project={canonicalProject}
            selectedConfig={preferences.configuration}
            onBackToDiscovery={() => setActiveView('discovery')}
            onOpenWhatsAppReport={handleOpenWhatsApp}
            onSelectConfig={(newConfig) =>
              setPreferences((prev) => ({ ...prev, configuration: newConfig }))
            }
          />
        )}
      </main>

      {/* ZONE C: GUIDED DISCOVERY INTAKE MODAL */}
      <IntakeModal
        isOpen={intakeModalOpen}
        onClose={() => setIntakeModalOpen(false)}
        currentPreferences={preferences}
        onApplyPreferences={(newPrefs) => {
          setPreferences(newPrefs);
          // When broadening filters, ensure simulation toggle is reset
          setSimulateZeroExactMatch(false);
        }}
      />

      {/* ZONE F: RIGHT SLIDE-OVER ANALYTICS DRAWER */}
      <SlideOverDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        project={drawerProject}
        selectedConfig={preferences.configuration}
        initialTab={drawerInitialTab}
      />

      {/* ZONE G: FLOATING COMPARE TRAY & CLIENT REPORT BUILDER MODAL */}
      <CompareTrayAndModal
        selectedProjectIds={compareIds}
        allProjects={projectsList}
        selectedConfig={preferences.configuration}
        onRemoveProject={handleToggleCompare}
        onClearAll={() => setCompareIds([])}
        isOpenModal={compareModalOpen}
        onOpenModal={() => setCompareModalOpen(true)}
        onCloseModal={() => setCompareModalOpen(false)}
      />

      {/* ZONE G: WHATSAPP REPORT DELIVERY & OTP MODAL */}
      <WhatsAppModal
        isOpen={whatsAppModalOpen}
        onClose={() => setWhatsAppModalOpen(false)}
        project={whatsAppProject}
        selectedConfig={preferences.configuration}
      />
    </div>
  );
}
