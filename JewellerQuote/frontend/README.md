# Jeweller Quote Frontend (Angular 21)

This is the Angular 21 frontend application for the Jeweller Quote system, using **standalone components** architecture.

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI 21 (install globally: `npm install -g @angular/cli@21`)

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## Development Server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

```bash
ng serve
```

Or use npm:
```bash
npm start
```

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

```bash
ng build
```

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/          # Standalone components
│   │   │   ├── login/            # Login component
│   │   │   ├── register/         # Registration component
│   │   │   ├── dashboard/        # Dashboard component
│   │   │   ├── quote-form/       # Multi-step quote application form
│   │   │   ├── quote-results/    # Quote display component
│   │   │   └── quote-list/       # List of quotes component
│   │   ├── app.component.ts     # Root standalone component
│   │   └── app.routes.ts         # Route configuration
│   ├── models/                   # TypeScript interfaces/models
│   ├── services/                 # Angular services (API calls)
│   ├── guards/                   # Functional route guards
│   ├── interceptors/             # Functional HTTP interceptors
│   └── styles.css               # Global styles
├── angular.json                 # Angular configuration
├── package.json                 # Dependencies
└── tsconfig.json                # TypeScript configuration
```

## Key Features

### Angular 21 Standalone Components
- All components are **standalone** (no NgModules)
- Uses `bootstrapApplication` in `main.ts`
- Functional guards and interceptors
- Lazy-loaded routes with `loadComponent`

### User Authentication
- Login and registration with JWT tokens
- Functional `authGuard` for route protection
- Functional `authInterceptor` for automatic token injection

### Multi-Step Quote Form
Comprehensive form covering all sections from the PDF:
1. Firm Details
2. Business & Employees
3. Losses & History
4. Inventories
5. Coverage & Limits
6. Building & Security
7. Travellers & Windows
8. Review & Submit

### Quote Management
- Create quotes from applications
- View quote details with premium breakdown
- List all quotes for logged-in user
- Dashboard with recent applications and quotes

## API Integration

The frontend communicates with the FastAPI backend running on `http://localhost:8000`. Make sure the backend is running before using the frontend.

## Configuration

To change the API URL, update the `apiUrl` property in:
- `src/services/auth.service.ts`
- `src/services/application.service.ts`
- `src/services/quote.service.ts`

## Angular 21 Changes

This application has been updated to Angular 21 with the following changes:

1. **Standalone Components**: All components are now standalone (no NgModules)
2. **Functional Guards**: `AuthGuard` converted to functional guard (`authGuard`)
3. **Functional Interceptors**: `AuthInterceptor` converted to functional interceptor (`authInterceptor`)
4. **Lazy Loading**: Routes use `loadComponent` for lazy loading
5. **Modern Bootstrap**: Uses `bootstrapApplication` instead of `bootstrapModule`
6. **Updated Dependencies**: All Angular packages updated to version 21

## Notes

- The application uses Angular Forms (template-driven) for form handling
- Authentication tokens are stored in localStorage
- CORS must be enabled on the backend for local development
- The quote form is a multi-step wizard that captures all required data from the PDF application form
- All components are standalone and can be used independently
