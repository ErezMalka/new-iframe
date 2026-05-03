import { CashRegisterTypeEnum } from "../../enums/cash-register-type.enum";

export class ParamsForCashRegisterModel {

  constructor() { }
/*  constructor(isUseCashRegister: boolean,
    cashRegisterTypeId: number, custumParams: string) {
    this.IsUseCashRegister = isUseCashRegister;
    if (!this.IsUseCashRegister || !cashRegisterTypeId) return;

    this.CashRegisterType = (CashRegisterTypeEnum)(cashRegisterTypeId);
    this.CustomParams = custumParams;
  }*/
  public CashRegisterType: CashRegisterTypeEnum;
  public CustomParams: string;
  public IsUseCashRegister: boolean;

}
