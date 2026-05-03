import ComboAppModel from "../../combo/combo.model";
import { ItemAppAdvancedModel } from "../menu/item-app-advanced.model";
import {PizzaAppAdvancedModel} from "../pizza/pizza-app-advanced.model";

export default class ComboAppAdvancedModel extends ComboAppModel {

  public Amount: number;
  public SelectedItems: ItemAppAdvancedModel[];
  public SelectedPizzas: PizzaAppAdvancedModel[];
  public ShortInfo: string;
  public Information: string;
  IsComboFull: boolean;
  ItemGroups: any[];
  IsNotComboIsItem: boolean;


}
