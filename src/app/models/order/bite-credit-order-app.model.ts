import { OrderItemAppModel}  from "./order-item-app.model";
import {  OrderPizzaAppModel } from "./order-pizza-app.model";
import { OrderComboAppModel } from "./order-combo-app.model";
import { PinPadOrderDetailsAppModel } from "./pin-pad-order-details-app.model";
import { BranchFutureDatesAppModel } from '../franchise-branch/branch-future-dates-app.model';
import { DeliveryGroupAppModel } from "./delivery-group-app.model";

export class BiteCreditOrderAppModel {

  //
   
  public BranchId: number;
 // public Address: string;
 // public Premise:string;
 // public deliveryGroup: DeliveryGroupAppModel;
 // public OrderItems: OrderItemAppModel[];
  //public OrderPizzas: OrderPizzaAppModel[];
 // public OrderCombos: OrderComboAppModel[];
  public CibusReciptData: string;
  public TenbisReciptData: string;
  public CreditReciptData:string;
  //public ReciptData:string;
  public DateTime: Date;
 // public FutureDateTime: Date;
 // public FutureDateModel: BranchFutureDatesAppModel;
  //public FutureTime: string;
  //public FutureDate: string;
 // public  PayedByCash: number=0;
  public  PayedByCredit: number=0;
  public  PayedByCibus: number=0;
  public  PayedByTenbis: number=0;
  public Sum: number;
  public TotalCredit: number;
  public Payment: string;
 // public IsDiscount: boolean;

  //user details
  public FirstName:string;
  public LastName:string;
  public Phone: string;
  public Email: string; 
  //public ExtraPhone: string;
 
 // public Comments: string;
 /// public InvoiceUrl: string;
  public PinPadOrderDetails: PinPadOrderDetailsAppModel;
  public Code: string;
   //public SumWithTax: string; // Attention!!!! it was added manually; doesn't exist on server side

 
  public SaveCredit:boolean =false;
  public SavedCreditTokenId: number;
  //public GooglePlaceAddress: any;
  public CCTokens: any[] = [];
  public IsCuponCode:boolean = false;
 // public CuponDiscountSum:number =0;
 // public TipForDelivery: any;
  public cibusTokens: any;
  public tenBisTokens: any;
 // public FutureDeliveryTime: string;
 // public DeliveryComments: string = "";
 // public CouponId: number;
 // public CouponCode: string;
}
