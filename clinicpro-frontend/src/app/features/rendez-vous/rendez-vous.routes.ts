import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { rendezVousIndexRedirectGuard } from '../../core/guards/route-redirect.guards';

export const RENDEZ_VOUS_ROUTES: Routes = [
  {
    path: 'planning',
    canActivate: [roleGuard],
    data: { title: 'Mon agenda', roles: ['MEDECIN', 'ADMIN'] },
    loadComponent: () =>
      import('./planning-list/planning-list.component').then(m => m.PlanningListComponent)
  },
  {
    path: 'nouveau',
    canActivate: [roleGuard],
    data: { title: 'Prendre rendez-vous', roles: ['PATIENT', 'ADMIN'] },
    loadComponent: () =>
      import('./booking-wizard/booking-wizard.component').then(m => m.BookingWizardComponent)
  },
  {
    path: 'mes-rdv',
    canActivate: [roleGuard],
    data: { title: 'Mes rendez-vous', roles: ['PATIENT'] },
    loadComponent: () =>
      import('./mes-rendez-vous/mes-rendez-vous.component').then(m => m.MesRendezVousComponent)
  },
  {
    path: '',
    canActivate: [rendezVousIndexRedirectGuard],
    children: []
  }
];
