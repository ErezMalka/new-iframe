import { DeliveryGroupAppModel } from "../order/delivery-group-app.model";

export class BranchAppModel {

  public Id: number;
  public FranchiseId: number;
  public Name: string;
  public BranchPhone: string;
  public Address: string;
  public GooglePlaceAddress: string;
  public Longitude: number;
  public Latitude: number;
  public OpeningTime: string;
  public ClosingTime: string;
  public OpeningDay: string;
  public IsOpen: boolean;
  public IsOpenForDelivery: boolean;
  public IsOpenForTA: boolean;
  public IsOpenForSit: boolean;
  public DeliveryTimeInMinutes: number;
  public TakeawayTimeInMinutes: number;
  public DeliveryGroups: DeliveryGroupAppModel[];
  public WorkingHoursStr: string;
  public WorkingHours: any;
  public IsClosedToday: boolean;
  public IsClosedTodayComment: string;
  public IsDelivery: boolean;
  public IsTakeAway: boolean;
  public IsSit: boolean;
  public IsDigitalMenu:boolean;
  public UsaTaxProc: number;
public UseInventory:boolean;
  public DeliveryBranchGroup: DeliveryGroupAppModel; // extra field not exist on server
  Messages: any;
  public Coupons: any[];
  public EventTrackingParams: any;
  MinSumForVouchers: number;
}
