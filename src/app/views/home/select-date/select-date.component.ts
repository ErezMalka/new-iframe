import {Component, Inject, Input, OnInit} from '@angular/core';
import {AppConfig} from '../../../app.config';
import {TranslationsService} from '../../../shared/translations/translations.service';
import {BranchAppModel} from '../../../models/franchise-branch/branch-app.model';
import { BranchFutureDatesAppModel } from '../../../models/franchise-branch/branch-future-dates-app.model';

import {OrderReceiptModel} from '../../../models/advanced/order/order-receipt.model';
import {OrderAppModel} from '../../../models/order/order-app.model';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import {CommonFunctionsService} from '../../../core/services/common-settings/common-functions.service';
import {BrowserIdentificatorService} from '../../../core/services/common-settings/browser-identificator.service';
import {LanguageEnum} from '../../../enums/advanced/language.enum';
import {NgSelectConfig} from '@ng-select/ng-select';
 import {AppStorageService} from '../../../app.storage.service';
import {MetaDataService} from '../../../core/services/meta-data.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {FormControl} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ViewEncapsulation } from '@angular/core';
import {MatListModule} from '@angular/material/list';


class LoadedData {
  public isBranchLoaded: boolean;
  public isMenuLoaded: boolean;
  public isOpenBranchLoaded: boolean;
}

function createLoadedData(isBranchLoaded: boolean, isMenuLoaded: boolean, isOpenBranchLoaded: boolean) {
  const loadedData = new LoadedData();
  loadedData.isBranchLoaded = isBranchLoaded;
  loadedData.isMenuLoaded = isMenuLoaded;
  loadedData.isOpenBranchLoaded = isOpenBranchLoaded;
  return loadedData;
}

@Component({
  selector: 'select-date',
  templateUrl: './select-date.component.html',
  styleUrls: ['./select-date.component.scss'],
  encapsulation: ViewEncapsulation.None,
  
})
export class SelectDateComponent implements OnInit {

  public graphics = {
    logo: '',
    cover: '',
    sitUrlImage: '',
    takeAwayUrlImage: '',
    deliveryUrlImage: '',
    homeHeaderPartUrlImage: ''
  };

  public colors = {
    menuColor: '',
    buttonColor: ''
  };

  public lang: string;
  public cashSymbol: string;

 // public branches: BranchAppModel[] = [];
  public selectedText: String;
  public selectedDay: BranchFutureDatesAppModel;
  public selectedTime: String;
  public orderType: OrderReceiptModel;
  public branchOpen: boolean=false;
  public isDelivery: boolean=false;
  public isTA: boolean=false;
  public branchName: string;
  public futureDeliveryTime: string;
  public futureDeliveryOption: any;
  public futureDates: BranchFutureDatesAppModel[];
  //public txtArray : string[]=[];
  public header : string= "";
  public description : string= "";
  public isSelected: boolean= false;
  public isDateSelected: boolean= false;
  
  //public optionIsSelected : boolean = false;

 // private order: OrderAppModel;

 // private isLoadedAllData: BehaviorSubject<LoadedData> = new BehaviorSubject<LoadedData>(null);
 public displayFutureDeliveryOptions: boolean = false;
  public branchControl = new FormControl();
  public futureDeliveryOptions: string[]=[];
  public options: any[]=[];
  public filteredBranches: Observable<BranchAppModel[]>;

  constructor(private metaDataService: MetaDataService,
    private translationsService: TranslationsService,
    public dialogRef: MatDialogRef<SelectDateComponent>,
    public commonFunctionsService: CommonFunctionsService,
    protected browserIdentificatorService: BrowserIdentificatorService,
    private appStorageService: AppStorageService,
    private config: NgSelectConfig,
    @Inject(MAT_DIALOG_DATA) public data: {
    //  txtArray: string[],
      futureDates: BranchFutureDatesAppModel[],
      header: string,
      description: string,
      branchOpen: boolean,
      orderType: OrderReceiptModel,
      isDelivery: boolean,
      isTA: boolean,
      branchName: string
    }) {
    if(!AppConfig.configSettings.dontUseASAP){
    //this.selectedTime.push(this.translationsService.translate('ASAP'));
    }

    this.futureDates = data.futureDates;
    
    this.selectedDay = this.futureDates[0];
    //this.selectedTime = this.futureDates[0].TimeOptions[0];

    this.header = data.header;
    this.description = data.description;
    this.branchOpen = data.branchOpen;
    this.isDelivery = data.isDelivery;
    this.isTA = data.isTA;
    this.branchName = data.branchName;
    this.displayFutureDeliveryOptions = AppConfig.configSettings.displayFutureDeliveryOptions;
    var _options = AppConfig.configSettings.futureDeliveryOptions.split(";");
    var counter = 0;
    var count = 0;
    _options.forEach((o)=>{
      counter ++;
      if (o != "" && o.length > 1){
        let selected = false;
        if (count == 0 ) {
          selected = true;
          this.futureDeliveryTime = o;
        }
        this.futureDeliveryOption = {
          option: o,
          selected: selected
        }
        this.options.push(this.futureDeliveryOption);
        count++;
      }
     // if (counter == _options.length ) {
      //  this.futureDeliveryTime = this.futureDeliveryOption;
     // }
    });
    
    // this.setNgSelectConfig();
  }

  selectOption(o){
    o.selected = true; 
    this.futureDeliveryTime = o.option;
    this.options.forEach((op)=>{
      if (op.option == o.option) op.selected =  true; 
      else  op.selected =  false; 
    });
  }

  public close() {
    console.log("closed");
    this.dialogRef.close();
  }
  

  private setNgSelectConfig() {
    this.config.addTagText = this.translationsService.translate('HOME_SELECT_ADD_TAG_TEXT');
    this.config.clearAllText = this.translationsService.translate('HOME_SELECT_CLEAR_ALL_TEXT');
    this.config.loadingText = this.translationsService.translate('HOME_SELECT_LOADING_TEXT');
    this.config.notFoundText = this.translationsService.translate('HOME_SELECT_NOT_FOUND_TEXT');
    this.config.typeToSearchText = this.translationsService.translate('HOME_BRANCH_ORDER');
    
  }

  ngOnInit() {
    this.initializeGraphics();
    //this.initializeBranches();
   // this.initializeOrders();
  }

  public getLanguage() {
    return this.translationsService.language();
  }

  
 

  private initializeGraphics() {
    this.graphics.logo = AppConfig.settings.logo;
    this.colors.buttonColor = AppConfig.settings.buttonColor;
    this.colors.menuColor = AppConfig.settings.menuColor;
    this.lang = this.translationsService.language();
  }

 /* public isAvailableContinue() {
    return this.selectedText && (this.selectedOrderReceipt && (this.selectedOrderReceipt.isSit ||
      this.selectedOrderReceipt.isDelivery || this.selectedOrderReceipt.isTakeAway)) &&
      this.order && this.order.BranchId && this.order.IsTakeAway !== undefined &&
      this.order.IsDelivery !== undefined;
  }*/

  public directionLanguage() {
    return LanguageEnum.HE;
  }

  public continueOrder() {
    this.dialogRef.close({
      isSaved: true,
      selectedDay: this.selectedDay,
      futureDeliveryTime: this.futureDeliveryTime
    });
  }
  public cancelOrder() {
    this.dialogRef.close({
      isSaved: false
    });
  }

  public displayFn(branch?: BranchAppModel): string | undefined {
    return branch ? branch.Name : undefined;
  }

  /*public close() {
    this.dialogRef.close({
      isSaved: false
    });
  }*/

}
