import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const customerGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url, role: 'customer' } });
    return false;
  }

  if (authService.isCustomer() || authService.isAdmin()) {
    return true;
  }

  router.navigate(['/access-denied'], { queryParams: { requiredRole: 'CUSTOMER' } });
  return false;
};
