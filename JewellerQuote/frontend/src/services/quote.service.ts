import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Quote } from '../models/quote.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  private apiUrl = 'https://ca-jeweller-quote.calmtree-8a9c8c27.eastus.azurecontainerapps.io';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const headers = this.authService.getAuthHeaders();
    return new HttpHeaders(headers);
  }

  createQuote(applicationId: number): Observable<Quote> {
    return this.http.post<Quote>(
      `${this.apiUrl}/quotes?application_id=${applicationId}`,
      {},
      { headers: this.getHeaders() }
    );
  }

  getQuotes(): Observable<Quote[]> {
    return this.http.get<Quote[]>(
      `${this.apiUrl}/quotes`,
      { headers: this.getHeaders() }
    );
  }

  getQuote(id: number): Observable<Quote> {
    return this.http.get<Quote>(
      `${this.apiUrl}/quotes/${id}`,
      { headers: this.getHeaders() }
    );
  }

  saveRates(quoteId: number, ratesData: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/submissions/rates`,
      { quote_id: quoteId, ...ratesData },
      { headers: this.getHeaders() }
    );
  }
}
