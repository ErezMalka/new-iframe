import {PizzaAppModel} from "../pizza/pizza-app.model";
import {PizzaSizeAppModel} from "../pizza/pizza-size-app.model";

export class PizzaComboAppModel {
  public Id: number;
  public PizzaId: number;
  public Pizza: PizzaAppModel;
  public SizeId: number;
  public PizzaSize: PizzaSizeAppModel;
  public ComboId: number;
  public Quantity: number;
  public MaxToppings: number;
  public IsSelected : boolean; 
}
