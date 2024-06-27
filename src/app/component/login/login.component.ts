import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { loginModel } from '../../model/loginModel';

import { JwtService } from '../../service/jwt.service';
import { Router } from '@angular/router';
import { ShareService } from '../../service/share.service';
import { finalize } from 'rxjs';
import { AuthService } from '../../service/Auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  @Input() loginmodel: loginModel = { Email: '', Password: '' };
  loginForm!: FormGroup ;
  public isShowForm!:boolean;
  public blocknextrequest:boolean = true;

  constructor(private formbuilder: FormBuilder,private Auth:AuthService,private jwt:JwtService,private route:Router,private shareservice:ShareService) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    if (!this.loginmodel) {
      this.loginmodel = { Email: '', Password: '' };
    }
    this.loginForm = this.formbuilder.group({
      Email: [this.loginmodel?.Email , [Validators.required, Validators.email, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}')]],
      Password: [this.loginmodel?.Password , [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/)]]
    });
  }

  onLogin(){
    this.blocknextrequest = false;
    if(this.loginForm.valid){
      this.loginmodel = this.loginForm.value;
      console.log(this.loginmodel);
       this.Auth.Login(this.loginmodel).pipe(finalize(() => {
        this.blocknextrequest = true;
      })).subscribe({
        next:async(res) => {
          alert('success login');
              this.jwt.StoreToken(res.accessToken);
              this.jwt.StoreRefreshtoken(res.refreshToken);
              const takerole = this.jwt.getRole();
              if(takerole == 'Admin'){
                  this.route.navigate(['dashboard']);
                  this.shareservice.sendEvent('login');
              }
              else if(takerole == 'User'){
                  this.route.navigate(['']);
                  this.shareservice.sendEvent('login');
                }
              else{
                this.route.navigate(['login'])
                alert('You had been block or Your Account didnt Exit');
              }
        },
        error:(err) => {
          console.log(err);
          console.log(err.error.message);
          alert(err.error.message);
        }
       });
      }
      else{
        this.blocknextrequest = true;
        alert('Invalid Form');
      }
  }
  showForm(){
    this.isShowForm = !this.isShowForm
  }
  }

