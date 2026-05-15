import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { getHomeRouteForRole } from '../config/role.config';

@Injectable({ providedIn: 'root' })
class RoleGuardImpl {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles = route.data['roles'] as string[] | undefined;

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    if (requiredRoles && !this.authService.hasRole(requiredRoles)) {
      const home = getHomeRouteForRole(this.authService.currentUser().role);
      this.router.navigate([home]);
      return false;
    }

    return true;
  }
}

export const roleGuard: CanActivateFn = route => {
  const guard = inject(RoleGuardImpl);
  return guard.canActivate(route);
};

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/auth/login']);
    return false;
  }

  return true;
};
