import { DiscountTypeEnum } from '../../enums/discount-type.enum';

export class DiscountModel {

  public active: boolean;
  public name: String;
  public type: DiscountTypeEnum;
  public minSum: number;
  public sum: number;
  public alwaysActive: boolean

}
