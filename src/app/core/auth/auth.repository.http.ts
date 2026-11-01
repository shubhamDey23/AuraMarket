import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, tap, catchError, throwError } from 'rxjs';
import { AuthRepository } from './auth.repository';
import { AuthUser, LoginCredentials, RegisterData, SellerRegisterData, GoogleAuthPayload, UserRole } from './auth.models';
import { environment } from '../../../environments/environment';
import { TenantResolverService } from '../config/tenant-resolver.service';

interface ApiEnvelope<T> { success?: boolean; data?: T; message?: string; }
interface ApiUser { id: string; email: string; firstName?: string; lastName?: string; phone?: string; roles?: string[]; status?: string; }
interface AuthPayload { accessToken: string; refreshToken?: string; expiresIn?: number; user: ApiUser; }

@Injectable({ providedIn: 'root' })
export class AuthRepositoryHttp extends AuthRepository {
  private readonly baseUrl = `${environment.apiGatewayUrl}/api/v1/auth`;
  private readonly tokenKey = 'auramarket_access_token';
  private readonly refreshKey = 'auramarket_refresh_token';
  private readonly userKey = 'auramarket_user';
  constructor(private http: HttpClient, private tenantResolver: TenantResolverService) { super(); }

  private mapUser(dto: ApiUser): AuthUser {
    const roles = dto.roles || [];
    const role: UserRole = roles.some(r => r.toUpperCase().includes('ADMIN')) ? 'ADMIN'
      : roles.some(r => r.toUpperCase().includes('SELLER')) ? 'SELLER' : 'CUSTOMER';
    return { id: dto.id, email: dto.email, name: [dto.firstName, dto.lastName].filter(Boolean).join(' ') || dto.email,
      phone: dto.phone, role, status: (dto.status || 'ACTIVE').toUpperCase() as AuthUser['status'], authProvider: 'PASSWORD',
      joinedDate: new Date().toISOString() };
  }
  private save(payload: AuthPayload): { user: AuthUser; token: string } {
    const user = this.mapUser(payload.user);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.tokenKey, payload.accessToken);
      if (payload.refreshToken) localStorage.setItem(this.refreshKey, payload.refreshToken);
      localStorage.setItem(this.userKey, JSON.stringify(user));
    }
    return { user, token: payload.accessToken };
  }
  login(credentials: LoginCredentials, _expectedRole?: UserRole): Observable<{ user: AuthUser; token: string }> {
    return this.http.post<ApiEnvelope<AuthPayload>>(`${this.baseUrl}/login`, {
      tenantCode: this.tenantResolver.resolveTenantCode(), email: credentials.email, password: credentials.password
    }).pipe(map(r => { if (!r.data?.accessToken || !r.data.user) throw new Error(r.message || 'Login response was incomplete.'); return this.save(r.data); }));
  }
  registerCustomer(data: RegisterData): Observable<{ user: AuthUser; token: string }> {
    return this.http.post<ApiEnvelope<ApiUser>>(`${this.baseUrl}/register`, {
      tenantCode: this.tenantResolver.resolveTenantCode(), email: data.email, password: data.password,
      firstName: data.firstName, lastName: data.lastName, phone: data.phone
    }).pipe(map(r => { if (!r.data?.id) throw new Error(r.message || 'Registration response was incomplete.'); return { user: this.mapUser(r.data), token: '' }; }),
      tap(({ user }) => { if (typeof localStorage !== 'undefined') localStorage.setItem(this.userKey, JSON.stringify(user)); }));
  }
  registerSeller(_data: SellerRegisterData): Observable<{ user: AuthUser; token: string }> {
    return throwError(() => new Error('Seller onboarding requires customer account registration followed by the seller onboarding API. That flow is not available in the current frontend form yet.'));
  }
  authenticateGoogle(_payload: GoogleAuthPayload, _expectedRole?: UserRole): Observable<{ user: AuthUser; token: string }> {
    return throwError(() => new Error('Google sign-in is not exposed by the current backend API. Use email and password until OAuth endpoints are configured.'));
  }
  restoreSession(): Observable<{ user: AuthUser; token: string } | null> {
    if (typeof localStorage === 'undefined') return of(null);
    const token = localStorage.getItem(this.tokenKey);
    const storedUser = localStorage.getItem(this.userKey);
    if (!token || !storedUser) return of(null);
    try { return of({ user: JSON.parse(storedUser) as AuthUser, token }); } catch { this.clearStorage(); return of(null); }
  }
  logout(): Observable<boolean> {
    const refreshToken = typeof localStorage !== 'undefined' ? localStorage.getItem(this.refreshKey) : null;
    const request = refreshToken
      ? this.http.post<ApiEnvelope<null>>(`${this.baseUrl}/logout`, { refreshToken }).pipe(map(() => true), catchError(() => of(true)))
      : of(true);
    return request.pipe(tap(() => this.clearStorage()));
  }
  private clearStorage(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.tokenKey); localStorage.removeItem(this.refreshKey); localStorage.removeItem(this.userKey);
    }
  }
}
