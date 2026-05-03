import { AppStorageService } from '../../app.storage.service';
import {AfterViewInit, Component, ElementRef, HostListener, NgZone, OnDestroy, ViewChild} from '@angular/core';
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
import { AdditionalItemsComponent } from '../../components/additional-items/additional-items.component';
// tslint:disable-next-line:no-duplicate-imports
// import {default as _rollupMoment, Moment} from 'moment';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ItemWithGarnishesComponent } from '../menu/item-with-garnishes/item-with-garnishes.component';
import { GarnishAppModel } from '../../models/menu/garnish-app.model';
import { GarnishGroupAppModel } from '../../models/menu/garnish-group-app.model';
import { GarnishesComponent } from '../menu/garnishes/garnishes.component';
import { ItemComponent } from '../menu/item/item.component';

import { take } from 'rxjs/operators';
import { DeviceDetectorService } from 'ngx-device-detector';
import { BiteCreditComponent } from '../../shared/components/bite-credit/bite-credit.component';


 const moment = /*_rollupMoment || */_moment;

 class GarnishesDialog {
  public selectedGarnishes: GarnishAppAdvancedModel[];
  public comments: string;
  public isSaved: boolean;
  public freeCount: number;
  public allGettingGarnishes: GarnishAppAdvancedModel[];
  public isGarnishGroup: boolean;
  public returnToPreviousPage: boolean;
  public itemPriceWithGarnishes: number;
  public selectedGarnishesPrice : number;
}

 


@Component({
  templateUrl: './my-credit.component.html',
  styleUrls: ['./my-credit.component.scss'] 
})
export class MyCreditComponent extends SizeMobileInitializationComponent implements OnInit, AfterViewInit, OnDestroy {

  public defaultCategoryColor = '#ffffff';
  startDate = new Date(moment().year(),moment().month())

  public OrderStaus = {
    INCOMING: this.translationsService.translate('INCOMING'),
    INPROGRESS:this.translationsService.translate('INPROGRESS'),
    READY: this.translationsService.translate('READY'),
    INDELIVERY: this.translationsService.translate('INDELIVERY'),
    DELIVERED: this.translationsService.translate('DELIVERED'),
  }

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

  public displayMyInfo: boolean = false;
  
  public entryMemberScreen: boolean = true;

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

  public displayMyBenefits: boolean = false;

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
    expirationMonth: { },
    expirationYear: { }
  };

   

   

  // For scrollbar:
  public disabled = !this.isMobileBrowser() && !this.isMobileMode();
  public shown: 'native' | 'hover' | 'always' = 'native';

  
  locale = 'he';
   
  public combos;
  public categories;
  public addresses: any;
  appUser: any;
  clubMemberCategories: any;

  bsModalRef: BsModalRef;
  displayContinueButton: boolean = false;
  currentUserPoints: number;
  currentDate: Date;
  description: string;

  public inLinks = this.appStorageService.inLinks;
  displayPersonalInfo: boolean = true;
  displayPointsHistory: boolean = false;
  ordersWithPoints: any;
  orderSum: any;


  
  constructor(private orderService: OrderService,
    private modalService: BsModalService,
    private deviceService: DeviceDetectorService,
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
    if(this.appStorageService.appUser && this.appStorageService.appUser != undefined) 
    this.appUser = this.appStorageService.appUser;
    console.log("this.appUser",this.appUser);
    this.currentUserPoints = this.appUser.MemberPoints;
    this.clubMemberCategories = this.appStorageService.clubMembershipCategories;
    
    console.log("this.clubMemberCategories",this.clubMemberCategories);

    this.currentDate = new Date();
  }

  ngOnInit(): void {
    this.franchiseId = this.route.snapshot.paramMap.get('franchiseId');

    this.isCollapsed = true;
    this.localeService.use(this.locale);
    this.initializeOrder();
    this.checkSigning();
    this.getOrdersInfo();
    //this.getOrderInfo();
    //this.getOrdersInfo(); 
    this.getPointsLog();



    



    if(this.appStorageService.franchiseDiscount != null)
    this.discount = this.appStorageService.franchiseDiscount;

    this.description = this.appStorageService.franchise.Description;

    console.log("this.currentBranch",this.currentBranch);

    console.log("this.appStorageService.clubMembershipCategories",this.appStorageService.clubMembershipCategories);

    this.appStorageService.clubMembershipCategories.sort((a,b) => b.Name.localeCompare(a.Name));

    /*this.clubMemberCategories.forEach(cat => {
      cat.Items.forEach(it => {
          it.MySelected = false;
      });
    });*/

    //this.displayPersonalInfo = true;
  }

  public getPointsLog(){

    this.signInOutService.GetUserMemberPointsLog(this.appUser.Id).subscribe((response) => {
      if(response){
        console.log("response",response);
        this.ordersWithPoints = response;
        this.ordersWithPoints.forEach(order => {
          order.isCollapsed = true;
        });
      }
    }, (error) => { 
      this.messageService.displayServerErrorMessage();
    });

  }

  public getOrderSum(order){
    //console.log("getOrderSum: order", order);
    order.isCollapsed = !order.isCollapsed;

    this.orderService.GetOrderInfo(order.OrderId)
    .subscribe((result) => {
      if (result) {
        const fullOrder=result;

        console.log("getOrderInfo fullOrder",fullOrder);
        this.orderSum = fullOrder.Sum - fullOrder.DiscountSum;
      }
    },(error) => {
      console.log("getOrderInfo Error", error)

    });
    console.log("order",order);
    /*if (this.myOrders && this.myOrders.length > 0) {
      const myorder = this.myOrders.filter((fullOrder) => {
        return fullOrder.Id == order.OrderId;
      });
      if (myorder) {
        console.log("myorder[[0]", myorder[0]);
        this.orderSum = myorder[0].Sum - myorder[0].DiscountSum;
      }
    }*/
  }

  public getPointsOperation(order){
    //console.log("getPointsOperation: order", order);
    if(order.Logger == "Order"){
      return this.translationsService.translate('MY_ORDERS_ORDER');
    }
    else if(order.Logger == "Refund"){
      return this.translationsService.translate('MY_ORDERS_CREDIT');
    }
    else if(order.Logger == "Manager"){
      return this.translationsService.translate('MY_ORDERS_MANAGER');
    }

  }


  getOrdersInfo() {

    const token = this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.franchiseId);
    if (token) {
      this.orderService.GetPreviouseOrders(token)
      .subscribe((result) => {
        if (result) {
          this.myOrders=result;
          console.log("this.myOrders",this.myOrders);
          //console.log("getOrderInfo result",result);
          //this.displayPizzaLogicForOrders();

          this.myOrders.forEach(order => {
            order.isCollapsed = true;
            order.OrderItems.forEach(item => {
              console.log("item",item);
            });
            
          });
        }
      },(error) => {
        console.log("getOrderInfo Error", error)
        this.messageService.displayServerErrorMessage();
      });
    }
   
  }

  public displayHistory(){

    this.displayPersonalInfo = false;
    this.displayPointsHistory = true;

    console.log("displayPersonalInfo", this.displayPersonalInfo);
    console.log("displayPointsHistory", this.displayPointsHistory);
  }


  public displayInfo(){

    this.displayPersonalInfo = true;
    this.displayPointsHistory = false;

    console.log("displayPersonalInfo22", this.displayPersonalInfo);
    console.log("displayPointsHistory22", this.displayPointsHistory);

  }

  public cancelMembership(){
    const token = this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.franchiseId);
    
        console.log("cancelMembership :franchise", this.appStorageService.franchise);
        console.log("cancelMembership :showClubMember", this.appStorageService.showClubMember);
        console.log("this.user", this.appStorageService.appUser);

        if (this.appStorageService.appUser && this.appStorageService.appUser) {
          console.log("if (this.user && this.user.IsClubMember): user", this.appStorageService.appUser);
          this.appStorageService.appUser.IsClubMember = false;
          this.appStorageService.appUser.MemberPoints = 0;
          this.appStorageService.appUser.CanceledMembership = true;
          //this.appStorageService.appUser.Anniversary = null;
          //this.appStorageService.appUser.AnniversaryStr = null;
          //this.appStorageService.appUser.BirthDate = null;
          //this.appStorageService.appUser.BirthDateStr = null;

          this.router.navigateByUrl(`/${this.franchiseId}/menu`);
    
          this.appStorageService.showClubMember = false;
    
          this.signInOutService.updateUserDetails(this.appStorageService.appUser).subscribe((reslt) => {
            console.log("result - update user", reslt);
            if(reslt){
              this.appStorageService.loadSuccessCancelMembershipMessage = true;
              this.loadSuccessCancelMembershipMessage();
            }
          }, (error) => {
            console.log("error update user");
    
          });
        }
  }

  public doSomething() {
    console.log("this.inLinks", this.inLinks);
    this.appStorageService.inLinks = true;
    this.inLinks = true;
    console.log("this.inLinks", this.inLinks);
    document.getElementById("mySidebar").style.display = "none";
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('sidebar-show');
  }

  openNav() {
    document.getElementById("mySidebar").style.width = "350px";
    document.getElementById("mySidebar").style.display = "flex";
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('sidebar-show');
  }

  public checkCategoryAvailabilityByDate(category) {
    console.log("checkCategoryAvailabilityByDate(): category", category);


    if (category.Name == 'CM_SHOP') {
      return true;
    }

    if (category.Name == 'CM_BIRTHDAY') {
      console.log("category", category);

      var birthStrToDate;
      var availableMonth;

      if(this.appUser.BirthDateStr != null){
        birthStrToDate = new Date(this.appUser.BirthDateStr);
        console.log("birthStrToDate", birthStrToDate);
      }
      if(this.dateIsValid(this.appUser.BirthDate)){
       availableMonth = this.appUser.BirthDate?.getMonth();
      }
      else if(this.appUser.BirthDateStr != null){
      availableMonth =  birthStrToDate?.getMonth();
      }
      console.log("availableMonth", availableMonth);
      const currentMonth = this.currentDate.getMonth();
      console.log("currentMonth", currentMonth);
      if (availableMonth == currentMonth && !this.appUser.UsedBirthdayVoucher) return true;
      else false;
    }
    if (category.Name == 'CM_ANNIVERSARY') {
      console.log("category", category);
      
      var annStrToDate;
      var availableMonth;

      if(this.appUser.AnniversaryStr != null){
        annStrToDate = new Date(this.appUser.AnniversaryStr);
        console.log("annStrToDate", annStrToDate);
      }
      if(this.dateIsValid(this.appUser.Anniversary)){
        availableMonth = this.appUser.Anniversary?.getMonth();
       }
       else if(this.appUser.AnniversaryStr != null){
       availableMonth =  annStrToDate?.getMonth();
       }

      console.log("availableMonth", availableMonth);
      const currentMonth = this.currentDate.getMonth();
      console.log("currentMonth", currentMonth);
      if (availableMonth == currentMonth && !this.appUser.UsedAnniversaryVoucher) return true;
      else false;
    }

    if (category.Name == 'CM_JOIN') {
      console.log("category", category);
      
      var joinStrToDate;
      var joinTimeStart;

      if(this.appUser.JoinedToClubStr != null){
        joinStrToDate = new Date(this.appUser.JoinedToClubStr);
        console.log("joinStrToDate", joinStrToDate);
      }

      if(this.dateIsValid(this.appUser.JoinedToClub)){
        joinTimeStart = this.appUser.JoinedToClub;
       }
       else if(this.appUser.JoinedToClubStr != null){
        joinTimeStart =  joinStrToDate;
       }

      console.log("joinTimeStart", joinTimeStart);
      const dateDiffJoin =  this.calculateDiff(joinTimeStart);
      console.log("Date Difference = ", this.calculateDiff(joinTimeStart));
      if((dateDiffJoin && dateDiffJoin < 31 || dateDiffJoin == 0) && !this.appUser.UsedJoinVoucher) return true;
      else false;


    }
  }

  calculateDiff(dateSent) {
    let currentDate = new Date();
    //dateSent = new Date(dateSent);

    return Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate())) / (1000 * 60 * 60 * 24));
  }

  public goBackToMenu(){
    console.log("goBackToMenu(): this.franchiseId", this.franchiseId);
    this.router.navigate([`${this.franchiseId}/menu`]);
  }


  public calcMemberPoints(){
    var memberPoints = this.appUser.MemberPoints || 0;
    console.log("memberPoints",memberPoints);

     const itemsFromCmShop = this.order.OrderItems.filter((item) => {
      return item.IsClubMemberItem;
    });

    var itemsFromShopPrice = 0;

    console.log("itemsFromCmShop",itemsFromCmShop);

    itemsFromCmShop.forEach(item => {

      itemsFromShopPrice += item.Price;

      
    });

    console.log("itemsFromShopPrice",itemsFromShopPrice);
    this.appStorageService.itemsFromShopPrice = itemsFromShopPrice;

    this.currentUserPoints = memberPoints-itemsFromShopPrice;
    this.appStorageService.currentUserPoints = memberPoints-itemsFromShopPrice;

    return memberPoints-itemsFromShopPrice


  }

  public makeOrder() {
    console.log("makeOrder", this.order);
    if (this.order && ((this.order.OrderItems && this.order.OrderItems.length > 0)
      || (this.order.OrderPizzas && this.order.OrderPizzas.length > 0) ||
      (this.order.OrderCombos && this.order.OrderCombos.length > 0))) {
      this.router.navigateByUrl(`/${this.franchiseId}/menu`);
    }
  }

  public isEnoughPoints(item){

    //console.log("isEnoughPoints(): item",item);
    if(item.IsJoinBenefitItem || item.IsAnnBenefitItem || item.IsBDayBenefitItem){
      return true;
    }
    if(this.appStorageService.appUser.MemberPoints >= item.Price){
      //console.log("can use - user have more points than item price");
      return true;
    }else{
     // console.log("can not use");
      return false;
    }


  }

  isMobileMode(): boolean {
    return this.deviceService.isMobile() || this.deviceService.isTablet();
  }

  public addToCart(item, isNotPizza, isCombo, event?, callback?, comment?) { //combo,false,true,event
    this.selectItem(item);
    console.log("AddToCart() -  item", item);
    if (isNotPizza && this.isEnoughPoints(item)) {
      console.log("isNotPizza",isNotPizza);
      // Loading Garnishes if item has them:
      if (!this.isMobileMode()) 
       {
         if((item && !item.PizzaPrices) || 
         item && ((item.Garnishes && item.Garnishes.length > 0) ||
          (item.GarnishGroups && item.GarnishGroups.length > 0) || 
          (item.GeneralGarnishGroups && item.GeneralGarnishGroups.length > 0)) ){
        console.log("this.loadItemPopupDesktop(item);");
        console.log("comments", comment);
        this.loadItemPopupDesktop(item, comment);}
       } else {
         console.log("addToCart: this is mobile mode");
         if (item && ((item.Garnishes && item.Garnishes.length > 0) ||
          (item.GarnishGroups && item.GarnishGroups.length > 0) || 
          (item.GeneralGarnishGroups && item.GeneralGarnishGroups.length > 0)) ) {
          console.log("this.includeGarnishes(item);");
          this.includeGarnishes(item, callback);
         } else {
           console.log("loadItemPopup(no garnishes)");
        //if (AppConfig.configSettings.popupItem) {
        this.loadItemPopup(item);
      }
      }
     
    } 
    

  }

  public selectItem(item){
    console.log("selectItem(): item", item);
    item.MySelected = true;
    this.clubMemberCategories.forEach(cat => {
      cat.Items.forEach(it => {
        if(item.Id != it.Id){
          it.MySelected = false;
        }
      });
    });

    this.order.OrderItems = this.order.OrderItems.filter((item) => {
      return !item.IsClubMemberItem;
    });

  }

  getOrderInfo(order) {
    console.log("getOrderInfo: order", order);
    //const orderID = this.appStorageService.getItemFromLocalStorage("OrderId");
    this.orderService.GetOrderInfo(order.OrderId)
    .subscribe((result) => {
      if (result) {
        const fullOrder = result;
        return fullOrder.Sum

      }
    },(error) => {
      console.log("getOrderInfo Error", error);
      
     // this.isLoaded.isFranchiseWithBranchesLoaded = true;
      //this.messageService.displayServerErrorMessage();
    });
  }

  private loadItemPopup(item) {
    const initialState = {
      item: item,
      isCmItem: true
    };
    this.bsModalRef = this.modalService.show(ItemComponent,
      { initialState, class: '' });
    this.modalService.onHide
      .pipe(take(1)).subscribe(() => {

        console.log("menu close modal item", this.bsModalRef.content)
        if (this.bsModalRef.content.isSaved && this.bsModalRef.content.item) {
          const orderItem = this.prepareItemForOrder(this.bsModalRef.content.item);
          orderItem.Amount = 1;
          orderItem.IsClubMemberItem = true;
          this.displayContinueButton = true;

          orderItem.SpecialRequests = this.bsModalRef.content.comments;
          const index = this.getIndexIfNotHavingGarnishes(this.bsModalRef.content.item);

          if (index >= 0) {

            const item = this.order.OrderItems[index];

            item.Amount += orderItem.Amount;

          } else {

            this.order.OrderItems.push(orderItem);
            //this.checkOrderResultHeight();

          }
          //this.isPointsToUse();
          this.orderService.recalculateSum();
          this.resetItem(item);
          this.loadSuccessAddingToCartMessage();
        }
      });
  }



  
  public includeGarnishes(item: ItemAppAdvancedModel, callback?) {
    if (item) {
      if ((item.GarnishGroups && item.GarnishGroups.length) > 0 || (item.GeneralGarnishGroups && item.GeneralGarnishGroups.length > 0) ) {
        if(item.GarnishGroups){
        var garnishGrp = item.GarnishGroups[0];
        console.log("garnishGrp",garnishGrp);
        }
        else {
          console.log("NO GARNISHGROUPS - Its Pizza");
          garnishGrp = item.GeneralGarnishGroups[0];
          console.log("garnishGrp",garnishGrp);
        } 
        this.loadingGarnishesPopup(item, null, garnishGrp, '', item.SelectedGarnishes, true, callback);
      } else if (item.Garnishes && item.Garnishes.length > 0) {
        this.loadingGarnishesPopup(item, item.Garnishes, null, '', item.SelectedGarnishes, true);
      }
    }
  }

  private loadingGarnishesPopup(item, garnishes: GarnishAppModel[], garnishGroup: GarnishGroupAppModel,
    comments: string, selectedGarnishes, isFirstPage, selectedGarnishesPrice?, callback?) {
      console.log("loadingGarnishesPopup - ITEM", item);
      console.log("loadingGarnishesPopup - SELECTED-GAR", selectedGarnishes);
    const matDialogRef = this.matDialog.open(GarnishesComponent, {
      data: {
        garnishGroup: garnishGroup,
        garnishes: garnishes,
        comments: comments,
        selectedGarnishes,
        isFirstPage,
        item: item,
        isMenu: true,
        selectedGarnishesPrice
      },
      width: '100%',
      maxWidth: '1000px',
      disableClose: true,
      panelClass: 'custom-mat-dialog-mobile-garnishes-with-item'
    });
    matDialogRef.afterClosed().subscribe((result: GarnishesDialog) => {
      console.log("result - AFTER GARNISHES COMPONENT", result);


      if (result.isSaved) {
        console.log("IDK");
        if (result && result.allGettingGarnishes && item && !result.returnToPreviousPage) {
          //console.log("IDK- item.selectedGarnishes", item.SelectedGarnishes);
          console.log("result.allGettingGarnishes", result.allGettingGarnishes);
          item.SelectedGarnishes = result.allGettingGarnishes.slice();
          console.log("item.selectedGarnishes", item.SelectedGarnishes);
        }
        if ((!result.returnToPreviousPage && item && item.GarnishGroups && item.GarnishGroups.indexOf(garnishGroup) != -1 &&
          item.GarnishGroups.indexOf(garnishGroup) + 1 < item.GarnishGroups.length) ||
          (!result.returnToPreviousPage && item && item.GeneralGarnishGroups && item.GeneralGarnishGroups.indexOf(garnishGroup) != -1 &&
            item.GeneralGarnishGroups.indexOf(garnishGroup) + 1 < item.GeneralGarnishGroups.length)) {
          if (item.GarnishGroups) {
            console.log(" if (item.GarnishGroups)");
            var grnGrp = item.GarnishGroups[item.GarnishGroups.indexOf(garnishGroup) + 1];
          }
          else {
            console.log(" else");
            grnGrp = item.GeneralGarnishGroups[item.GeneralGarnishGroups.indexOf(garnishGroup) + 1];
            console.log("grnGrp",grnGrp);
          }
          if (grnGrp && grnGrp.Garnishes && grnGrp.Garnishes.length > 0) {
            console.log("item1", item);
            this.loadingGarnishesPopup(item, null, grnGrp, result.comments,
              item.SelectedGarnishes, false, result.selectedGarnishesPrice);
          }
        } else if (!result.returnToPreviousPage && item.Garnishes && item.Garnishes.length > 0 && item.SelectedGarnishes &&
          result.isGarnishGroup) {
          this.loadingGarnishesPopup(item, item.Garnishes, null, result.comments,
            item.SelectedGarnishes, false, result.selectedGarnishesPrice);
        } else if ((result.returnToPreviousPage && item && item.GarnishGroups &&
          item.GarnishGroups.indexOf(garnishGroup) !== -1 &&
          item.GarnishGroups.indexOf(garnishGroup) - 1 > -1) ||
          (result.returnToPreviousPage && item && item.GeneralGarnishGroups &&
            item.GeneralGarnishGroups.indexOf(garnishGroup) !== -1 &&
            item.GeneralGarnishGroups.indexOf(garnishGroup) - 1 > -1)) {
          if (item.GarnishGroups) {
            var grnGrp = item.GarnishGroups[item.GarnishGroups.indexOf(garnishGroup) - 1];
          }
          else {
            grnGrp = item.GeneralGarnishGroups[item.GeneralGarnishGroups.indexOf(garnishGroup) - 1];
          }
          if (grnGrp && grnGrp.Garnishes && grnGrp.Garnishes.length > 0) {
            console.log("item2", item);
            this.loadingGarnishesPopup(item, null, grnGrp, result.comments,
              item.SelectedGarnishes, item.GarnishGroups.indexOf(grnGrp) === 0, result.selectedGarnishesPrice);
          }
        } else if (result.returnToPreviousPage && item.Garnishes &&
          item.Garnishes.length > 0 && item.SelectedGarnishes) {
          if (item.Garnishes) {
            const grnGrp = item.GarnishGroups[item.GarnishGroups.length - 1];
            if (grnGrp) {
              console.log("item5", item);
              this.loadingGarnishesPopup(item, null, grnGrp, result.comments,
                item.SelectedGarnishes, item.GarnishGroups.indexOf(grnGrp) === 0, result.selectedGarnishesPrice);
            }
          }
        } else if (!result.returnToPreviousPage) {
          // If everything was added to list of garnishes - add to card
          // console.log("---item",item);
          console.log("item3", item);
          this.addToCartItemWithGarnishes(item, result, callback);
        } else {

        }
      } else {

      }
    });
  }

    private addToCartItemWithGarnishes(item, data?, callback?) {
    console.log("addToCartItemWithGarnishes", item);
    console.log("data", data);
    if (!this.isNotFilledAllRequiredGarnishesOfGarnishGroup(item)) {
      if (item.PizzaPrices) {
        //this.myPrepare(item);
      }
      else {
        const orderItem = this.prepareItemForOrder(item);
        console.log("orderItem", orderItem);
        if (data && data.comments) {
          orderItem.SpecialRequests = data.comments || '';
        }
        const index = this.getIndexIfNotHavingGarnishes(item);
        if (index >= 0) {
          const item = this.order.OrderItems[index];
          item.Amount += orderItem.Amount;
        } else {
          this.order.OrderItems.push(orderItem);
          if(this.order.OrderItems.length>0){

            }
        }
        this.orderService.recalculateSum();
        this.resetItem(item);
        this.loadSuccessAddingToCartMessage();

      }


    }
  }


  private isNotFilledAllRequiredGarnishesOfGarnishGroup(item: ItemAppAdvancedModel) {
    let requireMinMaxOptions = false;
    if (item && item.GarnishGroups) {
      const countOfGarnishes = (arr: any[]) => {
        let counter = 0;
        arr.forEach((e) => {
          counter += e.SelectedAmount;
        });
        return counter;

      };
      const isSelectedAllNeededGarnishesByGroup = (garnishGroup, item) => {
        if (garnishGroup) {
          const countOfGarnishesArray = item.SelectedGarnishes.filter((garnish) => {
            return garnish.IsSelected && garnishGroup.Garnishes && garnishGroup.Garnishes[0] &&
              garnish.GarnishGroupId === garnishGroup.Garnishes[0].GarnishGroupId;
          });
          return ((garnishGroup.Min == garnishGroup.Max && garnishGroup.Max != 0) || (garnishGroup.Min != garnishGroup.Max)) ?
            ((countOfGarnishes(countOfGarnishesArray) >= garnishGroup.Min && countOfGarnishes(countOfGarnishesArray) <= garnishGroup.Max)
              || (countOfGarnishes(countOfGarnishesArray) >= garnishGroup.Min &&
                garnishGroup.Min > garnishGroup.Max)) : true;
        }
        return false;
      };
      item.GarnishGroups.forEach((it) => {
        if (!requireMinMaxOptions) {
          requireMinMaxOptions = !isSelectedAllNeededGarnishesByGroup(it, item);
        }
      });
    }
    return requireMinMaxOptions;
  }

  private loadItemPopupDesktop(item, comment?) {
    /*const modalElement = document.getElementsByClassName('modal-dialog-item-with-garnishes');
    console.log("modalElement", modalElement);
    console.log("loadItemPopupDesktop(item)",item);*/
    const initialState = {
      item: item
    };
    this.bsModalRef = this.modalService.show(ItemWithGarnishesComponent,
      { initialState, class: 'modal-dialog-item-with-garnishes' });
    this.modalService.onHide
      .pipe(take(1)).subscribe(() => {
        console.log("menu close modal item", this.bsModalRef.content);
        console.log("menu close modal comment", comment);
        if (this.bsModalRef.content.isSaved && this.bsModalRef.content.item) {
          if (!this.bsModalRef.content.item.PizzaPrices) {
            const orderItem = this.prepareItemForOrder(this.bsModalRef.content.item);
            console.log("orderItem", orderItem);
            orderItem.SpecialRequests = this.bsModalRef.content.itemComments;
            orderItem.ItemName = this.bsModalRef.content.itemName;
            const index = this.getIndexIfNotHavingGarnishes(this.bsModalRef.content.item);

            orderItem.IsClubMemberItem = true;
            this.displayContinueButton = true;

            if (index >= 0) {

              const item = this.order.OrderItems[index];

              item.Amount += orderItem.Amount;


            } else {

              this.order.OrderItems.push(orderItem);

              if (this.order.OrderItems.length > 0) {

              }

            }

            this.orderService.recalculateSum();
            this.resetItem(item);
            this.loadSuccessAddingToCartMessage();

            // this.loadSuccessAddingToCartMessage();
          }

        }
      });


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

  private getIndexIfNotHavingGarnishes(currentItem) {
    if (this.order && this.order.OrderItems && currentItem) {
      const item = this.order.OrderItems.find((item) => {
        return item.ItemId === currentItem.Id && item.Garnishes && item.Garnishes.length === 0
          && currentItem.GarnishGroups && currentItem.GarnishGroups.length === 0
          && currentItem.Garnishes && currentItem.Garnishes.length === 0;
      });
      return this.order.OrderItems.indexOf(item);
    }
    return -1;
  }


  private prepareItemForOrder(item : ItemAppAdvancedModel) {
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
    orderItem.IsAnnBenefitItem = item.IsAnnBenefitItem;
    orderItem.IsBDayBenefitItem = item.IsBDayBenefitItem;
    orderItem.IsJoinBenefitItem = item.IsJoinBenefitItem;
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

  public loadSuccessAddingToCartMessage() {
    if(document){
    document.getElementById("snackbar").classList.add("show");    
    setTimeout(() => {
     document.getElementById("snackbar").classList.remove("show");    
    }, 3000);
   }

  }

  public loadSuccessCancelMembershipMessage() {
    if(document){
    document.getElementById("snackbar-cancel").classList.add("show");    
    setTimeout(() => {
     document.getElementById("snackbar-cancel").classList.remove("show");    
    }, 3000);
   }

  }


  public updateUser(){

    this.clearErrorFields();

    if(this.isAllValidUserData()){
      this.signInOutService.updateUserDetails(this.appUser).subscribe((result) => {
        console.log("myMembershipComp: result - update user", result);
        this.entryMemberScreen = true;
        this.displayMyInfo = false;
        if(result){
          this.loadSuccessAddingToCartMessage();
        }

      }, (error) => {
        console.log("error update user");
  
      });
  
      //this.displayMyBenefits = true;

      }
      else {
        console.log("payment !this.isAllValid()",this.isAllValidUserData());
        //this.displayCustomerErrorFields();
      }



  }

  public isAllValidUserData() {
    return this.isFilledCustomerFields();
  }

  public isFilledCustomerFields() {
    var pattern = new RegExp('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}'); 
    console.log("BirthDate", this.appUser.BirthDate);  
    console.log("Anniversary", this.appUser.Anniversary);  
    console.log("Email", this.appUser.Email);  
    console.log(" pattern.test", pattern.test(this.appUser.Email.toString().trim())); 
    console.log("this.trimField(this.appUser.FirstName)",this.trimField(this.appUser.FirstName)); 

    if (/*this.sendInvoice &&*/ this.appUser.Email!= null && 
        this.appUser.Email!= undefined && 
        this.appUser.Email.toString().trim().length > 0 &&  
        pattern.test(this.appUser.Email.toString().trim()) && this.trimField(this.appUser.FirstName)
        && this.trimField(this.appUser.LastName)) { //check if all required data is valid

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

    else if(!this.trimField(this.appUser.FirstName)){
      console.log("fName is undefined");
      this.orderErrors.FirstName = true;
      return false;
    }

    else if(!this.trimField(this.appUser.LastName)){
      console.log("lName is undefined");
      this.orderErrors.LastName = true;
      return false;
    }
    
    else{
      console.log("else????")
    }
  }

  dateIsValid(date) {
    console.log("date",date);
    if( date instanceof Date) return true;
    else{
      console.log("not instance of date: date", date);
      return false;

    }
  }

  public removeErrorWhileFocus(field) {
    if (this.orderErrors && field && this.orderErrors[field]) {
      this.orderErrors[field] = false;
    }
  }



  public getLanguage() {
    return this.translationsService.language();
  }


   public allItemsArr = [];
   public allCombosArr = [];


  public stringedDateFomat(stringedDate) {
    let timeArr = stringedDate.split(' ')[1].split(':');
    var strTime = '';

    var hours = +timeArr[0];
    var minutes = +timeArr[1];
    var hoursStr: String;
    var minutesStr: String;


    if ( this.lang == 'en') {
      var ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutesStr = minutes < 10 ? '0' + minutes.toString() : minutes.toString();
      strTime = hours + ':' + minutesStr + ' ' + ampm;
    } else {
      hoursStr = hours < 10 ? '0' + hours.toString() : hours.toString();
      minutesStr = minutes < 10 ? '0' + minutes.toString() : minutes.toString();
      strTime = hoursStr + ':' + minutesStr;
    }

    return strTime;
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


  public completeSignIn() {
    this.isSignedUser = true;
    
  }


  public checkSigning(result?) {
    this.isSignedUser = !!result;
    this.isSignedUser = !!this.appStorageService
      .getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.configService.franchiseId);
    if (this.isSignedUser) {
      //this.checkDiscount(true);
      this.verifyToken(true);
    } else {
      this.isLoaded.isDiscountLoaded = true;
      this.checkedUserSigning();
      //this.checkDiscount(true);
    }
  }

  public checkedUserSigning(isSignedUser?) {
    this.isSignedUser = !!isSignedUser;
    
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

  public openBiteCreditPopup(){
    console.log("this.isMobileMode()",this.isMobileMode());
    console.log("this.appUser",this.appUser);
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
        appUser: this.appUser,
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
        if(response && response.user){
          this.appUser =  response.user;

        }
        const result = response ? !!response.user : !!response;
        const resultAction = () => {
          if (result) {
            //this.loadUserDataToOrder(response.user, false);
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


  


}
