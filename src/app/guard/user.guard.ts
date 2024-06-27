import { CanActivateFn, Router } from '@angular/router';
import { JwtService } from '../service/jwt.service';
import { inject } from '@angular/core';

export const userGuard: CanActivateFn = (route, state) => {
  const authservice = inject(JwtService);
  const redirect = inject(Router);
  if(authservice.isLogIn()){
    if(authservice.getRole() != 'User'){
      alert('only for User');
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
