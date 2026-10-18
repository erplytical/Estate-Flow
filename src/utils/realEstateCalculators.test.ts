import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateEMI,
  calculateTCO,
  calculateRentalYield,
  calculateLivabilityIndex,
  generateUPIHash,
  calculateStringSimilarity,
  checkDuplicateProject,
} from './realEstateCalculators.ts';
import type { ExistingProjectRef } from './realEstateCalculators.ts';

test('calculateEMI computes reducing-balance monthly payment correctly', () => {
  // Principal: 50,00,000, 8.5% rate, 20 years (240 months)
  const result = calculateEMI(5000000, 8.5, 20);
  assert.ok(result.monthlyEMI > 43000 && result.monthlyEMI < 44000);
  assert.equal(result.tenureMonths, 240);
  assert.ok(result.totalPayment > 5000000);
  assert.equal(result.totalPayment - result.principal, result.totalInterest);
});

test('calculateEMI handles 0 principal or tenure gracefully', () => {
  const result = calculateEMI(0, 8.5, 20);
  assert.equal(result.monthlyEMI, 0);
});

test('calculateTCO computes statutory charges and parking options correctly', () => {
  const basePrice = 10000000; // 1 Crore
  // Under construction: 5% GST (5L) + 6% Stamp duty (6L) + 30k reg + 2.5L maint + 3L parking
  const tcoUnderConstruction = calculateTCO(basePrice, false, true);
  assert.equal(tcoUnderConstruction.gstPercent, 5);
  assert.equal(tcoUnderConstruction.gstAmount, 500000);
  assert.equal(tcoUnderConstruction.stampDutyAmount, 600000);
  assert.equal(tcoUnderConstruction.registrationCharges, 30000);
  assert.equal(tcoUnderConstruction.maintenanceCorpus, 250000);
  assert.equal(tcoUnderConstruction.parkingCharges, 300000);
  assert.equal(tcoUnderConstruction.brokerageCharges, 0);
  assert.equal(
    tcoUnderConstruction.totalTCO,
    10000000 + 500000 + 600000 + 30000 + 250000 + 300000
  );

  // Ready to Move: 0% GST and exclude parking toggle
  const tcoReady = calculateTCO(basePrice, true, false);
  assert.equal(tcoReady.gstAmount, 0);
  assert.equal(tcoReady.parkingCharges, 0);
  assert.equal(
    tcoReady.totalTCO,
    10000000 + 0 + 600000 + 30000 + 250000 + 0
  );
});

test('calculateRentalYield accurately returns gross and net yields', () => {
  const monthlyRent = 35000;
  const annualMaintTax = 40000;
  const totalCost = 10000000; // 1 Cr

  const yields = calculateRentalYield(monthlyRent, annualMaintTax, totalCost);
  // Annual rent = 4,20,000 -> Gross Yield = 4.2%
  assert.equal(yields.grossYieldPct, 4.2);
  // Net income = 4,20,000 - 40,000 = 3,80,000 -> Net Yield = 3.8%
  assert.equal(yields.netYieldPct, 3.8);
});

test('calculateLivabilityIndex weights Connectivity 35%, Social 40%, Environment 25%', () => {
  // If all 100 -> 100
  assert.equal(calculateLivabilityIndex(100, 100, 100), 100);
  // Connectivity 80 (28) + Social 90 (36) + Env 70 (17.5) = 81.5 -> round to 82
  assert.equal(calculateLivabilityIndex(80, 90, 70), 82);
});

test('generateUPIHash produces deterministic format', () => {
  const upi1 = generateUPIHash('P52100048192', 'Amanora Gateway Towers', 18.5204, 73.8567);
  const upi2 = generateUPIHash('P52100048192', 'Amanora Gateway Towers', 18.5204, 73.8567);
  assert.equal(upi1, upi2);
  assert.match(upi1, /^EF-[0-9A-F]{4}-2026$/);
});

test('checkDuplicateProject accurately catches exact collision and near-miss', () => {
  const existing: ExistingProjectRef[] = [
    {
      id: 'proj-1',
      name: 'VTP Sierra',
      reraNumber: 'P52100026772',
      latitude: 18.5583,
      longitude: 73.7749,
      upi: 'EF-9F8A-2026',
    },
  ];

  // Case 1: Exact RERA collision
  const collisionResult = checkDuplicateProject(
    'P52100026772',
    'VTP Sierra Baner',
    18.5583,
    73.7749,
    existing
  );
  assert.equal(collisionResult.status, 'EXACT_COLLISION');

  // Case 2: Near-miss typo name & vicinity
  const nearMissResult = checkDuplicateProject(
    'P52100099999',
    'VTP Cierra',
    18.5584,
    73.7750,
    existing
  );
  assert.equal(nearMissResult.status, 'NEAR_MISS_REVIEW');

  // Case 3: Genuine new project
  const newResult = checkDuplicateProject(
    'P52100088888',
    'Godrej Rivergreens',
    18.6012,
    73.9123,
    existing
  );
  assert.equal(newResult.status, 'NEW_VERIFIED');
});
