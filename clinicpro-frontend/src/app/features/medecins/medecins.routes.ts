import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';

export const MEDECINS_ROUTES: Routes = [
  {
    path: 'list',
    data: { title: 'Médecins' },
    loadComponent: () =>
      import('./medecin-list/medecin-list.component').then(m => m.MedecinListComponent)
  },
  {
    path: 'nouveau',
    canActivate: [roleGuard],
    data: { title: 'Créer médecin', roles: ['ADMIN'] },
    loadComponent: () =>
      import('./medecin-form/medecin-form.component').then(m => m.MedecinFormComponent)
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  }
];
