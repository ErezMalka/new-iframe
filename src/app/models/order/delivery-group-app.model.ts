import { CityModel } from "./city.model";

export class DeliveryGroupAppModel {

  public Id: number;
  public Name: string;
  public MinSumForDelivery: number;
  public DeliveryFee: number;
  public MinSumForFreeDelivery: number;
  public Cities: CityModel[];

}
