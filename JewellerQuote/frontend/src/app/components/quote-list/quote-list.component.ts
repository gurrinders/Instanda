import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuoteService } from '../../../services/quote.service';
import { Quote } from '../../../models/quote.model';

@Component({
  selector: 'app-quote-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quote-list.component.html',
  styleUrls: ['./quote-list.component.css']
})
export class QuoteListComponent implements OnInit {
  quotes: Quote[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private quoteService: QuoteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadQuotes();
  }

  loadQuotes(): void {
    this.loading = true;
    this.quoteService.getQuotes().subscribe({
      next: (quotes) => {
        this.quotes = quotes;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load quotes: ' + (error.error?.detail || 'Unknown error');
        this.loading = false;
      }
    });
  }

  viewQuote(id: number): void {
    this.router.navigate(['/quote', id]);
  }

  createNewQuote(): void {
    this.router.navigate(['/quote/new']);
  }
}
