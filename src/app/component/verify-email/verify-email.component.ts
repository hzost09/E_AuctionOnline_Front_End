import { Component } from '@angular/core';
import { verifyModel } from '../../model/verifyModel';
import { HttpClient } from '@angular/common/http';

import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../service/Auth.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css'
})
export class VerifyEmailComponent {
  verifymodel: verifyModel = new verifyModel();
  constructor(private http:HttpClient,private active:ActivatedRoute,private Auth:AuthService) {

  }
    ngOnInit(): void {
      this.active.queryParams.subscribe(val =>{
        this.verifymodel.Email = val['email'];
        this.verifymodel.verifyToken = val['code'];
        this.verifymodel.verifyToken.replace(/ /g,'+');
    })
  }
  onVerify(){
     this.Auth.verify(this.verifymodel).subscribe({
      next:(res)=>{
        console.log(res.message);
      },
      error:(err) => {
        console.log(err.message);
      }
     })
  }
}
