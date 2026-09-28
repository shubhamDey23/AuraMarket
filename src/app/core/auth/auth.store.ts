import { Injectable, signal, computed } from '@angular/core';
import { AuthUser, UserRole, UserStatus } from './auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  readonly currentUser = signal<AuthUser | null>(null);
  readonly token = signal<string | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  readonly isAuthenticated = computed<boolean>(() => !!this.currentUser());
  readonly userRole = computed<UserRole | null>(() => this.currentUser()?.role || null);
  readonly userStatus = computed<UserStatus | null>(() => this.currentUser()?.status || null);
  readonly isCustomer = computed<boolean>(() => this.currentUser()?.role === 'CUSTOMER');
  readonly isSeller = computed<boolean>(() => this.currentUser()?.role === 'SELLER');
  readonly isAdmin = computed<boolean>(() => this.currentUser()?.role === 'ADMIN');
  readonly sellerId = computed<string | undefined>(() => this.currentUser()?.sellerId);
  readonly customerId = computed<string | undefined>(() => this.currentUser()?.id);

  setUser(user: AuthUser | null, token: string | null = null): void {
    this.currentUser.set(user);
    this.token.set(token);
    this.error.set(null);
  }

  setLoading(loading: boolean): void {
    this.isLoading.set(loading);
  }

  setError(err: string | null): void {
    this.error.set(err);
  }

  clear(): void {
    this.currentUser.set(null);
    this.token.set(null);
    this.error.set(null);
    this.isLoading.set(false);
  }
}
