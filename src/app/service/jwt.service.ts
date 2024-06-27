import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  private Playload:any;
  plaformId = inject(PLATFORM_ID);
  constructor() { }

  // save token
StoreToken(tokenvalue:string){
  localStorage.setItem('AccessToken',tokenvalue);
}
StoreRefreshtoken(tokenvalue:string){
  localStorage.setItem('RefreshToken',tokenvalue)
}

//use token
GetToken(){
  if (isPlatformBrowser(this.plaformId)) {
    console.log(this.plaformId);
    return localStorage.getItem('AccessToken');
  } else {
    // Handle token retrieval on the server-side (optional)
    return null; // Or return a default value
  }
}
GetRefreshToken(){
  return localStorage.getItem('RefreshToken');
}
//check token exits or not if not is mean no one login yet
isLogIn():boolean{
  return !!localStorage.getItem('AccessToken');
}
  // token decode + get role từ token
decodedToken(){
  const jwtHelper = new JwtHelperService();
   const Thetoken = this.GetToken()!;
    return jwtHelper.decodeToken(Thetoken);
  }
//get Name Token
 getUserName(){
  this.Playload = this.decodedToken();
  if(this.Playload)
      return  this.Playload.unique_name;
}
getEmail(){
  this.Playload = this.decodedToken();
  if(this.Playload)
      return  this.Playload.email;
}
// get role token
getRole(){
  this.Playload = this.decodedToken();
  if(this.Playload)
  return this.Playload.role;
}
// get time end jwt
getEndtime(){
  this.Playload = this.decodedToken();
  if(this.Playload.exp === undefined){
    return;
  }
  else{
    const datejwt = new Date(this.Playload.exp);
    datejwt.setHours(0,0,0,0);
  return datejwt;
  }
}
}
