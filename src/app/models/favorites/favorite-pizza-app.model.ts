import { PizzaAppModel } from "../pizza/pizza-app.model";
import { PizzaSizeAppModel } from "../pizza/pizza-size-app.model";
import {OrderPizzaToppingAppModel} from "../order/order-pizza-topping-app.model";

export class FavoritePizzaAppModel {

  public Id: number;
  public Pizza: PizzaAppModel;
  public PizzaSize: PizzaSizeAppModel;
  public Price: number;
  public Toppings: OrderPizzaToppingAppModel[];

}
