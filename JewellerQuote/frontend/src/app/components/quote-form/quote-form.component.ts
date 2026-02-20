import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApplicationService } from '../../../services/application.service';
import { QuoteService } from '../../../services/quote.service';
import { ApplicationPayload, ApplicationCreate, TravelRecord, Traveller, SafeVault, InsuranceLayer, PremiumExposureRates, NonStandardCoverage } from '../../../models/application.model';

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
  errorMessage = '';
  territoryOptions = ['Belgium', 'Canada', 'Europe', 'Hong Kong', 'Italy', 'Malaysia', 'Mexico', 'Switzerland', 'Thailand', 'UAE', 'USA'];
  businessTypeOptions = ['Retailer', 'Wholesaler', 'Manufacturer', 'Pawnbroker'];
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
    { layerId: 'windows_night', label: 'Show Windows - Night', rate: 1},
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
      travel: [],
      unattended_vehicle_load_percent: 0,
      nonStandardCoverage: [],
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

  calculateTotalPremium(): number {
    return this.layers.reduce((acc, layer) => acc + (layer.premium || 0), 0);
  }

  calculateOtherLayersTotalPremium(): number {
    return this.otherLayers.reduce((acc, layer) => acc + (layer.premium || 0), 0);
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

  calculateFinalTravelPremium(): number {
    const totalTravelPremium = this.calculateTotalTravelPremium();
    const loadFactor = 1 + ((this.payload.unattended_vehicle_load_percent || 0) / 100);
    let total = totalTravelPremium * loadFactor;

    total += (this.payload.increase_limit_amount || 0) * (this.payload.increase_limit_days || 0) / 365 * 0.5;
    total += this.sendingsLayers.reduce((acc, layer) => acc + (layer.premium || 0), 0);
    total += this.exhibitionLayers.reduce((acc, layer) => acc + (layer.premium || 0), 0);
    return total;
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
