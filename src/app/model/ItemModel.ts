export class ItemModel{
  public id!:number;
  public Name:string = "default";
  public Description!:string;
  public BeginPrice:number = 10;
  public UpPrice:number = 6;
  public WinningPrice:number = 20;
  public Email!:string;
  public pathImg?:string;
  public pathDocument!:string;
  public sellerId:number = 0;
  public ImageFile: File | null = null;
  public DocumentFile: File | null = null;
  public BeginDate!:any;
  public EndDate!:any;
  public categoryName:string[] = [];
}
