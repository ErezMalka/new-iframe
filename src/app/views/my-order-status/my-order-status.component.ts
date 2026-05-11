import { AppStorageService } from '../../app.storage.service';
import {AfterViewInit, Component, ElementRef, HostListener, NgZone, OnDestroy, ViewChild} from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import { AppConfig } from '../../app.config';
import { OrderAppModel } from '../../models/order/order-app.model';
import { TranslationsService } from '../../shared/translations/translations.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
//import { MomentDateAdapter} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats } from '@angular/material/core';
//import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDatepicker } from '@angular/material/datepicker';
import { PaymentTypeEnum } from '../../enums/payment-type.enum';
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
import { RoundPricePipe } from '../../shared/pipes/round-price.pipe';
import { OrderPizzaAppAdvancedModel } from '../../models/advanced/order/order-pizza-app-advanced.model';
import { OrderItemAppModel } from '../../models/order/order-item-app.model';
import { PaymentService } from '../../shared/services/payment.service';
import { MessagePopupComponent } from '../../shared/components/message-popup/message-popup.component';
import {MatDialog, MatDialogConfig } from '@angular/material/dialog';
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
import { DomSanitizer } from '@angular/platform-browser';
 import {SizeMobileInitializationComponent} from '../../shared/classes/size-mobile-initialization.component';
import {BrowserIdentificatorService} from '../../core/services/common-settings/browser-identificator.service';
//import { isDefaultChangeDetectionStrategy } from '@angular/core/src/change_detection/constants';
 // tslint:disable-next-line:no-duplicate-imports
// import {default as _rollupMoment, Moment} from 'moment';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { listLocales } from 'ngx-bootstrap/chronos';
const moment = /*_rollupMoment || */_moment;

 

@Component({
  templateUrl: './my-order-status.component.html',
  styleUrls: ['./my-order-status.component.scss'] 
})
export class MyOrderStatusComponent extends SizeMobileInitializationComponent implements OnInit, AfterViewInit, OnDestroy {

  public defaultCategoryColor = '#ffffff';
  startDate = new Date(moment().year(),moment().month())

  public OrderStaus = {
    INCOMING: this.translationsService.translate('INCOMING'),
    INPROGRESS:this.translationsService.translate('INPROGRESS'),
    READY: this.translationsService.translate('READY'),
    INDELIVERY: this.translationsService.translate('INDELIVERY'),
    DELIVERED: this.translationsService.translate('DELIVERED'),
  }
  public userCouponCode:string;
  public userCouponValid:boolean=false;
  public userCuponDiscount:number;

  public graphics = {
    logo: '',
    cover: '',
  };

  public colors = {
    menuColor: '',
    buttonColor: ''
  };

  public cashSymbol: string;

  public lang: string;
  public country: string;
  public order: OrderAppModel;
  public myOrder: any;
  public cities: CityModel[];
  public paymentType: string;
  public orderId:number;
  public branch: BranchAppModel;
  public user: any;
  public discount: DiscountModel;
  public isSignedUser: boolean = false;
  public openAdditionalItemsModalFlag: boolean;
  public isOrderOption: boolean = true;

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
    CreditCard: false
  };

  public minDate: Date;
  public maxDate: Date;
  public minDateStr: string;
  public maxDateStr: string;

  public cashRegister: any;
  public cashRegisterCreditCard = {
    ownerId: '',
    number: '',
    cvv: '',
    expirationYear: '',
    expirationMonth: ''
  };

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

  
   

   

  // For scrollbar:
  public disabled = !this.isMobileBrowser() && !this.isMobileMode();
  public shown: 'native' | 'hover' | 'always' = 'native';

  public currentBranch: BranchAppModel;
  locale = 'he';
  franchiseId: string;
  isActiveOrder: boolean = false;
  constructor(private orderService: OrderService,
              private localeService: BsLocaleService,
              private metadataService: MetaDataService,
              private translationsService: TranslationsService,
              private menuService: MenuService,
              private roundPricePipe: RoundPricePipe,
              private paymentService: PaymentService,
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
              private ngZone: NgZone) {
    super(browserIdentificatorService);
  }

  ngOnInit(): void {
    this.localeService.use(this.locale);
    this.franchiseId = this.route.snapshot.paramMap.get('franchiseId');
    this.route.params.subscribe(params => {
      //this.idParam= params[`id`];
      if (params  && params["orderId"]) {
        this.orderId = params["orderId"];
        this.getOrderInfo();
        if(this.isActiveOrder){
        setInterval(()=> {this.getOrderInfo()}, 120000);
        }
      } else {
        console.log("my order status: missing orderId");
      }

    });
    
    
  }

  getOrderInfo() {
     const orderID = this.appStorageService.getItemFromLocalStorage("OrderId");
    this.orderService.GetOrderInfo( orderID)//this.orderId)
      .subscribe((result) => {
        if (result) {
          this.myOrder = result;
          this.isActiveOrder = true;
        }


      }, (error) => {
        // this.isLoaded.isFranchiseWithBranchesLoaded = true;
        this.messageService.displayNoActiveOrderMessage((result) => {
          if (!result.isDigitalMenu) {
            this.router.navigateByUrl(`/${this.franchiseId}/menu`);
          }

        });
        //this.messageService.displayNoActiveOrderMessage();
      });
  }

  ngOnDestroy() {

  }

  private scrollItems = (event: any): void => {
    const number = event.srcElement.scrollTop;
  }

  public restrictKeysExceptDigitsAndPlus(event, dontIncludePlus) {
    this.commonFunctionsService.restrictKeysExceptDigitsAndPlus(event, !!dontIncludePlus);
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

  public completeSignIn() {
    this.isSignedUser = true;
    
  }

  private legalTz(num) {
    let tot = 0;
    let tz = new String(num);
    for (let i = 0; i < 8; i++) {
      let x = (((i % 2) + 1) * +tz.charAt(i));
      if (x > 9) {
        let x1 = x.toString();
        x = parseInt(x1.charAt(0)) + parseInt(x1.charAt(1));
      }
      tot += x;
    }
    if ((tot + parseInt(tz.charAt(8))) % 10 == 0) {
      this.errorsCashRegister.ownerId.notValidId = false;
      return true;
    } else {
      this.errorsCashRegister.ownerId.notValidId = true;
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
    const cvvStr = value.split('');
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

  

  public checkSigning(result?) {
    this.isSignedUser = !!result;
    this.isSignedUser = !!this.appStorageService
      .getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.configService.franchiseId);
    if (this.isSignedUser) {
      this.verifyToken(true);
    } else {
      this.isLoaded.isDiscountLoaded = true;
      this.checkedUserSigning();
      this.checkDiscount(true);
    }
  }

  public checkedUserSigning(isSignedUser?) {
    this.isSignedUser = !!isSignedUser;
    
  }

  private checkPaymentOptions() {
    console.log("------checkPaymentOptions:");
    this.isLoaded.isPaymentSettingsLoaded = false;
   /*
    this.paymentService.getPaymentOptions().subscribe((result) => {*/
   const result = this.appStorageService.paymentOptions;
      if (result) {
        this.paymentSettings.Cash = result.Cash;
        if (this.paymentSettings.Cash) {
          this.paymentType = PaymentTypeEnum.cash;
        }
        this.paymentSettings.CreditCard = result.CreditCard;
        //if (!this.paymentSettings.Cash && this.paymentSettings.CreditCard) {
         // this.paymentType = PaymentTypeEnum.card;
       // }
        if (this.paymentSettings.CreditCard) {
          this.paymentType = PaymentTypeEnum.card;
        }
      }
      this.isLoaded.isPaymentSettingsLoaded = true;
   /* }, () => {
      this.isLoaded.isPaymentSettingsLoaded = true;
      this.messageService.displayServerErrorMessage();
    });*/
  }

  

  private checkDiscount(isNotSigned?) {
    if (this.user) {
      this.isLoaded.isDiscountLoaded = false;
      this.menuService.getDiscount(this.order.BranchId,this.user && this.user.Id ? this.user.Id : undefined).subscribe((result) => {
        if (result) {
          this.discount = result;
        }
        this.isLoaded.isDiscountLoaded = true;
      }, (error) => {
        this.isLoaded.isDiscountLoaded = true;
        // this.messageService.displayServerErrorMessage();
      });
    } else if (isNotSigned) { // for not signed users
      this.menuService.getDiscount(this.order.BranchId,undefined).subscribe((result) => {
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
    if (/*this.isSignedUser && */this.order) {
      this.order.IsDiscount = this.discount &&
        this.order.Sum >= this.discount.minSum && (this.discount.active || this.discount.alwaysActive);
      return this.order.IsDiscount;
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
        return this.trimField(this.order.FirstName) && this.trimField(this.order.LastName)
          && this.trimField(this.cashRegisterCreditCard.number) &&
          this.trimField(this.cashRegisterCreditCard.cvv) &&
          (this.country !== CountryEnum.US ? this.trimField(this.cashRegisterCreditCard.ownerId) : true)
          && this.trimField(this.cashRegisterCreditCard.expirationMonth) &&
          this.trimField(this.cashRegisterCreditCard.expirationYear);
      } else {
        return false;
      }
    } else if (this.order && this.order.IsDelivery) {
      if (this.paymentType === PaymentTypeEnum.cash) {
        return this.trimField(this.order.FirstName) && this.trimField(this.order.LastName) &&
          this.trimField(this.order.UserCity) && this.trimField(this.order.Street) && this.order.StreetNum;
      } else if (this.paymentType === PaymentTypeEnum.card) {
        return  this.trimField(this.order.FirstName) && this.trimField(this.order.LastName) &&
          this.trimField(this.order.UserCity) && this.trimField(this.order.Street) && this.order.StreetNum &&
          this.trimField(this.cashRegisterCreditCard.number) &&
          this.trimField(this.cashRegisterCreditCard.cvv) &&
          (this.country !== CountryEnum.US ? this.trimField(this.cashRegisterCreditCard.ownerId) : true) &&
          this.trimField(this.cashRegisterCreditCard.expirationMonth) && this.trimField(this.cashRegisterCreditCard.expirationYear);
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  public isValidCountOfOrders() {
    return this.order && ((this.order.OrderItems &&
      this.order.OrderItems.length > 0) || (this.order.OrderPizzas &&
      this.order.OrderPizzas.length > 0) || (this.order.OrderCombos &&
      this.order.OrderCombos.length > 0));
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
    return garnishesWithMultipleSizes ; //garnishes + garnishesOfGarnishGroup;
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
    return garnishesWithMultipleSizes ; //garnishes + garnishesOfGarnishGroup;
  }




  public priceWithDiscount(price) {
    if (price && this.discount && this.checkAvailabilityDiscount()) {
      if ((this.discount.active  || this.discount.alwaysActive) && +price >= +this.discount.minSum) {
        if (this.discount.type === DiscountTypeEnum.Percent) {
          return this.roundPricePipe.transform(+price * ((100 - +this.discount.sum) / 100), 2);
        } else {
          return this.roundPricePipe.transform(+price - +this.discount.sum, 2);
        }
      } else {
        return this.roundPricePipe.transform(+price, 2);
      }
    } else {
      if (this.userCouponValid && this.userCuponDiscount > 0) {
        return this.roundPricePipe.transform(+price * ((100 - +this.userCuponDiscount) / 100), 2);
      } else {
        return this.roundPricePipe.transform(+price, 2);
      }
     
    }
    return 0;
  }

  public resultDiscountSum() {
    if (this.order) {
      return this.order.Sum - this.priceWithDiscount(this.order.Sum);
    } else {
      return 0;
    }
  }

  public resultDeliverySum(price,  deliveryGroup) {
    let numericTotalPrice = parseFloat(price);
    if (!deliveryGroup) {
      return numericTotalPrice;
    }
    if (deliveryGroup &&
      deliveryGroup.DeliveryFee && parseFloat(deliveryGroup.DeliveryFee) == deliveryGroup.DeliveryFee &&
      numericTotalPrice && (numericTotalPrice >= deliveryGroup.MinSumForDelivery) && 
      (price < deliveryGroup.MinSumForFreeDelivery || !deliveryGroup.MinSumForFreeDelivery)) {
        console.log("add delivery fee");
      return this.roundPricePipe.transform((numericTotalPrice + deliveryGroup.DeliveryFee),2);
    } else {
      console.log("free delivery");
      return numericTotalPrice;
    }
  }

  public displayDeliveryFeePrice(deliveryGroup: DeliveryGroupAppModel) {
    if (deliveryGroup && this.order) {
      return deliveryGroup.MinSumForFreeDelivery > this.resultSumWithoutDelivery(this.order.Sum)? deliveryGroup.DeliveryFee : 0 ;
    }
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
    if (this.branch && this.branch.UsaTaxProc) {
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
    }
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

  
  private initializeGraphics() {
    this.graphics.logo = AppConfig.settings.logo;
    this.graphics.cover = AppConfig.settings.cover;
    this.colors.menuColor = AppConfig.settings.menuColor;
    this.colors.buttonColor = AppConfig.settings.buttonColor;
    this.lang = this.translationsService.language();
    this.country = this.configService.country;
    this.cashSymbol = AppConfig.cashSymbol;
    //this.adapter.setLocale(this.lang);
  }

  public getColor(){return this.colors.menuColor !='white' ? 'white' : 'black';}

  private initializeOrder() {
    this.order = this.orderService.getOrder();
    if (this.appStorageService.branch) {
      this.currentBranch = this.appStorageService.branch;
    }
  }

  public isOpenedBranchToday() {
    return this.branch;// && this.branch.IsOpen;
  }

   
  
 

  private loadUserDataToOrder(user, withAddress) {
    if (user) {
      this.user = user;
      this.order.Code = user.CompanyCode || '';
      this.order.FirstName = user.FirstName || '';
      this.order.LastName = user.LastName || '';
      this.order.Phone = user.Phone || '';
      this.order.ExtraPhone = user.ExtraPhone || '';
      if (withAddress) {
        this.order.UserCity = user.UserCity; // this.checkUserCityInListOfCities(user.UserCity);
        this.order.Street = user.Street || '';
        this.order.Floor = user.Floor || '';
        this.order.ApartmentNum = user.ApartmentNum || '';
        this.order.StreetNum = user.StreetNum || '';
      }
    }
  }

  private loadOrderUserDataToUser(user) {
    if (user) {
      user.FirstName = this.order.FirstName || '';
      user.LastName = this.order.LastName || '';
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
 
 
   

  

  private displayPopupMessage(data) {
    const matDialogRef = this.matDialog.open(MessagePopupComponent, {
      data,
      width: '50%',
      maxWidth: '1200px',
      disableClose: true,
      panelClass: 'custom-mat-dialog'
    });
    matDialogRef.afterClosed().subscribe((result) => {

    });
  }

  

  

  public verifyToken(isFirstTime?) {
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
            }
            this.loadUserDataToOrder(response.user, false);
           // this.loadDiscountAndScratchCoupons();
          } else {
            this.signInOutService.signOut();
            this.checkedUserSigning(result);
          }
        }
        this.isLoaded.isValidationUserLoaded = true;
       // this.checkBranch(resultAction);
      }, (error) => {
         
        this.messageService.displayServerErrorMessage();
      });
    } else {
      this.isLoaded.isDiscountLoaded = true;
      this.signInOutService.signOut();
      this.isSignedUser = false;
     // this.checkBranch();
    }
  }

  

  public directionLanguage() {
    return LanguageEnum.HE;
  }

  public isAllValidDataToContinue() {
    return this.isValidCountOfOrders() && this.isOpenedBranchToday();
  }

  


}
