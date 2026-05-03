import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { ConfigService } from '../../core/services/common-settings/config.service';
import { PaymentOptionsModel } from "../../models/advanced/payment/payment-options.model";
import { AppConfig } from '../../app.config';

@Injectable()
export class MeshulamService {

  private createPaymentProcessUrl = "https://sandbox.meshulam.co.il/api/light/server/1.0/createPaymentProcess";
  private pageCode_cc = "8281c4fdd36d";
  private pageCode_bit = "e40b044abfb0";
  private pageCode_apple = "61c7c33e4bc9";
  private pageCode_google = "296a44f06b5a";
  private apiKey = "4310ec470057";
  private userId = "0d7c3b9f18fbd0a5";
  private successUrl = "";// "https://order.bitetech.co.il/#/253/payment";
  private cancelUrl =  "";//"https://order.bitetech.co.il/#/253/order";

  constructor(private http: HttpClient,
              private configService: ConfigService) {}

  
   public createMeshulamPaymentProcess(order,userLoginToken): Observable<any> {
    var description = "Order from " + AppConfig.settings.name;
   // var successUrl = "https://order.bitetech.co.il/#/" + AppConfig.franchiseId + "/home";
    var successUrl = this.configService.serverUrl + "thankyou.html";
    var cancelUrl = "https://order.bitetech.co.il/" + window.location.hash;
    return this.http.post<any>(this.configService.serverUrl +
      'Meshulam/CreatePaymentProcess',
      {
        order: order,
        userLoginToken: userLoginToken,
        description : description,
        successUrl: successUrl,
        cancelUrl:cancelUrl 
      });
  }            
  public createMeshulamPaymentProcess_(branchId, sum, fullName, phone): Observable<any> {
    var description = "Order from " + AppConfig.settings.name;
   // var successUrl = "https://order.bitetech.co.il/#/" + AppConfig.franchiseId + "/home";
    var successUrl = this.configService.serverUrl + "thankyou.html";
    var cancelUrl = "https://order.bitetech.co.il/" + window.location.hash;
    return this.http.post<any>(this.configService.serverUrl +
      'Meshulam/CreatePaymentProcess',
      {
        branchId: branchId,
        sum: sum,
        fullName: fullName,
        phone : phone,
        description : description,
        successUrl: successUrl,
        cancelUrl:cancelUrl 
      });
  }

  public CreateBitPaymentProcess(branchId, sum, fullName, phone): Observable<any> {
    var description = "Order from " + AppConfig.settings.name;
   // var successUrl = "https://order.bitetech.co.il/#/" + AppConfig.franchiseId + "/home";
    var successUrl = this.configService.serverUrl + "thankyou.html";
    var cancelUrl = "https://order.bitetech.co.il/" + window.location.hash;
    return this.http.post<any>(this.configService.serverUrl +
      'Meshulam/CreateBitPaymentProcess',
      {
        branchId: branchId,
        sum: sum,
        fullName: fullName,
        phone : phone,
        description : description,
        successUrl: successUrl,
        cancelUrl:cancelUrl 
      });
  }

  public CheckTransactionStatus(processId, processToken): Observable<any> {   
    return this.http.get<any>(this.configService.serverUrl +
      'Meshulam/CheckTransactionStatus?processId=' 
       + processId + "&processToken=" + processToken);
  }            
 
  public paymentRequestMeshulam(serverOrder, processId, processToken, loginToken): Observable<any> {   
    return this.http.post<any>(this.configService.serverUrl +
      'Meshulam/PaymentRequestMeshulam',
      {
        order: serverOrder,
        processId : processId,
        processToken : processToken,
        userLoginToken: loginToken,
        country: this.configService.country
      });
  }

  public paymentRequestMeshulamSDK(serverOrder, 
                                  // fullName, 
                                   paymentMethod, 
                                   confirmationNumber, 
                                   numberOfPayments, 
                                   loginToken): Observable<any> {   
    return this.http.post<any>(this.configService.serverUrl +
      'Meshulam/PaymentRequestMeshulamSDK',
      {
        order: serverOrder,
     //   fullName : fullName,
        paymentMethod : paymentMethod,
        confirmationNumber : confirmationNumber,
        numberOfPayments : numberOfPayments,
        userLoginToken: loginToken,
        country: this.configService.country
      });
  }

 
 
  

}
