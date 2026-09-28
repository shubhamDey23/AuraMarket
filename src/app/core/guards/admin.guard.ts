import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/admin/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  if (authService.isAdmin()) {
    return true;
  }

  router.navigate(['/access-denied'], { queryParams: { requiredRole: 'ADMIN' } });
  return false;
};
