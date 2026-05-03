import { ToppingPriceAppModel } from "./topping-price-app.model";

export class ToppingAppModel {

  public Id: number;
  public Name: string;
  public ToppingPrices: ToppingPriceAppModel[];
  public ImageUrl: string;
  public QuarterPizzaImageUrl: string;
  public CurrentPrice: number;
  public IsFailedLoadedImg: boolean;
  public ToppingGroupId: number;
  public IsSelect: boolean;
  public ExcludedFromPizza: boolean;
  public IncludedInPizza: boolean;
  SecondQuarter: boolean;
  ThirdQuarter: boolean;
  ForthQuarter: boolean;
  FirstQuarter: boolean;


}
