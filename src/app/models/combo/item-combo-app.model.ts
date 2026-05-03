import {ItemAppModel} from "../menu/item-app.model";

export default class ItemComboAppModel {
  public Id: number;
  public Name: string;
  public Items: ItemAppModel[];
  public ComboId: number;
  public Quantity: number;
  public MaxGarnishes: number;
  public IsCollapsed: boolean;
  public IsSelected : boolean;
  public ItemIsSelected: boolean;
}
