import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { AuthRepository } from './auth.repository';
import {
  AuthUser,
  LoginCredentials,
  RegisterData,
  SellerRegisterData,
  GoogleAuthPayload,
  UserRole,
} from './auth.models';
import { AUTH_CONSTANTS } from './auth.constants';
import { MOCK_CUSTOMERS } from '../../data/mock/customers.mock';
import { MOCK_SELLERS } from '../../data/mock/sellers.mock';

@Injectable({
  providedIn: 'root',
})
export class AuthRepositoryMock extends AuthRepository {
  private users: AuthUser[] = [
    {
      id: 'cust-1',
      email: 'customer@auramarket.demo',
      name: 'Rahul Sharma',
      avatar: MOCK_CUSTOMERS[0].avatarUrl,
      role: 'CUSTOMER',
      status: 'ACTIVE',
      authProvider: 'PASSWORD',
      phone: '+91 98765 43210',
      joinedDate: '2023-05-15',
    },
    {
      id: 'cust-2',
      email: 'priya@auramarket.demo',
      name: 'Priya Singh',
      avatar: MOCK_CUSTOMERS[1].avatarUrl,
      role: 'CUSTOMER',
      status: 'ACTIVE',
      authProvider: 'PASSWORD',
      phone: '+91 98123 45678',
      joinedDate: '2023-08-20',
    },
    {
      id: 'seller-user-1',
      email: 'seller@auramarket.demo',
      name: 'Vikram Mehta (Apex Digital)',
      avatar: MOCK_SELLERS[0].logoUrl,
      role: 'SELLER',
      status: 'ACTIVE',
      authProvider: 'PASSWORD',
      sellerId: 'seller-1',
      phone: '+91 98989 12345',
      joinedDate: '2023-01-10',
    },
    {
      id: 'seller-user-2',
      email: 'threads@auramarket.demo',
      name: 'Neha Kapoor (Urban Threads)',
      avatar: MOCK_SELLERS[1].logoUrl,
      role: 'SELLER',
      status: 'ACTIVE',
      authProvider: 'PASSWORD',
      sellerId: 'seller-2',
      phone: '+91 98765 11122',
      joinedDate: '2023-03-12',
    },
    {
      id: 'seller-user-3',
      email: 'homenest@auramarket.demo',
      name: 'Rajesh Verma (HomeNest)',
      avatar: MOCK_SELLERS[2].logoUrl,
      role: 'SELLER',
      status: 'ACTIVE',
      authProvider: 'PASSWORD',
      sellerId: 'seller-3',
      phone: '+91 98111 22334',
      joinedDate: '2023-06-01',
    },
    {
      id: 'admin-user-1',
      email: 'admin@auramarket.demo',
      name: 'Eleanor Vance (Platform Admin)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      role: 'ADMIN',
      status: 'ACTIVE',
      authProvider: 'PASSWORD',
      phone: '+91 99999 00000',
      joinedDate: '2022-11-01',
    },
  ];

  login(credentials: LoginCredentials, expectedRole?: UserRole): Observable<{ user: AuthUser; token: string }> {
    const email = credentials.email.toLowerCase().trim();
    let found = this.users.find((u) => u.email.toLowerCase() === email);

    // If expectedRole provided, check role match
    if (found && expectedRole && found.role !== expectedRole) {
      return throwError(() => new Error(`Account exists but does not have ${expectedRole} portal access privileges.`));
    }

    // Auto-create demo customer if missing and credentials look valid
    if (!found) {
      if (email.includes('admin')) {
        return throwError(() => new Error('Invalid administrator credentials or unauthorized account.'));
      }
      if (email.includes('seller') || expectedRole === 'SELLER') {
        return throwError(() => new Error('Seller account not found. Please register your store first.'));
      }
      found = {
        id: `user-${Date.now()}`,
        email: email,
        name: email.split('@')[0].replace('.', ' '),
        role: expectedRole || 'CUSTOMER',
        status: 'ACTIVE',
        authProvider: 'PASSWORD',
        joinedDate: new Date().toISOString().split('T')[0],
      };
      this.users.push(found);
    }

    if (found.status === 'SUSPENDED') {
      return throwError(() => new Error('Account suspended by platform governance. Contact support.'));
    }

    const token = `mock-jwt-token-${found.id}-${Date.now()}`;
    this.persistSession(found, token);
    return of({ user: found, token }).pipe(delay(400));
  }

  registerCustomer(data: RegisterData): Observable<{ user: AuthUser; token: string }> {
    const email = data.email.toLowerCase().trim();
    const existing = this.users.find((u) => u.email.toLowerCase() === email);
    if (existing) {
      return throwError(() => new Error('An account with this email address already exists.'));
    }

    const newUser: AuthUser = {
      id: `cust-${Date.now()}`,
      email: email,
      name: `${data.firstName} ${data.lastName}`,
      role: 'CUSTOMER',
      status: 'ACTIVE',
      authProvider: 'PASSWORD',
      phone: data.phone,
      joinedDate: new Date().toISOString().split('T')[0],
    };

    this.users.push(newUser);
    const token = `mock-jwt-token-${newUser.id}-${Date.now()}`;
    this.persistSession(newUser, token);
    return of({ user: newUser, token }).pipe(delay(500));
  }

  registerSeller(data: SellerRegisterData): Observable<{ user: AuthUser; token: string }> {
    const email = data.email.toLowerCase().trim();
    const existing = this.users.find((u) => u.email.toLowerCase() === email);
    if (existing) {
      return throwError(() => new Error('An account with this email address already exists.'));
    }

    const newSellerId = `seller-${Date.now()}`;
    const newSellerUser: AuthUser = {
      id: `seller-user-${Date.now()}`,
      email: email,
      name: `${data.ownerName} (${data.businessName})`,
      role: 'SELLER',
      status: 'PENDING',
      sellerId: newSellerId,
      authProvider: 'PASSWORD',
      phone: data.phone,
      joinedDate: new Date().toISOString().split('T')[0],
    };

    this.users.push(newSellerUser);
    const token = `mock-jwt-token-${newSellerUser.id}-${Date.now()}`;
    this.persistSession(newSellerUser, token);
    return of({ user: newSellerUser, token }).pipe(delay(600));
  }

  authenticateGoogle(payload: GoogleAuthPayload, expectedRole?: UserRole): Observable<{ user: AuthUser; token: string }> {
    const email = payload.email.toLowerCase().trim();
    let found = this.users.find((u) => u.googleSubjectId === payload.sub || u.email.toLowerCase() === email);

    if (!found) {
      // Google sign in creates CUSTOMER by default (unless explicitly expectedRole is valid)
      found = {
        id: `user-g-${Date.now()}`,
        email: email,
        name: payload.name || email.split('@')[0],
        avatar: payload.picture,
        role: expectedRole === 'SELLER' ? 'CUSTOMER' : expectedRole || 'CUSTOMER',
        status: 'ACTIVE',
        authProvider: 'GOOGLE',
        googleSubjectId: payload.sub,
        joinedDate: new Date().toISOString().split('T')[0],
      };
      this.users.push(found);
    } else {
      found.googleSubjectId = payload.sub;
      if (payload.picture) found.avatar = payload.picture;
    }

    if (expectedRole && found.role !== expectedRole) {
      return throwError(() => new Error(`Google account "${email}" is registered as ${found!.role}. Please sign in to the matching portal.`));
    }

    const token = `mock-google-token-${found.id}-${Date.now()}`;
    this.persistSession(found, token);
    return of({ user: found, token }).pipe(delay(500));
  }

  restoreSession(): Observable<{ user: AuthUser; token: string } | null> {
    try {
      const rawUser = sessionStorage.getItem(AUTH_CONSTANTS.STORAGE_KEY_USER) || localStorage.getItem(AUTH_CONSTANTS.STORAGE_KEY_USER);
      const token = sessionStorage.getItem(AUTH_CONSTANTS.STORAGE_KEY_TOKEN) || localStorage.getItem(AUTH_CONSTANTS.STORAGE_KEY_TOKEN);
      if (rawUser && token) {
        const user: AuthUser = JSON.parse(rawUser);
        return of({ user, token });
      }
    } catch {
      this.clearSession();
    }
    return of(null);
  }

  logout(): Observable<boolean> {
    this.clearSession();
    return of(true).pipe(delay(200));
  }

  private persistSession(user: AuthUser, token: string): void {
    try {
      sessionStorage.setItem(AUTH_CONSTANTS.STORAGE_KEY_USER, JSON.stringify(user));
      sessionStorage.setItem(AUTH_CONSTANTS.STORAGE_KEY_TOKEN, token);
      localStorage.setItem(AUTH_CONSTANTS.STORAGE_KEY_USER, JSON.stringify(user));
      localStorage.setItem(AUTH_CONSTANTS.STORAGE_KEY_TOKEN, token);
    } catch (e) {
      console.warn('Unable to persist session to browser storage:', e);
    }
  }

  private clearSession(): void {
    try {
      sessionStorage.removeItem(AUTH_CONSTANTS.STORAGE_KEY_USER);
      sessionStorage.removeItem(AUTH_CONSTANTS.STORAGE_KEY_TOKEN);
      localStorage.removeItem(AUTH_CONSTANTS.STORAGE_KEY_USER);
      localStorage.removeItem(AUTH_CONSTANTS.STORAGE_KEY_TOKEN);
    } catch (e) {
      console.warn('Error clearing storage:', e);
    }
  }
}
