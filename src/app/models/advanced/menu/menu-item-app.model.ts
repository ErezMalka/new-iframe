import {ItemAppModel} from "../../menu/item-app.model";

export class MenuItemAppModel {

  public Id: number;

  public ImageUrl: string;
 
  public ImageIFrameUrl: string;

  public Items: ItemAppModel[];

  public Name: string;

  public isDisplayedText?: boolean = false;

}
