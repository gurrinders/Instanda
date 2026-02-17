import { Routes } from '@angular/router';
import { authGuard } from '../guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'quote/new',
    loadComponent: () => import('./components/quote-form/quote-form.component').then(m => m.QuoteFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'quote/:id',
    loadComponent: () => import('./components/quote-results/quote-results.component').then(m => m.QuoteResultsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'quotes',
    loadComponent: () => import('./components/quote-list/quote-list.component').then(m => m.QuoteListComponent),
    canActivate: [authGuard]
  }
];
