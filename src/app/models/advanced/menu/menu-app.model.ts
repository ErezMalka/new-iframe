import { MenuItemAppModel } from "./menu-item-app.model";
import {PizzaAppAdvancedModel} from "../pizza/pizza-app-advanced.model";
import {ToppingAppAdvancedModel} from "./topping-app-advanced.model";

export class MenuAppModel {

  public categories: MenuItemAppModel[];
  public pizzas: PizzaAppAdvancedModel[];
  public pizzaToppings: ToppingAppAdvancedModel[];

  public startingPage: string;

}
