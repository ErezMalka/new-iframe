import { PizzaPriceAppModel } from "./pizza-price-app.model";
import { ToppingAppModel } from "../menu/topping-app.model";

export class PizzaAppModel {

  public Id: number;
  public Name: string;
  public Description: string;
  public PizzaPrices: PizzaPriceAppModel[];
  public PizzaToppings: ToppingAppModel[];
  public DefaultPrice: PizzaPriceAppModel;
  public ImageUrl: string;
  public Information: string;
  public MaxFreeToppings: number;
  public ToppingGroupId: number;

}
