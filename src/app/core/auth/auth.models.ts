export type UserRole = 'CUSTOMER' | 'SELLER' | 'ADMIN';

export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING' | 'REJECTED';

export type AuthProvider = 'PASSWORD' | 'GOOGLE';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  authProvider: AuthProvider;
  googleSubjectId?: string;
  sellerId?: string;
  phone?: string;
  joinedDate?: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone?: string;
  dateOfBirth?: string;
  acceptTerms: boolean;
}

export interface SellerRegisterData {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  businessType: string;
  gstin: string;
  pan: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  description?: string;
  password?: string;
  acceptTerms: boolean;
}

export interface GoogleAuthPayload {
  credential: string;
  sub: string;
  email: string;
  name: string;
  picture?: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
