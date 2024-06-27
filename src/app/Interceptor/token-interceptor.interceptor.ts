import { HttpBackend, HttpClient, HttpErrorResponse, HttpHandler, HttpInterceptorFn, HttpResponse, HttpXhrBackend } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { TokenModel } from '../model/TokenModel';
import { AuthService } from '../service/Auth.service';
import { Route, Router } from '@angular/router';
import { inject } from '@angular/core';
import { XhrFactory, isPlatformBrowser } from '@angular/common';
import { JwtService } from '../service/jwt.service';

export const tokenInterceptorInterceptor: HttpInterceptorFn = (req, next) => {

 // Khởi tạo một XhrFactory
 const httpClient = new HttpClient(new HttpXhrBackend({ build: () => new XMLHttpRequest() }));


// // Khởi tạo AuthService và JwtService
// const authService = new AuthService(httpClient);
  const authService = inject(AuthService);
  let jwtService = new JwtService();
  let loggedUserData : any;
  const localData = jwtService.GetToken();
  if(req.headers.get('No-Auth')=='True'&& !localData){
    return next(req);
}
  loggedUserData = localData;
//  let jsonToken =  JSON.parse(loggedUserData);
  const reqClone = req.clone({
    setHeaders : {
      Authorization:`Bearer ${loggedUserData}`
    }
  });
return next(reqClone).pipe(
    catchError((error:any)=>{
      if(error instanceof HttpErrorResponse && error.status === 401){
        let currentToken = new TokenModel();
        currentToken.accessToken = jwtService.GetToken()!;
        currentToken.token = jwtService.GetRefreshToken()!;
        const token = jwtService.GetToken()!;
        return authService.checkAndCreateToken(currentToken).pipe(
          switchMap((data:any) => {
            jwtService.StoreRefreshtoken(data.refreshToken);
            jwtService.StoreToken(data.accessToken);
            console.log(data);
            console.log(data.RefreshToken);
            console.log(data.AccessToken);
            const reqWithNewToken = req.clone({
              setHeaders:{
                Authorization: `Bearer ${data.accessToken}`
              }
            });
            return next(reqWithNewToken);
          }),
          catchError((err) => {
            alert("your token expire pls re-login");
            window.location.href = '/login';
            return throwError(() => err);
          })
        );
      } else {
        return throwError(() => error);
      }
    })
  );
}
