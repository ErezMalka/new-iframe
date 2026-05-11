import { Component, Input , OnInit, } from '@angular/core';
import { take } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';
import { TranslationsService } from '../../../shared/translations/translations.service';
import { AppConfig } from '../../../app.config';
import { AppStorageService } from '../../../app.storage.service';
import { BrowserIdentificatorService } from '../../../core/services/common-settings/browser-identificator.service';
import { PizzaAppAdvancedModel } from '../../../models/advanced/pizza/pizza-app-advanced.model';
import { ToppingAppAdvancedModel } from '../../../models/advanced/pizza/topping-app-advanced.model';
import { CommonFunctionsService } from "../../../core/services/common-settings/common-functions.service";
import {ItemCommentsComponent} from "../item-comments/item-comments.component";
import {MatDialog} from "@angular/material/dialog";
import ComboAppAdvancedModel from "../../../models/advanced/combo/combo-app-advanced.model";
import {ItemAppAdvancedModel} from "../../../models/advanced/menu/item-app-advanced.model";
import {GarnishAppModel} from "../../../models/menu/garnish-app.model";
import {GarnishGroupAppModel} from "../../../models/menu/garnish-group-app.model";
import {GarnishesComponent} from "../garnishes/garnishes.component";
import {GarnishAppAdvancedModel} from "../../../models/advanced/menu/garnish-app-advanced.model";
import {PizzaSizeAppModel} from "../../../models/pizza/pizza-size-app.model";
//import {OrderItemAppModel} from "../../../models/order/order-item-app.model";
import {PizzaComponent} from "../pizza/pizza.component";

import {NewPizzaComponent} from "../pizza/new-pizza.component";
import { threadId } from 'worker_threads';

class ComboData {
  combo: ComboAppAdvancedModel;
  menu: any;
}
class GarnishesDialog {
  public selectedGarnishes: GarnishAppAdvancedModel[];
  public comments: string;
  public isSaved: boolean;
  public freeCount: number;
  public allGettingGarnishes: GarnishAppAdvancedModel[];
  public isGarnishGroup: boolean;
  public returnToPreviousPage: boolean;
}

class PizzaDialog {
  public pizza: PizzaAppAdvancedModel;
  public specialRequests: string;
  public isSaved?: boolean;
  public isReturnToPrevPage: boolean;
  public pizzaSize: PizzaSizeAppModel;
}

@Component({
  selector: 'item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
//export class ComboComponent extends SizeMobileInitializationComponent implements OnInit, DoCheck {

export class ItemComponent implements OnInit {

  //@Input() data: ComboData;
  
  public lang: string;
  public cashSymbol: string;

  public toppings: ToppingAppAdvancedModel[] = [];

  public comments:string;
  public isDigitalMenu:boolean = false;
  public combo: ComboAppAdvancedModel;
  public item: ItemAppAdvancedModel;
  public price: number;
  public  isSaved:boolean = false;
  public  isEdit:boolean = false;
  public imgSrc: any;
  public isExists : boolean;

  public isCmItem: boolean = false;
  
  // For scrollbar:
  //public disabled = this.isMobileBrowser();
  //public shown: 'native' | 'hover' | 'always' = 'native';

  public selectedItems = {};
  public selectedPizzas = {};
  public showErrorComboMessage = false;
  private timeToDisplayImage = 10000;
  bsModal: BsModalRef;
  constructor ( private modalService: BsModalService,
     private translationService: TranslationsService,
     public bsModalRef: BsModalRef,
    public dialog: MatDialog,
    public commonFunctionService: CommonFunctionsService,
    protected browserIdentificatorService: BrowserIdentificatorService,
    private commonFunctionsService: CommonFunctionsService,
    private matDialog: MatDialog//,
   ) {
    
  }

  public colors = {
    menuColor: '',
    buttonColor: ''
  };

  ngOnInit() {
    this.initializeSettings();
    this.item = this.commonFunctionService.deepCopy(this.item);
    this.isCmItem = this.commonFunctionService.deepCopy(this.isCmItem);
    if (this.isCmItem)  this.item.IsClubMemberItem = true;
    this.price = this.item.Price;
    this.comments = "";
    //this.loadComboWithItems(this.combo);
  }

  public getLanguage() {

    //console.log("this.translationsService.language()", this.translationsService.language());
    return this.translationService.language();
  }

  public findGarnishGroupToOpenForEdit(garnish, cancellation, adding){
    this.item.GarnishGroups.forEach(gGroup => {
      if(garnish.GarnishGroupId == gGroup.Id ){
        console.log("foundGroup");
        var foundGroup = gGroup;
        var refresh = this.isEdit;
        this.loadingGarnishesPopup(this.item, refresh, null, foundGroup,'',this.item.SelectedGarnishes, true, cancellation, adding)
      }
      
    });
  }
//loadingGarnishesPopup(item,null,item.GarnishGroups[i],'',item.SelectedGarnishes, true, cancellation, adding)


  logo(event) {
  
   // console.log("logo-function",AppConfig.settings.logo);
    event.target.src = AppConfig.settings.logo; 
    //this.imgSrc = AppConfig.settings.logo;
  }

  


  



  public subAmount(item) {
    if (item.Amount > 1)   {
      item.Amount--;
    }
  }

  public addAmount(item) {   
    item.Amount++;
   // item.Price += this.price; 
  }

  public includeGarnishes(item: ItemAppAdvancedModel, cancellation?, adding?) {
    if (item) {
      if (item.GarnishGroups && item.GarnishGroups.length > 0) {
        const garnishGrp = item.GarnishGroups[0];
        const garnishGroups = item.GarnishGroups;
        var refresh = this.isEdit;
        this.loadingGarnishesPopup(item, refresh, null, garnishGrp, '', item.SelectedGarnishes, true, cancellation, adding);
      } else if (item.Garnishes && item.Garnishes.length > 0) {
        this.loadingGarnishesPopup(item, refresh, item.Garnishes, null, '', item.SelectedGarnishes, true, cancellation, adding);
      }
    }

  }

  private loadingGarnishesPopup(item, refresh,  garnishes: GarnishAppModel[], garnishGroup: GarnishGroupAppModel,
    comments: string, selectedGarnishes, isFirstPage?, cancellation?, adding?) {
    const matDialogRef = this.matDialog.open(GarnishesComponent, {
      data: {
        refresh: refresh,
        item: item,
        garnishGroup: garnishGroup,
        garnishes: garnishes,
        comments: comments,
        selectedGarnishes,
        isFirstPage,
        isCombo: true
      },
      width: '95%',
      maxWidth: '1000px',
      disableClose: true,
      panelClass: 'custom-mat-dialog-mobile'
    });
    matDialogRef.afterClosed().subscribe((result: GarnishesDialog) => {
      if (result.isSaved) {
        if (result && result.allGettingGarnishes && item && !result.returnToPreviousPage) {
          item.SelectedGarnishes = result.allGettingGarnishes.slice();
        }
        if (!result.returnToPreviousPage && item && item.GarnishGroups && item.GarnishGroups.indexOf(garnishGroup) != -1 &&
          item.GarnishGroups.indexOf(garnishGroup) + 1 < item.GarnishGroups.length) {
          const grnGrp = item.GarnishGroups[item.GarnishGroups.indexOf(garnishGroup) + 1];
          if (grnGrp && grnGrp.Garnishes && grnGrp.Garnishes.length > 0) {
            this.loadingGarnishesPopup(item,refresh, null, grnGrp, result.comments,
              item.SelectedGarnishes, false, cancellation, adding);
          }
        } else if (!result.returnToPreviousPage && item.Garnishes && item.Garnishes.length > 0 && item.SelectedGarnishes &&
          result.isGarnishGroup) {
          this.loadingGarnishesPopup(item,refresh, item.Garnishes, null, result.comments,
            item.SelectedGarnishes, false, cancellation, adding);
        } else if (result.returnToPreviousPage && item && item.GarnishGroups &&
          item.GarnishGroups.indexOf(garnishGroup) !== -1 &&
          item.GarnishGroups.indexOf(garnishGroup) - 1 > -1) {
          const grnGrp = item.GarnishGroups[item.GarnishGroups.indexOf(garnishGroup) - 1];
          if (grnGrp && grnGrp.Garnishes && grnGrp.Garnishes.length > 0) {
            this.loadingGarnishesPopup(item,refresh,null, grnGrp, result.comments,
              item.SelectedGarnishes, item.GarnishGroups.indexOf(grnGrp) === 0, cancellation, adding);
          }
        } else if (result.returnToPreviousPage && item.Garnishes &&
          item.Garnishes.length > 0 && item.SelectedGarnishes) {
          if (item.Garnishes) {
            const grnGrp = item.GarnishGroups[item.GarnishGroups.length - 1];
            if (grnGrp) {
              this.loadingGarnishesPopup(item,refresh, null, grnGrp, result.comments,
                item.SelectedGarnishes, item.GarnishGroups.indexOf(grnGrp) === 0, cancellation, adding);
            }
          }
        } else if (!result.returnToPreviousPage) {
          // If everything was added to list of garnishes - add to card
          console.log("addToCartItemWithGarnishes");
          this.addToCartItemWithGarnishes(item, result, adding);

        } else {

        }
      } else {
        if (cancellation) {
          cancellation();
        }
      }
    });
  }

  public displayComments() {
    this.dialog.open(ItemCommentsComponent, {
      data: {
        comments: this.comments
      },
      width: '80%',
      disableClose: true,
      panelClass: 'custom-mat-dialog-comments'
    }).afterClosed().subscribe((comments) => {
      this.comments = comments || '';
    })
  }

  private addToCartItemWithGarnishes(item, data?, adding?) {
    if (!this.isNotFilledAllRequiredGarnishesOfGarnishGroup(item)) {
      if (data && data.comments) {
        item.SpecialRequests = data.comments || '';
      }
      if (adding) {
        adding(item);
      }
    }
  }


  private isNotFilledAllRequiredGarnishesOfGarnishGroup(item: ItemAppAdvancedModel) {
    let requireMinMaxOptions = false;
    if (item && item.GarnishGroups) {
      const countOfGarnishes = (arr:any[]) => {
        let counter=0;
        arr.forEach((e)=> {
          counter += e.SelectedAmount;
        });
        //console.log("counter",counter);
        return counter;
        
      };
      const isSelectedAllNeededGarnishesByGroup = (garnishGroup, item) => {
        if (garnishGroup) {
          const countOfGarnishesArray = item.SelectedGarnishes.filter((garnish) => {
            return garnish.IsSelected && garnishGroup.Garnishes && garnishGroup.Garnishes[0] &&
              garnish.GarnishGroupId === garnishGroup.Garnishes[0].GarnishGroupId;
          });
         // console.log("countOfGarnishesArray",countOfGarnishesArray);
          return ((garnishGroup.Min == garnishGroup.Max && garnishGroup.Max != 0) || (garnishGroup.Min != garnishGroup.Max )) ?
            ((countOfGarnishes(countOfGarnishesArray) >= garnishGroup.Min && countOfGarnishes(countOfGarnishesArray) <= garnishGroup.Max)
              || (countOfGarnishes(countOfGarnishesArray) >= garnishGroup.Min &&
                garnishGroup.Min > garnishGroup.Max)) : true;
        }
        return false;
      };
      item.GarnishGroups.forEach((it) => {
        if (!requireMinMaxOptions) {
          requireMinMaxOptions = !isSelectedAllNeededGarnishesByGroup(it, item);
        }
      });
    }
    return requireMinMaxOptions;
  }

  addItem(selectedItem, comboItemId, currentItem, index, comboItem) {
    this.showErrorComboMessage = false;
    if (!selectedItem) {
      return;
    }
    const item = this.commonFunctionsService.deepCopy(selectedItem);
    item.ComboItemId = comboItemId;
    if (item && ((item.Garnishes && item.Garnishes.length > 0) ||
      (item.GarnishGroups && item.GarnishGroups.length > 0))) {
      this.includeGarnishes(item, () => {
        currentItem[index] = {ComboItemId: comboItemId};
      }, (item) => {
        Object.keys(item).forEach(k =>  currentItem[index][k] = item[k]);
      });
    } else {
      Object.keys(item).forEach(k =>  currentItem[index][k] = item[k]);
    }
   // currentItem[index].IsItem = true;
   comboItem.IsCollapsed=true;
   currentItem[index].IsCollapsed=true;
  }


  private initializeSettings() {
    this.lang = this.translationService.language();
    this.cashSymbol = AppConfig.cashSymbol;
    this.colors.menuColor = AppConfig.settings.menuColor;
    this.colors.buttonColor = AppConfig.settings.buttonColor;
  }

 
  
  public isMobileBrowser() {
    return this.browserIdentificatorService.isMobile.Android() ||
      this.browserIdentificatorService.isMobile.Windows() ||
      this.browserIdentificatorService.isMobile.iOS();
  }

  private isAllDataFilled() {
    const allItemFilled = Object.keys(this.selectedItems).every((key) => {
      return this.selectedItems[key] && this.selectedItems[key].every(item => item.Id);
    });
    const allPizzaFilled = Object.keys(this.selectedPizzas).every((key) => {
      return this.selectedPizzas[key] && this.selectedPizzas[key].every(item => item.Id);
    });
    return allItemFilled && allPizzaFilled;
  }

   

  public save(isPrevious?) {
    console.log("save");
    this.showErrorComboMessage = false;
    //if (this.isAllDataFilled()) {
      this.isSaved = true;
      this.bsModalRef.hide();//{ //this.dialogRef.close({
        //isSaved: true,
       // combo: this.combo
     // });
   // } else {
      //this.displayNotificationMessage();
     // this.displayMessageByTime();
    //}

  }

  private displayMessageByTime() {
    setTimeout(() => {
      this.showErrorComboMessage = false;
    }, this.timeToDisplayImage)
  }

  displayErrorComboMessage() {
    return this.translationService.translate('COMBO_ERROR_NO_ITEMS');
  }

  private displayNotificationMessage() {
     this.showErrorComboMessage = true;
  }

  public cancel(isPrevious?) {
    console.log("cancel()");
    this.showErrorComboMessage = false;
    this.isSaved = false;
    this.bsModalRef.hide();
   // this.dialogRef.close({
    //  isSaved: false
   // });
  }

  ngDoCheck(): void {
   // this.updateScroll();
  }

  calculateItemSum(item){
    let sumOfGarnishes=0;
    const garnishes = [];
    if (item.SelectedGarnishes) {
      item.SelectedGarnishes.forEach((garnish: GarnishAppAdvancedModel) => {
        garnishes.push(garnish);
        if (garnish.SelectedAmount > 1) {
          for (let i = 0; i < garnish.SelectedAmount - 1; i++) {
            const grn = this.commonFunctionsService.deepCopy(garnish);
            grn.SelectedAmount = 1;
            garnishes.push(grn);
          }
        }
        garnish.SelectedAmount = 1;
      });
    }
    // Check if some garnish groups have free count of garnishes
    // Group of garnishes:
    const garnishesGroup = {};
    garnishes.forEach((garnish) => {
      if (garnish) {
        garnishesGroup[garnish.GarnishGroupId] = garnishesGroup[garnish.GarnishGroupId] || [];
        garnishesGroup[garnish.GarnishGroupId].push(garnish);
      }
    });
    // Check free count of garnishGroup:
    Object.keys(garnishesGroup).forEach((key) => {
      if (item.GarnishGroups) {
        for (let i = 0; i < item.GarnishGroups.length; i++) {
          if (item.GarnishGroups[i].Garnishes && item.GarnishGroups[i].Garnishes[0]
            && item.GarnishGroups[i].Garnishes[0].GarnishGroupId === +key && item.GarnishGroups[i].FreeCount) {
            garnishesGroup[key].map((garnish, index) => {
              //console.log("item.GarnishGroups[i].FreeCount", item.GarnishGroups[i].FreeCount);
             
              if (index < item.GarnishGroups[i].FreeCount) {
                garnish.Price = 0;
              } else {
                garnish.Price =  garnish.Price;
              }
            });
          }
        }
      }
    });
    garnishes.forEach((gar) => {
      sumOfGarnishes += gar.Price;
    });
   // return  sumOfGarnishes;
    return item.Amount * (item.Price + sumOfGarnishes);
  }
}
