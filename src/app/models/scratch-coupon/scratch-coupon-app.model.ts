import { ItemAppModel } from "../menu/item-app.model";

export class ScratchCouponAppModel {

  public Id: number;
  public ExpirationDate: Date;
  public MinOrderSum: number;
  public Description: string;
  public Item: ItemAppModel; // ItemApp was replaced
  public ImageUrl: string;

}
