import { Component, DoCheck, Inject, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { take } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA , MatDialogConfig } from '@angular/material/dialog';
import { TranslationsService } from '../../../shared/translations/translations.service';
import { AppConfig } from '../../../app.config';
import { AppStorageService } from '../../../app.storage.service';
import { ToppingAppModel } from '../../../models/menu/topping-app.model';
import { PizzaPriceAppModel } from '../../../models/pizza/pizza-price-app.model';
import { BrowserIdentificatorService } from '../../../core/services/common-settings/browser-identificator.service';
import { PizzaAppAdvancedModel } from '../../../models/advanced/pizza/pizza-app-advanced.model';
import { ToppingPriceAppModel } from '../../../models/menu/topping-price-app.model';
import { ToppingAppAdvancedModel } from '../../../models/advanced/pizza/topping-app-advanced.model';
import { CommonFunctionsService } from "../../../core/services/common-settings/common-functions.service";
import { NgScrollbar } from "ngx-scrollbar";
import {SizeMobileInitializationComponent} from '../../../shared/classes/size-mobile-initialization.component';
import {ItemCommentsComponent} from "../item-comments/item-comments.component";
import {MatDialog} from "@angular/material/dialog";
import ComboAppAdvancedModel from "../../../models/advanced/combo/combo-app-advanced.model";
import {ItemAppAdvancedModel} from "../../../models/advanced/menu/item-app-advanced.model";
import {GarnishAppModel} from "../../../models/menu/garnish-app.model";
import {GarnishGroupAppModel} from "../../../models/menu/garnish-group-app.model";
import {GarnishesComponent} from "../garnishes/garnishes.component";
import {GarnishAppAdvancedModel} from "../../../models/advanced/menu/garnish-app-advanced.model";
import {PizzaSizeAppModel} from "../../../models/pizza/pizza-size-app.model";
import {OrderItemAppModel} from "../../../models/order/order-item-app.model";
//import {PizzaComponent} from "../pizza/pizza.component";
import {NewPizzaComponent} from "../pizza/new-pizza.component";
import {PizzaComponent} from "../pizza/pizza.component";
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
  selector: 'combo',
  templateUrl: './combo.component.html',
  styleUrls: ['./combo.component.scss']
})
export class ComboComponent extends SizeMobileInitializationComponent implements OnInit, DoCheck {

  bsModalRef: BsModalRef;
  public lang: string;
  public cashSymbol: string;

  public toppings: ToppingAppAdvancedModel[] = [];

  @ViewChild(NgScrollbar) itemsAreaScrollbar: NgScrollbar;
  private timeOutForScrollUpdate: number = 200;

  public combo: ComboAppAdvancedModel;

  // For scrollbar:
  public disabled = this.isMobileBrowser();
  public shown: 'native' | 'hover' | 'always' = 'native';

  public selectedItems = {};
  public selectedPizzas = {};
  public showErrorComboMessage = false;
  private timeToDisplayImage = 10000;

  constructor (
    private appStorageService: AppStorageService,
    private translationService: TranslationsService,
    private modalService:BsModalService,
    public dialogRef: MatDialogRef<ComboComponent>,
    public dialog: MatDialog,
    public commonFunctionService: CommonFunctionsService,
    protected browserIdentificatorService: BrowserIdentificatorService,
    private commonFunctionsService: CommonFunctionsService,
    private matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: ComboData
  ) {
    super(browserIdentificatorService);
    if (this.data) {

    }
    this.initializeSize();
  }

  public colors = {
    menuColor: '',
    buttonColor: ''
  };

  ngOnInit() {
    this.initializeSettings();
    this.loadComboWithItems(this.data.combo);
  }

  public includeGarnishes(item: ItemAppAdvancedModel, cancellation?, adding?) {
    if (item) {
      if (item.GarnishGroups && item.GarnishGroups.length > 0) {
        const garnishGrp = item.GarnishGroups[0];
        this.loadingGarnishesPopup(item, null, garnishGrp, '', item.SelectedGarnishes, true, cancellation, adding);
      } else if (item.Garnishes && item.Garnishes.length > 0) {
        this.loadingGarnishesPopup(item, item.Garnishes, null, '', item.SelectedGarnishes, true, cancellation, adding);
      }
    }

  }

  private loadingGarnishesPopup(item, garnishes: GarnishAppModel[], garnishGroup: GarnishGroupAppModel,
                                comments: string, selectedGarnishes, isFirstPage?, cancellation?, adding?) {
    const matDialogRef = this.matDialog.open(GarnishesComponent, {
      data: {
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
      panelClass:  'custom-mat-dialog-mobile'
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
            this.loadingGarnishesPopup(item, null, grnGrp, result.comments,
              item.SelectedGarnishes, false, cancellation, adding);
          }
        } else if (!result.returnToPreviousPage && item.Garnishes && item.Garnishes.length > 0 &&  item.SelectedGarnishes &&
          result.isGarnishGroup) {
          this.loadingGarnishesPopup(item, item.Garnishes, null, result.comments,
            item.SelectedGarnishes, false, cancellation, adding);
        } else if (result.returnToPreviousPage && item && item.GarnishGroups &&
          item.GarnishGroups.indexOf(garnishGroup) !== -1 &&
          item.GarnishGroups.indexOf(garnishGroup) - 1 > -1) {
          const grnGrp = item.GarnishGroups[item.GarnishGroups.indexOf(garnishGroup) - 1];
          if (grnGrp && grnGrp.Garnishes && grnGrp.Garnishes.length > 0) {
            this.loadingGarnishesPopup(item, null, grnGrp, result.comments,
              item.SelectedGarnishes, item.GarnishGroups.indexOf(grnGrp) === 0, cancellation, adding);
          }
        } else if (result.returnToPreviousPage && item.Garnishes &&
          item.Garnishes.length > 0 &&  item.SelectedGarnishes) {
          if (item.Garnishes) {
            const grnGrp = item.GarnishGroups[item.GarnishGroups.length - 1];
            if (grnGrp) {
              this.loadingGarnishesPopup(item, null, grnGrp, result.comments,
                item.SelectedGarnishes, item.GarnishGroups.indexOf(grnGrp) === 0, cancellation, adding);
            }
          }
        }  else if (!result.returnToPreviousPage) {
          // If everything was added to list of garnishes - add to card
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
      const isSelectedAllNeededGarnishesByGroup = (garnishGroup, item) => {
        if (garnishGroup) {
          const countOfGarnishesArray = item.SelectedGarnishes.filter((garnish) => {
            return garnish.IsSelected && garnishGroup.Garnishes && garnishGroup.Garnishes[0] &&
              garnish.GarnishGroupId === garnishGroup.Garnishes[0].GarnishGroupId;
          });
          return ((garnishGroup.Min == garnishGroup.Max && garnishGroup.Max != 0) || (garnishGroup.Min != garnishGroup.Max )) ?
            ((countOfGarnishesArray.length >= garnishGroup.Min && countOfGarnishesArray.length <= garnishGroup.Max)
              || (countOfGarnishesArray.length >= garnishGroup.Min &&
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
  }


  private initializeSettings() {
    this.lang = this.translationService.language();
    this.cashSymbol = AppConfig.cashSymbol;
    this.colors.menuColor = AppConfig.settings.menuColor;
    this.colors.buttonColor = AppConfig.settings.buttonColor;
  }

  private displayPizza(pizza, cancellation, adding) {
    const pizzaSize = pizza.SelectedPizzaPriceSize;
    this.loadToppings(pizza, pizzaSize, pizza.specialRequests, cancellation, adding);
  }

  private loadToppings(pizza: PizzaAppAdvancedModel,
                       pizzaSize: PizzaSizeAppModel,
                       specialRequests: string, cancellation, adding) {
    
    
    
    const initialState = {
      pizza: pizza,
      pizzaSizePrice: pizzaSize,
      specialRequests,
      isCombo: true
    };
    this.bsModalRef = this.modalService.show(PizzaComponent, 
    {initialState, class:'modal-dialog modal-xl'});
     
    this.modalService.onHide.pipe(take(1)).subscribe(() => {      
        if (this.bsModalRef.content.isSaved && this.bsModalRef.content.pizza) {
          if (adding) {
            const pizza = this.commonFunctionsService.deepCopy(this.bsModalRef.content.pizza);
            pizza.specialRequests = this.bsModalRef.content.specialRequests;
            adding(pizza);
          }
        }
    });
      
  /*  const matDialogRefPizza = this.matDialog.open(NewPizzaComponent, {
      data: {
        pizza,
        pizzaSizePrice: pizzaSize,
        specialRequests,
        isCombo: true
      },
      width: '80%',
      //  minWidth: '800px',
      maxWidth: '1280px',
      disableClose: true,
      panelClass: 'custom-mat-dialog-mobile'
    });
    matDialogRefPizza.afterClosed().subscribe((result: PizzaDialog) => {
      if (result && result.isSaved) {
        if (adding) {
          const pizza = this.commonFunctionsService.deepCopy(result.pizza);
          pizza.specialRequests = result.specialRequests;
          adding(pizza);
        }
      }
    });*/
  }




  addPizzaToppings(pizza, comboPizzaId, sizeId, currentItem, index) {
    pizza = this.commonFunctionsService.deepCopy(pizza);
    pizza.IsItem = false;
    pizza.Amount = 1;
    if (pizza.SelectedToppings === undefined || pizza.SelectedToppings === null) {
      pizza.SelectedToppings = [];
    }
    if (!pizza.SelectedPizzaPriceSize) {
     pizza.SelectedPizzaPriceSize =
        pizza.PizzaPrices.find((e) => {
          return e.PizzaSizeId == sizeId;
        });
    }

    this.displayPizza(pizza, () => {
      currentItem[index] = {comboPizzaId: comboPizzaId};
    }, (item) => {
      Object.keys(item).forEach(k =>  currentItem[index][k] = item[k]);
    });
  }



  private selectPizzaSize = function (sizeId) {
    this.pizzaToppings.forEach(function (topping) {
      var toppingPrice = topping.ToppingPrices.find((e) => {
        return e.PizzaSizeId == sizeId
      });
      topping.currentPrice = toppingPrice.Price;
      var quarterPrice = toppingPrice.Price / 4;
      //  topping.quarterPrice = quarterPrice;
    })
  }

  private loadComboWithItems(comboItem) {
    this.combo = this.commonFunctionsService.deepCopy(comboItem);
    if (!this.combo) {
      return;
    }
    (this.combo.ItemCombos || []).forEach((comboItem, index) => {
      comboItem.IsCollapsed=true;
      var itemsToPush = [];
      for (let i = 0; i < +comboItem.Quantity; i++) {
        itemsToPush.push({IsCollapsed: true});
      }
      itemsToPush.forEach((item) => {
        item.IsCollapsed = true;
        item.ComboItemId = comboItem.Id;
      
      });
      this.selectedItems[comboItem.Id] = itemsToPush;
    });
   
    (this.combo.PizzaCombos || []).forEach((comboPizza, index) => {
      const itemsToPush = [];
      for (let i = 0; i < +comboPizza.Quantity; i++) {
        const currentPizza = this.commonFunctionsService.deepCopy(comboPizza.Pizza);
        currentPizza.ComboPizza = this.commonFunctionsService.deepCopy(comboPizza);
        itemsToPush.push(currentPizza);
      }
      itemsToPush.forEach((item) => {
        item.ComboPizzaId = comboPizza.Id;
      });
      this.selectedPizzas[comboPizza.Id] = itemsToPush;
    });
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

  private preparePizzaSize() {
    const combosItems = {};
    (this.combo.PizzaCombos || []).forEach(p => {
      combosItems[p.Id] = p;
    });

    Object.keys(this.selectedPizzas).forEach((pizzaCombo) => {
      this.selectedPizzas[pizzaCombo].forEach((pizza) => {
        if (pizza.SelectedToppings === undefined || pizza.SelectedToppings === null) {
          pizza.SelectedToppings = [];
        }
        if (!pizza.DefaultPrice || !pizza.SelectedPizzaPriceSize) {
          pizza.DefaultPrice = pizza.SelectedPizzaPriceSize =
            pizza.PizzaPrices.find((e) => {
              return combosItems[pizzaCombo] && e.PizzaSizeId == combosItems[pizzaCombo].PizzaId;
            });
        }
      });
    });
  }

  private getSelectedItemsFromCombo(selectedItems) {
    return Object.keys(selectedItems).reduce((sumItems, items) => {
      if (items) {
        sumItems = sumItems.concat(selectedItems[items] || []);
      }
      return sumItems;
    }, []);
  }

  public save(isPrevious?) {
    this.showErrorComboMessage = false;
    if (this.isAllDataFilled()) {
      this.preparePizzaSize();
      this.combo.SelectedItems = this.getSelectedItemsFromCombo(this.selectedItems);
      this.combo.SelectedPizzas = this.getSelectedItemsFromCombo(this.selectedPizzas);

      this.dialogRef.close({
        isSaved: true,
        combo: this.combo
      });
    } else {
      this.displayNotificationMessage();
      this.displayMessageByTime();
    }

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
    this.showErrorComboMessage = false;
    this.dialogRef.close({
      isSaved: false
    });
  }

  ngDoCheck(): void {
   // this.updateScroll();
  }

}
