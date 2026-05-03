export class GarnishAppModel {

  public Id: number;
  public GarnishGroupId: number;
  public GarnishGroupName: string;
  public Name: string;
  public Price: number;
  public Order: number;
  public ImageUrl: string;
  public MaxAmount: number;
  public IsSelected: boolean;
  public SelectedAmount: number = 0;
  public IsFailedLoadImg: boolean;
  public Description:string;
}
