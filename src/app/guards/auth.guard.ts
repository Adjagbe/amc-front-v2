import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);

  let isAuthenticated = false;

  if (isPlatformBrowser(platformId)) {
    isAuthenticated = localStorage.getItem('session') !== null;
  }
  if (isAuthenticated) {
    return true;
  } else {
    if (isPlatformBrowser(platformId)) {

      router.navigate(['/connexion']);
    }
    return false;
  }
};
