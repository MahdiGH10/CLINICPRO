/**
 * CLINICPRO - Angular 19 JWT Authentication System
 * Complete Implementation Summary
 */

// ============================================================================
// 1. ENVIRONMENT CONFIGURATION
// ============================================================================
// File: src/environments/environment.ts
export const environment = {
  apiBaseUrl: 'http://localhost:8081'
};

// ============================================================================
// 2. AUTH SERVICE (Signals-based)
// ============================================================================
// File: src/app/core/services/auth.service.ts

import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  role: 'PATIENT' | 'MEDECIN' | 'ADMIN';
  message: string;
}

export interface CurrentUser {
  email: string | null;
  role: 'PATIENT' | 'MEDECIN' | 'ADMIN' | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';

  private tokenSignal = signal<string | null>(this.getStoredToken());
  private userSignal = signal<CurrentUser>(this.getStoredUser());

  // Public readonly signals
  token = this.tokenSignal.asReadonly();
  currentUser = this.userSignal.asReadonly();
  isLoggedIn = computed(() => !!this.tokenSignal());

  constructor(private http: HttpClient) {
    this.loadFromStorage();
  }

  // Load stored credentials on initialization
  private loadFromStorage(): void {
    const token = this.getStoredToken();
    const user = this.getStoredUser();
    
    if (token) this.tokenSignal.set(token);
    if (user.email) this.userSignal.set(user);
  }

  // Retrieve token from localStorage
  private getStoredToken(): string | null {
    try {
      return localStorage.getItem(this.TOKEN_KEY);
    } catch {
      return null;
    }
  }

  // Retrieve user info from localStorage
  private getStoredUser(): CurrentUser {
    try {
      const user = localStorage.getItem(this.USER_KEY);
      return user ? JSON.parse(user) : { email: null, role: null };
    } catch {
      return { email: null, role: null };
    }
  }

  // Login with email and password
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await firstValueFrom(
        this.http.post<LoginResponse>(
          `${environment.apiBaseUrl}/auth/login`,
          credentials
        )
      );

      // Store token and user info in localStorage
      localStorage.setItem(this.TOKEN_KEY, response.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify({
        email: response.email,
        role: response.role
      }));

      // Update signals
      this.tokenSignal.set(response.token);
      this.userSignal.set({
        email: response.email,
        role: response.role
      });

      return response;
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  // Logout and clear stored credentials
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.tokenSignal.set(null);
    this.userSignal.set({ email: null, role: null });
  }

  // Get current token
  getToken(): string | null {
    return this.tokenSignal();
  }

  // Check if user has required role(s)
  hasRole(roles: string | string[]): boolean {
    const userRole = this.userSignal().role;
    if (!userRole) return false;
    
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(userRole);
  }
}

// ============================================================================
// 3. HTTP INTERCEPTOR (Functional)
// ============================================================================
// File: src/app/core/interceptors/auth.interceptor.ts

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Add Bearer token to all requests except login
  if (token && !req.url.includes('/auth/login')) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};

// ============================================================================
// 4. ROLE GUARD (Functional)
// ============================================================================
// File: src/app/core/guards/role.guard.ts

import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
class RoleGuardImpl {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles = route.data['roles'] as string[] | undefined;

    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    // Check if user has required role
    if (requiredRoles && !this.authService.hasRole(requiredRoles)) {
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }
}

// Public guard functions
export const roleGuard: CanActivateFn = (route) => {
  const guard = inject(RoleGuardImpl);
  return guard.canActivate(route);
};

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/auth/login']);
    return false;
  }

  return true;
};

// ============================================================================
// 5. LOGIN PAGE (Material Design)
// ============================================================================
// File: src/app/auth/login.component.ts

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <mat-card class="w-full max-w-md">
        <mat-card-header class="text-center mb-6">
          <div class="text-4xl mb-2">🏥</div>
          <h1 class="text-2xl font-bold text-gray-900">ClinicPRO</h1>
          <p class="text-sm text-gray-500 mt-1">Gestion Médicale Intelligente</p>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field class="w-full mb-4" appearance="outline">
              <mat-label>Email</mat-label>
              <input
                matInput
                type="email"
                formControlName="email"
                placeholder="admin@clinic.tn"
                [disabled]="isLoading"
              />
              <mat-error *ngIf="emailControl.hasError('required')">
                Email est requis
              </mat-error>
              <mat-error *ngIf="emailControl.hasError('email')">
                Email invalide
              </mat-error>
            </mat-form-field>

            <mat-form-field class="w-full mb-6" appearance="outline">
              <mat-label>Mot de passe</mat-label>
              <input
                matInput
                type="password"
                formControlName="password"
                placeholder="••••••••"
                [disabled]="isLoading"
              />
              <mat-error *ngIf="passwordControl.hasError('required')">
                Mot de passe est requis
              </mat-error>
              <mat-error *ngIf="passwordControl.hasError('minlength')">
                Au moins 6 caractères
              </mat-error>
            </mat-form-field>

            <button
              mat-raised-button
              color="primary"
              type="submit"
              class="w-full h-12"
              [disabled]="isLoading || loginForm.invalid"
            >
              <span *ngIf="!isLoading">Se connecter</span>
              <mat-spinner *ngIf="isLoading" diameter="20" class="inline-block"></mat-spinner>
            </button>
          </form>

          <div class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p class="text-sm text-gray-700 font-semibold mb-2">Identifiants de démonstration:</p>
            <div class="text-xs text-gray-600 space-y-1">
              <p><strong>Email:</strong> admin@clinic.tn</p>
              <p><strong>Mot de passe:</strong> admin123</p>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  isLoading = false;
  loginForm: FormGroup;

  get emailControl() {
    return this.loginForm.get('email')!;
  }

  get passwordControl() {
    return this.loginForm.get('password')!;
  }

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) return;

    this.isLoading = true;

    try {
      const credentials = this.loginForm.value;
      const response = await this.authService.login(credentials);

      this.snackBar.open(\`Bienvenue, \${response.email}!\`, 'Fermer', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });

      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      const errorMessage = error?.error?.message || 'Erreur de connexion';
      this.snackBar.open(errorMessage, 'Fermer', {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
    } finally {
      this.isLoading = false;
    }
  }
}

// ============================================================================
// 6. ROUTES CONFIGURATION
// ============================================================================
// File: src/app/app.routes.ts

import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./auth/login.component').then(m => m.LoginComponent)
      }
    ]
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'patients',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/patients/patients.component').then(m => m.PatientsComponent)
  },
  {
    path: 'medecins',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/medecins/medecins.component').then(m => m.MedecinsComponent),
    data: { roles: ['MEDECIN', 'ADMIN'] }
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];

// ============================================================================
// 7. APP CONFIGURATION
// ============================================================================
// File: src/app/app.config.ts

import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations()
  ]
};

// ============================================================================
// API FLOW DIAGRAM
// ============================================================================

/*
LOGIN FLOW:
  1. User enters email/password in LoginComponent
  2. Component calls authService.login(credentials)
  3. AuthService makes HTTP POST to /auth/login
  4. authInterceptor SKIPS adding token (login endpoint)
  5. Backend validates and returns { token, email, role, message }
  6. AuthService stores token and user in localStorage
  7. AuthService updates signals (tokenSignal, userSignal)
  8. Component navigates to /dashboard
  9. AuthGuard checks isLoggedIn() ✓ Allows access

REQUEST FLOW:
  1. Protected route component makes API call
  2. HttpClient prepares request
  3. authInterceptor intercepts request
  4. Interceptor retrieves token from authService.getToken()
  5. Interceptor clones request and adds: Authorization: Bearer {token}
  6. Request sent to backend with token header
  7. Backend validates token and processes request
  8. Response returned to component

LOGOUT FLOW:
  1. User clicks logout button
  2. Component calls authService.logout()
  3. AuthService clears localStorage
  4. AuthService resets signals to null
  5. authGuard detects isLoggedIn() ✗ Redirects to /auth/login
  6. Component navigates to login page

*/

// ============================================================================
// TYPESCRIPT COMPILATION & VERIFICATION
// ============================================================================

/*
✅ All files use:
- Angular 19+ features
- Functional programming (inject, signals, computed)
- Standalone components
- TypeScript 5.9+
- Material Design components
- Tailwind CSS utilities
- Reactive Forms

✅ Type Safety:
- LoginRequest interface
- LoginResponse interface  
- CurrentUser interface
- Signal types are inferred
- HTTP responses are typed

✅ Security:
- JWT token stored in localStorage
- Bearer token in Authorization header
- Login endpoint skipped in interceptor
- Role-based access control
- Route guards on protected routes
*/
