import { BidRequestModel } from './../model/BidRequestModel';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, forkJoin } from 'rxjs';
import { ItemModel } from '../model/ItemModel';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl:string = "https://localhost:7115/api/User/";
constructor(private http:HttpClient) { }
//listItem
getListItem(page: number, pageSize: number):Observable<any> {
  const params = new HttpParams()
    .set('page', page.toString())
    .set('pageSize', pageSize.toString());
  let headers = new HttpHeaders();
  headers = headers.append('No-Auth','True');
    return this.http.get(`${this.baseUrl}getlistItem`,{params,headers});
}
//user profile
getProfile(email:String){
  return this.http.get(`${this.baseUrl}getProfile/${email}`);
}
//list item with user id
getListItembyUser(id:Number){
  return this.http.get(`${this.baseUrl}GetListItemOfUser/${id}`);
}
//sell item
createItem(item: any) {
  console.log(item);
  // Create headers with the desired Content-Type
    // Generate a boundary string
    const boundary = '---------------------------' + Date.now().toString(16);
    // Create headers with the desired Content-Type including the boundary
    const headers = new HttpHeaders({
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Accept': '*/*'
    });
  // Make the HTTP request with the specified headers
  // return this.http.post<any>(`${this.baseUrl}SellItem`, item, { headers });
  return this.http.post(`${this.baseUrl}SellItem`, item);
}
// list category
getListCategory(){
  return this.http.get(`${this.baseUrl}getlistcategory`);
}

//get one item
getOneItem(id:Number){
  return this.http.get(`${this.baseUrl}GetOneItem/${id}`)
}
//get bid with itemid
getBidbyItemId(id:number){
  return this.http.get(`${this.baseUrl}BidWithItemId/${id}`)
}
//place bid
 placeBid(bidRequest:BidRequestModel){
    return this.http.post(`${this.baseUrl}Placebid`,bidRequest);
 }

searchItem(item: any): Observable<any> {
  // Gửi dữ liệu dưới dạng JSON
  // const headers = new HttpHeaders({
  //   'Content-Type': 'application/json',
  //   'Accept': '*/*'
  // });
  return this.http.post(`${this.baseUrl}SearchCombine`, item,);
}

downloadLink(fileName:String){
  //Blob (Binary Large Object) used to store large amounts of binary data, such as files or image data
  return this.http.get(`${this.baseUrl}DownloadFile/${fileName}`,{ responseType: 'blob' })
}

}

