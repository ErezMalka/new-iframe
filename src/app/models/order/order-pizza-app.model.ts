import { OrderPizzaToppingAppModel } from "./order-pizza-topping-app.model";

export class OrderPizzaAppModel {

  public PizzaId: number;
  public Toppings: OrderPizzaToppingAppModel[];
  public SizeId: number;
  public Amount: number;
  public Comment: string;
  public SpecialRequests: string;
  public ItemName: string;
  public ComboPizzaId: number;
  public PizzaComboPizzaId:number;

}
