import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuoteService } from '../../../services/quote.service';
import { ApplicationService } from '../../../services/application.service';
import { Quote } from '../../../models/quote.model';
import { Application } from '../../../models/application.model';

@Component({
  selector: 'app-quote-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quote-results.component.html',
  styleUrls: ['./quote-results.component.css']
})
export class QuoteResultsComponent implements OnInit {
  quoteId!: number;
  quote: Quote | null = null;
  application: Application | null = null;
  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quoteService: QuoteService,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.quoteId = +this.route.snapshot.paramMap.get('id')!;
    this.loadQuote();
  }

  loadQuote(): void {
    this.loading = true;
    this.quoteService.getQuote(this.quoteId).subscribe({
      next: (quote) => {
        this.quote = quote;
        this.loadApplication(quote.application_id);
      },
      error: (error) => {
        this.errorMessage = 'Failed to load quote: ' + (error.error?.detail || 'Unknown error');
        this.loading = false;
      }
    });
  }

  loadApplication(applicationId: number): void {
    this.applicationService.getApplication(applicationId).subscribe({
      next: (app) => {
        this.application = app;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  createNewQuote(): void {
    this.router.navigate(['/quote/new']);
  }

  viewAllQuotes(): void {
    this.router.navigate(['/quotes']);
  }

  getBreakdown(): any {
    if (this.quote?.breakdown_json) {
      try {
        return JSON.parse(this.quote.breakdown_json);
      } catch {
        return null;
      }
    }
    return null;
  }
}
