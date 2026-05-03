import { ItemAppAdvancedModel } from "./item-app-advanced.model";
import { CategoryAppModel } from "../../menu/category-app.model";
import { PizzaAppAdvancedModel } from '../pizza/pizza-app-advanced.model';

export class CategoryAppAdvancedModel extends CategoryAppModel{

  public Items: ItemAppAdvancedModel[];
  public Pizzas: PizzaAppAdvancedModel[];


}
