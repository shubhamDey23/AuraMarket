import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const sellerGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url, role: 'seller' } });
    return false;
  }

  if (authService.isSeller() || authService.isAdmin()) {
    return true;
  }

  // If a customer tries to access seller portal, redirect to access-denied
  router.navigate(['/access-denied'], { queryParams: { requiredRole: 'SELLER' } });
  return false;
};
