export class TranzilaChargeResponseModel {
  
  public Code: string;
  public ConfirmationCode: string;
  public Success = () => {
    return this.Code == '000';
  }
  public toString() {
    return 'Code: ' + this.Code + '. ' + 'ConfirmationCode' + this.ConfirmationCode;
  }
  
}
