import { ApplicationConfig, provideZoneChangeDetection, provideAppInitializer, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authTokenInterceptor } from './core/auth/auth-token.interceptor';
import { routes } from './app.routes';
import { TenantConfigStore } from './core/config/tenant-config.store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([authTokenInterceptor])),
    provideAppInitializer(() => {
      const store = inject(TenantConfigStore);
      return store.loadConfig();
    }),
  ],
};
