import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';

export const PATIENTS_ROUTES: Routes = [
  {
    path: 'list',
    data: { title: 'Patients' },
    loadComponent: () =>
      import('./patient-list/patient-list.component').then(m => m.PatientListComponent)
  },
  {
    path: 'nouveau',
    canActivate: [roleGuard],
    data: { title: 'Nouveau patient', roles: ['ADMIN'] },
    loadComponent: () =>
      import('./patient-form/patient-form.component').then(m => m.PatientFormComponent)
  },
  {
    path: ':id/edit',
    data: { title: 'Modifier patient' },
    loadComponent: () =>
      import('./patient-form/patient-form.component').then(m => m.PatientFormComponent)
  },
  {
    path: ':id/profile',
    data: { title: 'Profil patient' },
    loadComponent: () =>
      import('./patient-profile/patient-profile.component').then(m => m.PatientProfileComponent)
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  }
];
