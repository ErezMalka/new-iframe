import { AppStorageService } from '../../app.storage.service';
import { AfterViewInit, Component, ElementRef, HostListener, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import { AppConfig } from '../../app.config';
import { OrderAppModel } from '../../models/order/order-app.model';
import { TranslationsService } from '../../shared/translations/translations.service';
import { ActivatedRoute, Router } from '@angular/router';
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
import { DomSanitizer } from '@angular/platform-browser';
import { SizeMobileInitializationComponent } from '../../shared/classes/size-mobile-initialization.component';
import { BrowserIdentificatorService } from '../../core/services/common-settings/browser-identificator.service';
//import { isDefaultChangeDetectionStrategy } from '@angular/core/src/change_detection/constants';
import { AdditionalItemsComponent } from '../../components/additional-items/additional-items.component';
// tslint:disable-next-line:no-duplicate-imports
// import {default as _rollupMoment, Moment} from 'moment';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
const moment = /*_rollupMoment || */_moment;




@Component({
  templateUrl: './my-credit-cards.component.html',
  styleUrls: ['./my-credit-cards.component.scss']
})
export class MyCreditCardsComponent extends SizeMobileInitializationComponent implements OnInit, AfterViewInit, OnDestroy {

  public defaultCategoryColor = '#ffffff';
  startDate = new Date(moment().year(), moment().month())

  public OrderStaus = {
    INCOMING: this.translationsService.translate('INCOMING'),
    INPROGRESS: this.translationsService.translate('INPROGRESS'),
    READY: this.translationsService.translate('READY'),
    INDELIVERY: this.translationsService.translate('INDELIVERY'),
    DELIVERED: this.translationsService.translate('DELIVERED'),
  }
  public userCouponCode: string;
  public userCouponValid: boolean = false;
  public userCuponDiscount: number;

  public graphics = {
    logo: '',
    cover: '',
  };

  public colors = {
    menuColor: '',
    buttonColor: ''
  };

  public cashSymbol: string;
  public franchiseId: string;

  public lang: string;
  public country: string;
  public order: OrderAppModel;
  public myOrder: any;
  public myOrders: any[];
  public cities: CityModel[];
  public paymentType: string;

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
  public isCollapsed: boolean;
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

  public currentBranch: BranchAppModel;

  @ViewChild('iframe')
  public iframe: ElementRef;

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





  // For scrollbar:
  public disabled = !this.isMobileBrowser() && !this.isMobileMode();
  public shown: 'native' | 'hover' | 'always' = 'native';


  locale = 'he';

  public combos;
  public categories;
  usableOrder: OrderAppModel;

  constructor(private orderService: OrderService,
    private localeService: BsLocaleService,
    private metadataService: MetaDataService,
    private translationsService: TranslationsService,
    private menuService: MenuService,
    private roundPricePipe: RoundPricePipe,
    private paymentService: PaymentService,
    private router: Router,
    private appStorageService: AppStorageService,
    private matDialog: MatDialog,
    private scratchCouponService: ScratchCouponService,
    private commonFunctionsService: CommonFunctionsService,
    private signInOutService: SignInOutService,
    //private adapter: DateAdapter<any>,
    private configService: ConfigService,
    private messageService: MessageService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    protected browserIdentificatorService: BrowserIdentificatorService,
    private ngZone: NgZone) {
    super(browserIdentificatorService);
  }

  ngOnInit(): void {
    this.franchiseId = this.route.snapshot.paramMap.get('franchiseId');

    this.isCollapsed = true;
    this.localeService.use(this.locale);
    this.initializeOrder();
    this.checkSigning();
    //this.getOrderInfo();
    //this.getOrdersInfo();  

  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {

  }

  public checkSigning(result?) {
    console.log("checkSigning()");
    this.isSignedUser = !!result;
    this.isSignedUser = !!this.appStorageService
      .getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.configService.franchiseId);
    if (this.isSignedUser) {
      //this.checkDiscount(true);
      this.verifyToken(true);
    } else {
      this.isLoaded.isDiscountLoaded = true;
      //this.checkedUserSigning();
      //this.checkDiscount(true);
    }
  }


  public verifyToken(isFirstTime?) {

    console.log("verifyToken()")
    const token = this.appStorageService
      .getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.configService.franchiseId);
    if (token) {
      this.isLoaded.isValidationUserLoaded = false;
      this.signInOutService.verifyToken(token).subscribe((response) => {
        if (response && response.ccTokens && response.ccTokens.length > 0) {
          if(AppConfig.configSettings.cancelPhoneVerification){
            this.usableOrder.CCTokens = null;
          }
          else
          this.usableOrder.CCTokens = response.ccTokens;
        }
        const result = response ? !!response.user : !!response;
        const resultAction = () => {
          if (result) {
            //console.log("response",response);
            //this.loadUserDataToOrder(response.user, false);
            // this.loadDiscountAndScratchCoupons();
          } else {
            this.signInOutService.signOut();
            //this.checkedUserSigning(result);
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


  getExpDateStr(expDateStr:string): string {
    let month = expDateStr.substring(0,2);
    let year = expDateStr.substring(2,4);
    return month + "/" + year;
  }

  public getLanguage() {
    return this.translationsService.language();
  }

  /*getOrderInfo() {
    const orderID = this.appStorageService.getItemFromLocalStorage("OrderId");
    this.orderService.GetOrderInfo(orderID)
      .subscribe((result) => {
        if (result) {
          this.myOrder = result;
          this.displayPizzaLogic();
          //console.log("getOrderInfo result",result);
          this.order.OrderItems.forEach(item => {
            //console.log("order item", item);

          });
        }
      }, (error) => {
        //console.log("getOrderInfo Error", error)
        // this.isLoaded.isFranchiseWithBranchesLoaded = true;
        this.messageService.displayServerErrorMessage();
      });
  }*/

  public allItemsArr = [];
  public allCombosArr = [];

  /*public signOut() {
    console.log("signOUT()", this.isSignedUser);
    this.signInOutService.signOut();
    this.isSignedUser = false;
  }

  public loadSignInAndCoupons() {
    this.loadSignInFormM((result) => {
      console.log("result-load", result);
      if (result.isSignedIn)
        this.verifyToken();

    });
  }

  */



  getOrdersInfo() {
    /*this.combos = this.appStorageService.combos || [];
    this.categories = this.appStorageService.categories || [];
    this.categories.forEach(category => {
      category.Items.forEach(item => {
        this.allItemsArr.push(item);
      });
    });
    console.log("this.combos",this.combos);
    console.log("this.allItemsArr",this.allItemsArr);*/
    const token = this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.franchiseId);
    if (token) {
      this.orderService.GetPreviouseOrders(token)
        .subscribe((result) => {
          if (result) {
            this.myOrders = result;
            //console.log("getOrderInfo result",result);
            //this.displayPizzaLogicForOrders();

            this.myOrders.forEach(order => {
              order.OrderItems.forEach(item => {
                //var foundItem = this.allItemsArr.find(({ Name }) => Name === item.Name);
                //console.log("foundItem",foundItem);
                /*this.combos.forEach(combo => {
                  let comment = item.Comment;
                  if(comment){
                  var itemNewComment = comment.replace("מבצע - ", "");
                  console.log("itemNewComment",itemNewComment);
                  var foundCombo = this.combos.find(({ Name }) => Name === itemNewComment);
                  console.log("foundCombo",foundCombo);
                  }
                });*/
                /*if(foundItem && foundItem.Price != undefined){
                item.Price = foundItem.Price;
                }*/
              });

            });
          }
        }, (error) => {
          this.messageService.displayServerErrorMessage();
        });
    }

  }

  
  public getColor() { return this.colors.menuColor != 'white' ? 'white' : 'black'; }

  private initializeOrder() {
    this.order = this.orderService.getOrder();
    this.usableOrder = this.orderService.getOrder();
    if (this.appStorageService.branch) {
      this.currentBranch = this.appStorageService.branch;
    }
  }

  removeCard(id){
    this.signInOutService.deleteCCToken(id).subscribe((response) => {
if (response) {
  this.usableOrder.CCTokens.forEach(savedcc => {
    if(savedcc.Id == id){
      this.order.CCTokens.splice(this.order.CCTokens.indexOf(savedcc), 1);
    }
    
  });
}
      
      //this.usableOrder.CCTokens
      }, (error) => {

      this.messageService.displayServerErrorMessage();
    });
  }


}
