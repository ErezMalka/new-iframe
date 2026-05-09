import { Component, Inject, OnInit } from '@angular/core';
import { TranslationsService } from './shared/translations/translations.service';
import { AppConfig } from './app.config';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { DOCUMENT, PlatformLocation } from '@angular/common';
import { AppStorageService } from './app.storage.service';
import { SignInOutService } from './core/services/sign-in-out.service';
import { StorageValueEnum } from './enums/advanced/storage-value.enum';
import { ConfigService } from './core/services/common-settings/config.service';
import { MessageService } from "./shared/components/message/message.service";
import { PaymentService } from "./shared/services/payment.service";
import { VersionImageService } from "./core/services/common-settings/version-image.service";
import { BrowserIdentificatorService } from "./core/services/common-settings/browser-identificator.service";
import { PreviousRouteService } from "./core/services/common-settings/previous-route.service";
import { DeviceDetectorService } from 'ngx-device-detector';
import * as $ from 'jquery';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { environment } from '../environments/environment';

import { Subscription } from 'rxjs';
//import 'core-js/es6/reflect';

//import 'core-js/es7/reflect'; 

export let browserRefresh = false;

@Component({
  // tslint:disable-next-line
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  subscription: Subscription;


  public graphics = {
    cover: '',
    coverMobile: '',
    coverBackground2: '',
    coverBackground2Mobile: '',
    logo: ''
  };
  public lang: string;
  public isLoading: boolean;
  private franchiseId: number;
  public currUrl:string;
  private name:string;

  constructor(private translate: TranslationsService,
    private router: Router,
    private platformLocation: PlatformLocation,
    private signInOutService: SignInOutService,
    private appStorageService: AppStorageService,
    private configService: ConfigService,
    private messageService: MessageService,
    private paymentService: PaymentService,
    private deviceService: DeviceDetectorService,
    private imageVersionService: VersionImageService,
    private translationsService: TranslationsService,
    protected browserIdentificatorService: BrowserIdentificatorService,
    private gtmService: GoogleTagManagerService,
    private routerService: PreviousRouteService,
    @Inject(DOCUMENT) private document: any) {
      this.gtmService.config.id = environment.gtm;
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {  
       
       // console.log('evt', evt);       
        return;
      }
      if (evt instanceof NavigationEnd) {  
        const gtmTag = {
          event: 'page',
          pageName: evt.url
        };
        this.gtmService.pushTag(gtmTag);
       }
      
      const url = evt.urlAfterRedirects;
      window.scrollTo(0, 0);
    });

    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        browserRefresh = !router.navigated;
      }
  });
  
  }


  public currentRoute(): boolean {
    return this.routerService.getCurrentUrl() === `${this.franchiseId}/` ||
      this.routerService.getCurrentUrl() === `${this.franchiseId}/sign-in` ||
      this.routerService.getCurrentUrl() === `${this.franchiseId}/home`;
  }

  private initializeGraphicsAndLanguageSetting() {

    this.graphics.cover = this.imageVersionService.updateImageVersion(`${AppConfig.settings.iframeLoginCover}`);
    this.graphics.coverMobile = this.imageVersionService.updateImageVersion(`${AppConfig.settings.iframeLoginMobileCover}`);
    this.graphics.coverBackground2 = this.imageVersionService.updateImageVersion(`${AppConfig.settings.iframeCover}`);
    this.graphics.coverBackground2Mobile = this.imageVersionService.updateImageVersion(`${AppConfig.settings.iframeMobileCover}`);
    this.graphics.logo = AppConfig.settings.logo;
    this.appStorageService.logo = this.graphics.logo;
    //AppConfig.settings.cover;
    this.lang = this.translate.language();
  }

  isMobileMode(): boolean {
    return this.deviceService.isMobile();
  }

  isDigitalMenu(): boolean {

    if (AppConfig.configSettings.isDigitalMenu
      && AppConfig.configSettings.isDigitalMenu == true) {
      return true;
    } else {
      return false;
    }
  }

  private getLanguage() {
    return this.translationsService.language();
  }

  public verifyToken() {
    const token = this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.franchiseId);
    if (token) {
      console.log("app component verifyToken");
      this.signInOutService.verifyToken(token)
        .subscribe((response) => {
          //console.log("app component: verifyToken", response);
         // console.log("app component: verifyToken", response.user);
         // console.log("app component: response.user.FranchiseId", response.user.FranchiseId);
         // console.log("app component: this.franchiseId", this.franchiseId);
          if (response && response.user && response.user != null) {
            if (response.user.FranchiseId != this.franchiseId) {
              this.signInOutService.signOut();
              //this.router.navigate([`${this.franchiseId}/sign-in`]); 
              this.router.navigate([`${this.franchiseId}/home`]);                                           
            } else {
              this.appStorageService.appUser = response.user;
              if(AppConfig.configSettings.cancelPhoneVerification){
                this.appStorageService.appUser.Address = null;
                this.appStorageService.appUser.IsClubMember = null;
              } else {
                this.appStorageService.ccTokens = response.ccTokens;
                this.appStorageService.addresses = response.addresses;
              }
              // All time to redirect on the first Home page (start page)
              //console.log("this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN)",
                //           this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN));
              this.router.navigate([`${this.franchiseId}/home`]);
            }     
            
          } else {
            this.signInOutService.signOut();
            //this.router.navigate([`${this.franchiseId}/sign-in`]);
            this.router.navigate([`${this.franchiseId}/home`]);
          }
          //const result = response ? !!response.user : !!response;
         // if (!result) {
           // this.signInOutService.signOut();
          //}
        }, (error) => {
          this.messageService.displayServerErrorMessage();
        });
    } else {
      this.signInOutService.signOut();
      //console.log("this.router.navigate([`${this.franchiseId}/home`]);",this.franchiseId );
    //  this.router.navigate([`${this.franchiseId}/sign-in`]);
      this.router.navigate([`${this.franchiseId}/home`]);
    }
  }

  private loadPaymentOptions() {
    this.paymentService.getPaymentOptions().subscribe((result) => {
      this.appStorageService.paymentOptions = result;
    }, () => {
      this.messageService.displayServerErrorMessage();
    });
  }

  ngOnInit() {
    console.log("ngOnInit: franchiseId", this.configService.franchiseId);
    this.appStorageService.getItemFromLocalStorage(this.configService.franchiseId);
    this.franchiseId = this.configService.franchiseId;
    this.name = AppConfig.settings.name;
    const title = document.getElementsByTagName('head')[0]
    .getElementsByTagName('title')[0];
    title.innerHTML =this.name;
    if ( AppConfig.settings.desc != null &&  AppConfig.settings.desc!=undefined) {
     // const meta = document.getElementsByTagName('head')[0]
     // .getElementsByTagName('meta')[3].setAttribute("content", AppConfig.settings.desc);

      const meta = document.getElementById('meta_desc').setAttribute("content", AppConfig.settings.desc);
    }
    //const myMeta =  document.getElementById('meta-icon').setAttribute("href", AppConfig.settings.icon);

    console.log("myMeta",  document.getElementById('meta-icon'));

  

    console.log("AppConfig.settings.icon", AppConfig.settings.icon);

    
     document.documentElement.style.setProperty(`--orange`, AppConfig.settings.buttonColor);
     document.documentElement.style.setProperty(`--secondary`, AppConfig.settings.categoryColor);
    //this.HandleFBScript();

 
    this.initializeGraphicsAndLanguageSetting();
    if (this.isDigitalMenu()) {
      console.log("this.isDigitalMenu()" );

    //  this.router.navigate([`${this.franchiseId}/home`]);
    } else {
      console.log("ELSE" );
      this.verifyToken();
      // this.checkDevice();
      this.loadPaymentOptions();
    }

    setTimeout(() => {
      document.getElementById('NagishLiTrigger').setAttribute("style","display:none;");
      document.getElementById('close-nagish').setAttribute("style","display:none;");

    //  console.log("  document.getElementsByTagName('nagishli')[0]",  document.getElementsByTagName('nagishli')[0]);
    }, 10000)
  }

  private HandleFBScript() {

   // var scripts = document.getElementsByTagName("script");
    var facebookScript = "!function(f,b,e,v,n,t,s)" +
    "{if(f.fbq)return;n=f.fbq=function(){n.callMethod?" +
    "n.callMethod.apply(n,arguments):n.queue.push(arguments)};" +
    "if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';" +
    "n.queue=[];t=b.createElement(e);t.async=!0;" +
    "t.src=v;s=b.getElementsByTagName(e)[0];" +
    "s.parentNode.insertBefore(t,s)}(window, document,'script'," +
    "'https://connect.facebook.net/en_US/fbevents.js');" +
    "fbq('init'," + AppConfig.configSettings.facebookPixelId + ");" +
    "fbq('track', 'PageView');";

  //  var dynamicScripts = [`${this.configService.serverUrl}assets/fbPixel_scripts/${this.franchiseId}.js`];
    // gtm

   /* let gtmNode = document.getElementById('GTMscript');//
    gtmNode.setAttribute("src", "https://www.googletagmanager.com/gtm.js?id="+  AppConfig.configSettings.googleTagManager);
   // let gtmNode = document.createElement('script');//GTMscript
    //gtmNode.src = "https://www.googletagmanager.com/gtm.js?id="+  AppConfig.configSettings.googleTagManager;
    //gtmNode.type = 'text/javascript';
    //gtmNode.async = true;
    //document.getElementsByTagName('head')[0].appendChild(gtmNode);   */
    ///
    // fb pixel
    let fbNode = document.createElement('script');
    fbNode.innerText = facebookScript;
    document.getElementsByTagName('head')[0].appendChild(fbNode);   
    ///

    const fbPixelNoScript = document.getElementsByTagName('head')[0]
      .getElementsByTagName('noscript')[0];
    fbPixelNoScript.innerHTML =
      "<img height='1' width='1' style='display:none' src='https://www.facebook.com/tr?id=" +
      AppConfig.configSettings.facebookPixelId + "&ev=PageView&noscript=1' />";
    //fbPixelNoScript.setAttribute('src',AppConfig.configSettings.facebookPixelImgSrc);
  }

  public closeNagish(){
    document.getElementsByTagName('nagishli')[0].setAttribute("style","display:none");
    document.getElementsByClassName('close-nagish')[0].setAttribute("style","display:none");
  }
}
