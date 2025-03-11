import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const _snakBar = inject(MatSnackBar);

  if (authService.getIsLoggedIn()) {
    return true;
  } else{
    router.navigate(['/login'])
    _snakBar.open("Для доступа необходимо авторизоваться!")
    return false;
  }
  
};
