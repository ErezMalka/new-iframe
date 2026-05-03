import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import { TranslationsService } from '../../../shared/translations/translations.service';
import { AppConfig } from '../../../app.config';
import {ConfigService} from "../../../core/services/common-settings/config.service";
import {SignInOutService} from "../../../core/services/sign-in-out.service";
import {AppStorageService} from "../../../app.storage.service";
import {MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import {CommonFunctionsService} from "../../../core/services/common-settings/common-functions.service";
import {StorageValueEnum} from "../../../enums/advanced/storage-value.enum";
import {SharedSignInComponent} from "../shared/shared-sign-in.component";
import {BrowserIdentificatorService} from "../../../core/services/common-settings/browser-identificator.service";

@Component({
  selector: 'dialog-sign-in',
  templateUrl: './dialog-sign-in.component.html',
  styleUrls: ['./dialog-sign-in.component.scss']
})
export class DialogSignInComponent extends SharedSignInComponent implements OnInit {

  public graphics = {
    logo: '',
    cover: '',
  };

  public colors = {
    menuColor: '',
    buttonColor: ''
  };

  public isDisplayedSignInForm: boolean = false;

  public lang: string;
  public cashSymbol: string;
  public isFirst : boolean = false;
  useMemberClub: boolean;
 public franchiseId:number;

  constructor(protected translationService: TranslationsService,
              protected configService: ConfigService,
              protected signInOutService: SignInOutService,
              protected appStorageService: AppStorageService,
              public dialogRef: MatDialogRef<any>,
              public commonFunctionsService: CommonFunctionsService,
              protected browserService: BrowserIdentificatorService,
              @Inject(MAT_DIALOG_DATA) public data: {
                isFirst: boolean,
               }) {
                 
    super(translationService, configService, signInOutService, appStorageService, browserService);
    this.isFirst = data.isFirst
    console.log("isFirst???",this.isFirst);
  }

  ngOnInit() {
    this.initializeGraphics();
    this.franchiseId = this.configService.franchiseId;
    this.appStorageService.showClubMember = true;
    this.useMemberClub = this.appStorageService.franchise.UseMembersClub;
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
  }

  public handlerCode() {
    console.log("verifyCode");
    this.wasCodeClicked = true;
    this.verifyCode(() => {
      this.closeSign(true);
    });
    
  }

  public sendLoginCode(){
    this.wasClicked = true;
    this.sendCode((result) => {
      console.log("result", result)
      if (result.success) {
        this.appStorageService.setItemInLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.franchiseId, result.token);
        //this.appStorageService.removeItemInStorage(StorageValueEnum.CODE_SENT_DATE);
        //this.appStorageService.removeItemInStorage(StorageValueEnum.PHONE);
        this.closeSign(true);
      }
    });
  }

  public hideDialog () {
    if (this.showCodeForm == false && !this.phoneError) {
      this.goToCodeEnter();
    }
   // $mdDialog.hide();
  }

  public close(){
    this.dialogRef.close();
  }

  public closeSign(isSignedIn) {
    this.dialogRef.close({
      isSignedIn
    });
  }

  public goBack(){
    this.phone="";
    this.showCodeForm = false;
    this.wasClicked = false
  }

  /*public close() {
    this.dialogRef.close(false);
  }*/

}
