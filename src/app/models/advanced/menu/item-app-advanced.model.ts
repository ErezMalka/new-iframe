import { GarnishGroupAppModel } from "../../menu/garnish-group-app.model";
import { ItemAppModel } from "../../menu/item-app.model";
import { PizzaPriceAppModel } from "../../pizza/pizza-price-app.model";
import { GarnishAppAdvancedModel } from "./garnish-app-advanced.model";

export class ItemAppAdvancedModel extends ItemAppModel {

  public Amount: number = 1;
  public SelectedGarnishes: GarnishAppAdvancedModel[];
  public GeneralGarnishGroups: GarnishGroupAppModel[];
  public PizzaPrices: PizzaPriceAppModel[];
  public GarnishGroupsBeforePizza: GarnishGroupAppModel[];
  public GarnishGroupsAfterPizza: GarnishGroupAppModel[]; 
  public SelectedToppings: any[];
  public SelectedPizzaPriceSize: PizzaPriceAppModel;

  IsUpgrade: boolean;
  IsCombo: boolean;
  IsAnnBenefitItem: any;
  IsJoinBenefitItem: any;
  IsBDayBenefitItem: any;
  ItemGroups: ItemAppAdvancedModel[];
  GroupItems: ItemAppAdvancedModel[];
  HasItemGroups: boolean;
  IsClubMemberItem:boolean;


}
