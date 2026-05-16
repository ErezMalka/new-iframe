import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  DoCheck,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
//import {ModalDirective, BsModalService} from 'ngx-bootstrap/modal';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { take } from 'rxjs/operators';
import { MetaDataService } from '../../core/services/meta-data.service';
import { MenuService } from '../../core/services/menu.service';
import { AppConfig } from '../../app.config';
import { CategoryAppAdvancedModel } from '../../models/advanced/menu/category-app-advanced.model';
import { TranslationsService } from '../../shared/translations/translations.service';
import { OrderAppModel } from '../../models/order/order-app.model';
import { OrderService } from '../../core/services/order.service';
import { OrderItemAppModel } from '../../models/order/order-item-app.model';
import { ItemAppAdvancedModel } from '../../models/advanced/menu/item-app-advanced.model';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GarnishesComponent } from './garnishes/garnishes.component';
import { GarnishAppAdvancedModel } from '../../models/advanced/menu/garnish-app-advanced.model';
import { GarnishGroupAppModel } from '../../models/menu/garnish-group-app.model';
import { GarnishAppModel } from '../../models/menu/garnish-app.model';
import { BrowserIdentificatorService } from '../../core/services/common-settings/browser-identificator.service';
import { AppStorageService } from '../../app.storage.service';
import { DiscountModel } from '../../models/discount/discount.model';
//import { PizzaComponent} from './pizza/pizza.component';
import { NewPizzaComponent} from './pizza/new-pizza.component';
import { PizzaComponent} from './pizza/pizza.component';
import { PizzaAppAdvancedModel } from '../../models/advanced/pizza/pizza-app-advanced.model';
import { MessagePopupComponent } from '../../shared/components/message-popup/message-popup.component';
import { OrderPizzaToppingAppModel } from '../../models/order/order-pizza-topping-app.model';
import { OrderPizzaAppAdvancedModel } from '../../models/advanced/order/order-pizza-app-advanced.model';
import { CommonFunctionsService } from '../../core/services/common-settings/common-functions.service';
import { ScratchCouponService } from '../../core/services/scratch-coupon.service';
import { ScratchCouponComponent } from './scratch-coupon/scratch-coupon.component';
import { SignInOutService } from '../../core/services/sign-in-out.service';
import { StorageValueEnum } from '../../enums/advanced/storage-value.enum';
import { MessageService } from '../../shared/components/message/message.service';
import { PizzaSizeComponent } from './pizza/pizza-size/pizza-size.component';
import { PizzaSizeAppModel } from '../../models/pizza/pizza-size-app.model';
import { LanguageEnum } from '../../enums/advanced/language.enum';
import { environment } from '../../../environments/environment';
import { NgScrollbar } from 'ngx-scrollbar';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgxPageScrollModule } from 'ngx-page-scroll';

import { SizeMobileInitializationComponent } from '../../shared/classes/size-mobile-initialization.component';
import { BranchAppModel } from "../../models/franchise-branch/branch-app.model";
import { Subject, Subscription } from "rxjs";
import { PreviousRouteService } from "../../core/services/common-settings/previous-route.service";
import { DiscountCouponComponent } from "./discount-coupon/discount-coupon.component";
import { DragScrollComponent } from "ngx-drag-scroll";
import ComboAppModel from "../../models/combo/combo.model";
import ComboAppAdvancedModel from "../../models/advanced/combo/combo-app-advanced.model";
import {ComboComponent} from "./combo/combo.component";
import {NewComboComponent} from "./combo/new-combo.component";
import {ItemComponent} from "./item/item.component";
import {ItemWithGarnishesComponent} from "./item-with-garnishes/item-with-garnishes.component";

import { DialogSignInComponent } from '../../components/sign-in/popup/dialog-sign-in.component';
import {OrderComboAppModel} from "../../models/order/order-combo-app.model";
import scrollingToElement, {
  getDistanceForItems, isScrolledIntoView,
  scrollByCount,
  scrollCurrentItem,
  scrollItem, scrollToView, viewPosition
} from "../../custom-libs/scroll-to";
import { setIdByQuerySelector } from "../../custom-libs/attribute-settings";
import { StartPageEnum } from "../../enums/start-page.enum";
import { FranchiseAppModel } from "../../models/franchise-branch/franchise-app.model";
import { AdditionalItemsComponent } from '../../components/additional-items/additional-items.component';
import { RoundPricePipe } from '../../shared/pipes/round-price.pipe';
import { resourceLimits } from 'worker_threads';
import { RouteActivateService } from "../home/route-activate.service";
import { VersionImageService } from '../../core/services/common-settings/version-image.service';
import { BehaviorSubject, Observable } from 'rxjs';
import 'animate.css';

import { BiteCreditComponent } from '../../shared/components/bite-credit/bite-credit.component';

import { ClubMemberComponent } from '../../shared/components/club-member/club-member.component';
import { ConfigService } from '../../core/services/common-settings/config.service';
import { browserRefresh } from '../../app.component';


function createLoadedData(isBranchLoaded: boolean, isMenuLoaded: boolean, isOpenBranchLoaded: boolean) {
  const loadedData = new LoadedData();
  loadedData.isBranchLoaded = isBranchLoaded;
  loadedData.isMenuLoaded = isMenuLoaded;
  loadedData.isOpenBranchLoaded = isOpenBranchLoaded;
  return loadedData;
}

class LoadedData {
  public isBranchLoaded: boolean;
  public isMenuLoaded: boolean;
  public isOpenBranchLoaded: boolean;
  public isGoingToMenu:boolean;
}

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

class PizzaDialog {
  public pizza: PizzaAppAdvancedModel;
  public specialRequests: string;
  public isSaved?: boolean;
  public isReturnToPrevPage: boolean;
  public pizzaSize: PizzaSizeAppModel;
  public additionItems: ItemAppAdvancedModel[];
}

@Component({
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, DoCheck, OnDestroy, AfterViewInit, AfterViewChecked {
  //extends SizeMobileInitializationComponent



  public defaultCategoryColor = '#ffffff';
  //public topMenuColor = 'transparent';
  isSticky: boolean = false;
  categoryHeaderHeight: number = 47;
  itemHeight: number = 160;

  currentSection = '';

  private pizzaBaseLoaded: boolean = true;
  selectedLang: any;
  messagesFromBranch: any;


  @ViewChild('myIdentifier')
  myIdentifier: ElementRef;

stop:any;
  public cancelVerification: boolean = false;
  public userJoinedClub: boolean = false;
  // W13-search: query text bound to category search input
  public searchQuery: string = '';
  currentDate: Date;
  displayBDayAndAnnScreen: boolean;
  displayBDayScreen: boolean;
  displayAnnScreen: boolean;
  clubMemberCategories: any;
  

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    // this.isSticky = window.pageYOffset >= 130;
    //console.log( window.pageYOffset);
    //  if ( window.pageYOffset >= 130){
    //  this.topMenuColor = '#ffffff';
    // } else {
    //   this.topMenuColor = 'transparent';
    //   }
  }

  public getLanguage() {
    return this.translationService.language();
  }

  public openMenu(catId) {
    console.log("openMenu");
    this.menuLoaded = false;
    this.isCollapsed = !this.isCollapsed;

    setTimeout(() => {
      this.scrollTo(catId);
      this.menuLoaded = true;
    }, 500);


  }


  public dataLayerItems: any[]=[];
  public itemsPositions = [];
  public positionOfScroll: number;
  public logoImg: string;
  public displayArrowForMenu = false;

  public graphics = {
    logo: '',
    cover: '',
  };

  public colors = {
    menuColor: '',
    buttonColor: '',
    priceColor: '',
    categoryColor: ''
  };

  public menuLoaded = true;

  public isLoaded: any = {
    isDiscountLoaded: false,
    isSignIn: true // default it's loaded
  };
  // public isDigitalMenu: boolean;
  public user: any;

  public isShowedPizzaInMenu = false;
  public isShowedComboInMenu = false;

  public pizzaToppings: any[];
  public categories: CategoryAppAdvancedModel[];
  public upgradeCategory: CategoryAppAdvancedModel;

  public pizzas: PizzaAppAdvancedModel[];
  public combos: ComboAppAdvancedModel[];
  public pizzaAdditionItems: ItemAppAdvancedModel[];
  public bonusItems: ItemAppAdvancedModel[] = [];
  public upgradeItems: ItemAppAdvancedModel[] = [];

  //public gotBonus: boolean = false;

  public pizzaCategory = undefined;
  public comboCategory = undefined;
  public comboAppCategory = undefined;
  public pizzaAppCategory = undefined;
  // For carousel:
  public slideConfig = {
    slidesToShow: 4,
    focusOnSelect: false,
    dots: false,
    infinite: false,
    draggable: false,
    arrows: false
  };

  // For scrollbar:
  public disabled = this.isMobileBrowser() && this.isMobileMode();
  public shown: 'native' | 'hover' | 'always' = 'native';

  public currentCategory: CategoryAppAdvancedModel;

  public lang: string;
  public order: OrderAppModel;
  public cashSymbol = '';
  public isNotPizza = true;
  public isCombo = false;

  public discount: DiscountModel;
  public isSignedUser: boolean;// = !!this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN);

  // Scratch coupon logic:
  public scratchCouponWasDisplayed = false;
  public scratchCoupons = [];
  public isLoadedScratchCoupon = true;

  public scratchCoupon = undefined;
public multilingual:Boolean = false;
  public minForBonus = AppConfig.configSettings.minAmountForBonus;
  public firstMessage = "";
public displayPickupPoints:boolean = false;
  // Animation for slider
  @ViewChild('slickModal')
  public carousel: ElementRef;
  private interval = 5000; // in ms
  private instanceInterval;
  private index = this.slideConfig.slidesToShow;
  private timeOut = 2000; // in ms
  private timeOutInterval;

  @ViewChild(NgScrollbar)
  public scrollable: NgScrollbar;

  private timeOutForScrollUpdate = 100;

  public currentBranch: BranchAppModel;
  public startingPage: string;

  private previousPage: string;

  private navigationSubscribe: Subscription;
  public isCollapsed: boolean = true;

  public flag = true;
  public languages: any[];
   
  @ViewChild('mobileMenuContainer') mobileMenuContainer!: ElementRef;
  @ViewChild('nav', { read: DragScrollComponent }) ds: DragScrollComponent;
  @ViewChild('menuTopNavigationIdentifier') menuTopNavigationIdentifierOffsetHeight: any;
  menuTopNavigationIdentifierOffsetHeightValue;

  notCheckScrolling: boolean = false;
  bsModalRef: BsModalRef;

  public imgSrc: any;

  public franchiseId: string;

  public franchise: any;

  public inLinks = this.appStorageService.inLinks;

  private isLoadedAllData: BehaviorSubject<LoadedData> = new BehaviorSubject<LoadedData>(null);
public displayPhone: boolean;

  public browserRefresh: boolean;


  constructor(private metaDataService: MetaDataService,
    private menuService: MenuService,
    private translationService: TranslationsService,
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute,
    private matDialog: MatDialog,
    private configService: ConfigService,
    private modalService: BsModalService,
    protected browserIdentificatorService: BrowserIdentificatorService,
    public appStorageService: AppStorageService,
    private commonFunctionsService: CommonFunctionsService,
    private scratchCouponService: ScratchCouponService,
    private signInOutService: SignInOutService,
    private messageService: MessageService,
    private deviceService: DeviceDetectorService,
    private roundPricePipe: RoundPricePipe,
    private routeActivate: RouteActivateService,
    private imageVersionService: VersionImageService,

    private previousRouteService: PreviousRouteService) {
    //super(browserIdentificatorService);
  }

  

  isDigitalMenu(): boolean {
    //if (AppConfig.configSettings.isDigitalMenu
    //  && AppConfig.configSettings.isDigitalMenu == true) {
    if (this.order.IsDigitalMenu) {
      return true;
    } else {
      return false;
    }
  }

  isAppDisplayMode(): boolean {
    if (AppConfig.configSettings.appDisplayMode
      && AppConfig.configSettings.appDisplayMode == true) {
      //   console.log("appDisplayMode",true);
      return true;
    } else {
      // console.log("appDisplayMode",false);
      return false;
    }
  }

  isMobileMode(): boolean {
    return this.deviceService.isMobile() || this.deviceService.isTablet() ||window.innerWidth < window.innerHeight;
  }


  ngOnInit() {
    this.displayPickupPoints=AppConfig.configSettings.pickupPoints;
    this.multilingual = AppConfig.configSettings.multilingual;
    this.logoImg = AppConfig.settings.logo;
    this.franchiseId = this.route.snapshot.paramMap.get('franchiseId');
    this.isSignedUser = !!this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.franchiseId);
    if (this.appStorageService.categories == undefined || this.appStorageService.categories.length == 0) {
      //  this.router.navigateByUrl(`/${this.franchiseId}/sign-in`);
      this.router.navigate([`${this.franchiseId}/home`]);
    } else {
      this.configService.currentUrl =window.location.hash;
    }
    this.languages = this.appStorageService.languages;
    this.initializeGraphics();
    this.getAppLanguages();
    this.prepareOrder();

    //this.loadSignInForm();
    this.loadMenu();

    this.browserRefresh = browserRefresh;


    //this.checkDiscount();
    this.imgSrc = AppConfig.settings.logo;
    this.selectedLang = this.translationService.language();
    this.displayPhone = AppConfig.configSettings.displayBranchPhoneLink;
     


    this.currentDate = new Date();

    if(this.appStorageService.loadSuccessCancelMembershipMessage && !this.appStorageService.dontShowAgainCancelMessage){
      this.loadSuccessCancelMembershipMessage();
      this.appStorageService.dontShowAgainCancelMessage = true;
    }
    
    if(AppConfig.configSettings.cancelPhoneVerification){
      this.cancelVerification = true;
    }

    if (!this.isDigitalMenu()) {

      if (this.appStorageService.isFirstPopUp && this.currentBranch.Messages.length>0) {

        console.log("go to displayMyMessages")
        this.displayMyMessages();


      }

      else{
        
        console.log("first else");

        const mySec = document.getElementsByClassName("my-items");

        for (let index = 0; index < mySec.length; index++) {
          mySec[index].classList.add('animate__animated', 'animate__bounceInDown');
          setTimeout(() => {
            mySec[index].classList.remove('animate__animated', 'animate__bounceInDown');
          }, 2000);
        }

        this.checkSigning((result) => {
          console.log("continue here 3");

          if (result) {
            console.log("continue here 4");

            if (!this.isSignedUser && this.appStorageService.franchise.UseMembersClub) {
              console.log("continue here 8 - if not signed and franchise use member club");
              this.loadSignInForm((result) => {
              //  if (result.isSignedIn)
                  //this.verifyToken();
              });

            }
            else {
              this.appStorageService.canStartMessages = true;
            }
            //if ( !this.isDigitalMenu()) this.displayPopupMessage();
            //this.loadSignInForm();
            // this.autoPlayCarousel();

            this.franchiseId = this.route.snapshot.paramMap.get('franchiseId');


          }

        });

      }
      //console.log("this.isFirst",this.isFirst)





    }
    console.log("?")
    this.franchiseId = this.route.snapshot.paramMap.get('franchiseId');


  }

  isInStock(item):boolean{
    if (item.Quantity < 1) return false;
    else if (item.ItemGroups?.length > 0){
      for (const grp of item.ItemGroups) {

        // Check only groups with Min > 0 (and not null/undefined)
        if (grp.Min && grp.Min > 0) {

          // Sum all quantities inside this group's items
          const totalQty = grp.GroupItems?.reduce(
            (sum, gi) => sum + (gi.Quantity || 0),
            0
          ) || 0;

          // If total quantity does NOT reach Min → item not in stock
          if (totalQty < grp.Min) {
            return false;
          }
        }
      }
    }
    return true;
  }

   isInStockCombo(combo):boolean{
 //   if (item.Quantity < 1) return false;
    //else
    if (combo.NewItemCombos?.length > 0){
      for (const grp of combo.NewItemCombos) {

        // Check only groups with Min > 0 (and not null/undefined)
        //if (grp.Min && grp.Min > 0) {

          // Sum all quantities inside this group's items
          const totalQty = grp.Items?.reduce(
            (sum, gi) => sum + (gi.Quantity || 0),
            0

          ) || 0;

          // If total quantity does NOT reach Min → item not in stock
          if (totalQty < grp.Quantity) {
            return false;
          }
        //}
      }
    }
    return true;
  }

private getAppLanguages() {
  this.selectedLang = this.translationService.language();  
  this.languages =[];  
  this.signInOutService.getAppLanguages()
    .subscribe((response) => {
      if (response) {
        this.appStorageService.languages =response;
        this.languages = this.appStorageService.languages; //this.languages.concat(response);
        
      }
  }, (error) => {
    //this.messageService.displayServerErrorMessage();
  });
}


  selectedLangChanged(event: any) {
    this.translationService.setLanguage(this.selectedLang);
 }

  dateIsValid(date) {
    if( date instanceof Date) return true;
    else{
      return false;

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

  public checkUserEvents() {
    var birthStrToDate;
    var availableMonthBDay;
    var annStrToDate;
    var availableMonthAnn;
    const currentMonth = this.currentDate.getMonth();
    if (this.user.IsClubMember) {

      if (this.user.BirthDateStr != null) {
        birthStrToDate = new Date(this.user.BirthDateStr);
      }
      if (this.dateIsValid(this.user.BirthDate)) {
        availableMonthBDay = this.user.BirthDate?.getMonth();
      }
      else if (this.user.BirthDateStr != null) {
        availableMonthBDay = birthStrToDate?.getMonth();
      }

      if(this.user.AnniversaryStr != null){
        annStrToDate = new Date(this.user.AnniversaryStr);
      }
      if(this.dateIsValid(this.user.Anniversary)){
        availableMonthAnn = this.user.Anniversary?.getMonth();
       }
       else if(this.user.AnniversaryStr != null){
        availableMonthAnn =  annStrToDate?.getMonth();
       }
    

      const bdayCategory = this.clubMemberCategories.filter((cat) => {
        return cat.Name == this.translationService.translate('CM_BIRTHDAY') || cat.Name == 'CM_BIRTHDAY'
      });

      const annCategory = this.clubMemberCategories.filter((cat) => {
        return cat.Name == this.translationService.translate('CM_ANNIVERSARY') || cat.Name == 'CM_ANNIVERSARY'
      });

      

      if((availableMonthAnn == availableMonthBDay) && (availableMonthAnn == currentMonth)
          && !this.user.UsedAnniversaryVoucher && !this.user.UsedBirthdayVoucher
          && (annCategory && annCategory[0]?.Items?.length>0) && (bdayCategory && bdayCategory[0]?.Items?.length>0)){
          this.displayBDayAndAnnScreen = true;
          this.displayBDayScreen = false;
          this.displayAnnScreen = false;
          return;
      }
      else if (availableMonthAnn == currentMonth && !this.user.UsedAnniversaryVoucher
        && (annCategory && annCategory[0]?.Items?.length>0)){
        this.displayBDayAndAnnScreen = false;
        this.displayBDayScreen = false;
        this.displayAnnScreen = true;
        return;
      }
      else if (availableMonthBDay == currentMonth && !this.user.UsedBirthdayVoucher
        && (bdayCategory && bdayCategory[0]?.Items?.length>0)){
        this.displayBDayAndAnnScreen = false;
        this.displayBDayScreen = true;
        this.displayAnnScreen = false;
        return;
      }
      else{
        console.log("!!!!!!!else");
        this.displayBDayAndAnnScreen = false;
        this.displayBDayScreen = false;
        this.displayAnnScreen = false;
      } 

    }

  }

  public openBiteCreditPopup(){
    const token = this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.franchiseId);
  //  if (token) 
    if(!token) {
      let position: any;
      if(this.isMobileMode()){
        position = {top: '5vh'};
      }
      else{
        position = {} 
      }
    const matDialogRef = this.matDialog.open(DialogSignInComponent, {
      data: {
        isFirst: true,
      },
      width: '40%',
      maxWidth: '518px',
      minWidth: '346px',
      position: position,
      panelClass: ['padding-small-container', 'custom-mat-dialog-mobile'],
      disableClose: false,
    });
    
    matDialogRef.componentInstance.signInCompleted
      .subscribe((result) => {
        //this.loadOrderUserDataToUser(this.order);
        this.isSignedUser = result;
        console.log("defaultLayout component verifyToken");
        const token = this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.franchiseId);
        this.signInOutService.verifyToken(token).subscribe((response) => {
          const result = response ? !!response.user : !!response;
          if (result  && response.user != null) {
            this.user = response.user;
            this.appStorageService.appUser = response.user;
          
            console.log("loadSignInForm -defaultLayaout");
            if(AppConfig.configSettings.cancelPhoneVerification){
              this.user.Address = null;
              this.user.IsClubMember = null;
              this.appStorageService.appUser.Address = null;
              this.appStorageService.appUser.IsClubMember = null;
            }

            if (this.isSignedUser && this.user) {
              if( this.user.BiteCredit > 0){
                this.router.navigateByUrl(`/${this.franchiseId}/my-credit`);
              }
              else{
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
                const matDialogRef = this.matDialog.open(BiteCreditComponent, {
                  data: {
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
            }
    
          } else {
            this.signInOutService.signOut();
            this.isSignedUser=false;
          }
        }, (error) => {
        });


      });
    } else {
      if (this.appStorageService.appUser?.BiteCredit > 0) {
        this.router.navigateByUrl(`/${this.franchiseId}/my-credit`);
      }else{
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
        const matDialogRef = this.matDialog.open(BiteCreditComponent, {
          data: {
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

      
    }
   
  }


  /*public openBiteCreditPopup(){
    var minWidth;
    var maxWidth;
    var maxHeight;
    var cls;
    if(this.isMobileMode()){
      minWidth = '100vw';
      cls = '';

    }
    else{
      minWidth = 'none';
      maxHeight = '80vh';
      maxWidth = '50vw';
      cls = 'bite-credit-desktop'
    }
    const matDialogRef = this.matDialog.open(BiteCreditComponent, {
      data: {
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
  }*/
  public openCustomerClub(isClubMember?, callback?) {

    

    console.log("openCustomerClub()");





    let header = this.translationService.translate("CONTACT");
    //let icon = "../../../assets/images/items/phone.png";
    var minWidth;
    var maxWidth;
    var maxHeight;
    var cls;
    if(this.isMobileMode()){
      minWidth = '100vw';
      cls = '';

    }
    else{
      minWidth = 'none';
      maxHeight = '80vh';
      maxWidth = '40vw';
      cls = 'club-member-desktop'
    }

    if (this.clubMemberCategories && this.clubMemberCategories.length > 0) {

      const phoneNumber = this.currentBranch.BranchPhone;
      const address = this.currentBranch.Address;
      const matDialogRef = this.matDialog.open(ClubMemberComponent, {
        data: {
          userJoinedClub: this.userJoinedClub,
          userBirthDay: this.displayBDayScreen,
          userAnniversary: this.displayAnnScreen,
          userAnniversaryAndBDay: this.displayBDayAndAnnScreen,
          isClubMember: isClubMember,
          appUser: this.user,
          phoneNumber,
          address

        },
        minWidth: minWidth,
        maxHeight: maxHeight,
        maxWidth: maxWidth,
        disableClose: true,
        panelClass: cls
      });

      matDialogRef.afterClosed().subscribe((result) => {
        if (result) {

          if (callback) {
            callback(result);
          }
          this.appStorageService.showClubMember = false;
          console.log("****************************************************************************************");

          if (result.signIn && result.bDay && result.email || result.canceledMembership) {

            if (!result.canceledMembership) {
              this.user.Anniversary = result.annDay;
              this.user.BirthDate = result.bDay;
              this.user.Email = result.email;
              this.user.AllowAdvertisement = result.enablePush;
            }
            this.user.FirstName = result.fName;
            this.user.LastName = result.lName;
            this.user.IsClubMember = true;
            this.user.JoinedToClub = new Date();
            this.user.DontDisplayAnymore = false;
            /*if (!this.dateIsValid(this.user.Anniversary) && this.user.AnniversaryStr != null) {
              this.user.Anniversary = new Date(this.user.AnniversaryStr);
            }
  
            if (!this.dateIsValid(this.user.BirthDate) && this.user.BirthDateStr != null) {
              this.user.BirthDate = new Date(this.user.BirthDateStr);
            }
  
            if (!this.dateIsValid(this.user.FirstLogin) && this.user.FirstLoginStr != null) {
              this.user.FirstLogin = new Date(this.user.FirstLoginStr);
            }
  
            if (!this.dateIsValid(this.user.JoinedToClub) && this.user.JoinedToClubStr != null) {
              this.user.JoinedToClub = new Date(this.user.JoinedToClubStr);
            }*/



            this.signInOutService.updateUserDetails(this.user).subscribe((result) => {
              const joinCategory = this.clubMemberCategories.filter((cat) => {
                return cat.Name == this.translationService.translate('CM_JOIN') || cat.Name == 'CM_JOIN'
              });
              if (result && !this.user.UsedJoinVoucher && joinCategory && joinCategory[0] && joinCategory[0].Items && joinCategory[0].Items.length>0) {
                this.userJoinedClub = true;
                this.openCustomerClub()
              }
              else if (result && (this.user.UsedJoinVoucher || !joinCategory[0])) {
                this.loadSuccessRegistrationMessage();
              }
            }, (error) => {
              console.log("error update user");

            });
          }
          else if (result.addToCart) {
            this.loadSuccessAddingToCartMessage(false);
          }
        }


        /*if (callback) {
          //this.isFirst=false;
          callback(result);
  
        }*/
      });
    }
  }

public loadSuccessRegistrationMessage() {
  if(document){
  document.getElementById("snackbar-club-member").classList.add("show");    
  setTimeout(() => {
   document.getElementById("snackbar-club-member").classList.remove("show");    
  }, 3000);
 }

}



  public handleMissingImage(event: Event) {

    console.log("handleMissingImage()");

    (event.target as HTMLImageElement).style.display = 'none';

  }

  public refresh(): void {
    window.location.reload();
  }

  public count = 0;

  public displayMyMessages() {
    this.messagesFromBranch = this.currentBranch.Messages;
    this.messagesFromBranch.sort(function (a, b) {
      return a.Order - b.Order;
    });

    //var count = 0;

    this.messagesFromBranch.forEach(message => {

      if (!message.DisplayInEndOfOrder) {


        this.displayPopupMessage(message, message.Message, message.ImageUrl, (result) => {
          if (!result.isDigitalMenu)
            this.count++;

          if (this.count == this.messagesFromBranch.length) {

            this.appStorageService.isFirstPopUp = false;

            console.log("if(this.count == this.messagesFromBranch.length)");
            this.checkSigning((result) => {
              console.log("continue here 3");

              if (result) {
                console.log("continue here 4");

                if (!this.isSignedUser && !AppConfig.configSettings.dontDisplayPhonePopup) { //&& this.appStorageService.franchise.UseMembersClub
                  console.log("continue here 11 - if not signed and franchise dontDisplayPhonePopup");
                  this.loadSignInForm((result) => {
                  /*  console.log("result", result)
                    if (result.isSignedIn) {
                      this.verifyToken();
                    }

                    else {
                      console.log("ON SKIP?");
                    }
                  */



                  });

                }
                else {
                  this.appStorageService.canStartMessages = true;
                }
                //if ( !this.isDigitalMenu()) this.displayPopupMessage();
                //this.loadSignInForm();
                // this.autoPlayCarousel();

                this.franchiseId = this.route.snapshot.paramMap.get('franchiseId');

              }

            });
          }
        });
      }

      else {
      }


    });




    console.log("first popup")
    //this.flag=false;

    console.log("continue here")
    // this.initializeSize();
    //this.loadMenu();

  }

  private initializeMenuForBranch(continueCallBack?) {
    // if (!this.appStorageService.isMenuWasLoaded) {
    let hasPizzas: boolean = false;
    let hascCombos: boolean = false;
    //this.isLoaded = false;
    this.menuService.getMenuForBranch(this.order.BranchId, this.appStorageService.orderType, AppConfig.configSettings.checkItemsByTime, this.translationService.language()).subscribe((result) => {
      this.imageVersionService.updateImageUrlsOfMenu(result);

      this.appStorageService.backResultMenu = this.commonFunctionsService.deepCopy(result);
      this.appStorageService.isMenuWasLoaded = true;
      if (result) {
        this.appStorageService.categories = result.categories;
        this.appStorageService.clubMembershipCategories = result.clubMembershipCategories;

        this.appStorageService.clubMembershipCategories.forEach(cat => {
          if((cat.Name == this.translationService.translate('CM_JOIN') || cat.Name == 'CM_JOIN')
          || (cat.Name == this.translationService.translate('CM_BIRTHDAY') || cat.Name == 'CM_BIRTHDAY')
          || (cat.Name == this.translationService.translate('CM_ANNIVERSARY') || cat.Name == 'CM_ANNIVERSARY')){
            
            cat.Items.forEach(item => {
              if(cat.Name == this.translationService.translate('CM_JOIN') || cat.Name == 'CM_JOIN'){
                item.IsJoinBenefitItem;
              }
              if(cat.Name == this.translationService.translate('CM_BIRTHDAY') || cat.Name == 'CM_BIRTHDAY'){
                item.IsBDayBenefitItem;
              }
              if(cat.Name == this.translationService.translate('CM_ANNIVERSARY') || cat.Name == 'CM_ANNIVERSARY'){
                item.IsAnnBenefitItem;
              }
              item.isFreeMembershipBenefit = true;
            });
          }
          
        });


        this.appStorageService.pizzas = result.pizzas;
        if (result.pizzas && result.pizzas.length > 0) {
          hasPizzas = true;

        }
        this.appStorageService.pizzaToppings = result.pizzaToppings;
        this.appStorageService.startingPage = result.startingPage;
        // this.prepareOrderOfItemsAndPizza();
      }
      this.metaDataService.getCombosForBranch(this.order.BranchId, this.appStorageService.orderType).subscribe(result => {
        if (result) {
          hascCombos = true;
        }
        this.imageVersionService.updateImageUrlsOfCombo(result);
        this.appStorageService.backResultCombo = this.commonFunctionsService.deepCopy(result);
        this.appStorageService.combos = result;

        
       /* this.order.OrderItems.forEach((i)=>{
         
          const cat = result.categories.find((c) => {
            return i.CategoryId === c.Id;
          });
          const item = cat.Items.find((it) => {
            return it.Id === i.ItemId;
          });
          i.Name = item.Name
          if (i.Item.SelectedGarnishes) {
            var selectedGarnishes =this.commonFunctionsService.deepCopy(i.Item.SelectedGarnishes);
            i.Item = this.commonFunctionsService.deepCopy(item);
            i.Item.SelectedGarnishes = selectedGarnishes;
          } else {
            i.Item = this.commonFunctionsService.deepCopy(item);
          }
         
        });*/


         this.isLoadedAllData.next(createLoadedData(false, true, false));
         // this.isLoaded = true;
          if (continueCallBack) {
            continueCallBack();
          }
       // }



      }, (error) => {
        this.isLoaded = true;
        console.log("this.isLoaded = true");
        console.log("ERROR: Couldn't load Combos");
        if (continueCallBack) {
          continueCallBack();
        }
        // this.messageService.displayServerErrorMessage();
      });

    }, (error) => {
      this.isLoaded = true;
      console.log("this.isLoaded = true");
      this.messageService.displayServerErrorMessage();
    });


    /* } else {
       const result = this.commonFunctionsService.deepCopy(this.appStorageService.backResultMenu);
       const resultCombo = this.commonFunctionsService.deepCopy(this.appStorageService.backResultCombo);
       if (result) {
         this.appStorageService.categories = result.categories;
         this.appStorageService.pizzas = result.pizzas;
         this.appStorageService.pizzaToppings = result.pizzaToppings;
       }
       if (resultCombo) {
         this.appStorageService.combos = resultCombo;
       }
       this.isLoadedAllData.next(createLoadedData(true, true, true));
     }*/

  }

  public signOut() {
    this.signInOutService.signOut();
    this.isSignedUser = false;
  }

  public changeLanguage() {
    this.translationService.setLanguage(this.selectedLang, ()=>{
      //this.selectedLang = this.translationService.language();
      this.initializeMenuForBranch(() => {

        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload'
        this.router.navigateByUrl(`/${this.franchiseId}/menu`);
      });
    }
      
      
      );
    
  }

  public openDetails(){


        let header = this.translationService.translate("CONTACT");
        //let icon = "../../../assets/images/items/phone.png";
        
        const phoneNumber = this.currentBranch.BranchPhone;
        const address = this.currentBranch.Address;
        const matDialogRef = this.matDialog.open(MessagePopupComponent, {
          data: {
            header,
            //icon,
            isContact: true,
            phoneNumber,
            address,
            withoutTimeout: true
          },
          minWidth: '345px',
          disableClose: true,
          panelClass: 'custom-mat-dialog-popup'
        });
  
        matDialogRef.afterClosed().subscribe((result) => {
          /*if (callback) {
            //this.isFirst=false;
            callback(result);
  
          }*/
        });
  }

  public openDesc() {

    let header = this.translationService.translate("ABOUT");
    //let icon = "../../../assets/images/items/phone.png";
    
    //const phoneNumber = this.currentBranch.BranchPhone;
    //const address = this.currentBranch.Address;
    const desc = this.appStorageService.franchise.Description;
    const matDialogRef = this.matDialog.open(MessagePopupComponent, {
      data: {
        header,
        desc,
        //icon,
        //isContact: true,
        //phoneNumber,
        //address,
        isAbout: true,
        withoutTimeout: true
      },
      minWidth: '345px',
      disableClose: true,
      panelClass: 'custom-mat-dialog-popup'
    });

    matDialogRef.afterClosed().subscribe((result) => {
      /*if (callback) {
        //this.isFirst=false;
        callback(result);

      }*/
    });

  }

  /*public loadSignInAndCoupons() {
    this.loadSignInForm((result) => {
      if (result.isSignedIn)
        this.verifyToken();

    });
  }*/

  public doSomething() {
    localStorage.removeItem(window.location.hash);
    this.appStorageService.inLinks = true;
    this.inLinks = true;
    document.getElementById("mySidebar").style.display = "none";
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('sidebar-show');
  }

  public goHome(){
    localStorage.removeItem(window.location.hash);
    this.router.navigate([`/${this.franchiseId}/home`]);
  }


  public loadSignInForm(callback?) {
    let position: any;
    if(this.isMobileMode()){
      position = {top: '5vh'};
    }
    else{
       position = {} 
    }
    const matDialogRef = this.matDialog.open(DialogSignInComponent, {
      data: {
        isFirst: true,
      },
      width: '40%',
      maxWidth: '518px',
      minWidth: '346px',
      position: position,
      panelClass: ['padding-small-container', 'custom-mat-dialog-mobile'],
      disableClose: false,
    });
    matDialogRef.componentInstance.isSignLoaded
      .subscribe((result) => {
        this.isLoaded.isSignInLoaded = result;
        console.log("11");
      });
    matDialogRef.componentInstance.signInCompleted
      .subscribe((result) => {
        //this.loadOrderUserDataToUser(this.order);
        this.isSignedUser = result;
        console.log(" matDialogRef.componentInstance.signInCompleted");
        if (this.isSignedUser) {
          this.verifyToken();
          //this.completeOrder(true);
         // this.checkDiscount();
          
        } else if(AppConfig.configSettings.cancelPhoneVerification) this.verifyToken();
      });
    matDialogRef.afterClosed().subscribe((result) => {
    if(result){
      if (callback) {
        callback(result);

      }
    }

    else{
      //this.openCustomerClub();
    }
    });
  };


  ngAfterViewInit(): void {

    this.checkOrderResultHeight();
    
  }

  ngAfterViewChecked(): void {
     }

  logo(event) {
   /* if (this.doesFileExist(AppConfig.settings.logo)) {
      event.target.src = AppConfig.settings.logo;
    }  else {
      event.target.style.display = "none";
    }*/
   
    const img = event.target as HTMLImageElement;

    // If we already tried the logo → remove the image entirely
    if (img.src.includes(AppConfig.settings.logo)) {
      img.style.display = 'none';
      return;
    }

    // Try logo fallback
    img.src = AppConfig.settings.logo;
   
  }

  private doesFileExist(urlToFile): boolean {
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', urlToFile, false);
    xhr.send();
    if (xhr.status == 404) {
      return false;
    } else {
      return true;
    }
  }


  moveTo(index) {
    this.ds.moveTo(index);
  }

  onSectionChange(sectionId: string) {
    this.currentSection = sectionId;
    // selectCategory(this.categories.filter, true, false);
  }

  scrollToMenu(section) {
    const menuItem = document.getElementById('nav-' + section);
    if (menuItem && this.mobileMenuContainer) {
      const container = this.mobileMenuContainer.nativeElement;
      const menuItemRect = menuItem.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const scrollOffset = menuItemRect.left - containerRect.left - (containerRect.width - menuItemRect.width) / 2;
      container.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    }
       
  }
  scrollTo(section) {
  /*  const el = document.getElementById('nav-' + section);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }*/

    const element = document.getElementById('cat' + section);

    const mySec = document.getElementById('cat11' + section).getElementsByClassName("my-items");

    for (let index = 0; index < mySec.length; index++) {
      mySec[index].classList.add('animate__animated', 'animate__zoomIn');
      setTimeout(() => {
        mySec[index].classList.remove('animate__animated', 'animate__zoomIn');    
       }, 2000);
    }



    var topOffset: number;
    if (this.isMobileMode()) {
      if (this.isDigitalMenu()) {
        topOffset = 100;//128;
      } else if (this.isAppDisplayMode()) {
        topOffset = 120;
      } else {
        topOffset = 145;//158;//215
      }

    } else {
      topOffset = 120;
    }

    const y = element.getBoundingClientRect().top + window.pageYOffset - topOffset;
    //document.querySelector('#cat' + section).scrollIntoView();
    window.scrollTo({ top: y, behavior: 'smooth' });
   /* const el = document.getElementById('nav-' + section);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }*/
  }



  public getColor() { return this.colors.menuColor != 'white' ? 'white' : 'black'; }

  private checkSelectionItem(index) {

    setTimeout(() => {
      switch (index) {
        case 0: {
          if (this.isShowedPizzaInMenu) {
            this.selectCategory(undefined, false, false, false);
          } else if (this.isShowedComboInMenu) {
            this.selectCategory(undefined, false, true, false);
          } else {
            const currentIndex = this.isShowedComboInMenu && this.isShowedPizzaInMenu ? index - 2 :
              (this.isShowedComboInMenu || this.isShowedPizzaInMenu) ? index - 1 : index;
            this.selectCategory(this.categories[currentIndex], true, false, false);
          }
          break;
        }
        case 1: {
          if (this.isShowedPizzaInMenu && this.isShowedComboInMenu) {
            this.selectCategory(undefined, false, true, false);
          } else {
            const currentIndex = this.isShowedPizzaInMenu || this.isShowedComboInMenu ? index - 1 : index;
            this.selectCategory(this.categories[currentIndex], true, false, false);
          }
          break;
        }
        default: {
          const currentIndex = this.isShowedComboInMenu && this.isShowedPizzaInMenu ? index - 2 :
            (this.isShowedComboInMenu || this.isShowedPizzaInMenu) ? index - 1 : index;
          this.selectCategory(this.categories[currentIndex], true, false, false);
        }
      }
    });

  }

  @HostListener('window:scroll', ['$event'])
  scrollHandler(event) {

  }

  public autoPlayCarousel() {
    clearInterval(this.instanceInterval);
    this.timeOutInterval = setTimeout(() => {
      clearTimeout(this.timeOutInterval);
      this.instanceInterval = setInterval(() => {
        if (!this.isMobileMode()) {
          const slickModal: any = this.carousel;
          slickModal.slickNext();
          this.index++;
          if (slickModal.slides && this.index === slickModal.slides.length) {
            this.autoPlayCarouselReverse();
          }
        }
      }, this.interval);
    }, this.timeOut);
  }

  public autoPlayCarouselReverse() {
    clearInterval(this.instanceInterval);
    this.timeOutInterval = setTimeout(() => {
      clearTimeout(this.timeOutInterval);
      this.instanceInterval = setInterval(() => {
        if (!this.isMobileMode()) {
          const slickModal: any = this.carousel;
          slickModal.slickPrev();
          this.index--;
          if (slickModal.slides && this.index === this.slideConfig.slidesToShow) {
            this.autoPlayCarousel();
          }
        }
      }, this.interval);
    }, this.timeOut);
  }

  public stopAutoPlayCarousel() {
    clearInterval(this.instanceInterval);
    clearTimeout(this.timeOutInterval);
    this.index = this.slideConfig.slidesToShow;
  }

  public checkedUserSigning(isSignedUser?) {
    this.isLoaded.isDiscountLoaded = true;
    this.isSignedUser = !!isSignedUser;
  }

  public checkAvailabilityDiscount() {
    //console.log(" this.discount", this.discount);
    // console.log("this.order.IsDiscount",this.order.IsDiscount);
      if( this.discount && this.discount.minSum != null && this.discount.minSum != undefined) {
       return this.discount && (this.discount.sum > 0) && (this.discount.active || this.discount.alwaysActive);
   }
     return false;
   }

  public completeSignIn(result) {
    this.isSignedUser = result || !!this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.configService.franchiseId);
    this.loadDiscountAndScratchCoupons();
  }

  public checkSigning(callback?) {
    //this.isSignedUser = !!result;
    this.isSignedUser = !!this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.franchiseId);
    if (this.isSignedUser) {
      this.verifyToken();
    } 
    else {
      this.menuService.getDiscount(this.order.BranchId, undefined).subscribe((result) => {
        if (result) {

          this.discount = result;
          if (this.discount.active)
            this.displayDiscount(callback);
          else {
            if (!this.isSignedUser  && !AppConfig.configSettings.dontDisplayPhonePopup) { // && this.appStorageService.franchise.UseMembersClub
              console.log("continue here 12 - if not signed and franchise dontDisplayPhonePopup");
              this.loadSignInForm((result) => {
               // if (result.isSignedIn)
                 // this.verifyToken();
              });

            }

          }

        }

        this.isLoaded.isDiscountLoaded = true;
      }, (error) => {
        this.isLoaded.isDiscountLoaded = true;
      });
     
      console.log("else");
      //this.checkedUserSigning();


    }
  }

  public checkLoading() {
    return this.isLoaded.isDiscountLoaded && this.isLoaded.isSignIn;
  }

  
  openNav() {
    document.getElementById("mySidebar").style.width = "350px";
    document.getElementById("mySidebar").style.display = "flex";
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('sidebar-show');
  }

  public checkDiscount(extraActions?) {
    if (this.isSignedUser) {
      const token = this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.configService.franchiseId);
      if (token) {
        this.isLoaded.isDiscountLoaded = false;
        this.signInOutService.verifyToken(token).subscribe((response) => {
          this.isLoaded.isDiscountLoaded = true;
          const result = response ? !!response.user : !!response;
          if (result) {
            this.user = response.user;
             
            this.isLoaded.isDiscountLoaded = false;
             
            this.menuService.getAllDiscounts(this.order.BranchId, this.user && this.user.Id ? this.user.Id : undefined).subscribe((result) => {
              if (result) {
                if (result.cupon && (result.cupon.active || result.cupon.alwaysActive)) {
                  if (result.firstTimeCupon && result.firstTimeCupon.active
                    && result.firstTimeCupon.sum > result.cupon.sum) {
                    this.discount = result.firstTimeCupon;
                    this.discount.name = "הטבת התקנה ( " + result.firstTimeCupon.name + " )";
                    this.appStorageService.franchiseDiscount = this.discount;

                  } else {
                    this.discount = result.cupon;
                    this.appStorageService.franchiseDiscount = this.discount;
                  }
                } else if (result.firstTimeCupon && result.firstTimeCupon.active) {
                  this.discount = result.firstTimeCupon;
                  this.discount.name = "הטבת התקנה ( " + result.firstTimeCupon.name + " )";
                  this.appStorageService.franchiseDiscount = this.discount;
                }
                // this.discount = result;
              }
              this.isLoaded.isDiscountLoaded = true;
              if (extraActions) {
                extraActions();
              }
            }, (error) => {
              this.isLoaded.isDiscountLoaded = true;
              // this.messageService.displayServerErrorMessage();
            });
          } else {
            if (extraActions) {
              extraActions();
            }
          }
        }, (error) => {
          this.isLoaded.isDiscountLoaded = true;
          // this.messageService.displayServerErrorMessage();
        });
      }


    } else {
      if (extraActions) {
        extraActions();
      }
    }
  }

  public isMobileBrowser() {
    return this.browserIdentificatorService.isMobile.Android() ||
      this.browserIdentificatorService.isMobile.Windows() ||
      this.browserIdentificatorService.isMobile.iOS();
  }

  public selectCategory(category, isNotPizza, isCombo, includedScroll = true) {
    this.notCheckScrolling = true;
    const selectCategoryHandler = () => {
      this.isNotPizza = !!isNotPizza;
      if (isNotPizza) {
        this.currentCategory = category;
        this.isCombo = false;
      } else {
        this.currentCategory = new CategoryAppAdvancedModel();
        this.isCombo = !!isCombo;
      }
    }
    this.stopAutoPlayCarousel();
    selectCategoryHandler();


    if (includedScroll) {

      setIdByQuerySelector('.ng-scroll-view.custom-view-items', 'id', 'items-container-list');
      this.scrollToParticularOptionCategory(category, isNotPizza, isCombo, () => {
        // setTimeout(() => {
        selectCategoryHandler();
        // }, 210);
      });
    } else {
      selectCategoryHandler();
      this.notCheckScrolling = false;
    }

    if (this.isShowedComboInMenu) {
      this.currentSection = "COMBO";
    } else if (this.isShowedPizzaInMenu) {
      this.currentSection = "PIZZA";
    } else {
      this.currentSection = this.currentCategory.Id.toString();
    }
  }

  // W13-search: find category whose name contains the query and scroll to it
  public onSearchInput(value: string): void {
    const q = (value || '').trim().toLowerCase();
    this.searchQuery = q;
    console.log('[W13] onSearchInput', q, 'categories:', this.categories ? this.categories.length : 'NONE');
    if (!q) { return; }
    if (!this.categories || !this.categories.length) { return; }
    const match = this.categories.find((c: any) => c && c.Name && String(c.Name).toLowerCase().indexOf(q) !== -1);
    console.log('[W13] match:', match ? { Id: match.Id, Name: match.Name } : 'NO_MATCH');
    if (match) {
      try { this.scrollTo(match.Id); console.log('[W13] scrollTo called'); } catch (e) { console.log('[W13] scrollTo error', e); }
    }
  }

  @HostListener('scroll', ['$event'])
  scrollItems(event) {
    // function isHidden(el) {
    //   return (el.offsetParent === null)
    // }
  }

  @HostListener('document:wheel', ['$event.target'])
  public onWheel(targetElement) {
    // console.log(targetElement.classList)

  }

  @HostListener('window:scroll', ['$event'])
  public windowScrolled($event: Event) {
    this.isSticky = window.pageYOffset >= 1;
    //console.log("window.pageYOffset >= 1");
    //console.log("window.pageYOffset",window.pageYOffset);
    //console.log("this.currentCat", this.currentCategory);
    //console.log("tihs.currentSection", this.currentSection);

    //const mySec = document.getElementById('cat11' + this.currentSection).getElementsByClassName("my-items");
    //console.log("mySec", mySec);

    /*for (let index = 0; index < mySec.length; index++) {
      mySec[index].classList.add('animate__animated', 'animate__zoomIn');
      setTimeout(() => {
        mySec[index].classList.remove('animate__animated', 'animate__zoomIn');    
       }, 2000);
      
    }*/
    

    //console.log( "window.pageYOffset",window.pageYOffset);
    //console.log( "isSticky",this.isSticky);
    //console.log("scrolled")
  }

  private scrollToParticularOptionCategory(category, isNotPizza, isCombo, callback?) {
    console.log("scrollToParticularOptionCategory");
    setIdByQuerySelector('.ng-scroll-view.custom-view-items', 'id', 'items-container-list');
    let itemToFind = '';
    if (isNotPizza) {
      // const findItem = document.getElementById();
      // if (findItem) {
      //   findItem.scrollIntoView({behavior: "smooth", block: "center"});
      // }
      itemToFind = 'category-' + (this.categories.indexOf(category) + 1);
    } else {
      if (isCombo) {
        itemToFind = 'combo';
      } else {
        itemToFind = 'pizza';
      }
    }
    //   const findItem = document.getElementById(itemToFind);
    //   if (findItem) {
    //     findItem.scrollIntoView({behavior: "smooth", block: "nearest"});
    //   }
    // }
    this.notCheckScrolling = true;
    scrollingToElement('items-container-list', itemToFind, 150, () => {
      this.notCheckScrolling = false;
      if (callback) {
        callback();
      }
    });
  }

  public preventAction(event) {
    //  event.preventDefault();
    event.stopPropagation();
  }

  public addAmount(item, isPizza, event) {
    event.stopPropagation();
    if (!item.Amount) {
      item.Amount = 1;
    }
    item.Amount++;
  }

  public subAmount(item, isPizza, event) {
    event.stopPropagation();
    if (!item.Amount) {
      item.Amount = 1;
    }
    if (item.Amount > 1) {
      item.Amount--;
    }
  }

  public resetItem(item) {
    if (item) {
      item.Quantity -=item.Amount;
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
      if (this.currentBranch.UseInventory){
        this.categories.forEach((cat)=> {
          cat.Items.forEach((i)=> {
            if (i.CatalogNumber == item.CatalogNumber)
              i.Quantity = item.Quantity;
            if (i.ItemGroups) {
              i.ItemGroups.forEach((grp) => {
                grp.GroupItems.forEach((gi) => {
                 
                  if (gi.CatalogNumber == item.CatalogNumber)            
                    gi.Quantity = item.Quantity;
                })           
              });
            }    
            
          });
        });
        this.order.OrderItems.forEach((orderItem)=> {        
          if (orderItem.Item.CatalogNumber == item.CatalogNumber)
            orderItem.Item.Quantity = item.Quantity;
          if (orderItem.Items) {
            orderItem.Items.forEach((gi) => {
              if (gi.Item.CatalogNumber == item.CatalogNumber)    {
gi.Item.Quantity = item.Quantity;
              }        
                    
            });         
              
          }     
          
        });
      }
      
    }
  }

  public trimEmptySpace(text: string) {

    return text ? text.trim() : text;
  }

  private prepareItemsToDisplayInMenu() {

    console.log("prepareItemsToDisplayInMenu()");
    if (this.order) {
      // ITEM SHORT INFO//
      this.categories.forEach(category => {


       // console.log("category",category);

        category.Items.forEach(item => {
          if(category.Name=="שידרוגים"){
            item.IsUpgrade = true;
          }
          if(item.IsCombo && this.appStorageService.addNameOnce){
            item.Name += '\n' +this.translationService.translate('COMBO_SALE');
          }
          if(item.ItemGroups && item.ItemGroups.length>0){
            item.HasItemGroups = true;
          }

          item.ShortInfo = "";
          //console.log("item.Information",item.Information);
          //console.log("item.Information.len",item.Information.length);
          if (item.Information && item.Information.length > 0) {
            //console.log("item.Information", item.Information, item.Information.length);
            var txtArr = item.Information.split(' ');
            //console.log("txtArr", txtArr, txtArr.length);

            if (txtArr.length > 6) {
              for (let index = 0; index < 7; index++) {
                if (txtArr[index])
                  item.ShortInfo = item.ShortInfo + txtArr[index] + " ";
              }
              item.ShortInfo += "..."
            }
            else {
              item.ShortInfo = item.Information;
            }
          }

          //console.log("itemShortInfo", item.ShortInfo, item.ShortInfo.length);
        });
      });

      this.appStorageService.addNameOnce = false;

      this.combos.forEach(item => {
        item.ShortInfo = "";
        item.IsComboFull = true;
        //console.log("item.Description", item.Description);
        //console.log("item.Description.len", item.Description.length);
        if (item.Description && item.Description.length > 0) {
          //console.log("item.Description", item.Description, item.Description.length);
          var txtArr = item.Description.split(' ');
          //console.log("txtArr", txtArr, txtArr.length);

          if (txtArr.length > 6) {
            for (let index = 0; index < 7; index++) {
              if (txtArr[index])
                item.ShortInfo = item.ShortInfo + txtArr[index] + " ";
              //console.log("item.ShortInfo", item.ShortInfo);
            }
            item.ShortInfo += "..."
          }
          else {
            item.ShortInfo = item.Description;
          }
        }

        //console.log("itemShortInfo", item.ShortInfo, item.ShortInfo.length);
      });

      this.pizzas.forEach(item => {
        item.ShortInfo = "";
       // console.log("item.Description", item.Information);
       // console.log("item.Description.len", item.Information.length);
        if (item.Information && item.Information.length > 0) {
          var txtArr = item.Information.split(' ');

          if (txtArr.length > 6) {
            for (let index = 0; index < 7; index++) {
              if (txtArr[index])
                item.ShortInfo = item.ShortInfo + txtArr[index] + " ";
            }
            item.ShortInfo += "..."
          }
          else {
            item.ShortInfo = item.Information;
            if(item.ShortInfo == 'undefined' || item.ShortInfo == undefined){
              item.ShortInfo = '';
            }
          }
        }

        //console.log("itemShortInfo", item.ShortInfo, item.ShortInfo.length);
      });

      this.categories.forEach((category) => {
       // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!",category.Name, this.order)
        if (this.order.IsDelivery){
          category.Items = category.Items.filter((item) => {
            return item.IsDelivery;
          });
         // category.Pizzas = category.Pizzas.filter((item) => {
          //  return item.IsDelivery;
         // });
        } else if (this.order.IsTakeAway) {
          category.Items = category.Items.filter((item) => {
            return item.IsTakeAway;
          });
        } else if (this.order.IsSit) {
          category.Items = category.Items.filter((item) => {
            return item.IsSit;
          });
        }
        else if (this.order.IsDigitalMenu) {
          category.Items = category.Items.filter((item) => {
            return item.IsDigitalMenu;
          });
        }
        else if (this.configService.isTVMenu) {
          category.Items = category.Items.filter((item) => {
            return item.IsTvMenu;
          });
        }
       });
    }
  }

  private selectCategoryScroll(up?) {
    if (this.isNotPizza) {
      if (up) {
        const nextCategory = this.categories[this.categories.indexOf(this.currentCategory) + 1];
        if (nextCategory) {
          this.selectCategory(nextCategory, true, false);
        }
      } else {
        const nextCategory = this.categories[this.categories.indexOf(this.currentCategory) - 1];
        if (nextCategory) {
          this.selectCategory(nextCategory, true, false);
        } else {
          if (this.isShowedComboInMenu) {
            this.selectCategory(undefined, false, true);
          } else if (this.isShowedPizzaInMenu) {
            this.selectCategory(undefined, false, false);
          }
        }
      }
    } else {
      console.log("else!!!");
      if (up) {
        if (!this.isCombo) {
          if (this.isShowedComboInMenu) {
            this.selectCategory(undefined, false, true)
          } else if (this.categories && this.categories.length > 0) {
            this.selectCategory(this.categories[0], true, false);
          }
        } else if (this.isCombo) {
          if (this.categories && this.categories.length > 0) {
            this.selectCategory(this.categories[0], true, false);
          }
        }
      } else {
        if (this.isCombo) {
          if (this.isShowedPizzaInMenu) {
            this.selectCategory(undefined, false, false);
          }
        }
      }
    }
  }

  private scrollToSelectedCategory() {
    console.log("scrollToSelectedCategory");
    setTimeout(() => {
      scrollToView(".current-category-item");
    }, 2000)
  }

  public scrollCategoryDown() {
    scrollByCount('menu-categories', true, 50);
    const displayedView = isScrolledIntoView('.current-category-item', '#menu-categories');
    if (!displayedView) {
      this.selectCategoryScroll(true);
    }
  }

  public scrollCategoryUp() {
    scrollByCount('menu-categories', false, 50);
    const displayedView = isScrolledIntoView('.current-category-item', '#menu-categories');
    if (!displayedView) {
      this.selectCategoryScroll();
    }
  }

  private defaultCategoryStartSelection() {
    let categoryCount = 0;
    this.prepareCategoryOrder();
    if (!this.isShowedPizzaInMenu) {
      if (this.categories && this.categories.length > 0) {
        categoryCount = this.categories.length;
        // if (this.lang === this.directionLanguage() && this.isMobileMode()) {
        // this.selectCategory(this.categories[this.categories.length - 1], true, false, false);
        //} else {
        this.selectCategory(this.categories[0], true, false, false);
        //this.currentSection = this.categories[0].Id.toString();
        //}

      }
    } else {
      categoryCount = this.categories.length + 1;
      this.selectCategory(undefined, false, false, false); // For pizza
    }
    if (this.isShowedComboInMenu) {
      categoryCount++;
    }
    if (this.lang === this.directionLanguage()) {
      setTimeout(() => {
        if (this.ds) {
          if (this.isMobileMode()) {
            this.ds.moveTo(categoryCount - 1);
          }
        }
      });
    }
  }
public displayCmShopCategory: boolean = false;
public cmShopCategory:any;
  private loadMenu() {

    console.log("loadMenu!!!!!!!!")
    if (this.appStorageService.branch) {
      this.currentBranch = this.appStorageService.branch;
    }
    if (this.appStorageService.franchise) {
      this.startingPage = this.appStorageService.startingPage;
    }
    // if (this.appStorageService.categories) {
    let countOfItems = 0;

    this.clubMemberCategories = this.appStorageService.clubMembershipCategories;
    this.categories = this.appStorageService.categories || [];
    this.pizzaToppings = this.appStorageService.pizzaToppings || [];
    this.pizzas = this.appStorageService.pizzas || [];


    this.combos = this.appStorageService.combos || [];

    this.isShowedPizzaInMenu = !!this.pizzas && (this.pizzas && this.pizzas.length > 0);
    if (this.isShowedPizzaInMenu) {
      this.pizzaCategory = AppConfig.settings.pizzaCategory;
      this.pizzaAppCategory = AppConfig.settings.pizzaAppCategory;
      countOfItems++;
    }

    this.isShowedComboInMenu = !!this.combos && (this.combos && this.combos.length > 0);

    if (this.isShowedComboInMenu) {
      this.comboCategory = AppConfig.settings.comboCategory;
      this.comboAppCategory = AppConfig.settings.comboAppCategory;
      // console.log("comboAppCategory",this.comboAppCategory);
      countOfItems++;
    }

    countOfItems += this.categories.length;

    if (countOfItems > 4) {
      this.displayArrowForMenu = true;
    } else {
      this.displayArrowForMenu = false;
    }
   /* if (this.appStorageService.showClubMember && 
      this.user.IsClubMember && 
      this.appStorageService.franchise.UseMembersClub && 
      !AppConfig.configSettings.cancelPhoneVerification) {
        if (this.clubMemberCategories && this.clubMemberCategories.length > 0) {
          this.cmShopCategory = this.clubMemberCategories.find
          (it => it.Name === "CM_SHOP");
          if (this.cmShopCategory?.Items?.length > 0)
            this.displayCmShopCategory = true;
        }
      }*/

    this.initializeAmountOfItems();
    this.prepareItemsToDisplayInMenu();

    this.defaultCategoryStartSelection();
    this.getStartingCategory(this.startingPage);
    this.scrollToSelectedCategory();

    //this.checkOrderResultHeight();
    for (let i = this.categories.length - 1; i >= 0; i--) {
    }
  }

  private prepareCategoryOrder() {
    //(it => it.Name === this.translationService.translate('PIZZA_ADDITIONS'))[0]);
    console.log("prepareCategoryOrder()");
    
    const additionalItemsForPizzaCategory = this.categories.find
      (it => it.Name === this.translationService.translate('PIZZA_ADDITIONS'));
    if (additionalItemsForPizzaCategory
      && additionalItemsForPizzaCategory.Items
      && additionalItemsForPizzaCategory.Items.length > 0) {
      this.pizzaAdditionItems = additionalItemsForPizzaCategory.Items;
     // this.categories = this.categories.filter
       // ((it => it.Items && it.Items.length > 0 && it.Name != this.translationService.translate('PIZZA_ADDITIONS')));
    
        this.categories = this.categories.filter(it => it.Name != this.translationService.translate('PIZZA_ADDITIONS'));
   
      }
     
      const upgradesCategory = this.categories.find
        (it => it.Name === this.translationService.translate('UPGRADE_CATEGORY'));
      if (upgradesCategory
        && upgradesCategory.Items
        && upgradesCategory.Items.length > 0) {
        this.upgradeItems = upgradesCategory.Items;
        this.upgradeItems.forEach(item => {
            item.Amount = 1;
        });
       // this.categories = this.categories.filter
        //  (it => it.Items && it.Items.length > 0 && it.Name != this.translationService.translate('UPGRADE_CATEGORY'));
          this.categories = this.categories.filter(it => it.Name != this.translationService.translate('UPGRADE_CATEGORY'));
   
        }
    //});
    if (AppConfig.configSettings.bonusCategory && AppConfig.configSettings.bonusCategory != '') {
      const bonusItemsCategory = this.categories.find
        (it => it.Name === AppConfig.configSettings.bonusCategory);
      if (bonusItemsCategory && bonusItemsCategory.Items
        && bonusItemsCategory.Items.length > 0) {
        this.bonusItems = bonusItemsCategory.Items;
       // this.categories = this.categories.filter
        //  (it => it.Items && it.Items.length > 0 && it.Name != AppConfig.configSettings.bonusCategory);
          this.categories = this.categories.filter(it => it.Name != AppConfig.configSettings.bonusCategory);
   

      }


    }


    this.categories = this.categories.filter
    (it => it.Name != this.translationService.translate('ITEMS_FOR_COMBOS') &&
           it.Name != this.translationService.translate('UPSALE') &&
           it.Name != this.translationService.translate('CM_SHOP') &&
           it.Name != this.translationService.translate('CM_JOIN') &&
           it.Name != this.translationService.translate('CM_BIRTHDAY') &&
           it.Name != this.translationService.translate('CM_ANNIVERSARY'));

   /* this.categories = this.categories.filter
    (it => it.Name != this.translationService.translate('UPSALE'));
    this.categories = this.categories.filter
    (it => it.Name != this.translationService.translate('CM_SHOP'));
    this.categories = this.categories.filter
    (it => it.Name != this.translationService.translate('CM_JOIN'));
    this.categories = this.categories.filter
    (it => it.Name != this.translationService.translate('CM_BIRTHDAY'));
    this.categories = this.categories.filter
    (it => it.Name != this.translationService.translate('CM_ANNIVERSARY'));
*/
    this.categories = this.categories.filter(it => (it.Items && it.Items.length > 0) || (it.Pizzas.length > 0));


    // if (this.lang === this.directionLanguage() && this.isMobileMode()) {
    //  const categories = [];
    //  for (let i = this.categories.length - 1; i >= 0; i--) {
    //   if (this.categories[i].Items && this.categories[i].Items.length > 0) {
    //      categories.push(this.categories[i]);
    //   }
    //  }
    //  this.categories = categories;
    //} else {
    //  this.categories = this.categories.filter(it => it.Items && it.Items.length > 0);
    //}
  }

  public isEnoughPoints(item){

     if(this.appStorageService.appUser.MemberPoints >= item.Price) {
      const sumOfClubMemberItems = this.order.OrderItems
      .filter(item => item.IsClubMemberItem)
      .reduce((acc, item) => acc + item.Price, 0);
      if(this.appStorageService.appUser.MemberPoints >= sumOfClubMemberItems + item.Price)
      return true;
     }
       
      else return false;

  }

  private prepareItemForOrder(item : ItemAppAdvancedModel) {

    const orderItem = new OrderItemAppModel();
    orderItem.IsUpgrade = item.IsUpgrade;
    if(item.IsUpgrade){
      orderItem.Amount = 1;
    }
    else{
      orderItem.Amount = item.Amount;
    }
    orderItem.ItemId = item.Id;
    orderItem.IsClubMemberItem = item.IsClubMemberItem;
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
   
    this.dataLayerItems=[];
    for (let i = 0; i < orderItem.Amount; i++) {
      var dataLayerItem={
        "item_id": orderItem.ItemId,
        "item_name":orderItem.Name,
        "price":this.itemPrice(orderItem,false)/orderItem.Amount,
        "quantity" :orderItem.Amount
      }
     
      this.dataLayerItems.push(dataLayerItem);
    }
  
    window['dataLayer'].push({
      'event': 'add_to_cart',
      'items': this.dataLayerItems,
      'currency':'ILS',
      'value': this.itemPrice(orderItem,false),
      'contents':[{'id':orderItem.ItemId, 'quantity':orderItem.Amount}],
      'content_type': 'product_group',
      'content_ids': [orderItem.ItemId]
   });


    return orderItem;
  }

  private prepareSubItemForOrder(item : ItemAppAdvancedModel) {

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
    orderItem.SpecialRequests = item.SpecialRequests;
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
      if (item.GeneralGarnishGroups) {
        for (let i = 0; i < item.GeneralGarnishGroups.length; i++) {
          if (item.GeneralGarnishGroups[i].Garnishes && item.GeneralGarnishGroups[i].Garnishes[0]
            && item.GeneralGarnishGroups[i].Garnishes[0].GarnishGroupId === +key && item.GeneralGarnishGroups[i].FreeCount) {
            garnishesGroup[key].sort((garnish1, garnish2) => {
              return garnish1.Price - garnish2.Price;
            }).map((garnish, index) => {
              if (index < item.GeneralGarnishGroups[i].FreeCount) {
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
   // orderItem.SpecialRequests = '';
   orderItem.SpecialRequests = item.SpecialRequests;
    orderItem.ComboItemId = 0;
    orderItem.IsScratchCoupon = false;
    orderItem.ScratchCouponId = 0;
    orderItem.Price = item.Price;
    orderItem.ImageUrl = item.ImageUrl;
    orderItem.Name = item.Name;
   
  /*  this.dataLayerItems=[];
    for (let i = 0; i < orderItem.Amount; i++) {
      var dataLayerItem={
        "item_id": orderItem.ItemId,
        "item_name":orderItem.Name,
        "price":this.itemPrice(orderItem,false)/orderItem.Amount
      }
     
      this.dataLayerItems.push(dataLayerItem);
    }
  
    window['dataLayer'].push({
      'event': 'add_to_cart',
      'items': this.dataLayerItems,
      'currency':'ILS',
      'value': this.itemPrice(orderItem,false)
   });*/


    return orderItem;
  }

  private prepareItemWithItemGroupsForOrder(item : ItemAppAdvancedModel, items: any[]) {
    items =  items.filter(item => item.Name);
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
     // orderSubItem.SpecialRequests = selectedItem.specialRequests;
      orderSubItem.ItemName = selectedItem.ItemName;
      orderSubItem.Price = selectedItem.Price;
      orderSubItem.IsItemsGroupItemKeptPrice = true;
     // orderSubItem.Amount = 1;
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
   
    this.dataLayerItems=[];
    for (let i = 0; i < orderItem.Amount; i++) {
      var dataLayerItem={
        "item_id": orderItem.ItemId,
        "item_name":orderItem.Name,
        "price":this.itemPrice(orderItem,false)/orderItem.Amount, 
        'quantity':orderItem.Amount
      }
     
      this.dataLayerItems.push(dataLayerItem);
    }
  
    window['dataLayer'].push({
      'event': 'add_to_cart',
      'items': this.dataLayerItems,
      'currency':'ILS',
      'value': this.itemPrice(orderItem,false),
      'contents':[{'id':orderItem.ItemId, 'quantity':orderItem.Amount}],
      'content_type': 'product_group',
      'content_ids': [orderItem.ItemId]
   });


    return orderItem;
  }

  private prepareEditedItemForOrder(item: ItemAppAdvancedModel) {
    // console.log("prepareItemForOrder", item)
    const orderItem = new OrderItemAppModel();
    orderItem.Amount = item.Amount;
    orderItem.ItemId = item.Id;
    orderItem.IsClubMemberItem = item.IsClubMemberItem;
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

  private prepareComboForOrder(item, comboItem) {


    const orderItem = new OrderComboAppModel();

    orderItem.Amount = item.Amount;
    orderItem.ComboId = item.Id;
    orderItem.Name = item.Name;
    orderItem.Price = item.Price;
    orderItem.ImageUrl = item.ImageUrl;
    orderItem.IsScratchCoupon = false;
    orderItem.ScratchCouponId = 0;

    // Check if some combo has extra pric
    orderItem.Items = [];

    if (item.SelectedItems) {

      const itemComboObj = {};

      if (item.ItemCombos) {
        item.ItemCombos.forEach((cmb) => {
          itemComboObj[cmb.Id] = cmb;
        });
      }

      item.SelectedItems.forEach((combo) => {
        const orderComboItem = new OrderItemAppModel();
        orderComboItem.ItemId = combo.Id;
        orderComboItem.ComboItemId = combo.ComboItemId;
        orderComboItem.IsScratchCoupon = false;
        orderComboItem.ScratchCouponId = 0;
        orderComboItem.Name = combo.Name;
        orderComboItem.ImageUrl = combo.ImageUrl;
        orderComboItem.Amount = combo.Amount || 1;
        orderComboItem.Price = combo.Price;
        orderComboItem.SpecialRequests = combo.SpecialRequests;
        orderComboItem.IsItemNewCombo = combo.IsItemNewCombo;
        orderComboItem.ItemComboItemId = combo.ItemComboItemId;

        const garnishes = [];
        if (combo.SelectedGarnishes) {
          combo.SelectedGarnishes.forEach((garnish: GarnishAppAdvancedModel) => {
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
            if (combo.GarnishGroups && combo.GarnishGroups.length>0) {
              for (let i = 0; i < combo.GarnishGroups.length; i++) {
                if (combo.GarnishGroups[i].Garnishes && combo.GarnishGroups[i].Garnishes[0]
                  && combo.GarnishGroups[i].Garnishes[0].GarnishGroupId === +key && combo.GarnishGroups[i].FreeCount) {
                  garnishesGroup[key].sort((garnish1, garnish2) => {
                    return garnish2.Price - garnish1.Price;
                  }).map((garnish, index) => {
                    if (index < combo.GarnishGroups[i].FreeCount) {
                      garnish.Price = 0;
                    }
                  });
                }
              }
            }
            if (combo.GeneralGarnishGroups && combo.GeneralGarnishGroups.length>0  && (!combo.GarnishGroups || combo.GarnishGroups.length == 0)) {
              for (let i = 0; i < combo.GeneralGarnishGroups.length; i++) {
                if (combo.GeneralGarnishGroups[i].Garnishes && combo.GeneralGarnishGroups[i].Garnishes[0]
                  && combo.GeneralGarnishGroups[i].Garnishes[0].GarnishGroupId === +key && combo.GeneralGarnishGroups[i].FreeCount) {
                    console.log("free count");
                  garnishesGroup[key].sort((garnish1, garnish2) => {
                    return garnish2.Price - garnish1.Price;
                  }).map((garnish, index) => {
                    if (index < combo.GeneralGarnishGroups[i].FreeCount) {
                      garnish.Price = 0;
                    }
                  });
                }
              }
            }
          });

          const garnishesWithoutGroup = garnishes.filter((garnish) => garnish.GarnishGroupId === null);

          // check for garnishes with combo garnishMax
          const sortingGarnishes = garnishesWithoutGroup.sort((g1, g2) => {
            return +g2.Price - +g1.Price;
          });

          sortingGarnishes.forEach((garnish, index) => {
            if (itemComboObj[combo.ComboItemId] && index < +itemComboObj[combo.ComboItemId].MaxGarnishes) {
              garnish.Price = 0;
            }
          });

        }

        orderComboItem.Garnishes = garnishes;
        orderItem.Items.push(orderComboItem)

      });

    }

    orderItem.Pizzas = [];
    if (item.SelectedPizzas) {
      const itemSelectedPizzas = this.commonFunctionsService.deepCopy(item.SelectedPizzas);

      item.SelectedPizzas.forEach((selectedPizza, index) => {
        const newPizza = new OrderPizzaAppAdvancedModel();
        newPizza.Amount = selectedPizza.Amount || 1;
        newPizza.PizzaId = selectedPizza.Id;
        newPizza.ComboPizzaId = selectedPizza.ComboPizzaId;
        newPizza.PizzaComboPizzaId = selectedPizza.PizzaComboPizzaId;
        newPizza.Toppings = [];
        newPizza.SpecialRequests = selectedPizza.SpecialRequest;
        
        newPizza.Comment = selectedPizza.Comment;
        if(newPizza.Comment == 'undefined undefined ' || newPizza.SpecialRequests == 'undefined undefined ' || newPizza.Comment=='undefined' || newPizza.SpecialRequests == 'undefined' || newPizza.Comment == undefined || newPizza.SpecialRequests == undefined){
          newPizza.Comment = '';
          newPizza.SpecialRequests = '';
        }
        newPizza.IsScratchCoupon = false;
        newPizza.ScratchCouponId = 0;
        newPizza.Name = selectedPizza.Name;
        newPizza.ImageUrl = selectedPizza.ImageUrl;
        newPizza.FullPizza = this.commonFunctionsService.deepCopy(selectedPizza);
        if (selectedPizza.SelectedToppings) {

          const toppingsOrderedByPrice = selectedPizza.SelectedToppings.sort((pizzaTopping1, pizzaTopping2) => {
            return +pizzaTopping1.TotalPrice / pizzaTopping1.QuarterNums.length -
              +pizzaTopping2.TotalPrice / pizzaTopping2.QuarterNums.length
          });
          /*if (selectedPizza.ComboPizza && selectedPizza.ComboPizza.MaxToppings){

            selectedPizza.SelectedToppings.forEach(selTop => {
              if(selTop.ToppingGroupId == selectedPizza.ComboPizza.ToppingGroupId){
                selTop.TotalPrice = 0;
              }
              
            });

          }*/

          if (selectedPizza.ComboPizza && selectedPizza.ComboPizza.MaxToppings && (!selectedPizza.ComboPizza.ToppingGroupId || selectedPizza.ComboPizza.ToppingGroupId == null)) {

            if (selectedPizza.ComboPizza.ToppingGroupId && selectedPizza.ComboPizza.ToppingGroupId > 0) {
              let toppingsTotalCount = 0;

              selectedPizza.SelectedToppings.forEach((item, j) => {
                if (item.ToppingGroupId == selectedPizza.ComboPizza.ToppingGroupId) {
                  for (var quarter = 1; quarter <= toppingsOrderedByPrice[j].QuarterNums.length; quarter++) {
                    toppingsTotalCount += 0.25;

                    if (toppingsOrderedByPrice[j].quarterPrice == undefined) {
                      toppingsOrderedByPrice[j].quarterPrice =
                        toppingsOrderedByPrice[j].TotalPrice / toppingsOrderedByPrice[j].QuarterNums.length;
                    }
                    if (toppingsTotalCount <= selectedPizza.ComboPizza.MaxToppings) {
                      toppingsOrderedByPrice[j].TotalPrice -= toppingsOrderedByPrice[j].quarterPrice;
                    } else {

                    }
                  }
                }

              });
            } else {
              selectedPizza.SelectedToppings.sort((pizzaTopping1, pizzaTopping2) => {
                return +pizzaTopping1.TotalPrice / pizzaTopping1.QuarterNums.length -
                  +pizzaTopping2.TotalPrice / pizzaTopping2.QuarterNums.length;
              });

              let toppingsTotalCount = 0;

              selectedPizza.SelectedToppings.forEach((item, j) => {
                for (var quarter = 1; quarter <= toppingsOrderedByPrice[j].QuarterNums.length; quarter++) {
                  toppingsTotalCount += 0.25;
                  if (toppingsOrderedByPrice[j].quarterPrice == undefined) {
                    toppingsOrderedByPrice[j].quarterPrice =
                      toppingsOrderedByPrice[j].TotalPrice / toppingsOrderedByPrice[j].QuarterNums.length;
                  }
                  if (toppingsTotalCount <= selectedPizza.ComboPizza.MaxToppings) {
                    toppingsOrderedByPrice[j].TotalPrice -= toppingsOrderedByPrice[j].quarterPrice;
                  } else {

                  }
                }
              });
            }


          }

          newPizza.Toppings = selectedPizza.SelectedToppings.map((topping) => {
            const orderToppingPizza = new OrderPizzaToppingAppModel();
            orderToppingPizza.ToppingId = topping.ToppingId;
            orderToppingPizza.Quarter1 = topping.QuarterNums.indexOf(1) != -1;
            orderToppingPizza.Quarter2 = topping.QuarterNums.indexOf(2) != -1;
            orderToppingPizza.Quarter3 = topping.QuarterNums.indexOf(3) != -1;
            orderToppingPizza.Quarter4 = topping.QuarterNums.indexOf(4) != -1;
            orderToppingPizza.Price = topping.TotalPrice;
            orderToppingPizza.FullTopping = topping;
            return orderToppingPizza;
          });
        }
        const garnishes = [];
        if (selectedPizza.SelectedGarnishes) {
          selectedPizza.SelectedGarnishes.forEach((garnish: GarnishAppAdvancedModel) => {
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
    
        newPizza.Garnishes = garnishes;
        //console.log("prepareItemForOrder garnishes", garnishes)
        newPizza.FullPizza.SelectedGarnishes = garnishes;
        newPizza.SelectedGarnishes = garnishes;


        orderItem.Pizzas.push(newPizza);

      });

    }
    
    var dataLayerItem={
      "item_id": orderItem.ComboId,
      "item_name":orderItem.Name,
      "price":this.itemComboPrice(orderItem) , 
      'quantity':1
    }
    this.dataLayerItems=[];
    this.dataLayerItems.push(dataLayerItem);

    window['dataLayer'].push({
      'event': 'add_to_cart',
      'items': this.dataLayerItems,
      'currency':'ILS',
      'value': this.itemComboPrice(orderItem) ,
      'contents':[{'id':orderItem.ComboId, 'quantity':orderItem.Amount}],
      'content_type': 'product_group',
      'content_ids': [orderItem.ComboId]
   });

    return orderItem;

    
  }


  private addToCartComboItem(item, comboItem) {
    const myItem = this.commonFunctionsService.deepCopy(item);

    if(comboItem.HasItemGroups){
   /*   console.log("dont add to cart --> for loop on items and wrap as items and add to cart");

      //for loop on selected items after combo and wrap as items
      item.SelectedItems.forEach(selectedItem => {
        const orderItem = this.prepareItemForOrder(selectedItem);
          orderItem.SpecialRequests = selectedItem.specialRequests;
          orderItem.ItemName = selectedItem.ItemName;
          orderItem.Price = selectedItem.Price;
          orderItem.IsItemsGroupItemKeptPrice = true;
          orderItem.Amount = 1;
          orderItem.GroupItemId = selectedItem.GroupItemId;
          this.order.OrderItems.push(orderItem);
        
      });*/

    }
    else{
      const orderItem = this.prepareComboForOrder(item, comboItem);
      this.order.OrderCombos.push(orderItem);
      this.checkOrderResultHeight();
      this.orderService.recalculateSum();
      this.resetItem(item);
      this.loadSuccessAddingToCartMessage(false);
    }
    //this.order.OrderCombos.push(orderItem);
    //this.checkOrderResultHeight();
    //this.orderService.recalculateSum();

    // this.flicker();

  }

  

  private addToCartItemWithGarnishes(item, data?, callback?) {
    if (!this.isNotFilledAllRequiredGarnishesOfGarnishGroup(item)) {
      if (item.PizzaPrices) {
        this.myPrepare(item);
      }
      else {
        if (item.HasItemGroups){
          const orderItem = this.prepareItemWithItemGroupsForOrder(item, data.combo.SelectedItems);
          if (data && data.comments) {
            orderItem.SpecialRequests = data.comments || '';
          }
          this.order.OrderItems.push(orderItem);
          if(this.order.OrderItems.length>0){

            this.checkForCombo();
            }
          if(!this.isMobileMode()) this.checkOrderResultHeight();
        }
        else {
          const orderItem = this.prepareItemForOrder(item);
          if (data && data.comments) {
            orderItem.SpecialRequests = data.comments || '';
          }
          const index = this.getIndexIfNotHavingGarnishes(item);
          if (index >= 0) {
            const item = this.order.OrderItems[index];
            item.Amount += orderItem.Amount;
            this.checkForCombo();
            this.checkOrderResultHeight();
          } else {
            this.order.OrderItems.push(orderItem);
            if(this.order.OrderItems.length>0){
  
              this.checkForCombo();
              }
            if(!this.isMobileMode()) this.checkOrderResultHeight();
          }
        }
        
        this.orderService.recalculateSum();
        this.resetItem(item);
        if (item.Name == this.translationService.translate('PIZZA_BASE')) {
          this.pizzaBaseLoaded = true;
        } else {
          if (item.MealUpgrade && this.upgradeItems && this.upgradeItems.length > 0) {
            this.loadSuccessAddingToCartMessage(true);
            //  this.flicker();
          } else {
            this.loadSuccessAddingToCartMessage(false);
          }

        }

      }
    }
  }

  private addToCartPizzaWithGarnishes(item, isBeforePizza, data?, callback?) {
    if (isBeforePizza){
      this.pizzaBaseLoaded = true;
    } else {
      this.myPrepare(item);
    }
     
  }

  public checkForComboOld(){


    const myorderitems = this.commonFunctionsService.deepCopy(this.order.OrderItems);


    //this.categories = this.appStorageService.categories || [];


    this.categories.forEach(category => {
      category.Items.forEach(originalItem => {
        this.order.OrderItems.forEach(orderItem => {
          if(originalItem.Id == orderItem.ItemId ){
            orderItem.Price = originalItem.Price;
          }
        });
      });
    });


    console.log('this.checkForCombo()');


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


    for (let index = 1; index < sortedItemsCombos.length; index+=2) {
      sortedItemsCombos[index].Price = 0;
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
  }

  public checkForCombo(){
    const myorderitems = this.commonFunctionsService.deepCopy(this.order.OrderItems);

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


    console.log('this.checkForCombo()');


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

    var listOfLists : [][];

    /*for (let index = 0; index < sortedItemsCombos.length; index++) {
      if(sortedItemsCombos[index].CategoryId != sortedItemsCombos[index+1]?.CategoryId){

    }*/


    for (let index = 0; index < sortedItemsCombos.length; index ++) {

      if(sortedItemsCombos[index].CategoryId == sortedItemsCombos[index+1]?.CategoryId
        && sortedItemsCombos[index]?.Price == 0){
          console.log("same category but price alredy fixed - skip");

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

    //const mySorted3 = this.commonFunctionsService.deepCopy(this.order.OrderItems);
    //console.log("mySorted3- after push right price", mySorted3);
  }






  public addToCartMobile(item, isNotPizza, isCombo, event) {
    if (this.isMobileMode) {
      this.addToCart(item, isNotPizza, isCombo, event);
    } else {
    }
  }
  public addToCart(item, isNotPizza, isCombo, event?, callback?, comment?) { //combo,false,true,event
    if (!this.isDigitalMenu() && this.currentBranch.UseInventory && !this.isInStock(item)) return;
    if (isCombo && !this.isDigitalMenu() && this.currentBranch.UseInventory && !this.isInStockCombo(item)) return;
    if (isNotPizza ) {//||  (!isCombo )&& item.PizzaToppings.length == this.appStorageService.pizzaToppings.length
      if (!isNotPizza) {
       // item.SelectedPizzaPriceSize = item.PizzaPrices[0];
      }
      // Loading Garnishes if item has them:
      if (!this.isMobileMode()) {

        if (//(item && !item.PizzaPrices) ||
          item && ((item.Garnishes && item.Garnishes.length > 0) ||
            (item.GarnishGroups && item.GarnishGroups.length > 0) ||
            (item.GeneralGarnishGroups && item.GeneralGarnishGroups.length > 0))) {
          this.loadItemPopupDesktop(item, comment);
        } else {
          if(item.ItemGroups && item.ItemGroups.length>0){
            this.loadNewComboWithItems(item, (result) => {
              if(result && result.isSaved){
                //const orderItem = this.prepareItemForOrder(item);
                const orderItem = this.prepareItemWithItemGroupsForOrder(item, result.combo.SelectedItems);
                if (result && result.comments) {
                  orderItem.SpecialRequests = result.comments || '';
                }
                const index = this.getIndexIfNotHavingGarnishes(this.bsModalRef.content.item);
                if (index >= 0) {
  
                  const item = this.order.OrderItems[index];
    
                  item.Amount += orderItem.Amount;
                  this.checkOrderResultHeight();
    
                } else {
                  if (this.currentBranch.UseInventory )
                  item.Quantity -=1
                  this.order.OrderItems.push(orderItem);
                  this.checkOrderResultHeight();
    
                }
  
                this.orderService.recalculateSum();
                this.resetItem(item);
                
                 result.combo.SelectedItems.forEach((gi)=>{
                   this.resetItem(gi);
                 });

                if (item.MealUpgrade && this.upgradeItems && this.upgradeItems.length > 0) {
                  this.loadSuccessAddingToCartMessage(true);
    
                } else {
                  this.loadSuccessAddingToCartMessage(false);
                }
  
              }
  
            });
          }
          else if(!item.ItemGroups || item.ItemGroups.length==0){
            console.log("loadItemPopup");
            this.loadItemPopup(item);
           // this.loadItemPopupDesktop(item, comment);
          }
        }
      } else {
        if (item && ((item.Garnishes && item.Garnishes.length > 0) ||
          (item.GarnishGroups && item.GarnishGroups.length > 0) ||
          (item.GeneralGarnishGroups && item.GeneralGarnishGroups.length > 0))) {
          this.includeGarnishes(item, callback);
        } else {
          if(item.ItemGroups && item.ItemGroups.length>0){
            this.loadNewComboWithItems(item, (result) => {
              if(result && result.isSaved){
              //  const orderItem = this.prepareItemForOrder(item);
                const orderItem = this.prepareItemWithItemGroupsForOrder(item, result.combo.SelectedItems);
                if (result && result.comments) {
                  orderItem.SpecialRequests = result.comments || '';
                }
                const index = this.getIndexIfNotHavingGarnishes(this.bsModalRef.content.item);
                if (index >= 0) {
  
                  const item = this.order.OrderItems[index];
    
                  item.Amount += orderItem.Amount;
                  this.checkOrderResultHeight();
    
                } else {
    
                  this.order.OrderItems.push(orderItem);
                  this.checkOrderResultHeight();
    
                }
  
                this.orderService.recalculateSum();
                this.resetItem(item);
                if (item.MealUpgrade && this.upgradeItems && this.upgradeItems.length > 0) {
                  this.loadSuccessAddingToCartMessage(true);
    
                } else {
                  this.loadSuccessAddingToCartMessage(false);
                }
  
              }
  
            });
          }
          else if(!item.ItemGroups || item.ItemGroups.length==0){
            console.log("loadItemPopup");

            //if (AppConfig.configSettings.popupItem) {
            this.loadItemPopup(item);
          }

        }
      }
     
    } else {
      if (!isCombo) {
        this.loadPizzaWithToppings(item);
      } else {
        
        this.loadNewComboWithItems(item);
        
      }
    }
    

  }

  public displayUpgradesPopup() {
    console.log("display-UPGARDE")
    let minWidth: string = "";
    let maxWidth: string = "";
    let width: string = "";
    if (this.isMobileMode()) {
      minWidth = "350px";
      maxWidth = "1000px";
      width = "100%";
    }
    else {
      width = "0";
      minWidth = "580px";
      maxWidth = "1000px";
    }
    let items = this.commonFunctionsService.deepCopy(this.upgradeItems);
    items[0].IsUpgrade = true;
    const message = this.translationService.translate('UPGRADE');
    if (this.upgradeItems && this.upgradeItems.length > 0) {
      const matDialogRef = this.matDialog.open(AdditionalItemsComponent, {
        data: {
          header: message,
          items: items,
          maxItems: 1,
          isBonusMode: false,
          isUpgrade: true
          //this.minForBonus
        },
        minWidth: minWidth,
        width: width,
        maxWidth: maxWidth,
        disableClose: true,
        panelClass: 'custom-mat-dialog-additional'
      });
      
      matDialogRef.afterClosed().subscribe((result) => {
        this.upgradeItems[0].IsUpgrade = true;

        if (result.isSaved) {
          if(!this.isMobileMode()){
             this.loadItemPopupDesktop(this.upgradeItems);
          }
          else if(this.isMobileMode()){
            result.selectedItems.forEach(orderAdditionalItem => {
              orderAdditionalItem.IsUpgrade = true;
              if (!orderAdditionalItem.Amount || orderAdditionalItem.Amount == undefined) {
                orderAdditionalItem.Amount = 1;
              }
              this.order.OrderItems.push(orderAdditionalItem);
              this.orderService.recalculateSum();
              this.checkOrderResultHeight();
              
              // this.order.hasBonusItems = true;
            });
            if (AppConfig.configSettings.minAmountForBonus && !this.order.hasBonusItems
              && (this.order.Sum >= AppConfig.configSettings.minAmountForBonus)) {
              this.displayBonusItems();
            }
          }
          
          //  this.addToCartComboItem(result.combo, comboItem);
        } else {
          if (AppConfig.configSettings.minAmountForBonus && !this.order.hasBonusItems
            && (this.order.Sum >= AppConfig.configSettings.minAmountForBonus)) {
              console.log("display bonus!!!!!!!!!!!")
            this.displayBonusItems();
          }
          
        }
      });
    }

  }



  private loadNewComboWithItems(comboItem, callback?) {
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
        if (this.bsModalRef.content.isSaved && this.bsModalRef.content.combo) {
          const myBsModalContentCombo = this.commonFunctionsService.deepCopy(this.bsModalRef.content.combo);
          this.addToCartComboItem(this.bsModalRef.content.combo, comboItem);


          if (callback) {
            callback(this.bsModalRef.content);
    
          }
        }
      });
 
  }
  
  private loadItemPopupWithGarnishes(item) {
    const initialState = {
      item: item
    };
    this.bsModalRef = this.modalService.show(ItemComponent,
      { initialState, class: 'custom-mat-dialog' });
    this.modalService.onHide
      .pipe(take(1)).subscribe(() => {

        if (this.bsModalRef.content.isSaved && this.bsModalRef.content.item) {
          const orderItem = this.prepareItemForOrder(this.bsModalRef.content.item);
          const index = this.getIndexIfNotHavingGarnishes(this.bsModalRef.content.item);

          if (index >= 0) {

            const item = this.order.OrderItems[index];

            item.Amount += orderItem.Amount;

          } else {

            this.order.OrderItems.push(orderItem);

          }
          this.checkOrderResultHeight();
          this.orderService.recalculateSum();
          this.resetItem(item);
          if (item.MealUpgrade && this.upgradeItems && this.upgradeItems.length > 0) {
            this.loadSuccessAddingToCartMessage(true);
          } else {
            this.loadSuccessAddingToCartMessage(false);
          }
          // this.loadSuccessAddingToCartMessage();
        }
      });

    /* matDialogRef.afterClosed().subscribe((result) => {
       if (result.isSaved && result.combo) {
         this.addToCartComboItem(result.combo, comboItem);
       }
 
     });*/
  }

  private loadItemPopup(item) {
    const initialState = {
      item: item
    };
    this.bsModalRef = this.modalService.show(ItemComponent,
      { initialState, class: '' });
    this.modalService.onHide
      .pipe(take(1)).subscribe(() => {

        if (this.bsModalRef.content.isSaved && this.bsModalRef.content.item) {

         if(this.bsModalRef.content.item.PizzaPrices){
          var comment2 = this.bsModalRef.content.itemComments;
          if(comment2 == 'undefined' || comment2 == undefined) comment2 = '';
          
          console.log("this.preparePizzaForOrder");
          const orderPizza = this.preparePizzaForOrder(
            this.commonFunctionsService.deepCopy(this.bsModalRef.content.item),comment2);
            
            if(orderPizza.SpecialRequests == undefined) orderPizza.SpecialRequests = '';            
            if( orderPizza.Comment == undefined ) orderPizza.Comment = '';
            orderPizza.Comment.replace("undefined","");  
            orderPizza.SpecialRequests.replace("undefined","");  
           
            this.order.OrderPizzas.push(orderPizza);
            this.checkOrderResultHeight();
              this.orderService.recalculateSum();

              

             // this.resetPizza(this.bsModalRef.content.item);
              this.resetPizza(item);
              if (this.pizzaAdditionItems && this.pizzaAdditionItems.length > 0) {
                const pizzAdditionItem = this.pizzaAdditionItems.
                  find(it => it.Name === this.translationService.translate('PIZZA_ADDITIONS'));
                if (pizzAdditionItem != undefined) {
                  this.includeGarnishes(pizzAdditionItem);
                }
                //this.pizzaAdditionItems.forEach((item: ItemAppAdvancedModel) => {
                //this.includeGarnishes(item);
                // });
              } else {
                this.loadSuccessAddingToCartMessage(false);

              }
            
         }
          else if(item.ItemGroups && item.ItemGroups.length>0){
            const tmpItem = this.bsModalRef.content.item;
            let specialRequests = this.bsModalRef.content.comments || '';
            let itemName = this.bsModalRef.content.itemName;
            const index = this.getIndexIfNotHavingGarnishes(this.bsModalRef.content.item);
          
           
            //this.loadNewComboWithItems(item);
            this.loadNewComboWithItems(item, (result) => {
              if(result && result.isSaved){
                const orderItem = this.prepareItemWithItemGroupsForOrder(tmpItem, result.combo.SelectedItems);
                if (result.comments) {

                  item.SpecialRequests = specialRequests + result.comments ;
                }
                orderItem.SpecialRequests = specialRequests;//this.bsModalRef.content.itemComments;
                orderItem.ItemName = itemName;
                if (index >= 0) {

                  const item = this.order.OrderItems[index];
    
                  item.Amount += orderItem.Amount;
                  this.checkOrderResultHeight();
    
                } else {
    
                  this.order.OrderItems.push(orderItem);
                  this.checkOrderResultHeight();
    
                }

                this.orderService.recalculateSum();
                this.resetItem(item);
                if (item.MealUpgrade && this.upgradeItems && this.upgradeItems.length > 0) {
                  this.loadSuccessAddingToCartMessage(true);
    
                } else {
                  this.loadSuccessAddingToCartMessage(false);
                }
              

              }

            });

          }
          else if (!item.ItemGroups || item.ItemGroups.length == 0) {
            //new 07/01/24
            const orderItem = this.prepareItemForOrder(this.bsModalRef.content.item);
            orderItem.SpecialRequests = this.bsModalRef.content.comments;
            if (this.bsModalRef.content.itemComments != undefined && 
              this.bsModalRef.content.itemComments != null)
              orderItem.SpecialRequests =  this.bsModalRef.content.itemComments + this.bsModalRef.content.comments;
            orderItem.ItemName = this.bsModalRef.content.itemName;
            if (orderItem.SpecialRequests.length > 0) {
              this.order.OrderItems.push(orderItem);
              this.checkOrderResultHeight();
            }
            else {
              const index = this.getIndexIfNotHavingGarnishes(this.bsModalRef.content.item);
            
              //
              if (index >= 0) {
  
                const item = this.order.OrderItems[index];
    
                item.Amount += orderItem.Amount;
    
              } else {
    
                this.order.OrderItems.push(orderItem);
                this.checkOrderResultHeight();
    
              }
            }
            
            this.orderService.recalculateSum();
            this.resetItem(item);
            if (item.MealUpgrade && this.upgradeItems && this.upgradeItems.length > 0) {
              this.loadSuccessAddingToCartMessage(true);
            } else {
              this.loadSuccessAddingToCartMessage(false);
            }

          }
        }
      });
  }

  public loadItemInfo(item) {
    const initialState = {
      item: item,
      isDigitalMenu: true
    };
    this.bsModalRef = this.modalService.show(ItemComponent,
      { initialState, class: 'item-info-modal' });
    this.modalService.onHide
      .pipe(take(1)).subscribe(() => { });
  }

  private loadItemPopupDesktop(item, comment?) {
  //  const modalElement = document.getElementsByClassName('modal-dialog-item-with-garnishes');
   // console.log("modalElement", modalElement);
   // console.log("loadItemPopupDesktop(item)",item);
    const initialState = {
      item: item
    };
    this.bsModalRef = this.modalService.show(ItemWithGarnishesComponent, 
      {initialState, class:'modal-dialog-item-with-garnishes'});
     this.modalService.onHide
    .pipe(take(1)).subscribe(() => {
       
      if (this.bsModalRef.content.isSaved && this.bsModalRef.content.item) {
        if(!this.bsModalRef.content.item.PizzaPrices){
          //NOT PIZZA
         
          if(item.ItemGroups && item.ItemGroups.length>0){
            const tmpItem = this.bsModalRef.content.item;
            let specialRequests = this.bsModalRef.content.itemComments;
            let itemName = this.bsModalRef.content.itemName;
            const index = this.getIndexIfNotHavingGarnishes(this.bsModalRef.content.item);
            //this.loadNewComboWithItems(item);
            this.loadNewComboWithItems(item, (result) => {
              if(result && result.isSaved){



             //   const orderItem = this.prepareItemForOrder(this.bsModalRef.content.item);
                const orderItem = this.prepareItemWithItemGroupsForOrder(tmpItem, result.combo.SelectedItems);
                orderItem.SpecialRequests = specialRequests;//this.bsModalRef.content.itemComments;
                orderItem.ItemName = itemName;//this.bsModalRef.content.itemName;
              //  const index = this.getIndexIfNotHavingGarnishes(this.bsModalRef.content.item);
                if (index >= 0) {

                  const item = this.order.OrderItems[index];
    
                  item.Amount += orderItem.Amount;
                  this.checkOrderResultHeight();
    
                } else {
    
                  this.order.OrderItems.push(orderItem);
                  this.checkOrderResultHeight();
    
                }

                this.orderService.recalculateSum();
                this.resetItem(item);
                if (item.MealUpgrade && this.upgradeItems && this.upgradeItems.length > 0) {
                  this.loadSuccessAddingToCartMessage(true);
    
                } else {
                  this.loadSuccessAddingToCartMessage(false);
                }
              

              }

            });

          }
          else if (!item.ItemGroups || item.ItemGroups.length == 0) {
            const orderItem = this.prepareItemForOrder(this.bsModalRef.content.item);
            orderItem.SpecialRequests = this.bsModalRef.content.itemComments;
            orderItem.ItemName = this.bsModalRef.content.itemName;
            const index = this.getIndexIfNotHavingGarnishes(this.bsModalRef.content.item);
            if (index >= 0) {

              const item = this.order.OrderItems[index];

              item.Amount += orderItem.Amount;
              this.checkForCombo();
              this.checkOrderResultHeight();

            } else {

              this.order.OrderItems.push(orderItem);

              if (this.order.OrderItems.length > 0) {

                this.checkForCombo();
              }
              this.checkOrderResultHeight();

            }
            this.orderService.recalculateSum();
            this.resetItem(item);
            if (item.MealUpgrade && this.upgradeItems && this.upgradeItems.length > 0) {
              this.loadSuccessAddingToCartMessage(true);

            } else {
              this.loadSuccessAddingToCartMessage(false);
            }
          }
          // this.loadSuccessAddingToCartMessage();
        }

        else if(this.bsModalRef.content.item.PizzaPrices){
          var comment2 = this.bsModalRef.content.itemComments;
          if(comment2 == 'undefined' || comment2 == undefined) comment2 = '';
          if(comment == undefined || comment == 'undefined') comment = '';
          console.log("this.preparePizzaForOrder");
          const orderPizza = this.preparePizzaForOrder(
            this.commonFunctionsService.deepCopy(this.bsModalRef.content.item),
            this.commonFunctionsService.deepCopy(comment+' '+comment2));
            if(orderPizza.Comment == 'undefined undefined ' || orderPizza.SpecialRequests == 'undefined undefined ' || orderPizza.Comment=='undefined' || orderPizza.SpecialRequests == 'undefined' || orderPizza.Comment == undefined || orderPizza.SpecialRequests == undefined){
              orderPizza.Comment = '';
              orderPizza.SpecialRequests = '';
            }
           
            this.order.OrderPizzas.push(orderPizza);
            this.checkOrderResultHeight();
              this.orderService.recalculateSum();

              

             // this.resetPizza(this.bsModalRef.content.item);
              this.resetPizza(item);
              if (this.pizzaAdditionItems && this.pizzaAdditionItems.length > 0) {
                const pizzAdditionItem = this.pizzaAdditionItems.
                  find(it => it.Name === this.translationService.translate('PIZZA_ADDITIONS'));
                if (pizzAdditionItem != undefined) {
                  this.includeGarnishes(pizzAdditionItem);
                }
                //this.pizzaAdditionItems.forEach((item: ItemAppAdvancedModel) => {
                //this.includeGarnishes(item);
                // });
              } else {
                this.loadSuccessAddingToCartMessage(false);

              }
            
        }
      }
    });
    
   
  }

  private loadPizzaGarnishesPopupDesktop(item, isBeforePizza, comment?) {
    const initialState = {
      item: item,
      showBeforePizzaGarnishes: isBeforePizza
    };
    this.bsModalRef = this.modalService.show(ItemWithGarnishesComponent, 
        {initialState, class:'modal-dialog-item-with-garnishes'});
    this.modalService.onHide
      .pipe(take(1)).subscribe(() => {

        if (this.bsModalRef.content.isSaved && 
            this.bsModalRef.content.item &&
            this.bsModalRef.content.item.PizzaPrices) {
         
            var comment2 = this.bsModalRef.content.itemComments;
            if(comment2 == 'undefined' || comment2 == undefined) comment2 = '';
            if(comment == undefined || comment == 'undefined') comment = '';
            item.SelectedGarnishes = this.bsModalRef.content.item.SelectedGarnishes;
            if (isBeforePizza){
              
              this.pizzaBaseLoaded = true;
            } else {
              //this.myPrepare(item);
              console.log("this.preparePizzaForOrder");
            const orderPizza = this.preparePizzaForOrder(
              this.commonFunctionsService.deepCopy(this.bsModalRef.content.item),
              this.commonFunctionsService.deepCopy(comment+' '+comment2));
              if (orderPizza.Comment != undefined && 
                  orderPizza.Comment != null && 
                  orderPizza.Comment.length > 0 )
                    orderPizza.Comment.replace("undefined","");
              if (orderPizza.SpecialRequests != undefined && 
                  orderPizza.SpecialRequests != null && 
                  orderPizza.SpecialRequests.length > 0 ){
                    orderPizza.SpecialRequests = orderPizza.SpecialRequests.replace('undefined','');
                    orderPizza.SpecialRequests.replace("SpecialRequests","");
                  }
                 
             // if(orderPizza.Comment == 'undefined undefined ' || orderPizza.SpecialRequests == 'undefined undefined ' || orderPizza.Comment=='undefined' || orderPizza.SpecialRequests == 'undefined' || orderPizza.Comment == undefined || orderPizza.SpecialRequests == undefined){
              //  orderPizza.Comment = '';
               // orderPizza.SpecialRequests = '';
             // }
              this.order.OrderPizzas.push(orderPizza);
              this.checkOrderResultHeight();
                this.orderService.recalculateSum();
              //  this.resetPizza(this.bsModalRef.content.item);
                  this.resetPizza(item);
                this.loadSuccessAddingToCartMessage(false);  
                
            }
            
              
          
        }
      });
      
     
    }


  public checkOrderResultHeight(){
    console.log("!!!!!!!!!!checkOrderResultHeight()")
    if(!this.isMobileMode()){
    //var resultHeight = document.getElementById("myOrderResult").style.height;
    var height = this.myIdentifier.nativeElement.offsetHeight;

    if(height>650){
      console.log("HEIGHT > 500");
      var resultBTN = document.getElementById("result-btn");
      var perfectScroll = document.getElementById("my-scroll");
      resultBTN.classList.add("greater-height");
      perfectScroll.classList.add("greater-scroll-height");
    }
  }
  }


  private loadComboWithItems(comboItem) {
    console.log("loadComboWithItems(comboItem)")
    const matDialogRef = this.matDialog.open(ComboComponent, {
      data: {
        combo: comboItem,
        menu: this
      },
      minWidth: '350px',
      maxWidth: '100%',
      disableClose: true,
      panelClass: 'custom-mat-dialog'
    });
    matDialogRef.afterClosed().subscribe((result) => {
      if (result.isSaved && result.combo) {
        this.addToCartComboItem(result.combo, comboItem);
      }

    });
  }

  public loadSuccessAddingToCartMessage(mealUpgrade: boolean) {
    console.log(" loadSuccessAddingToCartMessage");
    this.routeActivate.canActivateHome = false;


    document.getElementById("snackbar").classList.add("show");
    // const x = document.getElementById("snackbar").classList.add("show");
    // x.className = "show";

    setTimeout(() => { document.getElementById("snackbar").classList.remove("show"); }, 2000);

    setTimeout(() => {
      //document.getElementById("snackbar").classList.remove("show");
      if (mealUpgrade) {
        this.displayUpgradesPopup();
      }
      else if (AppConfig.configSettings.minAmountForBonus && !this.order.hasBonusItems
        && (this.order.Sum >= AppConfig.configSettings.minAmountForBonus)) {
          console.log("go to - this.displayBonusItems();")
        this.displayBonusItems();
      }
    }, 100);
    this.appStorageService.setItemInLocalStorage(window.location.hash, this.order);
 
  }

  public flicker() {
    document.getElementById("flicker").classList.add("animate-flicker");
    // const x = document.getElementById("snackbar").classList.add("show");
    // x.className = "show";

    setTimeout(() => { document.getElementById("flicker").classList.remove("animate-flicker"); }, 7000);


  }

  public makeOrder() {
    if (this.order && ((this.order.OrderItems && this.order.OrderItems.length > 0)
      || (this.order.OrderPizzas && this.order.OrderPizzas.length > 0) ||
      (this.order.OrderCombos && this.order.OrderCombos.length > 0))) {
        localStorage.removeItem(window.location.hash);
        this.router.navigateByUrl(`/${this.franchiseId}/order`);
    }
  }

   

  public openItemPopup(res: any) {
    // let index = res.index;

    if (res.item.FullPizza) {
      var myClass;
      if (this.isMobileMode()) {
        myClass = 'modal-after-edit';
      }
      else myClass = 'modal-dialog-item-with-garnishes-mat-dialog'

      const initialState = {
        pizza: res.item,
        isEdit: true,
        maxToppings:  res.item.MaxFreeToppings,
      };
      this.bsModalRef = this.modalService.show(PizzaComponent,
        { initialState, class: myClass });
      this.modalService.onHide
        .pipe(take(1)).subscribe(() => {

          if (this.bsModalRef.content.isSaved && this.bsModalRef.content.pizza) {
            console.log("this.preparePizzaForOrder");
            const orderPizza = this.preparePizzaForOrder(this.bsModalRef.content.pizza, this.bsModalRef.content.comments);
            //orderPizza.SpecialRequests = this.bsModalRef.content.comments;
            //const index = this.getIndexIfNotHavingGarnishes(this.bsModalRef.content.item);

            var index = this.order.OrderPizzas.indexOf(res.item);
            this.order.OrderPizzas[index] = orderPizza;

            this.orderService.recalculateSum();
            //this.resetItem(item);

            if (orderPizza.FullPizza.SelectedGarnishes && orderPizza.FullPizza.SelectedGarnishes.length > 0) {
              this.openGarnishesEdit(orderPizza);
            }

            //this.loadSuccessAddingToCartMessage(false);

          }
        });

    }

    else {

      let itemToEdit = res.item;

      if (!itemToEdit.IsBonus) {
        console.log("ITEM IS NOT BONUS");
        const initialState = {
          item: res.item.Item,
          isEdit: true
        };
        this.bsModalRef = this.modalService.show(ItemWithGarnishesComponent,
          { initialState, class: 'modal-dialog-item-with-garnishes' });
        this.modalService.onHide
          .pipe(take(1)).subscribe(() => {

            if (this.bsModalRef.content.isSaved && this.bsModalRef.content.item) {
              if(this.bsModalRef.content.item.ItemGroups && this.bsModalRef.content.item.ItemGroups.length>0){
                const tmpItem = this.bsModalRef.content.item;
                let specialRequests = this.bsModalRef.content.itemComments;
                let itemName = this.bsModalRef.content.itemName;
               //const index = this.getIndexIfNotHavingGarnishes(this.bsModalRef.content.item);
                //this.loadNewComboWithItems(item);
                this.loadNewComboWithItems(this.bsModalRef.content.item, (result) => {
                  if(result && result.isSaved){
    
    
    
                 //   const orderItem = this.prepareItemForOrder(this.bsModalRef.content.item);
                    const orderItem = this.prepareItemWithItemGroupsForOrder(tmpItem, result.combo.SelectedItems);
                    orderItem.SpecialRequests = specialRequests;//this.bsModalRef.content.itemComments;
                    orderItem.ItemName = itemName;//this.bsModalRef.content.itemName;
                  //  const index = this.getIndexIfNotHavingGarnishes(this.bsModalRef.content.item);
                   
                    var index = this.order.OrderItems.indexOf(res.item);
                    this.order.OrderItems[index] = orderItem;
    
                  if(this.order.OrderItems.length>0){
    
                    this.checkForCombo();
                    }
    
                  this.orderService.recalculateSum();
                  this.resetItem(res.item);
    
                  this.loadSuccessAddingToCartMessage(false);


 
                   /* if (item.MealUpgrade && this.upgradeItems && this.upgradeItems.length > 0) {
                      this.loadSuccessAddingToCartMessage(true);
        
                    } else {
                      this.loadSuccessAddingToCartMessage(false);
                    }*/
                  
    
                  }
    
                });
    
              }
              else {
                const orderItem = this.prepareEditedItemForOrder(this.bsModalRef.content.item);
                orderItem.SpecialRequests = this.bsModalRef.content.comments;
                //const index = this.getIndexIfNotHavingGarnishes(this.bsModalRef.content.item);
                var index = this.order.OrderItems.indexOf(res.item);
                this.order.OrderItems[index] = orderItem;
  
                if(this.order.OrderItems.length>0){
  
                  this.checkForCombo();
                  }
  
                this.orderService.recalculateSum();
                this.resetItem(res.item);
  
                this.loadSuccessAddingToCartMessage(false);
              }
             

            }
          });
      }
      else if (itemToEdit.IsBonus) {
        //this.categories = this.appStorageService.categories || [];

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
        const firstMessage = this.translationService.translate('BONUS_FIRST');
        const bonusMSG = AppConfig.configSettings.bonusMsg;
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
            if (result.isSaved && result.selectedItems) {
              this.order.OrderItems.forEach(item => {
                if (item.IsBonus) {
                  this.order.OrderItems.splice(this.order.OrderItems.indexOf(item), 1);
                }
              });

              result.selectedItems.forEach(orderAdditionalItem => {
                this.order.OrderItems.push(orderAdditionalItem);
                this.checkOrderResultHeight();
                this.order.hasBonusItems = true;
              });
              //  this.addToCartComboItem(result.combo, comboItem);
            }
          });


        }

      }
    }
  }

  public openGarnishesEdit(item) {
    console.log("openGarnishesEdit()");
    // let index = res.index;

    let itemToEdit = item;

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

          if (this.bsModalRef.content.isSaved && this.bsModalRef.content.item) {
            const orderPizza = this.prepareEditedGarnishesForPizza(this.bsModalRef.content.item , item);
            orderPizza.SpecialRequests = this.bsModalRef.content.comments;
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


  public removeAll() {
    if (this.order) {
      this.order.OrderItems = [];
      this.order.OrderPizzas = [];
      this.order.OrderCombos = [];
      this.order.hasBonusItems = false;
    }
    this.orderService.recalculateSum();
  }

  public return() {
    localStorage.removeItem(window.location.hash);
    this.router.navigateByUrl(`/${this.franchiseId}/home`);
  }

  public displaySelectionOption() {
    if (this.order.IsDelivery) {
      return this.translationService.translate('MENU_DELIVERY');
    } else if (this.order.IsTakeAway) {
      return this.translationService.translate('MENU_TAKEAWAY');
    } else if (this.order.IsSit){
      return this.translationService.translate('MENU_SIT');
    } else if (this.order.IsDigitalMenu){
      return this.translationService.translate('WATCH_MENU');
    }
    
  }

  private loadingGarnishesPopup(item, garnishes: GarnishAppModel[], garnishGroup: GarnishGroupAppModel,
    comments: string, selectedGarnishes, isFirstPage, selectedGarnishesPrice?, callback?) {
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


      if (result.isSaved) {
        console.log("IDK");
        if (result && result.allGettingGarnishes && item && !result.returnToPreviousPage) {
          //console.log("IDK- item.selectedGarnishes", item.SelectedGarnishes);
          item.SelectedGarnishes = result.allGettingGarnishes.slice();
        }
        if ((!result.returnToPreviousPage && item && item.GarnishGroups && item.GarnishGroups.indexOf(garnishGroup) != -1 &&
          item.GarnishGroups.indexOf(garnishGroup) + 1 < item.GarnishGroups.length) ||
          (!result.returnToPreviousPage && item && item.GeneralGarnishGroups && item.GeneralGarnishGroups.indexOf(garnishGroup) != -1 &&
            item.GeneralGarnishGroups.indexOf(garnishGroup) + 1 < item.GeneralGarnishGroups.length)) {
          if (item.GarnishGroups) {
            var grnGrp = item.GarnishGroups[item.GarnishGroups.indexOf(garnishGroup) + 1];
          }
          else {
            console.log(" else");
            grnGrp = item.GeneralGarnishGroups[item.GeneralGarnishGroups.indexOf(garnishGroup) + 1];
          }
          if (grnGrp && grnGrp.Garnishes && grnGrp.Garnishes.length > 0) {
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
            this.loadingGarnishesPopup(item, null, grnGrp, result.comments,
              item.SelectedGarnishes, item.GarnishGroups.indexOf(grnGrp) === 0, result.selectedGarnishesPrice);
          }
        } else if (result.returnToPreviousPage && item.Garnishes &&
          item.Garnishes.length > 0 && item.SelectedGarnishes) {
          if (item.Garnishes) {
            const grnGrp = item.GarnishGroups[item.GarnishGroups.length - 1];
            if (grnGrp) {
              this.loadingGarnishesPopup(item, null, grnGrp, result.comments,
                item.SelectedGarnishes, item.GarnishGroups.indexOf(grnGrp) === 0, result.selectedGarnishesPrice);
            }
          }
        } else if (!result.returnToPreviousPage) {
          // If everything was added to list of garnishes - add to card
          // console.log("---item",item);

          if(item.ItemGroups && item.ItemGroups.length>0){

            this.loadNewComboWithItems(item, (result) => {
              if(result && result.isSaved){
                this.addToCartItemWithGarnishes(item, result, callback);
              }
            });

          }
          else{
            this.addToCartItemWithGarnishes(item, result, callback);
          }

        } else {

        }
      } else {

      }
    });
  }


  private loadingGarnishesPopupForPizza(item, isBeforePizza:boolean, 
                                        garnishGroup: GarnishGroupAppModel,
                                        selectedGarnishes, isFirstPage, 
                                        selectedGarnishesPrice?, callback?) {
    const matDialogRef = this.matDialog.open(GarnishesComponent, {
      data: {
        garnishGroup: garnishGroup,
        garnishes: [],
        comments: "",
        selectedGarnishes,
        isFirstPage,
        item: item,
        isMenu: true,
        selectedGarnishesPrice,
        hideImage: !isBeforePizza
      },
      width: '100%',
      maxWidth: '1000px',
      disableClose: true,
      panelClass: 'custom-mat-dialog-mobile-garnishes-with-item'
    });
    matDialogRef.afterClosed().subscribe((result: GarnishesDialog) => {


      if (result.isSaved) {
        
        if (result && result.allGettingGarnishes && item && !result.returnToPreviousPage) {
          //console.log("IDK- item.selectedGarnishes", item.SelectedGarnishes);
          item.SelectedGarnishes = result.allGettingGarnishes.slice();
        }
        if (isBeforePizza) {

          if (!result.returnToPreviousPage && item && 
            item.GarnishGroupsBeforePizza && 
            item.GarnishGroupsBeforePizza.indexOf(garnishGroup) != -1 &&
            item.GarnishGroupsBeforePizza.indexOf(garnishGroup) + 1 < 
            item.GarnishGroupsBeforePizza.length) {
              grnGrp = item.GarnishGroupsBeforePizza[item.GarnishGroupsBeforePizza.indexOf(garnishGroup) + 1];
         
              if (grnGrp && grnGrp.Garnishes && grnGrp.Garnishes.length > 0) {
                this.loadingGarnishesPopupForPizza(item, isBeforePizza, 
                                              grnGrp, item.SelectedGarnishes, 
                                              false, result.selectedGarnishesPrice);
              }
          } else if (result.returnToPreviousPage && item && 
                  item.GarnishGroupsBeforePizza &&
                  item.GarnishGroupsBeforePizza.indexOf(garnishGroup) !== -1 &&
                  item.GarnishGroupsBeforePizza.indexOf(garnishGroup) - 1 > -1) {
                    var grnGrp = item.GarnishGroupsBeforePizza[item.GarnishGroupsBeforePizza.indexOf(garnishGroup) - 1];
         
                    if (grnGrp && grnGrp.Garnishes && grnGrp.Garnishes.length > 0) {
                      this.loadingGarnishesPopupForPizza(item, isBeforePizza, 
                                              grnGrp, item.SelectedGarnishes, 
                                              item.GarnishGroupsBeforePizza.indexOf(grnGrp) === 0, 
                                              result.selectedGarnishesPrice);
                    }
            }  else if (!result.returnToPreviousPage) {
                this.addToCartPizzaWithGarnishes(item, isBeforePizza, result, callback);
            } 
        } else {
          
          if (!result.returnToPreviousPage && item && 
              item.GarnishGroupsAfterPizza && 
              item.GarnishGroupsAfterPizza.indexOf(garnishGroup) != -1 &&
              item.GarnishGroupsAfterPizza.indexOf(garnishGroup) + 1 < 
              item.GarnishGroupsAfterPizza.length) {
                grnGrp = item.GarnishGroupsAfterPizza[item.GarnishGroupsAfterPizza.indexOf(garnishGroup) + 1];
       
                if (grnGrp && grnGrp.Garnishes && grnGrp.Garnishes.length > 0) {
                  this.loadingGarnishesPopupForPizza(item, isBeforePizza, 
                                            grnGrp, item.SelectedGarnishes, 
                                            false, result.selectedGarnishesPrice);
                }
          } else if (result.returnToPreviousPage && item && 
                item.GarnishGroupsAfterPizza &&
                item.GarnishGroupsAfterPizza.indexOf(garnishGroup) !== -1 &&
                item.GarnishGroupsAfterPizza.indexOf(garnishGroup) - 1 > -1) {
                  var grnGrp = item.GarnishGroupsAfterPizza[item.GarnishGroupsAfterPizza.indexOf(garnishGroup) - 1];
       
                  if (grnGrp && grnGrp.Garnishes && grnGrp.Garnishes.length > 0) {
                  this.loadingGarnishesPopupForPizza(item, isBeforePizza, 
                                            grnGrp, item.SelectedGarnishes, 
                                            item.GarnishGroupsAfterPizza.indexOf(grnGrp) === 0, 
                                            result.selectedGarnishesPrice);
                  }
          }  else if (!result.returnToPreviousPage) {
                this.addToCartPizzaWithGarnishes(item, isBeforePizza, result, callback);
          }       

        }


      }  
    });
  }

  public includeGarnishes(item: ItemAppAdvancedModel, callback?) {
    if (item) {
      if ((item.GarnishGroups && item.GarnishGroups.length) > 0 || (item.GeneralGarnishGroups && item.GeneralGarnishGroups.length > 0) ) {
        if(item.GarnishGroups){
        var garnishGrp = item.GarnishGroups[0];
        }
        else {
          console.log("NO GARNISHGROUPS - Its Pizza");
          garnishGrp = item.GeneralGarnishGroups[0];
        } 
        this.loadingGarnishesPopup(item, null, garnishGrp, '', item.SelectedGarnishes, true, callback);
      } else if (item.Garnishes && item.Garnishes.length > 0) {
        this.loadingGarnishesPopup(item, item.Garnishes, null, '', item.SelectedGarnishes, true);
      }
    }
  }

  public includePizzaGarnishes(item: PizzaAppAdvancedModel, isBeforePizza:boolean, callback?) {
    if (item && (item.GeneralGarnishGroups && item.GeneralGarnishGroups.length > 0 )) {
      if (!this.isMobileMode()) {
        this.loadPizzaGarnishesPopupDesktop(item, isBeforePizza,"");        
      } else {
        var garnishGrp:GarnishGroupAppModel;
        if (isBeforePizza) garnishGrp = item.GarnishGroupsBeforePizza[0];
        else  garnishGrp = item.GarnishGroupsAfterPizza[0];
        
        this.loadingGarnishesPopupForPizza(item, isBeforePizza, garnishGrp, 
                                           item.SelectedGarnishes, true, callback);
      }              
    }
 
  }

  public returnToPrevPage() {
    localStorage.removeItem(window.location.hash);
    this.router.navigate([`/${this.franchiseId}/home`]);
  }

  public checkOnDisabledAvailableGarnishes(item: ItemAppAdvancedModel) {
    return this.isNotFilledAllRequiredGarnishesOfGarnishGroup(item);
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

  private initializeAmountOfItems() {
    console.log("initializeAmountOfItems");
    if (this.categories) {
      this.categories.forEach((category) => {
        category.Items = category.Items.map((item) => {
          item.Amount = 1;
          item.SelectedGarnishes = [];
          item.GarnishGroups.forEach((gg) => {
            gg.Garnishes.forEach((gar) => {
              gar.GarnishGroupName = gg.Name;
            });
          });
          
          this.order.OrderItems.forEach((orderItem)=> {   
            if (orderItem.Item.CatalogNumber == item.CatalogNumber)
              item.Quantity -= orderItem.Amount;                 
          });
          return item;
        });
        category.Pizzas.forEach((pizza) => {
          pizza.Amount = 1;
          pizza.SelectedToppings = [];
        });
      });
    }
    if (this.pizzas) {
      this.pizzas.forEach((pizza) => {
        pizza.Amount = 1;
        pizza.SelectedToppings = [];
      });
    }
    if (this.combos) {
      this.combos.forEach((pizza) => {
        pizza.Amount = 1;
        pizza.SelectedItems = [];
      });
    }
  }

  private prepareOrder() {
    this.order = this.orderService.getOrder();

    if (this.order.OrderItems === undefined || this.order.OrderItems === null) {
      this.order.OrderItems = [];
    }
    if (this.order.OrderPizzas === undefined || this.order.OrderPizzas === null) {
      this.order.OrderPizzas = [];
    }
    if (this.order.OrderCombos === undefined || this.order.OrderCombos === null) {
      this.order.OrderCombos = [];
    }
    this.appStorageService.setItemInLocalStorage(window.location.hash, this.order);
  }

  private getIndexIfNotHavingGarnishes(currentItem) {
    if (this.order && this.order.OrderItems && currentItem) {
      const item = this.order.OrderItems.find((item) => {
        return item.ItemId === currentItem.Id && item.Garnishes && item.Garnishes.length === 0
          && currentItem.GarnishGroups && currentItem.GarnishGroups.length === 0
          && currentItem.Garnishes && currentItem.Garnishes.length === 0 && item.SpecialRequests =="";
      });
      return this.order.OrderItems.indexOf(item);
    }
    return -1;
  }

  private getStartingCategory(startingPage) {
    if (startingPage && startingPage != "null") {
      // if (branch.startingPage === StartPageEnum.START) {
      //   this.defaultCategoryStartSelection();
      // }
      // else
      if (startingPage === StartPageEnum.COMBO.toString()) {
        this.selectCategory(undefined, false, true);
      } else if (startingPage === StartPageEnum.PIZZA.toString()) {
        this.selectCategory(undefined, false, false);
      }
      else {
        var startCat = this.categories.find(function (cat) {
          return cat.Name === startingPage;
        });
        if (startCat) {
          this.selectCategory(startCat, true, false);
        }
      }
    } else {
      // this.defaultCategoryStartSelection();
    }
  }

  private initializeGraphics() {
    this.graphics.logo = AppConfig.settings.logo;
    this.colors.menuColor = AppConfig.settings.menuColor || environment.defaultColor;
    this.colors.buttonColor = AppConfig.settings.buttonColor;
    this.colors.priceColor = AppConfig.settings.priceColor;
    this.colors.categoryColor = AppConfig.settings.categoryColor;
    this.lang = this.translationService.language();
    this.cashSymbol = AppConfig.cashSymbol;
  }

  public loadPizzaWithToppings(pizza: PizzaAppAdvancedModel) {
    this.loadingPizzaPopup(pizza);
  }

  private preparePizzaForOrder(pizza: PizzaAppAdvancedModel, specialRequest: string) {
    const newPizza = new OrderPizzaAppAdvancedModel();
    newPizza.Amount = pizza.Amount;
    newPizza.PizzaId = pizza.Id;
    newPizza.ComboPizzaId = 0;
    newPizza.PizzaComboPizzaId = 0;
    newPizza.SizeId = pizza.SelectedPizzaPriceSize.Id;
    newPizza.Toppings = [];
    newPizza.Garnishes = [];

    if (specialRequest == 'undefined' || specialRequest == undefined || specialRequest.length < 1) {
      newPizza.SpecialRequests = '';
    } else {
      newPizza.SpecialRequests = specialRequest + ' ';
    }
    newPizza.SpecialRequests = specialRequest + ' ' || '';
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
            topping.Description == this.translationService.translate('ALL_PIZZA')) {
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
                let str = this.translationService.translate('PIZZA_QUARTER') + ' ' + i;
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

     
        return orderToppingPizza;
      });
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
        newPizza.Garnishes = garnishes;
        newPizza.Comment = newPizza.SpecialRequests
    newPizza.FullPizza = pizza;

    var dataLayerItem={
      "item_id": newPizza.PizzaId,
      "item_name":newPizza.Name,
      "price": this.itemPrice(newPizza, true),
        'quantity':1
    }
    this.dataLayerItems=[];
    this.dataLayerItems.push(dataLayerItem);
    window['dataLayer'].push({
      'event': 'add_to_cart',
      'items': this.dataLayerItems,
      'currency':'ILS',
      'value': this.itemPrice(newPizza, true),
      'contents':[{'id':newPizza.PizzaId, 'quantity':newPizza.Amount}],
      'content_type': 'product_group',
      'content_ids': [newPizza.PizzaId]
   });

    return newPizza;
  }

  public itemComboPrice(combo) {
    let sum = (combo.Price * (combo.Amount || 1));
    let extraPrice = 0;
    if (combo.Pizzas) {
      combo.Pizzas.forEach((pizza) => {
        pizza.Toppings.forEach(p => {
          extraPrice += p.Price;
        })
      })
    }
    if (combo.Items) {
      combo.Items.forEach((item) => {
        item.Garnishes.forEach(g => {
          extraPrice += g.Price;
        })
      })
    }
    sum += extraPrice * (combo.Amount || 1);
    return sum;
  }

  public itemPrice(item, isPizza?) {
    //  console.log("item",item);
      if (!isPizza) {
        let sum = item.Price;
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
          if (item.Garnishes) {//FullPizza.SelectedGarnishes
            item.Garnishes.forEach((g)=> {
              sum += g.Price;
            });
             
          }
          return sum * (item.Amount || 1);
          //return sum * (item.FullPizza ? (item.FullPizza.Amount || 1) : (item.Amount || 1));
        }
      }
  
    }

    displayBranchPhone()  {
      if (AppConfig.configSettings.displayBranchPhoneLink && 
          this.currentBranch.BranchPhone != null &&  this.currentBranch.BranchPhone != undefined &&
          this.currentBranch.BranchPhone.trim() != "") {
        return true;
      } else {
        return false;
      }
    }

  private loadPizzaBuilder(pizza: PizzaAppAdvancedModel,
    pizzaSize?: PizzaSizeAppModel,
    specialRequests?: string) {
      clearInterval(this.stop);
    if (pizza.GarnishGroupsBeforePizza && pizza.GarnishGroupsBeforePizza.length > 0) { //(this.pizzaAdditionItems && this.pizzaAdditionItems.length > 0)
  
      this.pizzaBaseLoaded = false;
      this.includePizzaGarnishes(pizza,true);
    } else {
      this.pizzaBaseLoaded = true;
    }
    this.stop = setInterval(() => {
      if (this.pizzaBaseLoaded) {
        clearInterval(this.stop);
        let cls = 'modal-dialog-item-with-garnishes';
        if (this.isMobileMode()) cls = 'modal-dialog-scrollable modal-xl';

        const initialState = {
          pizza: pizza,
          pizzaPrice: pizzaSize,
          specialRequests,
          maxToppings: pizza.MaxFreeToppings,
          isCombo: false
          
        };
        this.bsModalRef = this.modalService.show(PizzaComponent,
          { initialState, class: cls });

        this.modalService.onHide
          .pipe(take(1)).subscribe(() => {
            if (this.bsModalRef.content.isSaved && this.bsModalRef.content.pizza) {
              //if (!this.isMobileMode()) {
                if(this.bsModalRef.content.pizza.GarnishGroupsAfterPizza && 
                   this.bsModalRef.content.pizza.GarnishGroupsAfterPizza.length>0 ){
                    this.includePizzaGarnishes(pizza,false);
                 // this.addToCart(this.bsModalRef.content.pizza, true, false, false, false, this.bsModalRef.content.comments );
                } else {
                  if (!this.order.OrderPizzas) {
                    this.order.OrderPizzas = [];
                  }
                  console.log("this.preparePizzaForOrder");
                  const orderPizza = this.preparePizzaForOrder(
                    this.commonFunctionsService.deepCopy(this.bsModalRef.content.pizza),
                    this.commonFunctionsService.deepCopy(this.bsModalRef.content.specialRequests));
                    orderPizza.SpecialRequests = this.bsModalRef.content.comments;
                  this.order.OrderPizzas.push(orderPizza);
                  this.checkOrderResultHeight();
                  this.orderService.recalculateSum();
                  this.loadSuccessAddingToCartMessage(false);
                //  this.resetPizza(this.bsModalRef.content.pizza);
                    this.resetPizza(pizza);
                }
 
            }
          });

      }

    }, 10);

  }

  public myPrepare (item){
     console.log("myPrepare!!!!!!!!!!!!!!!!!!!!!");
    if (!this.order.OrderPizzas) {
      this.order.OrderPizzas = [];
    }
    console.log("this.preparePizzaForOrder");
    const orderPizza = this.preparePizzaForOrder(
      this.commonFunctionsService.deepCopy(item), //this.bsModalRef.content.pizza
      this.commonFunctionsService.deepCopy(this.bsModalRef.content.specialRequests));
    this.order.OrderPizzas.push(orderPizza);
    this.checkOrderResultHeight();
    this.orderService.recalculateSum();

    this.resetPizza(this.bsModalRef.content.pizza);
   // this.resetPizza(item);
     
      this.loadSuccessAddingToCartMessage(false);

    
  }


  private loadingPizzaPopup(pizza: PizzaAppAdvancedModel) {
    // if (this.isMobileMode()==true) {
    //  this.loadPizzaSize(pizza);
    // } else {
    this.loadPizzaBuilder(pizza);
    //  }

  }

  public resetPizza(item) {
   
      if (item) {
        item.Amount = 1;
        item.SelectedGarnishes = [];
        if (item.Garnishes) {
          item.Garnishes.forEach((garnish) => {
            garnish.IsSelected = false;
            garnish.SelectedAmount = 0;
          });
        }
        if (item.GarnishGroupsBeforePizza) {
          item.GarnishGroupsBeforePizza.forEach((group) => {
            if (group && group.Garnishes) {
              group.Garnishes.forEach((grn) => {
                grn.IsSelected = false;
                grn.SelectedAmount = 0;
              })
            }
          });
        }
        if (item.GarnishGroupsAfterPizza) {
          item.GarnishGroupsAfterPizza.forEach((group) => {
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
    
  /*  if (this.pizzas && pizza) {
      const findPizza = this.pizzas.find((currentPizza) => {
        return currentPizza && currentPizza.Id === pizza.Id;
      });
      if (findPizza) {
        findPizza.Amount = 1;
        findPizza.SelectedToppings = [];
        findPizza.SelectedGarnishes = [];
        findPizza.SelectedPizzaPriceSize = undefined;
        findPizza.GarnishGroupsBeforePizza.forEach((g) => {
          g.SelectedAmount = 0;
          g.IsSelected = false;
        });
      }
    }*/
  }

  scrollHeightItemDisplayed(item) {
    return item.scrollHeight > item.clientHeight;
  }

  private stringPrice(price) {
    if (!price) {
      return '';
    }
    return price;
  }

  public displayPrice(pizza: PizzaAppAdvancedModel) {
    if (pizza) {
      return pizza.DefaultPrice ? pizza.DefaultPrice.Price :
        pizza.PizzaPrices && pizza.PizzaPrices.length > 0 && pizza.PizzaPrices[0] ?
          pizza.PizzaPrices[0].Price : undefined;
    }
  }

  public displayComboPrice(combo: ComboAppAdvancedModel) {
    if (combo) {
      return combo.Price;
    }
  }

  public showLoaderForSignInHandler(result) {
   // console.log("showLoaderForSignInHandler", result,
   // this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN));
    this.isLoaded.isSignIn = !!result;
    this.isSignedUser = !!this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.franchiseId);
  }

  /*-------------------------------------------------------------------*/

  public sortingScratchCouponsByExpirationDate() {
    if (this.scratchCoupons && Array.isArray(this.scratchCoupons)) {
      this.scratchCoupons = this.scratchCoupons.sort((item1, item2) => {
        const d1 = new Date(item1.ExpirationDate);
        const d2 = new Date(item2.ExpirationDate);
        return +d1 - +d2;
      });
    }
  }

  public fixDate(inputDate) {
    let date = new Date(inputDate);
    if (date.toString() == 'Invalid Date') {
      date = new Date(+inputDate.toString().slice(6, -2));
    }
    return date.toString();
  }

  public checkAndPrepareDates(scratchCoupons) {
    scratchCoupons.forEach((scratchCoupon) => {
      if (scratchCoupon.ExpirationDate) {
        scratchCoupon.ExpirationDate = this.fixDate(scratchCoupon.ExpirationDate);
      }
    });
  }

  public displayDate(date) {
    const d = new Date(date);
    const curr_date = d.getDate();
    const curr_month = d.getMonth() + 1;
    const curr_year = d.getFullYear();
    return (curr_date < 10 ? '0' + curr_date : curr_date) + '.' + (curr_month < 10 ? '0' + curr_month : curr_month) + '.' + curr_year;
  }

  public displayScratchCoupon(scratchCoupon) {
    setTimeout(() => {
      const matDialogRef = this.matDialog.open(ScratchCouponComponent, {
        data: {
          scratchCoupon
        },
        width: '60%',
        maxWidth: '600px',
        minWidth: '380px',
        disableClose: true,
        panelClass: 'custom-mat-dialog'
      });
      matDialogRef.afterClosed().subscribe((result) => {
        if(result){
          this.appStorageService.canStartMessages = true;
        }
        //this.displayDiscount();
      });
    }, 200);
  }

  private displayDiscount(callback?) {
    console.log("displayDiscount");
    if (!AppConfig.configSettings.ignoreCupons) {
      if (
        (this.previousRouteService.getPreviousUrl() === `/${this.franchiseId}/` ||
          this.previousRouteService.getPreviousUrl() === `/${this.franchiseId}/home`) &&
        this.discount && (this.discount.active || this.discount.alwaysActive) && this.discount.sum) {//&& this.isSignedUser
        this.matDialog.open(DiscountCouponComponent, {
          data: {
            discount: this.discount
          },
          width: '80%',
          maxWidth: '550px',
          minWidth: '350px',
          disableClose: true,
          panelClass: 'custom-mat-dialog-popup'
        }).afterClosed().subscribe((result) => {
          console.log("continue here 10");
          /*if (!this.isSignedUser) {
            console.log("continue here 12")
            this.loadSignInForm((result) => {
              if (result.isSignedIn)
                this.verifyToken();
            });
    
          }*/
          if (callback) {
            callback(result);

          }
        });
      }
    }
  }

  public getActiveCoupons() {
    const loginToken = this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.configService.franchiseId);
    if (loginToken != undefined) {
      this.isLoadedScratchCoupon = false;
      this.scratchCouponService.getActiveCoupons(loginToken)
        .subscribe((response: any) => {
          if (!this.scratchCouponWasDisplayed) {
            this.scratchCouponWasDisplayed = true;
            if (response && response.Success) {
              this.scratchCoupons = response.ActiveCoupons || [];
              this.checkAndPrepareDates(this.scratchCoupons);
              this.sortingScratchCouponsByExpirationDate();
              this.scratchCoupon = this.scratchCoupons[0];
              if (this.scratchCoupon && this.scratchCoupon.Item) {
                this.scratchCouponService.GetItem(this.scratchCoupon.Item.Id)
                  .subscribe((currentItem) => {
                    const resultCurrentItem = currentItem || {};
                    this.scratchCoupon.CurrentItem = resultCurrentItem.item;
                    if (this.scratchCoupon && this.scratchCoupon.CurrentItem) {
                      this.displayScratchCoupon(this.scratchCoupon);
                    } else {
                      //this.displayDiscount();
                    }
                    this.isLoadedScratchCoupon = true;
                  }, (error) => {
                    this.isLoadedScratchCoupon = true;
                    // this.messageService.displayServerErrorMessage();
                  });
              } else {
                //this.displayDiscount();
              }
            } else {
              //this.displayDiscount();
            }
          } else {
            this.isLoadedScratchCoupon = true;
            //this.displayDiscount();
          }
        }, (error) => {
          if (!this.scratchCouponWasDisplayed) {
            this.scratchCouponWasDisplayed = true;
          }
          this.isLoadedScratchCoupon = true;
          // this.messageService.displayServerErrorMessage();
        });
    }
  }
  /*-------------------------------------------------------------------*/

  private loadDiscountAndScratchCoupons() {
    console.log("loadDiscountAndScratchCoupons");
    this.checkDiscount(() => {
      // Scratch coupon logic:

      if (this.appStorageService.useScratchCoupon &&
        !this.appStorageService.isUsedScratchCoupon &&
        !this.appStorageService.wasScratchDisplayed) {
        this.getActiveCoupons();
      } else {

        console.log("else - displayDiscount()");
        this.displayDiscount(); //masha 31.8.22 was commented


      }
    });
  }

  public verifyToken() {
    console.log("verifyToken()")
    const token = this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.franchiseId);
    if (token) {

      this.signInOutService.verifyToken(token).subscribe((response) => {
        this.isLoaded.isDiscountLoaded = true;
        const result = response ? !!response.user : !!response;
        if (result) {
          this.user = response.user;
          this.appStorageService.appUser = this.user;
          this.appStorageService.ccTokens = response.ccTokens;
          this.appStorageService.addresses = response.addresses;
          if (AppConfig.configSettings.cancelPhoneVerification) {
            this.user.Address = null;
            this.user.IsClubMember = null;
            this.appStorageService.appUser.Address = null;
            this.appStorageService.appUser.IsClubMember = null;
          }


          if (this.appStorageService.showClubMember && 
            !this.user.IsClubMember && 
            !this.user.DontDisplayAnymore && 
            this.appStorageService.franchise.UseMembersClub && 
            !AppConfig.configSettings.cancelPhoneVerification) {
            this.openCustomerClub(false, (result) => {
              this.loadDiscountAndScratchCoupons();
              //if (result.isSignedIn)
              //this.verifyToken();
            });
          }
          else if ( this.user.IsClubMember && 
                  this.appStorageService.franchise.UseMembersClub && 
                  !AppConfig.configSettings.cancelPhoneVerification) {
                    if (this.clubMemberCategories && this.clubMemberCategories.length > 0) {
                      this.cmShopCategory = this.clubMemberCategories.find
                      (it => it.Name === "CM_SHOP");
                      if (this.cmShopCategory?.Items?.length > 0){
                        
                        this.cmShopCategory.Items.forEach((i)=>{
                          i.IsClubMemberItem = true;
                        })
                        this.displayCmShopCategory = true;
                      }
                      
                    }
                    if (this.appStorageService.showClubMember ){
                      this.openCustomerClub(true, (result) => {
                        this.loadDiscountAndScratchCoupons();
                        //if (result.isSignedIn)
                        //this.verifyToken();
                      });
                    }
                   
                   
            
          }

          else this.loadDiscountAndScratchCoupons();


          this.isLoaded.isDiscountLoaded = false;
        } else {
          console.log("NO user");
          this.appStorageService.canStartMessages = true;
          this.signInOutService.signOut();
          this.scratchCouponWasDisplayed = false;
          this.scratchCoupons = [];
          this.isLoadedScratchCoupon = false;
          this.isSignedUser = false;
    
         
          this.menuService.getDiscount(this.order.BranchId, undefined).subscribe((result) => {
            if (result) {
              this.discount = result;
              //this.displayDiscount();
            }
            this.isLoaded.isDiscountLoaded = true;
          }, (error) => {
            this.isLoaded.isDiscountLoaded = true;
          });
        }
      }, (error) => {
        this.isLoaded.isDiscountLoaded = true;
        // this.messageService.displayServerErrorMessage();
      });
      console.log("this.loadDiscountAndScratchCoupons-cont-9");


    } else {
      console.log("NO TOKEN");
      this.appStorageService.canStartMessages = true;
      this.signInOutService.signOut();
      this.scratchCouponWasDisplayed = false;
      this.scratchCoupons = [];
      this.isLoadedScratchCoupon = false;
      this.isSignedUser = false;

      this.menuService.getDiscount(this.order.BranchId, undefined).subscribe((result) => {
        if (result) {
          this.discount = result;
          //this.displayDiscount();
        }
        this.isLoaded.isDiscountLoaded = true;
      }, (error) => {
        this.isLoaded.isDiscountLoaded = true;
      });
    }
  }


  public displayPopupMessage(message, messageText, imgIcon,  callback?) {
   // if (AppConfig.configSettings.displayPopup == true) {
      let myMessageText = messageText;
      let header = this.translationService.translate('IMPORTANT_MESSAGE');
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

   // }
    //else this.flag = false;
  }

  public displayDiscount1(callback?) {

  }

  public displayBonusItems() {
    //const message = this.translationService.translate('BONUS_SECOND');
    const minForBonus = AppConfig.configSettings.minAmountForBonus;
    const firstMessage = this.translationService.translate('BONUS_FIRST');
    const bonusMSG = AppConfig.configSettings.bonusMsg;
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
        if (result && result.isSaved && result.selectedItems) {
          result.selectedItems.forEach(orderAdditionalItem => {
            this.order.OrderItems.push(orderAdditionalItem);
            this.checkOrderResultHeight();
            this.order.hasBonusItems = true;
            this.appStorageService.setItemInLocalStorage(window.location.hash, this.order);
          });
          //  this.addToCartComboItem(result.combo, comboItem);
        }
      });
    }
  }

  public directionLanguage() {
    return LanguageEnum.HE;
  }


  public countOfItems() {
    let count = 0;
    if (this.order && this.order.OrderItems) {
      count = this.order.OrderItems.reduce((sum, item) => {
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
    return count;
  }

  ngDoCheck(): void {
    // this.updateScroll();
  }

  ngOnDestroy(): void {
    if (this.navigationSubscribe) {
      this.navigationSubscribe.unsubscribe();
    }
    this.stopAutoPlayCarousel();
  }

}
