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
import {PickupsMethodsEnum} from "../../enums/pickups-methods.enum";

import { GarnishAppAdvancedModel } from '../../models/advanced/menu/garnish-app-advanced.model';
 
import { BrowserIdentificatorService } from '../../core/services/common-settings/browser-identificator.service';
import { AppStorageService } from '../../app.storage.service';
import { DiscountModel } from '../../models/discount/discount.model';
 
import { PizzaAppAdvancedModel } from '../../models/advanced/pizza/pizza-app-advanced.model';
import { MessagePopupComponent } from '../../shared/components/message-popup/message-popup.component';
import { OrderPizzaToppingAppModel } from '../../models/order/order-pizza-topping-app.model';
import { OrderPizzaAppAdvancedModel } from '../../models/advanced/order/order-pizza-app-advanced.model';
import { CommonFunctionsService } from '../../core/services/common-settings/common-functions.service';
import { ScratchCouponService } from '../../core/services/scratch-coupon.service';
 
import { SignInOutService } from '../../core/services/sign-in-out.service';
import { StorageValueEnum } from '../../enums/advanced/storage-value.enum';
import { MessageService } from '../../shared/components/message/message.service';
 
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
 
import { DragScrollComponent } from "ngx-drag-scroll";
import ComboAppModel from "../../models/combo/combo.model";
import ComboAppAdvancedModel from "../../models/advanced/combo/combo-app-advanced.model";
 
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
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import { ViewEncapsulation } from '@angular/core'
 
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

 

@Component({
  encapsulation: ViewEncapsulation.None,
  templateUrl: './tv-menu.component.html',
  styleUrls: ['./tv-menu.component.scss'],
  providers: [
    { provide: CarouselConfig, useValue: { interval: 5000, noPause: true, showIndicators: false } }
  ]
})
export class TVMenuComponent implements OnInit, DoCheck, OnDestroy, AfterViewInit, AfterViewChecked {
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


  public cancelVerification: boolean = false;
  public userJoinedClub: boolean = false;
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


  public totalCategories:number;
  public totalItems:number ;
  public loaded: boolean = false;
  public numColumns:number ;
  public numRows :number ;
  public tvTimer: number;
 // public currentPage :number;
  public itemsPerPage : number;
  public pages = [];
  public currentPage = [];
  public currentPageIndex :number;
  public currentColumnIndex:number;

  public discount: DiscountModel;
  public isSignedUser = false;// !!this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN);

  // Scratch coupon logic:
  public scratchCouponWasDisplayed = false;
  public scratchCoupons = [];
  public isLoadedScratchCoupon = true;

  public scratchCoupon = undefined;

  public minForBonus = AppConfig.configSettings.minAmountForBonus;
  public firstMessage = "";

  // Animation for slider
  @ViewChild('slickModal')
  public carousel: ElementRef;
  private interval = 5000; // in ms
  private instanceInterval;
  private index = this.slideConfig.slidesToShow;
  private timeOut = 2000; // in ms
  private timeOutInterval;
  private timerId;

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
   

  @ViewChild('nav', { read: DragScrollComponent }) ds: DragScrollComponent;
  @ViewChild('menuTopNavigationIdentifier') menuTopNavigationIdentifierOffsetHeight: any;
  menuTopNavigationIdentifierOffsetHeightValue;

  notCheckScrolling: boolean = false;
  bsModalRef: BsModalRef;

  public imgSrc: any;

  public franchiseId: string;
  public branchId: number;
  public franchise: any;

  public inLinks = this.appStorageService.inLinks;

  private isLoadedAllData: BehaviorSubject<LoadedData> = new BehaviorSubject<LoadedData>(null);
  public playVideo: boolean;
  public playCarousel: boolean;
  public browserRefresh: boolean;
  public videoPath: string;
  public imagesPath: string;
  public images: any[];
  public settings: any;
  public tvHalfScreenImg:boolean = false;
  public bgColor = "#fff"

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
    return this.deviceService.isMobile() || this.deviceService.isTablet();
  }

  
  ngOnInit() {
    this.currentColumnIndex =0;
     this.currentPageIndex = 0;
    this.loaded = false;
    this.currentDate = new Date();
    this.logoImg = AppConfig.settings.logo;
    this.numColumns = this.configService.tvColumns;
    this.numRows = this.configService.tvRows
    this.tvTimer = AppConfig.config.tvTimer * 1000;
    this.itemsPerPage = this.numRows * this.numColumns;
     
    if (this.timerId) {
     
      clearInterval(this.timerId);
    }
   //this.configService.tvRows = AppConfig.config.tvRows;
         // this.configService.tvColumns = AppConfig.config.tvColumns;
         // this.configService.tvTimer = AppConfig.config.tvTimer;
  //  this.franchiseId = this.route.snapshot.paramMap.get('franchiseId');
    
    this.route.params.subscribe(params => {
      if (params && params["franchiseId"]  && params["branchId"] ) {
        this.branchId = params["branchId"];
        this.franchiseId = params["franchiseId"];
        this.videoPath = `${AppConfig.config.tvImagePath}${this.franchiseId}/${this.branchId}/video1.mp4`;
        this.imagesPath = `${AppConfig.config.tvImagePath}${this.franchiseId}/${this.branchId}/`;
        this.images = [];
       /* if (this.doesFileExist(this.videoPath)) {
          this.playVideo = true;
        } else {
          this.playVideo = false;
        }
          for (let i = 1; i <= 20; i++) {         
            if (this.doesFileExist(this.imagesPath + i +".png")) {
              let img =  this.imagesPath + i +".png?v=" +  this.currentDate;
              this.images.push(img);
            }          
          }*/
            this.loadMediaForBranch();   // <-- fire and forget; updates playVideo and images when ready

       
       
        
        if (params["lang"]) {
          this.selectedLang = params["lang"];
          this.translationService.setLanguage(this.selectedLang);
        } else {
          this.selectedLang = "he";
          this.translationService.setLanguage(this.selectedLang);
        }
        this.imgSrc = AppConfig.settings.logo;
        this.initializeGraphics();
        this.menuService
          .getTVSettings(this.branchId).subscribe((settings_) => {
            if (settings_.TvChangeImgInterval != null &&
                settings_.TvChangeImgInterval != undefined && 
                settings_.TvChangeImgInterval > 1)
                this.tvTimer = settings_.TvChangeImgInterval * 1000;
                this.tvHalfScreenImg = settings_.TvHalfScreenImg;
            if (settings_.TvBGColor != null &&
                  settings_.TvBGColor != undefined && 
                  settings_.TvBGColor != "undefined" &&
                  settings_.TvBGColor != "" )
                this.bgColor = settings_.TvBGColor
          }, (err) => {
                            this.isLoaded = true;
          });
       

        this.menuService
              .getMenuForBranch(this.branchId, 
                                PickupsMethodsEnum.tvmenu, 
                                AppConfig.configSettings.checkItemsByTime, 
                                this.selectedLang)
                                 .subscribe((result) => {
          this.imageVersionService.updateImageUrlsOfMenu(result);
         
    
          this.appStorageService.backResultMenu = this.commonFunctionsService.deepCopy(result);
          this.appStorageService.isMenuWasLoaded = true;
          if (result) {
            this.appStorageService.categories = result.categories;
            this.appStorageService.clubMembershipCategories = result.clubMembershipCategories;
            this.appStorageService.pizzas = result.pizzas;           
            this.appStorageService.pizzaToppings = result.pizzaToppings;
            this.appStorageService.startingPage = result.startingPage;
            this.loadMenu();
            let currentPage = [];
            let currentColumn = [];
            let currentCatCounter = 0;
            for (const category of this.appStorageService.categories) {
              const categoryName = category.Name;
              const categoryDesc = category.Description;
              const items = category.Items;
              let counter = 0;
              // Add category name to the current column
              if (currentColumn.length +1 >= this.numRows) {
                
                if (currentColumn.length + 1 < this.numRows && items.length == 1) {

                } else {
                  currentPage.push(currentColumn);
                  currentColumn = [];
                  currentCatCounter = 0;
                }
              }
              currentColumn.push({ CategoryName: category.Name, CategoryDesc: category.Description});
              currentCatCounter++;

              for (const item of items) {
                // Add item to the current column
                currentColumn.push(item);
                counter++;
                // Check if the current column is full
                if (currentColumn.length >= this.numRows) {
                  currentPage.push(currentColumn);
                  currentColumn = [];
                  currentCatCounter = 0;
                  if (counter < items.length) {
                    currentColumn.push({ CategoryName: categoryName + " - המשך"});
                    currentCatCounter++;
                  }
                }
            
                // Check if the current page is full
                if (currentPage.length >= this.numColumns) {
                  this.pages.push(currentPage);
                  currentPage = [];
                }
              }
            }
            
            // Add the remaining column to the current page
            if (currentColumn.length > 0) {
              currentPage.push(currentColumn);
            }
            
            // Add the remaining page to the pages array
            if (currentPage.length > 0) {
              this.pages.push(currentPage);
            }
           
           this.timerId= setInterval(()=> {this.rotatePage()},  this.tvTimer);
          }
          
    
        }, (error) => {
          this.isLoaded = true;
          console.log("this.isLoaded = true");
          this.messageService.displayServerErrorMessage();
        });



      }
    });


   
  }

 
  private doesFileExist(url: string): Promise<boolean> {
    return fetch(url, { method: 'HEAD' })
      .then(res => res.ok)
      .catch(() => false);
  }
  
  private checkImage(url: string): Promise<boolean> {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }

  private async loadMediaForBranch(): Promise<void> {
    this.images = [];
  
    // Video check
    this.doesFileExist(this.videoPath).then(exists => {
      this.playVideo = exists;
    });
  
    // Image checks, run in parallel, kept in order
    const checks = [];
    for (let i = 1; i <= 20; i++) {
      const url = `${this.imagesPath}${i}.png`;
      checks.push(
        this.checkImage(url).then(exists =>
          exists ? { i, src: `${url}?v=${this.currentDate}` } : null
        )
      );
    }
  
    const results = await Promise.all(checks);
    this.images = results
      .filter(r => r !== null)
      .sort((a, b) => a.i - b.i)
      .map(r => r.src);
  }

   rotatePage() {
    this.currentPageIndex++;
    if (this.currentPageIndex >= this.pages.length) {
      this.currentPageIndex = 0;
    }
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

   

  private initializeMenuForBranch(continueCallBack?) {
    // if (!this.appStorageService.isMenuWasLoaded) {
    let hasPizzas: boolean = false;
    let hascCombos: boolean = false;
    //this.isLoaded = false;
    this.menuService.getMenuForBranch(this.branchId, this.appStorageService.orderType, AppConfig.configSettings.checkItemsByTime, this.translationService.language()).subscribe((result) => {
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
      this.metaDataService.getCombosForBranch(this.branchId, this.appStorageService.orderType).subscribe(result => {
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
        console.log("this.router.navigateByUrl(`/${this.franchiseId}/menu`)");

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


  

  ngAfterViewInit(): void {

  //  this.checkOrderResultHeight();
    
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
      // img.style.height = 'fit-content'
        img.style.width = '60%'
      
     }


  moveTo(index) {
    this.ds.moveTo(index);
  }

  onSectionChange(sectionId: string) {
    this.currentSection = sectionId;
    // selectCategory(this.categories.filter, true, false);
  }

  scrollTo(section) {
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
        topOffset = 128;
      } else if (this.isAppDisplayMode()) {
        topOffset = 120;
      } else {
        topOffset = 215;//158;
      }

    } else {
      topOffset = 120;
    }

    const y = element.getBoundingClientRect().top + window.pageYOffset - topOffset;
    //document.querySelector('#cat' + section).scrollIntoView();
    window.scrollTo({ top: y, behavior: 'smooth' });
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

   

  

  public checkLoading() {
    return this.isLoaded.isDiscountLoaded && this.isLoaded.isSignIn;
  }

  
  openNav() {
    document.getElementById("mySidebar").style.width = "350px";
    document.getElementById("mySidebar").style.display = "flex";
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('sidebar-show');
  }

  /*public checkDiscount(extraActions?) {
    console.log("this.user", this.user);
    console.log("checkDiscount", extraActions);
    if (this.isSignedUser) {
      console.log("checkDiscount(): this.isSignedUser");
      const token = this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN);
      if (token) {
        console.log("checkDiscount(): token",token);
        this.isLoaded.isDiscountLoaded = false;
        this.signInOutService.verifyToken(token).subscribe((response) => {
          this.isLoaded.isDiscountLoaded = true;
          console.log("checkDiscount(): response",response);
          const result = response ? !!response.user : !!response;
          if (result) {
            this.user = response.user;
             console.log("this.user", this.user);
             
            this.isLoaded.isDiscountLoaded = false;
             
                 console.log("this.branchId",this.branchId);
                 console.log("this.user",this.user);
            this.menuService.getAllDiscounts(this.branchId, this.user && this.user.Id ? this.user.Id : undefined).subscribe((result) => {
              if (result) {
                console.log("getAllDiscountsResult", result);
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
          console.log("error", error);
          // this.messageService.displayServerErrorMessage();
        });
      }


    } else {
      if (extraActions) {
        console.log("checkDiscount else extraActions", extraActions);
        extraActions();
      }
    }
  }*/

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

  public trimEmptySpace(text: string) {

    return text ? text.trim() : text;
  }

  private prepareItemsToDisplayInMenu() {

    console.log("prepareItemsToDisplayInMenu()");
    if (this.order) {
      console.log("if (this.order)");
      // ITEM SHORT INFO//
      this.categories.forEach(category => {

 

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
    this.totalCategories = this.categories.length;
     
    this.initializeAmountOfItems();
    this.prepareItemsToDisplayInMenu();

    this.defaultCategoryStartSelection();
    this.getStartingCategory(this.startingPage);
    this.scrollToSelectedCategory();

    this.loaded = true;
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
      this.categories = this.categories.filter
        (it => it.Items && it.Items.length > 0 && it.Name != this.translationService.translate('PIZZA_ADDITIONS'));
    }
    //this.menuService.getMenu().subscribe((result) => {
      //console.log("findMenu() result.categories:", result.categories);
      const upgradesCategory = this.categories.find
        (it => it.Name === this.translationService.translate('UPGRADE_CATEGORY'));
      if (upgradesCategory
        && upgradesCategory.Items
        && upgradesCategory.Items.length > 0) {
        this.upgradeItems = upgradesCategory.Items;
        this.upgradeItems.forEach(item => {
            item.Amount = 1;
        });
        this.categories = this.categories.filter
          (it => it.Items && it.Items.length > 0 && it.Name != this.translationService.translate('UPGRADE_CATEGORY'));
      }
    //});
    if (AppConfig.configSettings.bonusCategory && AppConfig.configSettings.bonusCategory != '') {
      console.log("if (AppConfig.configSettings.bonusCategory && AppConfig.configSettings.bonusCategory != '')");
      const bonusItemsCategory = this.categories.find
        (it => it.Name === AppConfig.configSettings.bonusCategory);
      if (bonusItemsCategory && bonusItemsCategory.Items
        && bonusItemsCategory.Items.length > 0) {
        this.bonusItems = bonusItemsCategory.Items;
        this.categories = this.categories.filter
          (it => it.Items && it.Items.length > 0 && it.Name != AppConfig.configSettings.bonusCategory);


      }


    }


    this.categories = this.categories.filter
    (it => it.Items && it.Items.length > 0 && it.Name != this.translationService.translate('ITEMS_FOR_COMBOS'));

    this.categories = this.categories.filter
    (it => it.Items && it.Items.length > 0 && it.Name != this.translationService.translate('UPSALE'));

    this.categories = this.categories.filter
    (it => it.Items && it.Items.length > 0 && it.Name != this.translationService.translate('CM_SHOP'));

    this.categories = this.categories.filter
    (it => it.Items && it.Items.length > 0 && it.Name != this.translationService.translate('CM_JOIN'));

    this.categories = this.categories.filter
    (it => it.Items && it.Items.length > 0 && it.Name != this.translationService.translate('CM_BIRTHDAY'));

    this.categories = this.categories.filter
    (it => it.Items && it.Items.length > 0 && it.Name != this.translationService.translate('CM_ANNIVERSARY'));

    /*this.categories = this.categories.filter
    (it => it.Items && it.Items.length > 0 && it.Name != 'UPSALE' && it.Name != 'ITEMS_FOR_COMBOS');*/

    this.categories = this.categories.filter(it => it.Items && it.Items.length > 0);



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
            return +pizzaTopping2.TotalPrice / pizzaTopping2.QuarterNums.length -
              +pizzaTopping1.TotalPrice / pizzaTopping1.QuarterNums.length
          });

          /*if (selectedPizza.ComboPizza && selectedPizza.ComboPizza.MaxToppings){

            selectedPizza.SelectedToppings.forEach(selTop => {
              if(selTop.ToppingGroupId == selectedPizza.ComboPizza.ToppingGroupId){
                console.log("top from freeTop Group - selTop", selTop);
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
                return +pizzaTopping2.TotalPrice / pizzaTopping2.QuarterNums.length -
                  +pizzaTopping1.TotalPrice / pizzaTopping1.QuarterNums.length;
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
    return orderItem;
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
          console.log("if(orderItem.Amount>1)");
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
          console.log("if(orderItem.Amount>1)");
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
        console.log("next item from same category, reset to 0");
        sortedItemsCombos[index+1].Price = 0;
      }

      else{
        console.log("next item is not from same category, keep price");
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





 
  

 

  

   

  public flicker() {
    document.getElementById("flicker").classList.add("animate-flicker");
    // const x = document.getElementById("snackbar").classList.add("show");
    // x.className = "show";

    setTimeout(() => { document.getElementById("flicker").classList.remove("animate-flicker"); }, 7000);


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
    } else {
      return this.translationService.translate('MENU_SIT');
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
          return item;
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
          && currentItem.Garnishes && currentItem.Garnishes.length === 0;
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

 /* public showLoaderForSignInHandler(result) {
    console.log("showLoaderForSignInHandler", result,
    this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN));
    this.isLoaded.isSignIn = !!result;
    this.isSignedUser = !!this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN);
  }*/

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
    if (this.order && this.order.OrderPizzas) {
      count = this.order.OrderPizzas.reduce((sum, item) => {
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
