import { ToppingAppModel } from '../../menu/topping-app.model';

export class ToppingAppAdvancedModel extends ToppingAppModel {
  
  public TotalPrice: number;
  public QuarterNums: any[];
  public ToppingId: number;
  public ForthQuarter: boolean;
  public ThirdQuarter: boolean;
  public SecondQuarter: boolean;
  public FirstQuarter: boolean;
  public CurrentCalcPrice: number;
  public IsSelect: boolean;
  public Description: string;
  public ToppingGroupId:number;
}
