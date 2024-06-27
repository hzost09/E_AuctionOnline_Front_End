import { ItemModel } from "./ItemModel";

export class SellItemRequest{
  ItemModel!:ItemModel;
  CategoryModel:number[] = [];
}
