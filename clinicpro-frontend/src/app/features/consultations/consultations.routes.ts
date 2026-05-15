import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';

export const CONSULTATIONS_ROUTES: Routes = [
  {
    path: ':rendezVousId/saisir',
    canActivate: [roleGuard],
    data: { title: 'Saisir consultation', roles: ['MEDECIN', 'ADMIN'] },
    loadComponent: () =>
      import('./consultation-form/consultation-form.component').then(
        m => m.ConsultationFormComponent
      )
  },
  {
    path: '',
    redirectTo: '/rendez-vous/planning',
    pathMatch: 'full'
  }
];
