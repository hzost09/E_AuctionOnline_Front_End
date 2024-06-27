import { categoryModelUpdateOrCreate } from '../model/categoryModelUpdateOrCreate';
import { CategoryModel } from '../model/CategoryModel';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl:string = "https://localhost:7115/api/Admin/";
  constructor(private http:HttpClient) { }

  getListUser(page: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get(`${this.baseUrl}getlistUserWithItemCount`, { params });
  }

  getListItem(page: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get(`${this.baseUrl}getlistItem`, { params });
  }

  getItemWithListCategoryUseID(id:number){
    return this.http.get(`${this.baseUrl}ItemWithCategoryList/${id}`);
  }

  AddOrDeleteCategory(CategoryId:number,ItemId:number){
    const body = {
      CategoryId: CategoryId,
      ItemId: ItemId
    };

    return this.http.post(`${this.baseUrl}AddDeleteCategoryItem/${CategoryId}/${ItemId}`, {});
  }

  getListCategory(){
    return this.http.get(`${this.baseUrl}listcategory`);
  }

  createCategory(cate:categoryModelUpdateOrCreate){
    return this.http.post(`${this.baseUrl}CreateCategory`,cate);
  }
  updateCategory(cate:categoryModelUpdateOrCreate){
    return this.http.post(`${this.baseUrl}UpdateCategory`,cate);
  }

  getOneCategory(categoryid:number){
    return this.http.get(`${this.baseUrl}categorywithlistitem/${categoryid}`);
  }
}
