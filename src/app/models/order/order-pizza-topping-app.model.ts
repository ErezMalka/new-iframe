export class OrderPizzaToppingAppModel {

  public Id: number;
  public ToppingId: number;
  public OrderPizzaId: number;
  public Quarter1: boolean;
  public Quarter2: boolean;
  public Quarter3: boolean;
  public Quarter4: boolean;

  public Price: number; // was added manually, not exist on server
  public FullTopping: any; //was added manually, not exist on server
}
