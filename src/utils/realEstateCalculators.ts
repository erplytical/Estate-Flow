/**
 * Estate Flow Real Estate Financial & Deduplication Engine
 * Implements SRS v1.1 specifications for EMI, TCO, Yields, Livability & UPI
 */

export interface EMIBreakdown {
  monthlyEMI: number;
  totalPayment: number;
  totalInterest: number;
  principal: number;
  tenureMonths: number;
  monthlyInterestRate: number;
}

/**
 * Standard reducing-balance EMI formula:
 * EMI = [P * r * (1+r)^n] / [(1+r)^n - 1]
 */
export function calculateEMI(
  principal: number,
  annualInterestRatePct: number,
  tenureYears: number
): EMIBreakdown {
  if (principal <= 0 || tenureYears <= 0) {
    return {
      monthlyEMI: 0,
      totalPayment: 0,
      totalInterest: 0,
      principal,
      tenureMonths: 0,
      monthlyInterestRate: 0,
    };
  }

  const tenureMonths = tenureYears * 12;
  const monthlyRate = annualInterestRatePct / 12 / 100;

  if (monthlyRate === 0) {
    const emi = Math.round(principal / tenureMonths);
    return {
      monthlyEMI: emi,
      totalPayment: principal,
      totalInterest: 0,
      principal,
      tenureMonths,
      monthlyInterestRate: 0,
    };
  }

  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  const monthlyEMI = Math.round((principal * monthlyRate * factor) / (factor - 1));
  const totalPayment = monthlyEMI * tenureMonths;
  const totalInterest = Math.max(0, totalPayment - principal);

  return {
    monthlyEMI,
    totalPayment,
    totalInterest,
    principal,
    tenureMonths,
    monthlyInterestRate: monthlyRate,
  };
}

export interface TCOBreakdown {
  basePrice: number;
  gstPercent: number;
  gstAmount: number;
  stampDutyPercent: number;
  stampDutyAmount: number;
  registrationCharges: number;
  maintenanceCorpus: number;
  parkingCharges: number;
  brokerageCharges: number;
  totalTCO: number;
  isReadyToMove: boolean;
  includeParking: boolean;
}

/**
 * Total Cost of Ownership (TCO) breakdown (FR-3.2 & FR-7.2)
 * Under-construction projects: 5% GST
 * Ready-to-move projects: 0% GST
 * Stamp duty: 6% standard
 * Registration: Flat ₹30,000
 * Maintenance & Clubhouse: Flat ₹2,50,000
 * Covered Parking: Flat ₹3,00,000 (optional toggle)
 * Canonical Listing Brokerage: ₹0
 */
export function calculateTCO(
  basePrice: number,
  isReadyToMove: boolean,
  includeParking: boolean = true
): TCOBreakdown {
  const gstPercent = isReadyToMove ? 0 : 5;
  const gstAmount = Math.round((basePrice * gstPercent) / 100);
  const stampDutyPercent = 6;
  const stampDutyAmount = Math.round((basePrice * stampDutyPercent) / 100);
  const registrationCharges = 30000;
  const maintenanceCorpus = 250000;
  const parkingCharges = includeParking ? 300000 : 0;
  const brokerageCharges = 0; // Direct canonical listing

  const totalTCO =
    basePrice +
    gstAmount +
    stampDutyAmount +
    registrationCharges +
    maintenanceCorpus +
    parkingCharges +
    brokerageCharges;

  return {
    basePrice,
    gstPercent,
    gstAmount,
    stampDutyPercent,
    stampDutyAmount,
    registrationCharges,
    maintenanceCorpus,
    parkingCharges,
    brokerageCharges,
    totalTCO,
    isReadyToMove,
    includeParking,
  };
}

export interface RentalYieldBreakdown {
  annualRent: number;
  annualMaintenanceAndTax: number;
  grossYieldPct: number;
  netYieldPct: number;
  totalCost: number;
}

/**
 * Gross & Net Rental Yield Calculation (FR-3.5)
 * Gross Yield % = (Annual Rent / Total Acquisition Cost) * 100
 * Net Yield % = ((Annual Rent - Annual Maint & Tax) / Total Acquisition Cost) * 100
 */
export function calculateRentalYield(
  monthlyRent: number,
  annualMaintenanceAndTax: number,
  totalCost: number
): RentalYieldBreakdown {
  if (totalCost <= 0) {
    return {
      annualRent: 0,
      annualMaintenanceAndTax: 0,
      grossYieldPct: 0,
      netYieldPct: 0,
      totalCost,
    };
  }

  const annualRent = monthlyRent * 12;
  const grossYieldPct = Number(((annualRent / totalCost) * 100).toFixed(2));
  const netIncome = annualRent - annualMaintenanceAndTax;
  const netYieldPct = Number(((netIncome / totalCost) * 100).toFixed(2));

  return {
    annualRent,
    annualMaintenanceAndTax,
    grossYieldPct,
    netYieldPct,
    totalCost,
  };
}

/**
 * Livability Index Weighted Formula (FR-4.1)
 * Livability = Connectivity (35%) + Social Infra (40%) + Environment (25%)
 */
export function calculateLivabilityIndex(
  connectivityScore: number,
  socialScore: number,
  environmentScore: number
): number {
  const composite =
    connectivityScore * 0.35 + socialScore * 0.40 + environmentScore * 0.25;
  return Math.round(Math.min(100, Math.max(0, composite)));
}

/**
 * Generates a deterministic Unique Project Identifier (UPI) Hash
 * Format: EF-<HEX>-2026
 */
export function generateUPIHash(
  reraNumber: string,
  projectName: string,
  lat: number,
  lng: number
): string {
  const rawKey = `${reraNumber.trim().toUpperCase()}_${projectName.trim().toLowerCase()}_${lat.toFixed(4)}_${lng.toFixed(4)}`;
  let hash = 0;
  for (let i = 0; i < rawKey.length; i++) {
    hash = (hash << 5) - hash + rawKey.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(4, '0').slice(-4).toUpperCase();
  return `EF-${hex}-2026`;
}

/**
 * Levenshtein distance string similarity algorithm (0.0 to 1.0)
 */
export function calculateStringSimilarity(str1: string, str2: string): number {
  const s1 = str1.trim().toLowerCase();
  const s2 = str2.trim().toLowerCase();

  if (s1 === s2) return 1.0;
  if (s1.length === 0 || s2.length === 0) return 0.0;

  const track = Array(s2.length + 1)
    .fill(null)
    .map(() => Array(s1.length + 1).fill(null));

  for (let i = 0; i <= s1.length; i += 1) {
    track[0][i] = i;
  }
  for (let j = 0; j <= s2.length; j += 1) {
    track[j][0] = j;
  }

  for (let j = 1; j <= s2.length; j += 1) {
    for (let i = 1; i <= s1.length; i += 1) {
      const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // deletion
        track[j - 1][i] + 1, // insertion
        track[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  const distance = track[s2.length][s1.length];
  const maxLen = Math.max(s1.length, s2.length);
  return Number(((maxLen - distance) / maxLen).toFixed(2));
}

export type DeduplicationStatus =
  | 'EXACT_COLLISION' // FR-2.2: Red blocked alert
  | 'NEAR_MISS_REVIEW' // FR-2.3: Amber alert, routed to manual review queue (24h SLA)
  | 'NEW_VERIFIED'; // Published directly with new UPI

export interface DeduplicationCheckResult {
  status: DeduplicationStatus;
  message: string;
  collisionType?: 'EXACT_RERA' | 'EXACT_NAME_LOCATION' | 'FUZZY_NAME_VICINITY';
  similarityScore?: number;
  matchedProjectId?: string;
  generatedUPI?: string;
}

export interface ExistingProjectRef {
  id: string;
  name: string;
  reraNumber: string;
  latitude: number;
  longitude: number;
  upi: string;
}

/**
 * Deduplication & Single-Listing Engine (FR-2.1 to FR-2.3)
 */
export function checkDuplicateProject(
  inputRera: string,
  inputName: string,
  inputLat: number,
  inputLng: number,
  existingProjects: ExistingProjectRef[]
): DeduplicationCheckResult {
  const normRera = inputRera.trim().toUpperCase();
  const normName = inputName.trim().toLowerCase();

  // 1. Check exact RERA match
  const reraMatch = existingProjects.find(
    (p) => p.reraNumber.trim().toUpperCase() === normRera
  );
  if (reraMatch) {
    return {
      status: 'EXACT_COLLISION',
      message: `Exact RERA Number (${inputRera}) already registered under "${reraMatch.name}". Duplicate creation blocked per FR-2.2.`,
      collisionType: 'EXACT_RERA',
      matchedProjectId: reraMatch.id,
      generatedUPI: reraMatch.upi,
    };
  }

  // 2. Check Geo-distance & Fuzzy Name match
  for (const existing of existingProjects) {
    const latDiff = Math.abs(existing.latitude - inputLat);
    const lngDiff = Math.abs(existing.longitude - inputLng);
    // Approx < 500m distance (~0.005 deg)
    const isCloseGeo = latDiff < 0.005 && lngDiff < 0.005;
    const similarity = calculateStringSimilarity(normName, existing.name.toLowerCase());

    if (similarity >= 0.85 || (similarity >= 0.70 && isCloseGeo)) {
      return {
        status: 'NEAR_MISS_REVIEW',
        message: `High similarity (${Math.round(similarity * 100)}%) with existing verified listing "${existing.name}". Automatically routed to Senior Analyst Manual Review Queue (24h SLA) per FR-2.3.`,
        collisionType: 'FUZZY_NAME_VICINITY',
        similarityScore: similarity,
        matchedProjectId: existing.id,
      };
    }
  }

  // 3. New verified project
  const newUPI = generateUPIHash(inputRera, inputName, inputLat, inputLng);
  return {
    status: 'NEW_VERIFIED',
    message: `Verification Passed: No duplicates found. Canonical listing generated with persistent UPI ${newUPI}.`,
    generatedUPI: newUPI,
  };
}

/**
 * Formatting utilities for Indian currency notations
 */
export function formatNumberIndian(amount: number): string {
  const rounded = Math.round(amount);
  const str = rounded.toString();
  if (str.length <= 3) return str;
  const lastThree = str.substring(str.length - 3);
  const otherNumbers = str.substring(0, str.length - 3);
  return `${otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',')},${lastThree}`;
}

export function formatINR(amount: number): string {
  return `₹ ${formatNumberIndian(amount)}`;
}

export function formatLakhCroreValue(amount: number): string {
  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `${cr.toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    const lk = amount / 100000;
    return `${lk.toFixed(2)} L`;
  }
  return formatNumberIndian(amount);
}

export function formatLakhCrore(amount: number): string {
  return `₹ ${formatLakhCroreValue(amount)}`;
}
