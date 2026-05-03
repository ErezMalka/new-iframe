import { ItemAppModel } from "./item-app.model";

export class CategoryAppModel
{
  public Id: number;
  public Name: string;
  public ImageUrl: string;
  public ImageIFrameUrl: string;
  public Items: ItemAppModel[];
  public Description:string;

}
