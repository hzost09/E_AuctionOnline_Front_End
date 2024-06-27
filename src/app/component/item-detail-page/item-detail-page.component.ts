import { map } from 'rxjs';
import { UserService } from './../../service/User.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItemModel } from '../../model/ItemModel';
import { BidModel } from '../../model/BidModel';
import { JwtService } from '../../service/jwt.service';
import { BidRequestModel } from '../../model/BidRequestModel';
import { UserModel } from '../../model/UserModel';

@Component({
  selector: 'app-item-detail-page',
  templateUrl: './item-detail-page.component.html',
  styleUrl: './item-detail-page.component.css'
})
export class ItemDetailPageComponent implements OnInit{
  itemIdString!:String;
  item!:ItemModel;
  temp!:any;
  listBid:BidModel[] = [];
  bidModel!:BidModel;
  bidAmount!:Number;
  isShowForm:boolean = false;
  blockNextRequest:Boolean = true;
  bideRequestModel!:BidRequestModel;
  userDetails:any;
  constructor(private activeRoute:ActivatedRoute,private userService:UserService,private jwtservice:JwtService){

  }
  ngOnInit(): void {
      this.itemIdString = this.activeRoute.snapshot.paramMap.get("id")!;
      this.getItemWithId();
      this.getBidWithItemId();
  }

 async getItemWithId(){
    let itemId = Number(this.itemIdString);
    this.userService.getOneItem(itemId).subscribe({
     next: (res: any) => {
      console.log(res);
       this.item = new ItemModel();
       this.item.pathImg = res.image;
       this.item.Description = res.description;
       this.item.categoryName = res.categoryName;
       this.item.pathDocument = res.document;
     },
     error: (err: any) => {
       console.log(err);
     }
   });
  }

  getBidWithItemId(){
    let itemId = Number(this.itemIdString);
    this.userService.getBidbyItemId(itemId).subscribe({
      next:(res:any) => {
      res.listBid.forEach((item:any) => {
        this.bidModel = new BidModel();
        this.bidModel.bidAmount = item.bidAmount;
        this.bidModel.userEmail = item.user.email;
        this.bidModel.userImage = item.user.avatar;
        this.listBid.push(this.bidModel);
      })
      console.log(this.listBid);
      },
      error:(err) => {
        console.log(err);
      }
    })
  }

  showForm() {
      this.isShowForm = !this.isShowForm;
  }

  async getUserDetails(): Promise<number> {
    const email = this.jwtservice.getEmail();
    return new Promise((resolve, reject) => {
      this.userService.getProfile(email).subscribe({
        next: (res) => {
          this.userDetails = res;
          console.log(this.userDetails.id);
          resolve(this.userDetails.id);
        },
        error: (err) => {
          console.log(err);
          reject(err);
        }
      });
    });
  }
  async placeOneBid(){
    this.blockNextRequest = false;
    const email =  this.jwtservice.getEmail();
    if(email == null || email == undefined){
      alert('you need to login first')
      return ;
    }
   this.bideRequestModel = new BidRequestModel();
   this.bideRequestModel.bidAmount = this.bidAmount;
  this.bideRequestModel.userId = await this.getUserDetails();
  console.log( this.bideRequestModel.userId)
  this.bideRequestModel.itemId = Number(this.itemIdString);
  this.userService.placeBid(this.bideRequestModel).subscribe({
    next:(res) =>{
      console.log(res);
      alert(res);
      this.blockNextRequest = true;
    },
    error:(err) =>{
      alert(err.error.message)
      console.log(err.error);
      console.log(err.error.message);
      this.blockNextRequest = true;
    }
  });
  }

  //download
  downloadDocument(){
   var name = this.getFileName(this.item.pathDocument)
    console.log(name);
    this.userService.downloadLink(name).subscribe({
      next:(res) => {
        const downloadUrl = window.URL.createObjectURL(res);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = name;
        link.click();
        window.URL.revokeObjectURL(downloadUrl); // Clean up
      },
      error:(err) => {
        console.log(err);
      }
    });
  }
  getFileName(filePath: string): string {
    let fileName = '';
    for (let i = filePath.length - 1; i >= 0; i--) {
      const char = filePath[i];
      if (char === '\\' || char === '/') {
        break;
      }
      fileName = char + fileName;
    }
    return fileName;
  }
}
