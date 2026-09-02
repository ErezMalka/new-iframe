import { BranchAppModel } from "./branch-app.model";

export class FranchiseAppModel {

  public Name: string;
  public FacebookLink: string;
  public InstagramLink: string;
  public Description: string;
  public PrintMsg: string;
  public ManagerPhone: string;
  public Branches: BranchAppModel[];
  public TranzilaTokenTerminal: string;
  public TranzilaUrl: string;
  public IsShowInHalfs: boolean;
  public AndroidName: string;
  public AppleName: string;
  public IsFutureOrderAvailable: boolean;
  public IsFutureDatesOrderAvailable : boolean;
  public SmsResponse: string;
  public ManagerEmail:string;
  public UseMembersClub: boolean;
  public PoinsPercentage: number;
    public IsRedirect: boolean;
  public RedirectURL: string;
  MinSumForVouchers: number;
  ScratchCuponActive: any;
  BonusActive: any;
  NewMemberVoucherActive: boolean;
  BirthdayVoucherActive: boolean;
  AnniversaryVoucherActive: boolean;
  public UseBiteCredit :boolean;
  public   CreditOptions:string;
  public   CreditName :string;
  public   AllowCustomCreditSum :boolean;
  public   CreditAddedValuePercent :number;

}
