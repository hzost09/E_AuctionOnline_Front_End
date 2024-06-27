import { Component } from '@angular/core';
import { UserService } from '../../service/User.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JwtService } from '../../service/jwt.service';
import { DatePipe } from '@angular/common';
import { ItemModel } from '../../model/ItemModel';
import { SellItemRequest } from '../../model/SellItemRequest';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css'
})
export class UserPageComponent {
  public selectedTable:Number = 1;
  public UserDetails!:any;
  public itemArray:any[] = [];
  public ItemModel:ItemModel = new ItemModel();
  public categoryArray:any;

  public sellItemRequest:SellItemRequest = new SellItemRequest();
//hiding sellerId
public ishiding = false;

//dropdown menu
dropdownOpen = false;
//validate for categoryArray
isAtLeastOneCheckboxChecked = false;
//submit check
isFormSubmitted = false;

public isDropdownOpen = false;
sellItemForm!:FormGroup;
constructor(private userservice:UserService,private jwtservice:JwtService,private formBuilder: FormBuilder,private datePipe:DatePipe) {
  this.sellItemRequest.ItemModel = new ItemModel()
  this.sellItemRequest.CategoryModel = new Array();
}

  ngOnInit(): void {
    this.getUserDetails();
     this.getcategorylist();
  }
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

//-------------------------begin form submit
 async initializeForm() {
    console.log(  this.sellItemRequest.ItemModel.Email);
    this.sellItemRequest.ItemModel.sellerId = this.UserDetails.id;
    this.sellItemRequest.ItemModel.Email = this.UserDetails.email;
    this.sellItemForm = this.formBuilder.group({
      ItemName: [this.sellItemRequest.ItemModel.Name, Validators.required],
      ItemDescription: [this.sellItemRequest.ItemModel.Description],
      BeginPrice: [this.sellItemRequest.ItemModel.BeginPrice, Validators.required],
      UpPrice: [this.sellItemRequest.ItemModel.UpPrice, Validators.required],
      WinningPrice: [this.sellItemRequest.ItemModel.WinningPrice, Validators.required],
      BeginDate: [this.sellItemRequest.ItemModel.BeginDate, Validators.required],
      EndDate: [this.sellItemRequest.ItemModel.EndDate, Validators.required],
      ItemImage: [this.sellItemRequest.ItemModel.ImageFile],
      DocumentFile: [this.sellItemRequest.ItemModel.DocumentFile],
      CategoryModel: this.formBuilder.array([]),
      Email: [this.sellItemRequest.ItemModel.Email],
      sellerId: [this.sellItemRequest.ItemModel.sellerId]
    });

  }

//support for formsubmit
//Formsubmit
  submitForm() {
    this.isFormSubmitted = true;
    if (!this.isAtLeastOneCheckboxChecked) {
      return;
    }
    this.isFormSubmitted = false;
    const formData = new FormData();
    // Append form
    formData.append('ItemModel.Name', this.sellItemForm.get('ItemName')?.value || '');
    formData.append('ItemModel.Description', this.sellItemForm.get('ItemDescription')?.value || '');
    formData.append('ItemModel.BeginPrice', this.sellItemForm.get('BeginPrice')?.value || '');
    formData.append('ItemModel.UpPrice', this.sellItemForm.get('UpPrice')?.value || '');
    formData.append('ItemModel.WinningPrice', this.sellItemForm.get('WinningPrice')?.value || '');
    formData.append('ItemModel.Email', this.sellItemForm.get('Email')?.value  || '');
    formData.append('ItemModel.sellerId', this.sellItemForm.get('sellerId')?.value  || '');

    const beginDateValue = this.sellItemForm.get('BeginDate')?.value;
    const beginDate = new Date(beginDateValue);
    beginDate.setSeconds(0);
    beginDate.setMilliseconds(0);
    const beginDateFormatted = this.datePipe.transform(beginDate, 'yyyy-MM-ddTHH:mm') || '';
    formData.append('ItemModel.BeginDate', beginDateFormatted.toString() || '');

    const endDateValue = this.sellItemForm.get('EndDate')?.value;
    const endDate = new Date(endDateValue);
    endDate.setSeconds(0);
    endDate.setMilliseconds(0);
    const endDateFormatted = this.datePipe.transform(endDate, 'yyyy-MM-ddTHH:mm') || '';

    formData.append('ItemModel.EndDate', endDateFormatted.toString() || '');


    // Append ImageFile and DocumentFile if they exist
    if (this.sellItemRequest.ItemModel.ImageFile) {
      formData.append('ItemModel.ImageFile', this.sellItemRequest.ItemModel.ImageFile, this.sellItemRequest.ItemModel.ImageFile.name);
    }

    if (this.sellItemRequest.ItemModel.DocumentFile) {
      formData.append('ItemModel.DocumentFile', this.sellItemRequest.ItemModel.DocumentFile, this.sellItemRequest.ItemModel.DocumentFile.name);
    }

    // Append CategoryModel as an array
    let categoryModel = this.sellItemForm.get('CategoryModel')?.value;
    categoryModel =   this.sellItemRequest.CategoryModel ;
    if (categoryModel && categoryModel.length > 0) {
      categoryModel.forEach((categoryId: number) => {
        formData.append('CategoryModel', categoryId.toString());
      });
    }
    this.userservice.createItem(formData).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
       alert(err);
      }
    });
  }

  // Function to handle image file selection
  onImageSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.sellItemRequest.ItemModel.ImageFile = file;
    }
  }

  // Function to handle document file selection
  onDocumentSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.sellItemRequest.ItemModel.DocumentFile = file;
    }
  }

  onCategorySelected(categoryId: number, event: any) {
    this.isAtLeastOneCheckboxChecked = this.sellItemRequest.CategoryModel.length > 0;
    if (event.target.checked) {
      // If checkbox is checked, add category to categoryModel
      this.sellItemRequest.CategoryModel.push(categoryId);
      this.isAtLeastOneCheckboxChecked = true;

    } else {
      // If checkbox is unchecked, remove category from categoryModel
      const index = this.sellItemRequest.CategoryModel.indexOf(categoryId);
      if (index !== -1) {
        this.sellItemRequest.CategoryModel.splice(index, 1);
      }
    }
  }

//-------------end of form submit

//api
 async getUserDetails(){
  const email = this.jwtservice.getEmail();
    await this.userservice.getProfile(email).subscribe({
      next:(res) =>{
        this.UserDetails = res;
        console.log(this.UserDetails.id);
        this.initializeForm();
      },
      error:(err) =>{
        console.log(err);
      }
    })
  }

  getlistItembyUser(){
    this.changenumbertable(2);
    const id = this.UserDetails.id;
    this.userservice.getListItembyUser(id).subscribe({
      next:(res:any)=>{
      this.itemArray =  res.listItem;
        console.log(this.itemArray);
      },
      error:(err) =>{
        console.log(err);
      }
    })
  }

//handleOrCustom validate
  handleChange(option: any) {
    if (option.checked) {
      this.sellItemRequest.CategoryModel.push(option.id);
      console.log(option.name + ' is checked');
    } else {
      this.sellItemRequest.CategoryModel = this.sellItemRequest.CategoryModel.filter(item => item !== option.id);
      console.log(option.name + ' is unchecked');
    }
  }

//Support form design
// Function to toggle dropdown visibility
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  changenumbertable(tableNumber:number){
    this.selectedTable = tableNumber;
  }
//

}
