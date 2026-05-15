import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const rendezVousIndexRedirectGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.hasRole('PATIENT')) {
    return router.createUrlTree(['/rendez-vous/mes-rdv']);
  }

  return router.createUrlTree(['/rendez-vous/planning']);
};

export const facturesIndexRedirectGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.hasRole('PATIENT')) {
    return router.createUrlTree(['/factures/mes-factures']);
  }

  return router.createUrlTree(['/factures/list']);
};
