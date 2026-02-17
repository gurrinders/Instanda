import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ApplicationService } from '../../../services/application.service';
import { QuoteService } from '../../../services/quote.service';
import { Application } from '../../../models/application.model';
import { Quote } from '../../../models/quote.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  recentApplications: Application[] = [];
  recentQuotes: Quote[] = [];
  loading = true;

  constructor(
    public authService: AuthService,
    private applicationService: ApplicationService,
    private quoteService: QuoteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    
    this.applicationService.getApplications().subscribe({
      next: (apps) => {
        this.recentApplications = apps.slice(0, 5);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });

    this.quoteService.getQuotes().subscribe({
      next: (quotes) => {
        this.recentQuotes = quotes.slice(0, 5);
      },
      error: () => {}
    });
  }

  createNewQuote(): void {
    this.router.navigate(['/quote/new']);
  }

  viewQuote(id: number): void {
    this.router.navigate(['/quote', id]);
  }
}
