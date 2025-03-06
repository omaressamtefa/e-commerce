import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// Service for SSR-compatible localStorage access
const createLocalStorageService = (platformId: object) => ({
  getToken(): string | null {
    if (isPlatformBrowser(platformId)) {
      return localStorage.getItem('userToken');
    }
    return null;
  },
  clearToken(): void {
    if (isPlatformBrowser(platformId)) {
      localStorage.removeItem('userToken');
    }
  },
});

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);
  const localStorageService = createLocalStorageService(platformId);

  // Clone request and add headers
  const modifiedReq = req.clone({
    setHeaders: {
      'Custom-Header': 'CustomHeaderValue',
      ...(localStorageService.getToken() && {
        Authorization: `Bearer ${localStorageService.getToken()}`,
      }),
    },
  });

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        localStorageService.clearToken();
        router.navigate(['/login']).then(() => {
          if (isPlatformBrowser(platformId)) {
            window.location.reload();
          }
        });
      }
      return throwError(() => error);
    })
  );
};
