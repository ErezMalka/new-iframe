import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MetaDataService } from '../../core/services/meta-data.service';
import { OrderReceiptModel } from '../../models/advanced/order/order-receipt.model';
import { BranchAppModel } from '../../models/franchise-branch/branch-app.model';
import { BranchFutureDatesAppModel } from '../../models/franchise-branch/branch-future-dates-app.model';
import { NgSelectConfig } from '@ng-select/ng-select';
import { TranslationsService } from '../../shared/translations/translations.service';
import { AppConfig } from '../../app.config';
import { OrderAppModel } from '../../models/order/order-app.model';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { MenuService } from '../../core/services/menu.service';
import { AppStorageService } from '../../app.storage.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { VersionImageService } from '../../core/services/common-settings/version-image.service';
import { ConfigService } from '../../core/services/common-settings/config.service';
import { CommonFunctionsService } from '../../core/services/common-settings/common-functions.service';
import { MessageService } from '../../shared/components/message/message.service';
import { MatDialog, MatDialogConfig,MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { LanguageEnum } from '../../enums/advanced/language.enum';
import { OrderOptionEnum } from '../../enums/order-option.enum';
import { SizeMobileInitializationComponent } from '../../shared/classes/size-mobile-initialization.component';
import { BrowserIdentificatorService } from '../../core/services/common-settings/browser-identificator.service';
import { SelectBranchComponent } from './select-branch/select-branch.component';
import { SelectTimeComponent } from './select-time/select-time.component';
import { SelectDateTimeComponent } from './select-date-time/select-date-time.component';
import { EntryCodeComponent } from '../../components/entry-code/entry-code.component';

import { AddressSelectionComponent } from "./address-selection/address-selection.component";
import { CityModel } from "../../models/order/city.model";
import { StorageValueEnum } from "../../enums/advanced/storage-value.enum";
import { PreviousRouteService } from "../../core/services/common-settings/previous-route.service";
import { PickupsMethodsEnum } from "../../enums/pickups-methods.enum";
import { DeviceDetectorService } from 'ngx-device-detector';
import { ModalDirective, BsModalService } from 'ngx-bootstrap/modal';
import { SignInOutService } from '../../core/services/sign-in-out.service';
import { MatSelectModule } from '@angular/material/select';
import { FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import { DialogSignInComponent } from '../../components/sign-in/popup/dialog-sign-in.component';

import { RouteActivateService } from "./route-activate.service";
 
import { MessagePopupComponent } from '../../shared/components/message-popup/message-popup.component';

class LoadedData {
  public isBranchLoaded: boolean;
  public isMenuLoaded: boolean;
  public isOpenBranchLoaded: boolean;
  public isGoingToMenu:boolean;
}

function createLoadedData(isBranchLoaded: boolean, isMenuLoaded: boolean, isOpenBranchLoaded: boolean) {
  const loadedData = new LoadedData();
  loadedData.isBranchLoaded = isBranchLoaded;
  loadedData.isMenuLoaded = isMenuLoaded;
  loadedData.isOpenBranchLoaded = isOpenBranchLoaded;
  return loadedData;
}

@Component({
  templateUrl: './home.component_new.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit { //extends SizeMobileInitializationComponent 

  @ViewChild('branchSelection') branchSelection: TemplateRef<any>;

  public graphics = {
    logo: '',
    cover: '',
    coverMobile: '',
    sitUrlImage: '',
    takeAwayUrlImage: '',
    deliveryUrlImage: '',
    homeHeaderPartUrlImage: '',
    sitUrlImageMobile: '',
    takeAwayUrlImageMobile: '',
    deliveryUrlImageMobile: '',
    homeHeaderPartUrlImageMobile: '',
    coverBackground2: '',
    coverBackground2Mobile: ''
  };

  public colors = {
    menuColor: '',
    buttonColor: '',
    mainButtonColor: ''
  };

  public lang: string;
  public openLangSelector:boolean;

  public branches: BranchAppModel[] = [];
  public selectedBranch: BranchAppModel;
  public selectedOrderReceipt: OrderReceiptModel;
  public orderReceipt: OrderReceiptModel;
  public selectedFutureTime: string;
public multilingual:boolean = false;
  public branchControl = new FormControl();
  public filteredBranches: Observable<BranchAppModel[]>;
  public _filteredBranches: BranchAppModel[] = [];
  isInitialized = false;

  public isLoaded: any = {
    isDeliveryDataLoaded: true,
    isBranchOpenLoaded: true,
  };
  public branchLoaded = false;

  public displayMobileMode = false;

  public cities: CityModel[];

  private order: OrderAppModel;
  private isLoadedAllData: BehaviorSubject<LoadedData> = new BehaviorSubject<LoadedData>(null);
  private loadedData = new LoadedData();
  private franchiseId: string;
private trackingParamsLoaded: boolean=false;
  public sitBtnTxt: string;
  public taBtnTxt: string;
  public deliveryBtnTxt: string;

  public languages: any[] = [];
  public langControl = new FormControl();
  public selectedLang : string = this.translationsService.language();
  public selectedFlag : any;

  public txtColor: any;
  public message: string;
  public displayFutureDates:boolean = false;
  public isSignedUser: boolean = false;

public phoneNumber:string;
  


  constructor(private metaDataService: MetaDataService,
    private config: NgSelectConfig,
    private translationsService: TranslationsService,
    private router: Router,
    private route: ActivatedRoute,
    private orderService: OrderService,
    private menuService: MenuService,
    private appStorageService: AppStorageService,
    private imageVersionService: VersionImageService,
    private configService: ConfigService,
    private commonFunctionsService: CommonFunctionsService,
    private matDialog: MatDialog,
    protected signInOutService: SignInOutService,
    private routeActivate: RouteActivateService,
    private messageService: MessageService,
    private deviceService: DeviceDetectorService,
    protected browserIdentificatorService: BrowserIdentificatorService,
    private previousRouteService: PreviousRouteService) {
     // this.routeActivate.canActivateHome = false;
    //super(browserIdentificatorService);
    this.setNgSelectConfig();
  }


  initEventTracking({
    facebookPixelIds = [],
    tiktokPixelIds = [],
    ga4MeasurementId,
    googleAdsConversionId,
    googleAdsConversionLabels = {}
  }: {
    facebookPixelIds?: string[],
    tiktokPixelIds?: string[],
    ga4MeasurementId?: string,
    googleAdsConversionId?: string,
    googleAdsConversionLabels?: { [key: string]: string }
  }) {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // TikTok Pixels
    tiktokPixelIds.forEach((id) => {
      if (!(window as any).ttq) {
        (function (w: any, d: Document, t: string) {
          w[t] = w[t] || [];
          const ttq = w[t];
          ttq.methods = ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group', 'enableCookie'];
          ttq.setAndDefer = function (t: any, e: any) {
            t[e] = function () {
              t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
            };
          };
          for (let i = 0; i < ttq.methods.length; i++) {
            ttq.setAndDefer(ttq, ttq.methods[i]);
          }
          ttq.load = function (e: string) {
            const scriptId = `ttq-script-${e}`;
            if (document.getElementById(scriptId)) return;
            const o = document.createElement('script');
            o.async = true;
            o.src = `https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=${e}&lib=ttq`;
            o.id = scriptId;
            const a = document.getElementsByTagName('script')[0];
            a.parentNode?.insertBefore(o, a);
            ttq._i = ttq._i || {};
            ttq._i[e] = [];
          };
          ttq.load(id);
          ttq.page();
        })(window, document, 'ttq');
      }
    });

    // Facebook Pixels
    facebookPixelIds.forEach((id) => {
      if (!(window as any).fbq) {
        const f = window as any;
        const n: any = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        f.fbq = n;
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = '2.0';
        n.queue = [];
    
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://connect.facebook.net/en_US/fbevents.js';
        const firstScript = document.getElementsByTagName('script')[0];
        firstScript.parentNode?.insertBefore(script, firstScript);
      }
    
      (window as any).fbq('init', id);
      (window as any).fbq('track', 'PageView');
    });

    // GA4 & Google Ads
    if (ga4MeasurementId || googleAdsConversionId) {
      (window as any).dataLayer = (window as any).dataLayer || [];
      const gtag = function () {
        (window as any).dataLayer.push(arguments);
      };
      (window as any).gtag = gtag;

      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${ga4MeasurementId || googleAdsConversionId}`;
      script.async = true;
      document.head.appendChild(script);

      (window as any).gtag('js', new Date());
      if (ga4MeasurementId) (window as any).gtag('config', ga4MeasurementId);
      if (googleAdsConversionId) (window as any).gtag('config', googleAdsConversionId);
    }

    // Intercept dataLayer push
    const originalPush = (window as any).dataLayer.push;
    (window as any).dataLayer.push = (...args: any[]) => {
      for (const arg of args) {
        if (typeof arg === 'object' && arg.event) {
          const extended = {
            ...arg,
            unique_event_id: this.generateUniqueId(),
            currency: arg.currency || 'ILS',
            content_type: arg.content_type || 'product'
          };
          this.handleEvent(extended, googleAdsConversionId, googleAdsConversionLabels);
        }
      }
      return originalPush.apply((window as any).dataLayer, args);
    };
  }

  private handleEvent(eventData: any, googleAdsConversionId: string, labels: any) {
    const {
      event, value, currency, items = [], contents = [],
      content_type, search_term, item_list_name,
      transaction_id, user_id, unique_event_id
    } = eventData;

    const fbq = (window as any).fbq;
    const ttq = (window as any).ttq;
    const gtag = (window as any).gtag;

    // Facebook
    if (fbq) {
      const fbParams = { value, currency, contents, content_type, eventID: unique_event_id };
      const fbEventMap: any = {
        add_to_cart: 'AddToCart',
        purchase: 'Purchase',
        view_item: 'ViewContent',
        begin_checkout: 'InitiateCheckout',
        search: 'Search'
      };
      if (event in fbEventMap) fbq('track', fbEventMap[event], fbParams);
      else if (event === 'view_item_list') {
        fbq('trackCustom', 'ViewCategory', { content_name: item_list_name, eventID: unique_event_id });
      }
    }

    // TikTok
    if (ttq) {
      const ttqEventMap: any = {
        add_to_cart: 'AddToCart',
        purchase: 'CompletePayment',
        view_item: 'ViewContent',
        begin_checkout: 'InitiateCheckout',
        search: 'Search',
        view_item_list: 'ViewCategory'
      };
      if (event in ttqEventMap) {
        ttq.track(ttqEventMap[event], {
          value,
          currency,
          contents,
          content_type,
          event_id: unique_event_id
        });
      }
    }

    // GA4 / Google Ads
    if (gtag) {
      gtag('event', event, {
        currency,
        value,
        items,
        transaction_id,
        user_id,
        search_term,
        item_list_name,
        event_id: unique_event_id
      });

      const label = labels[event];
      if (label && googleAdsConversionId) {
        gtag('event', 'conversion', {
          send_to: `${googleAdsConversionId}/${label}`,
          value,
          currency,
          transaction_id,
          event_id: unique_event_id
        });
      }
    }

    if (window.location.hostname === 'localhost') {
    }
  }

  private generateUniqueId(): string {
    return 'bite_tech_evt_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }





  selectedLangChanged(event: any) {
      this.translationsService.setLanguage(this.selectedLang)
  }

  private getAppLanguages() {
    this.selectedLang = this.translationsService.language();
    this.languages =[];
    this.languages =this.languages.concat({Id:0, Name: "עברית", Code:"he"});
    this.signInOutService.getAppLanguages()
      .subscribe((response) => {
        if (response) {
          this.appStorageService.languages =response;
          this.languages = this.appStorageService.languages; //this.languages.concat(response);
          //this.selectedLang = "he";
          //this.selectedLang = "he"

          if (AppConfig.configSettings.displayPopup == true) {
  
            this.displayPopupMessage((result) => {
    
              if (!result.isDigitalMenu) {
                const mySec = document.getElementsByClassName("btn-animate");
    
                for (let index = 0; index < mySec.length; index++) {
                  mySec[index].classList.add('animate__animated', 'animate__bounceInDown');
                  setTimeout(() => {
                    mySec[index].classList.remove('animate__animated', 'animate__bounceInDown');
                  }, 2000);
                }
    
              }
    
            });
          }
    
          else {
            const mySec = document.getElementsByClassName("btn-animate");
    
            for (let index = 0; index < mySec.length; index++) {
              mySec[index].classList.add('animate__animated', 'animate__bounceInDown');
              setTimeout(() => {
                mySec[index].classList.remove('animate__animated', 'animate__bounceInDown');
              }, 2000);
            }
          }
        }
    }, (error) => {
      //this.messageService.displayServerErrorMessage();
    });
  }

  displayFranchisePhone()  {
    if (AppConfig.configSettings.displayFranchisePhoneLink && 
        this.phoneNumber != null &&  this.phoneNumber != undefined &&
        this.phoneNumber.trim() != "") {
      return true;
    } else {
      return false;
    }
  }

  myCheck() : boolean {
    return this.deviceService.isTablet();
  }



  isMobileMode(): boolean {
    //console.log("this.deviceService.isTablet()",this.deviceService.isTablet());
    return this.deviceService.isMobile() || this.deviceService.isTablet();
  }

  isDigitalMenu(): boolean {
    if (AppConfig.configSettings.isDigitalMenu
      && AppConfig.configSettings.isDigitalMenu == true) {
      return true;
    } else {
      return false;
    }
  }

  displayLogo(): boolean {
    //console.log("displayLogo()");
    if (AppConfig.settings.logo) {
        //console.log("displayLogo() - true");
      return true;
    } else {
      return false;
    }
  }


  private defaultInitializeMenu() {
    this.isLoadedAllData
      .next(createLoadedData(false, true, false));
  }

  ngOnInit() {
      this.trackingParamsLoaded = false;
    this.multilingual = AppConfig.configSettings.multilingual;
    this.phoneNumber = this.appStorageService?.franchise?.ManagerPhone;
    this.displayFutureDates = true;
    let _order =this.appStorageService.getItemFromLocalStorage(this.configService.currentUrl);
    if ( _order != null && _order != undefined) {
      this.isLoaded = false;
      this.initializeGraphics();
      this.franchiseId = this.route.snapshot.paramMap.get('franchiseId');
     
      this.orderService.setOrder(_order);
      this.initializeOrder();
       
      let method: PickupsMethodsEnum;
      if (this.order.IsSit) {
        this.appStorageService.orderType = PickupsMethodsEnum.eatinbranch;        
      } else if ( this.order.IsTakeAway) {
        this.appStorageService.orderType = PickupsMethodsEnum.takeaway;        
      } else  if ( this.order.IsDelivery){
        this.appStorageService.orderType = PickupsMethodsEnum.delivery;      
      }   else  if ( this.order.IsDigitalMenu){
        this.appStorageService.orderType = PickupsMethodsEnum.digitalmenu;      
      }     
      this.metaDataService.getFranchiseWithBranches( this.appStorageService.orderType).subscribe((data) => {
        this.appStorageService.backResultFranchiseBranches = this.commonFunctionsService.deepCopy(data);
        this.appStorageService.isFranchiseBranchesWasLoaded = true;
        // console.log("data",  data);
        if (data) {
          this.branches = data.branches || [];
          this.appStorageService.franchise = data.franchise;
         this.phoneNumber = data.franchise.ManagerPhone;
          if (data.Policy){
            this.appStorageService.privacyPolicy = data.Policy.PrivacyPolicy;
            this.appStorageService.memberClubPolicy = data.Policy.MembersClubPolicy;
            this.appStorageService.Terms = data.Policy.Terms;
            this.appStorageService.Info = data.Policy.Info;
            this.appStorageService.MoreInfo = data.Policy.MoreInfo;
          }
          // this.initializeOrderReceipt();
          let currentBranch = this.branches.find((b) => { return b.Id == this.order.BranchId });
         // currentBranch.DeliveryBranchGroup = 
         
          if (currentBranch != undefined) {
            this.appStorageService.branch = currentBranch;
             if (currentBranch.EventTrackingParams != undefined && 
                currentBranch.EventTrackingParams != null && 
                currentBranch.EventTrackingParams != "" && !this.trackingParamsLoaded){
                  try {
                    // Code that might throw an error
                    const trackingParams = JSON.parse(currentBranch.EventTrackingParams);
                    this.initEventTracking(trackingParams);
                      this.trackingParamsLoaded = true;
                  } catch (error) {
                    // Handle the error
                  }
                }
            if (_order.IsFutureOrder &&  _order.FutureDateModel != undefined &&  _order.FutureDateModel != null) { 
    this.initializeFutureMenuForBranch(() => {
              let pathArr: string[] =  this.configService.currentUrl.split('/');
              this.router.navigateByUrl('/'+ pathArr[1]+ '/'+ pathArr[2]);
            //  this.router.navigateByUrl(`/${this.franchiseId}/menu`);
            });
            }  else {
 this.initializeMenuForBranch(() => {
              let pathArr: string[] =  this.configService.currentUrl.split('/');
              this.router.navigateByUrl('/'+ pathArr[1]+ '/'+ pathArr[2]);
            //  this.router.navigateByUrl(`/${this.franchiseId}/menu`);
            });
            }
           
          } else {
            this.isLoaded = true;
            this.messageService.displayServerErrorMessage();
          }

        } else {
          this.isLoaded = true;
          this.messageService.displayServerErrorMessage();
        }


      }, (error) => {
        this.isLoaded = true;
        this.messageService.displayServerErrorMessage();
      });

    }  else if (this.configService.branchId && this.configService.isTVMenu) {
      this.isLoaded = false;
      this.initializeGraphics();
      this.franchiseId = this.route.snapshot.paramMap.get('franchiseId');
      this.router.navigateByUrl(`/${this.franchiseId}/${this.configService.branchId}/tv`);

      } else if (this.configService.branchId &&
      (this.configService.isEatIn || this.configService.isTakeaway || this.configService.isMenu)) {
      this.isLoaded = false;
      this.initializeGraphics();
      this.franchiseId = this.route.snapshot.paramMap.get('franchiseId');
      this.initializeOrder();
      this.order.BranchId = this.configService.branchId;
      let method: PickupsMethodsEnum;
      if (this.configService.isEatIn) {
        this.appStorageService.orderType = PickupsMethodsEnum.eatinbranch;
        this.order.IsSit = true;
      } else if (this.configService.isTakeaway) {
        this.appStorageService.orderType = PickupsMethodsEnum.takeaway;
        this.order.IsTakeAway = true;
      } else {
        this.appStorageService.orderType = PickupsMethodsEnum.digitalmenu;
        this.order.IsDigitalMenu = true;
      }
      method = this.appStorageService.orderType;
      //if (this.order.IsDigitalMenu) method = PickupsMethodsEnum.delivery;
      this.metaDataService.getFranchiseWithBranches(method).subscribe((data) => {
        this.appStorageService.backResultFranchiseBranches = this.commonFunctionsService.deepCopy(data);
        this.appStorageService.isFranchiseBranchesWasLoaded = true;
        // console.log("data",  data);
        if (data) {

          this.branches = data.branches || [];
          this.appStorageService.franchise = data.franchise;
          this.appStorageService.franchise = data.franchise;
          this.phoneNumber = data.franchise.ManagerPhone;
          if (data.Policy){
            this.appStorageService.privacyPolicy = data.Policy.PrivacyPolicy;
            this.appStorageService.memberClubPolicy = data.Policy.MembersClubPolicy;
            this.appStorageService.Terms = data.Policy.Terms;
            this.appStorageService.Info = data.Policy.Info;
            this.appStorageService.MoreInfo = data.Policy.MoreInfo;
          }
          // this.initializeOrderReceipt();
          let currentBranch = this.branches.find((b) => { return b.Id == this.configService.branchId });
          //console.log("currentBranch",  currentBranch);
          if (currentBranch != undefined) {
            this.appStorageService.branch = currentBranch;
             if (currentBranch.EventTrackingParams != undefined && 
                currentBranch.EventTrackingParams != null && 
                currentBranch.EventTrackingParams != "" && !this.trackingParamsLoaded){
                  try {
                    // Code that might throw an error
                    const trackingParams = JSON.parse(currentBranch.EventTrackingParams);
                    this.initEventTracking(trackingParams);
                      this.trackingParamsLoaded = true;
                  } catch (error) {
                    // Handle the error
                  }
                }
            this.initializeMenuForBranch(() => {

              this.router.navigateByUrl(`/${this.franchiseId}/menu`);
            });
          } else {
            this.isLoaded = true;
            this.messageService.displayServerErrorMessage();
          }

        } else {
          this.isLoaded = true;
          this.messageService.displayServerErrorMessage();
        }


      }, (error) => {
        this.isLoaded = true;
        this.messageService.displayServerErrorMessage();
      });

    } else {

      this.message = AppConfig.configSettings.popupMsg;
      this.openLangSelector = false;
      if (AppConfig.configSettings.sitBtnTxt != undefined
        && AppConfig.configSettings.sitBtnTxt != null
        && AppConfig.configSettings.sitBtnTxt != "") this.sitBtnTxt = AppConfig.configSettings.sitBtnTxt
      else this.sitBtnTxt = this.translationsService.translate('HOME_OPTION_SIT');

      if (AppConfig.configSettings.taBtnTxt != undefined
        && AppConfig.configSettings.taBtnTxt != null
        && AppConfig.configSettings.taBtnTxt != "") this.taBtnTxt = AppConfig.configSettings.taBtnTxt
      else this.taBtnTxt = this.translationsService.translate('HOME_OPTION_TAKE_AWAY');

      if (AppConfig.configSettings.deliveryBtnTxt != undefined
        && AppConfig.configSettings.deliveryBtnTxt != null
        && AppConfig.configSettings.deliveryBtnTxt != "") this.deliveryBtnTxt = AppConfig.configSettings.deliveryBtnTxt
      else this.deliveryBtnTxt = this.translationsService.translate('HOME_OPTION_DELIVERY');

      this.checkSigning();

      if (this.isDigitalMenu()) {
        this.initializeOrder();
        this.metaDataService.getFranchiseWithBranches(PickupsMethodsEnum.delivery).subscribe((franchiseResult) => {
          if (franchiseResult && franchiseResult.branches) {
            this.order.BranchId = franchiseResult.branches[0].Id;
            this.initializeMenuForBranch(() => {
              this.router.navigateByUrl(`${this.franchiseId}/menu`);

            });
          }
        });

      } else {
        this.franchiseId = this.route.snapshot.paramMap.get('franchiseId');
        this.isLoaded = false;
        //this.resetPickupOrderType();//02-09-21 Tanya: for not resetting order
        this.initializeOrder();
        this.initializeGraphics();
        this.defaultInitializeMenu();
        // this.initializeMenu();
        this.initializeBranches();
        this.checkLoadingData();
        this.getAppLanguages();
  

  
   
        // For default data
        if (
          this.appStorageService.isFranchiseBranchesWasLoaded) {
          // this.appStorageService.isMenuWasLoaded &&
          this.isLoaded = true;
          console.log("this.isLoaded = true");
        }
      }
      
      //this.initializeSize();
    }
  }




  //public changeLanguage(event: any) {
   // console.log("this.translationService.language",this.translationsService.language());
   // this.translationsService.setLanguage(this.selectedLang);
   // console.log("this.translationService.language",this.translationsService.language());
     
 // }

  public displayPopupMessage(callback?) {
    if (AppConfig.configSettings.displayPopup == true) {
      let header = this.translationsService.translate('IMPORTANT_MESSAGE');
      let icon = "../../../assets/images/items/important-message.svg";
      const myMessageText = AppConfig.configSettings.popupMsg;

      if (myMessageText) {
        const matDialogRef = this.matDialog.open(MessagePopupComponent, {
          data: {
            header,
            icon,
            myMessageText,
            withoutTimeout: true
          },
          minWidth: '345px',
          disableClose: true,
          panelClass: 'custom-mat-dialog-popup'
        });

        matDialogRef.afterClosed().subscribe((result) => {
          if (callback) {
            callback(result);
    
          }
        });
      }
    }
  }

 public loadSignInForm(){
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
    });
  matDialogRef.componentInstance.signInCompleted
    .subscribe((result) => {
      //this.loadOrderUserDataToUser(this.order);
      this.isSignedUser = result;
      if (this.isSignedUser) {
        //this.completeOrder(true);
      }
    });
  matDialogRef.afterClosed().subscribe((result: any) => {
    this.checkSigning();
    

  });
}

 

 public pickTextColorBasedOnBgColorAdvanced(bgColor, lightColor, darkColor) {
  var color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
  var r = parseInt(color.substring(0, 2), 16); // hexToR
  var g = parseInt(color.substring(2, 4), 16); // hexToG
  var b = parseInt(color.substring(4, 6), 16); // hexToB
  var uicolors = [r / 255, g / 255, b / 255];
  var c = uicolors.map((col) => {
    if (col <= 0.03928) {
      return col / 12.92;
    }
    return Math.pow((col + 0.055) / 1.055, 2.4);
  });
  var L = (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2]);
  return (L > 0.179) ? darkColor : lightColor;
}
  public changeLanguage(lang) {

    this.translationsService.setLanguage(lang.Code);
    this.selectedLang = this.translationsService.language();
    //document.getElementById("lang-selector").style.display = "none";
    this.openLangSelector = !this.openLangSelector;
     
  }

  public openLangBar(){
   // console.log("this.openLangSelector",this.openLangSelector);
    this.openLangSelector = !this.openLangSelector;
   // console.log("this.openLangSelector",this.openLangSelector);
   // console.log ("lang-selector",document.getElementById("lang-selector").style.display );
   // if (document.getElementById("lang-selector").style.display == "none")
    //  document.getElementById("lang-selector").style.display == "block";
    //else  document.getElementById("lang-selector").style.display = "none";

  }

  public resetPickupOrderType() {
    this.appStorageService.orderType = undefined;
  }

  public checkSigning(result?) {
    let isSignedUser = !!result;
    isSignedUser = !!this.appStorageService
      .getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN );
  }

  public displayFn(branch?: BranchAppModel): string | undefined {
    return branch ? branch.Name : undefined;
  }

  private isAnySelected(order) {
    return Object.keys(order).some((key) => {
      return order[key];
    });
  }

  private pickupOrderMethod() {
    if (this.selectedOrderReceipt) {
      if (this.selectedOrderReceipt.isDelivery) {
        this.appStorageService.orderType = PickupsMethodsEnum.delivery;
      } else if (this.selectedOrderReceipt.isSit) {
        this.appStorageService.orderType = PickupsMethodsEnum.eatinbranch;
      } else if (this.selectedOrderReceipt.isTakeAway){
        this.appStorageService.orderType = PickupsMethodsEnum.takeaway;
      } else {
        this.appStorageService.orderType = PickupsMethodsEnum.digitalmenu;
      }
    }
  }

  private cancelOptionSelection() {
    this.selectedOrderReceipt.isSit = false;
    this.selectedOrderReceipt.isDelivery = false;
    this.selectedOrderReceipt.isTakeAway = false;
    this.selectedOrderReceipt.isDigitalMenu = false;
    this.order.IsDelivery = false;
    this.order.IsTakeAway = false;
    this.order.IsDigitalMenu = false;
  }

  private completeSelectOptionForBranches() {
    let width : string = "";
    let maxWidth: string = "";
    if(this.isMobileMode()){
      width="350px"
      maxWidth="350px"
    }
    else{
       width="580px"
       maxWidth="580px"
    }
    if (this.isAnySelected(this.selectedOrderReceipt)) {//} && this.isMobileBrowser()) {
      this.displayMobileMode = true;
      // if (this.branches.length > 1) {
      if (this._filteredBranches.length > 1) {
        this._filteredBranches.sort((a,b) => Number(b.IsOpenForDelivery) - Number(a.IsOpenForDelivery));
        const dialogRef = this.matDialog.open(SelectBranchComponent, {
          data: {
            branches: this._filteredBranches,
            selectedOrderReceipt: this.selectedOrderReceipt,
            orderReciept: this.orderReceipt,
            order: this.order
          },
          panelClass: 'custom-mat-dialog-branch',
          maxWidth: maxWidth,
          width: width,
          maxHeight: "900px",
          //width: '100%',
          //maxWidth: '1000px'
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result && result.isSaved) {
            this.selectedBranch = result.selectedBranch;
            this.order.deliveryGroup = this.selectedBranch.DeliveryBranchGroup;
          console.log(" this.continueOrder()");
            this.continueOrder();
          } else {
            console.log(" this.cancelOptionSelection();");
            this.cancelOptionSelection();
          }
        });
      } else if (this._filteredBranches.length === 1) {
        // if (this.branches.length === 1) {
        this.order.BranchId = this._filteredBranches[0].Id;
        this.appStorageService.branch = this.selectedBranch = this._filteredBranches[0];
        this.order.deliveryGroup = this._filteredBranches[0].DeliveryBranchGroup;
          console.log(" this.continueOrder()");
        this.continueOrder();
        // }
      }
    } else {
      this.selectedBranch = this._filteredBranches[0];
      this.displayMobileMode = false;
      // if (this.branches.length === 1) {
      if (this._filteredBranches.length === 1) {
        this.order.BranchId = this._filteredBranches[0].Id;
        this.appStorageService.branch = this.selectedBranch = this._filteredBranches[0];
          console.log(" this.continueOrder()");
        this.continueOrder();
      } else {

      }
    }
  }

  public selectCurrentOrderReceipt(isSit, isDelivery, isTakeAway, isDigitalMenu) {
    //this.resetPickupOrderType();
   // this.orderService.resetOrder();
   this.order.OrderItems = [];
   this.order.OrderPizzas = [];
   this.order.OrderCombos = [];
   this.order.hasBonusItems = false;
   this.order.Sum = 0;
    this.selectedOrderReceipt.isSit = isSit;
    this.selectedOrderReceipt.isDelivery = isDelivery;
    this.selectedOrderReceipt.isTakeAway = isTakeAway;
    this.selectedOrderReceipt.isDigitalMenu = isDigitalMenu;
    this.pickupOrderMethod();
    this.order.IsDelivery = isDelivery;
    //console.log("selectCurrentOrderReceipt:order.isDigitalMenu",isDigitalMenu);
    this.order.IsTakeAway = isTakeAway;
    this.order.IsSit = isSit;
    this.order.IsDigitalMenu = isDigitalMenu;

    if ((AppConfig.configSettings.useCodeForDelivery && isDelivery) ||
        (AppConfig.configSettings.useCodeForTakeaway && isTakeAway) ||
        (AppConfig.configSettings.useCodeForSit && isSit)) {
      let position: any;
      if(this.isMobileMode()){
        position = {top: '5vh'};
      }
      else{
        position = {} 
      }
    const matDialogRef = this.matDialog.open(EntryCodeComponent, {
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
    
    matDialogRef.afterClosed()
      .subscribe((result) => {
        if (result) {
          this.selectedBranch = undefined;
          this.branchControl.setValue('');
          if (!this.order.IsDelivery) {
            this._filteredBranches = this.selectBranchesByOrderReceipt();
      
            this.completeSelectOptionForBranches();
          } else {
            if (AppConfig.configSettings.deliveryDetailsAtCheckout){
              this._filteredBranches = this.selectBranchesByOrderReceipt();
              this.order.BranchId = this._filteredBranches[0].Id;
              this.appStorageService.branch = this.selectedBranch = this._filteredBranches[0];
                console.log(" this.continueOrder()");
              this.continueOrder();
            } else {
              this.displayAddressInformation((result) => {
                if (result.isSaved) {
                  this.isLoaded = false;
                  this.prepareBranchDeliveryGroups(result);
                  // this.addressBranchHandler(result);
                  this.completeSelectOptionForBranches();
                  //this.isLoaded = true;
                }
        
              });
            }
           
          }
        }
        }, (error) => {
        });


      
    } else {
      this.selectedBranch = undefined;
      this.branchControl.setValue('');
      if (!this.order.IsDelivery) {
        this._filteredBranches = this.selectBranchesByOrderReceipt();
  
        this.completeSelectOptionForBranches();
      } else {
        if (AppConfig.configSettings.deliveryDetailsAtCheckout){
          this._filteredBranches = this.selectBranchesByOrderReceipt();
          this.order.BranchId = this._filteredBranches[0].Id;
          this.appStorageService.branch = this.selectedBranch = this._filteredBranches[0];
            console.log(" this.continueOrder()");
          this.continueOrder();
        } else {
          this.displayAddressInformation((result) => {
            if (result.isSaved) {
              this.isLoaded = false;
              this.prepareBranchDeliveryGroups(result);
              // this.addressBranchHandler(result);
              this.completeSelectOptionForBranches();
              //this.isLoaded = true;
            }
    
          });
        }
       
      }
    }

  
   
  }

  private prepareBranchDeliveryGroups(result) {
    this.isLoaded = false;
    
    this._filteredBranches = this.selectBranchesByOrderReceipt();
    if (result.availableGroups) {
      this._filteredBranches = this._filteredBranches.filter((item) => {
        const find = result.availableGroups.find(i => i.branchID === item.Id);
        if (find) {
          item.DeliveryBranchGroup = find.group;
        }
        this.isLoaded = true;
        return !!find;
       
      });
    }// else {this.isLoaded = true; }
  }

  private addressBranchHandler(result) {
    this.continueOrderHandler();
  }

  public isSomeOrderOptionsAvailable() {
    if (this.orderReceipt) {
      return this.orderReceipt.isSit || this.orderReceipt.isTakeAway ||
        this.orderReceipt.isDelivery;
    } else {
      return false;
    }
  }

  public isSomeOptionsSelected() {
    if (this.selectedOrderReceipt) {
      return this.selectedOrderReceipt.isSit || this.selectedOrderReceipt.isTakeAway ||
        this.selectedOrderReceipt.isDelivery || this.selectedOrderReceipt.isDigitalMenu;
    } else {
      return false;
    }
  }

  public isAvailableContinue() {
    return this.selectedBranch && (this.selectedOrderReceipt && (this.selectedOrderReceipt.isSit ||
      this.selectedOrderReceipt.isDelivery || this.selectedOrderReceipt.isTakeAway
      || this.selectedOrderReceipt.isDigitalMenu)) &&
      this.order && this.order.BranchId && this.order.IsTakeAway !== undefined &&
      this.order.IsDelivery !== undefined;
  }

  public selectBranch(branch: BranchAppModel) {

    if (branch && branch.Id) {
      //this.selectedBranch = branch;
      this.order.BranchId = branch.Id;
      this.appStorageService.branch = branch;
    }
  }

  private displayPopupMessageIsClosedBranch(branch) {
    let header = this.translationsService.translate('PAY_ATTENTION');
    let icon = "../../../assets/images/items/branch-close.svg";
    let isBranchClose = true;
    let message = this.translationsService.translate('ORDER_BRANCH_CLOSED_NOW')+" ";
    if (!branch.IsClosedToday) {
      message += " ";
      if(branch.IsOpenForDelivery){
        message += (this.translationsService.translate('FOR_TA')) + '\n' + (this.translationsService.translate('BRANCH_OPEN_FOR_DELIVERY'));
      }
      if(branch.IsOpenForTA){
        message += (this.translationsService.translate('FOR_DELIVERY')) + '\n' + (this.translationsService.translate('BRANCH_OPEN_FOR_TA'));
      }
    }
    
    let workingHours = "";
    if (branch) {
      message += '\n' + (branch.IsClosedTodayComment || '');
      if (branch.WorkingHoursStr) {
        message += '\n' + (this.translationsService.translate('ORDER_OPENTIME'));
        //message += '\n \n' + (branch.WorkingHoursStr || '');
        workingHours= (branch.WorkingHoursStr || '');
      }
    }
    const data = {
      isBranchClose,
      header,
      icon,
      message,
      withoutTimeout: true,
      isUsedPre: true,
      workingHours,
      workingHoursArr: branch.WorkingHours
    };
    this.messageService.displayPopupMessage(data, (result) => {
      if (result.isDigitalMenu) {
        this.selectCurrentOrderReceipt(false, false, false, true);
      }
     });
  }

  public continueOrder() {
    this.isLoaded = false;
    /*if (this.order.IsDelivery) {
      this.displayAddressInformation();
    } else {*/
    this.continueOrderHandler();
    // }
  }

  private displayAddressInformation(callback?) {
    let width : string = "";
    let maxWidth: string = "";
    let position: any;
    if(this.isMobileMode()){
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
        branch: this.selectedBranch,
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
      this.isLoaded = false;
      //console.log("result",result);
      //console.log("callback",callback);
      if (result && result.order && result.isSaved) {
        if (callback) {
         
          callback(result);
        } else {
          this.continueOrderHandler(); // for default logic (as before)
        }
      } else {
        this.isLoaded = true;
      }
    });
  }

   isToday(dateStr: string): boolean {
  // Split the date string (e.g., "26/10/25")
  const [day, month, year] = dateStr.split('/').map(Number);

  // Note: '25' means 2025 – adjust if needed
  const fullYear = year < 100 ? 2000 + year : year;

  // Create a Date object
  const date = new Date(fullYear, month - 1, day);

  // Get today's date (without time)
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}


  private continueOrderHandler() {
    let branch = undefined;
    let branchDeliveryTimeOptions: string[] = [];
    let branchFutureDates: BranchFutureDatesAppModel[];
    let description: string;
    let futureOrderAvailable: boolean = false;
    this.order.BranchId = this.selectedBranch.Id;
    if (this.selectedOrderReceipt.isDelivery) {
      description = this.translationsService.translate('HOME_FUTURE_DELIVERY');
    } else {
      description = this.translationsService.translate('HOME_FUTURE_PICKUP');
    }

    ///Tanya 01-09-22
    AppConfig.settings.taxId =   this.appStorageService.franchise.AndroidName; ///???
    branch = this.branches.find((brnch) => {
      return brnch && brnch.Id === this.order.BranchId;
    });
    if (this.appStorageService.franchise && 
        this.appStorageService.franchise.IsFutureOrderAvailable && 
        !this.selectedOrderReceipt.isSit && !this.order.IsDigitalMenu && !branch.IsClosedToday) {
      //console.log ("franchiseResult.franchise.IsFutureOrderAvailable",franchiseResult.franchise.IsFutureOrderAvailable);
      futureOrderAvailable = true;
      if (this.selectedOrderReceipt.isDelivery) {
         console.log("branchDeliveryTimeOptions")
        branchDeliveryTimeOptions =
          this.buildBranchDeliveryTimeOptions(branch.OpeningTime, branch.ClosingTime, branch.IsOpen, branch.DeliveryTimeInMinutes,true);
      } else {
        console.log("branchDeliveryTimeOptions")
        branchDeliveryTimeOptions =
          this.buildBranchDeliveryTimeOptions(branch.OpeningTime, branch.ClosingTime, branch.IsOpen, branch.TakeawayTimeInMinutes,true);
      }
      
    }
    if (this.isAvailableContinue()) {
      if (!this.loadedData) {
        this.loadedData = new LoadedData();
        this.loadedData.isBranchLoaded = true;
        this.loadedData.isMenuLoaded = true;
      }
      this.isLoadedAllData.next(createLoadedData(false, false, false));
      if (this.order.IsDigitalMenu) {
        this.initializeMenuForBranch(() => { 

          this.router.navigateByUrl(`/${this.franchiseId}/menu`); 
        });
      } else {
        let method = -1;
        if (this.selectedOrderReceipt.isDelivery) {
          method = 0;
        } else if (this.selectedOrderReceipt.isTakeAway) {
          method = 1;
        } else if (this.selectedOrderReceipt.isSit) {
          method = 2;
        }
        //BranchOpenForPickupMethod
        // this.metaDataService.isOpenForPickupMethod(this.order.BranchId, method)
       // .subscribe((branchOpenResult) => {
        this.metaDataService.BranchOpenForPickupMethod(this.order.BranchId, this.appStorageService.orderType)
          .subscribe((branchOpenResult) => {
            branchFutureDates = branchOpenResult.FurureDates;

         //   var trackingParams = branchOpenResult.EventTrackingParams;
            if (branchOpenResult.EventTrackingParams != undefined && 
                branchOpenResult.EventTrackingParams != null && 
                branchOpenResult.EventTrackingParams != "" && !this.trackingParamsLoaded){
                  try {
                    // Code that might throw an error
                    const trackingParams = JSON.parse(branchOpenResult.EventTrackingParams);
                    this.initEventTracking(trackingParams);
                  } catch (error) {
                    // Handle the error
                  }
                }

            if (this.appStorageService.franchise.IsFutureDatesOrderAvailable && this.appStorageService.franchise.IsFutureOrderAvailable){
              if (this.selectedOrderReceipt.isDelivery) {
                if (AppConfig.configSettings.deliveryDetailsAtCheckout){                             
                  this.order.IsFutureOrder = true;
                  this.isLoaded = false;
                  this.initializeMenuForBranch(() => {
                    this.router.navigateByUrl(`/${this.franchiseId}/menu`);
                  });
                } else {
                  branchFutureDates.forEach((d, index) => {
                    if (index == 0) { if (this.isToday(d.Date)){
                      d.TimeOptions =  this.buildBranchDeliveryTimeOptions(d.OpeningTime, d.ClosingTime, branchOpenResult.IsOpen, branch.DeliveryTimeInMinutes,true);
console.log("if (index == 0) { if (this.isToday(d.Date)){",  d.TimeOptions);
                    }
                    else  {
                      d.TimeOptions =  this.buildBranchDeliveryTimeOptions(d.OpeningTime, d.ClosingTime, false, branch.DeliveryTimeInMinutes,false);
                 console.log("if (index == 0)else",  d.TimeOptions);

                    }
                    } else {
                      d.TimeOptions =  this.buildBranchDeliveryTimeOptions(d.OpeningTime, d.ClosingTime, false, branch.DeliveryTimeInMinutes,false);
                       console.log("if (index == 0)else",  d.TimeOptions);
                      if (index == 6) {
                        if (index == 6) {
  
                          this.isLoaded = true;
                          let width : string = "";
                          let maxWidth: string = "";
                          let maxHeight: string = "";
                          if(this.isMobileMode()){
                            width="350px"
                            maxWidth="350px"
                            maxHeight = "90vh"
                          }
                          else{
                             width="580px"
                             maxWidth="580px"
                             maxHeight = "900px"
                          }
                          console.log(" this.isLoaded = true;");
                          const dialogRef = this.matDialog.open(SelectDateTimeComponent, {
                            data: {
                              futureDates: branchFutureDates,
                              header: description,
                              description: "",
                              isTA : this.order.IsTakeAway,
                              isDelivery : this.order.IsDelivery,
                              branchOpen : branchOpenResult.IsOpen,
                              branchName : this.selectedBranch.Name
                            },
                            width: width,
                            maxWidth: maxWidth,
                            maxHeight: "900px"
                          });
                          dialogRef.afterClosed().subscribe(dialogResult => {
                            if (dialogResult && dialogResult.isSaved) {
                             
                              this.selectedFutureTime = dialogResult.selectedText;
                             console.log( "this.selectedFutureTime," ,this.selectedFutureTime);
                              this.order.IsFutureOrder = true;
                              this.order.FutureDateModel = dialogResult.selectedDay;
                              this.order.FutureTime = dialogResult.selectedTime;
                              this.order.FutureDate = dialogResult.selectedDay.Date;
                              //this.getDateTimeFromTimeStr(dialogResult.selectedText) || dialogResult.selectedText;
                             console.log( "this.order" ,this.order);
                              this.isLoaded = false;
                              this.initializeFutureMenuForBranch(() => {
                                this.router.navigateByUrl(`/${this.franchiseId}/menu`);
                              });
          
                            } else {
                              console.log(" this.cancelOptionSelection();");
                              this.cancelOptionSelection();
                            }
                          
                          });
                        }
                      }
                    }
                  
                  });
                }
                
              } else {//if(this.selectedOrderReceipt.isTakeAway ) {
                branchFutureDates.forEach((d, index) => {
                   console.log("branchDeliveryTimeOptions", d, index);
                  if (index == 0) {
                    if (this.isToday(d.Date))
                      d.TimeOptions =  this.buildBranchDeliveryTimeOptions(d.OpeningTime, d.ClosingTime, branchOpenResult.IsOpen, branch.TakeawayTimeInMinutes,true);
                    else  d.TimeOptions =  this.buildBranchDeliveryTimeOptions(d.OpeningTime, d.ClosingTime, false, branch.TakeawayTimeInMinutes,false);
                  } else {
                    d.TimeOptions =  this.buildBranchDeliveryTimeOptions(d.OpeningTime, d.ClosingTime, false, branch.TakeawayTimeInMinutes,false);
                    if (index == 6) {

                      this.isLoaded = true;
                      let width : string = "";
                      let maxWidth: string = "";
                      let maxHeight: string = "";
                      if(this.isMobileMode()){
                        width="350px"
                        maxWidth="350px"
                        maxHeight = "90vh"
                      }
                      else{
                         width="580px"
                         maxWidth="580px"
                         maxHeight = "900px"
                      }
                      console.log(" this.isLoaded = true;");
                      const dialogRef = this.matDialog.open(SelectDateTimeComponent, {
                        data: {
                          futureDates: branchFutureDates.filter(item => item.TimeOptions.length >0),
                          header: description,
                          description: "",
                          isTA : this.order.IsTakeAway,
                          isDelivery : this.order.IsDelivery,
                          branchOpen : branchOpenResult.IsOpen,
                          branchName : this.selectedBranch.Name
                        },
                        width: width,
                        maxWidth: maxWidth,
                        maxHeight: "900px"
                      });
                      dialogRef.afterClosed().subscribe(dialogResult => {
                        if (dialogResult && dialogResult.isSaved) {
                         
                          this.selectedFutureTime = dialogResult.selectedText;
                         
                          this.order.IsFutureOrder = true;
                          this.order.FutureDateModel = dialogResult.selectedDay;
                          this.order.FutureTime = dialogResult.selectedTime;
                          this.order.FutureDate = dialogResult.selectedDay.Date;
                          //this.getDateTimeFromTimeStr(dialogResult.selectedText) || dialogResult.selectedText;
                      
                          this.isLoaded = false;
                          this.initializeFutureMenuForBranch(() => {
                            this.router.navigateByUrl(`/${this.franchiseId}/menu`);
                          });
      
                        } else {
                          console.log(" this.cancelOptionSelection();");
                          this.cancelOptionSelection();
                        }
                      
                      });
                    }
                  }
                 
                 });
              }

            } else {
              if (this.selectedOrderReceipt.isDelivery && this.appStorageService.franchise.IsFutureOrderAvailable) {
                console.log("branchDeliveryTimeOptions")
                branchDeliveryTimeOptions =
                  this.buildBranchDeliveryTimeOptions(branchOpenResult.OpeningTime, branchOpenResult.ClosingTime, branchOpenResult.IsOpen, branch.DeliveryTimeInMinutes, true);
  
              } else if(this.selectedOrderReceipt.isTakeAway && this.appStorageService.franchise.IsFutureOrderAvailable) {
               console.log("branchDeliveryTimeOptions")
                branchDeliveryTimeOptions =
                  this.buildBranchDeliveryTimeOptions(branchOpenResult.OpeningTime, branchOpenResult.ClosingTime, branchOpenResult.IsOpen, branch.TakeawayTimeInMinutes,true);
  
              }

              if (branchOpenResult.IsOpen) {
                if (branchDeliveryTimeOptions.length > 1) {
                  this.isLoaded = true;
                  let width : string = "";
                  let maxWidth: string = "";
                  if(this.isMobileMode()){
                    width="350px"
                    maxWidth="350px"
                  }
                  else{
                     width="580px"
                     maxWidth="580px"
                  }
                  console.log(" this.isLoaded = true;");
                  const dialogRef = this.matDialog.open(SelectTimeComponent, {
                    data: {
                      txtArray: branchDeliveryTimeOptions,
                      header: description,
                      description: "",
                      isTA : this.order.IsTakeAway,
                      isDelivery : this.order.IsDelivery,
                   //////////////////////////////////////////////////////////////////////////////////////////////////
                      branchOpen : branchOpenResult.IsOpen,
                      branchName : this.selectedBranch.Name
                    },
                    width: width,
                    maxWidth: maxWidth,
                    maxHeight: "900px"
                  });
                  dialogRef.afterClosed().subscribe(dialogResult => {
                    if (dialogResult && dialogResult.isSaved) {
                     
                      this.selectedFutureTime = dialogResult.selectedText;
                      this.order.IsFutureOrder = true;
                      this.order.FutureDateTime = this.getDateTimeFromTimeStr(dialogResult.selectedText) || dialogResult.selectedText;
                      this.order.FutureTime = dialogResult.selectedText;
                      this.order.FutureDate = "";
                      this.isLoaded = false;
                      this.initializeMenuForBranch(() => {
                        this.router.navigateByUrl(`/${this.franchiseId}/menu`);
                      });
  
                    } else {
                      console.log(" this.cancelOptionSelection();");
                      this.cancelOptionSelection();
                    }
                  
                  });
                } else {
                  this.order.IsFutureOrder = false;
                //this.isLoaded = false;
               // this.isLoadedAllData.next(createLoadedData(false, false, true));
                  this.initializeMenuForBranch(() => {
                    this.router.navigateByUrl(`/${this.franchiseId}/menu`);
                  });
                }
  
  
              } else { 
                if (branch)  {
                  branch.WorkingHoursStr = branchOpenResult.WorkingHoursStr;
                  branch.WorkingHours = branchOpenResult.WorkingHours;
                  if (futureOrderAvailable && !branchOpenResult.IsClosedToday) {
                  /// Future Order
  
                    if (this.selectedOrderReceipt.isDelivery) {
                      branchDeliveryTimeOptions =
                       this.buildBranchDeliveryTimeOptions(branchOpenResult.OpeningTime, branchOpenResult.ClosingTime, branchOpenResult.IsOpen, branch.DeliveryTimeInMinutes,true);
                    } else {
                      branchDeliveryTimeOptions =
                       this.buildBranchDeliveryTimeOptions(branchOpenResult.OpeningTime, branchOpenResult.ClosingTime, branchOpenResult.IsOpen, branch.TakeawayTimeInMinutes,true);
                    }
                  
  
                  } else {
                 // branchDeliveryTimeOptions =
                   // this.buildBranchDeliveryTimeOptions(branch.OpeningTime, branch.ClosingTime, branch.IsOpen, branch.TakeawayTimeInMinutes);
                  }
                  if (futureOrderAvailable && branchDeliveryTimeOptions.length > 1 && !branchOpenResult.IsClosedToday) {
                    this.isLoaded = true;
                    let width: string = "";
                    let maxWidth: string = "";
                    if (this.isMobileMode()) {
                      width = "350px"
                      maxWidth = "350px"
                    }
                    else {
                      width = "580px"
                      maxWidth = "580px"
                    }
                  const dialogRef = this.matDialog.open(SelectTimeComponent, {
                    data: {
                      txtArray: branchDeliveryTimeOptions,
                      header: this.translationsService.translate['ORDER_BRANCH_CLOSED_NOW'],
                      description: description,
                      branchOpen : branchOpenResult.IsOpen,
                      isTA : this.order.IsTakeAway,
                      isDelivery : this.order.IsDelivery,
                      branchName : this.selectedBranch.Name
                    },
                    maxWidth: maxWidth,
                  maxHeight: "900px",
                  width: width
                  });
                  dialogRef.afterClosed().subscribe(result => {
                    if (result && result.isSaved) {
                      this.selectedFutureTime = result.selectedText;
                      this.order.IsFutureOrder = true;
                      this.order.FutureDateTime = this.getDateTimeFromTimeStr(result.selectedText) || result.selectedText;
                      this.order.FutureTime = result.selectedText;
                      this.order.FutureDate = "";
                      if (this.getDateTimeFromTimeStr(result.selectedText) == undefined){
                        this.order.FutureDeliveryTime = result.selectedText
                      }
                    //  this.isLoadedAllData.next(createLoadedData(false, false, true));
                      this.isLoaded =false;
                      this.initializeMenuForBranch(() => { 
                        this.router.navigateByUrl(`/${this.franchiseId}/menu`); 
                      });
                    } else {
                      console.log(" this.cancelOptionSelection();");
                      this.cancelOptionSelection();
                    }
                  });
                } else {
                  this.displayPopupMessageIsClosedBranch(branch);
                  this.isLoadedAllData.next(createLoadedData(false, false, true));
                }
  
                } else {
                  this.displayPopupMessageIsClosedBranch(branch);
                  this.isLoadedAllData.next(createLoadedData(false, false, true));
                }
  
              }
            }



            
          
           
         
        }, (error) => {
          this.isLoaded = true;
          this.messageService.displayServerErrorMessage();
        });
      }
    }





    /////


 

  }

  private getDateTimeFromTimeStr(time) {
    var dateTime = new Date();
    if (time != undefined && time.indexOf(":") >= 0) {
      var split = time.split(" ");
      split = split[0].split(":");

      dateTime = new Date(dateTime.setMinutes(split[1]));
      dateTime = new Date(dateTime.setHours(split[0]));
      return dateTime;
    }
    return undefined;
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.selectBranchesByOrderReceipt()
      .filter(option => option.Name.toLowerCase()
        .indexOf(filterValue) === 0);
  }


  private buildBranchDeliveryTimeOptions(openingTime: string, closingTime: string, isOpen: boolean, delayTimeMinutes: number, isToday: boolean): string[] {

    const SLOT_MINUTES = 15;

    const toMinutes = (t: string): number => {
      const parts = (t || "0:0").split(":").map(v => Number.parseInt(v, 10));
      const h = isNaN(parts[0]) ? 0 : parts[0];
      const m = isNaN(parts[1]) ? 0 : parts[1];
      return h * 60 + m;
    };

    const toTimeStr = (totalMinutes: number): string => {
      const norm = ((totalMinutes % 1440) + 1440) % 1440;
      const h = Math.floor(norm / 60);
      const m = norm % 60;
      return (h < 10 ? "0" + h : "" + h) + ":" + (m < 10 ? "0" + m : "" + m);
    };

    const delay = delayTimeMinutes && delayTimeMinutes > 0 ? delayTimeMinutes : 0;

    const openMin = toMinutes(openingTime);
    let closeMin = toMinutes(closingTime);
    // Overnight branch (e.g. 06:00 -> 02:00): work on a single continuous timeline.
    if (closeMin <= openMin) {
      closeMin += 1440;
    }

    const now = new Date();
    let nowMin = now.getHours() * 60 + now.getMinutes();
    // If we are currently open and the clock already passed midnight,
    // "now" belongs to the tail of the same (yesterday's) opening window.
    if (isOpen && nowMin < openMin) {
      nowMin += 1440;
    }

    // Earliest possible slot: opening time + prep/delivery delay,
    // and never earlier than (now + delay) when we are dealing with today.
    let earliest = openMin + delay;
    if (isToday) {
      earliest = Math.max(earliest, nowMin + delay);
    }

    // Round up to the next 15-minute slot.
    earliest = Math.ceil(earliest / SLOT_MINUTES) * SLOT_MINUTES;

    const dtOptions: string[] = [];
    for (let m = earliest; m <= closeMin; m += SLOT_MINUTES) {
      dtOptions.push(toTimeStr(m));
    }
console.log("buildBranchDeliveryTimeOptions openingTime",openingTime)
    console.log("buildBranchDeliveryTimeOptions closingTime: ",closingTime)
console.log("buildBranchDeliveryTimeOptions isOpen",isOpen)
console.log("buildBranchDeliveryTimeOptions delayTimeMinutes",delayTimeMinutes)
console.log("buildBranchDeliveryTimeOptions isToday",isToday)
console.log("buildBranchDeliveryTimeOptions dtOptions",dtOptions)
    return dtOptions;
  }

  private buildBranchDeliveryTimeOptions_old(openingTime: string, closingTime: string, isOpen: boolean, delayTimeMinutes: number) {

    const openingTimeArr = openingTime.split(":").map(function (v) { return Number.parseInt(v); });
    const closingTimeArr = closingTime.split(":").map(function (v) { return Number.parseInt(v); });
    let minDtHr = 0;
    let minDtMin = 0;
    if (delayTimeMinutes <= 60) {
      if (openingTimeArr[1] + delayTimeMinutes > 60) {
        minDtHr = openingTimeArr[0] + 1;
        minDtMin = openingTimeArr[1] + delayTimeMinutes - 60;
      } else {
        minDtHr = openingTimeArr[0];
        minDtMin = openingTimeArr[1] + delayTimeMinutes;
      }

    } else if (delayTimeMinutes > 120) {
      minDtHr = openingTimeArr[0] + 2;
      delayTimeMinutes -= 120;
      if (openingTimeArr[1] + delayTimeMinutes > 60) {
        minDtHr = minDtHr + 1;
        minDtMin = openingTimeArr[1] + delayTimeMinutes - 60;
      } else {
        minDtHr = minDtHr;
        minDtMin = openingTimeArr[1] + delayTimeMinutes;
      }

    } else {
      minDtHr = openingTimeArr[0] + 1;
      delayTimeMinutes -= 60;
      if (openingTimeArr[1] + delayTimeMinutes > 60) {
        minDtHr = minDtHr + 1;
        minDtMin = openingTimeArr[1] + delayTimeMinutes - 60;
      } else {
        minDtHr = minDtHr;
        minDtMin = openingTimeArr[1] + delayTimeMinutes;
      }
    }
    // minDtHr = openingTimeArr[0];
    // minDtMin = openingTimeArr[1];
    const maxDtHr = closingTimeArr[0];
    const maxDtMin = closingTimeArr[1];
    // var isOpen = isBranchOpened(openingTime, closingTime);
    const now = new Date();
    const nowHr = now.getHours();
    const nowMin = now.getMinutes();
    const dtOptions = [];
    if (maxDtHr < minDtHr) {
      if (nowHr >= minDtHr || !isOpen) {
        for (let i = minDtHr; i <= 23; i++) {
          for (let j = 0; j < 60; j += 15) {
            if (i < nowHr || (i === nowHr && j < nowMin)) continue;
            if ((i === minDtHr && j < minDtMin) || (i === maxDtHr && j > maxDtMin)) continue;
            const hr = i < 10 ? "0" + i : i;
            const min = j < 10 ? "0" + j : j;
            dtOptions.push(hr + ":" + min);
          }
        }
      }
      for (let i = 0; i <= maxDtHr; i++) {
        for (let j = 0; j < 60; j += 15) {
          if (nowHr < minDtHr && isOpen) {
            if (i < nowHr || (i === nowHr && j < nowMin)) continue;
          }
          if (isOpen && ((i === minDtHr && j < minDtMin) || (i === maxDtHr && j > maxDtMin))) continue;
          const hr = i < 10 ? "0" + i : i;
          const min = j < 10 ? "0" + j : j;
          dtOptions.push(hr + ":" + min);
        }
      }

    }
    else {
      for (let i = minDtHr; i <= maxDtHr; i++) {
        for (let j = 0; j < 60; j += 15) {
          if (i < nowHr || (i === nowHr && j < nowMin)) continue;
          if ((i === minDtHr && j < minDtMin) || (i === maxDtHr && j > maxDtMin)) continue;
          const hr = i < 10 ? "0" + i : i;
          const min = j < 10 ? "0" + j : j;
          dtOptions.push(hr + ":" + min);
        }
      }
    }


    return dtOptions;
  }

  private selectBranchesByOrderReceipt() {
    if (this.isSomeOptionsSelected()) {
      if (this.selectedOrderReceipt.isDelivery) {
        return this.branches.filter((branch) => {
          return branch.IsDelivery;
        });
      } if (this.selectedOrderReceipt.isSit) {
        return this.branches.filter((branch) => {
          return branch.IsSit;
        });
      } if (this.selectedOrderReceipt.isTakeAway) {
        return this.branches.filter((branch) => {
          return branch.IsTakeAway;
        });
      } if (this.selectedOrderReceipt.isDigitalMenu) {
        /*return this.branches.filter((branch) => {
          return branch.IsDigitalMenu;
        });*/
        return this.branches;
      } else {
        return this.branches;
      }
    } else {
      return [];
    }
  }

  private initializeGraphics() {
    this.graphics.logo = AppConfig.settings.logo;
    this.colors.buttonColor = AppConfig.settings.buttonColor;
    this.colors.menuColor = AppConfig.settings.menuColor;
    this.colors.mainButtonColor = AppConfig.settings.mainButtonColor;
    // this.graphics.cover = this.imageVersionService.updateImageVersion(
    // `${this.configService.imagePath}${this.configService.franchiseId}/${this.getLanguage()}/login.png`);
    //this.graphics.coverMobile = this.imageVersionService.updateImageVersion(
    // `${this.configService.imagePath}${this.configService.franchiseId}/${this.getLanguage()}/mobile/login.png`);
    this.graphics.cover = this.imageVersionService.updateImageVersion(`${AppConfig.settings.iframeLoginCover}`);
    this.graphics.coverMobile = this.imageVersionService.updateImageVersion(`${AppConfig.settings.iframeLoginMobileCover}`);
    this.graphics.coverBackground2 = this.imageVersionService.updateImageVersion(`${AppConfig.settings.iframeCover}`);
    this.graphics.coverBackground2Mobile = this.imageVersionService.updateImageVersion(`${AppConfig.settings.iframeMobileCover}`);
    //AppConfig.settings.cover;
    this.lang = this.translationsService.language();
    this.initializePaymentReceiptGraphics();

    if (this.colors.mainButtonColor) {
      var color = this.colors.mainButtonColor// this can be any color
      this.txtColor = this.pickTextColorBasedOnBgColorAdvanced(color, '#FFFFFF', '#000000');
    }
    /*else if(AppConfig.settings.buttonColor && !this.colors.mainButtonColor){
      var color = AppConfig.settings.buttonColor// this can be any color
      console.log("color", color);
      this.txtColor = this.pickTextColorBasedOnBgColorAdvanced(color, '#FFFFFF', '#000000');
      console.log("this.txtColor", this.txtColor);

    }*/ else {
      this.txtColor = '#000000';
    }
  }

  private initializeGraphicsAndLanguageSetting() {
    this.graphics.cover = this.imageVersionService.updateImageVersion(`${AppConfig.settings.iframeLoginCover}`);
    this.graphics.coverMobile = this.imageVersionService.updateImageVersion(`${AppConfig.settings.iframeLoginMobileCover}`);
    this.graphics.coverBackground2 = this.imageVersionService.updateImageVersion(`${AppConfig.settings.iframeCover}`);
    this.graphics.coverBackground2Mobile = this.imageVersionService.updateImageVersion(`${AppConfig.settings.iframeMobileCover}`);
    //AppConfig.settings.cover;
    // this.lang = this.translate.language();
  }

  private initializePaymentReceiptGraphics() {
    this.graphics.takeAwayUrlImageMobile = this.imageVersionService.updateImageVersion(
      `${this.configService.imagePath}${this.configService.franchiseId}/${this.getLanguage()}/mobile/take-away-button.png`);
    this.graphics.sitUrlImageMobile = this.imageVersionService.updateImageVersion(
      `${this.configService.imagePath}${this.configService.franchiseId}/${this.getLanguage()}/mobile/sit-button.png`);
    this.graphics.deliveryUrlImageMobile = this.imageVersionService.updateImageVersion(
      `${this.configService.imagePath}${this.configService.franchiseId}/${this.getLanguage()}/mobile/delivery-button.png`);
    this.graphics.homeHeaderPartUrlImageMobile = this.imageVersionService.updateImageVersion(
      `${this.configService.imagePath}${this.configService.franchiseId}/${this.getLanguage()}/mobile/home-what-would-you-like.png`);

    this.graphics.takeAwayUrlImage = this.imageVersionService.updateImageVersion(
      `${this.configService.imagePath}${this.configService.franchiseId}/${this.getLanguage()}/take-away-button.png`);
    this.graphics.sitUrlImage = this.imageVersionService.updateImageVersion(
      `${this.configService.imagePath}${this.configService.franchiseId}/${this.getLanguage()}/sit-button.png`);
    this.graphics.deliveryUrlImage = this.imageVersionService.updateImageVersion(
      `${this.configService.imagePath}${this.configService.franchiseId}/${this.getLanguage()}/delivery-button.png`);
    this.graphics.homeHeaderPartUrlImage = this.imageVersionService.updateImageVersion(
      `${this.configService.imagePath}${this.configService.franchiseId}/${this.getLanguage()}/home-what-would-you-like.png`);
  }

  private setNgSelectConfig() {
    this.config.addTagText = this.translationsService.translate('HOME_SELECT_ADD_TAG_TEXT');
    this.config.clearAllText = this.translationsService.translate('HOME_SELECT_CLEAR_ALL_TEXT');
    this.config.loadingText = this.translationsService.translate('HOME_SELECT_LOADING_TEXT');
    this.config.notFoundText = this.translationsService.translate('HOME_SELECT_NOT_FOUND_TEXT');
    this.config.typeToSearchText = this.translationsService.translate('HOME_BRANCH_ORDER');
  }

  private selectedTypeBranches(type) {
    let selectedDeliveryBranches = [];
    if (this.branches) {
      selectedDeliveryBranches = this.branches.filter((branch) => {
        return branch && branch[type];
      });
    }
    return selectedDeliveryBranches;
  }

  private initializeOrderReceipt() {
    const selectedDeliveryBranches = this.selectedTypeBranches(OrderOptionEnum.IsDelivery);
    const selectedSitBranches = this.selectedTypeBranches(OrderOptionEnum.IsSit);
    const selectedTakeAwayBranches = this.selectedTypeBranches(OrderOptionEnum.IsTakeAway);
    const selectedMenuBranches = this.selectedTypeBranches(OrderOptionEnum.IsDigitalMenu);
    this.orderReceipt = new OrderReceiptModel();
    let countOfOptions = 0;
    this.orderReceipt.isDelivery = selectedDeliveryBranches.length > 0;
   // console.log("initializeOrderReceipt:this.orderReceipt.IsDelivery",this.orderReceipt.isDelivery);
    if (this.orderReceipt.isDelivery) {
      countOfOptions++;
    }
    this.orderReceipt.isTakeAway = selectedTakeAwayBranches.length > 0;
    if (this.orderReceipt.isTakeAway) {
      countOfOptions++;
    }
    this.orderReceipt.isSit = selectedSitBranches.length > 0;
    if (this.orderReceipt.isSit) {
      countOfOptions++;
    }
    this.orderReceipt.isDigitalMenu = selectedMenuBranches.length > 0;
    if (this.orderReceipt.isDigitalMenu) {
      countOfOptions++;
    }
    this.resetSelectedPaymentReceiptBranch();
    if (countOfOptions === 1) {
      this.selectCurrentOrderReceipt(this.orderReceipt.isSit, this.orderReceipt.isDelivery, this.orderReceipt.isTakeAway, this.orderReceipt.isDigitalMenu);
    } else if (countOfOptions === 0) {
      this.messageService.displayPopupMessage({
        header : this.translationsService.translate('IMPORTANT_MESSAGE'),
        icon : "../../../assets/images/items/important-message.svg",
        message: this.translationsService.translate('HOME_NO_AVAILABLE_OPTIONS'),
        withoutTimeout: true
      });
    }
  }

  private resetSelectedPaymentReceiptBranch() {
    this.selectedOrderReceipt = new OrderReceiptModel();
    this.selectedOrderReceipt.isDelivery = false;
    this.selectedOrderReceipt.isTakeAway = false;
    this.selectedOrderReceipt.isSit = false;
  }

  private initializeOrder() {
   // this.orderService.resetOrder();//02-09-21 Tanya: for not resetting order
    this.order = this.orderService.getOrder();
  }

  private checkLoadingData() {
    this.isLoadedAllData.subscribe((result) => {
      if (result) {
        if (!this.loadedData.isMenuLoaded) {
          this.loadedData.isMenuLoaded = !result.isMenuLoaded;
        }
        if (!this.loadedData.isBranchLoaded) {
          this.loadedData.isBranchLoaded = !result.isBranchLoaded;
        }
        this.loadedData.isOpenBranchLoaded = result.isOpenBranchLoaded;
        this.isLoaded = !!this.loadedData.isBranchLoaded &&
          !!this.loadedData.isMenuLoaded && !!this.loadedData.isOpenBranchLoaded;
         // this.isLoaded = !!this.loadedData.isBranchLoaded &&
         // !!this.loadedData.isMenuLoaded && !!this.loadedData.isOpenBranchLoaded;
      }
    }, (error) => {
      this.isLoaded = true;
    });
  }

  private initializeBranches() {

      this.appStorageService.branch = undefined;
    if (!this.appStorageService.isFranchiseBranchesWasLoaded) {
      this.metaDataService.getFranchiseWithBranches(this.appStorageService.orderType).subscribe((data) => {
        this.appStorageService.backResultFranchiseBranches = this.commonFunctionsService.deepCopy(data);
        this.appStorageService.isFranchiseBranchesWasLoaded = true;
        this.isLoadedAllData.next(createLoadedData(true, false, true));
        if (data) {
          this.branches = data.branches || [];
          this.appStorageService.franchise = data.franchise;
          
          this.phoneNumber = this.appStorageService.franchise.ManagerPhone;
          if (data.branches.length == 1 &&  data.branches[0].EventTrackingParams != undefined && 
                data.branches[0].EventTrackingParams != null && 
                data.branches[0].EventTrackingParams != "" && !this.trackingParamsLoaded){
                  try {
                    // Code that might throw an error
                    const trackingParams = JSON.parse(data.branches[0].EventTrackingParams);
                    this.initEventTracking(trackingParams);
                    this.trackingParamsLoaded = true;
                  } catch (error) {
                    // Handle the error
                  }
                }




          if (data.Policy){
            this.appStorageService.privacyPolicy = data.Policy.PrivacyPolicy;
            this.appStorageService.memberClubPolicy = data.Policy.MembersClubPolicy;
            this.appStorageService.Terms = data.Policy.Terms;
            this.appStorageService.Info = data.Policy.Info;
            this.appStorageService.MoreInfo = data.Policy.MoreInfo;
          }
         
          this.initializeOrderReceipt();
          this.filteredBranches = this.branchControl.valueChanges
            .pipe(
              startWith<string | BranchAppModel>(''),
              map(value => {
                return typeof value === 'string' ? value : value.Name
              }),
              map(name => {
                return name ? this._filter(name) :
                  this.selectBranchesByOrderReceipt().slice();
              })
            );
          this.branchControl.valueChanges.subscribe((resultBranch) => {
            if (typeof resultBranch === 'object') {
              this.selectedBranch = resultBranch;
              this.selectBranch(resultBranch);
            } else {
              this.selectedBranch = undefined;
            }
          });
        } else { }

      }, (error) => {
        this.isLoaded = true;
        this.messageService.displayServerErrorMessage();
      });
    } else {
      const data = this.commonFunctionsService.deepCopy(this.appStorageService.backResultFranchiseBranches);
      if (data) {
        this.branches = data.branches || [];
        this.appStorageService.franchise = data.franchise;
        if (data.Policy){
          this.appStorageService.privacyPolicy = data.Policy.PrivacyPolicy;
          this.appStorageService.memberClubPolicy = data.Policy.MembersClubPolicy;
          this.appStorageService.Terms = data.Policy.Terms;
          this.appStorageService.Info = data.Policy.Info;
          this.appStorageService.MoreInfo = data.Policy.MoreInfo;
        }
        this.initializeOrderReceipt();
        this.filteredBranches = this.branchControl.valueChanges
          .pipe(
            startWith<string | BranchAppModel>(''),
            map(value => {
              return typeof value === 'string' ? value : value.Name
            }),
            map(name => {
              return name ? this._filter(name) :
                this.selectBranchesByOrderReceipt().slice();
            })
          );
        this.branchControl.valueChanges.subscribe((resultBranch) => {
          if (typeof resultBranch === 'object') {
            this.selectedBranch = resultBranch;
            this.selectBranch(resultBranch);
          } else {
            this.selectedBranch = undefined;
          }
        });
      } else { }
      this.isLoadedAllData.next(createLoadedData(true, true, true));
    }

  }

  private initializeMenuForBranch(continueCallBack?) {
    // if (!this.appStorageService.isMenuWasLoaded) {
    let hasPizzas: boolean = false;
    let hascCombos: boolean = false;
    //this.isLoaded = false;
    this.menuService.getMenuForBranch(this.order.BranchId, this.appStorageService.orderType, AppConfig.configSettings.checkItemsByTime, this.translationsService.language()).subscribe((result) => {
      this.imageVersionService.updateImageUrlsOfMenu(result);

      this.appStorageService.backResultMenu = this.commonFunctionsService.deepCopy(result);
      this.appStorageService.isMenuWasLoaded = true;
      if (result) {
        this.appStorageService.categories = result.categories;
        this.appStorageService.clubMembershipCategories = result.clubMembershipCategories;

        if (this.appStorageService.clubMembershipCategories && this.appStorageService.clubMembershipCategories != null) {
          this.appStorageService.clubMembershipCategories.forEach(cat => {
            if ((cat.Name == this.translationsService.translate('CM_JOIN') || cat.Name == 'CM_JOIN')
              || (cat.Name == this.translationsService.translate('CM_BIRTHDAY') || cat.Name == 'CM_BIRTHDAY')
              || (cat.Name == this.translationsService.translate('CM_ANNIVERSARY') || cat.Name == 'CM_ANNIVERSARY')) {
              cat.Items.forEach(item => {
                if (cat.Name == this.translationsService.translate('CM_JOIN') || cat.Name == 'CM_JOIN') {
                  item.IsJoinBenefitItem = true;
                }
                if (cat.Name == this.translationsService.translate('CM_BIRTHDAY') || cat.Name == 'CM_BIRTHDAY') {
                  item.IsBDayBenefitItem = true;
                }
                if (cat.Name == this.translationsService.translate('CM_ANNIVERSARY') || cat.Name == 'CM_ANNIVERSARY') {
                  item.IsAnnBenefitItem = true;
                }
                item.isFreeMembershipBenefit = true;
              });
            }

          });
        }

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

       
          this.isLoadedAllData.next(createLoadedData(false, true, false));
         // this.isLoaded = true;
          if (continueCallBack) {
            continueCallBack();
          }
        //}



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

   private initializeFutureMenuForBranch(continueCallBack?) {
    // if (!this.appStorageService.isMenuWasLoaded) {
    let hasPizzas: boolean = false;
    let hascCombos: boolean = false;
    //this.isLoaded = false;
    this.menuService.getFutureMenuForBranch(this.order.BranchId, 
                                            this.appStorageService.orderType,   
                                            this.order.FutureDateModel.DayOfWeekId,
                                            this.order.FutureDate,
                                            this.order.FutureTime,
                                             this.translationsService.language()).subscribe((result) => {
      this.imageVersionService.updateImageUrlsOfMenu(result);

      this.appStorageService.backResultMenu = this.commonFunctionsService.deepCopy(result);
      this.appStorageService.isMenuWasLoaded = true;
      if (result) {
        this.appStorageService.categories = result.categories;
        this.appStorageService.clubMembershipCategories = result.clubMembershipCategories;

        if (this.appStorageService.clubMembershipCategories && this.appStorageService.clubMembershipCategories != null) {
          this.appStorageService.clubMembershipCategories.forEach(cat => {
            if ((cat.Name == this.translationsService.translate('CM_JOIN') || cat.Name == 'CM_JOIN')
              || (cat.Name == this.translationsService.translate('CM_BIRTHDAY') || cat.Name == 'CM_BIRTHDAY')
              || (cat.Name == this.translationsService.translate('CM_ANNIVERSARY') || cat.Name == 'CM_ANNIVERSARY')) {
              cat.Items.forEach(item => {
                if (cat.Name == this.translationsService.translate('CM_JOIN') || cat.Name == 'CM_JOIN') {
                  item.IsJoinBenefitItem = true;
                }
                if (cat.Name == this.translationsService.translate('CM_BIRTHDAY') || cat.Name == 'CM_BIRTHDAY') {
                  item.IsBDayBenefitItem = true;
                }
                if (cat.Name == this.translationsService.translate('CM_ANNIVERSARY') || cat.Name == 'CM_ANNIVERSARY') {
                  item.IsAnnBenefitItem = true;
                }
                item.isFreeMembershipBenefit = true;
              });
            }

          });
        }

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

       
          this.isLoadedAllData.next(createLoadedData(false, true, false));
         // this.isLoaded = true;
          if (continueCallBack) {
            continueCallBack();
          }
        //}



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
 

  }

  isAppDisplayMode(): boolean {

    if (AppConfig.configSettings.appDisplayMode
      && AppConfig.configSettings.appDisplayMode == true) {
      return true;
    } else {
      return false;
    }
  }

  /*private initializeMenu(callback?) {
    if (!this.appStorageService.isMenuWasLoaded) {
      this.menuService.getMenu().subscribe((result) => {
        this.imageVersionService.updateImageUrlsOfMenu(result);
        this.appStorageService.backResultMenu = this.commonFunctionsService.deepCopy(result);
        this.appStorageService.isMenuWasLoaded = true;
        if (result) {
          this.appStorageService.categories = result.categories;
          this.appStorageService.pizzas = result.pizzas;
          this.appStorageService.pizzaToppings = result.pizzaToppings;
          this.appStorageService.startingPage = result.startingPage;
          // this.prepareOrderOfItemsAndPizza();
        }
        this.metaDataService.getCombos().subscribe(result => {
          this.imageVersionService.updateImageUrlsOfCombo(result);
          this.appStorageService.backResultCombo = this.commonFunctionsService.deepCopy(result);
          this.appStorageService.combos = result;
          this.isLoadedAllData.next(createLoadedData(false, true, true));
          if (callback) {
            callback();
          }
        }, (error) => {
          this.isLoaded = true;
          console.log("this.isLoaded = true");
          this.messageService.displayServerErrorMessage();
        });

      }, (error) => {
        this.isLoaded = true;
        console.log("this.isLoaded = true");
        this.messageService.displayServerErrorMessage();
      });
    } else {
      const result = this.commonFunctionsService.deepCopy(this.appStorageService.backResultMenu);
      const resultCombo = this.commonFunctionsService.deepCopy(this.appStorageService.backResultCombo);
      if (result) {
        this.appStorageService.categories = result.categories;
        this.appStorageService.pizzas = result.pizzas;
        this.appStorageService.pizzaToppings = result.pizzaToppings;
        this.appStorageService.startingPage = result.startingPage;
      }
      if (resultCombo) {
        this.appStorageService.combos = resultCombo;
      }
      this.isLoadedAllData.next(createLoadedData(true, true, true));
    }

  }*/

  private prepareOrderOfItemsAndPizza() {
    if (this.appStorageService.categories) {
      this.appStorageService.categories.forEach((category) => {
        this.commonFunctionsService.sortOrderItems(category.Items);
      });
    }
    if (this.appStorageService.pizzas) {
      this.commonFunctionsService.sortOrderItems(this.appStorageService.pizzas);
    }
  }

  public getLanguage() {
    return this.translationsService.language();
  }

  public directionLanguage() {
    return LanguageEnum.HE;
  }

  selectedBranchChanged(event: any) {
    //update the ui
    this.selectedBranch = this._filteredBranches.find((e: BranchAppModel) => { return e.Name.replace( /\s\s+/g, ' ' ) == event.target.value });
    this.appStorageService.branch = this.selectedBranch;
    this.branchLoaded = true;
  }

}