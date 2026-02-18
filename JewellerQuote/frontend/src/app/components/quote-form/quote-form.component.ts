import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApplicationService } from '../../../services/application.service';
import { QuoteService } from '../../../services/quote.service';
import { ApplicationPayload, ApplicationCreate, LossRecord, Traveller, SafeVault } from '../../../models/application.model';

@Component({
  selector: 'app-quote-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quote-form.component.html',
  styleUrls: ['./quote-form.component.css']
})
export class QuoteFormComponent implements OnInit {
  currentStep = 1;
  totalSteps = 8;
  payload: ApplicationPayload = {};
  loading = false;
  errorMessage = '';
  territoryOptions = ['Belgium', 'Canada', 'Europe', 'Hong Kong', 'Italy', 'Malaysia', 'Mexico', 'Switzerland', 'Thailand', 'UAE', 'USA'];
  
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
  ) {}

  ngOnInit(): void {
    this.initializePayload();
  }

  initializePayload(): void {
    this.payload = {
      losses: [],
      travellers: [],
      safes_vaults: [],
      stock_composition: {},
      alarm_system: {},
      holdup_alarm: {},
      show_windows: {}
    };
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
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

  addLoss(): void {
    if (!this.payload.losses) {
      this.payload.losses = [];
    }
    this.payload.losses.push({});
  }

  removeLoss(index: number): void {
    if (this.payload.losses) {
      this.payload.losses.splice(index, 1);
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

  onSubmit(): void {
    this.loading = true;
    this.errorMessage = '';

    // Calculate total stock value
    this.payload.total_stock_value = this.calculateTotalStockValue();

    const applicationData: ApplicationCreate = {
      firm_name: this.payload.firm_name,
      country: this.payload.country,
      premises_address: this.payload.premises_address,
      annual_gross_revenue: this.payload.annual_gross_revenue,
      annual_profit: this.payload.annual_profit,
      raw_payload: this.payload
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
