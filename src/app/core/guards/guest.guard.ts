import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    if (authService.isSeller()) {
      router.navigate(['/seller/dashboard']);
      return false;
    }
    if (authService.isAdmin()) {
      router.navigate(['/admin/dashboard']);
      return false;
    }
  }

  return true;
};
