import { PizzaAppModel } from '../../pizza/pizza-app.model';
import { ToppingAppModel } from "../../menu/topping-app.model";
import {ToppingAppAdvancedModel} from "./topping-app-advanced.model";
import {PizzaPriceAppModel} from "../../pizza/pizza-price-app.model";
import { GarnishAppAdvancedModel } from '../menu/garnish-app-advanced.model';
import { GarnishGroupAppModel } from '../../menu/garnish-group-app.model';

export class PizzaAppAdvancedModel extends PizzaAppModel {

  public Amount: number = 1;
  public SelectedToppings: ToppingAppAdvancedModel[];
  public SelectedPizzaPriceSize: PizzaPriceAppModel;
  public IsFailedLoadedImg: boolean;
  public ShortInfo: string;
  //public GeneralGarnishGroup: GarnishGroupAppModel[];
  //public MaxFreeToppings: number;
  //public ToppingGroupId: number;
  public SelectedGarnishes: GarnishAppAdvancedModel[];
  public IsSelected: boolean;
  public PriceInCombo: number;
  FullPizza: any;
  public GeneralGarnishGroups: GarnishGroupAppModel[];
  public GarnishGroupsBeforePizza: GarnishGroupAppModel[];
  public GarnishGroupsAfterPizza: GarnishGroupAppModel[]; 
  ComboPizza: any;
}
