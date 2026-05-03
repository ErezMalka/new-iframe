import { GarnishAppModel } from "../../menu/garnish-app.model";
import { OrderPizzaAppModel } from "../../order/order-pizza-app.model";
import { GarnishAppAdvancedModel } from "../menu/garnish-app-advanced.model";
import {PizzaAppAdvancedModel} from "../pizza/pizza-app-advanced.model";

export class OrderPizzaAppAdvancedModel extends OrderPizzaAppModel {

  public FullPizza: PizzaAppAdvancedModel;
  public IsScratchCoupon: boolean;
  public ScratchCouponId: number;

  public Price: number; // It was added manually, not exist on the server
  public Name: string; // It was added manually, not exist on the server
  public ImageUrl: string; // It was added manually, not exist on the server
  public ItemName : string;
  public SpecialRequests : string;

  public SelectedGarnishes: GarnishAppAdvancedModel[];
  public Garnishes: GarnishAppModel[];
}
