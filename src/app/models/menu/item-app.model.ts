import { GarnishAppModel } from "./garnish-app.model";
import { GarnishGroupAppModel } from "./garnish-group-app.model";

export class ItemAppModel {

  public Id: number;
  public Name: string;
  public CategoryId: number;
  public CatalogNumber:string;
  public Price: number;
  public Quantity: number;
  public Order: number;
  public ImageUrl: string;
  public Garnishes: GarnishAppModel[];
  public GarnishGroups: GarnishGroupAppModel[];
  public Information: string;
  public IsShowInKioskEndOrder: boolean;
  public IsTakeAway: boolean;
  public IsDigitalMenu : boolean;
  public IsTvMenu:boolean;
  public IsSit: boolean;
  public IsDelivery: boolean;
  public MealUpgrade:boolean;
  public IsSelected: boolean;
  public ShortInfo: string;
  public IsBonus: string;
  public ComboItemId: number;
  public IsItemNewCombo: boolean;
  public SpecialRequests: string;

}
