import { EventEmitter, Output } from '@angular/core';
import { TranslationsService } from '../../../shared/translations/translations.service';
import { ConfigService } from '../../../core/services/common-settings/config.service';
import { SignInOutService } from '../../../core/services/sign-in-out.service';
import { AppStorageService } from '../../../app.storage.service';
import { StorageValueEnum } from '../../../enums/advanced/storage-value.enum';
import { SizeMobileInitializationComponent } from "../../../shared/classes/size-mobile-initialization.component";
import {BrowserIdentificatorService} from "../../../core/services/common-settings/browser-identificator.service";


import { AppConfig } from '../../../app.config';

export class SharedSignInComponent extends SizeMobileInitializationComponent{

  public showLoginForm = true;
  public showCodeForm = false;
  public wasClicked: boolean = false;
  public errorMessage = undefined;
  public phoneError = false;
  public wasCodeClicked: boolean = false;
  //public franchiseId:number;
  public country = this.configService.country;

  public phone: string = '';
  public code: string = '';

  public errors = {
    msgSent: this.translationService.translate('SIGN_IN_MSG_SENT'),
    wrongPhone: this.translationService.translate('SIGN_IN_WRONG_PHONE_NUMBER'),
    wrongCode: this.translationService.translate('SIGN_IN_WRONG_CODE')
  };

  @Output()
  public isSignLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  public signInCompleted: EventEmitter<boolean> = new EventEmitter<boolean>();

  private countOfDigitsInNumber = 10;
  public countOfDigitsForCode = 4; // For count of digits in phone

  constructor(protected translationService: TranslationsService,
              protected configService: ConfigService,
              protected signInOutService: SignInOutService,
              protected appStorageService: AppStorageService,
              protected browserService: BrowserIdentificatorService) {
    super(browserService);
  }


  public sendCode(callback?) {
    this.errorMessage = '';
    if (!this.phone) {
      this.hidePhoneNumberError();
    }
    let cleanPhone = this.phone.replace(/\D/g, '');
    if (cleanPhone.length != this.countOfDigitsInNumber) {
      this.phoneError = true;
      this.errorMessage = this.errors.wrongPhone;
      this.wasClicked =false;
      return;
    }
    if (this.country === 'us') {
      cleanPhone = '+1' + cleanPhone;
    }
    this.isSignLoaded.emit(false); // Loading progress
    this.signInOutService.signOut();
    if(!AppConfig.configSettings.cancelPhoneVerification){
      console.log("Regular verification");
     this.signInOutService.createUserAndGetCode(cleanPhone, false)
      .subscribe((response) => {
        if (response.success) {
          this.appStorageService.setItemInLocalStorage(StorageValueEnum.CODE_SENT_DATE, new Date());
          this.appStorageService.setItemInLocalStorage(StorageValueEnum.PHONE, cleanPhone);
          this.goToCodeEnter();
        } else {
          this.errorMessage = this.errors.msgSent;
          this.isSignLoaded.emit(true); // Stop loading progress
          this.signInCompleted.emit(false);
          this.wasClicked =false;
        }
      }, (error) => {
        this.isSignLoaded.emit(true);
        this.signInCompleted.emit(false);
        this.wasClicked =false;
        // Todo: handler of error
      });
    }
    else{

      console.log("No verification");
      this.signInOutService.createUserAndGetCode(cleanPhone, true)
      .subscribe((response) => {
        if (response.success) {
          this.appStorageService.setItemInLocalStorage(StorageValueEnum.CODE_SENT_DATE, new Date());
          this.appStorageService.setItemInLocalStorage(StorageValueEnum.PHONE, cleanPhone);
          this.noCodeEnter();
          if(callback){
            callback(response);
          }

          
        } else {
          this.errorMessage = this.errors.msgSent;
          this.isSignLoaded.emit(true); // Stop loading progress
          this.signInCompleted.emit(false);
        }
      }, (error) => {
        this.isSignLoaded.emit(true);
        this.signInCompleted.emit(false);
        // Todo: handler of error
      });

    }
  }

  public restrictKeysExceptDigits(event) {
    const k = event.charCode;  // k = event.keyCode;  (Both can be used)
    if ((k > 64 && k < 91) || k == 8 || k == 32 || (k >= 48 && k <= 57)) {

    } else {
      if (event) {
        event.preventDefault();
      }
    }
  }


  public verifyCode(extraHandler?, extraDetails?) {
   
    this.errorMessage = '';
    let cleanPhone = this.phone.replace(/\D/g, '');
    if (this.country === 'us') {
      cleanPhone = '+1' + cleanPhone;
    }
    this.isSignLoaded.emit(false);
    this.signInOutService.verifyLoginCode(cleanPhone, this.code)
      .subscribe( (response) => {
        if (response.success) {
          this.appStorageService.setItemInLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.configService.franchiseId, response.token);
          this.appStorageService.removeItemInStorage(StorageValueEnum.CODE_SENT_DATE);
          this.appStorageService.removeItemInStorage(StorageValueEnum.PHONE);
          if (extraHandler) {
            extraHandler();
          }
        } else {
          this.code = '';
          this.errorMessage = this.errors.wrongCode;
          this.wasCodeClicked = false;
        }
        this.isSignLoaded.emit(true);
        this.signInCompleted.emit(response.success);
      }, (error) => {
        this.signInCompleted.emit(false);
        this.isSignLoaded.emit(true);
        this.wasCodeClicked = false;
        // Todo: complete handler of error
      });
  }

  public goToCodeEnter() {
    this.showLoginForm = false;
    setTimeout(() => {
      this.showCodeForm = true;
      this.isSignLoaded.emit(true); // Stop loading progress
    }, 800);
  }

  public noCodeEnter() {
    this.showLoginForm = false;
    setTimeout(() => {
      this.showCodeForm = false;
      this.isSignLoaded.emit(true); // Stop loading progress
      this.signInCompleted.emit(true);
    }, 800);
  }

  public backToPhoneEnter() {
    this.showCodeForm = false;
    setTimeout(() => {
      this.showLoginForm = true;
    }, 1000);
  }

  public checkIfCodeSent() {
    let codeExpirationMinutes = 60;
    let dateStr = this.appStorageService.getItemFromLocalStorage(StorageValueEnum.CODE_SENT_DATE);
    if (dateStr != undefined) {
      const date = new Date(dateStr);
      const now = new Date();
      const diffDays = Math.round((+now - +date) / 86400000); // days
      const diffHrs = Math.round(((+now - +date) % 86400000) / 3600000);
      const diffMinutes = Math.round((((+now - +date) % 86400000) % 3600000) / 60000);
      if (diffMinutes < codeExpirationMinutes && diffHrs == 0 && diffDays == 0) {
        this.phone = this.appStorageService.getItemFromLocalStorage(StorageValueEnum.PHONE);
        this.goToCodeEnter();
      }
    }
  }

  private hidePhoneNumberError() {
    this.phoneError = false;
    this.errorMessage = '';
  }

}
