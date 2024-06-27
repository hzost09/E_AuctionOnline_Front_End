import { Component } from '@angular/core';
import { finalize } from 'rxjs';
import { ResetPassWordModel } from '../../model/ResetPassWord';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../service/Auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  public errorPassword!:boolean;
 public errorPasswordMessage!:string;
public samePassword!:boolean;
public blocknextrequest:boolean = true;
public Resetpassword:ResetPassWordModel = new ResetPassWordModel();
  constructor(private active:ActivatedRoute,private Auth:AuthService) {

  }
    ngOnInit(): void {
    this.active.queryParams.subscribe(val =>{
      this.Resetpassword.Email = val['email'];
      this.Resetpassword.EmailToken = val['code'];
      this.Resetpassword.EmailToken.replace(/ /g,'+');
    })

    }
    // validate form
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

    checksamepasswordforbutton(){
      if(this.Resetpassword.PasswordReset === this.Resetpassword.ConfirmPassWord &&
         (this.Resetpassword.ConfirmPassWord != null &&  this.Resetpassword.PasswordReset != null)){
        this.samePassword = true;
      }
     else
     {
        this.samePassword = false;
      }
      return this.samePassword;
    }

    checksamepassword(){
      if(this.Resetpassword.PasswordReset === this.Resetpassword.ConfirmPassWord){
        this.samePassword = true;
      }
     else
     {
        this.samePassword = false;
      }
      return this.samePassword;
    }

  //sendresetpassword
  sendResetPassword(){
    console.log(this.Resetpassword);
    this.blocknextrequest = false;
    this.Auth.sendResetPassWordRequest(this.Resetpassword).pipe( finalize(() => {
      // Mã trong finalize sẽ được thực thi trong mọi trường hợp, bao gồm cả khi có lỗi xảy ra
      this.blocknextrequest = true; // Thiết lập biến isLoading thành false khi request kết thúc
    })).subscribe({
      next:(res) => {
          alert(res);
      },
      error:(err)=> {
        alert(err);
      }
    })
  }
}
