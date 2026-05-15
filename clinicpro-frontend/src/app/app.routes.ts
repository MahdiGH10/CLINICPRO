import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./auth/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./auth/register.component').then(m => m.RegisterComponent)
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/layout.component').then(m => m.LayoutComponent),
    children: [
      {
        path: 'dashboard',
        data: { title: 'Tableau de bord' },
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'patients',
        canActivate: [roleGuard],
        data: { roles: ['MEDECIN', 'ADMIN'] },
        loadChildren: () =>
          import('./features/patients/patients.routes').then(m => m.PATIENTS_ROUTES)
      },
      {
        path: 'medecins',
        canActivate: [roleGuard],
        data: { roles: ['PATIENT', 'ADMIN'] },
        loadChildren: () =>
          import('./features/medecins/medecins.routes').then(m => m.MEDECINS_ROUTES)
      },
      {
        path: 'rendez-vous',
        loadChildren: () =>
          import('./features/rendez-vous/rendez-vous.routes').then(m => m.RENDEZ_VOUS_ROUTES)
      },
      {
        path: 'consultations',
        canActivate: [roleGuard],
        data: { roles: ['MEDECIN'] },
        loadChildren: () =>
          import('./features/consultations/consultations.routes').then(
            m => m.CONSULTATIONS_ROUTES
          )
      },
      {
        path: 'factures',
        loadChildren: () =>
          import('./features/factures/factures.routes').then(m => m.FACTURES_ROUTES)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
