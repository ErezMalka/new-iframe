import { GarnishAppModel } from "./garnish-app.model";

export class GarnishGroupAppModel {

  public Name: string;
  public Min: number;
  public Max: number;
  public FreeCount: number;
  public MaxAmount: number;
  public Garnishes: GarnishAppModel[];
  public Id: number;
  public ShowBeforePizza:boolean;
  public Description:string;

}
