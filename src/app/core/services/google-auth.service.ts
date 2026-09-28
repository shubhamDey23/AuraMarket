import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { GoogleAuthPayload } from '../auth/auth.models';
import { AUTH_CONSTANTS } from '../auth/auth.constants';

declare const google: any;

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  private googleAuthSubject = new Subject<GoogleAuthPayload>();
  public googleAuth$ = this.googleAuthSubject.asObservable();
  private initialized = false;

  initializeGoogleSignIn(callback: (payload: GoogleAuthPayload) => void): void {
    if (this.initialized) return;

    if (typeof google !== 'undefined' && google?.accounts?.id) {
      try {
        google.accounts.id.initialize({
          client_id: AUTH_CONSTANTS.DEFAULT_GOOGLE_CLIENT_ID,
          callback: (response: any) => {
            const payload = this.decodeJwtResponse(response.credential);
            callback(payload);
            this.googleAuthSubject.next(payload);
          },
        });
        this.initialized = true;
      } catch (err) {
        console.warn('Google Identity Services initialization skipped/fallback:', err);
      }
    }
  }

  renderButton(elementId: string, options: any = {}): void {
    if (typeof google !== 'undefined' && google?.accounts?.id && document.getElementById(elementId)) {
      try {
        google.accounts.id.renderButton(document.getElementById(elementId), {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'continue_with',
          ...options,
        });
      } catch (e) {
        console.warn('GIS renderButton error:', e);
      }
    }
  }

  triggerMockGoogleSignIn(mockRole: 'CUSTOMER' | 'SELLER' = 'CUSTOMER'): GoogleAuthPayload {
    const mockPayload: GoogleAuthPayload = {
      credential: `mock-google-id-token-${Date.now()}`,
      sub: `g-sub-${Math.floor(Math.random() * 9000000 + 1000000)}`,
      email: mockRole === 'SELLER' ? 'seller.google@auramarket.demo' : 'rahul.google@auramarket.demo',
      name: mockRole === 'SELLER' ? 'Rohan Mehta (Google Seller)' : 'Rahul Sharma (Google User)',
      picture: 'https://lh3.googleusercontent.com/a/ACg8ocIq_R3210=s96-c',
    };
    this.googleAuthSubject.next(mockPayload);
    return mockPayload;
  }

  private decodeJwtResponse(token: string): GoogleAuthPayload {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const parsed = JSON.parse(jsonPayload);
      return {
        credential: token,
        sub: parsed.sub || `g-${Date.now()}`,
        email: parsed.email || 'user@gmail.com',
        name: parsed.name || 'Google User',
        picture: parsed.picture,
      };
    } catch {
      return {
        credential: token,
        sub: `g-${Date.now()}`,
        email: 'user@gmail.com',
        name: 'Google User',
      };
    }
  }
}
