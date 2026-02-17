import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Application, ApplicationCreate } from '../models/application.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private apiUrl = 'http://localhost:8000';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const headers = this.authService.getAuthHeaders();
    return new HttpHeaders(headers);
  }

  createApplication(application: ApplicationCreate): Observable<Application> {
    return this.http.post<Application>(
      `${this.apiUrl}/applications`,
      application,
      { headers: this.getHeaders() }
    );
  }

  getApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(
      `${this.apiUrl}/applications`,
      { headers: this.getHeaders() }
    );
  }

  getApplication(id: number): Observable<Application> {
    return this.http.get<Application>(
      `${this.apiUrl}/applications/${id}`,
      { headers: this.getHeaders() }
    );
  }
}
