import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuthStore } from '../auth/auth.store';
import { AuthRepositoryMock } from '../auth/auth.repository.mock';
import {
  AuthUser,
  LoginCredentials,
  RegisterData,
  SellerRegisterData,
  GoogleAuthPayload,
  UserRole,
} from '../auth/auth.models';
import { Customer, Seller, AdminUser } from '../models/user.model';
import { MOCK_CUSTOMERS } from '../../data/mock/customers.mock';
import { MOCK_SELLERS } from '../../data/mock/sellers.mock';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    public store: AuthStore,
    private repository: AuthRepositoryMock
  ) {
    this.restoreSession();
  }

  // Reactive signals exposed from store
  get currentUser() { return this.store.currentUser; }
  get isAuthenticated() { return this.store.isAuthenticated; }
  get userRole() { return this.store.userRole; }
  get userStatus() { return this.store.userStatus; }
  get isCustomer() { return this.store.isCustomer; }
  get isSeller() { return this.store.isSeller; }
  get isAdmin() { return this.store.isAdmin; }

  // Compatibility signals & computed getters for existing codebase
  currentSellerId(): string {
    return this.store.sellerId() || 'seller-1';
  }

  currentCustomerId(): string {
    return this.store.customerId() || 'cust-1';
  }

  currentRole(): UserRole {
    return this.store.userRole() || 'CUSTOMER';
  }

  currentCustomer(): Customer {
    const u = this.store.currentUser();
    if (u && u.role === 'CUSTOMER') {
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone || '+91 98765 43210',
        avatarUrl: u.avatar || MOCK_CUSTOMERS[0].avatarUrl,
        role: 'CUSTOMER',
        status: u.status === 'SUSPENDED' ? 'BLOCKED' : (u.status as any) || 'ACTIVE',
        createdAt: u.joinedDate || '2023-05-15',
        updatedAt: '2024-03-01',
        totalOrdersCount: 5,
        totalSpent: 18450,
        loyaltyPoints: 340,
      };
    }
    return MOCK_CUSTOMERS[0];
  }

  currentSeller(): Seller {
    const sId = this.currentSellerId();
    const sel = MOCK_SELLERS.find((s) => s.id === sId);
    return sel || MOCK_SELLERS[0];
  }

  currentAdmin(): AdminUser {
    const u = this.store.currentUser();
    return {
      id: u?.id || 'admin-1',
      name: u?.name || 'Eleanor Vance (Platform Admin)',
      email: u?.email || 'admin@auramarket.demo',
      role: 'ADMIN',
      department: 'Marketplace Operations',
      permissions: ['ALL'],
      createdAt: u?.joinedDate || '2023-01-01',
      updatedAt: '2024-03-01',
    };
  }

  login(credentials: LoginCredentials, expectedRole?: UserRole): Observable<{ user: AuthUser; token: string }> {
    this.store.setLoading(true);
    return this.repository.login(credentials, expectedRole).pipe(
      tap(({ user, token }) => {
        this.store.setUser(user, token);
        this.store.setLoading(false);
      }),
      catchError((err) => {
        this.store.setLoading(false);
        this.store.setError(err.message || 'Login failed.');
        throw err;
      })
    );
  }

  registerCustomer(data: RegisterData): Observable<{ user: AuthUser; token: string }> {
    this.store.setLoading(true);
    return this.repository.registerCustomer(data).pipe(
      tap(({ user, token }) => {
        this.store.setUser(user, token);
        this.store.setLoading(false);
      }),
      catchError((err) => {
        this.store.setLoading(false);
        this.store.setError(err.message || 'Registration failed.');
        throw err;
      })
    );
  }

  registerSeller(data: SellerRegisterData): Observable<{ user: AuthUser; token: string }> {
    this.store.setLoading(true);
    return this.repository.registerSeller(data).pipe(
      tap(({ user, token }) => {
        this.store.setUser(user, token);
        this.store.setLoading(false);
      }),
      catchError((err) => {
        this.store.setLoading(false);
        this.store.setError(err.message || 'Seller registration failed.');
        throw err;
      })
    );
  }

  loginWithGoogle(payload: GoogleAuthPayload, expectedRole?: UserRole): Observable<{ user: AuthUser; token: string }> {
    this.store.setLoading(true);
    return this.repository.authenticateGoogle(payload, expectedRole).pipe(
      tap(({ user, token }) => {
        this.store.setUser(user, token);
        this.store.setLoading(false);
      }),
      catchError((err) => {
        this.store.setLoading(false);
        this.store.setError(err.message || 'Google authentication failed.');
        throw err;
      })
    );
  }

  logout(): Observable<boolean> {
    return this.repository.logout().pipe(
      tap(() => {
        this.store.clear();
      })
    );
  }

  restoreSession(): void {
    this.repository.restoreSession().subscribe((session) => {
      if (session) {
        this.store.setUser(session.user, session.token);
      }
    });
  }

  hasRole(role: UserRole): boolean {
    return this.store.userRole() === role;
  }

  canAccessSeller(sellerId: string): boolean {
    if (this.isAdmin()) return true;
    if (this.isSeller() && this.store.sellerId() === sellerId) return true;
    return false;
  }

  // Developer switch role method (retains fallback)
  switchRole(role: UserRole): void {
    const currentUser = this.store.currentUser();
    if (currentUser) {
      currentUser.role = role;
      this.store.setUser({ ...currentUser }, this.store.token());
    } else {
      if (role === 'CUSTOMER') {
        this.login({ email: 'customer@auramarket.demo' }, 'CUSTOMER').subscribe();
      } else if (role === 'SELLER') {
        this.login({ email: 'seller@auramarket.demo' }, 'SELLER').subscribe();
      } else if (role === 'ADMIN') {
        this.login({ email: 'admin@auramarket.demo' }, 'ADMIN').subscribe();
      }
    }
  }
}
