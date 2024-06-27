import { verifyModel } from '../model/verifyModel';
import { registerModel } from '../model/registerModel';
import { loginModel } from '../model/loginModel';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResetPassWordModel } from '../model/ResetPassWord';
import { EmailModel } from '../model/EmailModel';
import { CanActivateFn } from '@angular/router';
import { TokenModel } from '../model/TokenModel';
import { Observable, map } from 'rxjs';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl:string = "https://localhost:7115/api/Auth/";
  constructor(private http:HttpClient) { }

  //register
  register(registermodel:registerModel){
    let headers = new HttpHeaders();
    headers = headers.append('No-Auth','True');
    return this.http.post<any>(`${this.baseUrl}SignUp`,registermodel,{headers});
  }
  //login
  Login(loginmodel:loginModel){
    let headers = new HttpHeaders();
    headers = headers.append('No-Auth','True');
    return this.http.post<any>(`${this.baseUrl}SignIn`,loginmodel,{headers});
  }
  //verifyToken
  verify(verifymodel:verifyModel){
    let headers = new HttpHeaders();
    headers = headers.append('No-Auth','True');
    return this.http.post<any>(`${this.baseUrl}verify`,verifymodel,{headers});
  }
  //send reset link
  sendlink(email:EmailModel){
    let headers = new HttpHeaders();
    headers = headers.append('No-Auth','True');
    return this.http.post<any>(`${this.baseUrl}checkemailandsendlink`,email,{headers});
  }
  //send Resetpassword model
  sendResetPassWordRequest(model:ResetPassWordModel){
    let headers = new HttpHeaders();
    headers = headers.append('No-Auth','True');
    return this.http.post<any>(`${this.baseUrl}ResetPassword`,model,{headers});
  }

  //check and create new refreshToken
  checkAndCreateToken(token:TokenModel) : Observable<TokenModel>{
    const payload = { token };
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('No-Auth', 'True');
    headers = headers.append('Accept', '*/*'); // Add Accept header
    return this.http.post<any>(`${this.baseUrl}checkToken`, token);
  }
    // checkAndCreateToken(token:string){
    //   const payload = { token };
    //   let headers = new HttpHeaders();
    //   headers = headers.append('Content-Type', 'application/json');
    //   headers = headers.append('No-Auth', 'True');
    //   headers = headers.append('Accept', '*/*'); // Add Accept header

    //   console.log(token);
    //   return this.http.post<any>(`${this.baseUrl}checkToken`, `"${token}"`, { headers }); // Send token as a JSON string
    //}
}
