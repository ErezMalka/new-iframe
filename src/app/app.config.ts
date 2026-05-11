import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { GraphicsModel } from './models/advanced/graphics/graphics.model';
import { MetaDataService } from './core/services/meta-data.service';
import { ConfigService } from './core/services/common-settings/config.service';
import { TranslationsService } from './shared/translations/translations.service';
import { environment } from '../environments/environment';
import { ActivatedRoute } from '@angular/router';

export class ConfigSettings {
  public ignoreCupons: boolean;
  public sendInvoice: boolean;
  public displayPopup: boolean;
  public popupMsg: string;
  public multilingual: boolean;
  public minAmountForBonus: number;
  public bonusCategory: string;
  public bonusMsg: string;
  public displayPizzaToppingsInComments: boolean;
  public facebookPixelId: string;
  public googleTagManager: string;
  public isDigitalMenu: boolean;
  public displayLogoOnHomePage: boolean;
  public appDisplayMode: boolean;
  public couponCode: string;
  public couponCodeDiscount: number;
  public dummyDeliveryGroups: boolean;
  public orderStatus: boolean;
  public popupItem: boolean;
  public sitBtnTxt: string;
  public taBtnTxt: string;
  public deliveryBtnTxt: string;
  public hideFutureDeliveryTime: boolean ;
  public hideFutureTATime: boolean ;
  public checkItemsByTime: boolean;
  public cancelPhoneVerification: boolean;
  public dontUseASAP: boolean;
  public displayFranchisePhoneLink: boolean;
  public displayBranchPhoneLink: boolean;
  public forceEmail: boolean;
  public dontDisplayPhonePopup: boolean;
  public dontUsePizzaBuilder: boolean;
  public adresses: any;
  public ccTokens: any;
  public displayCompanyCode: boolean;
  public deliveryDetailsAtCheckout: boolean;
  public displayFutureDeliveryOptions: boolean;
  public futureDeliveryOptions: string;
  public allowIncompletAddress:boolean = false;
  public tvBackgroundColor: string;
  public  useCodeForDelivery : boolean;
  public   useCodeForTakeaway : boolean;
  public useCodeForSit: boolean;
  public   codeForDelivery: string;
  public   codeForTakeaway: string;
  public   codeForSit: string;
  public pickupPoints: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AppConfig {

  static settings: GraphicsModel;

  static cashSymbol = '₪';

  static config: any = {};

  static configSettings: ConfigSettings;

  static franchiseId: number;

  constructor(private http: HttpClient,
    private metaDataService: MetaDataService,
    private configService: ConfigService,
    private transtationService: TranslationsService,
    private _injector: Injector) { }

  private get activatedRoute() { return this._injector.get(ActivatedRoute); }

  load() {
    return this.loadConfigFile();
  }


  private loadConfigFile() {
    return new Promise<void>((resolve, reject) => {
      const env = environment.config;
      this.http.get('./assets/config/' + env + '.json')
        .subscribe((data) => {
          AppConfig.config = data;
          this.configService.imagePath = AppConfig.config.imagePath;
          this.configService.serverUrl = AppConfig.config.serverUrl;
          this.configService.useTranzilaIframe = AppConfig.config.useTranzilaIframe;
          this.configService.useMeshulamIframe = AppConfig.config.useMeshulamIframe;
          this.configService.meshulamEnviroment = AppConfig.config.meshulamEnviroment;
          this.configService.tvRows = AppConfig.config.tvRows;
          this.configService.tvColumns = AppConfig.config.tvColumns;
          this.configService.tvTimer = AppConfig.config.tvTimer;
          this.configService.pwaUrl = AppConfig.config.pwa;
          //this.configService.tvImagePath = AppConfig.config.tvImagePath;

          // this.configService.configSettings = AppConfig.config.configSettings;
          // AppConfig.configSettings = AppConfig.config.configSettings;

          let pathArr: string[] = window.location.hash.split('/');
          this.configService.currentUrl =window.location.hash;
          let franchiseId: string;
          let numericFranchiseId: number;
          if (pathArr.length >1){
              franchiseId   = pathArr[1];
              numericFranchiseId = Number(franchiseId);
          } else {
          //  franchiseId   = pathArr[1];
            numericFranchiseId = AppConfig.config.franchiseId;
          }
         
          if (pathArr.length > 2) {
            if (pathArr[2].startsWith("order#")){
              const dataPart = pathArr[2].replace("order#","");
              // URL-decode the data part
              const decodedData = decodeURIComponent(dataPart);
              // Parse the JSON string
              const jsonObject = JSON.parse(decodedData);
              localStorage.setItem(this.configService.currentUrl, decodedData);
            } else {
              let branchId: string = pathArr[2];
              let numericBranchId: number = Number(branchId);
              if (numericBranchId){
                this.configService.branchId = numericBranchId;
                if (pathArr.length > 3){
                  if (pathArr[3] == 'delivery' || pathArr[3]=="DELIVERY")
                    this.configService.isDelivery = true;
                  else if (pathArr[3] == 'ta' || pathArr[3]=="TA")
                     this.configService.isTakeaway = true;
                  else if (pathArr[3] == 'sit' || pathArr[3]=="SIT")
                     this.configService.isEatIn = true;   
                  else if (pathArr[3] == 'menu' || pathArr[3]=="MENU")
                     this.configService.isMenu = true;   
                  else if (pathArr[3] == 'tv' || pathArr[3]=="TV"){
                    this.configService.isTVMenu = true;   
                  }
                  if (pathArr.length > 4 ){
                    if (pathArr[4].startsWith("order#")){
                      const dataPart = pathArr[4].replace("order#","");
                      // URL-decode the data part
                      const decodedData = decodeURIComponent(dataPart);
                      // Parse the JSON string
                      const jsonObject = JSON.parse(decodedData);
                      localStorage.setItem(this.configService.currentUrl, decodedData);
                    }
                  }
                     
                }
              }
            }
            
          }

          if (!numericFranchiseId) {
            this.metaDataService.GetFranchiseIdByName(franchiseId)
              .subscribe((data) => {
                numericFranchiseId = Number(data);
                AppConfig.franchiseId = numericFranchiseId;
                this.configService.franchiseId = numericFranchiseId;
                this.transtationService.use();
                this.metaDataService.getFranchiseGraphics().subscribe((data) => {
                  AppConfig.settings = data || {};
                
                  this.configService.configSettings = data.iFrameConfigSettings;//data.configSettings;//JSON.parse(data.configSettings);
                  AppConfig.configSettings = data.iFrameConfigSettings;//data.configSettings;//JSON.parse(data.configSettings);
                  environment.gtm = AppConfig.configSettings.googleTagManager;
                  resolve();
                }, (error) => {
                  reject(error);
                });
              });
          } else {
            AppConfig.franchiseId = numericFranchiseId;
            this.configService.franchiseId = numericFranchiseId;
            this.transtationService.use();
            console.log("AFTER this.transtationService.use();");
            this.metaDataService.getFranchiseGraphics().subscribe((data) => {
              AppConfig.settings = data || {};
              this.configService.configSettings = data.iFrameConfigSettings;// data.configSettings;//JSON.parse(data.configSettings);
              AppConfig.configSettings = data.iFrameConfigSettings;//data.configSettings;//JSON.parse(data.configSettings);
              environment.gtm = AppConfig.configSettings.googleTagManager;
              resolve();
            }, (error) => {
              reject(error);
            });
          }
        },
          (error: any) => {
            return reject(error);
          });
    });
  }
}
