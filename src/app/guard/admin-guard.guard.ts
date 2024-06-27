import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtService } from '../service/jwt.service';

export const adminGuardGuard: CanActivateFn = (route, state) => {
  const authservice = inject(JwtService);
  const redirect = inject(Router);
  if(authservice.isLogIn()){
    if(authservice.getRole() != 'Admin'){
      alert('only for admin');
      redirect.navigate(['/login']);
      return false
    }
    else{
      return true;
    }
  }
  else{
    redirect.navigate(['/login']);
    return false;
  }
};
