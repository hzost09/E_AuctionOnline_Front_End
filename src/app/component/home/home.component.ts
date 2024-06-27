import { Subscription, interval, map } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../service/User.service';
import { ItemModel } from '../../model/ItemModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SearchRequestModel } from '../../model/SearchRequestModel';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit,OnDestroy{

  //page
  pageSize = 5;
  pageIndex = 0;
  totalItem = 0;
  public selectedTable: number = 1;
    //itemlist
  public responeArray:any[] = [];
  public products:ItemModel[] = [];
  public selectedCategory: String | null = null;
  //category
  public categoryArray:any;
  public isDropdownOpen = false;
  searchItem!:FormGroup;
  searchRequestModel:SearchRequestModel = new SearchRequestModel();
  //submit form control
  isFormSubmitted!:Boolean;
  tempArray:any[] = [];
  //time
  private subscription!: Subscription;
  timeMessage!:String;
  beginDate!: Date;
  endDate!: Date;

  constructor(private userservice:UserService,
    private formBuilder: FormBuilder) {}
  ngOnInit(): void {
    this.getItemlist();
    this.getcategorylist();
    this.initializeForm();

  }
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  getItemlist() {
    this.userservice.getListItem(this.pageIndex + 1, this.pageSize = 6 ).subscribe({
      next: (res) => {
          this.totalItem = res.itemCount;
          this.responeArray = res.listitem;
          this.products = this.responeArray.map(item => ({
             id:item.id,
             Description:item.description,
             Name:item.name,
             Email:item.email,
             pathImg:item.image,
             BeginPrice:item.beginPrice,
             WinningPrice:item.winningPrice,
             BeginDate:item.beginDate,
             EndDate:item.endDate,
             UpPrice:item.upPrice,
             sellerId:0,
             DocumentFile:null,
             ImageFile:null,
             pathDocument:"",
             categoryName:[]
          }));
          this.products.forEach(element => {
            this.beginDate = new Date(element.BeginDate)
            this.endDate = new Date( element.EndDate)
          });
          this.startCounter();
          console.log(this.beginDate);
          console.log(this.endDate);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }


  onPageChange(event:any,selectedTable:number){
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
      this.getItemlist();
      return;
  }
  //category
  async getcategorylist(){
    this.userservice.getListCategory().subscribe({
      next:(res:any)=>{
       this.categoryArray = res;
       console.log(this.categoryArray );

      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

  selectCategory(categoryName: string) {
    console.log( categoryName);
    if (this.searchRequestModel.categoryName === categoryName) {
      // If the same category is clicked again, uncheck it
      this.searchRequestModel.categoryName = "";
      console.log( this.searchRequestModel.categoryName);
    } else {
      this.searchRequestModel.categoryName = categoryName;
    }

    return categoryName;
  }

  async initializeForm(){
    this.searchItem = this.formBuilder.group({
      ItemName:[this.searchRequestModel.itemName],
      CategoryName:[this.searchRequestModel.categoryName]
    })
  }

  submitForm() {
    this.isFormSubmitted = true;
    const formData = new FormData();
    //Appen form
    formData.append('itemName',this.searchItem.get('ItemName')?.value ||"");
    formData.append('categoryName',this.searchRequestModel.categoryName.toString());
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
    console.log(formData);
    // formData.append('model', JSON.stringify(this.searchRequestModel));
    return this.userservice.searchItem(formData).subscribe({
      next:(res) => {
        this.products = res.map((item:any) => ({
          id: item.id,
          Description: item.description,
          Name: item.name,
          Email: item.email,
          pathImg: item.image,
          BeginPrice: item.BeginPrice,
          WinningPrice: item.WinningPrice,
          BeginDate: item.BeginDate,
          EndDate: item.EndDate,
          UpPrice: item.UpPrice,
          sellerId: 0,
          DocumentFile: null,
          ImageFile: null,
          pathDocument: "",
        }));

    },
      error:(err) => {
        console.log(err);
      }
        });
    }
    resetForm() {
      // Reset the form controls
      this.searchItem.reset();
      this.isFormSubmitted = false;
  }

//time counter
startCounter(): void {
  this.subscription = interval(1000).subscribe(() => {
    const now = new Date();
    const timeDiff = this.endDate.getTime() - now.getTime();

    if (timeDiff <= 0) {
      this.timeMessage = 'Time is up!';
      this.subscription.unsubscribe();
    } else {
      this.timeMessage = this.formatTime(timeDiff);
    }
  });
}
  formatTime(timeDiff: number): String {
    const seconds = Math.floor((timeDiff / 1000) % 60);
    const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
    const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }


  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
