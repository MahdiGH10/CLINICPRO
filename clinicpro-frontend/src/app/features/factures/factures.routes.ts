import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { facturesIndexRedirectGuard } from '../../core/guards/route-redirect.guards';

export const FACTURES_ROUTES: Routes = [
  {
    path: 'list',
    canActivate: [roleGuard],
    data: { title: 'Factures', roles: ['ADMIN'] },
    loadComponent: () =>
      import('./facture-list/facture-list.component').then(m => m.FactureListComponent)
  },
  {
    path: 'mes-factures',
    canActivate: [roleGuard],
    data: { title: 'Mes factures', roles: ['PATIENT'] },
    loadComponent: () =>
      import('./mes-factures/mes-factures.component').then(m => m.MesFacturesComponent)
  },
  {
    path: ':id',
    canActivate: [roleGuard],
    data: { title: 'Facture', roles: ['PATIENT', 'ADMIN'] },
    loadComponent: () =>
      import('./facture-preview/facture-preview.component').then(
        m => m.FacturePreviewComponent
      )
  },
  {
    path: '',
    canActivate: [facturesIndexRedirectGuard],
    children: []
  }
];
