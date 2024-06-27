import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { UserService } from '../../service/User.service';
import { Router } from '@angular/router';
import { ShareService } from '../../service/share.service';
import { JwtService } from '../../service/jwt.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  public loginORnot!:boolean;
  public userName!:String;
  public UserEmail!:String;
  public roLe!:String;
  constructor(private jwt:JwtService, private userservice:UserService,private router:Router,private shareservice:ShareService,  private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.shareservice.getEvent().subscribe(event => {
     if(event === 'login' || event === 'logout'){
        this.updateLoginState();
     }
    });
   this.checklogin();
  }
  updateLoginState(): void {
    if (this.isLogIn()) {
      this.userName = this.jwt.getUserName();
      this.UserEmail = this.jwt.getEmail();
      this.roLe = this.jwt.getRole();
      this.loginORnot = true;
    } else {
      this.loginORnot = false;
      this.userName = '';
      this.UserEmail = '';
      this.roLe = '';
    }
    this.cdr.detectChanges();
  }
  isLogIn(): boolean {
    if (typeof localStorage !== 'undefined') {
      return !!localStorage.getItem('AccessToken');
    }
    return false; // localStorage is not available
  }

  checklogin(){
    if(this.isLogIn()){
      this.userName = this.jwt.getUserName();
      this.UserEmail = this.jwt.getEmail();
      this.roLe = this.jwt.getRole();
      this.loginORnot = true;
      console.log(this.userName);
      return;
    }
    else{
      this.loginORnot = false;
      return;
    }
  }
  onLogOut(){
    localStorage.clear();
    this.loginORnot = false;
    this.shareservice.sendEvent('logout');
    this.router.navigate(['']);
    return;
  }

}
