/**
 * Deterministic Mock Dataset for Estate Flow — Verified Real Estate Marketplace
 * 6 Realistic Pune Projects with complete pricing matrices for all BHKs & Asset Classes
 */

export type ProjectConfigType =
  | '1 BHK'
  | '2 BHK'
  | '3 BHK'
  | '4 BHK'
  | 'Villa'
  | 'Plot'
  | 'Commercial';

export interface UnitConfigDetails {
  available: boolean;
  basePrice: number; // in INR
  carpetAreaSqFt: number;
  expectedMonthlyRent: number;
  annualMaintenanceAndTax: number;
  typicalFloor?: string;
  balconies?: number;
  bathrooms?: number;
}

export interface POICount {
  schools: number;
  hospitals: number;
  retail: number;
  banks: number;
}

export interface HistoricalPricePoint {
  year: number;
  marketRate: number; // per sq ft
  rrRate: number; // Govt ready reckoner per sq ft
  registrationVolume: number;
}

export interface LegalClearance {
  id: string;
  name: string;
  authority: string;
  status: 'Approved' | 'Verified' | 'Exempt';
  certificateNo: string;
  date: string;
}

export interface ConstructionMilestone {
  stage: string;
  progressPct: number;
  targetDate: string;
  completed: boolean;
}

export interface ProjectData {
  id: string;
  name: string;
  developer: string;
  reraNumber: string;
  upi: string;
  location: 'Baner' | 'Wakad' | 'Hinjewadi' | 'Kharadi' | 'Koregaon Park' | 'Balewadi';
  subLocality: string;
  coordinates: { lat: number; lng: number };
  stage: 'Under Construction' | 'Ready to Move';
  possessionDate: string;
  possessionTimelineCategory: 'Ready to Move' | 'Within 1 Yr' | '1–3 Yrs';
  nearMetro: boolean;
  architecturalStyle: 'contemporary' | 'highrise' | 'eco_luxury' | 'skyline' | 'podium' | 'minimalist';
  overview: string;
  configs: Record<ProjectConfigType, UnitConfigDetails>;
  livability: {
    compositeScore: number;
    connectivity: number;
    socialInfra: number;
    environment: number;
    aqi: number;
    aqiStatus: string;
    floodRisk: string;
    transitTimes: {
      metro: string;
      itHub: string;
      airport: string;
      expressway: string;
    };
    poi2km: POICount;
    poi5km: POICount;
  };
  valuation: {
    rrRatePerSqFt: number; // Ready Reckoner rate
    developerQuotedPerSqFt: number;
    recentRegisteredAvgPerSqFt: number;
    trend5Yr: HistoricalPricePoint[];
    trend10Yr: HistoricalPricePoint[];
  };
  amenities: string[];
  constructionMilestones: ConstructionMilestone[];
  overallProgress: number; // 0-100%
  legalClearances: LegalClearance[];
  lastUpdated: string;
  dataSource: string;
}

export const MOCK_PROJECTS: ProjectData[] = [
  {
    id: 'ef-pune-01',
    name: 'VTP Sierra Panache',
    developer: 'VTP Realty (Verified Developer A+)',
    reraNumber: 'P52100026772',
    upi: 'EF-9F8A-2026',
    location: 'Baner',
    subLocality: 'Sus-Baner Foothills, Off Highway',
    coordinates: { lat: 18.5583, lng: 73.7749 },
    stage: 'Under Construction',
    possessionDate: 'March 2027',
    possessionTimelineCategory: '1–3 Yrs',
    nearMetro: true,
    architecturalStyle: 'contemporary',
    overview: 'High-density luxury residential enclave with cantilever balconies, smart home automation, and views of Baner hill reserve.',
    configs: {
      '1 BHK': {
        available: true,
        basePrice: 5800000,
        carpetAreaSqFt: 510,
        expectedMonthlyRent: 22000,
        annualMaintenanceAndTax: 24000,
        typicalFloor: '2nd-14th',
        balconies: 1,
        bathrooms: 1,
      },
      '2 BHK': {
        available: true,
        basePrice: 9450000,
        carpetAreaSqFt: 785,
        expectedMonthlyRent: 33000,
        annualMaintenanceAndTax: 36000,
        typicalFloor: '3rd-22nd',
        balconies: 2,
        bathrooms: 2,
      },
      '3 BHK': {
        available: true,
        basePrice: 14200000,
        carpetAreaSqFt: 1140,
        expectedMonthlyRent: 48000,
        annualMaintenanceAndTax: 52000,
        typicalFloor: '5th-28th',
        balconies: 2,
        bathrooms: 3,
      },
      '4 BHK': {
        available: true,
        basePrice: 22500000,
        carpetAreaSqFt: 1720,
        expectedMonthlyRent: 72000,
        annualMaintenanceAndTax: 78000,
        typicalFloor: '18th-30th Penthouse',
        balconies: 3,
        bathrooms: 4,
      },
      'Villa': {
        available: false,
        basePrice: 0,
        carpetAreaSqFt: 0,
        expectedMonthlyRent: 0,
        annualMaintenanceAndTax: 0,
      },
      'Plot': {
        available: false,
        basePrice: 0,
        carpetAreaSqFt: 0,
        expectedMonthlyRent: 0,
        annualMaintenanceAndTax: 0,
      },
      'Commercial': {
        available: true,
        basePrice: 11000000,
        carpetAreaSqFt: 620,
        expectedMonthlyRent: 65000,
        annualMaintenanceAndTax: 42000,
        typicalFloor: 'Ground Floor High Street Retail',
        balconies: 0,
        bathrooms: 1,
      },
    },
    livability: {
      compositeScore: 86,
      connectivity: 88,
      socialInfra: 85,
      environment: 84,
      aqi: 68,
      aqiStatus: 'Moderate',
      floodRisk: 'Low Risk Zone',
      transitTimes: {
        metro: '6 mins (Baner Phata Metro Station, Line 3)',
        itHub: '14 mins (Hinjewadi Phase 1)',
        airport: '42 mins (Pune International Lohegaon)',
        expressway: '8 mins (Mumbai-Pune Expressway Exit)',
      },
      poi2km: { schools: 7, hospitals: 4, retail: 12, banks: 9 },
      poi5km: { schools: 19, hospitals: 14, retail: 34, banks: 26 },
    },
    valuation: {
      rrRatePerSqFt: 7800,
      developerQuotedPerSqFt: 11900,
      recentRegisteredAvgPerSqFt: 11250,
      trend5Yr: [
        { year: 2022, marketRate: 8400, rrRate: 6400, registrationVolume: 420 },
        { year: 2023, marketRate: 9200, rrRate: 6900, registrationVolume: 510 },
        { year: 2024, marketRate: 10100, rrRate: 7200, registrationVolume: 580 },
        { year: 2025, marketRate: 11100, rrRate: 7500, registrationVolume: 640 },
        { year: 2026, marketRate: 11900, rrRate: 7800, registrationVolume: 710 },
      ],
      trend10Yr: [
        { year: 2017, marketRate: 5900, rrRate: 4600, registrationVolume: 290 },
        { year: 2019, marketRate: 6800, rrRate: 5300, registrationVolume: 340 },
        { year: 2021, marketRate: 7700, rrRate: 6000, registrationVolume: 390 },
        { year: 2023, marketRate: 9200, rrRate: 6900, registrationVolume: 510 },
        { year: 2025, marketRate: 11100, rrRate: 7500, registrationVolume: 640 },
        { year: 2026, marketRate: 11900, rrRate: 7800, registrationVolume: 710 },
      ],
    },
    amenities: [
      'Infinity Lap Pool & Kids Splash',
      'Double-height Badminton Court',
      'EV Charging Bays (100% allocation)',
      'Co-Working Lounge with Fiber Line',
      'Rooftop Stargazing Deck',
      'Multitier 24/7 RFID Security',
    ],
    constructionMilestones: [
      { stage: 'Excavation & Deep Piling', progressPct: 100, targetDate: 'Q1 2024', completed: true },
      { stage: 'Substructure & 3 Basements', progressPct: 100, targetDate: 'Q4 2024', completed: true },
      { stage: 'RCC Slab Superstructure (22/30 floors)', progressPct: 75, targetDate: 'Q2 2026', completed: false },
      { stage: 'Internal MEP & Brickwork', progressPct: 40, targetDate: 'Q4 2026', completed: false },
      { stage: 'Final Finishes & OC Filing', progressPct: 0, targetDate: 'Q1 2027', completed: false },
    ],
    overallProgress: 68,
    legalClearances: [
      { id: 'lc-1', name: 'MahaRERA Registration Certificate', authority: 'MahaRERA Authority', status: 'Approved', certificateNo: 'MHA/PUN/2022/P52100026772', date: '14 May 2022' },
      { id: 'lc-2', name: 'Commencement Certificate (CC)', authority: 'Pune Municipal Corporation (PMC)', status: 'Approved', certificateNo: 'PMC/EZ/CC/4820/22', date: '02 Feb 2022' },
      { id: 'lc-3', name: 'Environmental Clearance (SEAC-III)', authority: 'Environment Dept Maharashtra', status: 'Approved', certificateNo: 'ENV-2022/CR-91/TC-3', date: '19 Aug 2022' },
      { id: 'lc-4', name: 'Aviation Height Clearance', authority: 'Airports Authority of India (AAI)', status: 'Approved', certificateNo: 'AAI/W-NOC/2021/883', date: '11 Nov 2021' },
      { id: 'lc-5', name: 'Fire Department Provisional NOC', authority: 'Chief Fire Officer PMC', status: 'Approved', certificateNo: 'CFO/PMC/NOC/2022/104', date: '29 Jan 2022' },
    ],
    lastUpdated: '17 Oct 2026, 09:30 IST',
    dataSource: 'MahaRERA & IGR Maharashtra',
  },
  {
    id: 'ef-pune-02',
    name: 'Pride Purple Park Connect',
    developer: 'Pride Purple Group (Verified Developer A+)',
    reraNumber: 'P52100020766',
    upi: 'EF-3C1E-2026',
    location: 'Hinjewadi',
    subLocality: 'Hinjewadi Phase 1, Near Infosys Circle',
    coordinates: { lat: 18.5912, lng: 73.7389 },
    stage: 'Under Construction',
    possessionDate: 'November 2026',
    possessionTimelineCategory: 'Within 1 Yr',
    nearMetro: true,
    architecturalStyle: 'highrise',
    overview: 'Tech corridor canonical community engineered for IT professionals, located 400 meters from upcoming Line 3 Metro station.',
    configs: {
      '1 BHK': {
        available: false,
        basePrice: 0,
        carpetAreaSqFt: 0,
        expectedMonthlyRent: 0,
        annualMaintenanceAndTax: 0,
      },
      '2 BHK': {
        available: true,
        basePrice: 8200000,
        carpetAreaSqFt: 730,
        expectedMonthlyRent: 29000,
        annualMaintenanceAndTax: 32000,
        typicalFloor: '4th-19th',
        balconies: 1,
        bathrooms: 2,
      },
      '3 BHK': {
        available: true,
        basePrice: 11800000,
        carpetAreaSqFt: 1040,
        expectedMonthlyRent: 41000,
        annualMaintenanceAndTax: 45000,
        typicalFloor: '6th-24th',
        balconies: 2,
        bathrooms: 3,
      },
      '4 BHK': {
        available: false,
        basePrice: 0,
        carpetAreaSqFt: 0,
        expectedMonthlyRent: 0,
        annualMaintenanceAndTax: 0,
      },
      'Villa': {
        available: false,
        basePrice: 0,
        carpetAreaSqFt: 0,
        expectedMonthlyRent: 0,
        annualMaintenanceAndTax: 0,
      },
      'Plot': {
        available: false,
        basePrice: 0,
        carpetAreaSqFt: 0,
        expectedMonthlyRent: 0,
        annualMaintenanceAndTax: 0,
      },
      'Commercial': {
        available: false,
        basePrice: 0,
        carpetAreaSqFt: 0,
        expectedMonthlyRent: 0,
        annualMaintenanceAndTax: 0,
      },
    },
    livability: {
      compositeScore: 84,
      connectivity: 92,
      socialInfra: 80,
      environment: 78,
      aqi: 72,
      aqiStatus: 'Moderate',
      floodRisk: 'Zero Flood Zone',
      transitTimes: {
        metro: '3 mins (Hinjewadi Megapolis Station)',
        itHub: '4 mins (Infosys, Wipro, Cognizant SEZ)',
        airport: '50 mins (Pune Airport)',
        expressway: '6 mins (Bhumkar Chowk)',
      },
      poi2km: { schools: 5, hospitals: 3, retail: 14, banks: 8 },
      poi5km: { schools: 14, hospitals: 10, retail: 30, banks: 22 },
    },
    valuation: {
      rrRatePerSqFt: 6900,
      developerQuotedPerSqFt: 11100,
      recentRegisteredAvgPerSqFt: 10600,
      trend5Yr: [
        { year: 2022, marketRate: 7200, rrRate: 5600, registrationVolume: 610 },
        { year: 2023, marketRate: 8100, rrRate: 6000, registrationVolume: 690 },
        { year: 2024, marketRate: 9100, rrRate: 6300, registrationVolume: 740 },
        { year: 2025, marketRate: 10200, rrRate: 6600, registrationVolume: 820 },
        { year: 2026, marketRate: 11100, rrRate: 6900, registrationVolume: 890 },
      ],
      trend10Yr: [
        { year: 2017, marketRate: 4900, rrRate: 4100, registrationVolume: 380 },
        { year: 2019, marketRate: 5800, rrRate: 4700, registrationVolume: 440 },
        { year: 2021, marketRate: 6600, rrRate: 5200, registrationVolume: 530 },
        { year: 2023, marketRate: 8100, rrRate: 6000, registrationVolume: 690 },
        { year: 2025, marketRate: 10200, rrRate: 6600, registrationVolume: 820 },
        { year: 2026, marketRate: 11100, rrRate: 6900, registrationVolume: 890 },
      ],
    },
    amenities: [
      'Semi-Olympic Lap Pool',
      'Squash Court & Turf Futsal',
      'High-Speed Working Hub',
      'Convenience Supermarket on Campus',
      'Electric Shuttle to Metro Hub',
    ],
    constructionMilestones: [
      { stage: 'Excavation & Foundations', progressPct: 100, targetDate: 'Q3 2023', completed: true },
      { stage: 'RCC Superstructure (24 floors)', progressPct: 100, targetDate: 'Q1 2025', completed: true },
      { stage: 'Façade Glazing & External Plaster', progressPct: 90, targetDate: 'Q3 2025', completed: true },
      { stage: 'Elevators & Electrical Substations', progressPct: 80, targetDate: 'Q1 2026', completed: false },
      { stage: 'Final Handover Documentation', progressPct: 20, targetDate: 'Nov 2026', completed: false },
    ],
    overallProgress: 88,
    legalClearances: [
      { id: 'lc-pride-1', name: 'MahaRERA Registration Certificate', authority: 'MahaRERA Authority', status: 'Approved', certificateNo: 'MHA/PUN/2020/P52100020766', date: '19 Jan 2020' },
      { id: 'lc-pride-2', name: 'Plinth Completion Certificate', authority: 'MIDC Urban Planning', status: 'Approved', certificateNo: 'MIDC/ENG/PLN/992/20', date: '04 Oct 2020' },
      { id: 'lc-pride-3', name: 'State Forest & Eco Clearance', authority: 'Forest Dept Maharashtra', status: 'Approved', certificateNo: 'FD/MH/ECO/3382', date: '12 Dec 2019' },
    ],
    lastUpdated: '17 Oct 2026, 09:30 IST',
    dataSource: 'MahaRERA & IGR Maharashtra',
  },
  {
    id: 'ef-pune-03',
    name: 'Kolte Patil Western Avenue',
    developer: 'Kolte-Patil Developers Ltd. (BSE/NSE Listed)',
    reraNumber: 'P52100000917',
    upi: 'EF-4A7B-2026',
    location: 'Wakad',
    subLocality: 'Shankar Kalat Nagar, Near Datta Mandir Road',
    coordinates: { lat: 18.5988, lng: 73.7634 },
    stage: 'Ready to Move',
    possessionDate: 'Immediate (OC Received)',
    possessionTimelineCategory: 'Ready to Move',
    nearMetro: false,
    architecturalStyle: 'podium',
    overview: 'Fully completed, OC-received luxury residential campus with active society, zero GST liability, and direct access to Mumbai-Pune highway.',
    configs: {
      '1 BHK': {
        available: false,
        basePrice: 0,
        carpetAreaSqFt: 0,
        expectedMonthlyRent: 0,
        annualMaintenanceAndTax: 0,
      },
      '2 BHK': {
        available: true,
        basePrice: 8900000,
        carpetAreaSqFt: 770,
        expectedMonthlyRent: 31000,
        annualMaintenanceAndTax: 30000,
        typicalFloor: 'Ready Units on 7th-12th',
        balconies: 2,
        bathrooms: 2,
      },
      '3 BHK': {
        available: true,
        basePrice: 12900000,
        carpetAreaSqFt: 1090,
        expectedMonthlyRent: 43000,
        annualMaintenanceAndTax: 42000,
        typicalFloor: 'Ready Units on 9th-14th',
        balconies: 2,
        bathrooms: 3,
      },
      '4 BHK': {
        available: false,
        basePrice: 0,
        carpetAreaSqFt: 0,
        expectedMonthlyRent: 0,
        annualMaintenanceAndTax: 0,
      },
      'Villa': {
        available: false,
        basePrice: 0,
        carpetAreaSqFt: 0,
        expectedMonthlyRent: 0,
        annualMaintenanceAndTax: 0,
      },
      'Plot': {
        available: false,
        basePrice: 0,
        carpetAreaSqFt: 0,
        expectedMonthlyRent: 0,
        annualMaintenanceAndTax: 0,
      },
      'Commercial': {
        available: true,
        basePrice: 9800000,
        carpetAreaSqFt: 540,
        expectedMonthlyRent: 55000,
        annualMaintenanceAndTax: 35000,
        typicalFloor: 'Street Retail Ready',
        balconies: 0,
        bathrooms: 1,
      },
    },
    livability: {
      compositeScore: 89,
      connectivity: 90,
      socialInfra: 92,
      environment: 82,
      aqi: 62,
      aqiStatus: 'Good',
      floodRisk: 'Low Risk Zone',
      transitTimes: {
        metro: '9 mins (Balewadi Stadium Station)',
        itHub: '8 mins (Hinjewadi Tech Hub)',
        airport: '45 mins (Lohegaon)',
        expressway: '3 mins (Wakad Flyover)',
      },
      poi2km: { schools: 11, hospitals: 6, retail: 22, banks: 14 },
      poi5km: { schools: 28, hospitals: 19, retail: 52, banks: 38 },
    },
    valuation: {
      rrRatePerSqFt: 7400,
      developerQuotedPerSqFt: 11500,
      recentRegisteredAvgPerSqFt: 11050,
      trend5Yr: [
        { year: 2022, marketRate: 7900, rrRate: 6100, registrationVolume: 490 },
        { year: 2023, marketRate: 8800, rrRate: 6500, registrationVolume: 560 },
        { year: 2024, marketRate: 9800, rrRate: 6800, registrationVolume: 620 },
        { year: 2025, marketRate: 10700, rrRate: 7100, registrationVolume: 680 },
        { year: 2026, marketRate: 11500, rrRate: 7400, registrationVolume: 740 },
      ],
      trend10Yr: [
        { year: 2017, marketRate: 5400, rrRate: 4400, registrationVolume: 310 },
        { year: 2019, marketRate: 6300, rrRate: 5000, registrationVolume: 370 },
        { year: 2021, marketRate: 7100, rrRate: 5600, registrationVolume: 430 },
        { year: 2023, marketRate: 8800, rrRate: 6500, registrationVolume: 560 },
        { year: 2025, marketRate: 10700, rrRate: 7100, registrationVolume: 680 },
        { year: 2026, marketRate: 11500, rrRate: 7400, registrationVolume: 740 },
      ],
    },
    amenities: [
      'Full Occupancy Certificate (0% GST)',
      'Clubhouse with Gymnasium & Yoga Studio',
      'Children Play Sanctuary',
      'Senior Citizen Pavilion',
      'Piped Natural Gas (MNGL) Connection',
      'Treated Water Softener Plant',
    ],
    constructionMilestones: [
      { stage: 'Civil Construction All Wings', progressPct: 100, targetDate: 'Completed', completed: true },
      { stage: 'PMC Occupancy Certificate (OC)', progressPct: 100, targetDate: 'Received', completed: true },
      { stage: 'Society Formation & Handover', progressPct: 100, targetDate: 'Operational', completed: true },
    ],
    overallProgress: 100,
    legalClearances: [
      { id: 'lc-kolte-1', name: 'MahaRERA Registration Certificate', authority: 'MahaRERA Authority', status: 'Approved', certificateNo: 'MHA/PUN/2016/P52100000917', date: '21 Sep 2016' },
      { id: 'lc-kolte-2', name: 'Full Occupancy Certificate (OC)', authority: 'Pimpri-Chinchwad Municipal Corp (PCMC)', status: 'Approved', certificateNo: 'PCMC/BPD/OC/2023/182', date: '14 Nov 2023' },
      { id: 'lc-kolte-3', name: 'Final Fire NOC', authority: 'PCMC Chief Fire Office', status: 'Approved', certificateNo: 'FIRE/PCMC/FN/2023/89', date: '02 Oct 2023' },
    ],
    lastUpdated: '17 Oct 2026, 09:30 IST',
    dataSource: 'MahaRERA & IGR Maharashtra',
  },
  {
    id: 'ef-pune-04',
    name: 'Panchshil Towers',
    developer: 'Panchshil Realty (Ultra-Luxury Pioneer)',
    reraNumber: 'P52100002528',
    upi: 'EF-8B2F-2026',
    location: 'Kharadi',
    subLocality: 'EON Free Zone Annex, Kharadi Riverfront',
    coordinates: { lat: 18.5529, lng: 73.9532 },
    stage: 'Ready to Move',
    possessionDate: 'Immediate',
    possessionTimelineCategory: 'Ready to Move',
    nearMetro: true,
    architecturalStyle: 'skyline',
    overview: 'Iconic 34-storey towers featuring floor-to-ceiling double-glazed unitized glass façades, 3-tier security, and direct walkway to EON IT Park.',
    configs: {
      '1 BHK': {
        available: false,
        basePrice: 0,
        carpetAreaSqFt: 0,
        expectedMonthlyRent: 0,
        annualMaintenanceAndTax: 0,
      },
      '2 BHK': {
        available: false,
        basePrice: 0,
        carpetAreaSqFt: 0,
        expectedMonthlyRent: 0,
        annualMaintenanceAndTax: 0,
      },
      '3 BHK': {
        available: true,
        basePrice: 24500000,
        carpetAreaSqFt: 1840,
        expectedMonthlyRent: 85000,
        annualMaintenanceAndTax: 84000,
        typicalFloor: '10th-25th',
        balconies: 3,
        bathrooms: 4,
      },
      '4 BHK': {
        available: true,
        basePrice: 38500000,
        carpetAreaSqFt: 2860,
        expectedMonthlyRent: 135000,
        annualMaintenanceAndTax: 120000,
        typicalFloor: '15th-32nd',
        balconies: 4,
        bathrooms: 5,
      },
      'Villa': {
        available: true,
        basePrice: 52000000,
        carpetAreaSqFt: 4200,
        expectedMonthlyRent: 190000,
        annualMaintenanceAndTax: 160000,
        typicalFloor: 'Signature Podium Villa with Private Lawn',
        balconies: 4,
        bathrooms: 6,
      },
      'Plot': {
        available: false,
        basePrice: 0,
        carpetAreaSqFt: 0,
        expectedMonthlyRent: 0,
        annualMaintenanceAndTax: 0,
      },
      'Commercial': {
        available: false,
        basePrice: 0,
        carpetAreaSqFt: 0,
        expectedMonthlyRent: 0,
        annualMaintenanceAndTax: 0,
      },
    },
    livability: {
      compositeScore: 92,
      connectivity: 94,
      socialInfra: 93,
      environment: 87,
      aqi: 54,
      aqiStatus: 'Good',
      floodRisk: 'Low Risk Zone',
      transitTimes: {
        metro: '5 mins (Ramwadi Metro Interchange)',
        itHub: '2 mins (EON IT Park & World Trade Center)',
        airport: '18 mins (Pune International Airport)',
        expressway: '25 mins (Nagar Road Expressway)',
      },
      poi2km: { schools: 8, hospitals: 5, retail: 18, banks: 16 },
      poi5km: { schools: 24, hospitals: 16, retail: 45, banks: 35 },
    },
    valuation: {
      rrRatePerSqFt: 8800,
      developerQuotedPerSqFt: 13400,
      recentRegisteredAvgPerSqFt: 12900,
      trend5Yr: [
        { year: 2022, marketRate: 9800, rrRate: 7100, registrationVolume: 210 },
        { year: 2023, marketRate: 10900, rrRate: 7600, registrationVolume: 260 },
        { year: 2024, marketRate: 11800, rrRate: 8000, registrationVolume: 310 },
        { year: 2025, marketRate: 12600, rrRate: 8400, registrationVolume: 350 },
        { year: 2026, marketRate: 13400, rrRate: 8800, registrationVolume: 410 },
      ],
      trend10Yr: [
        { year: 2017, marketRate: 6900, rrRate: 5200, registrationVolume: 150 },
        { year: 2019, marketRate: 7900, rrRate: 5900, registrationVolume: 180 },
        { year: 2021, marketRate: 8900, rrRate: 6500, registrationVolume: 200 },
        { year: 2023, marketRate: 10900, rrRate: 7600, registrationVolume: 260 },
        { year: 2025, marketRate: 12600, rrRate: 8400, registrationVolume: 350 },
        { year: 2026, marketRate: 13400, rrRate: 8800, registrationVolume: 410 },
      ],
    },
    amenities: [
      '50,000 sq.ft. Luxury Clubhouse (The Pavilion)',
      'Temperature Controlled Indoor Pool',
      'Private Squash & Tennis Academy',
      'Concierge Desk & Valet Parking',
      'Double Glazed Façade Soundproofing',
    ],
    constructionMilestones: [
      { stage: 'All Towers Structural Superstructure', progressPct: 100, targetDate: 'Completed', completed: true },
      { stage: 'Façade & Curtain Glazing', progressPct: 100, targetDate: 'Completed', completed: true },
      { stage: 'Full OC Granted by PMC', progressPct: 100, targetDate: 'Received', completed: true },
    ],
    overallProgress: 100,
    legalClearances: [
      { id: 'lc-panch-1', name: 'MahaRERA Registration Certificate', authority: 'MahaRERA Authority', status: 'Approved', certificateNo: 'MHA/PUN/2017/P52100002528', date: '10 Aug 2017' },
      { id: 'lc-panch-2', name: 'Occupancy Certificate (Phased OC)', authority: 'PMC Building Dept', status: 'Approved', certificateNo: 'PMC/OC/2021/771', date: '18 Nov 2021' },
      { id: 'lc-panch-3', name: 'Aviation Clearance for 34 Storeys', authority: 'AAI Western Region', status: 'Approved', certificateNo: 'AAI/NOC/2016/542', date: '04 Mar 2016' },
    ],
    lastUpdated: '17 Oct 2026, 09:30 IST',
    dataSource: 'MahaRERA & IGR Maharashtra',
  },
  {
    id: 'ef-pune-05',
    name: 'Marvel Basilo Heritage',
    developer: 'Marvel Developers & Landbase (Verified)',
    reraNumber: 'P52100018991',
    upi: 'EF-5E3D-2026',
    location: 'Koregaon Park',
    subLocality: 'Lane 7, Near Osho Greens & Bund Garden',
    coordinates: { lat: 18.5362, lng: 73.8958 },
    stage: 'Under Construction',
    possessionDate: 'December 2026',
    possessionTimelineCategory: 'Within 1 Yr',
    nearMetro: false,
    architecturalStyle: 'eco_luxury',
    overview: 'Boutique single-floor residences amidst old-growth rain trees in Pune’s most prestigious heritage pin code.',
    configs: {
      '1 BHK': {
        available: false,
        basePrice: 0,
        carpetAreaSqFt: 0,
        expectedMonthlyRent: 0,
        annualMaintenanceAndTax: 0,
      },
      '2 BHK': {
        available: false,
        basePrice: 0,
        carpetAreaSqFt: 0,
        expectedMonthlyRent: 0,
        annualMaintenanceAndTax: 0,
      },
      '3 BHK': {
        available: true,
        basePrice: 29500000,
        carpetAreaSqFt: 1980,
        expectedMonthlyRent: 95000,
        annualMaintenanceAndTax: 92000,
        typicalFloor: '2nd-6th',
        balconies: 3,
        bathrooms: 4,
      },
      '4 BHK': {
        available: true,
        basePrice: 46000000,
        carpetAreaSqFt: 3150,
        expectedMonthlyRent: 160000,
        annualMaintenanceAndTax: 140000,
        typicalFloor: '7th-11th Panoramic',
        balconies: 4,
        bathrooms: 5,
      },
      'Villa': {
        available: false,
        basePrice: 0,
        carpetAreaSqFt: 0,
        expectedMonthlyRent: 0,
        annualMaintenanceAndTax: 0,
      },
      'Plot': {
        available: false,
        basePrice: 0,
        carpetAreaSqFt: 0,
        expectedMonthlyRent: 0,
        annualMaintenanceAndTax: 0,
      },
      'Commercial': {
        available: false,
        basePrice: 0,
        carpetAreaSqFt: 0,
        expectedMonthlyRent: 0,
        annualMaintenanceAndTax: 0,
      },
    },
    livability: {
      compositeScore: 94,
      connectivity: 89,
      socialInfra: 98,
      environment: 95,
      aqi: 48,
      aqiStatus: 'Good',
      floodRisk: 'Zero Flood Zone',
      transitTimes: {
        metro: '12 mins (Kalyani Nagar Metro)',
        itHub: '16 mins (Magarpatta Cybercity)',
        airport: '15 mins (Lohegaon)',
        expressway: '20 mins (Pune Railway Station / NH48)',
      },
      poi2km: { schools: 14, hospitals: 9, retail: 28, banks: 20 },
      poi5km: { schools: 38, hospitals: 26, retail: 70, banks: 48 },
    },
    valuation: {
      rrRatePerSqFt: 10500,
      developerQuotedPerSqFt: 14900,
      recentRegisteredAvgPerSqFt: 14200,
      trend5Yr: [
        { year: 2022, marketRate: 11200, rrRate: 8800, registrationVolume: 120 },
        { year: 2023, marketRate: 12100, rrRate: 9200, registrationVolume: 140 },
        { year: 2024, marketRate: 13000, rrRate: 9700, registrationVolume: 160 },
        { year: 2025, marketRate: 13900, rrRate: 10100, registrationVolume: 190 },
        { year: 2026, marketRate: 14900, rrRate: 10500, registrationVolume: 220 },
      ],
      trend10Yr: [
        { year: 2017, marketRate: 8500, rrRate: 6800, registrationVolume: 90 },
        { year: 2019, marketRate: 9400, rrRate: 7500, registrationVolume: 110 },
        { year: 2021, marketRate: 10400, rrRate: 8200, registrationVolume: 115 },
        { year: 2023, marketRate: 12100, rrRate: 9200, registrationVolume: 140 },
        { year: 2025, marketRate: 13900, rrRate: 10100, registrationVolume: 190 },
        { year: 2026, marketRate: 14900, rrRate: 10500, registrationVolume: 220 },
      ],
    },
    amenities: [
      'Private Plunge Pool on Every Sundeck',
      'Italian Marble Floorings Throughout',
      'VRV Central Air Conditioning',
      'Cordon Bleu Resident Dining Lounge',
      'Thermal Insulated Facade Panels',
    ],
    constructionMilestones: [
      { stage: 'Basement & Podiums', progressPct: 100, targetDate: 'Q2 2024', completed: true },
      { stage: 'Superstructure (12 Storeys)', progressPct: 100, targetDate: 'Q1 2026', completed: true },
      { stage: 'Plumbing, AC & Interior Fitouts', progressPct: 85, targetDate: 'Q3 2026', completed: false },
      { stage: 'PMC Completion Certificate', progressPct: 30, targetDate: 'Dec 2026', completed: false },
    ],
    overallProgress: 90,
    legalClearances: [
      { id: 'lc-marv-1', name: 'MahaRERA Registration Certificate', authority: 'MahaRERA Authority', status: 'Approved', certificateNo: 'MHA/PUN/2019/P52100018991', date: '28 Feb 2019' },
      { id: 'lc-marv-2', name: 'Heritage Zone Development Approval', authority: 'PMC Heritage Committee', status: 'Approved', certificateNo: 'PMC/HER/APP/821', date: '16 Nov 2018' },
      { id: 'lc-marv-3', name: 'Tree Conservation NOC', authority: 'Tree Authority PMC', status: 'Approved', certificateNo: 'TA/PMC/NOC/2019/43', date: '08 Jan 2019' },
    ],
    lastUpdated: '17 Oct 2026, 09:30 IST',
    dataSource: 'MahaRERA & IGR Maharashtra',
  },
  {
    id: 'ef-pune-06',
    name: 'Balewadi High Street Horizon',
    developer: 'Mittal Brothers & Supreme Universal (Verified)',
    reraNumber: 'P52100032145',
    upi: 'EF-7D9C-2026',
    location: 'Balewadi',
    subLocality: 'Balewadi High Street, Near MITCON',
    coordinates: { lat: 18.5741, lng: 73.7712 },
    stage: 'Under Construction',
    possessionDate: 'June 2027',
    possessionTimelineCategory: '1–3 Yrs',
    nearMetro: true,
    architecturalStyle: 'minimalist',
    overview: 'Urban-centric residences directly behind High Street dining boulevard, with podium amenities and solar microgrid.',
    configs: {
      '1 BHK': {
        available: true,
        basePrice: 6200000,
        carpetAreaSqFt: 535,
        expectedMonthlyRent: 24000,
        annualMaintenanceAndTax: 25000,
        typicalFloor: '3rd-10th',
        balconies: 1,
        bathrooms: 1,
      },
      '2 BHK': {
        available: true,
        basePrice: 9900000,
        carpetAreaSqFt: 810,
        expectedMonthlyRent: 35000,
        annualMaintenanceAndTax: 38000,
        typicalFloor: '4th-20th',
        balconies: 2,
        bathrooms: 2,
      },
      '3 BHK': {
        available: true,
        basePrice: 15400000,
        carpetAreaSqFt: 1190,
        expectedMonthlyRent: 51000,
        annualMaintenanceAndTax: 54000,
        typicalFloor: '5th-22nd',
        balconies: 2,
        bathrooms: 3,
      },
      '4 BHK': {
        available: false,
        basePrice: 0,
        carpetAreaSqFt: 0,
        expectedMonthlyRent: 0,
        annualMaintenanceAndTax: 0,
      },
      'Villa': {
        available: false,
        basePrice: 0,
        carpetAreaSqFt: 0,
        expectedMonthlyRent: 0,
        annualMaintenanceAndTax: 0,
      },
      'Plot': {
        available: false,
        basePrice: 0,
        carpetAreaSqFt: 0,
        expectedMonthlyRent: 0,
        annualMaintenanceAndTax: 0,
      },
      'Commercial': {
        available: true,
        basePrice: 12500000,
        carpetAreaSqFt: 690,
        expectedMonthlyRent: 75000,
        annualMaintenanceAndTax: 48000,
        typicalFloor: 'Boulevard Commercial Unit',
        balconies: 0,
        bathrooms: 1,
      },
    },
    livability: {
      compositeScore: 88,
      connectivity: 91,
      socialInfra: 94,
      environment: 79,
      aqi: 66,
      aqiStatus: 'Moderate',
      floodRisk: 'Low Risk Zone',
      transitTimes: {
        metro: '4 mins (Balewadi High Street Metro, Line 3)',
        itHub: '10 mins (Hinjewadi Tech Gate)',
        airport: '40 mins (Pune Airport)',
        expressway: '5 mins (Mumbai-Pune Bypass)',
      },
      poi2km: { schools: 9, hospitals: 6, retail: 26, banks: 15 },
      poi5km: { schools: 25, hospitals: 17, retail: 56, banks: 34 },
    },
    valuation: {
      rrRatePerSqFt: 8100,
      developerQuotedPerSqFt: 12200,
      recentRegisteredAvgPerSqFt: 11700,
      trend5Yr: [
        { year: 2022, marketRate: 8900, rrRate: 6700, registrationVolume: 410 },
        { year: 2023, marketRate: 9800, rrRate: 7200, registrationVolume: 490 },
        { year: 2024, marketRate: 10700, rrRate: 7500, registrationVolume: 560 },
        { year: 2025, marketRate: 11500, rrRate: 7800, registrationVolume: 630 },
        { year: 2026, marketRate: 12200, rrRate: 8100, registrationVolume: 710 },
      ],
      trend10Yr: [
        { year: 2017, marketRate: 5900, rrRate: 4700, registrationVolume: 270 },
        { year: 2019, marketRate: 6900, rrRate: 5400, registrationVolume: 320 },
        { year: 2021, marketRate: 7900, rrRate: 6100, registrationVolume: 370 },
        { year: 2023, marketRate: 9800, rrRate: 7200, registrationVolume: 490 },
        { year: 2025, marketRate: 11500, rrRate: 7800, registrationVolume: 630 },
        { year: 2026, marketRate: 12200, rrRate: 8100, registrationVolume: 710 },
      ],
    },
    amenities: [
      'Zero Commute to Balewadi High Street F&B',
      'Heated Rooftop Pool',
      'CrossFit Arena & Pilates Studio',
      'Electric Vehicle Fast Chargers',
      'Solar Microgrid for Common Areas',
    ],
    constructionMilestones: [
      { stage: 'Piling & Deep Foundations', progressPct: 100, targetDate: 'Q4 2023', completed: true },
      { stage: 'Podium & Parking Levels', progressPct: 100, targetDate: 'Q3 2024', completed: true },
      { stage: 'Superstructure (18/22 Floors)', progressPct: 80, targetDate: 'Q2 2026', completed: false },
      { stage: 'Façade & Waterproofing', progressPct: 35, targetDate: 'Q4 2026', completed: false },
      { stage: 'Completion & OC Filing', progressPct: 0, targetDate: 'Q2 2027', completed: false },
    ],
    overallProgress: 72,
    legalClearances: [
      { id: 'lc-bal-1', name: 'MahaRERA Registration Certificate', authority: 'MahaRERA Authority', status: 'Approved', certificateNo: 'MHA/PUN/2023/P52100032145', date: '11 Jul 2023' },
      { id: 'lc-bal-2', name: 'Commencement Certificate (CC)', authority: 'PMC City Engineer', status: 'Approved', certificateNo: 'PMC/BP/CC/2023/901', date: '05 Mar 2023' },
      { id: 'lc-bal-3', name: 'Height Clearance NOC', authority: 'Ministry of Defence / NDA NOC', status: 'Approved', certificateNo: 'NDA/HQ/OBST/2022/411', date: '18 Nov 2022' },
    ],
    lastUpdated: '17 Oct 2026, 09:30 IST',
    dataSource: 'MahaRERA & IGR Maharashtra',
  },
];
