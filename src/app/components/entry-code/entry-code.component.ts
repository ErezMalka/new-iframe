import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import { TranslationsService } from '../../shared/translations/translations.service';
import { AppConfig } from '../../app.config';
import {ConfigService} from "../../core/services/common-settings/config.service";
//import {SignInOutService} from "../../../core/services/sign-in-out.service";
import {AppStorageService} from "../../app.storage.service";
import {MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import {CommonFunctionsService} from "../../core/services/common-settings/common-functions.service";
import {StorageValueEnum} from "../../enums/advanced/storage-value.enum";
//import {SharedSignInComponent} from "../shared/shared-sign-in.component";
import {BrowserIdentificatorService} from "../../core/services/common-settings/browser-identificator.service";

@Component({
  selector: 'entry-code',
  templateUrl: './entry-code.component.html',
  styleUrls: ['./entry-code.component.scss']
})
export class EntryCodeComponent   implements OnInit {

  public graphics = {
    logo: '',
    cover: '',
  };

  public colors = {
    menuColor: '',
    buttonColor: ''
  };

  public isDisplayedSignInForm: boolean = false;
  public code: string = '';
  public errorMessage: string = '';
  public lang: string;
  public cashSymbol: string;
  public isFirst : boolean = false;
  useMemberClub: boolean;
 public franchiseId:number;

  constructor(protected translationService: TranslationsService,
              protected configService: ConfigService,
            //  protected signInOutService: SignInOutService,
              protected appStorageService: AppStorageService,
              public dialogRef: MatDialogRef<any>,
              public commonFunctionsService: CommonFunctionsService,
              protected browserService: BrowserIdentificatorService,
              @Inject(MAT_DIALOG_DATA) public data: {
                isFirst: boolean,
               }) {
                 
    
    this.isFirst = data.isFirst
    console.log("isFirst???",this.isFirst);
  }

  ngOnInit() {
    this.initializeGraphics();
    this.franchiseId = this.configService.franchiseId;
   // this.appStorageService.showClubMember = true;
    //this.useMemberClub = this.appStorageService.franchise.UseMembersClub;
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
  //  this.wasCodeClicked = true;
    //this.verifyCode(() => {
      //this.closeSign(true);
   // });
    if ( AppConfig.configSettings.useCodeForDelivery && 
       AppConfig.configSettings.codeForDelivery == this.code ){
        this.closeSign(true);
    } 
    else if ( AppConfig.configSettings.useCodeForTakeaway && 
              AppConfig.configSettings.codeForTakeaway == this.code ){
       this.closeSign(true);
    }
    else if ( AppConfig.configSettings.useCodeForSit && 
              AppConfig.configSettings.codeForSit == this.code ){
       this.closeSign(true);
    }
   else {
this.errorMessage = "הקוד שגוי"
   }
    
  }

 

 

  public close(){
    this.dialogRef.close();
  }

  public closeSign(res) {
    this.dialogRef.close(res);
  }

  

  /*public close() {
    this.dialogRef.close(false);
  }*/

}
