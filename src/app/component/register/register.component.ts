import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { registerModel } from '../../model/registerModel';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../../service/Auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  //errorName
  public errorNameMessage:string = '';
  public errorName!:boolean;
  //errorEmail
  public errorEmailMessage:string = '';
  public errorEmail!:boolean;
  //errorPassword
  public errorPasswordMessage:string = '';
  public errorPassword!:boolean;
  //error confrimPassword
  public confirmPassWord!:string;
  public errorConfrimPasswordMessage:string = '';
  public errorConfrimPassword!:boolean;
  //
  public blocknextrequest:boolean = true;
  registermodel: registerModel = new registerModel ();

    constructor(private formbuilder: FormBuilder,private Auth:AuthService,private route:Router) {

    }
    ngOnInit(): void {

    }
    //validate
    validateName(event:string){
      const val = event;
        if(val.length <= 3 ){
          this.errorName= false;
          this.errorNameMessage  = "UserName have at least 3 character"
        }
        else{
          this.errorName = true;
        }
    }
    validatePassword(event:string){
      const val = event;
      const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!val.match(passwordPattern)) {
        this.errorPassword = false;
        this.errorPasswordMessage = "Password at least 8 character 1 uppercase 1 number"
      }
      else {
        this.errorPassword = true;
      }
    }
    validateEmail(event:string){
    const val = event;
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
      if (!val.match(emailPattern)) {
        this.errorEmail = false;
        this.errorEmailMessage = "Email Invalid"
      }
      else {
        this.errorEmail = true;
      }
    }
    validateConfrimPassword(event:string){
      const val = event;
      if( val  === this.registermodel.Password){
          return this.errorConfrimPassword = true;
      }
      else{
        this.errorConfrimPasswordMessage = "not match"
       return this.errorConfrimPassword = false;
      }

    }
    //
    //register
    onRegister(){
      if(this.errorName != true || this.errorName != true || this.errorPassword != true
          || this.errorConfrimPassword != true){
        alert('your Form have Invalid value')
        return;
      }
      this.blocknextrequest = false;
      console.log((this.registermodel))
     this.Auth.register(this.registermodel).pipe(finalize(() => {
      this.blocknextrequest = true;
    })).subscribe({
      next:(res) =>{
        alert((res.message))
        this.route.navigate(['login'])
      },
      error:(err) =>{
        console.log(err);
        alert(err.error.message)
      }
     })
    }
  }
