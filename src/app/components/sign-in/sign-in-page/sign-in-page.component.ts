import { Component, OnInit } from '@angular/core';
import { TranslationsService } from '../../../shared/translations/translations.service';
import { AppConfig } from '../../../app.config';
import { ConfigService } from '../../../core/services/common-settings/config.service';
import { SignInOutService } from '../../../core/services/sign-in-out.service';
import { AppStorageService } from '../../../app.storage.service';
import { SharedSignInComponent } from "../shared/shared-sign-in.component";
import { SizeMobileInitializationComponent } from "../../../shared/classes/size-mobile-initialization.component";
import { BrowserIdentificatorService } from "../../../core/services/common-settings/browser-identificator.service";
import { StorageValueEnum } from "../../../enums/advanced/storage-value.enum";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "../../../shared/components/message/message.service";
import { VersionImageService } from "../../../core/services/common-settings/version-image.service";
import * as $ from 'jquery';

@Component({
  selector: 'sign-in-page',
  templateUrl: './sign-in-page.component.html',
  styleUrls: ['./sign-in-page.component.scss']
})
export class SignInPageComponent extends SharedSignInComponent implements OnInit {

  public graphics = {
    logo: '',
    cover: '',
    coverMobile: '',
    coverBackground2: '',
    coverBackground2Mobile:''
  };

  public colors = {
    menuColor: '',
    buttonColor: ''
  };

  public countOfDigitsForCode = 4; // For count of digits in phone

  public isDisplayedSignInForm: boolean = false;

  public lang: string;
  public cashSymbol: string;
  private franchiseId: string;
  public languages: any[] = [];
  public defaultLanguage: string;
 

  constructor(protected translationService: TranslationsService,
    protected configService: ConfigService,
    protected signInOutService: SignInOutService,
    protected appStorageService: AppStorageService,
    protected browserService: BrowserIdentificatorService,
    private imageVersionService: VersionImageService,
    protected router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService) {
    super(translationService, configService, signInOutService, appStorageService, browserService);
  }

  ngOnInit() {
    this.franchiseId = this.route.snapshot.paramMap.get('franchiseId');
    this.defaultLanguage = this.translationService.getDefaultLanguage();
    this.verifyToken();
    this.initializeGraphics();
    this.initializeSize();
    this.getAppLanguages();

    this.franchiseId = this.route.snapshot.paramMap.get('franchiseId');
  }

  private getAppLanguages() {
    this.signInOutService.getAppLanguages()
      .subscribe((response) => {
        if (response) {
          this.languages = response;
        }
    }, (error) => {
      //this.messageService.displayServerErrorMessage();
    });
  }

  public changeLanguage(event: any) {

    this.translationService.setLanguage(event.target.value);
     
  }


  public verifyToken() {
    const token = this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.franchiseId);
    if (token) {
      console.log("signInPage component verifyToken");
      this.signInOutService.verifyToken(token)
        .subscribe((response) => {
          if (response && response.user && response.user != null) {
            if (response.user.FranchiseId != this.franchiseId) {
              this.signInOutService.signOut();
            //  this.router.navigate([`${this.franchiseId}/sign-in`]);                                            
            } else {
              // All time to redirect on the first Home page (start page)
              this.router.navigate([`${this.franchiseId}/home`]);
            }     
            
          } else {
            this.signInOutService.signOut();
           // this.router.navigate([`${this.franchiseId}/sign-in`]);
          }
           
        }, (error) => {
          this.messageService.displayServerErrorMessage();
        });
    } else {
      this.signInOutService.signOut();
      this.router.navigate([`${this.franchiseId}/sign-in`]);
    }
  }

  private getLanguage() {
    return this.translationService.language();
  }

  private initializeGraphics() {
    this.graphics.logo = AppConfig.settings.logo;
    this.colors.menuColor = AppConfig.settings.menuColor;
    this.colors.buttonColor = AppConfig.settings.buttonColor;
    this.lang = this.translationService.language();
    this.cashSymbol = AppConfig.cashSymbol;
    this.graphics.cover = this.imageVersionService.updateImageVersion(
      `${this.configService.imagePath}${this.configService.franchiseId}/${this.getLanguage()}/login.png`);
    this.graphics.coverMobile = this.imageVersionService.updateImageVersion(
      `${this.configService.imagePath}${this.configService.franchiseId}/${this.getLanguage()}/mobile/login.png`);

      this.graphics.cover = this.imageVersionService.updateImageVersion( `${AppConfig.settings.iframeLoginCover}`);
      this.graphics.coverMobile = this.imageVersionService.updateImageVersion(`${AppConfig.settings.iframeLoginMobileCover}`);  
      this.graphics.coverBackground2 = this.imageVersionService.updateImageVersion(`${AppConfig.settings.iframeCover}`);
      this.graphics.coverBackground2Mobile = this.imageVersionService.updateImageVersion(`${AppConfig.settings.iframeMobileCover}`);
  }

  public displaySignInForm() {
    this.isDisplayedSignInForm = !this.isDisplayedSignInForm;
    this.initializeAllData();
  }

  public initializeAllData() {
    this.phone = '';
    this.code = '';
    this.showCodeForm = false;
    this.showLoginForm = true;
    this.showCodeForm = false;
    this.errorMessage = undefined;
    this.phoneError = false;
    this.country = this.configService.country;
  }

  private continueAction() {
    if (this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.configService.franchiseId)) {
      this.router.navigate([`/${this.franchiseId}/home`]);
    } else {
      this.messageService.displayServerErrorMessage();
    }
  }

  public skip() {
    this.router.navigate([`/${this.franchiseId}/home`]);
  }

  public handlerCode() {
    if (this.showCodeForm) {
      this.verifyCode(() => {
        this.continueAction();
      });
    } else {
      this.sendCode();
    }
  }

  public hideDialog() {
    if (this.showCodeForm == false && !this.phoneError) {
      this.goToCodeEnter();
    }
  }

}
