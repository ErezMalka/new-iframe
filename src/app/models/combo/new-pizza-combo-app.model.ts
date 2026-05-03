 
import {PizzaComboAppModel} from "./pizza-combo-app.model";

export default class NewPizzaComboAppModel {
  public Id: number;
  public Name: string;
  public Pizzas: PizzaComboAppModel[];
  public ComboId: number;
  public Quantity: number;
  public MaxToppings: number;
  public IsCollapsed: boolean;
  public IsSelected : boolean;
  public ItemIsSelected: boolean;
  public ToppingGroupId:number
}
