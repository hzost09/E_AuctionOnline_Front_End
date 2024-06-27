import { Component, OnInit } from '@angular/core';
import { EmailModel } from '../../model/EmailModel';
import { AuthService } from '../../Service/Auth.service';
import { finalize } from 'rxjs';



@Component({
  selector: 'app-email-reset-form',
  templateUrl: './email-reset-form.component.html',
  styleUrl: './email-reset-form.component.css'
})
export class EmailResetFormComponent implements OnInit {
  public inputData!:string;
  public errorEmail!:boolean;
  public errorEmailMessage!:string;
  public blocknextrequest:boolean = true;
  emailmodel:EmailModel = new EmailModel();
  constructor(private Auth:AuthService) {


  }
  ngOnInit(): void {

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
  SendEmaillink(email:string){
    this.blocknextrequest = false;
    this.emailmodel.email = this.inputData;
    console.log(email);
    this.Auth.sendlink(this.emailmodel).pipe(finalize(() => {
      this.blocknextrequest = true;
    })).subscribe({
      next:(res) => {
        alert(res.message)
        console.log(res);
      },
      error:(err) =>{
        alert(err.message)
        console.log(err);
      }
    })
  }
}
