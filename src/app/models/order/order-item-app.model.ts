import { GarnishAppModel } from "../menu/garnish-app.model";
import { ItemAppAdvancedModel } from '../../models/advanced/menu/item-app-advanced.model';
import { PizzaAppAdvancedModel } from "../advanced/pizza/pizza-app-advanced.model";
import { OrderPizzaToppingAppModel } from "./order-pizza-topping-app.model";

export class OrderItemAppModel {

  public ItemId: number;
  public ParentItemId: number;
  public Garnishes: GarnishAppModel[];
  public Amount: number;
  public Comment: string;
  public CatalogNumber: string;
  public outOfStock: boolean = false;
  public SpecialRequests: string;
  public ComboItemId: number;
  public IsScratchCoupon: boolean;
  public ScratchCouponId: number;
  public Items: any[];
  public Price: number; // It was added manually, not exist on the server
  public ImageUrl: string; // It was added manually, not exist on the server
  public Name: string; // It was added manually, not exist on the server
  public Email: string; // It was added manually, not exist on the server
  public IsBonus: boolean; // It was added manually, not exist on the server

  public GarnishesListDisplay: string[];
  public GarnishesStringDisplay: string;

  public Item: ItemAppAdvancedModel;
  public ItemName : string;
  public MealUpgrade: boolean;
  public IsUpgrade: boolean;
  public IsCombo: boolean;
  public CategoryId: number;
  public IsClubMemberItem: boolean;
  public IsItemNewCombo: boolean;
  public IsAnnBenefitItem: boolean;
  public IsBDayBenefitItem: boolean;
  public IsJoinBenefitItem: boolean;
  public ItemComboItemId: number;
  public GroupItemId: number;
  public IsItemsGroupItemKeptPrice: boolean;

 

 
}
