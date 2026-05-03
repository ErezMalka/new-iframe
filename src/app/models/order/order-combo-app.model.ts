import { OrderItemAppModel } from "./order-item-app.model";
import { OrderPizzaAppModel } from "./order-pizza-app.model";
import {OrderPizzaAppAdvancedModel} from "../advanced/order/order-pizza-app-advanced.model";

export class OrderComboAppModel {

  public ComboId: number;
  public Name: string;
  public Amount: number;
  public Items: OrderItemAppModel[];
  public Pizzas: OrderPizzaAppAdvancedModel[];

  public Price: number; // It was added manually, not exist on the server
  public ImageUrl: string; // It was added manually, not exist on the server

  public IsScratchCoupon: boolean; // It was added manually, not exist on the server
  public ScratchCouponId: number; // It was added manually, not exist on the server
  public ItemName : string;
  public SpecialRequests : string;
}
