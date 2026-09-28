import { Observable } from 'rxjs';
import {
  AuthUser,
  LoginCredentials,
  RegisterData,
  SellerRegisterData,
  GoogleAuthPayload,
  UserRole,
} from './auth.models';

export abstract class AuthRepository {
  abstract login(credentials: LoginCredentials, expectedRole?: UserRole): Observable<{ user: AuthUser; token: string }>;
  abstract registerCustomer(data: RegisterData): Observable<{ user: AuthUser; token: string }>;
  abstract registerSeller(data: SellerRegisterData): Observable<{ user: AuthUser; token: string }>;
  abstract authenticateGoogle(payload: GoogleAuthPayload, expectedRole?: UserRole): Observable<{ user: AuthUser; token: string }>;
  abstract restoreSession(): Observable<{ user: AuthUser; token: string } | null>;
  abstract logout(): Observable<boolean>;
}
