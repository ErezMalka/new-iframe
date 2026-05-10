import { AppStorageService } from '../../app.storage.service';
import { take } from 'rxjs/operators';

import { AfterViewInit, Renderer2, Component, EventEmitter, ElementRef, HostListener, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import { AppConfig } from '../../app.config';
import { OrderAppModel } from '../../models/order/order-app.model';
import { TranslationsService } from '../../shared/translations/translations.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AddressSelectionComponent } from "../home/address-selection/address-selection.component";
import { SelectDateComponent } from "../home/select-date/select-date.component";
import {NewComboComponent} from "../menu/combo/new-combo.component";

//import { MomentDateAdapter} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats } from '@angular/material/core';
//import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDatepicker } from '@angular/material/datepicker';
import { PaymentTypeEnum } from '../../enums/payment-type.enum';
import {ItemComponent} from "../menu/item/item.component";
import { ScratchCouponComponent } from '../menu/scratch-coupon/scratch-coupon.component';
import { BranchFutureDatesAppModel } from '../../models/franchise-branch/branch-future-dates-app.model';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
import { Moment } from 'moment';
import { MetaDataService } from '../../core/services/meta-data.service';
import { CityModel } from '../../models/order/city.model';
import { DeliveryGroupAppModel } from '../../models/order/delivery-group-app.model';
import { BranchAppModel } from '../../models/franchise-branch/branch-app.model';
import { ItemAppModel } from '../../models/menu/item-app.model';
import { MenuService } from '../../core/services/menu.service';
import { DiscountTypeEnum } from '../../enums/discount-type.enum';
import { DiscountModel } from '../../models/discount/discount.model';
import { CibusAppModel } from '../../models/order/cibus-app.model';
import { RoundPricePipe } from '../../shared/pipes/round-price.pipe';
import { OrderPizzaAppAdvancedModel } from '../../models/advanced/order/order-pizza-app-advanced.model';
import { OrderItemAppModel } from '../../models/order/order-item-app.model';
import { PaymentService } from '../../shared/services/payment.service';
import { MeshulamService } from '../../shared/services/meshulam.service';

import { MessagePopupComponent } from '../../shared/components/message-popup/message-popup.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { OnInit } from '@angular/core';
import { DialogSignInComponent } from '../../components/sign-in/popup/dialog-sign-in.component';
import { ScratchCouponService } from '../../core/services/scratch-coupon.service';
import { StorageValueEnum } from '../../enums/advanced/storage-value.enum';
import { SignInOutService } from '../../core/services/sign-in-out.service';
import { ItemAppAdvancedModel } from '../../models/advanced/menu/item-app-advanced.model';
import { GarnishAppAdvancedModel } from '../../models/advanced/menu/garnish-app-advanced.model';
import { CommonFunctionsService } from '../../core/services/common-settings/common-functions.service';
import { ConfigService } from '../../core/services/common-settings/config.service';
import { MessageService } from '../../shared/components/message/message.service';
import { CountryEnum } from '../../enums/advanced/country.enum';
import { LanguageEnum } from '../../enums/advanced/language.enum';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DeliveryConditionComponent } from "./delivery-condition/delivery-condition.component";
import { SizeMobileInitializationComponent } from '../../shared/classes/size-mobile-initialization.component';
import { BrowserIdentificatorService } from '../../core/services/common-settings/browser-identificator.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AdditionalItemsComponent } from '../../components/additional-items/additional-items.component';
// tslint:disable-next-line:no-duplicate-imports
// import {default as _rollupMoment, Moment} from 'moment';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { listLocales } from 'ngx-bootstrap/chronos';
import { Location } from '@angular/common'
import { PizzaComponent } from '../menu/pizza/pizza.component';
import { OrderPizzaToppingAppModel } from '../../models/order/order-pizza-topping-app.model';
import { MeshulamCreatePaymentResponseAppModel } from '../../models/order/meshulam-create-payment-response-app.model';
import { PizzaAppAdvancedModel } from '../../models/advanced/pizza/pizza-app-advanced.model';
import { ItemWithGarnishesComponent } from '../menu/item-with-garnishes/item-with-garnishes.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MatSelectTrigger } from '@angular/material/select';
import { BiteCreditComponent } from '../../shared/components/bite-credit/bite-credit.component';

const moment = /*_rollupMoment || */_moment;
declare var growPayment: any;


// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};



@Component({
  templateUrl: './order-new.component.html',
  styleUrls: ['./order.component.scss'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    /// {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    /// {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    //{
    // provide: DateAdapter,
    // useClass: MomentDateAdapter,
    // deps: [MAT_DATE_LOCALE]
    //},

    // { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ],
})
export class OrderComponent extends SizeMobileInitializationComponent implements OnInit, AfterViewInit, OnDestroy {

  public defaultCategoryColor = '#ffffff';
  startDate = new Date(moment().year(), moment().month())
public displayPickupPoints:boolean = false;

  public sendInvoice:boolean = false;
  public userCouponCode: string;
  public userCouponValid: boolean = false;
  public userCuponDiscount: number;
  public commentsLogicWasApplied: boolean = false;
  public graphics = {
    logo: '',
    cover: '',
  };

  public colors = {
    menuColor: '',
    buttonColor: ''
  };



  public terms: string;
  public privacyPolicy: string;
  public cashSymbol: string;
  public displayCompanyCode: boolean = false;
  public lang: string;
  public country: string;
  public order: OrderAppModel;
  public cities: CityModel[];
  public paymentType: string;

  public branch: BranchAppModel;
  public user: any;
  public discount: DiscountModel;
  public isSignedUser: boolean = false;
  public openAdditionalItemsModalFlag: boolean;
  public isOrderOption: boolean = true;
  public displayCustomer: boolean = true;
  public displayPayment: boolean = false;

  public isLoaded: any = {
    isDiscountLoaded: true,
    isScratchCouponLoaded: true,
    isDeliveryDataLoaded: true,
    isPaymentSettingsLoaded: false,  // for payment settings
    isSignInLoaded: true, // Default value,
    isCreditPaymentLoaded: true,  // default value: payment
    isCashPaymentLoaded: true,  // default value: payment
    isValidationUserLoaded: true,  // default value,
    isFranchiseWithBranchesLoaded: true, // default value
    isPayaPaymentLoaded: true, // default value
    isBranchOpenLoaded: true,
    isTranzilaLoaded: true,
    isUpdateUserDetailsLoaded: true,
    isCashRegisterLoaded: true
  };

  public paymentData: any = {};

  public deliveryGroup: DeliveryGroupAppModel;

  public paymentSettings = {
    Cash: false,
    CreditCard: false,
    Sibus: false
  };

  public minDate: Date;
  public maxDate: Date;
  public minDateStr: string;
  public maxDateStr: string;
  public acceptTerms: boolean;
  public acceptTermsError:boolean;
  public cashRegister: any;
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
  public cibusLeftToPay: number = 0;
  public cibusSplittedPaymentType: string;
  public multiPayers: boolean = false;
  public sumLeftToPay: number;
  public sumPayed:number = 0;
  public payersArray: any[] =[];
  public encriptedPayersArray: any[] =[];
  public tranzilaPayersArray: any[] =[];
  public cibusTenbisPayersArray: any[] =[];
  public cibusPayersArray: any[] =[];
  public tenbisPayersArray: any[] =[];
  public categories : any[] = [];
  public bonusItems: any[] = [];
  @ViewChild('iframe')
  public iframe: ElementRef;
  
  @ViewChild('alertRef') alertRef: ElementRef;

  public errorsCashRegisterMessages = {
    ownerId: {
      notValidId: this.translationsService.translate('ORDER_WRONGID'),
      minMaxlength: this.translationsService.translate('ORDER_MINLEN9')
    },
    number: {
      notValidCreditCard: this.translationsService.translate('ORDER_WRONGCC'),
      minlength: this.translationsService.translate('ORDER_MINLEN8'),
      maxlength: this.translationsService.translate('ORDER_MAXLEN16')
    },
    cvv: {
      minMaxlength: this.translationsService.translate('ORDER_MINLEN3')
    },
    expirationMonth: {},
    expirationYear: {}
  };

  public tranzilaIframe;

  public orderErrors = {
    FirstName: false,
    LastName: false,
    Phone: false,
    Email:false,
    Code:false,
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
    sum:false
  };

  // For scrollbar:
  public disabled = !this.isMobileBrowser() && !this.isMobileMode();
  public shown: 'native' | 'hover' | 'always' = 'native';

  public currentBranch: BranchAppModel;
  locale = 'he';
  private franchiseId: string;
  public selectedCcId:number;
  public addCC:boolean;
  public addCibusCard: boolean;
  public addTenbisCard: boolean;

  public useTranzilaIframe: boolean = false;
  public useMeshulamIframe: boolean = false;
  public usePelecardIframe: boolean = false;
  private meshulamProcessId:string;
  private meshulamProcessToken:string;
  public meshulamPaymentURL:string;
  public displayMeshulamIframe:boolean = false;

//public openItemPopup: EventEmitter<any> = new EventEmitter<any>();
bsModalRef: BsModalRef;



  public deliveryNotes : string = "";
  public date = new Date();//FormControl(Date());
  public years : string[] = [];
  public selectedCibus: any;
  public selectedTenbis: any;
  public cibusEnd: any;
  public tenbisEnd: any;
  public tranzilaTerminal: string;
  public messagesFromBranch: any;
  public count: any;

  public cvvForSavedCredit: any;
  public displayPaymentOptions: boolean = false;
  public displaySelectedPayment: boolean = false;
  public displayCashScreen: boolean = false;
  public userPoints: number;
  public cancelVerification: boolean = false;
  notAllowedBenefitsAmount: boolean;
  private timerId;
  private timerMinute;
  public timer: number = -1;
  public tranzilaIframeUrlSanitized: SafeResourceUrl;
  public pelecardIframeUrlSanitized: SafeResourceUrl;
  public pelecardIframeUrl: string;
  public displayTranzilaIframeUrl: boolean = false;
  public forceEmail:boolean = false;
  public displayTranzilaSplitPaymentIframeUrl: boolean = false;
 public couponCodes: any[];
 pelecardPayersArray: any[] = []
 displayPelecardSplitPaymentIframeUrl: boolean = false
 
  constructor(private orderService: OrderService,
    private localeService: BsLocaleService,
    private metadataService: MetaDataService,
    private translationsService: TranslationsService,
    private modalService: BsModalService,
    private renderer: Renderer2,
    private menuService: MenuService,
    private roundPricePipe: RoundPricePipe,
    private paymentService: PaymentService,
    private meshulamService:MeshulamService,
    private router: Router,
    private route: ActivatedRoute,
    private appStorageService: AppStorageService,
    private matDialog: MatDialog,
    private scratchCouponService: ScratchCouponService,
    private commonFunctionsService: CommonFunctionsService,
    private signInOutService: SignInOutService,
    //private adapter: DateAdapter<any>,
    private configService: ConfigService,
    private messageService: MessageService,
    private sanitizer: DomSanitizer,    
    protected browserIdentificatorService: BrowserIdentificatorService,
    protected deviceService: DeviceDetectorService,
    private ngZone: NgZone) {
    super(browserIdentificatorService);
  }

  @HostListener('window:payment.success', ['$event']) 
    onPaymentSuccess(event): void {
      this.MeshulamPayment(event.detail.payment_method, 
                           event.detail.confirmation_number,
                           event.detail.number_of_payments);
        
    }

    @HostListener('window:wallet.changeState', ['$event']) 
      onWalletStateChange(event): void {
      this.showLoader = false;
        
    }


  ngOnInit(): void {
    console.log("ngOnInit");
        this.displayPickupPoints=AppConfig.configSettings.pickupPoints;
    
   this.useMeshulamIframe = this.configService.useMeshulamIframe;
    

    for (let index = 0; index < 11; index++) {
      this.years[index] = (this.date.getFullYear()+index).toString();
      //console.log("this.years[index]",this.years[index])

    }
    this.useTranzilaIframe = this.configService.useTranzilaIframe;// false;
    if (this.appStorageService.franchise.TranzilaUrl == undefined ||
        this.appStorageService.franchise.TranzilaUrl == "undefined" ||
        this.appStorageService.franchise.TranzilaUrl == null ||
        this.appStorageService.franchise.TranzilaUrl == "")
        this.useTranzilaIframe = false;
    
    this.addCC = false;
    this.terms = this.appStorageService.Terms || "";
    this.privacyPolicy = this.appStorageService.privacyPolicy || "";
    //this.sumLeftToPay
    this.sendInvoice = false; //AppConfig.configSettings.sendInvoice;
    this.forceEmail = AppConfig.configSettings.forceEmail;
    this.displayCompanyCode = AppConfig.configSettings.displayCompanyCode;
    this.acceptTerms = false;
    this.acceptTermsError = false;
    this.localeService.use(this.locale);
    // Graphics
    this.initializeGraphics();
    // Signing
    this.checkSigning();
    // Order
    this.initializeOrder();
    
    // Payment options: cash / card
   // this.checkPaymentOptions();
    // Tranzila:
    this.isPaymentByTranzila = false;
    // DateTimePicker:
    // this.initializeDateExpirationForCard();
    this.initializeSize();
    this.prepareGarnishesForDisplay();
    this.openAdditionalItemsModalFlag = true;

    this.franchiseId = this.route.snapshot.paramMap.get('franchiseId');

    this.categories = this.appStorageService.categories || [];

    this.checkForCombo();

    this.flicker();
    this.notAllowedBenefitsAmount = false;
    if(AppConfig.configSettings.cancelPhoneVerification){
      this.cancelVerification = AppConfig.configSettings.cancelPhoneVerification;
    }

  //  window.addEventListener('message', this.handlePostMessage.bind(this), false);

 
  }

  handlePostMessage(event: MessageEvent) {
    // Check the origin of the post message to ensure it's from the expected source
    // Replace 'expected-origin.com' with the actual origin URL
   // if (event.origin !== 'https://expected-origin.com') {
    //  return;
   // }
  
    // Access the data sent with the post message
    const postData = event.data;
  
    // Process the post message data and perform the necessary actions
    // ...
  }

  configureGrowSdk() {
    console.log("configureGrowSdk");

    let config = {
    environment: AppConfig.config.meshulamEnviroment,
    version: 1,
        events: {
            onSuccess: (response) => {
              /*
                {
                  "status": 1,
                  "data": {
                    "payment_sum": "1",
                    "full_name": "example example",
                    "payment_method": "credit",
                    "number_of_payments": 1,
                    "confirmation_number": "12345678"
                  }
                }                  
              */ 
              var event = new CustomEvent("payment.success", 
                {
                  detail: response.data,
                  bubbles: true,
                  cancelable: true
                }
              );    
              window.dispatchEvent(event); 
              
              /*this.MeshulamPayment(response.payment_method, 
                                   response.confirmation_number,
                                   response.number_of_payments)*/
            },
            onFailure: (response) => {
              /*
                {
                  "status": 0,
                  "message": "תשלום נכשל"
                }
              */ 
               // this.messageService.displayErrorMessage(response.message);
            },
            onError: (response) => {              
              //  this.messageService.displayErrorMessage(response.message);
            },
            onWalletChange: (state) => {
              var event = new CustomEvent("wallet.changeState", 
                {
                  detail: state,
                  bubbles: true,
                  cancelable: true
                }
              );    
              window.dispatchEvent(event);
            },
        }
    };
    growPayment.init(config);
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
  public goBackFromTranzilaIframe(){
    console.log("goback");
    if (this.timerId) clearInterval(this.timerId); 
    this.timer = -1;
    this.displaySelectedPayment = false; 
    this.displayPaymentOptions = true; 
    this.paymentType = ''; 
    this.multiPayers = false;
    this.displayPayment = true;
    this.displayTranzilaIframeUrl = false;
    this.displayTranzilaSplitPaymentIframeUrl = false;
    this.displayPelecardIframe = false;
  }

  public goBackFromTranzilaIframeDesktop(){
    console.log("goback");
    if (this.timerId) clearInterval(this.timerId); 
    this.timer = -1;
    this.displayPaymentOptions = false; 
    this.displayCustomer = true; 
    this.displayPayment = false;
    this.displayTranzilaIframeUrl = false;
    this.displayTranzilaSplitPaymentIframeUrl = false;
    this.addCC = false;
  }

  public selectPaymentTypeDesktop(paymentType){
 
    if (this.timerId) {
      console.log("clear timerId")
     // clearInterval(this.timerId); 
    } 
   // this.timer = -1;
    //this.displayPaymentOptions = false; 
   // this.displayCustomer = true; 
   // this.displayPayment = false;
    this.displayTranzilaIframeUrl = false;
    this.displayTranzilaSplitPaymentIframeUrl = false;
    this.displayPelecardIframe = false
    this.addCC = false;
    this.multiPayers = false; 
    this.clearErrorFields();
    if (paymentType == 'sibus') this.paymentType = 'sibus';
    else if (paymentType == 'tenbis') this.paymentType = 'tenbis';
    else if (paymentType == 'cash') this.paymentType = 'cash';
    else if (paymentType == 'biteCredit') this.paymentType = 'biteCredit';
  }


 private tranzilaIframePayment() {
  this.timer = 60;
  const loginToken = this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN  + "_" + this.franchiseId);
  //this.timerId= setInterval(() => this.checkTransactionStatus(loginToken), 2000);
  this.timerId= setInterval(() => {
    this.timer--;
    if (this.timer % 2 === 0) this.checkTransactionStatus(loginToken);   
    if (this.timer == 0) {
      clearInterval(this.timerId);   
      this.displayTranzilaIframeUrl = false;
      this.addCC = false;
      if (this.isMobileMode()){
        this.displaySelectedPayment = false; 
        this.displayPaymentOptions = true; 
       // this.displayPayment = true;
        this.paymentType = ''; 
        this.multiPayers = false;
      } else {
        this.displayPaymentOptions = false; 
        this.displayCustomer = true; 
        this.displayPayment = false;
       
      }
     
    }
  }, 2000);
  
}

private pelecardIframePayment(order) {
  this.timer = 60;
  const loginToken = this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN  + "_" + this.franchiseId);
  //this.timerId= setInterval(() => this.checkTransactionStatus(loginToken), 2000);
  this.timerId= setInterval(() => {
    this.timer--;
    if (this.timer % 2 === 0) this.checkPelecardTransactionStatusAndSendOrder(order,loginToken);   
    if (this.timer == 0) {
      clearInterval(this.timerId);   
      this.displayPelecardIframe = false;
      this.addCC = false;
      this.showLoader = false;
      if (this.isMobileMode()){
        this.displaySelectedPayment = false; 
        this.displayPaymentOptions = true; 
       // this.displayPayment = true;
        this.paymentType = ''; 
        this.multiPayers = false;
      } else {
        this.displayPaymentOptions = false; 
        this.displayCustomer = true; 
        this.displayPayment = false;
       
      }
     
    }
  }, 2000);
  
}

private tranzilaIframeSplitPayment(sum) {
  this.timer = 60;
  const loginToken = this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.franchiseId);
  //this.timerId= setInterval(() => this.checkTransactionStatus(loginToken), 2000);
  this.timerId= setInterval(() => {
    this.timer--;
    if (this.timer % 2 === 0) this.tranzilaIframeSplitPaymentCheckTransaction(loginToken, sum);   
    if (this.timer == 0) {
      clearInterval(this.timerId);   
      this.displayTranzilaSplitPaymentIframeUrl = false; 
      //this.addCC = false;
      if ( this.tranzilaPayersArray.length == 0){
        if (this.isMobileMode()){
          this.displaySelectedPayment = false; 
          this.displayPaymentOptions = true; 
         // this.displayPayment = true;
          this.paymentType = ''; 
          this.multiPayers = false;
        } else {
          this.displayPaymentOptions = false; 
          this.displayCustomer = true; 
          this.displayPayment = false;
         
        }
      }
     
     
    }
  }, 1000);
  
}


checkTransactionStatus(loginToken) {
  console.log("checkTransactionStatus");
 
    this.paymentService
            .CheckTranzilaTransactionStatus(this.franchiseId, 
                                            loginToken, 
                                            this.resultSum(this.order.Sum), this.order.SaveCredit)
              .subscribe((response) => {
                if (response && response.Data && response.Data.success) {
                  if (this.timerId) {                  
                    clearInterval(this.timerId);     
                                  
                  }
                  if (response.Data.transaction && response.Data.transaction.success) {
                    localStorage.removeItem(window.location.hash);
                    this.TranzilaIframeSendOrder(response.Data.transaction.ConfirmationCode)
                  }
                }
              }, () => {
                 
                //this.messageService.displayServerErrorMessage();
              
              });
  } 
public hidePelecardIframe:boolean = false;
public pelecardOrderSent: boolean = false;

  checkPelecardTransactionStatus(loginToken) {
    console.log("checkPelecardTransactionStatus");
   var p_transactionId = this.pelecardIframeUrl.split("transactionId=")[1];
   this.order.pelecard_transactionId = p_transactionId;
   localStorage.setItem(window.location.hash, JSON.stringify(this.order));
      this.paymentService
              .CheckPelecardTransactionStatus( p_transactionId, this.franchiseId, 
                                              loginToken, 
                                              this.resultSum(this.order.Sum))
                .subscribe((response) => {
                  if (response && response.Data && response.Data.success && !this.pelecardOrderSent) {
                    this.pelecardOrderSent = true; // ✅ Prevent future calls
                    this.hidePelecardIframe = true;
                    this.showLoader = true;
                    if (this.timerId) {                  
                      clearInterval(this.timerId);     
                                    
                    }
                    if (response.Data.transaction && response.Data.transaction.success) {
                      localStorage.removeItem(window.location.hash);
                      this.PelecardIframeSendOrder(response.Data.transaction.DebitApproveNumber, 
                                                   response.Data.transaction.TransactionId)
                    } else {
                      this.paymentCallBack({ success:false,
                        paid:true,
                        message:response.Data.transaction.ErrorMessage});
                    }
                  }
                }, () => {
                   
                  //this.messageService.displayServerErrorMessage();
                
                });
    } 

  checkPelecardTransactionStatusAndSendOrder(order, loginToken) {
    console.log("checkPelecardTransactionStatus");
    var p_transactionId = this.pelecardIframeUrl.split("transactionId=")[1];
    this.order.pelecard_transactionId = p_transactionId;
    localStorage.setItem(window.location.hash, JSON.stringify(this.order));
    /**
     *   this.paymentService
              .CheckTransactionStatusAndSendOrder(order, 
                                                  this.franchiseId, 
                                                  p_transactionId, 
                                                  this.resultSum(this.order.Sum),
                                                   loginToken)
     */
    this.paymentService
              .CheckPelecardTransactionStatusNew( p_transactionId,
                                                  this.franchiseId, 
                                                  loginToken,
                                                  this.resultSum(this.order.Sum),
                                                   )
                .subscribe((response) => {
                  if (response && response.Data && response.Data.success) {// && !this.pelecardOrderSent
                    this.pelecardOrderSent = true; // ✅ Prevent future calls
                    this.hidePelecardIframe = true;
                  //  this.showLoader = true;
                    if (this.timerId) {                  
                      clearInterval(this.timerId);     
                                    
                    }
                    if (response.Data.transaction && !response.Data.transaction.success) {
                      
                      this.pelecardPaymentCallBack({Data:{ success:false,
                        paid:true,
                        message:response.Data.transaction.ErrorMessage}});
                    } else {
                      this.pelecardPaymentCallBack(response);
                    }
                  }
                }, () => {
                   
                  //this.messageService.displayServerErrorMessage();
                
                });
    } 

    checkPelecardTransactionStatusAfterFallback(loginToken, p_transactionId, paymentMethod) {
      console.log("checkPelecardTransactionStatusAfterFallback");
  //   var p_transactionId = this.pelecardIframeUrl.split("transactionId=")[1];
   //  this.order.pelecard_transactionId = p_transactionId;
  
   this.paymentService
                .CheckPelecardTransactionStatus( p_transactionId, this.franchiseId, 
                                                loginToken, 
                                                this.resultSum(this.order.Sum))
                  .subscribe((response) => {
                    if (response && response.Data && response.Data.success && !this.pelecardOrderSent) {
                      this.pelecardOrderSent = true; // ✅ Prevent future calls
                      this.hidePelecardIframe = true;
                      this.showLoader = true;
                      if (this.timerId) {                  
                        clearInterval(this.timerId);     
                                      
                      }
                      if (response.Data.transaction && response.Data.transaction.success) {
                        localStorage.removeItem(window.location.hash);
                        this.PelecardIframeSendOrder(response.Data.transaction.DebitApproveNumber, 
                                                     response.Data.transaction.TransactionId)
                      } else {
                        this.paymentCallBack({ success:false,
                          paid:true,
                          message:response.Data.transaction.ErrorMessage});
                      }
                    } else { //get new iframe link
                      this.showLoader = false;
                      this.order.pelecard_transactionId ="";
                      localStorage.setItem(window.location.hash, JSON.stringify(this.order));
                      if (this.isMobileMode()){
                        this.continueToSelectedPaymentMethod(paymentMethod);
                      } else if (paymentMethod == 'credit'){
                        this.selectCreditPaymentMethod();
                      }
                        
                    }
                  }, () => {
                     
                    //this.messageService.displayServerErrorMessage();
                  
                  });
      } 

      
    checkPelecardTransactionStatusAfterFallbackAndSendOrder(loginToken, p_transactionId, paymentMethod) {
      console.log("checkPelecardTransactionStatusAfterFallback");
  //   var p_transactionId = this.pelecardIframeUrl.split("transactionId=")[1];
   //  this.order.pelecard_transactionId = p_transactionId;
 /* const order = this.commonFunctionsService.deepCopy(this.order);
      if (this.isAvailableScratchCoupon()) {
        const prepareForOrderItem =
          this.prepareItemForOrder(this.scratchCoupon.CurrentItem, true, this.scratchCoupon);
        order.OrderItems.push(prepareForOrderItem);
      }
      this.paymentService
              .CheckTransactionStatusAndSendOrder(this.prepareOrderForServer(order), 
                                                  this.franchiseId, 
                                                  p_transactionId, 
                                                  this.resultSum(this.order.Sum),
                                                   loginToken)*/
    this.paymentService
              .CheckPelecardTransactionStatusNew(p_transactionId,
                                                  this.franchiseId, 
                                                  loginToken, 
                                                  this.resultSum(this.order.Sum))
                .subscribe((response) => {
                  if (response && response.Data && response.Data.success) {// && !this.pelecardOrderSent
                    this.pelecardOrderSent = true; // ✅ Prevent future calls
                    this.hidePelecardIframe = true;
                   // this.showLoader = true;
                    if (this.timerId) {                  
                      clearInterval(this.timerId);     
                                    
                    }
                    if (response.Data.transaction && !response.Data.transaction.success) {
                     // localStorage.removeItem(window.location.hash);
                     // this.PelecardIframeSendOrder(response.Data.transaction.DebitApproveNumber, 
                      //                             response.Data.transaction.TransactionId)
                   // } else {
                      this.pelecardPaymentCallBack({Data:{ success:false,
                        paid:true,
                        message:response.Data.transaction.ErrorMessage}});
                    } else {
                      this.pelecardPaymentCallBack(response);
                    }
                  }
                }, () => {
                   
                  //this.messageService.displayServerErrorMessage();
                
                });
      } 

tranzilaIframeSplitPaymentCheckTransaction(loginToken, sum) {
    this.paymentService
      .CheckTranzilaTransactionStatus(this.franchiseId, 
                                    loginToken, 
                                    sum, false)
      .subscribe((response) => {
      
        if (response && response.Data && response.Data.success) {
          this.displayTranzilaSplitPaymentIframeUrl = false;
         
          if (this.timerId) {                  
            clearInterval(this.timerId);                   
          }
          if (response.Data.transaction && response.Data.transaction.success) {

            //this.ccWithToken.token = res.Data
            this.sumPayed += Number(this.ccWithToken.sum);
            this.tranzilaPayersArray.push(response.Data.transaction);
             
            this.ccWithToken.sum =  (Math.round(this.resultSum(this.order.Sum)  * 100) / 100 ) - this.sumPayed;
           // localStorage.removeItem(window.location.hash);
           // this.TranzilaIframeSendOrder(response.Data.transaction.ConfirmationCode)
          }  else {
            this.isLoaded.isCreditPaymentLoaded = true;
         
            this.messageService.displayBadCCMessage();
            this.clearErrorFields();
          }
        }
      }, () => {
        this.isLoaded.isCreditPaymentLoaded = true;
         
        this.messageService.displayBadCCMessage();
        this.clearErrorFields();
      
      });
     
    
  }






 


  public isMobileMode(): boolean {
    return this.deviceService.isMobile() || this.deviceService.isTablet();
  }

  public displayMyMessages(){
    this.messagesFromBranch = this.currentBranch.Messages;
    this.messagesFromBranch.sort(function(a, b) {
      return a.Order - b.Order;
    });

    //var count = 0;

    this.messagesFromBranch.forEach(message => {

      if (message.DisplayInEndOfOrder) {

        this.displayPopupMessageEndOfOrder(message, message.Message, message.ImageUrl, (result) => {
          if (!result.isDigitalMenu)
            this.count++;

          if (this.count == this.messagesFromBranch.length) {

            this.appStorageService.isFirstPopUp = false;

            this.checkSigning((result) => {
              console.log("continue here 3");

              if (result) {
                console.log("continue here 4");
                this.franchiseId = this.route.snapshot.paramMap.get('franchiseId');

              }

            });
          }
        });

      }

      else{
      }

    
    });



    
    console.log("first popup")
    //this.flag=false;

    console.log("continue here")
    // this.initializeSize();
    //this.loadMenu();

  }
  public displayPopupMessageEndOfOrder(message, messageText, imgIcon,  callback?) {
    if (AppConfig.configSettings.displayPopup == true) {
      let myMessageText = messageText;
      let header = this.translationsService.translate('IMPORTANT_MESSAGE');
      let icon = imgIcon ; //"../../../assets/images/items/important-message.svg"
      //const message = this.currentBranch;
      const matDialogRef = this.matDialog.open(MessagePopupComponent, {
        data: {
          header,
          icon,
          myMessageText,
          message,
          withoutTimeout: true
        },
        minWidth: '345px',
        disableClose: true,
        panelClass: 'custom-mat-dialog-popup'
      });

      matDialogRef.afterClosed().subscribe((result) => {
        if (callback) {
          //this.isFirst=false;
          callback(result);

        }
      });

    }
    //else this.flag = false;
  }
  public checkIfDate(){
    if(this.order.FutureDateTime instanceof Date){
      return true;
    }
    else return false;
  }

  public flicker() {
    //document.getElementById("flicker2").classList.add("animate-flicker");
    const myElement = document.getElementById("flicker2");
    const elemsByClass = document.getElementsByClassName("btn-continue-payment-flicker");
    //console.log("flicker()- elemByClass", elemsByClass.item());
    //const elemSetted = elemsByClass.setAttribute("style","display:none");

    //setTimeout(() => { document.getElementById("flicker2").classList.remove("animate-flicker"); }, 7000);
  }

  /*public checkForCombo(){


    const myorderitems = this.commonFunctionsService.deepCopy(this.order.OrderItems);


    this.categories = this.appStorageService.categories || [];


    this.categories.forEach(category => {
      category.Items.forEach(originalItem => {
        this.order.OrderItems.forEach(orderItem => {
          if(originalItem.Id == orderItem.ItemId ){
            orderItem.Price = originalItem.Price;
          }
        });
      });
    });




    let itemsInCombos = [];
    this.order.OrderItems.forEach(orderItem => {
      if(orderItem.IsCombo){
        if(orderItem.Amount>1){
          for (let i = 0; i < orderItem.Amount; i++) {
            const newItem = new OrderItemAppModel();
            newItem.Amount = 1;
            newItem.CategoryId = orderItem.CategoryId;
            newItem.Comment = orderItem.Comment;
            newItem.Garnishes = orderItem.Garnishes;
            newItem.GarnishesListDisplay = orderItem.GarnishesListDisplay;
            newItem.ImageUrl = orderItem.ImageUrl;
            newItem.IsCombo = orderItem.IsCombo;
            newItem.IsScratchCoupon = orderItem.IsScratchCoupon;
            newItem.IsUpgrade = orderItem.IsUpgrade;
            newItem.Item = orderItem.Item;
            newItem.ItemId =  orderItem.ItemId;
            newItem.Name = orderItem.Name;
            newItem.Price = orderItem.Price;
            newItem.ScratchCouponId = orderItem.ScratchCouponId;
            newItem.SpecialRequests = orderItem.SpecialRequests;
            itemsInCombos.push(newItem);
          }
        }else itemsInCombos.push(orderItem);
      }
    });

    const sortedItemsCombos = itemsInCombos.sort(
      (i1, i2) =>
      +i2.CategoryId - +i1.CategoryId ||
      +i2.Price - +i1.Price
    )
    const mySorted = this.commonFunctionsService.deepCopy(sortedItemsCombos);
    for (let index = 1; index < sortedItemsCombos.length; index += 2) {
      if (sortedItemsCombos[index].CategoryId != sortedItemsCombos[index - 1].CategoryId  //masha 6.9.22
        && sortedItemsCombos[index].CategoryId == sortedItemsCombos[index + 1]?.CategoryId) {
        sortedItemsCombos[index + 1].Price = 0;
      }
      else sortedItemsCombos[index].Price = 0;
    }
    const mySorted2 = this.commonFunctionsService.deepCopy(sortedItemsCombos);

    this.order.OrderItems.forEach(orderItem => {
      if(orderItem.Amount>1 && orderItem.IsCombo){
        this.order.OrderItems.splice(this.order.OrderItems.indexOf(orderItem), 1);
        for (let i = 0; i < orderItem.Amount; i++) {
          this.order.OrderItems.push(sortedItemsCombos[i]);
        }
      }
      
    });

    const mySorted3 = this.commonFunctionsService.deepCopy( this.order.OrderItems);
  }*/

  public checkForCombo(){
   // const myorderitems = this.commonFunctionsService.deepCopy(this.order.OrderItems);
   // console.log("myorderitems", myorderitems);

    //this.categories = this.appStorageService.categories || [];



    this.categories.forEach(category => {
      category.Items.forEach(originalItem => {
        this.order.OrderItems.forEach(orderItem => {
          if(originalItem.Id == orderItem.Item.Id && !orderItem.IsItemsGroupItemKeptPrice){
            orderItem.Price = originalItem.Price;
          }
        });
      });
    });




    let itemsInCombos = [];
    this.order.OrderItems.forEach(orderItem => {
      if (orderItem.IsCombo) {
        if (orderItem.Amount > 1) {
          for (let i = 0; i < orderItem.Amount; i++) {
            const newItem = this.commonFunctionsService.deepCopy(orderItem);
            newItem.Amount = 1
            itemsInCombos.push(newItem);
          }
        } else{
           const newItem = this.commonFunctionsService.deepCopy(orderItem);
           itemsInCombos.push(newItem);
        }
      }
    });

    itemsInCombos = itemsInCombos.filter(item => (item.CategoryId));




    const sortedItemsCombos = itemsInCombos.sort(
      (i1, i2) =>
        +i2.Item.CategoryId - +i1.Item.CategoryId ||
        +i2.Item.Price - +i1.Item.Price
    )
    const mySorted = this.commonFunctionsService.deepCopy(sortedItemsCombos);


    for (let index = 0; index < sortedItemsCombos.length; index ++) {

      if(sortedItemsCombos[index].CategoryId == sortedItemsCombos[index+1]?.CategoryId
        && sortedItemsCombos[index]?.Price == 0){

      }

      else if (sortedItemsCombos[index].CategoryId == sortedItemsCombos[index + 1]?.CategoryId
        && sortedItemsCombos[index]?.Price > 0  //masha 6.9.22
      ) {
        sortedItemsCombos[index+1].Price = 0;
      }

      else{
      }
    

    }

    //const mySorted2 = this.commonFunctionsService.deepCopy(sortedItemsCombos);
    //console.log("mySorted2 - with right price", mySorted2);


    const myselectedItems = this.commonFunctionsService.deepCopy(this.order.OrderItems);

    this.order.OrderItems = this.order.OrderItems.filter(item => !(item.IsCombo));

    const mySorted4 = this.commonFunctionsService.deepCopy(this.order.OrderItems);

    sortedItemsCombos.forEach(itemWithRightPrice => {
      this.order.OrderItems.push(itemWithRightPrice);
    });
    this.orderService.recalculateSum();
    //const mySorted3 = this.commonFunctionsService.deepCopy(this.order.OrderItems);
    //console.log("mySorted3- after push right price", mySorted3);
  }

  public removeCard(cc){
    this.order.CCTokens.forEach(savedcc => {
      if(savedcc.Id == cc.Id){
        this.order.CCTokens.splice(this.order.CCTokens.indexOf(savedcc), 1);
      }
      
    });
  }

  public removeCombo(item) {
    // display warning msg
    let header = this.translationsService.translate('ERROR');
        let icon = "../../../assets/images/items/important-message.svg";
    if (AppConfig.configSettings.minAmountForBonus) {
     const msg = this.translationsService.translate('ORDER_BONUS_WARNING')
           + ' ' +  this.translationsService.translate('COMMON_CASH')
           +  AppConfig.configSettings.minAmountForBonus;
     const matDialogRef = this.matDialog.open(MessagePopupComponent, {
       data: {
         header,
         icon,
               message: msg,
               withoutTimeout: true
             },
       minWidth: '400px',
       disableClose: true,
       panelClass: 'custom-mat-dialog-popup'
     });
     matDialogRef.afterClosed().subscribe((result) => {});
   } 
  
    this.order.OrderCombos.splice(this.order.OrderCombos.indexOf(item), 1);
   
    this.orderService.recalculateSum();
    this.checkRemoveBonusItems();
   
  }

  

  public myFunction(itemOrderCombo){
    itemOrderCombo.Pizzas.forEach(pizza => {
      
    });

  }

  checkSelectedToppings(pizza){
    //console.log("pizza",pizza);
    //console.log("pizza?.FullPizza?.SelectedToppings?.length",pizza.FullPizza.SelectedToppings.length);
    if (pizza.FullPizza!= undefined && 
      pizza.FullPizza.SelectedToppings!=undefined &&
      pizza.FullPizza.SelectedToppings.length > 0) return true;
    return false;
  }
  //pizza?.FullPizza?.SelectedToppings?.length > 0 

  public loadSnackBar() {
    document.getElementById("snackbar").classList.add("show");    
    setTimeout(() => {
     document.getElementById("snackbar").classList.remove("show");    
    }, 3000);
   /* const message = this.translationService.translate('MESSAGE_SUCCESS_ADD_TO_CART');
    const matDialogRef = this.matDialog.open(MessagePopupComponent, {
      data: {
        message
      },
      minWidth: '400px',
      disableClose: true,
      panelClass: 'custom-mat-dialog'
    });
    */
  }

  openSnackBar() {
    let message = "Cuopon cod is right!"
    //this._snackBar.open(message);
    //setTimeout(() => {this._snackBar.dismiss}, 3000);
  }

  private prepareGarnishesForDisplay() {
    if (this.order.OrderItems) {
      this.order.OrderItems.forEach((item) => {
        item.GarnishesListDisplay = this.getGarnishes(item);
        item.GarnishesStringDisplay = this.getGranishesWithDevider(item);
      });
    }
    if (this.scratchCoupon && this.scratchCoupon.CurrentItem) {
      this.scratchCoupon.CurrentItem.GarnishesListDisplay = this.getGarnishes(this.scratchCoupon.CurrentItem);
      this.scratchCoupon.CurrentItem.GarnishesStringDisplay = this.getGranishesWithDevider(this.scratchCoupon.CurrentItem);
    }
  }

  ngOnDestroy() {

  }

  private scrollItems = (event: any): void => {
    const number = event.srcElement.scrollTop;
  }

  public restrictKeysExceptDigitsAndPlus(event, dontIncludePlus) {
    this.commonFunctionsService.restrictKeysExceptDigitsAndPlus(event, !!dontIncludePlus);
  }
 public itemsOutOfStock: string[];
  public continuePayment() {
   var outOfStockItemsCounter = 0;
    console.log("continuePayment()");
    if (this.currentBranch.UseInventory) {
      this.paymentService.CheckItemsInventory(this.order).subscribe((response) => {
        if ( response.Data.outOfStockItems) {
          var itemsOfOrderStock =  this.commonFunctionsService.deepCopy(response.Data.outOfStockItems);
          var itemsOfOrderStock_ = this.commonFunctionsService.deepCopy(response.Data.outOfStockItems);
          itemsOfOrderStock.forEach((item) => {
           this.order.OrderItems.forEach((orderItem) => {
              if (orderItem.CatalogNumber == item.CatalogNumber) {
                if (item.Amount < orderItem.Amount) {
                  orderItem.outOfStock = true;
                  outOfStockItemsCounter ++
                }
                item.Amount =  item.amount - orderItem.Amount ;
              }
              if (orderItem.Items != null && orderItem.Items != undefined){
                orderItem.Items.forEach((subItem) => {
                  if (subItem.CatalogNumber == item.CatalogNumber) {
                    if (item.Amount < orderItem.Amount) {
                      subItem.outOfStock = true;
                      outOfStockItemsCounter ++
                    }
                    item.Amount =  item.amount - subItem.Amount ;
                  }
                });
              }
            });
            
          });
          itemsOfOrderStock_.forEach((item) => {
             
             this.appStorageService.categories.forEach((cat) => {
               cat.Items.forEach((i) => {
                 if (i.CatalogNumber == item.CatalogNumber) i.Quantity =  item.Amount;
                 if (i.ItemGroups != null && i.ItemGroups != undefined){
                  i.ItemGroups.forEach((ig) => {
                     ig.GroupItems.forEach((gItem) => {
                     if (gItem.CatalogNumber == item.CatalogNumber) gItem.Quantity =  item.Amount;
                    });
                  });
                 }
               });
             });
           });
           if (outOfStockItemsCounter == 0) {
            this.displayMyMessages();
          if (this.checkMinimumForClubBenefits() && this.checkAmountBenefitsItems()) {
    
            this.order.OrderItems.forEach(item => {
              if(item.IsAnnBenefitItem){
                this.user.UsedAnniversaryVoucher = true;
              }
              else if(item.IsBDayBenefitItem){
                this.user.UsedBirthdayVoucher = true;
                console.log(" this.user.UsedBirthdayVoucher", this.user.UsedBirthdayVoucher)
              }
              else if(item.IsJoinBenefitItem){
                this.user.UsedJoinVoucher = true;
              }
              if (item.SpecialRequests == undefined || item.SpecialRequests == "undefined" || item.SpecialRequests == null) {
                item.SpecialRequests = "";
              }
              var requests = item.SpecialRequests;
              if (item.ItemName == undefined || item.ItemName == "undefined" || item.ItemName == null) {
                item.ItemName = "";
              }
              item.SpecialRequests = item.ItemName + '\n' + requests;
            });
      
            this.order.OrderCombos.forEach(combo => {
               combo.Items.forEach(item => {
                if (item.SpecialRequests == undefined || item.SpecialRequests == "undefined" || item.SpecialRequests == null) {
                  item.SpecialRequests = "";          
                }
                var requests = item.SpecialRequests;
                if (combo.ItemName == undefined || combo.ItemName == "undefined" || combo.ItemName == null) {
                  //console.log("combo.ItemName",combo.ItemName);
                  combo.ItemName = "";
                }
                item.SpecialRequests = combo.ItemName + " " + requests;
               
              });
      
              combo.Pizzas.forEach(pizza => {
                if (pizza.SpecialRequests == undefined || pizza.SpecialRequests == "undefined" || pizza.SpecialRequests == null) {
                  pizza.SpecialRequests = "";
                }
                var requests = pizza.SpecialRequests;
                if (combo.ItemName == undefined || combo.ItemName == "undefined" || combo.ItemName == null) {
                  combo.ItemName = "";
                }
                pizza.SpecialRequests = combo.ItemName + '\n' + requests;
              });
      
      
      
            });
      
            this.order.OrderPizzas.forEach(pizza => {
              console.log("from payment - pizza", pizza);
              console.log("from payment - pizza", pizza.SpecialRequests);
              if (pizza.SpecialRequests == undefined || pizza.SpecialRequests == "undefined" || pizza.SpecialRequests == "undefined " || pizza.SpecialRequests == null) {
                pizza.SpecialRequests = "";
              }
              if (pizza.ItemName == undefined || pizza.ItemName == "undefined" || pizza.ItemName == null) {
                pizza.ItemName = "";
              }
      
              pizza.SpecialRequests = pizza.ItemName + '\n' + pizza.SpecialRequests;
      
              console.log("from payment - pizza", pizza.SpecialRequests);
            });
      
            this.isOrderOption = false;
            this.displayCustomer = true;
            
            if (this.order && this.order.IsDelivery) {
              if (this.deliveryGroup &&
                this.deliveryGroup.MinSumForDelivery > this.resultSumWithoutDelivery(this.order.Sum)) {
                this.displayDeliveryConditionDialog();
              }
            }
            
          }
          else {
            console.log("NOT ENOUGH FOR CONTINUE WITH BENEFITS");
            this.displayWarningMessageForClubBenefits();
          }
           }
        } else {
          
        }
      },(error) => {
        
      });
    } else {
      this.displayMyMessages();
      if (this.checkMinimumForClubBenefits() && this.checkAmountBenefitsItems()) {

        this.order.OrderItems.forEach(item => {
          if(item.IsAnnBenefitItem){
            this.user.UsedAnniversaryVoucher = true;
          }
          else if(item.IsBDayBenefitItem){
            this.user.UsedBirthdayVoucher = true;
            console.log(" this.user.UsedBirthdayVoucher", this.user.UsedBirthdayVoucher)
          }
          else if(item.IsJoinBenefitItem){
            this.user.UsedJoinVoucher = true;
          }
          if (item.SpecialRequests == undefined || item.SpecialRequests == "undefined" || item.SpecialRequests == null) {
            item.SpecialRequests = "";
          }
          var requests = item.SpecialRequests;
          if (item.ItemName == undefined || item.ItemName == "undefined" || item.ItemName == null) {
            item.ItemName = "";
          }
          item.SpecialRequests = item.ItemName + '\n' + requests;
        });
  
        this.order.OrderCombos.forEach(combo => {
           combo.Items.forEach(item => {
            if (item.SpecialRequests == undefined || item.SpecialRequests == "undefined" || item.SpecialRequests == null) {
              item.SpecialRequests = "";          
            }
            var requests = item.SpecialRequests;
            if (combo.ItemName == undefined || combo.ItemName == "undefined" || combo.ItemName == null) {
              //console.log("combo.ItemName",combo.ItemName);
              combo.ItemName = "";
            }
            item.SpecialRequests = combo.ItemName + " " + requests;
           
          });
  
          combo.Pizzas.forEach(pizza => {
            if (pizza.SpecialRequests == undefined || pizza.SpecialRequests == "undefined" || pizza.SpecialRequests == null) {
              pizza.SpecialRequests = "";
            }
            var requests = pizza.SpecialRequests;
            if (combo.ItemName == undefined || combo.ItemName == "undefined" || combo.ItemName == null) {
              combo.ItemName = "";
            }
            pizza.SpecialRequests = combo.ItemName + '\n' + requests;
          });
  
  
  
        });
  
        this.order.OrderPizzas.forEach(pizza => {
          console.log("from payment - pizza", pizza);
          console.log("from payment - pizza", pizza.SpecialRequests);
          if (pizza.SpecialRequests == undefined || pizza.SpecialRequests == "undefined" || pizza.SpecialRequests == "undefined " || pizza.SpecialRequests == null) {
            pizza.SpecialRequests = "";
          }
          if (pizza.ItemName == undefined || pizza.ItemName == "undefined" || pizza.ItemName == null) {
            pizza.ItemName = "";
          }
  
          pizza.SpecialRequests = pizza.ItemName + '\n' + pizza.SpecialRequests;
  
          console.log("from payment - pizza", pizza.SpecialRequests);
        });
  
        this.isOrderOption = false;
        this.displayCustomer = true;
        
        if (this.order && this.order.IsDelivery) {
          if (this.deliveryGroup &&
            this.deliveryGroup.MinSumForDelivery > this.resultSumWithoutDelivery(this.order.Sum)) {
            this.displayDeliveryConditionDialog();
          }
        }
        
      }
      else {
        console.log("NOT ENOUGH FOR CONTINUE WITH BENEFITS");
        this.displayWarningMessageForClubBenefits();
      }
    }
   

     
   // }

   

  }

  private displayAddressInformation(callback?) {
    let width : string = "";
    let maxWidth: string = "";
    let position: any;
    if(this.isMobileMode()){
      console.log("this.isMobileMode",this.isMobileMode())
      width="350px";
      maxWidth="350px";
      position = {top: '10px'};
    }
    else{
       width="580px"
       maxWidth="580px"
       position = {} 
    }
    this.matDialog.open(AddressSelectionComponent, {
      data: {
        branch:  this.appStorageService.branch,
        order: this.order,
        cities: this.cities
       
      },
      maxWidth: maxWidth,
      width: width,
      maxHeight: "900px",
      position: position,
      disableClose: false,
      panelClass: 'custom-mat-dialog-address'
      
    }).afterClosed().subscribe((result: any) => {
     // this.isLoaded = false;
      //console.log("result",result);
      //console.log("callback",callback);
      if (result && result.order && result.isSaved) {
        console.log("result",result);
        console.log("callback",callback);
        this.deliveryGroup = result.availableGroups[0].group;
        console.log(" this.deliveryGroup", this.deliveryGroup);
        if (this.appStorageService.franchise.IsFutureDatesOrderAvailable && this.appStorageService.franchise.IsFutureOrderAvailable){
          let branchFutureDates: BranchFutureDatesAppModel[];

          this.metadataService.BranchOpenForPickupMethod(this.order.BranchId, this.appStorageService.orderType)
          .subscribe((branchOpenResult) => {
            console.log("branchOpenResult",branchOpenResult);
            branchFutureDates = branchOpenResult.FurureDates;
          //  this.isLoaded = true;
            let width : string = "";
            let maxWidth: string = "";
            let maxHeight: string = "";
            if (this.isMobileMode()){
              console.log("this.isMobileMode",this.isMobileMode());
              width="350px";
              maxWidth="350px";
              maxHeight = "90vh";
            } else{
              width="580px"
              maxWidth="580px"
              maxHeight = "900px"
            }
            //console.log("branchOpenResult",branchOpenResult);
            console.log("branchFutureDates",branchFutureDates);
            var description = this.translationsService.translate('HOME_FUTURE_DELIVERY');
            const dialogRef = this.matDialog.open(SelectDateComponent, {
              data: {
                futureDates: branchFutureDates,
                header: description,
                description: "",
                isTA : this.order.IsTakeAway,
                isDelivery : this.order.IsDelivery,
                branchOpen : branchOpenResult.IsOpen,
                branchName : this.appStorageService.branch.Name
              },
              width: width,
              maxWidth: maxWidth,
              maxHeight: "900px"
            });
            dialogRef.afterClosed().subscribe(dialogResult => {
              if (dialogResult && dialogResult.isSaved) {
                this.order.IsFutureOrder = true;
                this.order.FutureDateModel = dialogResult.selectedDay;
                this.order.FutureDeliveryTime = dialogResult.futureDeliveryTime;
                this.order.FutureDate = dialogResult.selectedDay.Date;
                console.log(" this.order.FutureDate", this.order.FutureDate);
                console.log(" this.order.FutureDeliveryTime", this.order.FutureDeliveryTime);
              //  this.isLoaded = false;
              } else {
                  console.log(" this.cancelOptionSelection();");
                              //this.cancelOptionSelection();
              }
                          
            });   
          }, (error) => {
           // this.isLoaded = true;
            this.messageService.displayServerErrorMessage();
          });
        }
       
        if (callback) {
          callback(result);
        }
      } else {
      //  this.isLoaded = true;
      }
    });
  }

  public tranzilaIframeURL() {
    const loginToken = this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.franchiseId);
    if (loginToken) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        this.appStorageService.franchise.TranzilaUrl +
        '?template=custom_he&lang=il&sum=5' +
        '&currency=1&cred_type=1&tranmode=VK&pdesc=' +
        this.configService.franchiseId + '&franchiseId=' +
        this.configService.franchiseId + '&userLoginToken=' + loginToken);
    } else {
      return '';
    }
  }

  public tranzilaIframeURLnew() {
    const loginToken = this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.franchiseId);
   // if (loginToken) {
     var tLang = 'il'

     if (this.lang == 'en') tLang = 'us'
     
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        this.appStorageService.franchise.TranzilaUrl +
        '?lang='+ tLang +'&sum=' + this.resultSum(this.order.Sum) +
        '&trButtonColor=' + this.colors.buttonColor.substring(1) +
        '&trTextColor=000000&currency=1&cred_type=1&tranmode=AK&pdesc=' +
        this.configService.franchiseId + '&franchiseId=' +
        this.configService.franchiseId + '&userLoginToken=' + loginToken);//&nologo=1
   // } else {
    //  return '';
   // }
  }

  iframeLoad() {
    console.log("iframeLoad");
   // if (document.getElementById("tranzilaIframe")[0].contentWindow.location.search.indexOf("TranzilaTK") != -1)
   // console.log(document.getElementById("tranzilaIframe")[0].contentWindow.location.search);

    /*if ($("#tranzilaIframe")[0].contentWindow.location.search.indexOf("TranzilaTK") != -1) {
      console.log("GOOD");

      var params = $("#tranzilaIframe")[0].contentWindow.location.search.split("&");


      var tranzilaToken = _.find(params, function(e) {
        return e.indexOf("TranzilaTK") != -1
      });
      tranzilaToken = tranzilaToken.split("TranzilaTK=");
      tranzilaToken = tranzilaToken[tranzilaToken.length - 1];

      var expyear = _.find(params, function(e) {
        return e.indexOf("expyear") != -1
      });
      expyear = expyear.split("expyear=");
      expyear = expyear[expyear.length - 1];
      if (expyear.length == 1) {
        expyear = "0" + expyear;
      }

      var expmonth = _.find(params, function(e) {
        return e.indexOf("expmonth") != -1
      });
      expmonth = expmonth.split("expmonth=");
      expmonth = expmonth[expmonth.length - 1];
      if (expmonth.length == 1) {
        expmonth = "0" + expmonth;
      }

      var paymentData = {
        tranzilaToken: tranzilaToken,
        expdate: expmonth + expyear
      }

      var loginToken = $scope.getItemFromLocalStorage("loginToken");
      $scope.setItemInLocalStorage("paymentData", paymentData);

      MyOrder.paymentRequest($scope.currentOrder, loginToken, tranzilaToken, expmonth + expyear, $scope.user).then(function(response) {
        $scope.paymentCallBack(response);
      });
    }*/
  }



  ngAfterViewInit() {

  }


  public cancelError(key) {
    if (this.errorsCashRegister &&
      this.errorsCashRegister[key]) {
      Object.keys(this.errorsCashRegister[key])
        .forEach((errorsCashRegisterKey) => {
          this.errorsCashRegister[key][errorsCashRegisterKey] = false;
        });
    }
  }

  public displayError(key) {
    const errorMessages = [];
    if (this.errorsCashRegister &&
      this.errorsCashRegister[key]) {
      Object.keys(this.errorsCashRegister[key])
        .forEach((errorsCashRegisterKey) => {
          if (this.errorsCashRegister[key][errorsCashRegisterKey] && this.errorsCashRegisterMessages
            && this.errorsCashRegisterMessages[key] && this.errorsCashRegisterMessages[key][errorsCashRegisterKey]) {
            errorMessages.push(this.errorsCashRegisterMessages[key][errorsCashRegisterKey])
          }
        })
    }
    return errorMessages.join(' , ');
  }

  public checkError(key) {
    let isError = false;
    if (this.errorsCashRegister &&
      this.errorsCashRegister[key]) {
      Object.keys(this.errorsCashRegister[key])
        .forEach((errorsCashRegisterKey) => {
          if (this.errorsCashRegister[key][errorsCashRegisterKey]) {
            isError = true;
          }
        });
    }
    return isError;
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

  public completeSignIn() {
    this.isSignedUser = true;
    this.loadDiscountAndScratchCoupons();
  }

  /*private legalTz(num) {
    console.log("legalTz: num", num);
    let tot = 0;
    let tz = new String(num);
    console.log("legalTz: tz", tz);
    for (let i = 0; i < 8; i++) {
      let x = (((i % 2) + 1) * +tz.charAt(i));
      if (x > 9) {
        console.log("x",x);
        let x1 = x.toString();
        x = parseInt(x1.charAt(0)) + parseInt(x1.charAt(1));
      }
      tot += x;
    }
    if ((tot + parseInt(tz.charAt(8))) % 10 == 0) {
      this.errorsCashRegister.ownerId.notValidId = false;
      console.log("tot",tot);
      return true;
    } else {
      this.errorsCashRegister.ownerId.notValidId = true;
      console.log("tot",tot);
      return false;
    }
  }*/

  private legalTz(num) {
    console.log("legalTz: num", num);
    let tot = 0;
    let tz = new String(num);
    console.log("legalTz: tz", tz);
    if (Number.isInteger(parseInt(num))) {
      console.log("Number.isInteger",num);
      for (let index = 0; index < tz.length; index++) {
        tot++;
        var myChar = tz[index];
        console.log("myChar", myChar);

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
    console.log("isCVV",value);
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

  public isCreditValidData() {
    console.log("isCreditValidData");
    if (this.paymentType === PaymentTypeEnum.cash) {
      return true;
    } else if (this.paymentType === PaymentTypeEnum.sibus) {
      if (this.multiPayers && this.cibusSplittedPaymentType == "credit"){
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

      } else {
        if(this.selectedCibus){
          console.log("this.selectedCibus", this.selectedCibus);
          this.cibusCard.number = this.selectedCibus;
        }
        if (this.cibusCard.number.length == 9 || 
            this.cibusCard.number.length == 8 ||
            this.cibusCard.number.length == 5) {
              if (this.notEnoughCibusBudget && this.cibusSplittedPaymentType == 'credit') {
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
              }
               return true;
            }
        else return false;
      }
    
    } else if (this.paymentType === PaymentTypeEnum.tenbis) {
      if (this.multiPayers && this.cibusSplittedPaymentType == "credit"){
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
      } else {
        if (this.tenbisCard.number.length > 10) {
          return true;
        } else {
          return false;
        }
      }
     
    } else {
      if (this.multiPayers) {
        return true;
      } else { 
        if (this.order.CCTokens.length > 0 && this.selectedCcId >0 && !this.addCC){
          console.log("isCreditValidData: true");
           return true;
         } else {
           console.log("isCreditValidData: else");
           if (this.country !== CountryEnum.US &&
             !this.legalTz(this.cashRegisterCreditCard.ownerId)) {
              console.log("this.country",this.country);
              console.log("this.cashRegisterCreditCard",this.cashRegisterCreditCard);
              console.log("this.errorsCashRegister",this.errorsCashRegister);

             return false;
           }
           if (!this.legalCC_Short(this.cashRegisterCreditCard.number) &&
             !this.legalCC(this.cashRegisterCreditCard.number) && !this.verifyAE_CC(this.cashRegisterCreditCard.number)) {
              console.log("this.cashRegisterCreditCard",this.cashRegisterCreditCard);
             return false;
           }
           if (!this.isCVV(this.cashRegisterCreditCard.cvv)) {
            console.log("this.cashRegisterCreditCard",this.cashRegisterCreditCard);
             return false;
           }
           return true;
         }
      }
      
      
    }
  }

  public isSplittedCreditValidData() {
    console.log("isSplittedCreditValidData");
    console.log("this.ccWithToken.expirationMonth",this.ccWithToken.expirationMonth);
    if (Number(this.ccWithToken.sum) == 0 || 
        Number(this.ccWithToken.sum) > this.resultSum(this.order.Sum) - this.sumPayed ) {
          return false;
        }
        if (this.ccWithToken.expirationMonth =='') {
          console.log("this.ccWithToken.expirationMonth1",this.ccWithToken.expirationMonth)
          this.ccWithToken.expirationMonth = (this.date.getMonth() + 1).toString();
          this.ccWithToken.expirationYear = this.date.getFullYear().toString();
        }
         
        if (this.country !== CountryEnum.US &&
          !this.legalTz(this.ccWithToken.ownerId)) {
            console.log("this.ccWithToken.expirationMonth2",this.ccWithToken.expirationMonth);
            return false;
        }
        if (!this.legalCC_Short(this.ccWithToken.number) &&
          !this.legalCC(this.ccWithToken.number) && !this.verifyAE_CC(this.ccWithToken.number)) {
            console.log("this.ccWithToken.expirationMonth3",this.ccWithToken.expirationMonth);
          return false;
        }
        if (!this.isCVV(this.ccWithToken.cvv)) {
          console.log("this.ccWithToken.expirationMonth4",this.ccWithToken.expirationMonth);
          return false;
        }
        return true;
      
  }

  public checkCCToken() {
    if (this.isSplittedCreditValidData()) {
     
     this.showLoader = true;
    const loginToken = this.appStorageService
    .getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.configService.franchiseId);
    this.paymentService
      .dataEncryption(loginToken, JSON.stringify(this.ccWithToken))
      .subscribe((response) => {
        let encrypted = response;
        this.paymentService
          .CheckCCToken(loginToken, this.order.BranchId, encrypted, this.ccWithToken.sum)
          .subscribe((res) => {            
            if (res && res.Data && res.Data != -1) {
              console.log("res",res);
              console.log("this.sumPayed",this.sumPayed);
              this.ccWithToken.token = res.Data
              this.sumPayed += Number(this.ccWithToken.sum);
              console.log("after this.sumPayed",this.sumPayed);
              const cc = this.commonFunctionsService.deepCopy(this.ccWithToken);
              this.paymentService
              .dataEncryption(loginToken, JSON.stringify(this.ccWithToken))
              .subscribe((response) => {
                let encryptedWithToken = response;
                this.payersArray.push(cc);
                this.encriptedPayersArray.push(encryptedWithToken);
                console.log("this.payersArray",this.payersArray);
                this.ccWithToken.cvv = '';
                this.ccWithToken.expirationMonth = '';
                this.ccWithToken.expirationYear = '';
                this.ccWithToken.number = '';
                this.ccWithToken.ownerId = '';
                this.ccWithToken.token = '';
                this.ccWithToken.sum =  (Math.round(this.resultSum(this.order.Sum)  * 100) / 100 ) - this.sumPayed;
                this.showLoader = false;
              }, (error) => {
                this.isLoaded.isCreditPaymentLoaded = true;
                this.showLoader = false;
                this.messageService.displayServerErrorMessage();

              });
             
             
            } else {
              this.isLoaded.isCreditPaymentLoaded = true;
              this.showLoader = false;
              this.messageService.displayBadCCMessage();
              this.clearErrorFields();
            }

          }, (error) => {
            this.isLoaded.isCreditPaymentLoaded = true;
            this.showLoader = false;
            this.messageService.displayServerErrorMessage();
          });
      }, (error) => {
        this.isLoaded.isCreditPaymentLoaded = true;
        this.showLoader = false;
        this.messageService.displayServerErrorMessage();
      });
    } else {
      this.displayCCErrorFields();
    }
  }

  public tranzilaIframeSplitPaymentVerifySum(){
    if (Number(this.ccWithToken.sum) == 0 || 
        Number(this.ccWithToken.sum) > this.resultSum(this.order.Sum) - this.sumPayed ) {
          this.orderErrors.sum = true;
          return false;
    }
    else {
      const loginToken = this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.franchiseId);     
      var tLang = 'il'
      if (this.lang == 'en') tLang = 'us';
      this.tranzilaIframeUrlSanitized = this.sanitizer.bypassSecurityTrustResourceUrl(
        'https://direct.tranzila.com/'+ this.cashRegister.tranzillaTerminal +
        '/iframenew.php?lang='+ tLang +'&sum=' + this.ccWithToken.sum +
        '&trButtonColor=' + this.colors.buttonColor.substring(1) +
        '&trTextColor=000000&currency=1&cred_type=1&tranmode=VK&pdesc=' +
        this.configService.franchiseId + '&franchiseId=' +
        this.configService.franchiseId + '&userLoginToken=' + loginToken);
         
          this.displayTranzilaSplitPaymentIframeUrl = true;
          setTimeout(() => this.tranzilaIframeSplitPayment(this.ccWithToken.sum), 15000);
        
    }
  }
 public multiPaymentStarted: boolean = false;

  public tranzilaVerifyCard() {
    this.multiPaymentStarted = true;
    if (this.isSplittedCreditValidData()) {
     
     this.showLoader = true;
    const loginToken = this.appStorageService
    .getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.configService.franchiseId);
    this.paymentService
      .dataEncryption(loginToken, JSON.stringify(this.ccWithToken))
      .subscribe((response) => {
        let encrypted = response;
        this.paymentService
          .TranzilaVerifyCard(loginToken, this.order.BranchId, encrypted, this.ccWithToken.sum)
          .subscribe((res) => {            
            if (res && res.Data && res.Data.Success) {
              console.log("res",res);
              console.log("this.sumPayed",this.sumPayed);

              //this.ccWithToken.token = res.Data
              this.sumPayed += Number(this.ccWithToken.sum);
              console.log("after this.sumPayed",this.sumPayed);
              this.tranzilaPayersArray.push(res.Data);

              let cibusOrderDetails = new CibusAppModel();               
              cibusOrderDetails.SumPayed = this.ccWithToken.sum;
              this.order.CibusReciptData += JSON.stringify(cibusOrderDetails)               
              this.cibusTenbisPayersArray.push(cibusOrderDetails);

              this.ccWithToken.cvv = '';
              this.ccWithToken.expirationMonth = '';
              this.ccWithToken.expirationYear = '';
              this.ccWithToken.number = '';
              this.ccWithToken.ownerId = '';
              this.ccWithToken.token = '';
              this.ccWithToken.sum =  (Math.round(this.resultSum(this.order.Sum)  * 100) / 100 ) - this.sumPayed;
              this.showLoader = false;
             
            } else {
              this.isLoaded.isCreditPaymentLoaded = true;
              this.showLoader = false;
              this.messageService.displayBadCCMessage();
              this.clearErrorFields();
              if (this.sumPayed == 0) this.multiPaymentStarted = false;
            }

          }, (error) => {
            this.isLoaded.isCreditPaymentLoaded = true;
            this.showLoader = false;
            if (this.sumPayed == 0) this.multiPaymentStarted = false;
            this.messageService.displayServerErrorMessage();
          });
      }, (error) => {
        this.isLoaded.isCreditPaymentLoaded = true;
        this.showLoader = false;
        if (this.sumPayed == 0) this.multiPaymentStarted = false;
        this.messageService.displayServerErrorMessage();
      });
    } else {
      this.displayCCErrorFields();
      if (this.sumPayed == 0) this.multiPaymentStarted = false;
    }
  }

  public multiPayment(order) {
    const loginToken = this.appStorageService
    .getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.configService.franchiseId);
    this.isLoaded.isCreditPaymentLoaded = false;
     this.paymentService
        .SplittedPaymentRequestTranzilla(order, loginToken, this.encriptedPayersArray)
        .subscribe((response) => {
          this.loadOrderUserDataToUser(this.user);
          this.signInOutService.updateUserDetails(this.user).subscribe((reslt) => {
            this.isLoaded.isCreditPaymentLoaded = true;
            this.paymentCallBack(response);
          }, (error) => {
            this.isLoaded.isCreditPaymentLoaded = true;
            this.messageService.displayServerErrorMessage();
          });
        }, (error) => {
          this.isLoaded.isCreditPaymentLoaded = true;
          this.messageService.displayServerErrorMessage();
        });
     
  }

  public splittedPayment(order) {
    this.order.PayedByCredit=0;
     order.PayedByCredit=0;
    const loginToken = this.appStorageService
    .getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.configService.franchiseId);
    this.isLoaded.isCreditPaymentLoaded = false;
    var counter = 0;
    var receiptArray = [];
    this.tranzilaPayersArray.forEach((payment)=>{
      //ConfirmationCode
      this.paymentService
      .TranzilaForceCardPayment(loginToken, order.BranchId, payment.index, payment.ConfirmationCode, payment.sum)
      .subscribe((res) => {
        if (res && res.Data && res.Data.Success) { 
          console.log("TranzilaForceCardPayment res",res);
          if (res.Data.Success) {
            counter++;
            payment.index = res.Data.index;
            receiptArray.push(payment);
           
            this.order.PayedByCredit += Number(payment.sum);
             order.PayedByCredit += Number(payment.sum);
            if (counter == this.tranzilaPayersArray.length) {
              order.CreditReciptData = JSON.stringify(receiptArray);
              order.CibusReciptData = JSON.stringify(this.cibusPayersArray);
              order.TenbisReciptData = JSON.stringify(this.tenbisPayersArray);
              this.paymentService
                .MakeOrderTranzillaSplittedPayment(order, loginToken, res.Data.ConfirmationCode, JSON.stringify(receiptArray))
                .subscribe((response) => {
                  this.loadOrderUserDataToUser(this.user);
                  this.signInOutService.updateUserDetails(this.user).subscribe((reslt) => {
                    this.isLoaded.isCreditPaymentLoaded = true;
                    this.paymentCallBack(response);
                  }, (error) => {
                    this.isLoaded.isCreditPaymentLoaded = true;
                    this.showLoader = false;
                    this.messageService.displayServerErrorMessage();
                  });
                }, (error) => {
                  this.isLoaded.isCreditPaymentLoaded = true;
                  this.showLoader = false;
                  this.messageService.displayServerErrorMessage();
                });
            }
          }
        }
      }, (error) => {
        this.isLoaded.isCreditPaymentLoaded = true;
        this.showLoader = false;
        this.messageService.displayServerErrorMessage();
      });
    });
     
     
  }

  public payWithCashRegisterCreditCard(order) {
    if (!this.isCreditValidData()) {
      this.showLoader = false;
      return;
    }
    const loginToken = this.appStorageService
      .getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.configService.franchiseId);
    this.isLoaded.isCreditPaymentLoaded = false;
    this.paymentService
      .dataEncryption(loginToken, JSON.stringify(this.cashRegisterCreditCard))
      .subscribe((response) => {
        let encrypted = response;
        this.paymentService
          .paymentRequestCashRegister(order, loginToken, encrypted)
          .subscribe((response) => {



            this.loadOrderUserDataToUser(this.user);

            
            this.signInOutService.updateUserDetails(this.user).subscribe((reslt) => {
              this.isLoaded.isCreditPaymentLoaded = true;
              this.paymentCallBack(response);
            }, (error) => {
              this.isLoaded.isCreditPaymentLoaded = true;
              this.messageService.displayServerErrorMessage();
            });
          }, (error) => {
            this.isLoaded.isCreditPaymentLoaded = true;
            this.messageService.displayServerErrorMessage();
          });
      }, (error) => {
        this.isLoaded.isCreditPaymentLoaded = true;
        this.messageService.displayServerErrorMessage();
      });
  }

  public calcMemberPoints(){
    console.log("calcMemberPoints(): ",this.user);
    console.log("calcMemberPoints(): this.user.MemberPoints",this.user.MemberPoints);
    var memberPoints = this.user.MemberPoints || 0;
    console.log("memberPoints",memberPoints);

     const itemsFromCmShop = this.order.OrderItems.filter((item) => {
      return item.IsClubMemberItem;
    });
    var itemsFromShopPrice = 0;
    console.log("itemsFromCmShop",itemsFromCmShop);

    itemsFromCmShop.forEach(item => {
      if(!item.IsAnnBenefitItem && !item.IsBDayBenefitItem && !item.IsJoinBenefitItem){
      itemsFromShopPrice += item.Price;
      }
      else if(item.IsAnnBenefitItem){
        this.user.UsedAnniversaryVoucher = true;
      }
      else if(item.IsBDayBenefitItem){
        this.user.UsedBirthdayVoucher = true;
      }
      else if(item.IsJoinBenefitItem){
        this.user.UsedJoinVoucher = true;
      }
    });

    console.log("itemsFromShopPrice",itemsFromShopPrice);
    this.appStorageService.itemsFromShopPrice = itemsFromShopPrice;

    //this.currentUserPoints = memberPoints-itemsFromShopPrice;
    //this.appStorageService.currentUserPoints = memberPoints-itemsFromShopPrice;

    return memberPoints-itemsFromShopPrice


  }

  public calcReceivedPoints(){
    return this.priceWithDiscount(this.order.Sum)*(this.appStorageService.franchise.PoinsPercentage/100);
  }
  

  public payWithSavedCreditCard(order) {
  //  if (!this.isCreditValidData()) {
   //   return;
  //  }
    const loginToken = this.appStorageService
      .getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.configService.franchiseId);
    this.isLoaded.isCreditPaymentLoaded = false;
    order.SavedCreditTokenId = this.selectedCcId;
    this.paymentService
          .paymentRequestCashRegister(order, loginToken, "")
          .subscribe((response) => {


            
            this.loadOrderUserDataToUser(this.user);
            this.signInOutService.updateUserDetails(this.user).subscribe((reslt) => {
              this.isLoaded.isCreditPaymentLoaded = true;
              this.paymentCallBack(response);
            }, (error) => {
              this.isLoaded.isCreditPaymentLoaded = true;
              this.messageService.displayServerErrorMessage();
            });
          }, (error) => {
            this.isLoaded.isCreditPaymentLoaded = true;
            this.messageService.displayServerErrorMessage();
          });
  }

  private paymentCallBack(response) {

    if (this.isAvailableScratchCoupon()) {
      if (response && response.Data && response.Data.success) {
        this.appStorageService.isUsedScratchCoupon = true;
        this.appStorageService.useScratchCoupon = false;

      }
    }
    if (response && response.Data && response.Data.success) {
      this.updateClubMemberDetails();


    }
    this.isLoaded.isPayaPaymentLoaded = true;
    this.isLoaded.isCashPaymentLoaded = true;
    this.isLoaded.isCreditPaymentLoaded = true;
    this.appStorageService.paymentResult = response;
    
    localStorage.removeItem(window.location.hash);
    this.ngZone.run(() => this.router.navigate([`/${this.franchiseId}/payment/${this.order.BranchId}`])).then();
  }

   private pelecardPaymentCallBack(response) {
console.log("pelecardPaymentCallBack",response);
    if (this.isAvailableScratchCoupon()) {
      // if (response && response.Data && response.Data.success &&
       // response.Data.orderData && response.Data.orderData.Data.Data.success)
      if (response && response.Data && response.Data.success && response.Data.orderId) {
        this.appStorageService.isUsedScratchCoupon = true;
        this.appStorageService.useScratchCoupon = false;

      }
    }
    // if (response && response.Data && response.Data.success &&
       // response.Data.orderData && response.Data.orderData.Data.Data.success) {
    if (response && response.Data && response.Data.success &&  response.Data.orderId) {
      this.updateClubMemberDetails();


    }
    this.isLoaded.isPayaPaymentLoaded = true;
    this.isLoaded.isCashPaymentLoaded = true;
    this.isLoaded.isCreditPaymentLoaded = true;
    if (response.Data && !response.Data.success)   this.appStorageService.paymentResult = response.Data;
    else this.appStorageService.paymentResult = response;//Data.orderData.Data;
    console.log(" this.appStorageService.paymentResult", this.appStorageService.paymentResult)
    localStorage.removeItem(window.location.hash);
    this.ngZone.run(() => this.router.navigate([`/${this.franchiseId}/payment/${this.order.BranchId}`])).then();
  }

  public updateClubMemberDetails(){
    if(this.user.IsClubMember){

      console.log(" if(this.user.IsClubMember): this.user", this.user);
      const myUser = this.commonFunctionsService.deepCopy(this.user);
      console.log("paymentRequestCashRegister: myUser", myUser);
  
      console.log("paymentRequestCashRegister: this.calcMemberPoints()",this.calcMemberPoints());
      //this.user.MemberPoints =  this.calcMemberPoints();
  
      if(this.appStorageService.franchise.UseMembersClub){
        console.log("payment(): this.appStorageService.franchise.UseMembersClub",this.appStorageService.franchise.UseMembersClub);
        this.userPoints = this.calcReceivedPoints();
        console.log("this.userPoints",this.userPoints);
        //this.user.MemberPoints += this.userPoints;
        console.log("this.user",this.user);
        if(this.userPoints != 0){
          //this.updateUser();
          this.appStorageService.pointsPerOrder = this.userPoints;
        }
      }
  ///// כאן הבעיה
     /* this.signInOutService.updateUserDetails(this.user).subscribe((result) => {
        console.log("result - update user", result);
      }, (error) => {
        console.log("error update user");
  
      });*/
    }
  }



  public checkSigning(result?) {
    this.isSignedUser = !!result;
    console.log("checkSigning");
    this.isSignedUser = !!this.appStorageService
      .getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.configService.franchiseId);
      console.log("result",result);
      console.log("result!!!",result);
     // console.log("this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN)",
     // this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN));
     // console.log("this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN)!!",
     // !!this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN));
      console.log("this.isSignedUser",this.isSignedUser);
    if (this.isSignedUser) {

      this.verifyToken(true);
    } else {
      //Tanya 28-12
      this.loadSignInForm_new();
     // this.isLoaded.isDiscountLoaded = true;
     // this.checkedUserSigning();
     // this.checkDiscount(true);
    }
 
  }

  public checkedUserSigning(isSignedUser?) {
    console.log("checkedUserSigning");
    this.isSignedUser = !!isSignedUser;
    this.checkBranch();
  }

  private checkPaymentOptions() {
    this.isLoaded.isPaymentSettingsLoaded = false;
    
     this.paymentService.getBranchPaymentOptions(this.order.BranchId).subscribe((result) => {
   // const result = this.appStorageService.paymentOptions;
      console.log("this.appStorageService.paymentOptions",this.appStorageService.paymentOptions);
      if (result) {
        this.paymentSettings.Cash = result.Cash;
        if (this.paymentSettings.Cash) {
          if(!this.isMobileMode()){
            console.log("this.isMobileMode()",this.isMobileMode());
            this.paymentType = PaymentTypeEnum.cash;
          }
        }
        this.paymentSettings.CreditCard = result.CreditCard;
        
        if (this.paymentSettings.CreditCard) {
          if (!this.isMobileMode()) {
            console.log("this.isMobileMode()", this.isMobileMode());
            this.paymentType = PaymentTypeEnum.card;
             console.log("this.paymentType ttt", this.paymentType);
            
          }
        }
       
        this.paymentSettings.Sibus = result.Sibus;
      }
      this.paymentSettings.CreditCard = result.CreditCard;
      if (!this.paymentSettings.Cash && this.paymentSettings.CreditCard) {
        if (!this.isMobileMode()) {
          console.log("this.isMobileMode()", this.isMobileMode());
          this.paymentType = PaymentTypeEnum.card;
        }
      } else if (!this.paymentSettings.CreditCard && 
                 !this.paymentSettings.Cash && 
                  this.appStorageService.franchise?.UseBiteCredit &&
                  !this.isMobileMode()){
          this.paymentType = 'biteCredit'
      }

      this.isLoaded.isPaymentSettingsLoaded = true;
     }, () => {
       this.isLoaded.isPaymentSettingsLoaded = true;
       this.messageService.displayServerErrorMessage();
     });
  }

  public checkLoading() {
    return this.isLoaded.isDeliveryDataLoaded &&
      this.isLoaded.isDiscountLoaded && this.isLoaded.isScratchCouponLoaded &&
      this.isLoaded.isPaymentSettingsLoaded && this.isLoaded.isSignInLoaded &&
      this.isLoadedScratchCoupon && this.isLoaded.isValidationUserLoaded &&
      this.isLoaded.isCashPaymentLoaded &&
      this.isLoaded.isCreditPaymentLoaded &&
      this.isLoaded.isFranchiseWithBranchesLoaded && this.isLoaded.isPayaPaymentLoaded &&
      this.isLoaded.isBranchOpenLoaded &&
      this.isLoaded.isUpdateUserDetailsLoaded && this.isLoaded.isCashRegisterLoaded;
  }

  private checkDiscount(isNotSigned?) {
    console.log("checkDiscount()");
    if (this.user) {
      this.isLoaded.isDiscountLoaded = false;
      this.menuService.getDiscount(this.order.BranchId, this.user && this.user.Id ? this.user.Id : undefined).subscribe((result) => {
        if (result) {
          this.discount = result;
        }
        this.isLoaded.isDiscountLoaded = true;
      }, (error) => {
        this.isLoaded.isDiscountLoaded = true;
        // this.messageService.displayServerErrorMessage();
      });
    } else if (isNotSigned) { // for not signed users
      this.menuService.getDiscount(this.order.BranchId, undefined).subscribe((result) => {
        if (result) {
          this.discount = result;
        }
        this.isLoaded.isDiscountLoaded = true;
      }, (error) => {
        this.isLoaded.isDiscountLoaded = true;
      });
    }
  }

  public checkAvailabilityDiscount() {
   //console.log("this.order.IsDiscount",this.order.IsDiscount);
   //console.log(" this.discount", this.discount);
   // console.log("this.order.IsDiscount",this.order.IsDiscount);
     if( this.discount && this.discount.minSum != null && this.discount.minSum != undefined) {
    if (/*this.isSignedUser && */this.order) {
      this.order.IsDiscount = this.discount && (this.discount.sum > 0) &&
        this.order.Sum >= this.discount.minSum && (this.discount.active || this.discount.alwaysActive);
      return this.order.IsDiscount;
    }
  }
    return false;
  }

  public isSelectedTypePayment() {
    return this.paymentType;
  }


  public trimField(value) {
    return value ? value.toString().trim() : value;
  }

  public isFilledFields() {
    if (this.order && !this.order.IsDelivery) {
      if (this.paymentType === PaymentTypeEnum.cash) {
        return this.trimField(this.order.FirstName) && this.trimField(this.order.LastName);
      } else if (this.paymentType === PaymentTypeEnum.card) {
        if (this.selectedCcId > 0 && this.order.CCTokens.length > 0 && !this.addCC) {
          return this.trimField(this.order.FirstName) && this.trimField(this.order.LastName);
        } else {
          return this.trimField(this.order.FirstName) && this.trimField(this.order.LastName)
          && this.trimField(this.cashRegisterCreditCard.number) &&
          this.trimField(this.cashRegisterCreditCard.cvv) &&
          (this.country !== CountryEnum.US ? this.trimField(this.cashRegisterCreditCard.ownerId) : true)
          && this.trimField(this.cashRegisterCreditCard.expirationMonth) &&
          this.trimField(this.cashRegisterCreditCard.expirationYear);
        }
       
      } else if (this.paymentType === PaymentTypeEnum.sibus){ 
        return this.trimField(this.order.FirstName) && this.trimField(this.order.LastName)
        && this.trimField(this.cibusCard.number) 
      } else {
        return false;
      }
    } else if (this.order && this.order.IsDelivery) {
      if (this.paymentType === PaymentTypeEnum.cash) {
        return this.trimField(this.order.FirstName) && this.trimField(this.order.LastName) &&
          this.trimField(this.order.UserCity) && this.trimField(this.order.Street) && this.order.StreetNum;
      } else if (this.paymentType === PaymentTypeEnum.card) {
        return this.trimField(this.order.FirstName) && this.trimField(this.order.LastName) &&
          this.trimField(this.order.UserCity) && this.trimField(this.order.Street) &&// this.order.StreetNum &&
          this.trimField(this.cashRegisterCreditCard.number) &&
          this.trimField(this.cashRegisterCreditCard.cvv) &&
          (this.country !== CountryEnum.US ? this.trimField(this.cashRegisterCreditCard.ownerId) : true) &&
          this.trimField(this.cashRegisterCreditCard.expirationMonth) && this.trimField(this.cashRegisterCreditCard.expirationYear);
        } else if (this.paymentType === PaymentTypeEnum.sibus){
          return this.trimField(this.order.FirstName) && this.trimField(this.order.LastName)
          &&  this.trimField(this.order.UserCity) && this.trimField(this.order.Street) 
          && this.trimField(this.cibusCard.number) 
        } else {
        return false;
      }
    } else {
      return false;
    }
  }

  public isFilledCustomerFields() {
    if (this.order.Email == null ||  this.order.Email == undefined ) this.order.Email = "";
    var pattern = new RegExp('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[A-Za-za-z]{2,3}');   
    console.log("pattern.test(this.order.Email.toString().trim()",pattern.test(this.order.Email.toString().trim()));
   console.log("his.forceEmail",this.forceEmail);
    if (this.forceEmail ) {// this.order.Email!= null &&  this.order.Email!= undefined && this.sendInvoice 
      if (this.order && this.order.IsDelivery) {
        if (AppConfig.configSettings.allowIncompletAddress) 
          return this.trimField(this.order.FirstName) && 
          this.trimField(this.order.LastName) &&
          this.trimField(this.order.UserCity) && 
       
          pattern.test(this.order.Email.toString().trim());
        else
          return this.trimField(this.order.FirstName) && 
                 this.trimField(this.order.LastName) &&
                 this.trimField(this.order.UserCity) && 
                 this.trimField(this.order.Street) &&
                 pattern.test(this.order.Email.toString().trim());
       // }
        
      } else {
     
          return this.trimField(this.order.FirstName) && 
                 this.trimField(this.order.LastName) &&
                 pattern.test(this.order.Email.toString().trim());
        //}
        
      }
    } else {
      if (this.order && this.order.IsDelivery) {
        if (AppConfig.configSettings.allowIncompletAddress) 
          return this.trimField(this.order.FirstName) && 
               this.trimField(this.order.LastName) &&
               this.trimField(this.order.UserCity);
               
        else  return this.trimField(this.order.FirstName) && 
               this.trimField(this.order.LastName) &&
               this.trimField(this.order.UserCity) && 
               this.trimField(this.order.Street);
       // }
        
      } else {
  
          return this.trimField(this.order.FirstName) && this.trimField(this.order.LastName) ;
        //}
        
      }
    }

   /* if (this.order && !this.order.IsDelivery) {
      return this.trimField(this.order.FirstName) && this.trimField(this.order.LastName);
    } else if (this.order && this.order.IsDelivery) {
      return this.trimField(this.order.FirstName) && this.trimField(this.order.LastName) &&
      this.trimField(this.order.UserCity) && this.trimField(this.order.Street) ;//&& this.order.StreetNum;
    } else {
      return false;
    }*/
  }

  public isValidCountOfOrders() {
    return this.order && (
      (this.order.OrderItems && this.order.OrderItems.length > 0) || 
      (this.order.OrderPizzas && this.order.OrderPizzas.length > 0) ||
       (this.order.OrderCombos && this.order.OrderCombos.length > 0));
  }

  public garnishGroupGarnishes(item) {
    let garnishes = [];
    if (item.GarnishGroups) {
      garnishes = item.GarnishGroups.reduce((garnishes, garnishGroup) => {
        return garnishes.concat(garnishGroup.Garnishes || []);
      }, []);
    }
    return garnishes;
  }

  public getGranishesWithDevider(item, joined = true, isIncludedPrice?) {
    if (!item) {
      return '';
    }
    let garnishes = '';
    if (item.Garnishes) {
      garnishes = item.Garnishes.map((garnish: GarnishAppAdvancedModel) => {
        return garnish.Name + (isIncludedPrice && garnish.Price ? ('(' + garnish.Price + this.translationsService.translate('COMMON_CASH') + ')') : '');
      }).join(' , ');
    }
    let garnishesOfGarnishGroup = '';
    if (item.GarnishGroups) {
      item.GarnishGroups.map((garnishGroup) => {
        return garnishGroup.Garnishes.map((garnish) => {
          return garnish.Name + (isIncludedPrice && garnish.Price ? ('(' + garnish.Price + this.translationsService.translate('COMMON_CASH') + ')') : '');
        }).join(' , ')
      }).join(' , ');
    }
    const elems = (garnishes + garnishesOfGarnishGroup).split(' , ');
    let group = {};
    elems.forEach((elem) => {
      if (!group[elem]) {
        group[elem] = [];
      }
      group[elem].push(elem);
    });
    const garnishesWithMultipleSizes = Object.keys(group).map((key) => {
      return key + ((key && group[key] && group[key].length > 1) ? ' x' + group[key].length + ' ' : '');
    }).join(' , ');
    return garnishesWithMultipleSizes; //garnishes + garnishesOfGarnishGroup;
  }



  public getGarnishes(item, isIncludedPrice?) {
    if (!item) {
      return [];
    }
    let garnishes = [];
    if (item.Garnishes) {
      garnishes = item.Garnishes.map((garnish: GarnishAppAdvancedModel) => {
        return garnish.Name + (isIncludedPrice && garnish.Price ? ('(' + garnish.Price + this.translationsService.translate('COMMON_CASH') + ')') : '');
      });
    }
    let garnishesOfGarnishGroup = [];
    if (item.GarnishGroups) {
      garnishesOfGarnishGroup = item.GarnishGroups.map((garnishGroup) => {
        return garnishGroup.Garnishes.map((garnish) => {
          return garnish.Name + (isIncludedPrice && garnish.Price ? ('(' + garnish.Price + this.translationsService.translate('COMMON_CASH') + ')') : '');
        })
      });
    }
    const elems = garnishes.concat(garnishesOfGarnishGroup);
    let group = {};
    elems.forEach((elem) => {
      if (!group[elem]) {
        group[elem] = [];
      }
      group[elem].push(elem);
    });
    const garnishesWithMultipleSizes = Object.keys(group).map((key) => {
      return key + ((key && group[key] && group[key].length > 1) ? ' x' + group[key].length + ' ' : '');
    });
    return garnishesWithMultipleSizes; //garnishes + garnishesOfGarnishGroup;
  }




  public priceWithDiscount(price) {
    
    if (price && this.discount && this.checkAvailabilityDiscount()) 
    {
      if ((this.discount.active || this.discount.alwaysActive) && +price >= +this.discount.minSum) 
      {
        if (this.discount.type === DiscountTypeEnum.Percent) 
        {
          if(this.userCouponValid && this.userCuponDiscount > 0)
          {
            this.order.IsCuponCode = true;
            this.order.CuponDiscountSum = this.userCuponDiscount;
            if (this.userCuponDiscountType === DiscountTypeEnum.Percent) 
              return this.roundPricePipe.transform(+price * ((100 - +this.discount.sum -+this.userCuponDiscount) / 100), 2);
            else
              return this.roundPricePipe.transform((+price -+ this.userCuponDiscount) * ((100 - +this.discount.sum ) / 100), 2);
          }
          else
          {
          return this.roundPricePipe.transform(+price * ((100 - +this.discount.sum) / 100), 2);
          }
          
        } else 
        { 
          if(this.userCouponValid && this.userCuponDiscount > 0)
          {
            this.order.IsCuponCode = true;
            this.order.CuponDiscountSum = this.userCuponDiscount;
            if (this.userCuponDiscountType === DiscountTypeEnum.Percent) 
              return this.roundPricePipe.transform((+price - +this.discount.sum) *((100-+this.userCuponDiscount) / 100) , 2);
            else  return this.roundPricePipe.transform(+price - +this.discount.sum  - +this.userCuponDiscount, 2);
          }
          else
          {
          return this.roundPricePipe.transform(+price - +this.discount.sum, 2);
          }
        }
      } else 
      {
        return this.roundPricePipe.transform(+price, 2);
      }
    } 
    else 
    {
      if (this.userCouponValid && this.userCuponDiscount > 0) 
      {
        this.order.IsCuponCode = true;
        this.order.CuponDiscountSum = this.userCuponDiscount;
        if (this.userCuponDiscountType === DiscountTypeEnum.Percent) 
          return this.roundPricePipe.transform(+price * ((100 - +this.userCuponDiscount) / 100), 2);
        else  return this.roundPricePipe.transform(+price - +this.userCuponDiscount, 2);
      } else 
      {
        return this.roundPricePipe.transform(+price, 2);
      }

    }
    return 0;
  }

  public calcDiscount(){

    let discount = 0;
    
    if (this.discount.type === DiscountTypeEnum.Percent) 
    {
      if(this.userCouponValid && this.userCuponDiscount > 0)
      {
        this.order.IsCuponCode = true;
        this.order.CuponDiscountSum = this.userCuponDiscount;
        return this.roundPricePipe.transform(this.order.Sum * (this.userCuponDiscount/100), 2);
      }
      else
      {
      return this.roundPricePipe.transform(this.order.Sum * (this.discount.sum/100), 2);
      }
      
    } else 
    { 
      if(this.userCouponValid && this.userCuponDiscount > 0)
      {
        this.order.IsCuponCode = true;
        this.order.CuponDiscountSum = this.userCuponDiscount;
        return this.roundPricePipe.transform(this.order.Sum * (this.userCuponDiscount)/100, 2);
      }
      else
      {
      return this.roundPricePipe.transform(this.order.Sum-this.discount.sum, 2);
      }
    }
  }

  public resultDiscountSum() {
    if (this.order) {
      return this.order.Sum - this.priceWithDiscount(this.order.Sum);
    } else {
      return 0;
    }
  }

  public resultDeliverySum(price, deliveryGroup) {
    let numericTotalPrice = parseFloat(price);
    if (!deliveryGroup) {
      return numericTotalPrice;
    }
    if (deliveryGroup &&
      deliveryGroup.DeliveryFee && parseFloat(deliveryGroup.DeliveryFee) == deliveryGroup.DeliveryFee &&
      numericTotalPrice && (numericTotalPrice >= deliveryGroup.MinSumForDelivery) &&
      (price < deliveryGroup.MinSumForFreeDelivery || !deliveryGroup.MinSumForFreeDelivery)) {
      return this.roundPricePipe.transform((numericTotalPrice + deliveryGroup.DeliveryFee), 2);
    } else {
      return numericTotalPrice;
    }
  }

  public displayDeliveryFeePrice(deliveryGroup: DeliveryGroupAppModel) {
    if (deliveryGroup && this.order) {
      if (deliveryGroup.MinSumForFreeDelivery != null && 
          deliveryGroup.MinSumForFreeDelivery != undefined &&
          deliveryGroup.MinSumForFreeDelivery > 0)
        return deliveryGroup.MinSumForFreeDelivery > this.resultSumWithoutDelivery(this.order.Sum) ? deliveryGroup.DeliveryFee : 0;
      else return deliveryGroup.DeliveryFee;
    } else return 0;
  }

  public resultTaxSum(price, usaTaxProc) {
    if (usaTaxProc && price) {
      let procMulti = (usaTaxProc / 100) + 1;
      return this.roundPricePipe.transform(price * procMulti, 2);
    } else {
      return price;
    }
  }

  public resultSum(price) {
 
   /* if (this.branch && this.branch.UsaTaxProc) {
      let resultForDeliveryGroup = this.resultDeliverySum(price, this.deliveryGroup);
      if (this.deliveryGroup &&
        this.deliveryGroup.DeliveryFee && parseFloat(this.deliveryGroup.DeliveryFee + '') == this.deliveryGroup.DeliveryFee &&
        price && (price >= this.deliveryGroup.MinSumForDelivery) && this.deliveryGroup.MinSumForFreeDelivery &&
        (price < this.deliveryGroup.MinSumForFreeDelivery || !this.deliveryGroup.MinSumForFreeDelivery)) {
        resultForDeliveryGroup = price;
        // console.log(price, 'first if')
      }
      if (resultForDeliveryGroup === price) {
        //console.log('resultForDeliveryGroup === price')

        return this.order && this.order.IsDelivery ?
          this.resultDeliverySum(this.resultTaxSum(this.priceWithDiscount(resultForDeliveryGroup), this.branch.UsaTaxProc), this.deliveryGroup)
          : this.resultTaxSum(this.priceWithDiscount(price), this.branch.UsaTaxProc);
      } else {
        //console.log('else')
        return this.order && this.order.IsDelivery ?
          this.resultTaxSum(this.priceWithDiscount(resultForDeliveryGroup), this.branch.UsaTaxProc)
          : this.resultTaxSum(this.priceWithDiscount(price), this.branch.UsaTaxProc);
      }

    } else {
      return this.order && this.order.IsDelivery ?
        this.priceWithDiscount(this.resultDeliverySum(price, this.deliveryGroup)) :
        this.priceWithDiscount(price);
       
    }*/
    //console.log("this.deliveryGroup",this.deliveryGroup);
    //console.log("this.resultSumWithoutDelivery(price)",this.resultSumWithoutDelivery(price));
    //console.log("this.displayDeliveryFeePrice(this.deliveryGroup)",this.displayDeliveryFeePrice(this.deliveryGroup));
    return this.order && this.order.IsDelivery ? 
    this.resultSumWithoutDelivery(price) + this.displayDeliveryFeePrice(this.deliveryGroup) :
    this.resultSumWithoutDelivery(price)
  }

  public resultSumWithoutDelivery(price) {
    if (this.branch && this.branch.UsaTaxProc) {
      return this.resultTaxSum(this.priceWithDiscount(price), this.branch.UsaTaxProc);
    } else {
      return this.priceWithDiscount(price);
    }
  }

  public resultSumWithoutDeliveryAndTax(price) {
    return this.priceWithDiscount(price);
  }

  public resultSumWithoutTax(price) {
    return this.order && this.order.IsDelivery ?
      this.priceWithDiscount(this.resultDeliverySum(price, this.deliveryGroup)) :
      this.priceWithDiscount(price);
  }

 /* private initializeBranchCities() {
    console.log("initializeBranchCities");
    this.isLoaded.isDeliveryDataLoaded = false;
    this.metadataService.getFranchiseWithBranches(this.appStorageService.orderType)
      .subscribe((result) => {
        if (result && Array.isArray(result.branches)) {
          const branchesById = result.branches.find((brn) => {
            return brn && brn.Id === this.order.BranchId;
          });
          if (branchesById) {            
            this.branch = branchesById;
            console.log(" this.branch = ", this.branch);
            this.metadataService
              .getDeliveryCitiesInformation(this.order.BranchId)
              .subscribe((result) => {
                this.cities = result;
                if (this.order && this.cities && this.cities.length > 0) {
                  if (!this.order.UserCity) {
                    if (this.user) {
                      this.order.UserCity = this.user.UserCity
                      // this.checkUserCityInListOfCities(this.user.UserCity) || '';
                    }
                    // this.order.UserCity = this.cities[0] ? this.cities[0].Name : '';
                  } else {
                    const findCity = this.cities.find((city) => {
                      return city && city.Name && this.user && this.order.UserCity &&
                        city.Name.toLowerCase() === this.order.UserCity.toLowerCase();
                    });
                    if (findCity) {
                      this.order.UserCity = findCity ? findCity.Name : '';
                    } else {
                      this.order.UserCity = this.order.UserCity || '';
                    }
                  }
                  this.citySettings(true);
                }
                this.isLoaded.isDeliveryDataLoaded = true;
              }, (error) => {
                this.isLoaded.isDeliveryDataLoaded = true;
                this.messageService.displayServerErrorMessage();
              });
          } else {
            this.isLoaded.isDeliveryDataLoaded = true;
          }
        } else {
          this.isLoaded.isDeliveryDataLoaded = true;
        }
      }, (error) => {
        this.isLoaded.isDeliveryDataLoaded = true;
        this.messageService.displayServerErrorMessage();
      });
  }*/



  private initializeGraphics() {
    console.log("initializeGraphics");
    this.graphics.logo = AppConfig.settings.logo;
    this.graphics.cover = AppConfig.settings.cover;
    this.colors.menuColor = AppConfig.settings.menuColor;
    this.colors.buttonColor = AppConfig.settings.buttonColor;
    console.log("-----------------------this.colors.buttonColor",this.colors.buttonColor)
    this.lang = this.translationsService.language();
    this.country = this.configService.country;
    this.cashSymbol = AppConfig.cashSymbol;
    //this.adapter.setLocale(this.lang);
  }

  public getColor() { return this.colors.menuColor != 'white' ? 'white' : 'black'; }

  private initializeOrder() {
    console.log("initializeOrder");
    this.order = this.orderService.getOrder();
    this.order.CibusReciptData = "";
    this.order.PayedByCibus = 0;
    this.order.PayedByTenbis = 0;
    this.order.PayedByCash = 0;
    this.order.PayedByCredit = 0;
    this.checkPaymentOptions();
    this.order.OrderCombos.forEach(combo => {
      combo.Items.forEach(item => {
        if (item.SpecialRequests != undefined && 
           item.SpecialRequests != null && 
           item.SpecialRequests.length > 0 )
            item.SpecialRequests = item.SpecialRequests.replace('undefined','');
        if (item.Comment != undefined && 
              item.Comment != null && 
              item.Comment.length > 0 )
          item.Comment = item.Comment.replace('undefined','');
      });
      combo.Pizzas.forEach(item => {
        if (item.SpecialRequests != undefined && 
          item.SpecialRequests != null && 
          item.SpecialRequests.length > 0 )
           item.SpecialRequests = item.SpecialRequests.replace('undefined','');
       if (item.Comment != undefined && 
             item.Comment != null && 
             item.Comment.length > 0 )
         item.Comment = item.Comment.replace('undefined','');
      });
    });
    this.order.OrderPizzas.forEach(item => {
      if (item.SpecialRequests != undefined && 
        item.SpecialRequests != null && 
        item.SpecialRequests.length > 0 )
         item.SpecialRequests = item.SpecialRequests.replace('undefined','');
     if (item.Comment != undefined && 
           item.Comment != null && 
           item.Comment.length > 0 )
       item.Comment = item.Comment.replace('undefined','');
    });
    this.order.OrderItems.forEach(orderItem => {
      orderItem.CatalogNumber = orderItem.Item.CatalogNumber;
      if (orderItem.SpecialRequests != undefined && 
        orderItem.SpecialRequests != null && 
        orderItem.SpecialRequests.length > 0 )
        orderItem.SpecialRequests = orderItem.SpecialRequests.replace('undefined','');
     if (orderItem.Comment != undefined && 
        orderItem.Comment != null && 
        orderItem.Comment.length > 0 )
        orderItem.Comment = orderItem.Comment.replace('undefined','');
    });
   /* if (this.order.IsDelivery && AppConfig.configSettings.deliveryDetailsAtCheckout)
    {
      this.displayAddressInformation((result)=>{
        if (result.isSaved) {
          this.orderService.recalculateSum();
          // if (this.order.CCTokens
           if (this.appStorageService.branch) {
             this.currentBranch = this.appStorageService.branch;
             this.metadataService.getBranchCuponCodes(this.currentBranch.Id)
            .subscribe((response) => { 
              // hideLoader();
              if (response) {
                console.log('getBranchCuponCodes',response);
                this.couponCodes = response;
              
              }
            }, error => {       
              console.log('getBranchCuponCodes - Error',error);
            });   
            // this.couponCodes = this.currentBranch.Coupons;
           }
           this.configService.currentUrl =window.location.hash;
        }
      });
    } else {*/
      this.orderService.recalculateSum();
      // if (this.order.CCTokens
       if (this.appStorageService.branch) {
         this.currentBranch = this.appStorageService.branch;
         this.metadataService.getBranchCuponCodes(this.currentBranch.Id)
        .subscribe((response) => { 
          // hideLoader();
          if (response) {
            console.log('getBranchCuponCodes',response);
            this.couponCodes = response;
          
          }
        }, error => {       
          console.log('getBranchCuponCodes - Error',error);
        });   
        // this.couponCodes = this.currentBranch.Coupons;
       }
       this.configService.currentUrl =window.location.hash;
  
  }

  public isOpenedBranchToday() {
   
    /*if (this.branch != null && this.branch != undefined) {
     
      return true;
    } else {
     
      return false;
    }*/
    return this.branch;// && this.branch.IsOpen;
  }

  public isAllValid() {
    console.log("this.isValidCountOfOrders()",this.isValidCountOfOrders());
    console.log("this.isSelectedTypePayment()",this.isSelectedTypePayment());
    console.log("this.isFilledFields()",this.isFilledFields());
    console.log("this.isCreditValidData()",this.isCreditValidData());
    console.log("this.isOpenedBranchToday()",this.isOpenedBranchToday());
    return this.isValidCountOfOrders() &&
      this.isSelectedTypePayment() && this.isFilledFields() &&
      this.isDeliveryConditionValid() &&
      this.isCreditValidData() && this.isOpenedBranchToday() && this.acceptTerms;
  }

  private isDeliveryConditionValid() {
    return this.order.IsDelivery ? this.deliveryGroup &&
      this.resultSumWithoutDelivery(this.order.Sum) >= this.deliveryGroup.MinSumForDelivery : true;
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

  private displayErrorFields() {
    this.acceptTermsError = !this.acceptTerms;
   // if (this.order &&  this.displayCompanyCode) this.orderErrors.Code = !this.trimField(this.order.Code);
    var pattern = new RegExp('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}');
    if (this.order && !this.order.IsDelivery) {
      if (this.paymentType === PaymentTypeEnum.cash) {
        this.orderErrors.FirstName = !this.trimField(this.order.FirstName);
        this.orderErrors.LastName = !this.trimField(this.order.LastName);
        if (this.forceEmail) this.orderErrors.Email = !pattern.test(this.order.Email.toString().trim());
       
      } else if (this.paymentType === PaymentTypeEnum.card) {
        this.orderErrors.FirstName = !this.trimField(this.order.FirstName);
        this.orderErrors.LastName = !this.trimField(this.order.LastName);
        if (this.forceEmail) this.orderErrors.Email = !pattern.test(this.order.Email.toString().trim());
        
        this.orderErrors.number = !(this.trimField(this.cashRegisterCreditCard.number) &&
          this.legalCC_Short(this.cashRegisterCreditCard.number) &&
          this.legalCC(this.cashRegisterCreditCard.number));
        this.orderErrors.cvv = !(this.trimField(this.cashRegisterCreditCard.cvv) && this.isCVV(this.cashRegisterCreditCard.cvv));
        this.orderErrors.ownerId = (this.country !== CountryEnum.US ?
          (!this.trimField(this.cashRegisterCreditCard.ownerId) ||
            !this.legalTz(this.cashRegisterCreditCard.ownerId)) : false);
        this.orderErrors.expirationYear = !this.trimField(this.cashRegisterCreditCard.expirationYear);
        this.orderErrors.expirationMonth = !this.trimField(this.cashRegisterCreditCard.expirationMonth);
      }
    } else if (this.order && this.order.IsDelivery) {
      if (this.paymentType === PaymentTypeEnum.cash) {
        this.orderErrors.FirstName = !this.trimField(this.order.FirstName);
        this.orderErrors.LastName = !this.trimField(this.order.LastName);
        this.orderErrors.UserCity = !this.trimField(this.order.UserCity);
        if (!AppConfig.configSettings.allowIncompletAddress) this.orderErrors.Street = !this.trimField(this.order.Street);
        if (!AppConfig.configSettings.allowIncompletAddress) this.orderErrors.StreetNum = !this.order.StreetNum;
        if (this.forceEmail) this.orderErrors.Email = !pattern.test(this.order.Email.toString().trim());
       
      } else if (this.paymentType === PaymentTypeEnum.card) {
        if (this.forceEmail) this.orderErrors.Email = !pattern.test(this.order.Email.toString().trim());
      
        this.orderErrors.FirstName = !this.trimField(this.order.FirstName);
        this.orderErrors.LastName = !this.trimField(this.order.LastName);
        this.orderErrors.UserCity = !this.trimField(this.order.UserCity);
        if (!AppConfig.configSettings.allowIncompletAddress) this.orderErrors.Street = !this.trimField(this.order.Street);
        if (!AppConfig.configSettings.allowIncompletAddress) this.orderErrors.StreetNum = !this.order.StreetNum;
        this.orderErrors.number = !(this.trimField(this.cashRegisterCreditCard.number) &&
          this.legalCC_Short(this.cashRegisterCreditCard.number) &&
          this.legalCC(this.cashRegisterCreditCard.number));
        this.orderErrors.cvv = !(this.trimField(this.cashRegisterCreditCard.cvv) && this.isCVV(this.cashRegisterCreditCard.cvv));
        this.orderErrors.ownerId = (this.country !== CountryEnum.US ?
          (!this.trimField(this.cashRegisterCreditCard.ownerId) ||
            !this.legalTz(this.cashRegisterCreditCard.ownerId)) : false);
        this.orderErrors.expirationYear = !this.trimField(this.cashRegisterCreditCard.expirationYear);
        this.orderErrors.expirationMonth = !this.trimField(this.cashRegisterCreditCard.expirationMonth);
      }
    }
  }

  private displayCCErrorFields() {
    this.orderErrors.number = !(this.trimField(this.ccWithToken.number) &&
    this.legalCC_Short(this.ccWithToken.number) &&
    this.legalCC(this.ccWithToken.number));
    this.orderErrors.cvv = !(this.trimField(this.ccWithToken.cvv) && this.isCVV(this.ccWithToken.cvv));
    this.orderErrors.ownerId = (this.country !== CountryEnum.US ?
    (!this.trimField(this.ccWithToken.ownerId) ||
      !this.legalTz(this.ccWithToken.ownerId)) : false);
    this.orderErrors.expirationYear = !this.trimField(this.ccWithToken.expirationYear);
    this.orderErrors.expirationMonth = !this.trimField(this.ccWithToken.expirationMonth);
    if (Number(this.ccWithToken.sum) == 0 || 
        Number(this.ccWithToken.sum) > this.resultSum(this.order.Sum) - this.sumPayed ) {
          this.orderErrors.sum = true;
        }
    
  }

  private displayCustomerErrorFields() {
  //  this.acceptTermsError = !this.acceptTerms;
    var pattern = new RegExp('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}');
   console.log("pattern.test(this.order.Email.toString().trim())",pattern.test(this.order.Email.toString().trim()));
   console.log("this.sendInvoice",this.sendInvoice);
  /* if (this.displayCompanyCode) {
     this.orderErrors.Code = !this.trimField(this.order.Code);
     console.log(" this.orderErrors.Code", this.orderErrors.Code);
   }*/
    this.orderErrors.FirstName = !this.trimField(this.order.FirstName);
    this.orderErrors.LastName = !this.trimField(this.order.LastName);
   if (this.forceEmail ) 
       this.orderErrors.Email = !pattern.test(this.order.Email.toString().trim());
    if (this.order && this.order.IsDelivery) {
      this.orderErrors.UserCity = !this.trimField(this.order.UserCity);
      if (!AppConfig.configSettings.allowIncompletAddress) this.orderErrors.Street = !this.trimField(this.order.Street);
      if (!AppConfig.configSettings.allowIncompletAddress) this.orderErrors.StreetNum = !this.order.StreetNum;
     
    }
    if(!this.acceptTerms) {
      document.getElementById("terms-alert").classList.add("show");    
      this.scrollToAlert();
    }
      
    if(this.acceptTerms){
    document.getElementById("terms-alert").classList.remove("show");   
    }
  }

  scrollToAlert() {
    if (this.alertRef && this.alertRef.nativeElement) {
      this.alertRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

   dateIsValid(date) {
    return date instanceof Date ;
  }

  private completeOrder(userWasNtSignedIn?) {
    console.log("completeOrder(userWasNtSignedIn?)")
    const loginToken = this.appStorageService
      .getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.configService.franchiseId);
      console.log("loginToken",loginToken);
    if (loginToken) {
      this.isLoaded.isValidationUserLoaded = false;
      this.signInOutService.verifyToken(loginToken).subscribe((response) => {
        this.isLoaded.isValidationUserLoaded = true;
        const result = response ? !!response.user : !!response;
        console.log("result",result);
        if (result) {
          const completePayment = () => {
            console.log("completePayment");
            if (this.order.IsFutureOrder) {
              if (this.order.FutureDate != null && 
                  this.order.FutureDate != undefined && 
                  this.order.FutureDate != "" && this.order.FutureDate.length == 8){
                    var dateArr = this.order.FutureDate.split('/');
                    var year = "20" + dateArr[2];
                   // var month = "";
                    //if (dateArr[1].startsWith("0")) month = 
                    this.order.FutureDate = year + "-" + dateArr[1] + "-" + dateArr[0] 
                  }
            }
            
            /// Workaround for Combo Items  ComboItemId
            if (this.order.OrderCombos && this.order.OrderCombos.length > 1) {
              for (var i = 1; i < this.order.OrderCombos.length; i++) {
                if (this.order.OrderCombos[i].Items && this.order.OrderCombos[i].Items.length > 0) {
                  this.order.OrderCombos[i].Items.forEach((item: OrderItemAppModel) => {
                    item.ComboItemId = item.ComboItemId * i * 10;
                  });
                }
              
              }

            }
            /// End of Workaround for Combo Items  ComboItemId
            console.log("!!!!!this.paymentType",this.paymentType);
            if (this.paymentType) {
              if(this.paymentType == PaymentTypeEnum.multi){
                this.paymentType = PaymentTypeEnum.card;
                console.log("!!!!!this.paymentType",this.paymentType);
              }
              if (this.branch) {
                let method = -1;
                if (this.order.IsDelivery) {
                  method = 0;
                } else if (this.order.IsTakeAway) {
                  method = 1;
                } else  {
                  method = 2;
                }
           
                this.isLoaded.isBranchOpenLoaded = false;

                if ( !this.order.IsFutureOrder) {
                  console.log("this.order.IsFutureOrder",this.order.IsFutureOrder)
                    this.metadataService.isOpenForPickupMethod(this.order.BranchId, method).subscribe((response) => {
                      this.isLoaded.isBranchOpenLoaded = true;
                      this.branch.IsOpen = response;
                      if (!this.branch.IsOpen ) {//&& !this.order.IsFutureOrder
                        this.showLoader = false;
                        this.closedBranchMessage();
                      } else {
                        switch (this.paymentType) {
                          case PaymentTypeEnum.card: {
                            this.cardPayment();
                            break;
                          }
                          case PaymentTypeEnum.sibus: {
                            if (this.multiPayers ) {
                              if (this.cibusSplittedPaymentType == 'credit') {
                                this.cardPayment();
                                break;
                              } else {
                                this.cashPayment();
                                break;
                              }
                            } else {
                              this.sibusPayment();
                              break;
                            }
                            
                          }
                          case PaymentTypeEnum.tenbis: {
                            if (this.multiPayers ) {
                              if (this.cibusSplittedPaymentType == 'credit') {
                                this.cardPayment();
                                break;
                              } else {
                                this.cashPayment();
                                break;
                              }
                            }  else {
                              this.tenbisPayment();
                              break;
                            }
                            
                          }
                          case PaymentTypeEnum.cash: {
                            this.cashPayment();
                            break;
                          }
                          case PaymentTypeEnum.biteCredit: {
                            this.cashPayment();
                            break;
                          }
                          default: {
                            this.isLoaded.isPaymentSettingsLoaded = true;
                          }
                        }
                      }
                    }, (error) => {
                      this.isLoaded.isBranchOpenLoaded = true;
                      this.messageService.displayServerErrorMessage();
                    });
                } else {
                  this.metadataService.BranchOpenForPickupMethod(this.order.BranchId, method)
                      .subscribe((response) => {
                         this.isLoaded.isBranchOpenLoaded = true;
                          let closed: boolean = false;
                          const now = new Date();
                          const currentTime = now.toTimeString().slice(0, 5); // "14:45" 
                          if ( this.order.FutureDate == "" && this.isValidTimeString(this.order.FutureTime) &&
                               !this.isWithinWorkingHours(this.order.FutureTime,response.OpeningTime,response.ClosingTime)){
                              closed = true; 
                          } else if (this.order.FutureDate != "" && this.order.FutureDateModel != undefined) {
                            const futureday = response.FurureDates.find(item => item.Date === this.order.FutureDateModel.Date);
                            if (futureday != undefined)
                              if (!this.isWithinWorkingHours(this.order.FutureTime, futureday.OpeningTime, futureday.ClosingTime))
                                closed = true;
                          }
 
                    
                          if (closed ) {//&& !this.order.IsFutureOrder
                         
                            this.showLoader = false;
                               console.log("closed", this.showLoader)
                            this.closedBranchMessage();
                          }  else {
                            switch (this.paymentType) {
                              case PaymentTypeEnum.card: {
                                this.cardPayment();
                                break;
                              }
                              case PaymentTypeEnum.sibus: {
                                if (this.multiPayers ) {
                                  if (this.cibusSplittedPaymentType == 'credit') {
                                    this.cardPayment();
                                    break;
                                  } else {
                                    this.cashPayment();
                                    break;
                                  }
                                } else {
                                  this.sibusPayment();
                                  break;
                                }
                                
                              }
                              case PaymentTypeEnum.tenbis: {
                                if (this.multiPayers ) {
                                  if (this.cibusSplittedPaymentType == 'credit') {
                                    this.cardPayment();
                                    break;
                                  } else {
                                    this.cashPayment();
                                    break;
                                  }
                                }  else {
                                  this.tenbisPayment();
                                  break;
                                }
                                
                              }
                              case PaymentTypeEnum.cash: {
                                this.cashPayment();
                                break;
                              }
                              case PaymentTypeEnum.biteCredit: {
                                this.cashPayment();
                                break;
                              }
                              default: {
                                this.isLoaded.isPaymentSettingsLoaded = true;
                              }
                            }
                          }
                    
                    
                    }, () => {
                              this.isLoaded.isCashPaymentLoaded = true;
                              this.messageService.displayServerErrorMessage();
                    });  
              }
       



                
              }
            }
          }
          if (userWasNtSignedIn) {
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
          } else {
            completePayment();
          }
        } else {
          this.signInOutService.signOut();
          this.checkedUserSigning(result);
          this.loadSignInForm();
        }
      }, (error) => {
        this.isLoaded.isValidationUserLoaded = true;
        this.isLoaded.isDiscountLoaded = true;
        this.checkedUserSigning();
        this.messageService.displayServerErrorMessage();
      });
    }
  }



   isWithinWorkingHours(currentTime: string, openTime: string, closeTime: string): boolean {
  const [hC, mC] = currentTime.split(':').map(Number);
  const [hO, mO] = openTime.split(':').map(Number);
  const [hCl, mCl] = closeTime.split(':').map(Number);

  const current = hC * 60 + mC;
  const open = hO * 60 + mO;
  const close = hCl * 60 + mCl;

  // Case 1: Normal same-day range (e.g. 08:00–20:00)
  if (open < close) {
    return current >= open && current <= close;
  }

  // Case 2: Overnight range (e.g. 05:00–02:00 next day)
  return current >= open || current <= close;
}
  public loadSignInForm() {
    let position: any;
    if(this.isMobileMode()){
      position = {top: '5vh'};
    }
    else{
       position = {} 
    }
    console.log("loadSignInForm")
    const matDialogRef = this.matDialog.open(DialogSignInComponent, {
      data: {
        isFirst: false,
      },
      width: '40%',
      maxWidth: '518px',
      minWidth: '346px',
      position: position,
      panelClass: ['padding-small-container', 'custom-mat-dialog-mobile'],
      disableClose: true,
    });
    matDialogRef.componentInstance.isSignLoaded
      .subscribe((result) => {
        console.log("matDialogRef.isSignLoaded()", result);
        this.isLoaded.isSignInLoaded = result;
      });
    matDialogRef.componentInstance.signInCompleted
      .subscribe((result) => {
        console.log("matDialogRef.signInCompleted()", result);
        this.loadOrderUserDataToUser(this.order);
        this.isSignedUser = result;
        if (this.isSignedUser) {
          this.showLoader = true;
          this.completeOrder(true);
        }
      });
    matDialogRef.afterClosed().subscribe((result: any) => {
      console.log("matDialogRef.afterClosed()", result);
      if (result == undefined) {
        localStorage.removeItem(window.location.hash);
        this.router.navigate([`/${this.franchiseId}/menu`]);
      }
    });
  };

  public loadSignInForm_new() {
    let position: any;
    if(this.isMobileMode()){
      position = {top: '5vh'};
    }
    else{
       position = {} 
    }
    console.log("loadSignInForm_new")
    const matDialogRef = this.matDialog.open(DialogSignInComponent, {
      data: {

      },
      width: '40%',
      maxWidth: '518px',
      minWidth: '346px',
      position: position,
      panelClass: ['padding-small-container', 'custom-mat-dialog-mobile'],
      disableClose: true,
    });
    matDialogRef.componentInstance.isSignLoaded
      .subscribe((result) => {
        console.log("matDialogRef.isSignLoaded()", result);
        this.isLoaded.isSignInLoaded = result;
      });
    matDialogRef.componentInstance.signInCompleted
      .subscribe((result) => {
        console.log("matDialogRef.signInCompleted()", result);
        this.loadOrderUserDataToUser(this.order);
        this.isSignedUser = result;
        if (this.isSignedUser) {
          this.verifyToken(true);
         // this.completeOrder(true);
        }
      });
    matDialogRef.afterClosed().subscribe((result: any) => {
      console.log("matDialogRef.afterClosed()", result);
      if (result == undefined) {
        localStorage.removeItem(window.location.hash);
        this.router.navigate([`/${this.franchiseId}/menu`]);
      }
    });
  };

  public updateUser() {
    this.signInOutService.updateUserDetails(this.user).subscribe((result) => {
      console.log("Order: result - update user", result);
      if (result) {
        console.log("result update user points", result);
      }

    }, (error) => {
      console.log("error update user");
    });
  }

  public payment() {

    console.log("this.acceptTerms",this.acceptTerms)

    //if(!this.acceptTerms) document.getElementById("terms-alert").classList.add("show");    
      
    if(this.acceptTerms){
   // document.getElementById("terms-alert").classList.remove("show");    

    //CLUB MEMBER


      
     /* const message = this.translationService.translate('MESSAGE_SUCCESS_ADD_TO_CART');
      const matDialogRef = this.matDialog.open(MessagePopupComponent, {
        data: {
          message
        },
        minWidth: '400px',
        disableClose: true,
        panelClass: 'custom-mat-dialog'
      });
      */
    if (this.paymentType == 'biteCredit'){
      if (this.resultSum(this.order.Sum) > this.user.BiteCredit) return
    }
    console.log("payment2222");
    this.clearErrorFields();
    if (this.isAllValid()) {
     // console.log("payment this.isAllValid()",this.isAllValid());

      const loginToken = this.appStorageService
        .getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.configService.franchiseId);
      if (!loginToken) {
        this.showLoader = false;
        this.loadSignInForm();
      } else {
        this.showLoader = true;
        this.completeOrder();
      }
    } else {
      console.log("payment !this.isAllValid()",this.isAllValid()); 
      if (this.multiPayment)  {
        this.showLoader = true;
        this.completeOrder();
      } else {
        this.showLoader = false;
      }
      this.displayErrorFields();
      if (this.deliveryGroup && this.order &&
        this.deliveryGroup.MinSumForDelivery > this.resultSumWithoutDelivery(this.order.Sum)) {
        this.displayDeliveryConditionDialog();
      }
    }
    }
  }

  public paymentMobile() {

    console.log("PAYMENT MOBILE()")

   // console.log("this.acceptTerms",this.acceptTerms)

   // if(!this.acceptTerms) document.getElementById("terms-alert").classList.add("show");    
      
    if(this.acceptTerms){
   // document.getElementById("terms-alert").classList.remove("show");  
    
    //CLUB MEMBER


      
     /* const message = this.translationService.translate('MESSAGE_SUCCESS_ADD_TO_CART');
      const matDialogRef = this.matDialog.open(MessagePopupComponent, {
        data: {
          message
        },
        minWidth: '400px',
        disableClose: true,
        panelClass: 'custom-mat-dialog'
      });
      */
    
    console.log("payment2222");
    this.clearErrorFields();
    if (this.isAllValid()) {
     // console.log("payment this.isAllValid()",this.isAllValid());

      const loginToken = this.appStorageService
        .getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.configService.franchiseId);
      if (!loginToken) {
        this.showLoader = false;
        this.loadSignInForm();
      } else {
        this.showLoader = true;
        this.completeOrder();
      }
    } else {
      console.log("payment !this.isAllValid()",this.isAllValid()); 
      if (this.multiPayment)  {
        this.showLoader = true;
        this.completeOrder();
      } else {
        this.showLoader = false;
      }
      this.displayErrorFields();
      if (this.deliveryGroup && this.order &&
        this.deliveryGroup.MinSumForDelivery > this.resultSumWithoutDelivery(this.order.Sum)) {
        this.displayDeliveryConditionDialog();
      }
    }
    }
  }

  public removeExpirationErrors() {
    this.removeErrorWhileFocus('expirationMonth');
    this.removeErrorWhileFocus('expirationYear');
  }

  public removeErrorWhileFocus(field) {
    if (this.orderErrors && field && this.orderErrors[field]) {
      this.orderErrors[field] = false;
    }
  }


 // private prepareDataForOrderToPay(order) {
    //order.DateTime = new Date();
  //}
  private preparePelecardOrderForServer(order) {
    const orderForServer = this.commonFunctionsService.deepCopy(order);
    if (orderForServer.OrderCombos) {
      for (let i = 0; i < order.OrderCombos.length; i++) {
        orderForServer.OrderCombos[i].Price =this.itemComboPrice(order.OrderCombos[i],);
      }
       
    }
    if (orderForServer.OrderItems) {
      for (let i = 0; i < order.OrderItems.length; i++) {
        orderForServer.OrderItems[i].Price =this.itemPrice(order.OrderItems[i],false);
      }
    }
    if (orderForServer.OrderPizzas) {
      for (let i = 0; i < order.OrderPizzas.length; i++) {
        orderForServer.OrderPizzas[i].Price =this.itemPrice(order.OrderPizzas[i],true);
      }
    }
    if (order.IsDelivery) 
      orderForServer.DeliveryFee = this.displayDeliveryFeePrice(this.deliveryGroup);
    else orderForServer.DeliveryFee=0;
    if (this.checkAvailabilityDiscount()) 
      orderForServer.DiscountSum = this.calcDiscount();
    else orderForServer.DiscountSum =0;
    orderForServer.Sum = this.resultSum(this.order.Sum);
    return orderForServer;
  }
  private prepareOrderForServer(order) {

    console.log("!!!!!!!!!!!!!!order", order);
    const itemsToKeep = ['Amount', 'Price','CatalogNumber','Garnishes', 'ItemId','Items', 'ParentItemId','IsScratchCoupon', 'IsCombo', 'GroupItemId', 'Price',
      'ScratchCouponId', 'SpecialRequests', 'Comments','IsClubMemberItem','IsJoinBenefitItem','IsBDayBenefitItem','IsAnnBenefitItem','Name'];
    const pizzasToKeep = ['Amount', 'Price','PizzaId', 'SizeId', 'Toppings','FullPizza',
      'SpecialRequests', 'Comments','Garnishes','Name'];
    const paymentToRemove = [];
    if (order) {
    if (order.Premise !=undefined && order.Premise != null) {
      if (order.Premise?.length > 1) order.DeliveryComments = order.Premise + " " + order.DeliveryComments;
    }
      var dataLayerItems =[];
      var content_ids=[];
      var contents=[];

      
        for (let i = 0; i < order.OrderCombos.length; i++) {
          const orderCombo = order.OrderCombos[i];
          var dataLayerItem={
            "item_id": orderCombo.ComboId,
            "item_name":orderCombo.Name,
            "price":this.itemComboPrice(orderCombo)
          }
          console.log("dataLayerItem",dataLayerItem);          
          dataLayerItems.push(dataLayerItem);      
          content_ids.push(orderCombo.ComboId)  ;
          contents.push({id:orderCombo.ComboId,quantity:orderCombo.Amount}); 

        }

         

      if (order.OrderItems) {
        for (let i = 0; i < order.OrderItems.length; i++) {
          console.log("order.OrderItems[i]",order.OrderItems[i]); 
          console.log("order.OrderItems[i].Item",order.OrderItems[i].Item);
          if(this.currentBranch.UseInventory &&   order.OrderItems[i].Item)  
          order.OrderItems[i].CatalogNumber =  order.OrderItems[i].Item.CatalogNumber;
          const orderItem = order.OrderItems[i];
          var dataLayerItem={
            "item_id": orderItem.ItemId,
            "item_name":orderItem.Name,
            "price":this.itemPrice(orderItem,false)
          }
          console.log("dataLayerItem",dataLayerItem);          
          dataLayerItems.push(dataLayerItem);
          content_ids.push(orderItem.ItemId)  ;
          contents.push({id:orderItem.ItemId,quantity:orderItem.Amount}); 
         

          let keys = Object.keys(orderItem);
          keys.forEach((key) => {
            if (!itemsToKeep.some((itemToKeep) => {
              return key === itemToKeep;
            })) {
              delete orderItem[key];
            }
          });
        }
      }

      if (order.OrderPizzas) {
        for (let i = 0; i < order.OrderPizzas.length; i++) {
          const orderPizza = order.OrderPizzas[i];
          var dataLayerItem={
            "item_id": orderPizza.PizzaId,
            "item_name":orderPizza.Name,
            "price":this.itemPrice(orderPizza,true)
          }
          console.log("dataLayerItem",dataLayerItem);          
          dataLayerItems.push(dataLayerItem);
          content_ids.push(orderPizza.PizzaId)  ;
          contents.push({id:orderPizza.PizzaId,quantity:orderPizza.Amount}); 
         

          const pizzaSizeId = orderPizza.FullPizza.SelectedPizzaPriceSize.PizzaSizeId || 0;
          const pizzaFullPizzaAmount = orderPizza.FullPizza.Amount || 1;
          const pizzaAmount = orderPizza.Amount || 1;
          let keys = Object.keys(orderPizza);
          keys.forEach((key) => {
            if (!pizzasToKeep.some((itemToKeep) => {
              return key === itemToKeep;
            })) {
              delete orderPizza[key];
            }
          });
          if (pizzaSizeId) {
            orderPizza.SizeId = pizzaSizeId;
          }
          if (pizzaAmount != pizzaFullPizzaAmount) {
            orderPizza.Amount = pizzaFullPizzaAmount > pizzaAmount ? pizzaAmount : pizzaFullPizzaAmount;
          } else { }
          console.log("preper for server - orderPizza",orderPizza);
        }

        console.log("preper for server - order.OrderPizzas",order.OrderPizzas);
 
      }

      let orderKeys = Object.keys(order);
    /*  for (let j = 0; j < orderKeys.length; j++) {
        let orderKey = orderKeys[j];
        if (paymentToRemove.some((k) => {
          return k === orderKey;
        })) {
          delete order[orderKey];
        }
      }*/
      if (!order.Phone) {
        console.log("!order.Phone this.user.Phone",this.user.Phone);
        if (this.user && this.user.Phone) {
          order.Phone = this.user.Phone;
        }
      }
    }
    window['dataLayer'].push({
      'event': 'purchase',
      'transaction_id':this.getGuid(),
      'value': this.resultSum(order.Sum),
      'coupon':this.order.CouponCode,
      'currency':'ILS',
      'items': dataLayerItems,
      'content_ids': content_ids,
      'content_name': 'checkout',
      'content_type': 'product_group',
      'num_items': dataLayerItems.length,
      'contents':contents
  
   });
    return order;
  }


  S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }

  getGuid() {
    return (this.S4() + this.S4() + "-" + this.S4() + "-4" + 
            this.S4().substr(0, 3) + "-" + this.S4() + "-" + 
            this.S4() + this.S4() + this.S4()).toLowerCase();
  }

  public cashPayment() {
    console.log("cashPayment");
    if (this.order) {
      if (this.paymentType == PaymentTypeEnum.biteCredit){
        this.order.Payment = PaymentTypeEnum.biteCredit;
        this.order.BiteCredit = this.resultSum(this.order.Sum);
      }
        
      else this.order.Payment = PaymentTypeEnum.cash;
      const order = this.commonFunctionsService.deepCopy(this.order);
      if (this.isAvailableScratchCoupon()) {
        const prepareForOrderItem =
          this.prepareItemForOrder(this.scratchCoupon.CurrentItem, true, this.scratchCoupon);
        order.OrderItems.push(prepareForOrderItem);
        // this.appStorageService.isUsedScratchCoupon = true;
        // this.appStorageService.useScratchCoupon = false;
      }
   //   this.prepareDataForOrderToPay(order);
      const loginToken = this.appStorageService
        .getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.configService.franchiseId);
      if (this.paymentData == undefined) {
        this.paymentData = {};
      }
      this.isLoaded.isCashPaymentLoaded = false;
      let method = -1;
      if (this.order.IsDelivery) {
        method = 0;
      } else if (this.order.IsTakeAway) {
        method = 1;
      } else  {
        method = 2;
      }
 
      if ( !this.order.IsFutureOrder) {
          this.metadataService.isOpenForPickupMethod(this.order.BranchId, method)
        .subscribe((response) => {
          const isOpen = response;
          if (!isOpen ) {//&& !this.order.IsFutureOrder
            this.isLoaded.isCashPaymentLoaded = true;
            this.closedBranchMessage();
          }  else {
           
            this.loadOrderUserDataToUser(this.user);
            this.signInOutService.updateUserDetails(this.user)
              .subscribe((reslt) => {
                if (this.multiPayers && (this.order.PayedByCibus > 0 || this.order.PayedByTenbis > 0)){
                  this.order.CibusReciptData = JSON.stringify(this.cibusPayersArray);
                  this.order.TenbisReciptData = JSON.stringify(this.tenbisPayersArray);
                  this.paymentService
                    .SplittedPaymentRequestCibusTenbisCash(this.prepareOrderForServer(this.order), loginToken)
                    .subscribe((response) => {
                      this.isLoaded.isCashPaymentLoaded = true;
                      this.paymentCallBack(response);
            
                     
                    }, (error) => {
                      this.isLoaded.isCashPaymentLoaded = true;
                      this.messageService.displayServerErrorMessage();
                    });
                } else if (this.cashRegister && this.cashRegister.isUseCashRegister) {
                  let encryptedCreditCard = ''; // if we will save credit card in the future
                  this.paymentService
                    .paymentRequestCashRegister(this.prepareOrderForServer(order), loginToken, encryptedCreditCard)
                    .subscribe((response) => {


                      ///workaround for Dangot: because of a bug in BiteAPI
                      if (this.cashRegister.cashRegisterType == "Dangot") {
                        // response.Data.success=true;
                      }
                      ///
                      this.isLoaded.isCashPaymentLoaded = true;
                      this.paymentCallBack(response);
                    }, (error) => {
                      this.isLoaded.isCashPaymentLoaded = true;
                      this.messageService.displayServerErrorMessage();
                    });
                } else {
                  // this.tranzilaSettings();
                  this.paymentService.paymentRequest(this.prepareOrderForServer(order), loginToken,
                    this.paymentData.tranzilaToken, this.paymentData.expdate)
                    .subscribe((response) => {
                      this.isLoaded.isCashPaymentLoaded = true;
                      this.paymentCallBack(response);
                    }, () => {
                      this.isLoaded.isCashPaymentLoaded = true;
                      this.messageService.displayServerErrorMessage();
                    });
                }
              }, () => {
                this.isLoaded.isCashPaymentLoaded = true;
                this.messageService.displayServerErrorMessage();
              });
          }
        }, () => {
          this.isLoaded.isCashPaymentLoaded = true;
          this.messageService.displayServerErrorMessage();
        });
      } else {
         
        this.metadataService.BranchOpenForPickupMethod(this.order.BranchId, method)
        .subscribe((response) => {
           this.isLoaded.isBranchOpenLoaded = true;
          let closed: boolean = false;
          const now = new Date();
          const currentTime = now.toTimeString().slice(0, 5); // "14:45"      
          if ( this.order.FutureDate == "" &&  this.isValidTimeString(this.order.FutureTime) &&
                               !this.isWithinWorkingHours(this.order.FutureTime,response.OpeningTime,response.ClosingTime)){
                              closed = true; 
          } else if ( this.order.FutureDate != "" && this.order.FutureDateModel != undefined){
                  const futureday = response.FurureDates.find(item => item.Date === this.order.FutureDateModel.Date);
                  if (futureday != undefined)
                    if ( !this.isWithinWorkingHours(this.order.FutureTime,futureday.OpeningTime,futureday.ClosingTime))
                    closed = true; 
          }
         
          if (closed ) {//&& !this.order.IsFutureOrder
            this.isLoaded.isCashPaymentLoaded = true;
            this.closedBranchMessage();
          }  else {
           
            this.loadOrderUserDataToUser(this.user);
            this.signInOutService.updateUserDetails(this.user)
              .subscribe((reslt) => {
                if (this.multiPayers && (this.order.PayedByCibus > 0 || this.order.PayedByTenbis > 0)){
                  this.order.CibusReciptData = JSON.stringify(this.cibusPayersArray);
                  this.order.TenbisReciptData = JSON.stringify(this.tenbisPayersArray);
                  this.paymentService
                    .SplittedPaymentRequestCibusTenbisCash(this.prepareOrderForServer(this.order), loginToken)
                    .subscribe((response) => {
                      this.isLoaded.isCashPaymentLoaded = true;
                      this.paymentCallBack(response);
            
                     
                    }, (error) => {
                      this.isLoaded.isCashPaymentLoaded = true;
                      this.messageService.displayServerErrorMessage();
                    });
                } else if (this.cashRegister && this.cashRegister.isUseCashRegister) {
                  let encryptedCreditCard = ''; // if we will save credit card in the future
                  this.paymentService
                    .paymentRequestCashRegister(this.prepareOrderForServer(order), loginToken, encryptedCreditCard)
                    .subscribe((response) => {


                      ///workaround for Dangot: because of a bug in BiteAPI
                      if (this.cashRegister.cashRegisterType == "Dangot") {
                        // response.Data.success=true;
                      }
                      ///
                      this.isLoaded.isCashPaymentLoaded = true;
                      this.paymentCallBack(response);
                    }, (error) => {
                      this.isLoaded.isCashPaymentLoaded = true;
                      this.messageService.displayServerErrorMessage();
                    });
                } else {
                  // this.tranzilaSettings();
                  this.paymentService.paymentRequest(this.prepareOrderForServer(order), loginToken,
                    this.paymentData.tranzilaToken, this.paymentData.expdate)
                    .subscribe((response) => {
                      this.isLoaded.isCashPaymentLoaded = true;
                      this.paymentCallBack(response);
                    }, () => {
                      this.isLoaded.isCashPaymentLoaded = true;
                      this.messageService.displayServerErrorMessage();
                    });
                }
              }, () => {
                this.isLoaded.isCashPaymentLoaded = true;
                this.messageService.displayServerErrorMessage();
              });
          }

        }, () => {
          this.isLoaded.isCashPaymentLoaded = true;
          this.messageService.displayServerErrorMessage();
        });
      }

    }
  }

  isValidTimeString(value: string): boolean {
    // Must match exactly "HH:mm" format
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return timeRegex.test(value.trim());
  }


  isTimeAfter(time1: string, time2: string): boolean {
    const [h1, m1] = time1.split(':').map(Number);
    const [h2, m2] = time2.split(':').map(Number);
    return h1 > h2 || (h1 === h2 && m1 > m2);
  }


  public MeshulamPayment( paymentMethod, confirmationNumber, numberOfPayments) {
    console.log("MeshulamPayment");
    if (this.order) {
      this.order.Payment = PaymentTypeEnum.cash;
      const order = this.commonFunctionsService.deepCopy(this.order);
      if (this.isAvailableScratchCoupon()) {
        const prepareForOrderItem =
          this.prepareItemForOrder(this.scratchCoupon.CurrentItem, true, this.scratchCoupon);
        order.OrderItems.push(prepareForOrderItem);
      }
   //   this.prepareDataForOrderToPay(order);
      const loginToken = this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.franchiseId);
     ///if (this.paymentData == undefined) {
        this.paymentData = {};
     // }
      this.isLoaded.isCreditPaymentLoaded = false;
      let method = -1;
      if (this.order.IsDelivery) {
        method = 0;
      } else if (this.order.IsTakeAway) {
        method = 1;
      } else  {
        method = 2;
      }
      this.metadataService.isOpenForPickupMethod(this.order.BranchId, method)
        .subscribe((response) => {
          const isOpen = response;
          if (!isOpen && !this.order.IsFutureOrder) {
            this.isLoaded.isCreditPaymentLoaded = true;
            this.closedBranchMessage();
          } else {
            this.loadOrderUserDataToUser(this.user);
            this.signInOutService.updateUserDetails(this.user)
              .subscribe((reslt) => {
                
                  
                /*  this.meshulamService
                      .paymentRequestMeshulam(this.prepareOrderForServer(order),
                                              this.meshulamProcessId,
                                              this.meshulamProcessToken, 
                                              loginToken).subscribe((response) => {
                          this.isLoaded.isCreditPaymentLoaded = true;
                          this.showLoader = false;
                          this.paymentCallBack(response);
                  }, () => {
                      this.showLoader = false;
                      this.isLoaded.isCreditPaymentLoaded = true;
                      this.messageService.displayServerErrorMessage();
                    });*/

                    this.meshulamService
                      .paymentRequestMeshulamSDK(this.prepareOrderForServer(order),
                                                paymentMethod, 
                                                confirmationNumber, 
                                                numberOfPayments,
                                                loginToken).subscribe((response) => {
                          this.isLoaded.isCreditPaymentLoaded = true;
                          this.showLoader = false;
                          this.paymentCallBack(response);
                  }, () => {
                      this.showLoader = false;
                      this.isLoaded.isCreditPaymentLoaded = true;
                      this.messageService.displayServerErrorMessage();
                    });
                
              }, () => {
                this.showLoader = false;
                this.isLoaded.isCreditPaymentLoaded = true;
                this.messageService.displayServerErrorMessage();
              });
          }
        }, () => {
          this.showLoader = false;
          this.isLoaded.isCreditPaymentLoaded = true;
          this.messageService.displayServerErrorMessage();
        });
    }
  }

  public TranzilaIframeSendOrder(confirmationNumber) {
    console.log("TranzilaIframeSendOrder");
    if (this.order) {
      this.order.Payment = "prepaidCredit";
      const order = this.commonFunctionsService.deepCopy(this.order);
      if (this.isAvailableScratchCoupon()) {
        const prepareForOrderItem =
          this.prepareItemForOrder(this.scratchCoupon.CurrentItem, true, this.scratchCoupon);
        order.OrderItems.push(prepareForOrderItem);
      }
   //   this.prepareDataForOrderToPay(order);
      const loginToken = this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.franchiseId);
     ///if (this.paymentData == undefined) {
        this.paymentData = {};
     // }
      this.isLoaded.isCreditPaymentLoaded = false;
      let method = -1;
      if (this.order.IsDelivery) {
        method = 0;
      } else if (this.order.IsTakeAway) {
        method = 1;
      } else  {
        method = 2;
      }
      this.metadataService.isOpenForPickupMethod(this.order.BranchId, method)
        .subscribe((response) => {
          const isOpen = response;
          if (!isOpen && !this.order.IsFutureOrder) {
            this.isLoaded.isCreditPaymentLoaded = true;
            this.closedBranchMessage();
          } else {
            this.loadOrderUserDataToUser(this.user);
            this.signInOutService.updateUserDetails(this.user)
              .subscribe((reslt) => {
                this.paymentService
                      .PaymentRequestTranzilaIframe(this.prepareOrderForServer(order),
                                                confirmationNumber, 
                                                loginToken).subscribe((response) => {
                          this.isLoaded.isCreditPaymentLoaded = true;
                          this.showLoader = false;
                          this.paymentCallBack(response);
                  }, () => {
                      this.showLoader = false;
                      this.isLoaded.isCreditPaymentLoaded = true;
                      this.messageService.displayServerErrorMessage();
                    });
                
              }, () => {
                this.showLoader = false;
                this.isLoaded.isCreditPaymentLoaded = true;
                this.messageService.displayServerErrorMessage();
              });
          }
        }, () => {
          this.showLoader = false;
          this.isLoaded.isCreditPaymentLoaded = true;
          this.messageService.displayServerErrorMessage();
        });
    }
  }

  public PelecardIframeSendOrder(confirmationNumber, transactionId) {
    console.log("PelecardIframeSendOrder");
    if (this.order) {
      this.order.Payment = "prepaidCredit";
      const order = this.commonFunctionsService.deepCopy(this.order);
      if (this.isAvailableScratchCoupon()) {
        const prepareForOrderItem =
          this.prepareItemForOrder(this.scratchCoupon.CurrentItem, true, this.scratchCoupon);
        order.OrderItems.push(prepareForOrderItem);
      }
   //   this.prepareDataForOrderToPay(order);
      const loginToken = this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.franchiseId);
     ///if (this.paymentData == undefined) {
        this.paymentData = {};
     // }
      this.isLoaded.isCreditPaymentLoaded = false;
      let method = -1;
      if (this.order.IsDelivery) {
        method = 0;
      } else if (this.order.IsTakeAway) {
        method = 1;
      } else  {
        method = 2;
      }
      this.metadataService.isOpenForPickupMethod(this.order.BranchId, method)
        .subscribe((response) => {
          const isOpen = response;
          if (!isOpen && !this.order.IsFutureOrder) {
            this.isLoaded.isCreditPaymentLoaded = true;
            this.closedBranchMessage();
          } else {
            this.loadOrderUserDataToUser(this.user);
            this.signInOutService.updateUserDetails(this.user)
              .subscribe((reslt) => {
                this.paymentService
                      .PaymentRequestPelecardIframe(this.prepareOrderForServer(order),
                                                confirmationNumber, transactionId, this.resultSum(this.order.Sum),
                                                loginToken).subscribe((response) => {
                          this.isLoaded.isCreditPaymentLoaded = true;
                          this.showLoader = false;
                          this.paymentCallBack(response);
                  }, () => {
                      this.showLoader = false;
                      this.isLoaded.isCreditPaymentLoaded = true;
                      this.messageService.displayServerErrorMessage();
                    });
                
              }, () => {
                this.showLoader = false;
                this.isLoaded.isCreditPaymentLoaded = true;
                this.messageService.displayServerErrorMessage();
              });
          }
        }, () => {
          this.showLoader = false;
          this.isLoaded.isCreditPaymentLoaded = true;
          this.messageService.displayServerErrorMessage();
        });
    }
  }

  private prepareItemForOrder(item: ItemAppAdvancedModel, scratchCoupon, scratchCouponValue) {
    const orderItem = new OrderItemAppModel();
    orderItem.Amount = item.Amount;
    orderItem.ItemId = item.Id;
    orderItem.Comment = '';
    let garnishes = [];
    if (item.SelectedGarnishes) {
      item.SelectedGarnishes.forEach((garnish: GarnishAppAdvancedModel) => {
        garnishes.push(garnish);
        if (garnish.SelectedAmount > 1) {
          for (let i = 0; i < garnish.SelectedAmount - 1; i++) {
            const grn = this.commonFunctionsService.deepCopy(garnish);
            grn.SelectedAmount = 1;
            garnishes.push(grn);
          }
        }
        garnish.SelectedAmount = 1;
      });
    }
    // Check if some garnish groups have free count of garnishes
    // Group of garnishes:
    const garnishesGroup = {};
    garnishes.forEach((garnish) => {
      if (garnish) {
        garnish.SelectedAmount = 1;
        garnishesGroup[garnish.GarnishGroupId] = garnishesGroup[garnish.GarnishGroupId] || [];
        garnishesGroup[garnish.GarnishGroupId].push(garnish);
      }
    });
    // Check free count of garnishGroup:
    Object.keys(garnishesGroup).forEach((key) => {
      if (item.GarnishGroups) {
        for (let i = 0; i < item.GarnishGroups.length; i++) {
          if (item.GarnishGroups[i].Garnishes && item.GarnishGroups[i].Garnishes[0]
            && item.GarnishGroups[i].Garnishes[0].GarnishGroupId === +key && item.GarnishGroups[i].FreeCount) {
            garnishesGroup[key].sort((garnish1, garnish2) => {
              return garnish2.Price - garnish1.Price;
            }).map((garnish, index) => {
              if (index < item.GarnishGroups[i].FreeCount) {
                garnish.Price = 0;
              }
            });
          }
        }
      }
    });
    orderItem.Garnishes = garnishes; // item.SelectedGarnishes.slice();
    orderItem.SpecialRequests = '';
    orderItem.ComboItemId = 0;
    orderItem.IsScratchCoupon = !!scratchCoupon;
    orderItem.ScratchCouponId = scratchCoupon && scratchCouponValue ? scratchCouponValue.Id : 0;
    orderItem.Price = item.Price;
    orderItem.ImageUrl = item.ImageUrl;
    orderItem.Name = item.Name;
    return orderItem;
  }

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

  private payWithPaya(order) {
    //validate CC
    if (!this.legalCC(this.cashRegisterCreditCard.number)) {
      if (!this.verifyAE_CC(this.cashRegisterCreditCard.number)) {
        return;
      }
    }
    const loginToken = this.appStorageService
      .getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.configService.franchiseId);
    if (loginToken) {
      this.isLoaded.isPayaPaymentLoaded = false;
      //get request of paya encryption:
      this.paymentService.getPayaRequest(this.prepareOrderForServer(order), loginToken)
        .subscribe((result) => {
          if (result) {
            this.initCore(result);
          } else {
            this.isLoaded.isPayaPaymentLoaded = true;
            this.isLoaded.isCreditPaymentLoaded = true;
          }
        }, (error) => {
          this.isLoaded.isPayaPaymentLoaded = true;
          this.isLoaded.isCreditPaymentLoaded = true;
          this.messageService.displayServerErrorMessage();
        });
    } else {
      this.isLoaded.isPayaPaymentLoaded = true;
      this.isLoaded.isCreditPaymentLoaded = true;
    }
  }

  // For paya:
  private data;

  private initCore(request) {
    try {
      // @ts-ignore
      if (PayJS) {
        // @ts-ignore
        PayJS(['PayJS/Core'],
          (CORE) => {
            CORE.Initialize(request);
            this.data = request;
            this.doPayment();
          });
      } else {
        this.isLoaded.isPayaPaymentLoaded = true;
      }
    } catch (e) {
      this.isLoaded.isPayaPaymentLoaded = true;
      this.messageService.displayServerErrorMessage();
    }
  }

  private createValidExpDate(mon, year) {
    if (mon.length == 1) {
      mon = '0' + mon;
    }
    year = year.slice(2);
    return mon + year;
  }

  private doPayment() {
    try {
      // @ts-ignore
      if (PayJS) {
        // @ts-ignore
        PayJS(['PayJS/Request', 'PayJS/Response'],
          (REQUEST, RESPONSE) => {
            let exp = this.createValidExpDate(this.cashRegisterCreditCard.expirationMonth,
              this.cashRegisterCreditCard.expirationYear);
            REQUEST.doPayment(this.cashRegisterCreditCard.number, exp,
              this.cashRegisterCreditCard.cvv, (res, status, jqxhr) => {
                if (status != 'error') {
                  const result = RESPONSE.tryParse(res, status, jqxhr);
                  const transactionSuccess = RESPONSE.getTransactionSuccess();
                  if (transactionSuccess) {
                    this.paymentService.verifyHash(res, RESPONSE.getResponseHash().hash)
                      .subscribe((res) => {
                        this.isLoaded.isPayaPaymentLoaded = true;
                        this.isLoaded.isCreditPaymentLoaded = true;
                        this.paymentCallBack(res);
                      }, (error) => {
                        this.isLoaded.isPayaPaymentLoaded = true;
                        this.isLoaded.isCreditPaymentLoaded = true;
                        this.messageService.displayServerErrorMessage();
                      });
                  } else {
                    this.isLoaded.isPayaPaymentLoaded = true;
                    this.isLoaded.isCreditPaymentLoaded = true;
                    this.paymentCallBack({ Data: { success: false } });
                  }
                } else {
                  this.isLoaded.isPayaPaymentLoaded = true;
                  this.isLoaded.isCreditPaymentLoaded = true;
                  Object.keys(this.isLoaded).forEach((key) => {
                    this.isLoaded[key] = true;
                  });
                }
              });
          });
      } else {
        this.isLoaded.isPayaPaymentLoaded = true;
        this.isLoaded.isCreditPaymentLoaded = true;
      }
    } catch (e) {
      this.isLoaded.isPayaPaymentLoaded = true;
      this.messageService.displayServerErrorMessage();
    }
  }

  public payWithTranzila(order) {
    if (!this.isCreditValidData()) {
      this.showLoader = false;
      return;
    }
    this.isLoaded.isTranzilaLoaded = false;
    this.isLoaded.isCreditPaymentLoaded = false;
    const loginToken = this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.franchiseId);
    const cashRegisterCreditCard = this.commonFunctionsService.deepCopy(this.cashRegisterCreditCard);
    cashRegisterCreditCard.expirationMonth = +cashRegisterCreditCard.expirationMonth < 10 ? "0" + +cashRegisterCreditCard.expirationMonth : +cashRegisterCreditCard.expirationMonth
    cashRegisterCreditCard.expirationYear = +cashRegisterCreditCard.expirationYear ? cashRegisterCreditCard.expirationYear.slice(-2) : cashRegisterCreditCard.expirationYear;
    this.paymentService
      .paymentRequestTranzila(order, loginToken, JSON.stringify(cashRegisterCreditCard))
      .subscribe((response) => {
        this.loadOrderUserDataToUser(this.user);
        this.signInOutService.updateUserDetails(this.user).subscribe((reslt) => {
          this.isLoaded.isCreditPaymentLoaded = true;
          this.isLoaded.isTranzilaLoaded = true;
          this.paymentCallBack(response);
        }, (error) => {
          this.isLoaded.isCreditPaymentLoaded = true;
          this.isLoaded.isTranzilaLoaded = true;
          this.messageService.displayServerErrorMessage();
        });
      }, (error) => {
        this.isLoaded.isCreditPaymentLoaded = true;
        this.isLoaded.isTranzilaLoaded = true;
        this.messageService.displayServerErrorMessage();
      });
  }

  public cardPayment() {
    if (this.order) {
      this.order.Payment = this.paymentType;//PaymentTypeEnum.card;
      const order = this.commonFunctionsService.deepCopy(this.order);
      if (this.isAvailableScratchCoupon()) {
        const prepareForOrderItem =
          this.prepareItemForOrder(this.scratchCoupon.CurrentItem,
            true, this.scratchCoupon);
        order.OrderItems.push(this.commonFunctionsService.deepCopy(prepareForOrderItem));
        /* this.appStorageService.isUsedScratchCoupon = true;
         this.appStorageService.useScratchCoupon = false;*/
      }
     // this.prepareDataForOrderToPay(order);
      this.isLoaded.isCreditPaymentLoaded = true;
      this.isLoaded.isPayaPaymentLoaded = true;
     // if (this.lang === LanguageEnum.HE) {
        console.log("this.cashRegister",this.cashRegister);
        if (this.cashRegister && this.cashRegister.isUseCashRegister) {
          if ((this.cashRegister.cashRegisterType == 'Tranzila' || this.cashRegister.isTranzila) &&
              this.multiPayers){
                this.splittedPayment(this.prepareOrderForServer(order));
              /*  if (this.sumPayed > 0 && (this.order.PayedByCibus > 0 || this.order.PayedByTenbis >0)) {
                  this.splittedPaymentRequestCibusTenbisCredit(this.prepareOrderForServer(order));
                } else{
                  
                  this.splittedPayment(this.prepareOrderForServer(order));
                }*/
               
              }
          else if (this.selectedCcId > 0 && !this.addCC) this.payWithSavedCreditCard(this.prepareOrderForServer(order));
          else this.payWithCashRegisterCreditCard(this.prepareOrderForServer(order));
        } else {
         // this.payWithTranzila(this.prepareOrderForServer(order));
         this.payWithCashRegisterCreditCard(this.prepareOrderForServer(order));
        }
     // } else {
      //  this.payWithPaya(this.prepareOrderForServer(order));
     // }
    }
  }

  public sibusPayment() {
    if (this.order) {
      this.order.Payment = this.paymentType;//PaymentTypeEnum.card;
      const order = this.commonFunctionsService.deepCopy(this.order);
      if (this.isAvailableScratchCoupon()) {
        const prepareForOrderItem =
          this.prepareItemForOrder(this.scratchCoupon.CurrentItem,
            true, this.scratchCoupon);
        order.OrderItems.push(this.commonFunctionsService.deepCopy(prepareForOrderItem));
        /* this.appStorageService.isUsedScratchCoupon = true;
         this.appStorageService.useScratchCoupon = false;*/
      }
    //  this.prepareDataForOrderToPay(order);
      this.isLoaded.isCreditPaymentLoaded = true;
      this.isLoaded.isPayaPaymentLoaded = true;
      console.log("this.cashRegister",this.cashRegister);
      if (this.cashRegister && this.cashRegister.isUseCashRegister) {
        if (this.notEnoughCibusBudget) {
          if ( this.cibusSplittedPaymentType == 'cash') {
            this.payWithSibusCardAndCash(this.prepareOrderForServer(order));
          } else {
            this.payWithSibusCardAndCredit(this.prepareOrderForServer(order));
          }
        } else {
          this.payWithSibusCard(this.prepareOrderForServer(order));
        }
       
      }  
       
    }
  }

  public tenbisPayment() {
    if (this.order) {
      this.order.Payment = this.paymentType;//PaymentTypeEnum.card;
      const order = this.commonFunctionsService.deepCopy(this.order);
      if (this.isAvailableScratchCoupon()) {
        const prepareForOrderItem =
          this.prepareItemForOrder(this.scratchCoupon.CurrentItem,
            true, this.scratchCoupon);
        order.OrderItems.push(this.commonFunctionsService.deepCopy(prepareForOrderItem));
         
      }
   
      this.isLoaded.isCreditPaymentLoaded = true;
      this.isLoaded.isPayaPaymentLoaded = true;
      console.log("this.cashRegister",this.cashRegister);
      if (this.cashRegister && this.cashRegister.isUseCashRegister) {
       this.payWithTenbisCard(this.prepareOrderForServer(order))
       
      }  
       
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
    this.isLoaded.isCreditPaymentLoaded = false;
    this.paymentService
      .dataEncryption(loginToken, JSON.stringify(this.cibusCard))
      .subscribe((response) => {
        let encrypted = response;
        
        this.paymentService
          .checkSibusBudget(order, loginToken, encrypted)
          .subscribe((response) => {
            if (response.Data.success) {
              this.paymentService
              .paymentRequestCashRegister(order, loginToken, encrypted)
              .subscribe((response) => {


                this.loadOrderUserDataToUser(this.user);
                this.signInOutService.updateUserDetails(this.user).subscribe((reslt) => {
                  this.isLoaded.isCreditPaymentLoaded = true;
                  this.paymentCallBack(response);
                }, (error) => {
                  this.isLoaded.isCreditPaymentLoaded = true;
                  this.messageService.displayServerErrorMessage();
                });
              }, (error) => {
                this.isLoaded.isCreditPaymentLoaded = true;
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
              if (this.paymentSettings.CreditCard) {
                this.cibusSplittedPaymentType = 'credit';
              } else {
                this.cibusSplittedPaymentType = 'cash';
              }
             
              this.isLoaded.isCreditPaymentLoaded = true;
            }
          }, (error) => {
            this.isLoaded.isCreditPaymentLoaded = true;
            this.messageService.displayServerErrorMessage();
          });
                
      }, (error) => {
        this.isLoaded.isCreditPaymentLoaded = true;
        this.messageService.displayServerErrorMessage();
      });
  }

 public addPaymentOptions : boolean = false;
 public cibusSplittedSum = 0;
 public errorSplittedPaymentMsg : string;
  
 public CibusSplittedPayment(branchId, sum, cibusCard) {
    if (Number(this.cibusSplittedSum) == 0 || 
        Number(this.cibusSplittedSum) > this.resultSum(this.order.Sum) - this.sumPayed ) {
          this.orderErrors.sum = true;
          return false;
    }
   /* this.initializeDateExpirationForCibus();
    if (!this.isCreditValidData()) {
      this.showLoader = false;
      return;
    }*/
    this.multiPaymentStarted = true;
    this.paymentService.PayWithSibusCard(branchId, sum, cibusCard)
          .subscribe((response) => {
            if (response.Data.success && response.Data.orderID !== 0) {
              let cibusOrderDetails = new CibusAppModel();
              cibusOrderDetails.CardNumber = cibusCard;
              cibusOrderDetails.Budget = response.Data.budget;
              cibusOrderDetails.OrderId = response.Data.orderID;
              cibusOrderDetails.SumPayed = response.Data.price;
              this.order.CibusReciptData += JSON.stringify(cibusOrderDetails)
              this.sumPayed += Number(response.Data.price);
              this.cibusTenbisPayersArray.push(cibusOrderDetails);
              this.cibusPayersArray.push(cibusOrderDetails);
              this.order.PayedByCibus +=  Number(response.Data.price);
              console.log("this.order.PayedByCibus",this.order.PayedByCibus);
            
             if (this.sumPayed > 0 && this.sumPayed < this.resultSum(this.order.Sum) ){
              this.addPaymentOptions = true;
              this.cibusSplittedSum = this.resultSum(this.order.Sum) - this.sumPayed;
             
             }
            } else {//if (!response.Data.success &&  Number(response.Data.budget) < sum ) {
                    
                    this.cibusBudget = Number(response.Data.budget);
                    if (this.cibusBudget < sum ) this.notEnoughCibusBudget =true;
                    this.errorSplittedPaymentMsg = response.Data.errorMessage;
                    // יתרתך בכרטיס היא 0 , נא בחר אמצעי תשלום אחר
                    if (this.sumPayed == 0) this.multiPaymentStarted = false;
              this.isLoaded.isCreditPaymentLoaded = true;
            }
          }, (error) => {
            this.isLoaded.isCreditPaymentLoaded = true;
            this.messageService.displayServerErrorMessage();
            if (this.sumPayed == 0) this.multiPaymentStarted = false;
          });
  }

  public TenbisSplittedPayment(branchId, sum, tenbisCard) {
    if (Number(this.cibusSplittedSum) == 0 || 
        Number(this.cibusSplittedSum) > this.resultSum(this.order.Sum) - this.sumPayed ) {
          this.orderErrors.sum = true;
          return false;
    }
   /* this.initializeDateExpirationForTenbis();
    if (!this.isCreditValidData()) {
      this.showLoader = false;
      return;
    }*/
    this.multiPaymentStarted = true;
    this.paymentService.PayWithTenbisCard(branchId, sum, tenbisCard)
          .subscribe((response) => {
            console.log("PayWithTenbisCard response",response);
          /*  if (response.Data.success && response.Data.orderID !== 0) {
              let cibusOrderDetails = new CibusAppModel();
              cibusOrderDetails.CardNumber = tenbisCard;
           //   cibusOrderDetails.Budget = response.Data.budget;
              cibusOrderDetails.OrderId = response.Data.orderID;
              cibusOrderDetails.SumPayed = sum;
              this.order.TenbisReciptData += JSON.stringify(cibusOrderDetails)
              this.sumPayed += sum;
              this.cibusTenbisPayersArray.push(cibusOrderDetails);
              this.order.PayedByTenbis +=  sum;
              console.log("this.order.PayedByTenbis",this.order.PayedByTenbis);
              if (this.sumPayed > 0 && this.sumPayed < this.resultSum(this.order.Sum) ){
              this.addPaymentOptions = true;
              this.cibusSplittedSum = this.resultSum(this.order.Sum) - this.sumPayed;
             
             }
            } else */
            if (response.success && response.orderID !== 0) {
              let cibusOrderDetails = new CibusAppModel();
              cibusOrderDetails.CardNumber = tenbisCard;
           //   cibusOrderDetails.Budget = response.Data.budget;
              cibusOrderDetails.OrderId = response.orderID;
              cibusOrderDetails.SumPayed = sum;
              this.order.TenbisReciptData += JSON.stringify(cibusOrderDetails)
              this.sumPayed += Number(sum);
              this.cibusTenbisPayersArray.push(cibusOrderDetails);
              this.tenbisPayersArray.push(cibusOrderDetails);
              this.order.PayedByTenbis +=  Number(sum);
              console.log("this.order.PayedByTenbis",this.order.PayedByTenbis);
              if (this.sumPayed > 0 && this.sumPayed < this.resultSum(this.order.Sum) ){
              this.addPaymentOptions = true;
              this.cibusSplittedSum = this.resultSum(this.order.Sum) - this.sumPayed;
             
             }
            } else {//if (!response.Data.success) {
                  //  this.notEnoughCibusBudget =true;
                   // this.cibusBudget = Number(response.Data.budget);
                    this.errorSplittedPaymentMsg = response.Data.errorMessage;
                    if (this.sumPayed == 0) this.multiPaymentStarted = false;
              this.isLoaded.isCreditPaymentLoaded = true;
            }
          }, (error) => {
            this.isLoaded.isCreditPaymentLoaded = true;
            if (this.sumPayed == 0) this.multiPaymentStarted = false;
            this.messageService.displayServerErrorMessage();
          });
  }

  

  public splittedPaymentRequestCibusTenbisCredit(order) {
    if (!this.isCreditValidData()) {
      this.showLoader = false;
      return;
    }
    const loginToken = this.appStorageService
      .getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.configService.franchiseId);
    this.isLoaded.isCreditPaymentLoaded = false;
    this.paymentService
      .dataEncryption(loginToken, JSON.stringify(this.cashRegisterCreditCard))
      .subscribe((response) => {
        let encrypted = response;
        this.paymentService
          .SplittedPaymentRequestCibusTenbisCredit(order, loginToken, encrypted)
          .subscribe((response) => {

            this.loadOrderUserDataToUser(this.user);
            this.signInOutService.updateUserDetails(this.user).subscribe((reslt) => {
              this.isLoaded.isCreditPaymentLoaded = true;
              this.paymentCallBack(response);
            }, (error) => {
              this.isLoaded.isCreditPaymentLoaded = true;
              this.messageService.displayServerErrorMessage();
            });
          }, (error) => {
            this.isLoaded.isCreditPaymentLoaded = true;
            this.messageService.displayServerErrorMessage();
          });
      }, (error) => {
        this.isLoaded.isCreditPaymentLoaded = true;
        this.messageService.displayServerErrorMessage();
      });
  }

  public splittedPaymentRequestCibusTenbisCash(order) {
    if (!this.isCreditValidData()) {
      this.showLoader = false;
      return;
    }
    const loginToken = this.appStorageService
      .getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.configService.franchiseId);
    this.isLoaded.isCreditPaymentLoaded = false;
    this.paymentService
      .SplittedPaymentRequestCibusTenbisCash(this.prepareOrderForServer(this.order), loginToken)
        .subscribe((response) => {

          this.loadOrderUserDataToUser(this.user);
          this.signInOutService.updateUserDetails(this.user).subscribe((reslt) => {
          this.isLoaded.isCreditPaymentLoaded = true;
          this.paymentCallBack(response);
        }, (error) => {
          this.isLoaded.isCreditPaymentLoaded = true;
          this.messageService.displayServerErrorMessage();
        });
    }, (error) => {
      this.isLoaded.isCreditPaymentLoaded = true;
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
    this.isLoaded.isCreditPaymentLoaded = false;
    this.paymentService
      .dataEncryption(loginToken, JSON.stringify(this.tenbisCard))
      .subscribe((response) => {
        let encrypted = response;
        console.log("order",order);
      
          this.paymentService
          .paymentRequestCashRegister(order, loginToken, encrypted)
          .subscribe((response) => {


            this.loadOrderUserDataToUser(this.user);
            this.signInOutService.updateUserDetails(this.user).subscribe((reslt) => {
              this.isLoaded.isCreditPaymentLoaded = true;
              this.paymentCallBack(response);
            }, (error) => {
              this.isLoaded.isCreditPaymentLoaded = true;
              this.messageService.displayServerErrorMessage();
            });
          }, (error) => {
            this.isLoaded.isCreditPaymentLoaded = true;
            this.messageService.displayServerErrorMessage();
          });
        
                
      }, (error) => {
        this.isLoaded.isCreditPaymentLoaded = true;
        this.messageService.displayServerErrorMessage();
      });
  }

  public payWithSibusCardAndCash(order) {
    if (!this.isCreditValidData()) {
      this.showLoader = false;
      return;
    }
    const loginToken = this.appStorageService
      .getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.configService.franchiseId);
    this.isLoaded.isCreditPaymentLoaded = false;
    this.cibusCard.sum = this.cibusBudget;
    this.paymentService
      .dataEncryption(loginToken, JSON.stringify(this.cibusCard))
      .subscribe((response) => {
        let encrypted = response;
        this.paymentService
          .splittedPaymentRequestCibusCash(order, loginToken, encrypted)
            .subscribe((response) => {
                this.loadOrderUserDataToUser(this.user);
                this.signInOutService.updateUserDetails(this.user).subscribe((reslt) => {
                  this.isLoaded.isCreditPaymentLoaded = true;
                  this.paymentCallBack(response);
                }, (error) => {
                  this.isLoaded.isCreditPaymentLoaded = true;
                  this.messageService.displayServerErrorMessage();
                });
          }, (error) => {
                this.isLoaded.isCreditPaymentLoaded = true;
                this.messageService.displayServerErrorMessage();
          });
             
                
      }, (error) => {
        this.isLoaded.isCreditPaymentLoaded = true;
        this.showLoader = false;
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
    this.isLoaded.isCreditPaymentLoaded = false;
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
                this.loadOrderUserDataToUser(this.user);
                this.signInOutService.updateUserDetails(this.user).subscribe((reslt) => {
                  this.isLoaded.isCreditPaymentLoaded = true;
                  this.paymentCallBack(response);
                }, (error) => {
                  this.isLoaded.isCreditPaymentLoaded = true;
                  this.messageService.displayServerErrorMessage();
                });
          }, (error) => {
                this.isLoaded.isCreditPaymentLoaded = true;
                this.messageService.displayServerErrorMessage();
          });
               
                  
        }, (error) => {
          this.isLoaded.isCreditPaymentLoaded = true;
          this.messageService.displayServerErrorMessage();
        });
             
                
      }, (error) => {
        this.isLoaded.isCreditPaymentLoaded = true;
        this.messageService.displayServerErrorMessage();
      });
  }

  public addAmount(item, isPizza?, isCombo?) {
    if (isPizza) {
      if (!item.FullPizza.Amount) {
        item.FullPizza.Amount = 1;
      }
      if (!item.Amount) {
        item.Amount = 1;
      }
      item.FullPizza.Amount++;
      item.Amount++;
      

      var dataLayerItems =[];
      var dataLayerItem={
        "item_id": item.PizzaId,
        "item_name":item.Name,
        "price":this.itemPrice(item,true),
        "quantity" :1
      }
      console.log("dataLayerItem",dataLayerItem);
      
      dataLayerItems.push(dataLayerItem);
      window['dataLayer'].push({
        'event': 'add_to_cart',
        'items': dataLayerItems,
        'currency':'ILS',
        'value': this.itemPrice(item,true),
        'contents':[{'id':item.PizzaId, 'quantity':item.Amount}],
        'content_type': 'product_group',
        'content_ids': [item.PizzaId]
     });

    } else {
      if (!item.Amount) {
        item.Amount = 1;
      }
      if (this.currentBranch.UseInventory && item.Item.Quantity == 0) return;
      item.Amount++;
      if (this.currentBranch.UseInventory ) {
        item.Item.Quantity -=1;
       
        this.order.OrderItems.forEach((orderItem)=> {        
            if (orderItem.Item.CatalogNumber == item.CatalogNumber)
              orderItem.Item.Quantity = item.Item.Quantity;                 
        });
      }
      var dataLayerItems =[];
      if (isCombo) {
        var dataLayerItem={
          "item_id": item.ComboId,
          "item_name":item.Name,
          "price":this.itemComboPrice(item), 
          "quantity" :1
        }
        console.log("dataLayerItem",dataLayerItem);
        
        dataLayerItems.push(dataLayerItem);
    
        window['dataLayer'].push({
          'event': 'add_to_cart',
          'items': dataLayerItems,
          'currency':'ILS',
          'value': this.itemComboPrice(item),
          'contents':[{'id':item.ComboId, 'quantity':item.Amount}],
          'content_type': 'product_group',
          'content_ids': [item.ComboId] 
       });
      } else {
        var dataLayerItem={
          "item_id": item.ItemId,
          "item_name":item.Name,
          "price":this.itemPrice(item,false),
          "quantity" :1
        }
        console.log("dataLayerItem",dataLayerItem);
        
        dataLayerItems.push(dataLayerItem);
        window['dataLayer'].push({
          'event': 'add_to_cart',
          'items': dataLayerItems,
          'currency':'ILS',
          'value': this.itemPrice(item,false),
          'contents':[{'id':item.ItemId, 'quantity':item.Amount}],
          'content_type': 'product_group',
          'content_ids': [item.ItemId]
       });
      }

    }
   // this.orderService.recalculateSum();
    this.checkForCombo();
    /*if (AppConfig.configSettings.minAmountForBonus && !this.order.hasBonusItems
      && (this.order.Sum >= AppConfig.configSettings.minAmountForBonus)) {
      this.displayBonusItems();
    }*/
  }

  public displayBonusItems() {
    //const message = this.translationService.translate('BONUS_SECOND');
    const minForBonus = AppConfig.configSettings.minAmountForBonus;
    const firstMessage = this.translationsService.translate('BONUS_FIRST');
    const bonusMSG = AppConfig.configSettings.bonusMsg;
    console.log(minForBonus);
    console.log(firstMessage);
    console.log("this.bonusItems",this.bonusItems);
    if (this.bonusItems && this.bonusItems.length > 0) {
      console.log("if (this.bonusItems && this.bonusItems.length > 0)");
      const matDialogRef = this.matDialog.open(AdditionalItemsComponent, {
        data: {
          //header: message,
          items: this.commonFunctionsService.deepCopy(this.bonusItems),
          maxItems: 1,
          isBonusMode: true,
          minForBonus: minForBonus,
          firstMessage: firstMessage,
          icon: '../../../../assets/images/items/cart-icon-big.svg',
          bonusMSG: bonusMSG,
        },
        minWidth: '350px',
        width: '100%',
        maxWidth: '1000px',
        disableClose: false,
        panelClass: 'custom-mat-dialog-mobile-bonus'
      });
      matDialogRef.afterClosed().subscribe((result) => {
        console.log("afterClosed()-->", result);
        if (result.isSaved && result.selectedItems) {
          result.selectedItems.forEach(orderAdditionalItem => {
            this.order.OrderItems.push(orderAdditionalItem);
            this.order.hasBonusItems = true;
          });
          //  this.addToCartComboItem(result.combo, comboItem);
        }
      });
    }
  }

  public subAmount(item, isPizza?, isCombo?) {
    console.log("subAmount");
     
    let header = this.translationsService.translate('ERROR');
    let icon = "../../../assets/images/items/important-message.svg";
  if (AppConfig.configSettings.minAmountForBonus && AppConfig.configSettings.minAmountForBonus > 0) {
    const msg = this.translationsService.translate('ORDER_BONUS_WARNING')
          + ' ' +  this.translationsService.translate('COMMON_CASH')
          +  AppConfig.configSettings.minAmountForBonus;
    const matDialogRef = this.matDialog.open(MessagePopupComponent, {
      data: {
        header,
        icon,
              message: msg,
              withoutTimeout: true
            },
      minWidth: '400px',
      disableClose: true,
      panelClass: 'custom-mat-dialog-popup'
    });
    matDialogRef.afterClosed().subscribe((result) => {});
  } 

    if(isCombo){
      if (item.Amount > 1) {
        item.Amount--;
      } else {
       // if (this.isMobileMode()) {
          this.remove(item, false);
       // }
      }

    }

    if (isPizza) {
      if (!item.FullPizza.Amount) {
        item.FullPizza.Amount = 1;
      }
      if (!item.Amount) {
        item.Amount = 1;
      }
      if (item.FullPizza.Amount > 1) {
        item.FullPizza.Amount--;
      }
      if (item.Amount > 1) {
        item.Amount--;
      } else {
       // if (this.isMobileMode()) {
          this.remove(item, isPizza);
       // }
      }
    } else {
      if (!item.Amount) {
        item.Amount = 1;
      }
      if (item.Amount > 1) {
        item.Amount--;
        if (this.currentBranch.UseInventory ) {
          item.Item.Quantity +=1;
         /* this.categories.forEach((cat)=> {
            cat.Items.forEach((i)=> {
              if (i.CatalogNumber == item.CatalogNumber)
                i.Quantity = item.Item.Quantity;          
            });
          });*/
          this.order.OrderItems.forEach((orderItem)=> {        
              if (orderItem.Item.CatalogNumber == item.CatalogNumber)
                orderItem.Item.Quantity = item.Item.Quantity;                 
          });
        }
      } else {
       // if (this.isMobileMode()) {
          this.remove(item, isPizza);
      // }
      }
    }
    this.checkForCombo();
    this.orderService.recalculateSum();
    this.checkRemoveBonusItems();
    this.checkRemoveUpgrade();
  }

  
  private checkRemoveBonusItems() {
    if (AppConfig.configSettings.minAmountForBonus) {
      let bonusItemsSum = 0;
      const bonusItems = this.order.OrderItems.filter((i)=> 
        {return i.IsBonus});
      bonusItems.forEach((bonusItem)=> {
        let garnishesSum = 0;
        if (bonusItem.Garnishes) {
          bonusItem.Garnishes.forEach((garnish: GarnishAppAdvancedModel) => {
            if (garnish.MaxAmount && garnish.SelectedAmount) {
              garnishesSum += garnish.Price * garnish.SelectedAmount;
            } else {
              garnishesSum += garnish.Price;
            }
          });
        }
        bonusItemsSum += (bonusItem.Price + garnishesSum) * (bonusItem.Amount || 1);
      });
        
      if (this.order.Sum - bonusItemsSum < AppConfig.configSettings.minAmountForBonus) {
        bonusItems.forEach((bonusItem)=> {this.remove(bonusItem, false)});
        this.order.hasBonusItems = false;
        this.orderService.recalculateSum();
      }             
    }
  }
 /* private checkRemoveBonusItems() {
    console.log("checkRemoveBonusItems")
    if (AppConfig.configSettings.minAmountForBonus) {
      let bonusItemsSum = 0;
      const bonusItems = this.order.OrderItems.filter((i) => { return i.IsBonus });
      bonusItems.forEach((bonusItem) => {
        let garnishesSum = 0;
        if (bonusItem.Garnishes) {
          bonusItem.Garnishes.forEach((garnish: GarnishAppAdvancedModel) => {
            if (garnish.MaxAmount && garnish.SelectedAmount) {
              garnishesSum += garnish.Price * garnish.SelectedAmount;
            } else {
              garnishesSum += garnish.Price;
            }
          });
        }
        bonusItemsSum += (bonusItem.Price + garnishesSum) * (bonusItem.Amount || 1);
      });
console.log("bonusItemsSum",bonusItemsSum)
      if (bonusItemsSum > 0 && this.order.Sum - bonusItemsSum < AppConfig.configSettings.minAmountForBonus) {//bonusItemsSum > 0 && 
        bonusItems.forEach((bonusItem) => { this.remove(bonusItem, false) });
        this.order.hasBonusItems = false;

        let header = this.translationsService.translate('ERROR');
        let icon = "../../../assets/images/items/important-message.svg";
          const msg = this.translationsService.translate('ORDER_BONUS_WARNING')
            + ' ' + this.translationsService.translate('COMMON_CASH')
            + AppConfig.configSettings.minAmountForBonus;
          const matDialogRef = this.matDialog.open(MessagePopupComponent, {
            data: {
              header,
              icon,
              message: msg,
              withoutTimeout: true
            },
            minWidth: '400px',
            disableClose: true,
            panelClass: 'custom-mat-dialog-popup'
          });
          matDialogRef.afterClosed().subscribe((result) => { });
        
      }
    }
  }*/

  private checkRemoveUpgrade() {
    const hasUpgrageItems = this.order.OrderItems.filter((i) => { return i.Item.MealUpgrade });
    const upgrageItems = this.order.OrderItems.filter((i) => { return i.IsUpgrade });
    if (upgrageItems.length > hasUpgrageItems.length){
      var item = upgrageItems[0];
      if (item.Amount > 1) {
        item.Amount--;
        this.orderService.recalculateSum();
      } else {
        this.order.OrderItems.splice(this.order.OrderItems.indexOf(item), 1);
        this.orderService.recalculateSum();
      } 
    }
   
    
  }

  public remove(item, isPizza?) {
    // display warning msg
    console.log("remove", item);
    this.notAllowedBenefitsAmount = false;
    let header = this.translationsService.translate('ERROR');
    let icon = "../../../assets/images/items/important-message.svg";
    

    if (isPizza) {
      this.order.OrderPizzas.splice(this.order.OrderPizzas.indexOf(item), 1);
      this.orderService.recalculateSum();
      this.checkForCombo();
      if (!item.IsBonus) {
        this.checkRemoveBonusItems();
      }
    } else {
      if (this.currentBranch.UseInventory ) {
        let amount = item.amount;
         
        if (this.order.OrderItems.length > 0){
          this.order.OrderItems.forEach((orderItem)=> {        
            if (orderItem.Item.CatalogNumber == item.CatalogNumber)
              orderItem.Item.Quantity += amount;                 
          });
        }
      
      }
      this.order.OrderItems.splice(this.order.OrderItems.indexOf(item), 1);
      this.orderService.recalculateSum();
      this.checkForCombo();
      if (!item.IsBonus) {
        this.checkRemoveBonusItems();
      }
      if (item.Item.MealUpgrade) {
        console.log("item.Item",item.Item)
        this.checkRemoveUpgrade();
      }
    }
    
    //this.checkOrderResultHeight();

    
  }

  public displayWarningMessageForClubBenefits() {
    // display warning msg
    console.log("displayWarningMessageForClubBenefits");
    let header = this.translationsService.translate('WARNING_HEADER_FOR_CLUB_BENEFITS');
    let icon = "../../../assets/images/items/important-message.svg";

    let msg;

    if(this.notAllowedBenefitsAmount){
      msg = this.translationsService.translate('WARNING_MESSAGE_FOR_CLUB_BENEFITS_AMOUNT');
    }
    else{
      msg = this.translationsService.translate('WARNING_MESSAGE_FOR_CLUB_BENEFITS')
        + ' ' + this.translationsService.translate('COMMON_CASH')
        + this.appStorageService.franchise.MinSumForVouchers;
    }


      const matDialogRef = this.matDialog.open(MessagePopupComponent, {
        data: {
          header,
          icon,
          message: msg,
          withoutTimeout: true
        },
        minWidth: '400px',
        disableClose: true,
        panelClass: 'custom-mat-dialog-popup'
      });
      matDialogRef.afterClosed().subscribe((result) => { });
    
  }

  public removeAll() {
    if (this.order) {
      this.order.OrderItems = [];
      this.order.OrderPizzas = [];
      this.order.OrderCombos = [];
      this.order.hasBonusItems = false;
      console.log("this.order.hasBonusItems = false;");
    }
    this.orderService.recalculateSum();
  }

  public countOfItems() {
    let count = 0;
    if (this.order && this.order.OrderItems) {
      count = this.order.OrderItems.reduce((sum, item: OrderItemAppModel) => {
        sum += item.Amount;
        return sum;
      }, count);
    }
    if (this.order && this.order.OrderPizzas) {
      count = this.order.OrderPizzas.reduce((sum, item: OrderPizzaAppAdvancedModel) => {
        sum += item.FullPizza.Amount;
        return sum;
      }, count);
    }
    if (this.order && this.order.OrderCombos) {
      count = this.order.OrderCombos.reduce((sum, item) => {
        sum += item.Amount;
        return sum;
      }, count);
    }
    return this.isAvailableScratchCoupon() ? count + 1 : count;
  }

  public displayCuponCode(): boolean {
    if (this.couponCodes?.length > 0) return  true;
    else return false;
    /*if (AppConfig.configSettings.couponCode
      && AppConfig.configSettings.couponCode.length > 0
      && AppConfig.configSettings.couponCodeDiscount > 0) {
      return true;
    } else {
      return false;
    }*/
  }
 public userMinSumForDiscount: number;
 public userCuponDiscountType: DiscountTypeEnum;
 public userCuponDiscountError: string ;
 public displayCuponDiscountError: boolean = false;

  public checkCuponCode() {//: boolean {
    var counter = 0;
    this.couponCodes.forEach((cupon)=> {
      counter ++;
      if (cupon.CouponCode == this.userCouponCode) {
        if (this.order.Sum >= cupon.MinSumForDiscount) {
          this.userCouponValid = true;
          this.userCuponDiscountType = cupon.DiscountType;
          this.userCuponDiscount = cupon.DiscountSum;//cupon.DiscountPercent;
          this.order.CouponId = cupon.Id;
          this.order.CouponCode = this.userCouponCode;
          this.loadSnackBar();
          return true;
        } else {
          this.userCuponDiscountError =  "סכום הזמנה מינימלי למימוש קוד קופון: " ;
          this.userMinSumForDiscount =  cupon.MinSumForDiscount;
          this.displayCuponDiscountError = true;
          return false;
        }
        
      }
      if (counter == this.couponCodes.length) return false;
    }) ;

   /* if (AppConfig.configSettings.couponCode
      && AppConfig.configSettings.couponCode == this.userCouponCode) {
      this.userCouponValid = true;
      this.userCuponDiscount = AppConfig.configSettings.couponCodeDiscount;
      this.loadSnackBar();
      return true;
    } else {
      this.userCouponValid = false;
      return false;
    }*/
  }

  public resulPriceWithCuponCode() {
    if (this.order) {
      return this.roundPricePipe.transform(+this.order.Sum * ((100 - +this.userCuponDiscount) / 100), 2);
    } else {
      return 0;
    }
  }
  public addToOrder() {
    
    localStorage.removeItem(window.location.hash);
    this.router.navigate([`/${this.franchiseId}/menu`]);
  }

  public returnToPrevPage() {
    
    localStorage.removeItem(window.location.hash);
    this.router.navigate([`/${this.franchiseId}/menu`]);
  }
  

  

  onOpenCalendar(container) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
  }

  /*onValueChange(value: Date): void {
    if (value) {
      console.log("value: Date1", value);
      this.cashRegisterCreditCard.expirationMonth = (value.getMonth() + 1).toString();
      console.log("this.ccWithToken.expirationMonth1", this.cashRegisterCreditCard.expirationMonth);
      this.cashRegisterCreditCard.expirationYear = value.getFullYear().toString();
      console.log("this.ccWithToken.expirationYear1", this.cashRegisterCreditCard.expirationYear);
    }

  }*/

  onCCValueChange(value: Date): void {
    if (value) {
      console.log("value: Date1", value);
      this.ccWithToken.expirationMonth = (value.getMonth() + 1).toString();
      console.log("this.ccWithToken.expirationMonth2", this.ccWithToken.expirationMonth);
      this.ccWithToken.expirationYear = value.getFullYear().toString();
      console.log("this.ccWithToken.expirationYear2", this.ccWithToken.expirationYear);
    }

  }



  public chosenYearHandler(normalizedYear: Date) {
    //const ctrlValue = this.date.value;


    //ctrlValue.year(normalizedYear.getFullYear());
    this.cashRegisterCreditCard.expirationYear = normalizedYear.getFullYear() + '';
    // this.date.setValue(normalizedYear.getFullYear());
  }

  public chosenMonthHandler(normlizedMonth: Date, datepicker: MatDatepicker<Moment>) {
    // const ctrlValue = this.date.value;

    // ctrlValue.month(normlizedMonth.getMonth()+1);
    //this.date.setValue(normlizedMonth.getMonth()+1);
    this.cashRegisterCreditCard.expirationMonth = (normlizedMonth.getMonth() + 1) + '';

    datepicker.close();
  }


  public itemComboPrice(combo) {
    let sum = (combo.Price * (combo.Amount || 1));
    let extraPrice = 0;
    if (combo.Pizzas) {
     /* combo.Pizzas.forEach((pizza) => {
       if (pizza.Price) extraPrice += pizza.Price;
        pizza.Toppings.forEach(p => {
          extraPrice += p.Price;
        })
      })*/
        combo.Pizzas.forEach((pizza) => {
          extraPrice += pizza.FullPizza.PriceInCombo;
          pizza.Toppings.forEach(p => {
            extraPrice += p.Price;
          })
        })
    }
    if (combo.Items) {
      combo.Items.forEach((item) => {
        if(item.IsItemNewCombo){
          extraPrice += item.Price;
        }
        item.Garnishes.forEach(g => {
          extraPrice += g.Price;
        })
      })
    }
    sum += extraPrice * (combo.Amount || 1);
    return sum;
  }

  public itemPrice(item, isPizza?) {
    if (!isPizza) {
      //console.log("!isPizza",!isPizza);
      let sum = item.Price;
      //console.log("sum",sum);
      if (item.Items) {
        item.Items.forEach((i) => {
          let garnishesSum_ = 0;
          
          if (i.Garnishes) {
            i.Garnishes.forEach((g: GarnishAppAdvancedModel) => {
              if (g.MaxAmount && g.SelectedAmount) {
                garnishesSum_ += g.Price * g.SelectedAmount;
              } else {
                garnishesSum_ += g.Price;
              }
            })
          }
          sum += (i.Price + garnishesSum_) * (i.Amount || 1);
        });
      }
      if (item.Garnishes) {
        sum = item.Garnishes.reduce((sm, garnish) => {
          if (garnish) {
            sm += garnish.Price;
          }
          return sm;
        }, sum);
        //console.log("sum",sum);
      }
      
      return sum * (item.Amount || 1);
    } else {
      if (item.FullPizza.SelectedPizzaPriceSize) {
        let sum = item.FullPizza.SelectedPizzaPriceSize.Price;
        if (item.FullPizza.SelectedToppings) {
          sum += item.FullPizza.SelectedToppings.reduce((s, item) => {
            s += +item.TotalPrice;
            return s;
          }, 0);
        }
        if (item.FullPizza.SelectedGarnishes) {
          item.FullPizza.SelectedGarnishes.forEach((g)=> {
            sum += g.Price;
          });
           
        }
        return sum * (item.FullPizza ? (item.FullPizza.Amount || 1) : (item.Amount || 1));
      }
    }

  }

  public scratchCoupon: any;
  // scratch coupon
  public getScratchCoupon = false;

  public displayScratchCoupon(scratchCoupon) {
    console.log("displayScratchCoupon");
    if(this.isMobileMode()){
      var minWidth = '100%';
    }
    else{
      minWidth = '0';
    }
    setTimeout(() => {
      const matDialogRef = this.matDialog.open(ScratchCouponComponent, {
        data: {
          scratchCoupon
        },
        //width: '60%',
        //maxWidth: '600px',
        //minWidth: '380px',
        disableClose: true,
        //height: '68vh',
        minWidth: minWidth,
        panelClass: 'custom-mat-dialog'
      });
      matDialogRef.afterClosed().subscribe((result) => {
       // this.displayDiscount();
        console.log(result);
        if(!this.appStorageService.useScratchCoupon) {
          this.scratchCoupon =  undefined;
        }
      });
    }, 200);
  }

  private preparePizzaForOrder(pizza: PizzaAppAdvancedModel, specialRequest: string) {
    console.log("preparePizzaForOrder - pizza", pizza);
    const newPizza = new OrderPizzaAppAdvancedModel();
    newPizza.Amount = pizza.Amount;
    newPizza.PizzaId = pizza.Id;
    newPizza.ComboPizzaId = 0;
    newPizza.SizeId = pizza.SelectedPizzaPriceSize.PizzaSizeId;
    newPizza.Toppings = [];

    if (specialRequest == 'undefined' || specialRequest == undefined || specialRequest.length < 1) {
      newPizza.SpecialRequests = '';
    } else {
      newPizza.SpecialRequests = specialRequest + ' ';
    }
    //newPizza.SpecialRequests = specialRequest + ' ' || '';
    newPizza.Comment = '';
    if (pizza.SelectedToppings) {
      newPizza.Toppings = pizza.SelectedToppings.map((topping) => {

        const orderToppingPizza = new OrderPizzaToppingAppModel();
        orderToppingPizza.ToppingId = topping.ToppingId;
        orderToppingPizza.Quarter1 = topping.QuarterNums.indexOf(1) != -1;
        orderToppingPizza.Quarter2 = topping.QuarterNums.indexOf(2) != -1;
        orderToppingPizza.Quarter3 = topping.QuarterNums.indexOf(3) != -1;
        orderToppingPizza.Quarter4 = topping.QuarterNums.indexOf(4) != -1;

        if (AppConfig.configSettings.displayPizzaToppingsInComments) {
          if (this.appStorageService.franchise.IsShowInHalfs ||
            topping.Description == this.translationsService.translate('ALL_PIZZA')) {
            if ((newPizza.SpecialRequests.indexOf(topping.Description) == -1)) {
              newPizza.SpecialRequests += topping.Description + ': ';
              pizza.SelectedToppings.forEach((t) => {
                if (t.Description == topping.Description) {
                  newPizza.SpecialRequests += t.Name + ', ';
                }
              });
            }
          } else {
            for (let i = 1; i < 5; i++) {
              if (topping.QuarterNums.indexOf(i) != -1) {
                let str = this.translationsService.translate('PIZZA_QUARTER') + ' ' + i;
                if ((newPizza.SpecialRequests.indexOf(str) == -1)) {
                  newPizza.SpecialRequests += str + ': ';
                  pizza.SelectedToppings.forEach((t) => {
                    if (t.QuarterNums.indexOf(i) != -1) {
                      newPizza.SpecialRequests += t.Name + ', ';
                    }
                  });
                }
              }
            };
          }
        }

        const garnishes = [];
    if (pizza.SelectedGarnishes) {
      pizza.SelectedGarnishes.forEach((garnish: GarnishAppAdvancedModel) => {
        garnishes.push(garnish);
        if (garnish.SelectedAmount > 1) {
          for (let i = 0; i < garnish.SelectedAmount - 1; i++) {
            const grn = this.commonFunctionsService.deepCopy(garnish);
            grn.SelectedAmount = 1;
            garnishes.push(grn);
          }
        }
        garnish.SelectedAmount = 1;
      });
    }

    const garnishesGroup = {};
    garnishes.forEach((garnish) => {
      if (garnish) {
        garnishesGroup[garnish.GarnishGroupId] = garnishesGroup[garnish.GarnishGroupId] || [];
        garnishesGroup[garnish.GarnishGroupId].push(garnish);
      }
    });
    // Check free count of garnishGroup:
    Object.keys(garnishesGroup).forEach((key) => {
      if (pizza.GeneralGarnishGroups) {
        for (let i = 0; i < pizza.GeneralGarnishGroups.length; i++) {
          if (pizza.GeneralGarnishGroups[i].Garnishes && pizza.GeneralGarnishGroups[i].Garnishes[0]
            && pizza.GeneralGarnishGroups[i].Garnishes[0].GarnishGroupId === +key && pizza.GeneralGarnishGroups[i].FreeCount) {
            garnishesGroup[key].sort((garnish1, garnish2) => {
              return garnish2.Price - garnish1.Price;
            }).map((garnish, index) => {
              if (index < pizza.GeneralGarnishGroups[i].FreeCount) {
                garnish.Price = 0;
              }
            });
          }
        }
      }
    });
        newPizza.Comment = newPizza.SpecialRequests
        return orderToppingPizza;
      });
    }
    newPizza.FullPizza = pizza;
    return newPizza;
  }
  
  private loadNewComboWithItems(comboItem, callback?) {
    console.log("comboItem", comboItem);
    let cls = 'modal-new-combo';
    
    if (this.isMobileMode()) cls = 'modal-dialog-scrollable modal-xl';
    const initialState = {
      combo: comboItem,
       useInventory: this.currentBranch.UseInventory
    };

    this.bsModalRef = this.modalService.show(NewComboComponent,
      { initialState, class: cls });
   
    this.modalService.onHide
      .pipe(take(1)).subscribe(() => {
        console.log("this.bsModalRef.content", this.bsModalRef.content);
        if (this.bsModalRef.content.isSaved && this.bsModalRef.content.combo) {
          console.log("this.bsModalRef.content.combo", this.bsModalRef.content.combo);
          const myBsModalContentCombo = this.commonFunctionsService.deepCopy(this.bsModalRef.content.combo);
          console.log("loadNewComboWithItems() - myBsModalContentCombo", myBsModalContentCombo);
          console.log("comboItem", comboItem);
          

          if (callback) {
            callback(this.bsModalRef.content);
    
          }
        }
      });
 
  }
  public editItem(item) {
    console.log("editItem editItem", item);
    if(item.FullPizza){
      var myClass;
      if(this.isMobileMode()){
          myClass = 'modal-after-edit';
      }
      else myClass = 'modal-dialog-item-with-garnishes-mat-dialog'

      const initialState = {
        pizza: item,
        isEdit: true
      };
      this.bsModalRef = this.modalService.show(PizzaComponent,
        { initialState, class: myClass });
      this.modalService.onHide
        .pipe(take(1)).subscribe(() => {

          console.log("menu close modal item", this.bsModalRef.content)
          if (this.bsModalRef.content.isSaved && this.bsModalRef.content.pizza) {
            const orderPizza = this.preparePizzaForOrder(this.bsModalRef.content.pizza,this.bsModalRef.content.comments);
            console.log("orderPizza",orderPizza);
            orderPizza.SpecialRequests = this.bsModalRef.content.comments;
            console.log("orderPizza",orderPizza);
            //const index = this.getIndexIfNotHavingGarnishes(this.bsModalRef.content.item);
            var index = this.order.OrderPizzas.indexOf(item);
            console.log("index", index);
            this.order.OrderPizzas[index] = orderPizza;
            console.log("this.order.OrderPizzas[index]",this.order.OrderPizzas[index]);

            this.orderService.recalculateSum();
            console.log("this.order.Sum", this.order.Sum)
            //this.resetItem(item);

            if(orderPizza.FullPizza.SelectedGarnishes && orderPizza.FullPizza.SelectedGarnishes.length>0 && !this.isMobileMode()){
              this.openItemPopup(orderPizza);
            }

            //this.loadSuccessAddingToCartMessage(false);

          }
        });

    }
    
    if (!item.IsBonus && !item.FullPizza) {
      if (!item.Item && item.Id) { //case for Bulls order
        this.appStorageService.categories.forEach((c)=>{
          c.Items.forEach((i)=>{
           /* if (i.Id == item.Id){
              item.ItemId == item.Id;
              item.CatalogNumber = i.CatalogNumber;
              item.CategoryId = i.CategoryId;
              item.Amount = i.Amount;
              
            //  orderItem.Comment = '';
              item.IsCombo = i.IsCombo;
              item.Item = this.commonFunctionsService.deepCopy(i);
              //  orderItem.Items = [];
              if (item.Garnishes) {
              }
          
              const garnishes = [];
              if (item.SelectedGarnishes) {
                item.SelectedGarnishes.forEach((garnish: GarnishAppAdvancedModel) => {
                  garnishes.push(garnish);
                  if (garnish.SelectedAmount > 1) {
                    for (let i = 0; i < garnish.SelectedAmount - 1; i++) {
                      const grn = this.commonFunctionsService.deepCopy(garnish);
                      grn.SelectedAmount = 1;
                      garnishes.push(grn);
                    }
                  }
                  garnish.SelectedAmount = 1;
                });
              }
              // Check if some garnish groups have free count of garnishes
              // Group of garnishes:
              const garnishesGroup = {};
              garnishes.forEach((garnish) => {
                if (garnish) {
                  garnishesGroup[garnish.GarnishGroupId] = garnishesGroup[garnish.GarnishGroupId] || [];
                  garnishesGroup[garnish.GarnishGroupId].push(garnish);
                }
              });
              // Check free count of garnishGroup:
              Object.keys(garnishesGroup).forEach((key) => {
                console.log("KEY??????????????????????");
                if (item.GarnishGroups) {
                  for (let i = 0; i < item.GarnishGroups.length; i++) {
                    if (item.GarnishGroups[i].Garnishes && item.GarnishGroups[i].Garnishes[0]
                      && item.GarnishGroups[i].Garnishes[0].GarnishGroupId === +key && item.GarnishGroups[i].FreeCount) {
                      garnishesGroup[key].sort((garnish1, garnish2) => {
                        return garnish1.Price - garnish2.Price;
                      }).map((garnish, index) => {
                        if (index < item.GarnishGroups[i].FreeCount) {
                          garnish.Price = 0;
                        }
                      });
                    }
                  }
                }
              });
              orderItem.Garnishes = garnishes;
              //console.log("prepareItemForOrder garnishes", garnishes)
              orderItem.Item.SelectedGarnishes = this.commonFunctionsService.deepCopy(garnishes);
              orderItem.SpecialRequests = '';
              orderItem.ComboItemId = 0;
              orderItem.IsScratchCoupon = false;
              orderItem.ScratchCouponId = 0;
              orderItem.Price = item.Price;
              orderItem.ImageUrl = item.ImageUrl;
              orderItem.Name = item.Name;
            }*/
          });
        });
      }
      const initialState = {
        item: item.Item,
        isEdit: true
      };
      this.bsModalRef = this.modalService.show(ItemComponent,
        { initialState, class: 'modal-after-edit' });
      this.modalService.onHide
        .pipe(take(1)).subscribe(() => {

          console.log("menu close modal item", this.bsModalRef.content)
          if (this.bsModalRef.content.isSaved && this.bsModalRef.content.item) {
            if(this.bsModalRef.content.item.ItemGroups && this.bsModalRef.content.item.ItemGroups.length>0){
              const tmpItem = this.bsModalRef.content.item;
              console.log("tmpItem",tmpItem);
              let specialRequests = this.bsModalRef.content.itemComments;
              let itemName = this.bsModalRef.content.itemName;
             // const index = this.getIndexIfNotHavingGarnishes(this.bsModalRef.content.item);
              console.log("item.ItemGroups",this.bsModalRef.content.item.ItemGroups);
              //this.loadNewComboWithItems(item);
              this.loadNewComboWithItems(this.bsModalRef.content.item, (result) => {
                console.log("result - after combo --> add to cart itemWithGroups", result);
                if(result && result.isSaved ){//&& result.combo.SelectedItems
                  const orderItem = this.prepareItemWithItemGroupsForOrder(tmpItem, result.combo.SelectedItems);
                  console.log("orderItem", orderItem);
                  orderItem.SpecialRequests = specialRequests;//this.bsModalRef.content.itemComments;
                  orderItem.ItemName = itemName;//this.bsModalRef.content.itemName;
                //  const index = this.getIndexIfNotHavingGarnishes(this.bsModalRef.content.item);
                 
                  var index = this.order.OrderItems.indexOf(item);
                  this.order.OrderItems[index] = orderItem;
  
                if(this.order.OrderItems.length>0)  
                  this.checkForCombo();

                this.orderService.recalculateSum();
                this.resetItem(item);
                }
  
              });
            } else {
              const orderItem = this.prepareEditedItemForOrder(this.bsModalRef.content.item);
              console.log("orderItem", orderItem);
              orderItem.SpecialRequests = this.bsModalRef.content.comments;
              //const index = this.getIndexIfNotHavingGarnishes(this.bsModalRef.content.item);
              var index = this.order.OrderItems.indexOf(item);
              console.log("index", index);
              this.order.OrderItems[index] = orderItem;
              console.log("this.order.OrderItems[index]", this.order.OrderItems[index]);
  
              this.orderService.recalculateSum();
              console.log("this.order.Sum", this.order.Sum)
              this.resetItem(item);
            }
            

            //this.loadSuccessAddingToCartMessage(false);

          }
        });
    }
    else if (item.IsBonus) {
      this.categories = this.appStorageService.categories || [];

      if (AppConfig.configSettings.bonusCategory && AppConfig.configSettings.bonusCategory != '') {
        const bonusItemsCategory = this.categories.find
          (it => it.Name === AppConfig.configSettings.bonusCategory);
        if (bonusItemsCategory && bonusItemsCategory.Items
          && bonusItemsCategory.Items.length > 0) {
          this.bonusItems = bonusItemsCategory.Items;
          this.categories = this.categories.filter
            (it => it.Items && it.Items.length > 0 && it.Name != AppConfig.configSettings.bonusCategory);
        }

        this.categories = this.categories.filter(it => it.Items && it.Items.length > 0);
      }


      const minForBonus = AppConfig.configSettings.minAmountForBonus;
      const firstMessage = this.translationsService.translate('BONUS_FIRST');
      const bonusMSG = AppConfig.configSettings.bonusMsg;
      console.log(minForBonus);
      console.log(firstMessage);
      if (this.bonusItems && this.bonusItems.length > 0) {
        const matDialogRef = this.matDialog.open(AdditionalItemsComponent, {
          data: {
            //header: message,
            items: this.commonFunctionsService.deepCopy(this.bonusItems),
            maxItems: 1,
            isBonusMode: true,
            minForBonus: minForBonus,
            firstMessage: firstMessage,
            icon: '../../../../assets/images/items/cart-icon-big.svg',
            bonusMSG: bonusMSG,
          },
          minWidth: '350px',
          width: '100%',
          maxWidth: '1000px',
          disableClose: false,
          panelClass: 'custom-mat-dialog-mobile-bonus'
        });
        matDialogRef.afterClosed().subscribe((result) => {
          console.log("afterClosed()-->", result);
          if (result.isSaved && result.selectedItems) {
            this.order.OrderItems.forEach(item => {
              if(item.IsBonus){
                this.order.OrderItems.splice(this.order.OrderItems.indexOf(item), 1);
              }
            });
            
            result.selectedItems.forEach(orderAdditionalItem => {
              this.order.OrderItems.push(orderAdditionalItem);
              this.order.hasBonusItems = true;
            });
            //  this.addToCartComboItem(result.combo, comboItem);
          }
        });


      }
    }
  }
  

  private prepareItemWithItemGroupsForOrder(item : ItemAppAdvancedModel, items: any[]) {
    console.log("prepareItemForOrder - item", item)

    const orderItem = new OrderItemAppModel();
    orderItem.IsUpgrade = item.IsUpgrade;
    if(item.IsUpgrade){
      orderItem.Amount = 1;
    }
    else {
      orderItem.Amount = item.Amount;
    }
    orderItem.ItemId = item.Id;
    orderItem.Comment = '';
    orderItem.IsCombo = item.IsCombo;
    orderItem.CategoryId = item.CategoryId;
    orderItem.Item = this.commonFunctionsService.deepCopy(item);
    orderItem.Items = [];
    items.forEach(selectedItem => {
      const orderSubItem = this.prepareSubItemForOrder(selectedItem);
      orderSubItem.SpecialRequests = selectedItem.specialRequests;
      orderSubItem.ItemName = selectedItem.ItemName;
      orderSubItem.Price = selectedItem.Price;
      orderSubItem.IsItemsGroupItemKeptPrice = true;
      console.log("orderItem",orderSubItem);
      orderSubItem.Amount = 1;
      orderSubItem.GroupItemId = selectedItem.GroupItemId;
      orderSubItem.ParentItemId = item.Id;
      orderItem.Items.push(orderSubItem);
      
    });

    const garnishes = [];
    if (item.SelectedGarnishes) {
      item.SelectedGarnishes.forEach((garnish: GarnishAppAdvancedModel) => {
        garnishes.push(garnish);
        if (garnish.SelectedAmount > 1) {
          for (let i = 0; i < garnish.SelectedAmount - 1; i++) {
            const grn = this.commonFunctionsService.deepCopy(garnish);
            grn.SelectedAmount = 1;
            garnishes.push(grn);
          }
        }
        garnish.SelectedAmount = 1;
      });
    }
    // Check if some garnish groups have free count of garnishes
    // Group of garnishes:
    const garnishesGroup = {};
    garnishes.forEach((garnish) => {
      if (garnish) {
        garnishesGroup[garnish.GarnishGroupId] = garnishesGroup[garnish.GarnishGroupId] || [];
        garnishesGroup[garnish.GarnishGroupId].push(garnish);
      }
    });
    // Check free count of garnishGroup:
    Object.keys(garnishesGroup).forEach((key) => {
      console.log("KEY??????????????????????");
      if (item.GarnishGroups) {
        for (let i = 0; i < item.GarnishGroups.length; i++) {
          if (item.GarnishGroups[i].Garnishes && item.GarnishGroups[i].Garnishes[0]
            && item.GarnishGroups[i].Garnishes[0].GarnishGroupId === +key && item.GarnishGroups[i].FreeCount) {
            garnishesGroup[key].sort((garnish1, garnish2) => {
              return garnish1.Price - garnish2.Price;
            }).map((garnish, index) => {
              if (index < item.GarnishGroups[i].FreeCount) {
                garnish.Price = 0;
              }
            });
          }
        }
      }
    });
    orderItem.Garnishes = garnishes;
    //console.log("prepareItemForOrder garnishes", garnishes)
    orderItem.Item.SelectedGarnishes = this.commonFunctionsService.deepCopy(garnishes);
    orderItem.SpecialRequests = '';
    orderItem.ComboItemId = 0;
    orderItem.IsScratchCoupon = false;
    orderItem.ScratchCouponId = 0;
    orderItem.Price = item.Price;
    orderItem.ImageUrl = item.ImageUrl;
    orderItem.Name = item.Name;
   
    return orderItem;
  }

  private prepareSubItemForOrder(item : ItemAppAdvancedModel) {
    console.log("prepareItemForOrder - item", item)

    const orderItem = new OrderItemAppModel();
    orderItem.IsUpgrade = item.IsUpgrade;
    if(item.IsUpgrade){
      orderItem.Amount = 1;
    }
    else{
      orderItem.Amount = item.Amount;
    }
    orderItem.ItemId = item.Id;
    orderItem.Comment = '';
    orderItem.IsCombo = item.IsCombo;
    orderItem.CategoryId = item.CategoryId;
    orderItem.Item = this.commonFunctionsService.deepCopy(item);
    const garnishes = [];
    if (item.SelectedGarnishes) {
      item.SelectedGarnishes.forEach((garnish: GarnishAppAdvancedModel) => {
        garnishes.push(garnish);
        if (garnish.SelectedAmount > 1) {
          for (let i = 0; i < garnish.SelectedAmount - 1; i++) {
            const grn = this.commonFunctionsService.deepCopy(garnish);
            grn.SelectedAmount = 1;
            garnishes.push(grn);
          }
        }
        garnish.SelectedAmount = 1;
      });
    }
    // Check if some garnish groups have free count of garnishes
    // Group of garnishes:
    const garnishesGroup = {};
    garnishes.forEach((garnish) => {
      if (garnish) {
        garnishesGroup[garnish.GarnishGroupId] = garnishesGroup[garnish.GarnishGroupId] || [];
        garnishesGroup[garnish.GarnishGroupId].push(garnish);
      }
    });
    // Check free count of garnishGroup:
    Object.keys(garnishesGroup).forEach((key) => {
      console.log("KEY??????????????????????");
      if (item.GarnishGroups) {
        for (let i = 0; i < item.GarnishGroups.length; i++) {
          if (item.GarnishGroups[i].Garnishes && item.GarnishGroups[i].Garnishes[0]
            && item.GarnishGroups[i].Garnishes[0].GarnishGroupId === +key && item.GarnishGroups[i].FreeCount) {
            garnishesGroup[key].sort((garnish1, garnish2) => {
              return garnish1.Price - garnish2.Price;
            }).map((garnish, index) => {
              if (index < item.GarnishGroups[i].FreeCount) {
                garnish.Price = 0;
              }
            });
          }
        }
      }
    });
    orderItem.Garnishes = garnishes;
    //console.log("prepareItemForOrder garnishes", garnishes)
    orderItem.Item.SelectedGarnishes = this.commonFunctionsService.deepCopy(garnishes);
    orderItem.SpecialRequests = '';
    orderItem.ComboItemId = 0;
    orderItem.IsScratchCoupon = false;
    orderItem.ScratchCouponId = 0;
    orderItem.Price = item.Price;
    orderItem.ImageUrl = item.ImageUrl;
    orderItem.Name = item.Name;
    return orderItem;
  }

  public openItemPopup(item) {
    console.log("openItemPopup()");
    console.log("item",item);
    // let index = res.index;

    let itemToEdit = item;
    console.log("itemToEdit", itemToEdit);

    if (!itemToEdit.IsBonus) {
      console.log("ITEM IS NOT BONUS");
      const initialState = {
        item: item.FullPizza,
        isEdit: true
      };
      this.bsModalRef = this.modalService.show(ItemWithGarnishesComponent,
        { initialState, class: 'modal-dialog-item-with-garnishes' });
      this.modalService.onHide
        .pipe(take(1)).subscribe(() => {

          console.log("menu close modal item", this.bsModalRef.content)
          if (this.bsModalRef.content.isSaved && this.bsModalRef.content.item) {
            const orderPizza = this.prepareEditedGarnishesForPizza(this.bsModalRef.content.item , item);
            orderPizza.SpecialRequests = this.bsModalRef.content.comments;
            console.log("orderPizza - AfterEditGarForPizza",orderPizza)
            console.log("this.bsModalRef.content.comments", this.bsModalRef.content.comments)
            //const index = this.getIndexIfNotHavingGarnishes(this.bsModalRef.content.item);
            var index = this.order.OrderPizzas.indexOf(item);
            this.order.OrderPizzas[index] = orderPizza;

            this.orderService.recalculateSum();
            this.resetItem(item);

            //this.loadSuccessAddingToCartMessage(false);

          }
        });
    }
  }

  private prepareEditedGarnishesForPizza(item: ItemAppAdvancedModel, orderPizza) {

    const garnishes = [];
    if (item.SelectedGarnishes) {
      item.SelectedGarnishes.forEach((garnish: GarnishAppAdvancedModel) => {
        garnishes.push(garnish);
        if (garnish.SelectedAmount > 1) {
          for (let i = 0; i < garnish.SelectedAmount - 1; i++) {
            const grn = this.commonFunctionsService.deepCopy(garnish);
            grn.SelectedAmount = 1;
            garnishes.push(grn);
          }
        }
        garnish.SelectedAmount = 1;
      });
    }

    orderPizza.Garnishes = garnishes;
    //console.log("prepareItemForOrder garnishes", garnishes)
    orderPizza.FullPizza.SelectedGarnishes = garnishes;
    orderPizza.SelectedGarnishes = garnishes;


    return orderPizza;
  }

  public resetItem(item) {
    if (item) {
      item.Amount = 1;
      item.SelectedGarnishes = [];
      if (item.Garnishes) {
        item.Garnishes.forEach((garnish) => {
          garnish.IsSelected = false;
          garnish.SelectedAmount = 0;
        });
      }
      if (item.GarnishGroups) {
        item.GarnishGroups.forEach((group) => {
          if (group && group.Garnishes) {
            group.Garnishes.forEach((grn) => {
              grn.IsSelected = false;
              grn.SelectedAmount = 0;
            })
          }
        });
      }
      if (item.SelectedToppings) {
        item.SelectedToppings = [];
      }
    }
  }


  private prepareEditedItemForOrder(item: ItemAppAdvancedModel) {
    // console.log("prepareItemForOrder", item)
      const orderItem = new OrderItemAppModel();
      orderItem.Amount = item.Amount;
      orderItem.ItemId = item.Id;
      orderItem.Comment = '';
      orderItem.Item = this.commonFunctionsService.deepCopy(item);
      const garnishes = [];
      if (item.SelectedGarnishes) {
        item.SelectedGarnishes.forEach((garnish: GarnishAppAdvancedModel) => {
          garnishes.push(garnish);
          if (garnish.SelectedAmount > 1) {
            for (let i = 0; i < garnish.SelectedAmount - 1; i++) {
              const grn = this.commonFunctionsService.deepCopy(garnish);
              grn.SelectedAmount = 1;
              garnishes.push(grn);
            }
          }
          garnish.SelectedAmount = 1;
        });
      }

          const garnishesGroup = {};
    garnishes.forEach((garnish) => {
      if (garnish) {
        garnishesGroup[garnish.GarnishGroupId] = garnishesGroup[garnish.GarnishGroupId] || [];
        garnishesGroup[garnish.GarnishGroupId].push(garnish);
      }
    });
    // Check free count of garnishGroup:
    Object.keys(garnishesGroup).forEach((key) => {
      console.log("KEY??????????????????????");
      if (item.GarnishGroups) {
        for (let i = 0; i < item.GarnishGroups.length; i++) {
          if (item.GarnishGroups[i].Garnishes && item.GarnishGroups[i].Garnishes[0]
            && item.GarnishGroups[i].Garnishes[0].GarnishGroupId === +key && item.GarnishGroups[i].FreeCount) {
            garnishesGroup[key].sort((garnish1, garnish2) => {
              return garnish1.Price - garnish2.Price;
            }).map((garnish, index) => {
              if (index < item.GarnishGroups[i].FreeCount) {
                garnish.Price = 0;
              }
            });
          }
        }
      }
    });
      console.log("garnishes",garnishes);
       
      orderItem.Garnishes = garnishes;
      //console.log("prepareItemForOrder garnishes", garnishes)
      orderItem.Item.SelectedGarnishes = this.commonFunctionsService.deepCopy(garnishes);
      orderItem.SpecialRequests = '';
      orderItem.ComboItemId = 0;
      orderItem.IsScratchCoupon = false;
      orderItem.ScratchCouponId = 0;
      orderItem.Price = item.Price;
      orderItem.ImageUrl = item.ImageUrl;
      orderItem.Name = item.Name;

      console.log("orderItem",orderItem);
      
      return orderItem;
    }
  

  public sortingScratchCouponsByExpirationDate(scratchCoupons) {
    if (scratchCoupons && Array.isArray(scratchCoupons)) {
      scratchCoupons = scratchCoupons.sort((item1, item2) => {
        const d1 = new Date(item1.ExpirationDate);
        const d2 = new Date(item2.ExpirationDate);
        return +d1 - +d2;
      });
    }
  }

  public winnerScratchCoupon = undefined;
  public scratchCoupons: any[];
  public isLoadedScratchCoupon = true;

  public getActiveCoupons() {
    const loginToken = this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.franchiseId); //'b9139f6a-3c21-47b9-9a7f-0f7121fbf674';
    if (loginToken != undefined) {
      this.isLoadedScratchCoupon = false;
      this.scratchCouponService.getActiveCoupons(loginToken)
        .subscribe((response) => {
          if (response && response.Success) {
            let scratchCoupons = response.ActiveCoupons || [];
            this.checkAndPrepareDates(scratchCoupons);
            this.sortingScratchCouponsByExpirationDate(scratchCoupons);
            this.scratchCoupon = scratchCoupons[0];
            if (this.scratchCoupon && this.scratchCoupon.Item) {
              this.scratchCouponService.GetItem(this.scratchCoupon.Item.Id)
                .subscribe((currentItem) => {
                  const resultCurrentItem = currentItem || {};
                  this.scratchCoupon.CurrentItem = resultCurrentItem.item;
                  if (this.scratchCoupon.CurrentItem) {
                   
                   
                    this.scratchCoupon.CurrentItem.IsScratchCoupon = true;
                    this.scratchCoupon.CurrentItem.Price = 0;
                    this.scratchCoupon.CurrentItem.Amount = 1;
                    if (!this.appStorageService.wasScratchDisplayed){
                      this.displayScratchCoupon(this.scratchCoupon);
                    }
                  }
                  this.isLoadedScratchCoupon = true;
                }, (error) => {
                  this.isLoadedScratchCoupon = true;
                  // this.messageService.displayServerErrorMessage();
                });
            } else {
              this.isLoadedScratchCoupon = true;
            }
          } else {
            this.isLoadedScratchCoupon = true;
          }
        }, (error) => {
          this.isLoadedScratchCoupon = true;
          //this.messageService.displayServerErrorMessage();
        });
    }
  }

  public checkAndPrepareDates(scratchCoupons) {
    scratchCoupons.forEach((scratchCoupon) => {
      if (scratchCoupon.ExpirationDate) {
        scratchCoupon.ExpirationDate = this.fixDate(scratchCoupon.ExpirationDate);
      }
    });
  }

  public fixDate(inputDate) {
    let date = new Date(inputDate);
    if (date.toString() == 'Invalid Date') {
      date = new Date(+inputDate.toString().slice(6, -2));
    }
    return date.toString();
  }

  public isAvailableScratchCoupon() {
   // console.log("isAvailableScratchCoupon this.scratchCoupon", this.scratchCoupon );
   // console.log("isAvailableScratchCoupon sum", this.resultSumWithoutDelivery(this.order.Sum) >= this.scratchCoupon.MinOrderSum );
   // console.log("isAvailableScratchCoupon isSignedUser", this.isSignedUser);
   // console.log("isAvailableScratchCoupon appStorageService", this.appStorageService.useScratchCoupon &&
   // !this.appStorageService.isUsedScratchCoupon);
    return this.scratchCoupon && this.scratchCoupon.CurrentItem &&
      this.resultSumWithoutDelivery(this.order.Sum) >= this.scratchCoupon.MinOrderSum && this.isSignedUser &&
      this.appStorageService.useScratchCoupon &&
      !this.appStorageService.isUsedScratchCoupon;
  }

  private loadUserDataToOrder(user, ccTokens, withAddress, cibusTokens,tenbisTokens) {
    console.log("loadUserDataToOrder: ccTokens", ccTokens);
    console.log("loadUserDataToOrder: cibusTokens", cibusTokens);
    if (user) {
      this.user = user;
      this.order.Code = user.CompanyCode || '';
      this.order.FirstName = user.FirstName || '';
      this.order.LastName = user.LastName || '';
      this.order.Phone = user.Phone || '';
      this.order.ExtraPhone = user.ExtraPhone || '';
      if (ccTokens && ccTokens.length>0) {
        this.order.CCTokens = ccTokens;
        this.selectedCcId = this.order.CCTokens[0].Id; 
        console.log("order",this.order);
      } else {
        this.order.CCTokens = [];
      }
      if(cibusTokens && cibusTokens != 'undefined' && cibusTokens != undefined){
        this.order.cibusTokens = cibusTokens;
        this.selectedCibus = cibusTokens;
        console.log("this.order.cibusTokens", this.order.cibusTokens);
        console.log("this.selectedCibus", this.selectedCibus);
        this.cibusEnd = cibusTokens.toString();
        this.cibusEnd = this.cibusEnd.substring(5,9);

        console.log("cibusEnd", this.cibusEnd);


      }
      if(tenbisTokens && tenbisTokens != 'undefined' && tenbisTokens != undefined){
        this.order.tenBisTokens = tenbisTokens;
        this.selectedTenbis = tenbisTokens;
        console.log("this.order.tenbisTokens", this.order.tenBisTokens);
        console.log("this.selectedTenbis", this.selectedTenbis);
        this.tenbisEnd = cibusTokens.toString().slice(-4);
         

        console.log("cibusEnd", this.cibusEnd);
        

      }
      if (withAddress) {
        this.order.UserCity = user.UserCity; // this.checkUserCityInListOfCities(user.UserCity);
        this.order.Street = user.Street || '';
        this.order.Floor = user.Floor || '';
        this.order.ApartmentNum = user.ApartmentNum || '';
        this.order.StreetNum = user.StreetNum || '';
      }
      if (this.order.IsDelivery && AppConfig.configSettings.deliveryDetailsAtCheckout)
      {
        this.displayAddressInformation((result)=>{
          if (result.isSaved) {
            this.orderService.recalculateSum();
          }
        });
      }
    }
  }

  private loadOrderUserDataToUser(user) {
    if (user) {
      user.FirstName = this.order.FirstName || '';
      user.LastName = this.order.LastName || '';
      if(this.displayCompanyCode)
        user.CompanyCode = this.order.Code || '';
      if (this.order.IsDelivery) {
        user.ExtraPhone = this.order.ExtraPhone || '';
        user.UserCity = this.order.UserCity || ''; // this.checkUserCityInListOfCities(this.order.UserCity);
        user.Street = this.order.Street || '';
        user.Floor = this.order.Floor || '';
        user.ApartmentNum = this.order.ApartmentNum || '';
        user.StreetNum = this.order.StreetNum || '';
      }
    }
  }

  private checkUserCityInListOfCities(checkedCity) {
    if (this.cities) {
      const city = this.cities.find((city) => {
        return city && checkedCity && city.Name.toLowerCase() === checkedCity.toLowerCase();
      });
      return city ? city.Name : '';
    }
    return '';
  }

  private getMinDateStr(minDate) {
    return minDate.getHours() + ':' + this.roundTimeToNearestFive(minDate).getMinutes();
  }

  public roundTimeToNearestFive(date) {
    const coeff = 1000 * 60 * 5;
    return new Date(Math.ceil(date.getTime() / coeff) * coeff)
  }

  private getDateTimeFromTimeStr(time) {
    let dateTime = new Date();
    if (time != undefined && time.indexOf(':') >= 0) {
      let split = time.split(' ');
      split = split[0].split(':');
      dateTime = new Date(dateTime.setMinutes(split[1]));
      dateTime = new Date(dateTime.setHours(split[0]));
      return dateTime;
    }
    return undefined;
  }

  public isOpenedBranch: boolean = true;

  private padMinutes(minutes) {
    if (minutes.length == 2) {
      return minutes;
    }
    else {
      return '0' + minutes;
    }
  }

  private closedBranchMessage() {
    console.log("closedBranchMessage");
    this.isLoaded.isFranchiseWithBranchesLoaded = false;
    this.metadataService.getFranchiseWithBranches(this.appStorageService.orderType)
      .subscribe((result) => {
        if (result && result.branches) {
          const findBranch = result.branches.find((branch) => {
            return branch && this.branch && branch.Id === this.branch.Id;
          });
          if (findBranch) {
            this.branch = this.commonFunctionsService.deepCopy(findBranch);
            console.log(" this.branch = ", this.branch);
            this.branch.DeliveryBranchGroup = this.deliveryGroup;
          }
        }
        this.isLoaded.isFranchiseWithBranchesLoaded = true;
        this.displayPopupMessageIsClosedBranch();
      }, (error) => {
        this.isLoaded.isFranchiseWithBranchesLoaded = true;
        this.messageService.displayServerErrorMessage();
      });
  }

  private branchSettings(branch) {
    if (branch) {
      let method = -1;
      if (this.order.IsDelivery) {
        method = 0;
      } else if (this.order.IsTakeAway) {
         method = 1;
      } else  {
        method = 2;
      }
      this.metadataService.isOpenForPickupMethod(this.order.BranchId, method).subscribe((response) => {
        this.branch.IsOpen = response;
        this.isOpenedBranch = this.branch.IsOpen;

        if (!this.isOpenedBranch && !this.order.IsFutureOrder) {
          this.closedBranchMessage();
        } else {
          this.minDate = new Date();
          this.minDateStr = this.getMinDateStr(this.minDate);
          this.maxDate = this.getDateTimeFromTimeStr(this.branch.ClosingTime);
          this.maxDateStr = this.maxDate.getHours() + ':' + this.padMinutes(this.maxDate.getMinutes());
        }
        let timeToAdd = this.order.IsDelivery ? this.branch.DeliveryTimeInMinutes : (
          this.order.IsTakeAway ? this.branch.TakeawayTimeInMinutes : 0);
        this.minDate.setMinutes(this.minDate.getMinutes() + timeToAdd);
        this.minDateStr = this.getMinDateStr(this.minDate);
      }, (error) => {
        this.isLoaded.isDeliveryDataLoaded = true;
        this.messageService.displayServerErrorMessage();
      });
      this.isLoaded.isDeliveryDataLoaded = true;
      if (this.order.IsDelivery) {
        // this.initializeBranchCities();
        this.citySettings(true);
      } else {

      }
      this.getCashRegister();
    }
  }

  private getCashRegister() {
    this.paymentService.getCashRegister(this.branch.Id).subscribe((response) => {
      this.isLoaded.isCashRegisterLoaded = true;
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
      else if (this.cashRegister.UseTranzilaIframe &&  
          this.cashRegister.tranzillaTerminal != "" &&
          this.cashRegister.tranzillaTerminal != null &&
          this.cashRegister.tranzillaTerminal != undefined &&
          this.cashRegister.tranzillaTerminal != "undefined")
          this.useTranzilaIframe = true;
      else   this.useTranzilaIframe = false;
      if (this.cashRegister.IsMeshulam) {
        this.useMeshulamIframe = true;
        if (this.useMeshulamIframe) {
          console.log("useMeshulamIframe");
          var scriptElement = document.getElementById("meshulam_script");
          if (!scriptElement) {
            var s = document.createElement('script');
          s.type = 'text/javascript';
          s.async = true;
          s.id = "meshulam_script";
          s.src = 'https://cdn.meshulam.co.il/sdk/gs.min.js';
          s.onload = this.configureGrowSdk; //replace with your callback function
          var x = document.getElementsByTagName('script')[0];
          x.parentNode.insertBefore(s, x);
          console.log("document.head", document.head);
    
          } else {
            console.log("scriptElement", scriptElement);
          }
        }
      }
      else {
        if (this.cashRegister.cashRegisterType == 'Tranzila' || this.cashRegister.isTranzila) this.sendInvoice = true;
      }
      
    }, (error) => {
      this.isLoaded.isCashRegisterLoaded = true;
      this.messageService.displayServerErrorMessage();
    });
  }

  private displayPopupMessageIsClosedBranch() {
    let message = this.translationsService.translate('ORDER_BRANCH_CLOSED_NOW');
    let header = this.translationsService.translate('PAY_ATTENTION');
    let icon = "../../../assets/images/items/branch-close.svg";
    if (this.branch) {
      message += '\n' + (this.branch.IsClosedTodayComment || '');
      if (this.branch.WorkingHoursStr) {
        message += '\n' + (this.translationsService.translate('ORDER_OPENTIME'));
        message += '\n \n' + (this.branch.WorkingHoursStr || '');
      }
    }
    const data = {
      header,
      icon,
      message,
      withoutTimeout: true,
      isUsedPre: true
    };
    this.displayPopupMessage(data);
  }

  private displayPopupMessage(data) {
   // console.log("this.isLoaded", this.isLoaded,this.checkLoading() , this.showLoader);
    const matDialogRef = this.matDialog.open(MessagePopupComponent, {
      data,
      width: '50%',
      maxWidth: '1200px',
      disableClose: true,
      panelClass: 'custom-mat-dialog-popup'
    });
    matDialogRef.afterClosed().subscribe((result) => {

    });
  }

  private displayPopupMessageIfNotFoundCityInfoForDelivery() {
    let message = this.translationsService.translate('ORDER_NOT_FOUND_INFO_DELIVERY_GROUP');
    const data = {
      message,
      withoutTimeout: true
    };
    this.displayPopupMessage(data);
  }

  public citySettings(notDisplay?: boolean) {
    this.isLoaded.isDeliveryDataLoaded = true;
    if (!this.order) return;
    if (!this.order.UserCity) return;
    //find group
    if (this.order.IsDelivery && this.branch) {
      if (!this.branch.DeliveryBranchGroup) {
        this.branch.DeliveryGroups.forEach((group) => {
          let exists = group.Cities.find((e) => {
            return e && e.Name && e.Name.toLowerCase() === this.order.UserCity.toLowerCase();
          });
          if (exists) {
            this.deliveryGroup = group;
            console.log(" this.deliveryGroup", this.deliveryGroup);
          }
        });
      } else {
        if (this.branch.DeliveryBranchGroup) {
          this.deliveryGroup = this.branch.DeliveryBranchGroup;
          console.log(" this.deliveryGroup", this.deliveryGroup);
          this.order.deliveryGroup = this.branch.DeliveryBranchGroup;
          localStorage.setItem(window.location.hash, JSON.stringify(this.order));
        }
        else {
          this.deliveryGroup = this.order.deliveryGroup;
          console.log(" this.deliveryGroup", this.deliveryGroup);
        }
      }
      // console.log('!!!', this.deliveryGroup);
      if (!this.deliveryGroup) {
        if (!notDisplay) {
          this.displayPopupMessageIfNotFoundCityInfoForDelivery();
        }
        this.deliveryGroup = undefined;
        console.log(" this.deliveryGroup", this.deliveryGroup);
      }
    } else {
      this.deliveryGroup = undefined;
      console.log(" this.deliveryGroup", this.deliveryGroup);
    }
    if (!notDisplay && !this.isOrderOption) {
      if (this.deliveryGroup && this.order && this.deliveryGroup.MinSumForDelivery > this.resultSumWithoutDelivery(this.order.Sum)) {
        this.displayDeliveryConditionDialog();
      }
    }
  }

  private displayDeliveryConditionDialog() {
    const matDialogRef = this.matDialog.open(DeliveryConditionComponent, {
      data: {
        deliveryGroup: this.deliveryGroup
      },
      width: '40%',
      maxWidth: '518px',
      minWidth: '346px',
      panelClass: 'custom-mat-dialog',
      disableClose: true,
    });
    matDialogRef.afterClosed().subscribe((result: any) => {
     // if (result) {
        
        localStorage.removeItem(window.location.hash);
        this.ngZone.run(() => this.router.navigate([`/${this.franchiseId}/menu`]))
          .then();
     // }

     // localStorage.removeItem(window.location.hash);
      // this.router.navigate([`/${this.franchiseId}/menu`])
       
    });
  }

  public openBiteCreditPopup(){
    console.log("this.isMobileMode()",this.isMobileMode());
    var minWidth;
    var maxWidth;
    var maxHeight;
    var cls;
    if(this.isMobileMode()){
      minWidth = '100vw';
      cls = 'mat-dialog-wrapper-close';

    }
    else{
      minWidth = 'none';
      maxHeight = '80vh';
      maxWidth = '50vw';
      cls = 'bite-credit-desktop'
    }
    console.log("cls",cls)
    const matDialogRef = this.matDialog.open(BiteCreditComponent, {
      data: {
        isAddCredit:true,
        creditOptions: this.appStorageService.franchise.CreditOptions,
        creditName: this.appStorageService.franchise.CreditName,
        allowCustomCreditSum: this.appStorageService.franchise.AllowCustomCreditSum,
        creditAddedValuePercent: this.appStorageService.franchise.CreditAddedValuePercent,
        appUser: this.user,
      },
      minWidth: minWidth,
      maxHeight: maxHeight,
      maxWidth: maxWidth,
      disableClose: true,
      panelClass: cls
    });
    matDialogRef.afterClosed().subscribe((result) => {

    });
  }
  

  private checkBranch(extraFunction?) {
    console.log("checkBranch");
    this.isLoaded.isFranchiseWithBranchesLoaded = false;
    this.branch = this.appStorageService.branch;
   // console.log(" this.branch = ", this.branch);
    //  console.log('BRANCH:::', this.branch)
    if (this.branch.DeliveryBranchGroup) {
      this.deliveryGroup = this.branch.DeliveryBranchGroup;
      console.log(" this.deliveryGroup", this.deliveryGroup);
      this.order.deliveryGroup = this.branch.DeliveryBranchGroup;
      localStorage.setItem(window.location.hash, JSON.stringify(this.order));
    }
    else { 
      this.deliveryGroup = this.order.deliveryGroup;
      console.log(" this.deliveryGroup", this.deliveryGroup);
    }
    const completeIsOpenBranchChecking = () => {
      if (this.branch) {
        this.minDate = this.getDateTimeFromTimeStr(this.branch.OpeningTime);
        this.minDateStr = this.getMinDateStr(this.minDate);
        if (this.branch && this.branch.IsOpen) {
          this.minDate = this.getDateTimeFromTimeStr(this.branch.OpeningTime);
          this.minDateStr = this.getMinDateStr(this.minDate);
        } else {
          this.minDate = new Date();
          this.minDateStr = this.getMinDateStr(this.minDate);
        }
        let timeToAdd = this.order.IsDelivery ? this.branch.DeliveryTimeInMinutes :
          (this.order.IsTakeAway ? this.branch.TakeawayTimeInMinutes : 0);
        this.minDate.setMinutes(this.minDate.getMinutes() + timeToAdd);
        this.minDateStr = this.getMinDateStr(this.minDate);
        this.branchSettings(this.branch);
      }
      // For any order except delivery - remove deliveryGroup;
      if (this.order && !this.order.IsDelivery) {
        this.deliveryGroup = undefined;
      }
      if (extraFunction) {
        extraFunction();
      }
    }
    this.metadataService.getFranchiseWithBranches(this.appStorageService.orderType)
      .subscribe((result) => {
        if (result && result.branches) {
          AppConfig.settings.taxId = result.franchise.AndroidName;
          const findBranch = result.branches.find((branch) => {
            return branch && this.branch && branch.Id === this.branch.Id;
          });
          if (findBranch) {
            this.branch = this.commonFunctionsService.deepCopy(findBranch);
            console.log(" this.branch = ", this.branch);
            this.branch.DeliveryBranchGroup = this.deliveryGroup;
          }
        }
        completeIsOpenBranchChecking();
        this.isLoaded.isFranchiseWithBranchesLoaded = true;
      }, (error) => {
        this.isLoaded.isFranchiseWithBranchesLoaded = true;
        this.messageService.displayServerErrorMessage();
      });
  };

  public verifyToken(isFirstTime?) {
    console.log("verifyToken");
    const token = this.appStorageService
      .getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.configService.franchiseId);
    if (token) {
      this.isLoaded.isValidationUserLoaded = false;
      this.signInOutService.verifyToken(token).subscribe((response) => {
        const result = response ? !!response.user : !!response;
        const resultAction = () => {
          if (result) {
            if(AppConfig.configSettings.cancelPhoneVerification){
              response.user.Address = null;
              response.user.IsClubMember = null;
              response.ccTokens = null;
              response.cibus = null;
              response.tenbis = null;
            }
            this.loadUserDataToOrder(response.user, response.ccTokens, false, response.cibus, response.tenbis);
            this.loadDiscountAndScratchCoupons();
            console.log("after loadUserDataToOrder");
          } else {
            this.signInOutService.signOut();
            this.checkedUserSigning(result);
          }
        }
        this.isLoaded.isValidationUserLoaded = true;
        this.checkBranch(resultAction);
      }, (error) => {
        //this.signInOutService.signOut();
        this.isLoaded.isValidationUserLoaded = true;
        this.isLoaded.isDiscountLoaded = true;
        // this.checkedUserSigning();
        this.checkBranch();
        this.messageService.displayServerErrorMessage();
      });
    } else {
      this.isLoaded.isDiscountLoaded = true;
      this.signInOutService.signOut();
      this.isSignedUser = false;
      this.checkBranch();
    }
  }

  private loadDiscountAndScratchCoupons() {
    this.checkDiscount();
    // Scratch coupon logic:
    console.log("this.appStorageService.useScratchCoupon",this.appStorageService);
    if (this.appStorageService.useScratchCoupon) {
      this.getActiveCoupons();
    }
    if (this.openAdditionalItemsModalFlag) {
      let items = this.appStorageService.categories.reduce((items: ItemAppAdvancedModel[], category) => {
        return items.concat(category.Items);
      }, []);
      const myAdditionalitems = this.commonFunctionsService.deepCopy(items);
      console.log ("myAdditionalitems",myAdditionalitems)
      const filteredItems = myAdditionalitems.filter((item) => {
        return item.IsShowInKioskEndOrder 
           
      });
      console.log ("myAdditionalitems",filteredItems)
      console.log ("this.order",this.order)
      items = myAdditionalitems.filter((item) => {
        return item.IsShowInKioskEndOrder && this.order.OrderItems &&
          this.order.OrderItems.every((currentItem) => {
            return currentItem.ItemId !== item.Id;
          });
      });
      items = items.sort(function(a, b)  {return a.Order - b.Order});
      console.log("Additional Items:", items);
      if (items && items.length > 0) {
        const matDialogRef = this.matDialog.open(AdditionalItemsComponent, {
          data: {
            header: this.translationsService.translate("additionalItems.header"),//"האם תרצו גם",
            items: this.commonFunctionsService.deepCopy(items),
            isShowInKioskEndOrder : true,
          },
          minWidth: '350px',
          width: '100%',
          maxWidth: '1000px',
          disableClose: true,
          panelClass: 'custom-mat-dialog'
        });
        matDialogRef.afterClosed().subscribe((result) => {
          if (result.isSaved && result.selectedItems) {
            result.selectedItems.forEach(orderAdditionalItem => {
              this.order.OrderItems.push(orderAdditionalItem);
            });
            this.orderService.recalculateSum();
            //  this.addToCartComboItem(result.combo, comboItem);
          }

        });
      } else {
        //nextStep();
      }
      this.openAdditionalItemsModalFlag = false;
      //this.continuePayment();
    }
  }

  public directionLanguage() {
    return LanguageEnum.HE;
  }

  public isAllValidDataToContinue() {
    //console.log("this.acceptTerms",this.acceptTerms)
 /*   if (!this.isValidCountOfOrders()){
      console.log("!isValidCountOfOrders")
     // this.displayPopupMessage("כמות פריטים לא תקינה");
    }
    if (!this.isOpenedBranchToday()){
      console.log("!isOpenedBranchToday")
     // this.displayPopupMessage("לא נמצא סניף");
    }*/
    return this.isValidCountOfOrders() && this.isOpenedBranchToday() 
    && this.acceptTerms //&& this.acceptTermsError;
  }

  public checkMinimumForClubBenefits(){
    console.log("checkMinimumForClubBenefits(): this.order",this.order);
    console.log("checkMinimumForClubBenefits(): this.appStorageService.franchise",this.appStorageService.franchise);
    const itemsFromCmShop = this.order.OrderItems.filter((item) => {
      return item.IsClubMemberItem;
    });
    if(itemsFromCmShop.length>0){
      if(this.resultSum(this.order.Sum) >= this.appStorageService.franchise.MinSumForVouchers){
        console.log("true");
        return true;
      }
      else{
        console.log("false");
        return false;
      } 
    }
    else{
      return true;
    }
  }

  public checkAmountBenefitsItems(){
    console.log("checkAmountBenefitsItems(): this.order",this.order);
    const itemsFromCmShop = this.order.OrderItems.filter((item) => {
      return item.IsClubMemberItem;
    });
    if(itemsFromCmShop.length>1){
        console.log("false");
        this.notAllowedBenefitsAmount = true;
        return false;
    }
    else{
      return true;
    }

  }

  public displaySelectionOption() {
    if (this.order.IsDelivery) {
      return this.translationsService.translate('MENU_DELIVERY');
    } else if (this.order.IsTakeAway) {
      return this.translationsService.translate('MENU_TAKEAWAY');
    } else {
      return this.translationsService.translate('MENU_SIT');
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

  public isAllValidUserData() {
    console.log("this.isFilledCustomerFields()",this.isFilledCustomerFields());
    console.log("this.this.isDeliveryConditionValid()",this.isDeliveryConditionValid() );
    return this.isFilledCustomerFields() && this.acceptTerms
    this.isDeliveryConditionValid()  ;
   
   // return this.isValidCountOfOrders() &&
   // this.isFilledCustomerFields() &&
   // this.isDeliveryConditionValid() &&
   // this.isOpenedBranchToday();
  }

  public continueToPaymentMethod() {
    console.log("this.order", this.order);
    console.log("payment");
    console.log("this.cashRegister", this.cashRegister);

    if (this.useMeshulamIframe) {
      //var orderSum  = this.order.Sum - this.order.dis
      const loginToken = this.appStorageService
      .getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.configService.franchiseId);
      this.meshulamService
            .createMeshulamPaymentProcess(this.order, loginToken)
              .subscribe((response) => {
                console.log("response", response);
                
                 
                  if (response.status && growPayment) {
                    console.log("response", response.data.authCode);
                    this.showLoader = true;
                    growPayment.renderPaymentOptions(response.data.authCode);
                   
                    //this.displayCustomer=false;    
                  }
               /*   if (response.status == 1) {

                    this.meshulamProcessId = response.data.processId;
                    this.meshulamProcessToken = response.data.processToken;
                    this.appStorageService.setItemInLocalStorage("meshulamProcessId", this.meshulamProcessId);
                    this.appStorageService.setItemInLocalStorage("meshulamProcessToken", this.meshulamProcessToken);
                    this.meshulamPaymentURL = response.data.url;
                    this.displayCustomer=false;                   
                   
                   // this.meshulamPaymentURL = this.meshulamPaymentURL.replace('\\','\\');
                    console.log("meshulamPaymentURL", this.meshulamPaymentURL);
                    //this.displayMeshulamIframe = true;
                    
                  }*/
                 
                 
                 
               

              }, () => {
                //  this.isLoaded.isCashPaymentLoaded = true;
                this.messageService.displayServerErrorMessage();
              
              });
    } else {
      this.clearErrorFields();
      if (this.isAllValidUserData()) {
       // console.log("payment this.isAllValid()",this.isAllValid());
  
        const loginToken = this.appStorageService
          .getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.configService.franchiseId);
        if (!loginToken) {
          console.log("NO TOKEN???");
          this.loadSignInForm();
        } else {
         // this.completeOrder();
        }
        this.displayCustomer=false;
        this.displayPaymentOptions = true;
        this.displayPayment= true; //masha
        if (!this.isMobileMode() && 
            this.cashRegister.cashRegisterType != "None" &&
            this.paymentType == PaymentTypeEnum.card){
              console.log("this.selectCreditPaymentMethod()")
 this.selectCreditPaymentMethod();
            }
           
        //else (!this.isMobileMode() && 
           //   this.cashRegister.cashRegisterType == "None") {
           //   this.paymentType = PaymentTypeEnum.cash;
 
           //   }
             
      } else {
        console.log("payment !this.isAllValid()",this.isAllValidUserData());
        this.displayCustomerErrorFields();
        if (this.deliveryGroup && this.order &&
          this.deliveryGroup.MinSumForDelivery > this.resultSumWithoutDelivery(this.order.Sum)) {
          this.displayDeliveryConditionDialog();
        }
      }
    }


    
  }


  public sanitizeMeshulamUrl() {
      return this.sanitizer.bypassSecurityTrustResourceUrl(this.meshulamPaymentURL);
  }

  public addCreditCard() {
    console.log("addCC")
    this.addCC = true;
    if ((this.cashRegister.cashRegisterType == 'Tranzila' || 
    this.cashRegister.isTranzila ) &&
    this.useTranzilaIframe) {
      this.displayTranzilaIframeUrl = true;
            setTimeout(() => this.tranzilaIframePayment(), 15000);
    }
  }

  public backToSavedCC(){
    this.addCC = false;
    if (this.timerId) clearInterval(this.timerId);
  }

  payWithPelecardIframe(){
    console.log("PelecardIframeSendOrder");
    if (this.order) {
      this.order.Payment = "prepaidCredit";
      const order = this.commonFunctionsService.deepCopy(this.order);
      if (this.isAvailableScratchCoupon()) {
        const prepareForOrderItem =
          this.prepareItemForOrder(this.scratchCoupon.CurrentItem, true, this.scratchCoupon);
        order.OrderItems.push(prepareForOrderItem);
      }
   //   this.prepareDataForOrderToPay(order);
      const loginToken = this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.franchiseId);
     ///if (this.paymentData == undefined) {
        this.paymentData = {};
     // }
      this.isLoaded.isCreditPaymentLoaded = false;
      let method = -1;
      if (this.order.IsDelivery) {
        method = 0;
      } else if (this.order.IsTakeAway) {
        method = 1;
      } else  {
        method = 2;
      }
      this.metadataService.isOpenForPickupMethod(this.order.BranchId, method)
        .subscribe((response) => {
          const isOpen = response;
          if (!isOpen && !this.order.IsFutureOrder) {
            this.isLoaded.isCreditPaymentLoaded = true;
             this.isLoaded.isBranchOpenLoaded = true;
            this.closedBranchMessage();
          } else {
            this.loadOrderUserDataToUser(this.user);
            this.signInOutService.updateUserDetails(this.user)
              .subscribe((reslt) => {                
                 this.isLoaded.isCreditPaymentLoaded = true;
                  this.isLoaded.isUpdateUserDetailsLoaded = true;
              }, () => {
              //  this.showLoader = false;
              //  this.isLoaded.isCreditPaymentLoaded = true;
               // this.messageService.displayServerErrorMessage();
              });
              //  this.paymentService.GetPelecardIframeUrlWithInvoice(this.preparePelecardOrderForServer(this.order), loginToken, this.configService.franchiseId)
             
               this.paymentService.GetPelecardIframeUrlNew(this.prepareOrderForServer(order), loginToken, this.configService.franchiseId, this.resultSum(this.order.Sum))
                .subscribe((iframeRes) => {
                  console.log("iframeRes", iframeRes);
                  if (iframeRes && iframeRes.URL && iframeRes.ConfirmationKey) {
                    this.pelecardIframeUrl =iframeRes.URL;
                    this.pelecardConfirmationKey =iframeRes.ConfirmationKey;
                    this.pelecardIframeUrlSanitized = this.sanitizer.bypassSecurityTrustResourceUrl( this.pelecardIframeUrl);
                    this.displayPelecardIframe = true;
                    setTimeout(() => this.pelecardIframePayment(this.prepareOrderForServer(order)), 15000);
                  }
                }, () => {
                  
                  //this.messageService.displayServerErrorMessage();
                
                });

          }
        }, () => {
          this.showLoader = false;
          this.isLoaded.isCreditPaymentLoaded = true;
          this.messageService.displayServerErrorMessage();
        });
    }
  }


  public selectCreditPaymentMethod(){
    console.log("selectCreditPaymentMethod ")
    console.log("this.order.pelecard_transactionId", this.order.pelecard_transactionId);
      this.paymentType = 'credit'; 
      this.clearErrorFields(); 
      this.multiPayers = false;
      this.paymentType = PaymentTypeEnum.card;
      if ((this.cashRegister.cashRegisterType == 'Pelecard' ||
        this.cashRegister.isPelecard) &&
        this.usePelecardIframe) {
        const loginToken = this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.franchiseId);
        const sum_ = this.resultSum(this.order.Sum);
        if (this.order.pelecard_transactionId != undefined &&
          this.order.pelecard_transactionId != null &&
          this.order.pelecard_transactionId !=  "")
        {
         console.log("before checkPelecardTransactionStatusAfterFallback")
          this.showLoader= true;
          this.checkPelecardTransactionStatusAfterFallback(loginToken, this.order.pelecard_transactionId, this.paymentType);  
       
       // this.pelecardIframePayment();
        }
        else {
          this.payWithPelecardIframe();
        /*  this.paymentService.GetPelecardIframeUrlWithInvoice(this.preparePelecardOrderForServer(this.order), loginToken, this.configService.franchiseId)
            .subscribe((iframeRes) => {
              console.log("iframeRes", iframeRes);
              if (iframeRes && iframeRes.URL && iframeRes.ConfirmationKey) {
                this.pelecardIframeUrl =iframeRes.URL;
                this.pelecardConfirmationKey =iframeRes.ConfirmationKey;
                this.pelecardIframeUrlSanitized = this.sanitizer.bypassSecurityTrustResourceUrl( this.pelecardIframeUrl);
                this.displayPelecardIframe = true;
                setTimeout(() => this.pelecardIframePayment(), 15000);
              }
          }, () => {
             
            //this.messageService.displayServerErrorMessage();
          
          });*/
 
        }
       

      }
      else if ((this.cashRegister.cashRegisterType == 'Tranzila' || 
           this.cashRegister.isTranzila ) &&
          this.useTranzilaIframe) {
        const loginToken = this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.franchiseId);
        const sum_ = this.resultSum(this.order.Sum);
        var tLang = 'il'
        if (this.lang == 'en') tLang = 'us';
        
        this.tranzilaIframeUrlSanitized = this.sanitizer.bypassSecurityTrustResourceUrl(
          'https://direct.tranzila.com/'+ this.cashRegister.tranzillaTerminal +
          '/iframenew.php?lang='+ tLang +'&sum=' + sum_ +
          '&trButtonColor=' + this.colors.buttonColor.substring(1) +
          '&trTextColor=000000&currency=1&cred_type=1&tranmode=AK&pdesc=' +
          this.configService.franchiseId + '&franchiseId=' +
          this.configService.franchiseId + '&userLoginToken=' + loginToken);
          console.log("this.tranzilaIframeUrlSanitized ", this.tranzilaIframeUrlSanitized )
          if ( this.order.CCTokens.length == 0 || this.addCC) {
            this.displayTranzilaIframeUrl = true;
            setTimeout(() => this.tranzilaIframePayment(), 15000);
          }
          
       }
       
    
  }

  public pelecardConfirmationKey:string;
  public displayPelecardIframe:boolean = false;
  public continueToSelectedPaymentMethod(paymentMethod){

    console.log("continueToSelectedPaymentMethod:paymentMethod ",paymentMethod);
    console.log("this.order.pelecard_transactionId", this.order.pelecard_transactionId);
    // workaround for pelecard iframe
    /*if ((this.cashRegister.cashRegisterType == 'Pelecard' ||
      this.cashRegister.isPelecard) &&
      this.usePelecardIframe && this.order.pelecard_transactionId != undefined &&
      this.order.pelecard_transactionId != null &&
      this.order.pelecard_transactionId !=  "")
    {
      const loginToken = this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.franchiseId);
        console.log("before checkPelecardTransactionStatusAfterFallback")
         
      this.showLoader= true;
      this.checkPelecardTransactionStatusAfterFallback(loginToken, this.order.pelecard_transactionId, paymentMethod);  
    
    } else {*/

      if (paymentMethod == 'credit') {
        this.paymentType = 'credit';
        this.clearErrorFields();
        this.multiPayers = false;
        this.paymentType = PaymentTypeEnum.card;
        if ((this.cashRegister.cashRegisterType == 'Pelecard' ||
          this.cashRegister.isPelecard) &&
          this.usePelecardIframe) {
          const loginToken = this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.franchiseId);
          const sum_ = this.resultSum(this.order.Sum);
          if (this.order.pelecard_transactionId != undefined &&
            this.order.pelecard_transactionId != null &&
            this.order.pelecard_transactionId !=  "")
          {
          console.log("before checkPelecardTransactionStatusAfterFallback")
        
          this.showLoader= true;
          this.checkPelecardTransactionStatusAfterFallback(loginToken, this.order.pelecard_transactionId, this.paymentType);  
       
       // this.pelecardIframePayment();
        }
        else {
          this.payWithPelecardIframe();
           /* this.paymentService
            .GetPelecardIframeUrlWithInvoice(this.preparePelecardOrderForServer(this.order), loginToken, this.configService.franchiseId)                                                       
              .subscribe((iframeRes) => {
                console.log("iframeRes", iframeRes);
                if (iframeRes && iframeRes.URL && iframeRes.ConfirmationKey) {
                  this.pelecardIframeUrl =iframeRes.URL;
                  this.pelecardConfirmationKey =iframeRes.ConfirmationKey;
                  this.pelecardIframeUrlSanitized = this.sanitizer.bypassSecurityTrustResourceUrl( this.pelecardIframeUrl);
                  this.displayPelecardIframe = true;
                  setTimeout(() => this.pelecardIframePayment(), 15000);
                }
              }, () => {
                
                //this.messageService.displayServerErrorMessage();
              
              });
    */
          }
        
  
        }
        else if ((this.cashRegister.cashRegisterType == 'Tranzila' ||
          this.cashRegister.isTranzila) &&
          this.useTranzilaIframe) {
          const loginToken = this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.franchiseId);
          const sum_ = this.resultSum(this.order.Sum);
          var tLang = 'il'
          if (this.lang == 'en') tLang = 'us';
          this.tranzilaIframeUrlSanitized = this.sanitizer.bypassSecurityTrustResourceUrl(
            'https://direct.tranzila.com/' + this.cashRegister.tranzillaTerminal +
            '/iframenew.php?lang=' + tLang + '&sum=' + sum_ +
            '&trButtonColor=' + this.colors.buttonColor.substring(1) +
            '10&trTextColor=000000&currency=1&cred_type=1&tranmode=AK&pdesc=' +
            this.configService.franchiseId + '&franchiseId=' +
            this.configService.franchiseId + '&userLoginToken=' + loginToken);
          if (this.order.CCTokens.length == 0 || this.addCC) {
            this.displayTranzilaIframeUrl = true;
            setTimeout(() => this.tranzilaIframePayment(), 15000);
          }
  
        }
      }
  
      else if(paymentMethod == 'cash'){
        this.paymentType = 'cash'; 
        this.multiPayers = false; 
        this.clearErrorFields();
        this.paymentType = PaymentTypeEnum.cash;
      }
  
      else if(paymentMethod == 'bit'){
        this.paymentType = 'bit'; 
        this.multiPayers = false; 
        this.clearErrorFields();
        this.paymentType = PaymentTypeEnum.bit;
      }
  
      else if(paymentMethod == 'cibus'){
        this.paymentType = 'sibus'; 
        this.multiPayers = false; 
        this.clearErrorFields();
        this.paymentType = PaymentTypeEnum.sibus;
      }
  
      else if(paymentMethod == 'tenbis'){
        this.paymentType = 'tenbis'; 
        this.multiPayers = false; 
        this.clearErrorFields();
        this.paymentType = PaymentTypeEnum.tenbis;
      }
  
      else if(paymentMethod == 'biteCredit'){
        this.paymentType = 'biteCredit'; 
        this.multiPayers = false; 
        this.clearErrorFields();
        this.paymentType = PaymentTypeEnum.biteCredit;
      }
  
      else if(paymentMethod == 'multi'){
        this.multiPayers = true; 
        this.clearErrorFields(); 
       // this.paymentType = '';
        this.paymentType = PaymentTypeEnum.multi;
      }
    
      console.log("continueToSelectedPaymentMethod");
      console.log("this.cashRegister", this.cashRegister);
      console.log("this.paymentType", this.paymentType);
      console.log("this.multiPayers", this.multiPayers);
      console.log("this.order", this.order);
  
      console.log("this.acceptTerms",this.acceptTerms)
  
     
        this.displayPaymentOptions = false;
        this.displaySelectedPayment = true;
    
   // }







   
     
  }

   
}
