import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApplicationService } from '../../../services/application.service';
import { QuoteService } from '../../../services/quote.service';
import { ApplicationPayload, ApplicationCreate, TravelRecord, Traveller, SafeVault, InsuranceLayer, PremiumExposureRates, NonStandardCoverage, Deductibles, Adjustment } from '../../../models/application.model';

@Component({
  selector: 'app-quote-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quote-form.component.html',
  styleUrls: ['./quote-form.component.css'],
})
export class QuoteFormComponent implements OnInit {
  currentStep = 1;
  totalSteps = 8;
  payload: ApplicationPayload = {};
  loading = false;
  totalPremisesExposurePremium = 0;
  totalOtherExposurePremium = 0;
  totalTravelPremium = 0;
  totalSendingPremium = 0;
  totalExhibitionPremium = 0;
  peakSeasonPremium = 0;
  totalTravelExposurePremium = 0;
  errorMessage = '';
  territoryOptions = ['Belgium', 'Canada', 'Europe', 'Hong Kong', 'Italy', 'Malaysia', 'Mexico', 'Switzerland', 'Thailand', 'UAE', 'USA'];
  businessTypeOptions = ['Retailer', 'Wholesaler', 'Manufacturer', 'Pawnbroker'];
  deductibleOptions = ['Premises', 'Non-Premises', 'Aggregate Deductible'];
  layers: InsuranceLayer[] = [
    { id: 'primary_500k', label: 'First $500k', limit: 500000, excessOf: 0, exposure: 0 },
    { id: 'xs_500k_500k', label: '$500k xs $500k', limit: 500000, excessOf: 500000, exposure: 0 },
    { id: 'xs_500k_1m', label: '$500k xs $1m', limit: 500000, excessOf: 1000000, exposure: 0 },
    { id: 'xs_500k_1_5m', label: '$500k xs $1.5m', limit: 500000, excessOf: 1500000, exposure: 0 },
    { id: 'xs_1m_2m', label: '$1m xs $2m', limit: 1000000, excessOf: 2000000, exposure: 0 },
    { id: 'xs_2m_3m', label: '$2m xs $3m', limit: 2000000, excessOf: 3000000, exposure: 0 },
    { id: 'xs_over_5m', label: 'Over $5m', limit: 999999999999, excessOf: 5000000, exposure: 0 }
  ];

  otherLayers: InsuranceLayer[] = [
    { id: 'sdv', label: 'SDV - if different from premises', limit: 0, excessOf: 0, exposure: 0 },
    { id: 'money', label: 'Money', limit: 0, excessOf: 0, exposure: 0 },
    { id: 'memo_limit', label: 'Memo - Limit', limit: 0, excessOf: 0, exposure: 0 },
    { id: 'memo_exposure', label: 'Memo - Exposure', limit: 0, excessOf: 0, exposure: 0 },
    { id: 'patterns', label: 'Patterns, Molds and FF&F', limit: 0, excessOf: 0, exposure: 0 },
    { id: 'windows_day', label: 'Show Windows - Day', limit: 0, excessOf: 0, exposure: 0 },
    { id: 'windows_night', label: 'Show Windows - Night', limit: 0, excessOf: 0, exposure: 0 },
    { id: 'out_of_safe', label: 'Out of safe', limit: 0, excessOf: 0, exposure: 0 },
    { id: 'wearing_risk', label: 'Wearing Risk', limit: 0, excessOf: 0, exposure: 0 },
    { id: 'improvements', label: 'Improvements/Betterments', limit: 0, excessOf: 0, exposure: 0 },
    { id: 'travel', label: 'Incidental Travel', limit: 0, excessOf: 0, exposure: 0 }
  ];

  rates: PremiumExposureRates[] = [
    { layerId: 'primary_500k', label: 'First $500k', rate: 1.667 },
    { layerId: 'xs_500k_500k', label: '$500k xs $500k', rate: 1.5 },
    { layerId: 'xs_500k_1m', label: '$500k xs $1m', rate: 1.25 },
    { layerId: 'xs_500k_1_5m', label: '$500k xs $1.5m', rate: 1.0 },
    { layerId: 'xs_1m_2m', label: '$1m xs $2m', rate: .75 },
    { layerId: 'xs_2m_3m', label: '$2m xs $3m', rate: .5 },
    { layerId: 'xs_over_5m', label: 'Over $5m', rate: .150 }
  ];

  otherExpRates: PremiumExposureRates[] = [
    { layerId: 'sdv', label: 'SDV - if different from premises', rate: .25 },
    { layerId: 'money', label: 'Money', rate: 2 },
    { layerId: 'memo_limit', label: 'Memo - Limit', rate: 1.5 },
    { layerId: 'memo_exposure', label: 'Memo - Exposure', rate: .5 },
    { layerId: 'patterns', label: 'Patterns, Molds and FF&F', rate: .25 },
    { layerId: 'windows_day', label: 'Show Windows - Day', rate: 0 },
    { layerId: 'windows_night', label: 'Show Windows - Night', rate: 1 },
    { layerId: 'out_of_safe', label: 'Out of safe', rate: .5 },
    { layerId: 'wearing_risk', label: 'Wearing Risk', rate: 1.5 },
    { layerId: 'improvements', label: 'Improvements/Betterments', rate: .5 },
    { layerId: 'travel', label: 'Incidental Travel', rate: 1 }
  ];

  peakSeasonRate = 1.5;
  travelPremiumRates = [
    { layerId: '1', label: 'InTown', rate: 1.8 },
    { layerId: '2', label: 'OutOfTown', rate: 4 },
    { layerId: '3', label: 'International', rate: 7.5 }
  ];

  sendingPremiumRates = [
    { layerId: '1', label: 'Armoured Car', rate: .025 },
    { layerId: '2', label: 'Registered Airmail', rate: .125 },
    { layerId: '3', label: 'FedEx / UPS / DHL', rate: .5 },
    { layerId: '4', label: 'Secure Overnight', rate: .1 },
    { layerId: '5', label: 'Other Method', rate: .5 }
  ];

  exhibitionPremiumRates = [
    { layerId: '1', label: 'Including Shipments', rate: .075 },
    { layerId: '2', label: 'Excluding Shipments', rate: .050 },
  ];

  sendingsLayers: InsuranceLayer[] = [
    { id: '1', label: 'Armoured Car', limit: 0, excessOf: 0, exposure: 0 },
    { id: '2', label: 'Registered Airmail', limit: 0, excessOf: 0, exposure: 0 },
    { id: '3', label: 'FedEx / UPS / DHL', limit: 0, excessOf: 0, exposure: 0 },
    { id: '4', label: 'Secure Overnight', limit: 0, excessOf: 0, exposure: 0 },
    { id: '5', label: 'Other Method', limit: 0, excessOf: 0, exposure: 0 }
  ];

  exhibitionLayers: any[] = [
    { id: '1', label: 'Including Shipments', limit: 0, no_of_shows: 0, premium: 0 },
    { id: '2', label: 'Excluding Shipments', limit: 0, no_of_shows: 0, premium: 0 }
  ];

  firstLossScale = [
    { exposure: 0.01, load: 32.5 },
    { exposure: 0.02, load: 37.5260862106449 },
    { exposure: 0.03, load: 41.213954930942 },
    { exposure: 0.04, load: 44.1745463798362 },
    { exposure: 0.05, load: 46.6713411156163 },
    { exposure: 0.06, load: 48.8436621105948 },
    { exposure: 0.07, load: 50.7747710681559 },
    { exposure: 0.08, load: 52.5186929508928 },
    { exposure: 0.09, load: 54.112623956465 },
    { exposure: 0.1, load: 55.5833486584685 },
    { exposure: 0.11, load: 56.9508444612966 },
    { exposure: 0.12, load: 58.2304394965679 },
    { exposure: 0.13, load: 59.434171868506 },
    { exposure: 0.14, load: 60.5716821353474 },
    { exposure: 0.15, load: 61.6508199370826 },
    { exposure: 0.16, load: 62.6780685749263 },
    { exposure: 0.17, load: 63.6588497305758 },
    { exposure: 0.18, load: 64.5977469773501 },
    { exposure: 0.19, load: 65.4986728825676 },
    { exposure: 0.2, load: 66.3649960600744 },
    { exposure: 0.21, load: 67.1996392309807 },
    { exposure: 0.22, load: 68.0051559313661 },
    { exposure: 0.23, load: 68.7837912470164 },
    { exposure: 0.24, load: 69.5375304310854 },
    { exposure: 0.25, load: 70.2681382121391 },
    { exposure: 0.26, load: 70.9771908661842 },
    { exposure: 0.27, load: 71.6661026044306 },
    { exposure: 0.28, load: 72.3361474520314 },
    { exposure: 0.29, load: 72.9884775177652 },
    { exposure: 0.3, load: 73.624138350886 },
    { exposure: 0.31, load: 74.2440819288549 },
    { exposure: 0.32, load: 74.8491777043009 },
    { exposure: 0.33, load: 75.4402220514386 },
    { exposure: 0.34, load: 76.0179463842411 },
    { exposure: 0.35, load: 76.5830241658617 },
    { exposure: 0.36, load: 77.1360769874195 },
    { exposure: 0.37, load: 77.677679861595 },
    { exposure: 0.38, load: 78.2083658505112 },
    { exposure: 0.39, load: 78.7286301265911 },
    { exposure: 0.4, load: 79.2389335483417 },
    { exposure: 0.41, load: 79.7397058194572 },
    { exposure: 0.42, load: 80.2313482885875 },
    { exposure: 0.43, load: 80.714236438072 },
    { exposure: 0.44, load: 81.1887221024946 },
    { exposure: 0.45, load: 81.6551354517562 },
    { exposure: 0.46, load: 82.1137867682495 },
    { exposure: 0.47, load: 82.5649680434487 },
    { exposure: 0.48, load: 83.0089544156532 },
    { exposure: 0.49, load: 83.4460054676154 },
    { exposure: 0.5, load: 83.8763664002437 },
    { exposure: 0.51, load: 84.3002690964179 },
    { exposure: 0.52, load: 84.7179330871262 },
    { exposure: 0.53, load: 85.1295664305685 },
    { exposure: 0.54, load: 85.5353665135387 },
    { exposure: 0.55, load: 85.9355207832458 },
    { exposure: 0.56, load: 86.3302074167503 },
    { exposure: 0.57, load: 86.7195959343366 },
    { exposure: 0.58, load: 87.1038477624046 },
    { exposure: 0.59, load: 87.4831167508215 },
    { exposure: 0.6, load: 87.857549649117 },
    { exposure: 0.61, load: 88.2272865454189 },
    { exposure: 0.62, load: 88.5924612715993 },
    { exposure: 0.63, load: 88.9532017777282 },
    { exposure: 0.64, load: 89.3096304786035 },
    { exposure: 0.65, load: 89.6618645748395 },
    { exposure: 0.66, load: 90.0100163507376 },
    { exposure: 0.67, load: 90.3541934509418 },
    { exposure: 0.68, load: 90.6944991376788 },
    { exposure: 0.69, load: 91.0310325302092 },
    { exposure: 0.7, load: 91.363888827955 },
    { exposure: 0.71, load: 91.6931595186317 },
    { exposure: 0.72, load: 92.0189325725884 },
    { exposure: 0.73, load: 92.3412926244437 },
    { exposure: 0.74, load: 92.6603211430123 },
    { exposure: 0.75, load: 92.9760965904204 },
    { exposure: 0.76, load: 93.2886945712321 },
    { exposure: 0.77, load: 93.5981879723371 },
    { exposure: 0.78, load: 93.9046470942808 },
    { exposure: 0.79, load: 94.2081397746641 },
    { exposure: 0.8, load: 94.5087315041845 },
    { exposure: 0.81, load: 94.8064855358424 },
    { exposure: 0.82, load: 95.1014629877945 },
    { exposure: 0.83, load: 95.3937229402956 },
    { exposure: 0.84, load: 95.6833225271347 },
    { exposure: 0.85, load: 95.9703170219402 },
    { exposure: 0.86, load: 96.254759919698 },
    { exposure: 0.87, load: 96.5367030137993 },
    { exposure: 0.88, load: 96.816196468913 },
    { exposure: 0.89, load: 97.0932888899517 },
    { exposure: 0.9, load: 97.3680273873832 },
    { exposure: 0.91, load: 97.6404576391184 },
    { exposure: 0.92, load: 97.9106239491905 },
    { exposure: 0.93, load: 98.1785693034249 },
    { exposure: 0.94, load: 98.4443354222843 },
    { exposure: 0.95, load: 98.7079628110609 },
    { exposure: 0.96, load: 98.9694908075744 },
    { exposure: 0.97, load: 99.2289576275254 },
    { exposure: 0.98, load: 99.4864004076411 },
    { exposure: 0.99, load: 99.7418552467426 },
    { exposure: 1, load: 99.9953572448538 },
  ]


  territoryCurrencyMap: { [key: string]: string } = {
    'Belgium': 'EUR',
    'Canada': 'CAD',
    'Europe': 'EUR',
    'Hong Kong': 'HKD',
    'Italy': 'EUR',
    'Malaysia': 'MYR',
    'Mexico': 'MXN',
    'Switzerland': 'CHF',
    'Thailand': 'THB',
    'UAE': 'AED',
    'USA': 'USD'
  };
  currencyOptions = Array.from(new Set(Object.values(this.territoryCurrencyMap))).sort();

  constructor(
    private applicationService: ApplicationService,
    private quoteService: QuoteService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializePayload();
    this.loadProgress();
  }

  initializePayload(): void {
    this.payload = {
      firm_name: '',
      country: 'Canada',
      currency: 'CAD',
      exRate: 1.25,
      cadLimit: 0,
      cadExcess: 0,
      business_type: 'Retailer',
      dropdown_clause: 'Yes',
      totalDiscounts: 30,
      peak_season_rate: 0.5,
      travel: [],
      unattended_vehicle_load_percent: 0,
      percentage_of_exposure: 0,
      adjustments: [
        { description: 'First Loss Adjustment', loadCredit: 0, premium: 0 },
        { description: 'Premises / vault security', loadCredit: 0, premium: 0 },
        { description: 'Geographical crime stats', loadCredit: 0, premium: 0 },
        { description: 'Departure from 10% PC on net', loadCredit: 0, premium: 0 }
      ],
      loss_history_percentage: 0,
      loss_history_load_credit: 0,
      nonStandardCoverage: [],
      deductibles: this.deductibleOptions.map(type => ({ type, amount: 0, loadCredit: 0 })),
      travellers: [],
      safes_vaults: [],
      stock_composition: {},
      alarm_system: {},
      holdup_alarm: {},
      show_windows: {},
      limit_layers: []
    };
  }

  calculateExposure(claimAmount: number, layers: InsuranceLayer[]) {
    return layers.map(layer => {
      // 1. Determine how much of the claim sits above this layer's attachment point
      const amountAboveXS = Math.max(0, claimAmount - layer.excessOf);

      // 2. The layer pays the lesser of the 'amount above xs' or its own 'limit'
      const payout = Math.min(amountAboveXS, layer.limit);

      return {
        layerId: layer.id,
        payout: payout
      };
    });
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
    if (this.currentStep === 2 && this.isStep1Valid()) {
      const exp = this.calculateExposure(this.payload.cadLimit || 0, this.layers);
      exp.forEach(item => {
        const match = this.layers.find(l => l.id === item.layerId);
        if (match) {
          match.exposure = item.payout;
        }
      });
      this.rates.forEach(item => {
        const match = this.layers.find(l => l.id === item.layerId);
        if (match) {
          match.premium = match.exposure * (item.rate / 100);
        }
      });
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number): void {
    if (step >= 1 && step <= this.totalSteps) {
      this.currentStep = step;
    }
  }

  onTerritoryChange(): void {
    if (this.payload.country && this.territoryCurrencyMap[this.payload.country]) {
      this.payload.currency = this.territoryCurrencyMap[this.payload.country];
    }
  }

  addTravel(): void {
    if (!this.payload.travel) {
      this.payload.travel = [];
    }
    this.payload.travel.push({});
  }

  removeTravel(index: number): void {
    if (this.payload.travel) {
      this.payload.travel.splice(index, 1);
    }
  }

  addNonStandardCoverage(): void {
    if (!this.payload.nonStandardCoverage) {
      this.payload.nonStandardCoverage = [];
    }
    this.payload.nonStandardCoverage.push({});
  }

  removeNonStandardCoverage(index: number): void {
    if (this.payload.nonStandardCoverage) {
      this.payload.nonStandardCoverage.splice(index, 1);
    }
  }

  addTraveller(): void {
    if (!this.payload.travellers) {
      this.payload.travellers = [];
    }
    this.payload.travellers.push({});
  }

  removeTraveller(index: number): void {
    if (this.payload.travellers) {
      this.payload.travellers.splice(index, 1);
    }
  }

  addSafeVault(): void {
    if (!this.payload.safes_vaults) {
      this.payload.safes_vaults = [];
    }
    this.payload.safes_vaults.push({ type: 'safe' });
  }

  removeSafeVault(index: number): void {
    if (this.payload.safes_vaults) {
      this.payload.safes_vaults.splice(index, 1);
    }
  }

  calculateTotalStockValue(): number {
    // Simple calculation - can be enhanced
    return this.payload.last_inventory_amount || 0;
  }

  calculatePeakSeasonPremium(payload: ApplicationPayload): number {
    this.peakSeasonPremium = ((payload.increase_limit_amount || 0) * (payload.increase_limit_days || 0) / 365 * (payload.peak_season_rate || 0));
    return this.peakSeasonPremium;
  }

  calculateTotalExposurePremium(): number {
    this.totalPremisesExposurePremium = this.layers.reduce((acc, layer) => acc + (layer.premium || 0), 0);
    return this.totalPremisesExposurePremium;
  }

  calculateOtherExposureTotalPremium(): number {
    this.totalOtherExposurePremium = this.otherLayers.reduce((acc, layer) => acc + (layer.premium || 0), 0);
    return this.totalOtherExposurePremium;
  }

  updateOtherLayerLimit(layer: InsuranceLayer, value: any): void {
    const limit = this.parseCurrency(value);
    layer.limit = limit;

    const rate = this.otherExpRates.find(r => r.layerId === layer.id);
    if (rate) {
      layer.premium = limit * (rate.rate / 100);
    }
  }

  updateSendingLayerExposure(layer: InsuranceLayer, value: any): void {
    const exposure = this.parseCurrency(value);
    layer.exposure = exposure;

    const rateObj = this.sendingPremiumRates.find(r => r.layerId === layer.id);
    if (rateObj) {
      layer.premium = exposure * (rateObj.rate / 100);
    }
  }

  updateExhibitionLimit(layer: any, value: any): void {
    layer.limit = this.parseCurrency(value);
    this.calculateExhibitionPremium(layer);
  }

  calculateExhibitionPremium(layer: any): void {
    const rateObj = this.exhibitionPremiumRates.find(r => r.layerId === layer.id);
    if (rateObj) {
      layer.premium = (layer.limit || 0) * (layer.no_of_shows || 0) * (rateObj.rate / 100);
    }
  }

  parseCurrency(value: any): number {
    if (typeof value === 'number') {
      return value;
    }
    if (typeof value === 'string') {
      return Number(value.replace(/[^0-9.-]+/g, ''));
    }
    return 0;
  }

  getTravelRate(layerId: string | undefined): number {
    const rateObj = this.travelPremiumRates.find(r => r.layerId === layerId);
    return rateObj ? rateObj.rate : 0;
  }

  calculateTotalTravelPremium(): number {
    if (!this.payload.travel || this.payload.travel.length === 0) {
      return 0;
    }
    return this.payload.travel.reduce((acc, item) => {
      const rate = this.getTravelRate(item.travel_type) / 100;
      const premium = (item.limit || 0) * (item.days || 0) / 250 * rate;
      return acc + premium;
    }, 0);
  }

  calculateTotalNonStandardLoadCredit(): number {
    if (!this.payload.nonStandardCoverage) {
      return 0;
    }
    return this.payload.nonStandardCoverage.reduce((sum, item) => sum + (Number(item.loadCredit) || 0), 0);
  }

  calculateTotalNonStandardPremium(): number {
    const totalLoadCredit = this.calculateTotalNonStandardLoadCredit();
    // Assuming calculateFinalTravelPremium() exists as it is used in your HTML
    const basePremium = this.calculateFinalTravelPremium();
    return (totalLoadCredit / 100) * basePremium;
  }

  calculateTotalSendingPremium(): number {
    this.totalSendingPremium = this.sendingsLayers.reduce((acc, layer) => acc + (layer.premium || 0), 0);
    return this.totalSendingPremium;
  }

  calculateTotalExhibitionPremium(): number {
    this.totalExhibitionPremium = this.exhibitionLayers.reduce((acc, layer) => acc + (layer.premium || 0), 0);
    return this.totalExhibitionPremium;
  }

  calculateDeductiblePremium(item: Deductibles): number {
    // Recalculate totals to ensure they are current even if previous steps are hidden
    const totalPremises = this.layers.reduce((acc, layer) => acc + (layer.premium || 0), 0);
    const peakSeason = ((this.payload.increase_limit_amount || 0) * (this.payload.increase_limit_days || 0) / 365 * (this.payload.peak_season_rate || 0));

    if (item.type === 'Premises') {
      item.premium = (totalPremises + peakSeason) * ((item.loadCredit || 0) / 100);
    }
    else {
      item.premium = (item.amount || 0) * ((item.loadCredit || 0) / 100);
    }
    return item.premium;
  }

  calculateTotalDeductibleLoadCredit(): number {
    if (!this.payload.deductibles) {
      return 0;
    }
    return this.payload.deductibles.reduce((sum, item) => sum + (Number(item.loadCredit) || 0), 0);
  }

  calculateTotalDeductiblePremium(): number {
    if (!this.payload.deductibles) {
      return 0;
    }
    return this.payload.deductibles.reduce((sum, item) => sum + (this.calculateDeductiblePremium(item) || 0), 0);
  }

  calculateMechanicalPremium(): number {
    return this.calculateTotalNonStandardPremium() + this.calculateTotalDeductiblePremium() + this.totalTravelExposurePremium;
  }

  updateFirstLossAdjustment(): void {
    if (!this.payload.adjustments || this.payload.adjustments.length === 0) return;

    const exposurePercent = this.payload.percentage_of_exposure || 0;

    if (exposurePercent <= 0) {
      this.payload.adjustments[0].loadCredit = 0;
      return;
    }

    let targetExposure = exposurePercent / 100;
    if (targetExposure < 0.01) targetExposure = 0.01;
    if (targetExposure > 1.0) targetExposure = 1.0;

    // Find closest match in firstLossScale
    const match = this.firstLossScale.reduce((prev, curr) => {
      return (Math.abs(curr.exposure - targetExposure) < Math.abs(prev.exposure - targetExposure) ? curr : prev);
    });

    if (match) {
      this.payload.adjustments[0].loadCredit = -(100 - match.load);
    }
  }

  calculateAdjustmentPremium(item: Adjustment): number {
    const base = this.calculateMechanicalPremium();
    item.premium = base * ((item.loadCredit || 0) / 100);
    return item.premium;
  }

  addAdjustment(): void {
    if (!this.payload.adjustments) this.payload.adjustments = [];
    this.payload.adjustments.push({ description: '', loadCredit: 0, premium: 0 });
  }

  removeAdjustment(index: number): void {
    if (this.payload.adjustments) this.payload.adjustments.splice(index, 1);
  }

  calculateTotalAdjustmentLoadCredit(): number {
    if (!this.payload.adjustments) return 0;
    // Exclude the first one (First Loss Adjustment)
    return this.payload.adjustments.slice(1).reduce((sum, item) => sum + (Number(item.loadCredit) || 0), 0);
  }

  calculateTotalAdjustmentPremium(): number {
    if (!this.payload.adjustments) return 0;
    return this.payload.adjustments.reduce((sum, item) => sum + (item.premium || 0), 0);
  }

  calculateLossHistoryPremium(): number {
    const base = this.calculateMechanicalPremium();
    const loadCredit = (this.payload as any).loss_history_load_credit || 0;
    return base * (loadCredit / 100);
  }

  calculateTechnicalPremium(): number {
    return this.calculateMechanicalPremium() + this.calculateTotalAdjustmentPremium() + this.calculateLossHistoryPremium();
  }

  calculateTotalTravePremium() {
    const totalTravelPremium = this.calculateTotalTravelPremium();
    const loadFactor = 1 + ((this.payload.unattended_vehicle_load_percent || 0) / 100);
    this.totalTravelPremium = totalTravelPremium * loadFactor;
    return this.totalTravelPremium;
  }


  calculateFinalTravelPremium(): number {
    let total = 0;
    total += this.totalPremisesExposurePremium;
    total += this.totalOtherExposurePremium;
    total += this.totalTravelPremium
    total += this.totalSendingPremium;
    total += this.totalExhibitionPremium;
    total += (this.payload.increase_limit_amount || 0) * (this.payload.increase_limit_days || 0) / 365 * (this.payload.peak_season_rate || 0);
    this.totalTravelExposurePremium = total;
    return total;
  }

  saveProgress(): void {
    localStorage.setItem('jeweller_quote_payload', JSON.stringify(this.payload));
    alert('Progress saved successfully!');
  }

  loadProgress(): void {
    const savedPayload = localStorage.getItem('jeweller_quote_payload');

    if (savedPayload) {
      try {
        this.payload = JSON.parse(savedPayload);
      } catch (e) {
        console.error('Error parsing saved payload', e);
      }
    }
  }

  isStep1Valid(): boolean {
    const p = this.payload;
    return !!(
      p.firm_name &&
      p.country &&
      p.exRate &&
      p.cadLimit !== null && p.cadLimit !== undefined &&
      p.cadExcess !== null && p.cadExcess !== undefined &&
      p.business_type &&
      p.dropdown_clause &&
      p.totalDiscounts !== null && p.totalDiscounts !== undefined
    );
  }

  onSubmit(): void {
    this.loading = true;
    this.errorMessage = '';

    // Calculate total stock value
    this.payload.total_stock_value = this.calculateTotalStockValue();

    const applicationData: ApplicationCreate = {
      firm_name: this.payload.firm_name,
      country: this.payload.country,
    };

    this.applicationService.createApplication(applicationData).subscribe({
      next: (application) => {
        // Create quote immediately after application
        this.quoteService.createQuote(application.id).subscribe({
          next: (quote) => {
            this.router.navigate(['/quote', quote.id]);
          },
          error: (error) => {
            this.errorMessage = 'Failed to generate quote: ' + (error.error?.detail || 'Unknown error');
            this.loading = false;
          }
        });
      },
      error: (error) => {
        this.errorMessage = 'Failed to save application: ' + (error.error?.detail || 'Unknown error');
        this.loading = false;
      }
    });
  }
}
