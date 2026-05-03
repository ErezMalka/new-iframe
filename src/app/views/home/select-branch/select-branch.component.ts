import {Component, Inject, Input, OnInit} from '@angular/core';
import {AppConfig} from '../../../app.config';
import {TranslationsService} from '../../../shared/translations/translations.service';
import {BranchAppModel} from '../../../models/franchise-branch/branch-app.model';
import {OrderReceiptModel} from '../../../models/advanced/order/order-receipt.model';
import {OrderAppModel} from '../../../models/order/order-app.model';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import {CommonFunctionsService} from '../../../core/services/common-settings/common-functions.service';
import {BrowserIdentificatorService} from '../../../core/services/common-settings/browser-identificator.service';
import {LanguageEnum} from '../../../enums/advanced/language.enum';
import {NgSelectConfig} from '@ng-select/ng-select';
import {map, startWith} from 'rxjs/operators';
import {AppStorageService} from '../../../app.storage.service';
import {MetaDataService} from '../../../core/services/meta-data.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {FormControl} from '@angular/forms';


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
  selector: 'select-branch',
  templateUrl: './select-branch.component.html',
  styleUrls: ['./select-branch.component.scss']
})
export class SelectBranchComponent implements OnInit {

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

  public branches: BranchAppModel[] = [];
  public selectedBranch: BranchAppModel;
  public selectedOrderReceipt: OrderReceiptModel;
  public orderReceipt: OrderReceiptModel;

  public order: OrderAppModel;

  private isLoadedAllData: BehaviorSubject<LoadedData> = new BehaviorSubject<LoadedData>(null);

  public branchControl = new FormControl();

  public filteredBranches: Observable<BranchAppModel[]>;

  public branchName: string;

  public disabled: boolean = false;

  HighlightRow : Number;  
  ClickedRow:any;  

  constructor(private metaDataService: MetaDataService,
              private translationsService: TranslationsService,
              public dialogRef: MatDialogRef<SelectBranchComponent>,
              public commonFunctionsService: CommonFunctionsService,
              
              protected browserIdentificatorService: BrowserIdentificatorService,
              private appStorageService: AppStorageService,
              private config: NgSelectConfig,
              @Inject(MAT_DIALOG_DATA) public data: {
                branches: BranchAppModel[],
                selectedOrderReceipt: OrderReceiptModel,
                orderReceipt: OrderReceiptModel,
                order: OrderAppModel
              }) {
    this.setNgSelectConfig();
    this.ClickedRow = function(index){  
      this.HighlightRow = index;  

      console.log("orderReceipt",this.orderReceipt);
      console.log("order",this.order);
  }  
  }

  private setNgSelectConfig() {
    this.config.addTagText = this.translationsService.translate('HOME_SELECT_ADD_TAG_TEXT');
    this.config.clearAllText = this.translationsService.translate('HOME_SELECT_CLEAR_ALL_TEXT');
    this.config.loadingText = this.translationsService.translate('HOME_SELECT_LOADING_TEXT');
    this.config.notFoundText = this.translationsService.translate('HOME_SELECT_NOT_FOUND_TEXT');
    this.config.typeToSearchText = this.translationsService.translate('HOME_BRANCH_ORDER');
  }

  ngOnInit() {
    //$("input").blur();
    this.initializeGraphics();
    this.initializeBranches();
    this.initializeOrders();


  }

  public getLanguage() {
    return this.translationsService.language();
  }

  public disable(){
    console.log("this.disabled",this.disabled);
    this.disabled=false;
    console.log("this.disabled",this.disabled);
  }

  public myFunction() {
    // Declare variables
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value;
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    console.log("tr.length",tr.length);
  
    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
      console.log("tr[i]",tr[i]);
      td = tr[i].getElementsByTagName("td");
      console.log("td",td,"td.innerText",td[0].innerText);
      if (td[0]) {
        txtValue = td[0].textContent || td[0].innerText;
        console.log("txtValue",txtValue);
        if (txtValue.indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }

  public selectBranchName(branch){
    if (!this.isBranchOpen(branch)) return;
    console.log("selectBranchName");
    if(branch){
      this.branchName=branch.Name;
      this.selectedBranch=branch;
      this.selectBranch(branch);
      //this.selectBranch(branch);
    }
  }

  public continueOrder() {
    console.log("continueOrder!!!!!!!!!!")
    this.dialogRef.close({
      isSaved: true,
      selectedBranch: this.selectedBranch,
      pickUpPoint: this.pickUpPoint
    });
  }

  private initializeOrders() {
    this.branches = this.data.branches || [];
    this.selectedOrderReceipt = this.data.selectedOrderReceipt || new OrderReceiptModel();
    this.orderReceipt = this.data.orderReceipt || new OrderReceiptModel();
    this.order = this.data.order || new OrderAppModel();

    console.log("orderReceipt",this.orderReceipt);
    console.log("order",this.order);
  }

  //public pickupPoints:boolean = true;
   public displayPickupPoints:boolean = false;
   public pickUpPoint:string="";
   public pickUpPointsList: any[]=[];

  public selectBranch(branch: BranchAppModel) {
    if (branch && branch.Id) {
      this.order.BranchId = branch.Id;
      this.appStorageService.branch = branch;
      if (AppConfig.configSettings.pickupPoints) {
        this.metaDataService.getDeliveryCitiesInformation(branch.Id)
              .subscribe((citiesResult) => {
                 console.log("citiesResult",citiesResult)
                if (citiesResult && citiesResult.length > 0) {
                  citiesResult.forEach((city) => {
                     console.log("city",city)
                    this.pickUpPointsList.push(city);
                  });
                  this.displayPickupPoints = true;
                } else {
                   if(this.isAvailableContinue()) this.continueOrder();
                }
              }, (error) => {
                console.log("error",error)
            });
            
        
      } else {
        if(this.isAvailableContinue()) this.continueOrder();
      }
      
    }
  }

   public selectPickUpPoint(city) {
    this.order.UserCity = city;
      if(this.isAvailableContinue()) this.continueOrder();
   }

  private initializeBranches() {
    this.filteredBranches = this.branchControl.valueChanges
      .pipe(
        startWith<string | BranchAppModel>(''),
        map(value => {
          return typeof value === 'string' ? value : value.Name;
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

    console.log("this.filteredBranches",this.filteredBranches);
    //this.filteredBranches.sort((a,b) => Number(b.IsOpenForDelivery) - Number(a.IsOpenForDelivery));
    this.filteredBranches = this.filteredBranches.pipe(map((data) => {
      data.sort((a, b) => {
          return a.IsOpenForDelivery < b.IsOpenForDelivery ? -1 : 1;
       });
      return data;
      }));



  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.selectBranchesByOrderReceipt()
      .filter(option => option.Name.toLowerCase()
        .indexOf(filterValue) === 0);
  }

  private selectBranchesByOrderReceipt() {
    console.log("selectBranchesByOrderReceipt");
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
      return this.branches.filter((branch) => {
        return branch.IsDigitalMenu;
      });
    } else {
      return this.branches;
    }
  } else {
    return [];
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

  public isBranchOpen(branch){
    if(this.selectedOrderReceipt.isDelivery){
      return branch.IsOpenForDelivery;
    } else if(this.selectedOrderReceipt.isTakeAway){
      return branch.IsOpenForTA;
    }  else if(this.selectedOrderReceipt.isSit){
      return branch.IsOpenForSit;
    }
  }

  private initializeGraphics() {
    this.graphics.logo = AppConfig.settings.logo;
    this.colors.buttonColor = AppConfig.settings.buttonColor;
    this.colors.menuColor = AppConfig.settings.menuColor;
    this.lang = this.translationsService.language();
  }

  public isAvailableContinue() {
    //console.log("isAvailableContinue()");
    //console.log("this.selectedBranch",this.selectedBranch);
    //console.log("this.selectedOrderReceipt",this.selectedOrderReceipt);
    //console.log("this.order",this.order);
    //console.log("this.order.BranchId",this.order.BranchId);
    //console.log("ggg",this.selectedBranch && (this.selectedOrderReceipt && (this.selectedOrderReceipt.isSit ||
      //this.selectedOrderReceipt.isDelivery || this.selectedOrderReceipt.isTakeAway || this.selectedOrderReceipt.isDigitalMenu)) &&
      //this.order && this.order.BranchId && this.order.IsTakeAway !== undefined &&
      //this.order.IsDelivery !== undefined)
    return this.selectedBranch && (this.selectedOrderReceipt && (this.selectedOrderReceipt.isSit ||
      this.selectedOrderReceipt.isDelivery || this.selectedOrderReceipt.isTakeAway || this.selectedOrderReceipt.isDigitalMenu)) &&
      this.order && this.order.BranchId && this.order.IsTakeAway !== undefined &&
      this.order.IsDelivery !== undefined;
  }

  public directionLanguage() {
    return LanguageEnum.HE;
  }

  

  public displayFn(branch?: BranchAppModel): string | undefined {
    return branch ? branch.Name : undefined;
  }

  public close() {
    console.log("close!!!!!!!!!!")
    this.dialogRef.close({
      isSaved: false
    });
  }

}
