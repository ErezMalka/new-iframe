import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TranslationsService } from '../../translations/translations.service';
import { AppConfig } from '../../../app.config';
import { MAT_DIALOG_DATA, MatDialogRef , MatDialogConfig } from '@angular/material/dialog';
import { DiscountModel } from '../../../models/discount/discount.model';
import { AppStorageService } from '../../../app.storage.service';

import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import 'moment/locale/fr';
import { SignInOutService } from '../../../core/services/sign-in-out.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemAppAdvancedModel } from '../../../models/advanced/menu/item-app-advanced.model';
import { OrderItemAppModel } from '../../../models/order/order-item-app.model';
import { CommonFunctionsService } from '../../../core/services/common-settings/common-functions.service';
import { GarnishAppAdvancedModel } from '../../../models/advanced/menu/garnish-app-advanced.model';
import { BiteCreditOrderAppModel } from '../../../models/order/bite-credit-order-app.model';
import { BranchAppModel } from '../../../models/franchise-branch/branch-app.model';

import { OrderService } from '../../../core/services/order.service';
import { ConfigService } from '../../../core/services/common-settings/config.service';
import { BenefitAppModel } from '../../../models/menu/benefit-app.model';


import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PaymentService } from '../../services/payment.service';
import * as moment from 'moment';
import { PaymentTypeEnum } from '../../../enums/payment-type.enum';
import { MessageService } from '../message/message.service';
import { StorageValueEnum } from '../../../enums/advanced/storage-value.enum';
import { MatDatepicker } from '@angular/material/datepicker';
import { CountryEnum } from '../../../enums/advanced/country.enum';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'bite-credit',
  templateUrl: './bite-credit.component.html',
  styleUrls: ['./bite-credit.component.scss'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class BiteCreditComponent implements OnInit {

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  public graphics = {
    logo: '',
    cover: '',
  };

  public colors = {
    menuColor: '',
    buttonColor: ''
  };

  public cashRegisterCreditCard = {
    ownerId: '',
    number: '',
    cvv: '',
    expirationYear: '',
    expirationMonth: ''
  };

  public cibusCard = {
    ownerId: '',
    number: '',
    cvv: '',
    expirationYear: '',
    expirationMonth: '',
    sum: 0
  };

  public tenbisCard = {
    ownerId: '',
    number: '',
    cvv: '',
    expirationYear: '',
    expirationMonth: '',
    sum: 0
  }

  public ccWithToken = {
    ownerId: '',
    number: '',
    cvv: '',
    expirationYear: '',
    expirationMonth: '',
    sum: 0,
    token:''
  }
  public creditCardsForSplittedPayment: any[];
  public isPaymentByTranzila: boolean = false;
public user: any;
  public errorsCashRegister = {
    ownerId: {
      notValidId: false,
      minMaxlength: false
    },
    number: {
      notValidCreditCard: false,
      minlength: false,
      maxlength: false
    },
    cvv: {
      minMaxlength: false,
    },
    expirationMonth: {

    },
    expirationYear: {

    }
  };
  public showLoader:boolean = false;
  public notEnoughCibusBudget:boolean = false;
  public cibusBudget: number = 0;
  public lang: any;

  public   creditOptionsArr: string[];
  public   creditOptions:string;
  public   creditName :string;
  public   allowCustomCreditSum :boolean;
  public   creditAddedValuePercent :number;
  private timerId;
  
  public timer: number = -1;
  public usePelecardIframe: boolean = false;
  public pelecardIframeUrlSanitized: SafeResourceUrl;
  public pelecardIframeUrl: string;
  public firstName: string;
  public lastName: string;
  public birthDay: any;
  public anniversaryDay: any;
  public phoneNumber: any;
  public email: string;
  public isAlreadyClubMember: boolean;
  public appUser: any;
public cashRegister: any;
  public continueToSignUp: boolean = false;

  public succesfullyAdded:boolean = false;

  public orderErrors = {
    FirstName: false,
    LastName: false,
    Phone: false,
    Email:false,
    ExtraPhone: false,
    UserCity: false,
    Street: false,
    StreetNum: false,
    Floor: false,
    ApartmentNum: false,
    ownerId: false,
    number: false,
    cvv: false,
    expirationYear: false,
    expirationMonth: false,
    sum:false,

    Anniversary: false,
    BirthDate:false
  };
  public entryScreenNotMember: boolean = false;
  public franchiseId: any;
  public acceptTerms: boolean;
  public userJoinedClub: boolean = false;
  public date = new Date();
  public step: number = 0;
  public currentUserCredit: any;
  currentDate: Date;

  joinCategory: any;
  selectedSum: number = 0;
  customSum: number  ;
  someOption: boolean = false;
  public comment: string = '';
  displayContinueButton: boolean;

  public order: BiteCreditOrderAppModel;
  currentBranch: BranchAppModel;
  userBirthDay: any;
  bdayCategory: any;
  annCategory: any;
  userAnniversary: any;
  userAnniversaryAndBDay: any;
  paymentType: string = '';
  tempBDayCategory: any;
  public isAddCredit: boolean=false;
  activeBenefits: any[];
  public years : string[] = [];
  public memberClubPolicy = '';
  bsModalRef: BsModalRef;
  NewMemberVoucherActive: boolean;
  Tenbis: boolean = false;
  Cibus: boolean  = false;
 public ccTokens: any[];
 public addCC:boolean=false;
 public totalCredit:number ;

  constructor( private translationsService: TranslationsService,
    private modalService: BsModalService,
    private messageService: MessageService,
    private signInOutService: SignInOutService,
    private configService: ConfigService,
    private orderService: OrderService,
    private commonFunctionsService: CommonFunctionsService,
    private deviceService: DeviceDetectorService,
    private paymentService: PaymentService,
    private router: Router,
    private sanitizer: DomSanitizer, 
    private route: ActivatedRoute,
               public dialogRef: MatDialogRef<BiteCreditComponent>,
               private appStorageService: AppStorageService,
               private _adapter: DateAdapter<any>,
               @Inject(MAT_DATE_LOCALE) private _locale: string,
               @Inject(MAT_DIALOG_DATA) public data: any ) {

    this.memberClubPolicy = this.appStorageService.memberClubPolicy;

    if (data) {
      this.creditName = data.creditName;
      this.isAddCredit = data.isAddCredit;
      if (this.isAddCredit) this.step =1;
      this.allowCustomCreditSum = data.allowCustomCreditSum;
      this.creditOptions = data.creditOptions;
      this.creditAddedValuePercent = data.creditAddedValuePercent;
      this.creditOptionsArr = this.creditOptions.split(",");
 
        this.appUser = data.appUser;
        this.currentUserCredit = this.appUser.BiteCredit;
        this.initializeOrder();
      
    }
  }

  goBack(){
   if (this.isAddCredit) {
      if (this.step-1 == 0 ) this.close();
      else this.step = this.step-1;
   } 
   else  { 
    this.step = this.step-1;
   }
  }

  isSumSelected(sum){
    if (Number(sum) == this.selectedSum && 
        this.customSum == undefined) return true;
    else return false;
  }

  selectSum(sum){
    this.selectedSum =Number(sum);
    this.customSum = undefined;
    this.order.Sum = this.selectedSum;
  }

  calcTotalCredit(){
    if (this.selectedSum > 0 &&
      this.customSum == undefined ){
        this.order.TotalCredit = this.selectedSum + (this.selectedSum * this.creditAddedValuePercent / 100);
        return  this.order.TotalCredit;
      }
     
    else if (this.customSum > 0 )  {
     // console.log(this.customSum , this.customSum * this.creditAddedValuePercent / 100);
     this.order.Sum = Number(this.customSum);
      this.order.TotalCredit = Number(this.customSum) + (this.customSum * this.creditAddedValuePercent / 100);
      return   this.order.TotalCredit
    }
  }

  public isMobileModeCheck(): boolean {
    //console.log("this.deviceService.isMobile()",this.deviceService.isMobile());
    return this.deviceService.isMobile() || this.deviceService.isTablet();
  }

  
  ngOnInit(): void {
    for (let index = 0; index < 11; index++) {
      this.years[index] = (this.date.getFullYear()+index).toString();
      //console.log("this.years[index]",this.years[index])

    }
  //  this.NewMemberVoucherActive = this.appStorageService.franchise.NewMemberVoucherActive;
     
    //console.log("this.isback", this.isGoback);
    this.franchiseId = this.configService.franchiseId;
    this.getCashRegister();
    
    this.initializeGraphics();
    const loginToken = this.appStorageService
      .getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.configService.franchiseId);
    if (loginToken) {
      this.signInOutService.verifyToken(loginToken).subscribe((response) => {
        this.ccTokens = response.ccTokens;
      });
    }
    this.signInOutService.verifyToken(loginToken).subscribe((response) => {
    });

    this.acceptTerms = false;

    //console.log("this.myScrollContainer",this.myScrollContainer);

     


  }

  ngAfterViewInit(): void {
    //console.log("this.myScrollContainer",this.myScrollContainer);
  }

  ngAfterViewChecked(): void {
    //console.log("this.myScrollContainer",this.myScrollContainer);
    //this.myScrollContainer.nativeElement.scrollTop = 0;
    //console.log("this.myScrollContainer",this.myScrollContainer);
  }
 
  private initializeDateExpirationForCard() {
    if (this.cashRegisterCreditCard) {
      this.cashRegisterCreditCard.expirationMonth = (moment().month() + 1) + '';
      this.cashRegisterCreditCard.expirationYear = moment().year() + '';
    }
  }

  private initializeDateExpirationForCibus() {
    if (this.cibusCard) {
      this.cibusCard.expirationMonth = (moment().month() + 1) + '';
      this.cibusCard.expirationYear = moment().year() + '';
    }
  }

  private initializeDateExpirationForTenbis() {
    if (this.tenbisCard) {
      this.tenbisCard.expirationMonth = (moment().month() + 1) + '';
      this.tenbisCard.expirationYear = moment().year() + '';
    }
  }

  selectCCToken(ccId){
    this.selectedCcId = ccId;
  }

  getExpDateStr(expDateStr:string): string {
    let month = expDateStr.substring(0,2);
    let year = expDateStr.substring(2,4);
    return month + "/" + year;
  }

  public addCreditCard() {
    console.log("addCC")
    this.addCC = true;
     
  }

  public backToSavedCC(){
    this.addCC = false;
   
  }


  public selectedCibus:string;
  public cibusSplittedPaymentType:string;
  public selectedCcId:number;
  

  private verifyAE_CC(cardNumber) {
    let sum = 0;
    let cc = new String(cardNumber);
    let ccRev = [];
    for (let i = cc.length; i > 0; i--) {
      ccRev.push(cc[i - 1]);
    }
    for (let i = 0; i < ccRev.length; i++) {
      if (i % 2 == 1) {
        let mult = ccRev[i] * 2;
        if (mult > 9) {
          mult = (Math.floor(mult / 10)) + (mult % 10);
        }
        sum = +sum + +mult;
      }
      else {
        sum = +sum + +ccRev[i];
      }
    }
    if (sum % 10 == 0) {
      //  this.notValidCreditCard = false;
      return true;
    } else {
      //    this.notValidCreditCard = true;
      return false;
    }
  }

  public isCreditValidData() {
    console.log("isCreditValidData");
    if (this.paymentType === PaymentTypeEnum.sibus) {
   /*   if (this.multiPayers && this.cibusSplittedPaymentType == "credit"){
        if (this.country !== CountryEnum.US &&
          !this.legalTz(this.cashRegisterCreditCard.ownerId)) {
          return false;
        }
        if (!this.legalCC_Short(this.cashRegisterCreditCard.number) &&
          !this.legalCC(this.cashRegisterCreditCard.number) && !this.verifyAE_CC(this.cashRegisterCreditCard.number)) {
          return false;
        }
        if (!this.isCVV(this.cashRegisterCreditCard.cvv)) {
          return false;
        }
        return true;*/

     // } else {
        if(this.selectedCibus){
          this.cibusCard.number = this.selectedCibus;
        }
        if (this.cibusCard.number.length == 9 || 
            this.cibusCard.number.length == 8 ||
            this.cibusCard.number.length == 5) {
              if (this.notEnoughCibusBudget && this.cibusSplittedPaymentType == 'credit') {
                if (!this.legalTz(this.cashRegisterCreditCard.ownerId)) {
                  return false;
                }
                if (!this.legalCC_Short(this.cashRegisterCreditCard.number) &&
                  !this.legalCC(this.cashRegisterCreditCard.number) && !this.verifyAE_CC(this.cashRegisterCreditCard.number)) {
                  return false;
                }
                if (!this.isCVV(this.cashRegisterCreditCard.cvv)) {
                  return false;
                }
                return true;
              }
               return true;
            }
        else return false;
      //}
    
    } else if (this.paymentType === PaymentTypeEnum.tenbis) {
   /*   if (this.multiPayers && this.cibusSplittedPaymentType == "credit"){
        if (this.country !== CountryEnum.US &&
          !this.legalTz(this.cashRegisterCreditCard.ownerId)) {
          return false;
        }
        if (!this.legalCC_Short(this.cashRegisterCreditCard.number) &&
          !this.legalCC(this.cashRegisterCreditCard.number) && !this.verifyAE_CC(this.cashRegisterCreditCard.number)) {
          return false;
        }
        if (!this.isCVV(this.cashRegisterCreditCard.cvv)) {
          return false;
        }
        return true;
      } else {*/
        if (this.tenbisCard.number.length > 10) {
          return true;
        } else {
          return false;
        }
     // }
     
    } else {
   /*   if (this.multiPayers) {
        return true;
      } else { */
        if (this.ccTokens.length > 0 && this.selectedCcId > 0 && !this.addCC){
          console.log("isCreditValidData: true");
           return true;
         } else {
           console.log("isCreditValidData: else");
           if (!this.legalTz(this.cashRegisterCreditCard.ownerId)) {
              

             return false;
           }
           if (!this.legalCC_Short(this.cashRegisterCreditCard.number) &&
             !this.legalCC(this.cashRegisterCreditCard.number) && !this.verifyAE_CC(this.cashRegisterCreditCard.number)) {
             return false;
           }
           if (!this.isCVV(this.cashRegisterCreditCard.cvv)) {
             return false;
           }
           return true;
         }
   //   }
      
      
    }
  }

  private legalTz(num) {
    let tot = 0;
    let tz = new String(num);
    if (Number.isInteger(parseInt(num))) {
      for (let index = 0; index < tz.length; index++) {
        tot++;
        var myChar = tz[index];

      }
      if(tot == 8 || tot ==9){
        return true;
      }


    }

    else{
      return false;
    }
  }

  private legalCC(num) {
    let tot = 0;
    let cc = new String(num);
    for (let i = 0; i < cc.length; i++) {
      let x = ((((i + 1) % 2) + 1) * +cc.charAt(i));
      if (x > 9) {
        let x1 = x.toString();
        x = parseInt(x1.charAt(0)) + parseInt(x1.charAt(1));
      }
      tot += x;
    }
    if (tot % 10 == 0) {
      this.errorsCashRegister.number.notValidCreditCard = false;
      return true;
    } else {
      this.errorsCashRegister.number.notValidCreditCard = true;
      this.showLoader = false;
      return false;
     
    }
  }

  private legalCC_Short(num) {
    let tot = 0;
    let cc = new String(num);
    if (cc.length < 8 || cc.length > 9) {
      return false; //will continue to next cc test.
    }
    for (let i = 0; i < cc.length; i++) {
      let x = ((cc.length - i) * +cc.charAt(i));
      tot += x;
    }
    if (tot % 11 == 0) {
      this.errorsCashRegister.number.notValidCreditCard = false;
      return true;
    } else {
      this.errorsCashRegister.number.notValidCreditCard = true;
      return false;
    }
  }

  public isCVV(value:string) {
    const cvvStr = value.toString().split('');
    if (cvvStr.length == 3 && 
        Number.isInteger(parseInt(cvvStr[0])) &&
        Number.isInteger(parseInt(cvvStr[1])) &&
        Number.isInteger(parseInt(cvvStr[2]))) {
          return true;
    } else {
      return false;
    }
   // const cvv = parseInt(value) + '';
   // return value ? (cvv === value && cvv.length >=3 && cvv.length <=4) : false;
  }

  public isSplittedCreditValidData() {
    console.log("isSplittedCreditValidData");
    if (Number(this.ccWithToken.sum) == 0 || 
        Number(this.ccWithToken.sum) > this.selectedSum) {
          return false;
        }
        if (this.ccWithToken.expirationMonth =='') {
          this.ccWithToken.expirationMonth = (this.date.getMonth() + 1).toString();
          this.ccWithToken.expirationYear = this.date.getFullYear().toString();
        }
         
        if ( !this.legalTz(this.ccWithToken.ownerId)) {
            return false;
        }
        if (!this.legalCC_Short(this.ccWithToken.number) &&
          !this.legalCC(this.ccWithToken.number) && !this.verifyAE_CC(this.ccWithToken.number)) {
          return false;
        }
        if (!this.isCVV(this.ccWithToken.cvv)) {
          return false;
        }
        return true;
      
  }

  

  private getCashRegister() {
    this.paymentService.getCashRegister(this.appStorageService.branch.Id)
    .subscribe((response) => {
      this.cashRegister = response;
        if ((this.cashRegister.cashRegisterType == "Pelecard" ||  
        this.cashRegister.isPelecard ) &&
        this.cashRegister.pelecardUser != null &&
        this.cashRegister.pelecardUser != undefined &&
        this.cashRegister.pelecardUser != "undefined" &&
        this.cashRegister.pelecardPassword != null &&
        this.cashRegister.pelecardPassword != undefined &&
        this.cashRegister.pelecardPassword != "undefined"&&
        this.cashRegister.pelecardPerminal != null &&
        this.cashRegister.pelecardPerminal != undefined &&
        this.cashRegister.pelecardPerminal != "undefined")
        this.usePelecardIframe = true;
      if (response.isSibus ) this.Cibus = true;
      if (response.isTenbis ) this.Tenbis = true;
      
    }, (error) => {
      
    });
  }

  public payWithCashRegisterCreditCard(order) {
    if (!this.isCreditValidData()) {
      this.showLoader = false;
      return;
    }
    const loginToken = this.appStorageService
      .getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.configService.franchiseId);
   // this.isLoaded.isCreditPaymentLoaded = false;
    this.paymentService
      .dataEncryption(loginToken, JSON.stringify(this.cashRegisterCreditCard))
      .subscribe((response) => {
        let encrypted = response;
        this.paymentService
          .biteCreditPaymentRequest(order, loginToken, encrypted)
          .subscribe((response) => {
            if( response && response.Data && response.Data.success) {
              this.step ++;
             this.totalCredit = response.Data.totalCredit;
            }
           
          }, (error) => {
           // this.isLoaded.isCreditPaymentLoaded = true;
            this.messageService.displayServerErrorMessage();
          });
      }, (error) => {
       // this.isLoaded.isCreditPaymentLoaded = true;
        this.messageService.displayServerErrorMessage();
      });
  }

  public isFilledFields() {
     
      if (this.paymentType === PaymentTypeEnum.card) {
        if (this.selectedCcId > 0 && this.order.CCTokens.length > 0 && !this.addCC) {
          return this.trimField(this.order.FirstName) && this.trimField(this.order.LastName);
        } else {
          return this.trimField(this.order.FirstName) && this.trimField(this.order.LastName)
          && this.trimField(this.cashRegisterCreditCard.number) &&
          this.trimField(this.cashRegisterCreditCard.cvv) &&
          this.trimField(this.cashRegisterCreditCard.ownerId)
          && this.trimField(this.cashRegisterCreditCard.expirationMonth) &&
          this.trimField(this.cashRegisterCreditCard.expirationYear);
        }
       
      } else if (this.paymentType === PaymentTypeEnum.sibus){ 
        return this.trimField(this.order.FirstName) && this.trimField(this.order.LastName)
        && this.trimField(this.cibusCard.number) 
      } else {
        return false;
      }
     
  }

  public removeExpirationErrors() {
    this.removeErrorWhileFocus('expirationMonth');
    this.removeErrorWhileFocus('expirationYear');
  }

   
  private displayErrorFields() {
    
   // if (this.order &&  this.displayCompanyCode) this.orderErrors.Code = !this.trimField(this.order.Code);
    var pattern = new RegExp('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}');
 
        this.orderErrors.number = !(this.trimField(this.cashRegisterCreditCard.number) &&
          this.legalCC_Short(this.cashRegisterCreditCard.number) &&
          this.legalCC(this.cashRegisterCreditCard.number));
        this.orderErrors.cvv = !(this.trimField(this.cashRegisterCreditCard.cvv) && this.isCVV(this.cashRegisterCreditCard.cvv));
        this.orderErrors.ownerId =  (!this.trimField(this.cashRegisterCreditCard.ownerId) ||
            !this.legalTz(this.cashRegisterCreditCard.ownerId)) ;
        this.orderErrors.expirationYear = !this.trimField(this.cashRegisterCreditCard.expirationYear);
        this.orderErrors.expirationMonth = !this.trimField(this.cashRegisterCreditCard.expirationMonth);
      
    
  }
  
  public cardPayment() {
    if (this.order) {
      this.order.Payment = this.paymentType;//PaymentTypeEnum.card;
       if (this.selectedCcId > 0 && !this.addCC) this.payWithSavedCreditCard(this.order);
          else this.payWithCashRegisterCreditCard(this.order);
        } else {
         // this.payWithTranzila(this.prepareOrderForServer(order));
         this.payWithCashRegisterCreditCard(this.order);
         
    }
  }

  public payWithSavedCreditCard(order) {
    //  if (!this.isCreditValidData()) {
     //   return;
    //  }
      const loginToken = this.appStorageService
        .getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.configService.franchiseId);
     // this.isLoaded.isCreditPaymentLoaded = false;
      order.SavedCreditTokenId = this.selectedCcId;
      this.paymentService
            .biteCreditPaymentRequest(order, loginToken, "")
            .subscribe((response) => {
              if( response && response.Data && response.Data.success) {
                this.step ++;
                this.totalCredit = response.Data.totalCredit;
              }
            }, (error) => {
             // this.isLoaded.isCreditPaymentLoaded = true;
              this.messageService.displayServerErrorMessage();
            });
    }

  public sibusPayment() {
    if (this.order) {
      this.order.Payment = this.paymentType;//PaymentTypeEnum.card;
       
     // this.isLoaded.isCreditPaymentLoaded = true;
     
      //console.log("this.cashRegister",this.cashRegister);
     // if (this.cashRegister && this.cashRegister.isUseCashRegister) {
        if (this.notEnoughCibusBudget) {
          this.payWithSibusCardAndCredit(this.order);
        } else {
          this.payWithSibusCard(this.order);
        }
       
      //}  
       
    }
  }

  public tenbisPayment() {
    if (this.order) {
      this.order.Payment = this.paymentType;//PaymentTypeEnum.card;
       
   
      //this.isLoaded.isCreditPaymentLoaded = true;
     // this.isLoaded.isPayaPaymentLoaded = true;
     // console.log("this.cashRegister",this.cashRegister);
     // if (this.cashRegister && this.cashRegister.isUseCashRegister) {
       this.payWithTenbisCard(this.order);
       
     // }  
       
    }
  }

  public payWithSibusCard(order) {
    this.initializeDateExpirationForCibus();
    if (!this.isCreditValidData()) {
      this.showLoader = false;
      return;
    }
    const loginToken = this.appStorageService
      .getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.configService.franchiseId);
    //this.isLoaded.isCreditPaymentLoaded = false;
    this.paymentService
      .dataEncryption(loginToken, JSON.stringify(this.cibusCard))
      .subscribe((response) => {
        let encrypted = response;
        
        this.paymentService
          .checkSibusBudget(order, loginToken, encrypted)
          .subscribe((response) => {
            if (response.Data.success) {
              this.paymentService
              .biteCreditPaymentRequest(order, loginToken, encrypted)
              .subscribe((response) => {
                if( response && response.Data && response.Data.success) {
                  this.step ++;
                  this.totalCredit = response.Data.totalCredit;
                }
              }, (error) => {
                //this.isLoaded.isCreditPaymentLoaded = true;
                this.messageService.displayServerErrorMessage();
              });
            } else {
              if (response.Data.approvedPrice == 0 && 
                  response.Data.errorMessage == "Not enough budget" ) {
                    this.notEnoughCibusBudget =true;
                    this.cibusBudget = 0;
                    // יתרתך בכרטיס היא 0 , נא בחר אמצעי תשלום אחר
              } else if (response.Data.approvedPrice > 0 && 
                         response.Data.errorMessage == "Not enough budget" ) {
              //פצל תשלום
                          this.notEnoughCibusBudget =true;
                          this.cibusBudget = response.Data.approvedPrice;
                         // alert("יתרתך אינה מספיקה")
              }
              this.cibusSplittedPaymentType = 'credit';
             
            //  this.isLoaded.isCreditPaymentLoaded = true;
            }
          }, (error) => {
            //this.isLoaded.isCreditPaymentLoaded = true;
            this.messageService.displayServerErrorMessage();
          });
                
      }, (error) => {
       // this.isLoaded.isCreditPaymentLoaded = true;
        this.messageService.displayServerErrorMessage();
      });
  }

  public payWithTenbisCard(order) {
    this.initializeDateExpirationForTenbis();
    if (!this.isCreditValidData()) {
      this.showLoader = false;
      return;
    }
    const loginToken = this.appStorageService
      .getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.configService.franchiseId);
   // this.isLoaded.isCreditPaymentLoaded = false;
    this.paymentService
      .dataEncryption(loginToken, JSON.stringify(this.tenbisCard))
      .subscribe((response) => {
        let encrypted = response;
      
          this.paymentService
          .biteCreditPaymentRequest(order, loginToken, encrypted)
          .subscribe((response) => {
            if( response && response.Data && response.Data.success) {
              this.step ++;
              this.totalCredit = response.Data.totalCredit;
            }
          }, (error) => {
            //this.isLoaded.isCreditPaymentLoaded = true;
            this.messageService.displayServerErrorMessage();
          });
        
                
      }, (error) => {
        //this.isLoaded.isCreditPaymentLoaded = true;
        this.messageService.displayServerErrorMessage();
      });
  }

  
  public payWithSibusCardAndCredit(order) {
    if (!this.isCreditValidData()) {
      this.showLoader = false;
      return;
    }
    const loginToken = this.appStorageService
      .getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.configService.franchiseId);
 //   this.isLoaded.isCreditPaymentLoaded = false;
    this.cibusCard.sum = this.cibusBudget;
    this.paymentService
      .dataEncryption(loginToken, JSON.stringify(this.cibusCard))
        .subscribe((response1) => {
        let encryptedCibus = response1;
        this.paymentService
        .dataEncryption(loginToken, JSON.stringify(this.cashRegisterCreditCard))
          .subscribe((response2) => {
          let encryptedCC = response2;
          let cards=[];
          cards.push(encryptedCibus);
          cards.push(encryptedCC);
          this.paymentService
            .SplittedPaymentRequestCibusCredit(order, loginToken, cards)
              .subscribe((response) => {
                 
                this.signInOutService.updateUserDetails(this.user).subscribe((reslt) => {
                //  this.isLoaded.isCreditPaymentLoaded = true;
                  
                }, (error) => {
                //  this.isLoaded.isCreditPaymentLoaded = true;
                  this.messageService.displayServerErrorMessage();
                });
          }, (error) => {
               // this.isLoaded.isCreditPaymentLoaded = true;
                this.messageService.displayServerErrorMessage();
          });
               
                  
        }, (error) => {
        //  this.isLoaded.isCreditPaymentLoaded = true;
          this.messageService.displayServerErrorMessage();
        });
             
                
      }, (error) => {
        //this.isLoaded.isCreditPaymentLoaded = true;
        this.messageService.displayServerErrorMessage();
      });
  }

  
  public chosenYearHandler(normalizedYear: Date) {
    //const ctrlValue = this.date.value;


    //ctrlValue.year(normalizedYear.getFullYear());
    this.cashRegisterCreditCard.expirationYear = normalizedYear.getFullYear() + '';
    // this.date.setValue(normalizedYear.getFullYear());
  }

  public chosenMonthHandler(normlizedMonth: Date, datepicker: MatDatepicker<moment.Moment>) {
    // const ctrlValue = this.date.value;

    // ctrlValue.month(normlizedMonth.getMonth()+1);
    //this.date.setValue(normlizedMonth.getMonth()+1);
    this.cashRegisterCreditCard.expirationMonth = (normlizedMonth.getMonth() + 1) + '';

    datepicker.close();
  }

  private initializeOrder() {
    this.order = new BiteCreditOrderAppModel();
    if (this.appStorageService.branch) {
      this.currentBranch = this.appStorageService.branch;
     
      this.order.BranchId = this.currentBranch.Id;
      this.order.Sum = 0;
      this.order.FirstName = this.appUser.FirstName;
      this.order.LastName = this.appUser.LastName;
      this.order.Phone = this.appUser.Phone;
      this.order.Email = this.appUser.Email;
      this.order.SaveCredit = false;
    }
  }


  private completeOrder() {
    console.log("completeOrder(userWasNtSignedIn?)")
    const loginToken = this.appStorageService
      .getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.configService.franchiseId);
    if (loginToken) {
    //  this.isLoaded.isValidationUserLoaded = false;
      this.signInOutService.verifyToken(loginToken).subscribe((response) => {
      //  this.isLoaded.isValidationUserLoaded = true;
        const result = response ? !!response.user : !!response;
        if (result) {
          const completePayment = () => {
            console.log("completePayment");
          
            /// End of Workaround for Combo Items  ComboItemId
            switch (this.paymentType) {
              case PaymentTypeEnum.card: {
                this.cardPayment();
                break;
              }
              case PaymentTypeEnum.sibus: {
               // if (this.multiPayers ) {
                //  this.cardPayment();
               //   break;
              //  } else {
                  this.sibusPayment();
                  break;
                //}
                
              }
              case PaymentTypeEnum.tenbis: {
              //  if (this.multiPayers ) {
                //  this.cardPayment();
               //   break;
              //  }  else {
                  this.tenbisPayment();
                  break;
             //   }
                
              }
               
              default: {
               // this.isLoaded.isPaymentSettingsLoaded = true;
              }
            }
          }
         /* if (userWasNtSignedIn) {
            if (response.user) {

              if(AppConfig.configSettings.cancelPhoneVerification){
                response.user.Address = null;
                response.user.IsClubMember = null;
              }
              
              this.user = response.user;
              this.loadOrderUserDataToUser(this.user);
            }
            this.isLoaded.isUpdateUserDetailsLoaded = false;
            this.signInOutService.updateUserDetails(this.user).subscribe((result) => {
              this.isLoaded.isUpdateUserDetailsLoaded = true;
              completePayment();
            }, (error) => {
              this.isLoaded.isUpdateUserDetailsLoaded = true;
              this.messageService.displayServerErrorMessage();
            });
          } else {*/
            completePayment();
          //}
        } else {
          //this.signInOutService.signOut();
        //  this.checkedUserSigning(result);
         // this.loadSignInForm();
        }
      }, (error) => {
        
        this.messageService.displayServerErrorMessage();
      });
    }
  }


   

  public payment() {
 
    console.log("payment");
    this.clearErrorFields();
    if (this.isCreditValidData()) {
     // console.log("payment this.isAllValid()",this.isAllValid());

      const loginToken = this.appStorageService
        .getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.configService.franchiseId);
      if (!loginToken) {
        this.showLoader = false;
       // this.loadSignInForm();
      } else {
        this.showLoader = true;
        this.completeOrder();
      }
    } else {
       
      this.displayErrorFields();
      
    }
    
  }
  

  public continueToBenefits(){
    this.router.navigate([`${this.franchiseId}/my-membership`]);
    this.close();

  }

  


  public scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { 
    }                 
  }


  public continueToSuccesfullyAdded(){


    if(!this.acceptTerms){
       document.getElementById("terms-alert11").classList.add("show");   
       this.scrollToBottom(); 
    }
      
    if (this.acceptTerms) {

      document.getElementById("terms-alert11").classList.remove("show");
      this.clearErrorFields();
      if (this.isAllValidUserData()) {
        //this.loadSuccessAddingToCartMessage();
        this.signIn();
        //this.succesfullyAdded = true;
        //this.continueToSignUp = false;
      }
      else {
        //this.displayCustomerErrorFields();
      }
    }
  }


  public isAllValidUserData() {
    return this.isFilledCustomerFields();
  }

  public isFilledCustomerFields() {
    var pattern = new RegExp('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}'); 
    if(this.appUser.CanceledMembership){
      return true;
    }
    if (/*this.sendInvoice &&*/ this.appUser.Email!= null && 
        this.appUser.Email!= undefined && 
        this.appUser.Email.toString().trim().length > 0 &&  pattern.test(this.appUser.Email.toString().trim()) && 
        this.dateIsValid(this.appUser.BirthDate?._d) && 
        (this.dateIsValid(this.appUser.Anniversary?._d)|| this.appUser.Anniversary?._d == undefined)) {

          console.log("email is not undefined and pattern and birthDate");
          return true;

        //return this.dateIsValid(this.appUser.BirthDate);
      
    }
    else if(this.appUser.Email == null ||
      this.appUser.Email == undefined ||
      this.appUser.Email.toString().trim().length == 0 ||  !pattern.test(this.appUser.Email.toString().trim())){
      console.log("email is undefined OR pattern");
      this.orderErrors.Email = true;
      return false;

    }
    
    else if(!this.dateIsValid(this.appUser.BirthDate?._d)){
      console.log("date is not valid");
      this.orderErrors.BirthDate = true;
      return false;
    }

    else if(this.appUser.Anniversary != undefined && !this.dateIsValid(this.appUser.Anniversary?._d)){
      console.log("ann is excist and not valid");
      this.orderErrors.Anniversary = true;
      return false;

    }
    else{
      console.log("else????")
    }
  }

  public trimField(value) {
    return value ? value.toString().trim() : value;
  }

  dateIsValid(date) {
    if( date instanceof Date) return true;
    else{
      return false;

    }
  }

  public removeErrorWhileFocus(field) {
    if (this.orderErrors && field && this.orderErrors[field]) {
      this.orderErrors[field] = false;
    }
  }

  private displayCustomerErrorFields() {
    //  this.acceptTermsError = !this.acceptTerms;
      //var pattern = new RegExp('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}');
     //console.log("pattern.test(this.order.Email.toString().trim())",pattern.test(this.order.Email.toString().trim()));
     //console.log("this.sendInvoice",this.sendInvoice);
      //this.orderErrors.FirstName = !this.trimField(this.appUser.FirstName);
     // this.orderErrors.LastName = !this.trimField(this.appUser.LastName);
        this.orderErrors.Email = true;
         //this.orderErrors.Email = !pattern.test(this.order.Email.toString().trim());
    }


  public getLanguage() {
    return this.translationsService.language();
  }

  public trimEmptySpace(text:string) {
    
    return text ? text.trim() : text;
  }


  public close() {
    
if (this.timerId) clearInterval(this.timerId); 
    this.dialogRef.close(); 
  }

  public signIn() {
    console.log("SIGNIN()"); 
    //this.dialogRef.close({signIn: true }); 


    this.dialogRef.close({
      signIn: true,
      bDay: this.appUser.BirthDate._d,
      canceledMembership: this.appUser.CanceledMembership,
      annDay: this.appUser.Anniversary?._d,
      email: this.appUser.Email,
      enablePush : this.appUser.AllowAdvertisement,
      fName: this.appUser.FirstName,
      lName: this.appUser.LastName

    });
    
  }

  private clearErrorFields() {
    this.orderErrors.FirstName = false;
    this.orderErrors.LastName = false;
    this.orderErrors.Email = false;
    this.orderErrors.UserCity = false;
    this.orderErrors.Street = false;
    this.orderErrors.StreetNum = false;
    this.orderErrors.number = false;
    this.orderErrors.cvv = false;
    this.orderErrors.ownerId = false;
    this.orderErrors.expirationYear = false;
    this.orderErrors.expirationMonth = false;
    this.orderErrors.sum =false;
  }

  private initializeGraphics() {
    this.graphics.logo = AppConfig.settings.logo;
    this.graphics.cover = AppConfig.settings.cover;
    this.colors.menuColor = AppConfig.settings.menuColor;
    this.colors.buttonColor = AppConfig.settings.buttonColor;
    this.lang = this.translationsService.language();
  }

  public hidePelecardIframe:boolean = false;
  public pelecardOrderSent: boolean = false;
  public pelecardConfirmationKey:string;
  public displayPelecardIframe:boolean = false;

   public goBackFromPelecardIframe(){
    console.log("goback");
    if (this.timerId) clearInterval(this.timerId); 
    this.timer = -1;
    this.step =2
    
    this.paymentType = ''; 
    
    this.displayPelecardIframe = false;
  }

   payWithPelecardIframe(){
    console.log("payWithPelecardIframe");
    this.showLoader= true;

    this.step++;
   // if (this.order) {
      this.order.Payment = "prepaidCredit";
       
   
      const loginToken = this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.franchiseId);
      if (loginToken) {
        this.signInOutService.verifyToken(loginToken).subscribe((response) => {
          this.paymentService.GetPelecardIframeUrlForBiteCredit(this.order, loginToken, this.configService.franchiseId, this.order.Sum)
                .subscribe((iframeRes) => {
                  if (iframeRes && iframeRes.URL && iframeRes.ConfirmationKey) {
                    this.pelecardIframeUrl =iframeRes.URL;
                    this.pelecardConfirmationKey =iframeRes.ConfirmationKey;
                    this.pelecardIframeUrlSanitized = this.sanitizer.bypassSecurityTrustResourceUrl( this.pelecardIframeUrl);
                    this.displayPelecardIframe = true;
                    this.showLoader= false;

                    setTimeout(() => this.pelecardIframePayment(), 15000);
                  }
                }, () => {
                   this.showLoader= false;
                  this.messageService.displayServerErrorMessage();
                
                });
        
        }, () => {
                   this.showLoader= false;
                   this.messageService.displayServerErrorMessage();
                
                }); 
    } else {
       this.showLoader= false;
       this.messageService.displayServerErrorMessage();
    }
      
      
   // }
  }

  private pelecardIframePayment() {
  this.timer = 60;
  const loginToken = this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN  + "_" + this.franchiseId);
  //this.timerId= setInterval(() => this.checkTransactionStatus(loginToken), 2000);
  this.timerId= setInterval(() => {
    this.timer--;
    if (this.timer % 2 === 0) this.checkPelecardTransactionStatusAndSendOrder(loginToken);   
    if (this.timer == 0) {
      clearInterval(this.timerId);   
      this.step = this.step -1;
      this.showLoader = false;
    }
  }, 2000);
  
}

  public getTimerMsg(){
    var msg:string;
    if (this.lang == 'he'){
      msg = "זמן להשלים את התשלום: " + this.timer + " שניות ";
      return msg;
    } else {
      msg = "You have " + this.timer + "sec. to complete the payment";
       return msg;
    }
  }

   checkPelecardTransactionStatusAndSendOrder(loginToken) {
    console.log("checkPelecardTransactionStatus");
    var p_transactionId = this.pelecardIframeUrl.split("transactionId=")[1];
   // this.order.pelecard_transactionId = p_transactionId;
    localStorage.setItem(window.location.hash, JSON.stringify(this.order));
   
    this.paymentService
              .CheckTransactionStatusBiteCredit( p_transactionId,
                                                  this.franchiseId, 
                                                  loginToken,
                                                  this.order.Sum)
                .subscribe((response) => {
                  if (response && response.Data && response.Data.success) {// && !this.pelecardOrderSent
                    this.pelecardOrderSent = true; // ✅ Prevent future calls
                    this.hidePelecardIframe = true;
                  //  this.showLoader = true;
                    if (this.timerId) {                  
                      clearInterval(this.timerId);     
                                    
                    }
                    if ( response.Data.transaction &&
                         response.Data.transaction.success ) {
                        this.step ++;
                        this.totalCredit = response.Data.totalCredit;
                    }
                    else {
                     // this.messageService.displayServerErrorMessage();
                    }
                  } else {
                    // this.messageService.displayServerErrorMessage();
                  }
                }, () => {
                   
                 
                
                });
    } 



}
