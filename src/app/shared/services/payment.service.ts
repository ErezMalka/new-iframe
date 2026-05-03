import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { ConfigService } from '../../core/services/common-settings/config.service';
import { PaymentOptionsModel } from "../../models/advanced/payment/payment-options.model";

@Injectable()
export class PaymentService {

  constructor(private http: HttpClient,
              private configService: ConfigService) {}

  public getPaymentOptions(): Observable<PaymentOptionsModel> {
    return this.http.get<PaymentOptionsModel>(this.configService.serverUrl +
      'Iframe/GetPaymentOptions?franchiseId=' + this.configService.franchiseId);
  }

  public getBranchPaymentOptions(branchId): Observable<PaymentOptionsModel> {
    return this.http.get<PaymentOptionsModel>(this.configService.serverUrl +
      'Payment/GetBranchPaymentOptions?branchId=' + branchId);
  }

  public getCashRegister(branchId): Observable<any> {
    return this.http.get<any>(this.configService.serverUrl +
      'Iframe/GetCashRegister?branchId=' + branchId);
  }

  public dataEncryption(appUserToken, data): Observable<PaymentOptionsModel> {
    return this.http.get<PaymentOptionsModel>(this.configService.serverUrl +
      'Iframe/AppDataEncryption?appUserToken=' + appUserToken + '&data=' +
      data + "&franchiseId=" + this.configService.franchiseId);
  }

  public paymentRequestCashRegister(serverOrder, loginToken, encryptedCreditCard): Observable<any> {
    ///Iframe/
    
    return this.http.post<any>(this.configService.serverUrl +
      'Payment/PaymentRequestCashRegister',
      {
        order: serverOrder,
        userLoginToken: loginToken,
        encryptedCreditCard: encryptedCreditCard,
        country: this.configService.country
      });
  }

  public biteCreditPaymentRequest(serverOrder, loginToken, encryptedCreditCard): Observable<any> {
    ///Iframe/
    
    return this.http.post<any>(this.configService.serverUrl +
      'Payment/BiteCreditPaymentRequest',
      {
        order: serverOrder,
        userLoginToken: loginToken,
        encryptedCreditCard: encryptedCreditCard,
        country: this.configService.country
      });
  }

  public CheckItemsInventory(serverOrder): Observable<any> {
    ///Iframe/
    
    return this.http.post<any>(this.configService.serverUrl +
      'Iframe/CheckItemsInventory',
      {
        order: serverOrder,
       
      });
  }

  public PaymentRequestTranzilaIframe(serverOrder,
    confirmationNumber,
    loginToken): Observable<any> {
    return this.http.post<any>(this.configService.serverUrl +
      'Payment/PaymentRequestTranzilaIframe',
      {
        order: serverOrder,
        confirmationNumber: confirmationNumber,
        userLoginToken: loginToken,
        country: this.configService.country
      });
  }

  public PaymentRequestPelecardIframe(serverOrder,
    confirmationNumber, transactionId, sum,
    loginToken): Observable<any> {
    return this.http.post<any>(this.configService.serverUrl +
      'Payment/PaymentRequestPelecardIframe',
      {
        order: serverOrder,
        confirmationNumber: confirmationNumber,
        transactionId:transactionId,
        userLoginToken: loginToken,
        country: this.configService.country,
        sum:sum
      });
  }

   public CheckTransactionStatusAndSendOrder(serverOrder,
    franchiseId, transactionId, sum,
    loginToken): Observable<any> {
    return this.http.post<any>(this.configService.serverUrl +
      'Pelecard/CheckTransactionStatusAndSendOrder',
      {
        order: serverOrder,      
        transactionId:transactionId,
        franchiseId: franchiseId,
        userLoginToken: loginToken,       
        sum:sum,
         country: this.configService.country
      });
  }

 

  public paymentRequestTranzilaNew(serverOrder, loginToken, transillaResponse, cvv): Observable<any> {
    return this.http.post<any>(this.configService.serverUrl +
      'Iframe/PaymentRequestTranzillaNew',
      {
        order: serverOrder,
        userLoginToken: loginToken,
        transillaResponse: transillaResponse,
        country: this.configService.country,
        cvv: cvv
      }); 
  }

  public checkSibusBudget(serverOrder, loginToken, encryptedCreditCard): Observable<any> {
    ///Iframe/    
    return this.http.post<any>(this.configService.serverUrl +
      'Iframe/CheckSibusBudget',
      {
        order: serverOrder,
        userLoginToken: loginToken,
        encryptedCreditCard: encryptedCreditCard
      });
  }

  public checkTenbisBudget(serverOrder, loginToken, encryptedCreditCard): Observable<any> {
    ///Iframe/    
    return this.http.post<any>(this.configService.serverUrl +
      'Iframe/CheckSibusBudget',
      {
        order: serverOrder,
        userLoginToken: loginToken,
        encryptedCreditCard: encryptedCreditCard
      });
  }

  public splittedPaymentRequestCibusCash(serverOrder, loginToken, encryptedCreditCard): Observable<any> {
    ///Iframe/    
    return this.http.post<any>(this.configService.serverUrl +
      'Iframe/SplittedPaymentRequestCibusCash',
      {
        order: serverOrder,
        userLoginToken: loginToken,
        encryptedCreditCard: encryptedCreditCard,
        country: this.configService.country
      });
  }

  public payWithCibusCard(branchId, sum, cibusCard): Observable<any> {
    ///Iframe/    
    return this.http.post<any>(this.configService.serverUrl +
      'Iframe/PayWithCibusCard',
      {
        branchId: branchId,
        sum: sum,
        cibusCard: cibusCard,
        companyCode: 0
      });
  }
  public payWithTenbisCard(branchId, sum, cibusCard): Observable<any> {
    ///Iframe/    
    return this.http.post<any>(this.configService.serverUrl +
      'Iframe/PayWithTenbisCard',
      {
        branchId: branchId,
        sum: sum,
        cibusCard: cibusCard,
        companyCode: 0
      });
  }

   
  public PayWithSibusCard(branchId, sum, sibusCard): Observable<any> {
    ///Iframe/    
    return this.http.post<any>(this.configService.serverUrl +
      'Kiosk/PayWithSibusCard',
      {
        branchId: branchId,
        sum: sum,
        sibusCard: sibusCard,
        companyCode: 0
      });
  }

  public PayWithTenbisCard(branchId, sum, card): Observable<any> {
    ///Iframe/    
    return this.http.post<any>(this.configService.serverUrl +
      'Iframe/PayWithTenbisCard',
      {
        branchId: branchId,
        sum: sum,
        card: card
         
      });
  }

  public SplittedPaymentRequestCibusTenbisCash(serverOrder, loginToken): Observable<any> {
    ///Iframe/
    
    return this.http.post<any>(this.configService.serverUrl +
      'Iframe/SplittedPaymentRequestCibusTenbisCash',
      {
        order: serverOrder,
        userLoginToken: loginToken,
        
        country: this.configService.country
      });
  }

  public SplittedPaymentRequestCibusTenbisCredit(serverOrder, loginToken, encryptedCreditCard): Observable<any> {
    ///Iframe/
    
    return this.http.post<any>(this.configService.serverUrl +
      'Iframe/SplittedPaymentRequestCibusTenbisCredit',
      {
        order: serverOrder,
        userLoginToken: loginToken,
        encryptedCreditCard: encryptedCreditCard,
        country: this.configService.country
      });
  }

  public SplittedPaymentRequestCibusCredit(serverOrder, loginToken, encryptedCreditCards): Observable<any> {
    ///Iframe/
    
    return this.http.post<any>(this.configService.serverUrl +
      'Iframe/SplittedPaymentRequestCibusCredit',
      {
        order: serverOrder,
        userLoginToken: loginToken,
        encryptedCreditCards: encryptedCreditCards,
        country: this.configService.country
      });
  }

  public SplittedPaymentRequestTranzilla(serverOrder, loginToken, encryptedCreditCards): Observable<any> {
    ///Iframe/
    
    return this.http.post<any>(this.configService.serverUrl +
      'Iframe/SplittedPaymentRequestTranzilla',
      {
        order: serverOrder,
        userLoginToken: loginToken,
        encryptedCreditCards: encryptedCreditCards,
        country: this.configService.country
      });
  }

  public MakeOrderTranzillaSplittedPayment(serverOrder, loginToken, tempref, recpitData): Observable<any> {
    ///Iframe/    
    return this.http.post<any>(this.configService.serverUrl +
      'Iframe/MakeOrderTranzillaSplittedPayment',
      {
        order: serverOrder,
        userLoginToken: loginToken,
        tempref: tempref,
        recpitData: recpitData,
        country: this.configService.country
      });
  }

  public CheckCCToken(loginToken, branchId, encryptedCreditCard, sum): Observable<any> {
    ///Iframe/
    
    return this.http.post<any>(this.configService.serverUrl +
      'Iframe/CheckCCToken',
      {
        userLoginToken: loginToken,
        branchId: branchId,
        encryptedCreditCard: encryptedCreditCard,
        sum: sum
      });
  }

  public CheckTranzilaTransactionStatus(franchiseId, userLoginToken, sum, saveCredit): Observable<any> {   
    return this.http.get<any>(this.configService.serverUrl +
      'Tranzila/CheckTransactionStatus?franchiseId=' 
       + franchiseId + "&userLoginToken=" + userLoginToken
       +"&sum=" + sum +"&saveCredit=" + saveCredit);
  }  


  public GetPelecardIframeUrl(sum, user,pass,terminal,userLoginToken,franchiseId,branchId): Observable<any> {   
    return this.http.get<any>(this.configService.serverUrl +
      'Pelecard/GetPelecardIframeUrl?sum=' + sum +'&user=' 
       + user + "&pass=" + pass + "&terminal=" + terminal
       +"&paramx=" + franchiseId + "_" + branchId + "_"  + userLoginToken + "_"+sum );
       //609_906_dgfcgbbcb_2
  }  

  public GetPelecardIframeUrlWithInvoice(order, userLoginToken, franchiseId): Observable<any> {   
   
      var paramx=  franchiseId + "_" + order.BranchId + "_"  + userLoginToken + "_" + order.Sum;
       return this.http.post<any>(this.configService.serverUrl +
        'Pelecard/GetPelecardIframeUrlWithInvoice',
        {
          paramx: paramx,
          order: order
        });
  }  

   public GetPelecardIframeUrlNew(order, userLoginToken, franchiseId, sum): Observable<any> {   
   
      var paramx=  franchiseId + "_" + order.BranchId + "_"  + userLoginToken + "_" + sum;
       return this.http.post<any>(this.configService.serverUrl +
        'Pelecard/GetPelecardIframeUrlNew',
        {
          paramx: paramx,
          country: this.configService.country,
          order: order
        });
  }  

   public GetPelecardIframeUrlForBiteCredit(order, userLoginToken, franchiseId, sum): Observable<any> {   
   
      var paramx=  franchiseId + "_" + order.BranchId + "_"  + userLoginToken + "_" + sum;
       return this.http.post<any>(this.configService.serverUrl +
        'Pelecard/GetPelecardIframeUrlForBiteCredit',
        {
          paramx: paramx,
          country: this.configService.country,
          order: order
        });
  }  

  public CheckPelecardTransactionStatus(transactionId,franchiseId, userLoginToken, sum): Observable<any> {   
    return this.http.get<any>(this.configService.serverUrl +
      'Pelecard/CheckTransactionStatus?transactionId=' + transactionId +'&franchiseId=' 
       + franchiseId + "&userLoginToken=" + userLoginToken
       +"&sum=" + sum );
  }  

  public CheckPelecardTransactionStatusNew(transactionId,franchiseId, userLoginToken, sum): Observable<any> {   
    return this.http.get<any>(this.configService.serverUrl +
      'Pelecard/CheckTransactionStatusNew?transactionId=' + transactionId +'&franchiseId=' 
       + franchiseId + "&userLoginToken=" + userLoginToken
       +"&sum=" + sum );
  }  

  public CheckTransactionStatusBiteCredit(transactionId,franchiseId, userLoginToken, sum): Observable<any> {   
    return this.http.get<any>(this.configService.serverUrl +
      'Pelecard/CheckTransactionStatusBiteCredit?transactionId=' + transactionId +'&franchiseId=' 
       + franchiseId + "&userLoginToken=" + userLoginToken
       +"&sum=" + sum );
  }  

  public TranzilaVerifyCard(loginToken, branchId, encryptedCreditCard, sum): Observable<any> {
    return this.http.post<any>(this.configService.serverUrl +
      'Tranzila/TranzilaVerifyCard',
      {
        userLoginToken: loginToken,
        branchId: branchId,
        encryptedCreditCard: encryptedCreditCard,
        sum: sum
      });
  }

  public TranzilaForceCardPayment(loginToken, branchId, index, authnr, sum): Observable<any> {
    return this.http.post<any>(this.configService.serverUrl +
      'Tranzila/TranzilaForceCardPayment',
      {
        userLoginToken: loginToken,
        branchId: branchId,
        index: index,
        authnr: authnr,
        sum: sum
      });
  }

  public paymentRequestTranzila(serverOrder, loginToken, creditCardJson): Observable<any> {
    return this.http.post<any>(this.configService.serverUrl +
      'Iframe/PaymentRequestTranzila',
      {
        order: serverOrder,
        userLoginToken: loginToken,
        creditCardJson: creditCardJson,
        country: this.configService.country
      }); //PaymentRequestTranzila TranzilaPaymentRequestNew
  }

  public paymentRequest(serverOrder, loginToken, tranzilaToken, cardExpiration): Observable<any> {
    return this.http.post<any>(this.configService.serverUrl +
      'Iframe/PaymentRequest',
      {
        order: serverOrder,
        userLoginToken: loginToken,
        tranzilaToken: tranzilaToken,
        cardExpiration: cardExpiration,
        country: this.configService.country
      });
  }

  public getPayaRequest(serverOrder, loginToken): Observable<any> {
    return this.http.post<any>(this.configService.serverUrl +
      'Paya/GetRequest',
      {
        order: serverOrder,
        userLoginToken: loginToken
      });
  }

  public verifyHash(toHash, payaHash): Observable<any> {
    return this.http.post<any>(this.configService.serverUrl +
      'Paya/PaymentResult',
      {
        toHash: toHash,
        payaHash: payaHash
      });
  }

}
