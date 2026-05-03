import { Component, OnInit } from '@angular/core';
import { TranslationsService } from '../../../shared/translations/translations.service';
import { AppConfig } from '../../../app.config';
import { ConfigService } from '../../../core/services/common-settings/config.service';
import { SignInOutService } from '../../../core/services/sign-in-out.service';
import { AppStorageService } from '../../../app.storage.service';
import { SharedSignInComponent } from "../shared/shared-sign-in.component";
import {BrowserIdentificatorService} from "../../../core/services/common-settings/browser-identificator.service";

@Component({
  selector: 'sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent extends SharedSignInComponent implements OnInit  {

  public graphics = {
    logo: '',
    cover: '',
  };

  public colors = {
    menuColor: '',
    buttonColor: ''
  };

  public countOfDigitsForCode = 4; // For count of digits in phone

  public isDisplayedSignInForm: boolean = false;

  public lang: string;
  public cashSymbol: string;

  constructor(protected translationService: TranslationsService,
              protected configService: ConfigService,
              protected signInOutService: SignInOutService,
              protected appStorageService: AppStorageService,
              protected browserService: BrowserIdentificatorService) {
    super(translationService, configService, signInOutService, appStorageService, browserService);
  }

  ngOnInit() {
    this.initializeGraphics();
  }

  private initializeGraphics() {
    this.graphics.logo = AppConfig.settings.logo;
    this.colors.menuColor = AppConfig.settings.menuColor;
    this.colors.buttonColor = AppConfig.settings.buttonColor;
    this.lang = this.translationService.language();
    this.cashSymbol = AppConfig.cashSymbol;
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

  public handlerCode() {
    if (this.showCodeForm) {
      this.verifyCode();
    } else {
      this.sendCode();
    }
  }

  public hideDialog () {
    if (this.showCodeForm == false && !this.phoneError) {
      this.goToCodeEnter();
    }
  }

}
