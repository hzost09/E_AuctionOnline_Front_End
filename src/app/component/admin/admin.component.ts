import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { UserModel } from '../../model/UserModel';
import { CategoryModel } from '../../model/CategoryModel';
import { categoryModelUpdateOrCreate } from '../../model/categoryModelUpdateOrCreate';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../service/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  public showtable:boolean = false
  public responArray:any[] = [];
  public selectedTable: number = 1;
  public showForm:boolean = false;
  //userlist
  public usersArray:UserModel[] = [];
  user:UserModel = new UserModel();
  //itemlist
  public itemArray:any[] = [];
  //categorylist
  public categoryArray:CategoryModel[]=[];
  //categoriesWithListItem
  public Categorieslist: CategoryModel[] = [];
  public Categorieslistmodel!: CategoryModel;
  //page
  pageSize = 5;
  pageIndex = 0;
  totalUser = 0;
  totalItem = 0;
  //model for create or update
  @Input() public category:categoryModelUpdateOrCreate = {
    name: '', description: '',
    id: 0,
  };
  //block next request
  public blocknextrequest:boolean = true;
  // public category!:CategoryModel;
  public categoryForm!:FormGroup;

  constructor(private adminservice:AdminService,private formbuilder:FormBuilder,private changeDetect:ChangeDetectorRef) {


  }
  ngOnInit(): void {
    this.getUserList();
    this.validateForcategory();
  }
  onPageChange(event: any,selectedTable:number) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    if(selectedTable == 1){
      this.getUserList();
      return;
    }
    if(selectedTable == 2){
      this.getItemlist();
      return;
    }
  }
  changenumbertable(tableNumber:number){
    this.selectedTable = tableNumber;
    if(tableNumber == 1){
      this.getUserList();
      return;
    }
    if(tableNumber == 2){
      this.getItemlist();
      return;
    }
    if(tableNumber == 3){
      this.getcategorylist();
      return;
    }
  }
  getUserList(){
    this.adminservice.getListUser(this.pageIndex+1,this.pageSize).subscribe({
      next: (res) => {
        this.totalUser= res.totalUserCount;
        this.responArray = res.listuser;
        this.usersArray = this.responArray.map(item => ({
          Id:item.id,
          ItemSold: item.itemCount,
          Email: item.user.email,
          Name: item.user.name,
          EmailConfrim: item.user.emailConfirm,
          Role: item.user.role
        }));
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }
  getItemlist() {
    this.adminservice.getListItem(this.pageIndex + 1, this.pageSize).subscribe({
      next: (res) => {
        this.totalItem = res.itemCount;
        this.itemArray = res.listitem;
        console.log( this.itemArray);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  getItemWithCategorylistbyId(id:number){
      this.adminservice.getItemWithListCategoryUseID(id).subscribe({
        next:(res:any) => {
          this.showtable = true;
          this.responArray = res.categories
          this.responArray.forEach(item => {
            this.Categorieslistmodel = new CategoryModel();
            this.Categorieslistmodel.belong = item.belong;
            this.Categorieslistmodel.name = item.categories.name;
            this.Categorieslistmodel.description = item.categories.description;
            this.Categorieslistmodel.id = item.categories.id;
            this.Categorieslistmodel.itemId = res.item.id;
            console.log(item);
            this.Categorieslist.push(this.Categorieslistmodel);
          })
          this.changeDetect.detectChanges();
        },
        error:(err) => {
          console.log(err);
        }
      })
  }
  closeTable(){
    this.Categorieslist = [];
    this.Categorieslistmodel!= null;
    this.showtable = false;
  }
  addORdeleteCastegory(cateid:number,itemid:number){
    this.adminservice.AddOrDeleteCategory(cateid,itemid).subscribe({
      next:(res) => {
        alert("Action Complete");
        this.Categorieslist = [];
        this.getItemWithCategorylistbyId(itemid);
        this.changeDetect.detectChanges();
      },
      error:(err) => {
        console.log(err);
      }
    });
  }
  getcategorylist(){
    this.adminservice.getListCategory().subscribe({
      next:(res:any) =>{
        console.log(res);
          this.categoryArray = res
      },
      error:(err:any) => {
        console.log(err);
      }
    })
  }

  //validate for category
  validateForcategory(){
    this.categoryForm = this.formbuilder.group({
      id:[this.category.id],
      name:[this.category.name,[Validators.required]],
      description:[this.category.description,[Validators.required]]
    });
  }
  OnOffForm(){
    this.showForm = !this.showForm;
  }
  showFormCategory(cateid:number){
    this.showForm = !this.showForm;
    this.adminservice.getOneCategory(cateid).subscribe({
      next:(res:any) => {
        this.category = res.category;
        console.log(this.category);
        this.categoryForm = this.formbuilder.group({
          id:[this.category.id],
          name:[this.category.name],
          description:[this.category.description]
        });
      },
      error:(err) => {
        console.log(err);
      }
    })
  }
  createOrupdate(){
    this.blocknextrequest = false;
    if(this.categoryForm.valid){
      this.category = this.categoryForm.value;
      console.log(this.category.id);
      if(this.category.id == 0){
        this.adminservice.createCategory(this.category).subscribe({
          next:(res:any) => {
            alert(res.message);
            this.showForm = false;
          },
          error:(err:any) => {
            this.showForm = false;
            alert(err.message)
          }
        })
      }
      else{
        this.adminservice.updateCategory(this.category).subscribe({
          next:(res:any) => {
            this.showForm = false;
            alert(res.message);
          },
          error:(err:any) =>{
            this.showForm = false;
            alert(err.message);
          }
        })
      }
      this.blocknextrequest = true;
    }
    else{
      this.blocknextrequest = true;
      alert('Invalid Form');
    }
  }
}
