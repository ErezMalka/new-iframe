import { Component, Input, OnInit, } from '@angular/core';
import { take } from 'rxjs/operators';
//import { NgbActiveModal } from 'ngx-bootstrap/modal';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslationsService } from '../../../shared/translations/translations.service';
import { AppConfig } from '../../../app.config';
import { AppStorageService } from '../../../app.storage.service';
//import { ToppingAppModel } from '../../../models/menu/topping-app.model';
//import { PizzaPriceAppModel } from '../../../models/pizza/pizza-price-app.model';
import { BrowserIdentificatorService } from '../../../core/services/common-settings/browser-identificator.service';
import { PizzaAppAdvancedModel } from '../../../models/advanced/pizza/pizza-app-advanced.model';
//import { ToppingPriceAppModel } from '../../../models/menu/topping-price-app.model';
import { ToppingAppAdvancedModel } from '../../../models/advanced/pizza/topping-app-advanced.model';
import { CommonFunctionsService } from "../../../core/services/common-settings/common-functions.service";
//import { NgScrollbar } from "ngx-scrollbar";
//import {SizeMobileInitializationComponent} from '../../../shared/classes/size-mobile-initialization.component';
import { ItemCommentsComponent } from "../item-comments/item-comments.component";
import { MatDialog } from "@angular/material/dialog";
import ComboAppAdvancedModel from "../../../models/advanced/combo/combo-app-advanced.model";
import { ItemAppAdvancedModel } from "../../../models/advanced/menu/item-app-advanced.model";
import { GarnishAppModel } from "../../../models/menu/garnish-app.model";
import { GarnishGroupAppModel } from "../../../models/menu/garnish-group-app.model";
import { GarnishesComponent } from "../garnishes/garnishes.component";
import { GarnishAppAdvancedModel } from "../../../models/advanced/menu/garnish-app-advanced.model";
import { PizzaSizeAppModel } from "../../../models/pizza/pizza-size-app.model";
//import {OrderItemAppModel} from "../../../models/order/order-item-app.model";
import { PizzaComponent } from "../pizza/pizza.component";
import { NewPizzaComponent } from "../pizza/new-pizza.component";
import { DeviceDetectorService } from 'ngx-device-detector';
import { ItemForComboComponent } from '../item-for-combo/item-for-combo.component';
import ItemComboAppModel from '../../../models/combo/item-combo-app.model';
import { ItemAppModel } from '../../../models/menu/item-app.model';
import { group } from 'console';

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
  public itemPriceWithGarnishes: number;
  public selectedGarnishesPrice: number;
}

class PizzaDialog {
  public pizza: PizzaAppAdvancedModel;
  public specialRequests: string;
  public isSaved?: boolean;
  public isReturnToPrevPage: boolean;
  public pizzaSize: PizzaSizeAppModel;
}

@Component({
  selector: 'new-combo',
  templateUrl: './new-combo.component.html',
  styleUrls: ['./combo.component.scss']
})
//export class ComboComponent extends SizeMobileInitializationComponent implements OnInit, DoCheck {

export class NewComboComponent implements OnInit {

  //@Input() data: ComboData;

  public lang: string;
  public cashSymbol: string;
  public comments: string;
  public toppings: ToppingAppAdvancedModel[] = [];

  //@ViewChild(NgScrollbar) itemsAreaScrollbar: NgScrollbar;
  //private timeOutForScrollUpdate: number = 200;

  public combo: ComboAppAdvancedModel;
  public useInventory: boolean =false;
  public isSaved: boolean = false;
  // For scrollbar:
  //public disabled = this.isMobileBrowser();
  //public shown: 'native' | 'hover' | 'always' = 'native';

  public selectedItems = {};
  public selectedPizzas = {};
  public showErrorComboMessage = false;
  private timeToDisplayImage = 10000;
  bsModal: BsModalRef;

  public tempArr: ItemAppAdvancedModel[] = [];
  isItemWithItemGroups: boolean = false;
  private pizzaBaseLoaded: boolean = true;


  constructor(private modalService: BsModalService,
    //private appStorageService: AppStorageService,
    private translationService: TranslationsService,
    //public dialogRef: MatDialogRef<ComboComponent>,
    public bsModalRef: BsModalRef,
    public dialog: MatDialog,
    public commonFunctionService: CommonFunctionsService,
    protected browserIdentificatorService: BrowserIdentificatorService,
    private commonFunctionsService: CommonFunctionsService,
    private deviceService: DeviceDetectorService,
    private matDialog: MatDialog//,
    //@Inject(MAT_DIALOG_DATA) public data: ComboData
  ) {
    // super(browserIdentificatorService);
    //if (this.data) {

    //}
    // this.initializeSize();
  }

  public colors = {
    menuColor: '',
    buttonColor: ''
  };

  ngOnInit() {
    this.initializeSettings();

    if (this.combo.IsComboFull) {
      this.loadComboWithItems(this.combo);
      this.displayShortDescription();
      this.addProperty();
      if (this.combo.NewPizzaCombos.length > 0) {
        this.combo.NewPizzaCombos[0].IsSelected = true; // First card-header is open
      }
      else if (this.combo.PizzaCombos.length > 0) {

      }
      else if (this.combo.ItemCombos && this.combo.ItemCombos.length > 0)
        this.combo.ItemCombos[0].IsSelected = true; // First card-header is open
      else if ((!this.combo.ItemCombos || this.combo.ItemCombos.length == 0) && this.combo.NewItemCombos && this.combo.NewItemCombos.length > 0)
        this.combo.NewItemCombos[0].IsSelected = true;
    }
    else{
      console.log("item with item groups : this.combo",this.combo);
      this.combo.Description = this.combo.Information;
      this.isItemWithItemGroups = true;
      console.log("isItemWithItemGroups",this.isItemWithItemGroups);
      this.loadItemWithItems(this.combo);
     // this.displayShortDescription();
      this.addPropertyForItemWithGroups();

      if (this.combo.ItemGroups && this.combo.ItemGroups.length > 0)
        this.combo.ItemGroups[0].IsSelected = true;
    }


  }

  public getLanguage() {
    return this.translationService.language();
  }

  /*logo(event) {

    console.log("logo-function", AppConfig.settings.logo);
    event.target.src = AppConfig.settings.logo;
    //this.imgSrc = AppConfig.settings.logo;
  }*/

   logo(event) {
   /* if (this.doesFileExist(AppConfig.settings.logo)) {
      event.target.src = AppConfig.settings.logo;
    }  else {
      event.target.style.display = "none";
    }*/
   
    const img = event.target as HTMLImageElement;

    // If we already tried the logo → remove the image entirely
    if (img.src.includes(AppConfig.settings.logo)) {
      img.style.display = 'none';
      return;
    }

    // Try logo fallback
    img.src = AppConfig.settings.logo;
   // img.style.height = 'fit-content'
     img.style.width = '60%'
   
  }

  public displayShortDescription() {

    this.combo.ItemCombos.forEach(comboItem => {
      //comboItem.IsCollapsed = false;
      comboItem.Items.forEach(item => {

        item.ShortInfo = "";
        if (item.Information && item.Information.length > 0) {
          var txtArr = item.Information.split(' ');
          if (txtArr.length > 6) {
            for (let index = 0; index < 7; index++) {
              if (txtArr[index])
                item.ShortInfo = item.ShortInfo + txtArr[index] + " ";
            }
            item.ShortInfo += "..."
          }
          else {
            item.ShortInfo = item.Information;
          }
        }
      });
    });
    this.combo.NewItemCombos.forEach(comboItem => {
      //comboItem.IsCollapsed = false;
      comboItem.Items.forEach(item => {

        item.ShortInfo = "";
        if (item.Information && item.Information.length > 0) {
          var txtArr = item.Information.split(' ');
          if (txtArr.length > 6) {
            for (let index = 0; index < 7; index++) {
              if (txtArr[index])
                item.ShortInfo = item.ShortInfo + txtArr[index] + " ";
            }
            item.ShortInfo += "..."
          }
          else {
            item.ShortInfo = item.Information;
          }
        }
      });
    });

  }

  isMobileMode(): boolean {
    return this.deviceService.isMobile() || this.deviceService.isTablet();
  }

  public includeGarnishes(item: ItemAppAdvancedModel, cancellation?, adding?) {
    console.log("adding", adding);
    console.log("includeGarnishes");
    console.log("item", item);
    if (item) {
      if ((item.GarnishGroups && item.GarnishGroups.length > 0) || (item.GeneralGarnishGroups && item.GeneralGarnishGroups.length > 0)) {
        if (item.GarnishGroups && item.GarnishGroups.length > 0) {
          var garnishGrp = item.GarnishGroups[0];
          console.log("garnishGrp", garnishGrp);
        }
        /*else if(item.GeneralGarnishGroups && item.GeneralGarnishGroups.length > 0){
          var garnishGrp = item.GarnishGroups[0];
          console.log("garnishGrp", garnishGrp);
        }*/
        else if (item.GeneralGarnishGroups && item.GeneralGarnishGroups.length > 0 && (!item.GarnishGroups || item.GarnishGroups.length == 0)) {
          console.log("NO GARNISHGROUPS");
          garnishGrp = item.GeneralGarnishGroups[0];
          console.log("garnishGrp", garnishGrp);
        }
        if (this.isMobileMode()) {
          console.log("This is mobile mode");
          this.loadingGarnishesPopup(item, null, garnishGrp, '', item.SelectedGarnishes, true, cancellation, adding);
        }
        else {
          console.log("This is NOT mobile mode");
          this.loadItemPopupDesktop(item, cancellation, adding);
        }
      } else if (item.Garnishes && item.Garnishes.length > 0) {
        this.loadingGarnishesPopup(item, item.Garnishes, null, '', item.SelectedGarnishes, true, cancellation, adding);
        //TODO add items without garnishes
      }
    }

  }

  public includePizzaGarnishes(item: PizzaAppAdvancedModel, isBeforePizza:boolean, cancellation?, adding?) {
    console.log("cancellation",cancellation);
    console.log("adding",adding);
    if (item && (item.GeneralGarnishGroups && item.GeneralGarnishGroups.length > 0 )) {
      if (!this.isMobileMode()) {
        console.log("this.loadItemPopupDesktop(item);",item);
        this.loadPizzaGarnishesPopupDesktop(item, isBeforePizza, cancellation, adding);        
      } else {
        var garnishGrp:GarnishGroupAppModel;
        if (isBeforePizza) garnishGrp = item.GarnishGroupsBeforePizza[0];
        else  garnishGrp = item.GarnishGroupsAfterPizza[0];
        console.log("garnishGrp",garnishGrp);
        
        this.loadingGarnishesPopupForPizza(item, isBeforePizza, garnishGrp, 
                                           item.SelectedGarnishes, true, 0, cancellation, adding);
      }              
    }
 
  }
  

  private loadPizzaGarnishesPopupDesktop(item, isBeforePizza,  cancellation?, adding?) {
    console.log("isBeforePizza",isBeforePizza);
    console.log("loadItemPopupDesktop(item)");
    console.log("item", item);
    const matDialogRef = this.matDialog.open(ItemForComboComponent, {
      data: {
        item: item,
        showBeforePizzaGarnishes: isBeforePizza
      },
      disableClose: true,
      panelClass: 'modal-dialog-item-with-garnishes-mat-dialog'
    });
    matDialogRef.afterClosed().subscribe((result) => {
      console.log("result-afterLoadItem", result);
      if (result.isSaved) {
        console.log("item-with-garnishes-saved");
        item.SelectedGarnishes =  result.item.SelectedGarnishes;
        if (isBeforePizza){
              
          this.pizzaBaseLoaded = true;
        } //else {
          this.addToCartItemWithGarnishes(result.item, result, adding);         
          if (item.GeneralGarnishGroups && item.GeneralGarnishGroups.length > 0 && (!item.GarnishGroups || item.GarnishGroups.length == 0)) {
            item.GeneralGarnishGroups.forEach(gGroup => {
              console.log("gGroup", gGroup);
              gGroup.Garnishes.forEach(gar => {
                result.item.SelectedGarnishes.forEach(selGar => {
                  if (selGar.Id == gar.Id) {
                    gar.IsSelected = true;
                  }
                });
              });
            });
          //}
          console.log("!!!! item", item);
          item.IsSelected=true;
          // Tanya 29.05.23
          if (this.combo.NewPizzaCombos.length > 0) {
            const itemGroupFound = this.combo.NewPizzaCombos.find(({ Id }) => Id === item.ComboPizzaId);
            console.log("itemGroupFound", itemGroupFound);
            if (itemGroupFound) {

              itemGroupFound.ItemIsSelected = true;
            }
          //  adding(pizza);
          } else {
            const itemGroupFound = this.combo.PizzaCombos.find(({ Id }) => Id === item.ComboPizzaId);
            console.log("itemGroupFound", itemGroupFound);
            if (itemGroupFound) {

              itemGroupFound.ItemIsSelected = true;
            }
           // adding(pizza);
          }
        }
          
        
      }

    });
  }

  private loadItemPopupDesktop(item, cancellation?, adding?) {
    console.log("loadItemPopupDesktop(item)");
    console.log("item", item);
    const matDialogRef = this.matDialog.open(ItemForComboComponent, {
      data: {
        item: item
      },
      disableClose: false,
      panelClass: 'modal-dialog-item-with-garnishes-mat-dialog'
    });
    matDialogRef.afterClosed().subscribe((result) => {
      console.log("result-afterLoadItem", result);
      if (result.isSaved) {
        console.log("item-with-garnishes-saved");
        this.addToCartItemWithGarnishes(result.item, result, adding);

        if (item.GarnishGroups && item.GarnishGroups.length > 0) {
          item.GarnishGroups.forEach(gGroup => {
            console.log("gGroup", gGroup);
            gGroup.Garnishes.forEach(gar => {
              result.item.SelectedGarnishes.forEach(selGar => {
                if (selGar.Id == gar.Id) {
                  gar.IsSelected = true;
                }
              });
            });
          });
        }
        if (item.GeneralGarnishGroups && item.GeneralGarnishGroups.length > 0 && (!item.GarnishGroups || item.GarnishGroups.length == 0)) {
          item.GeneralGarnishGroups.forEach(gGroup => {
            console.log("gGroup", gGroup);
            gGroup.Garnishes.forEach(gar => {
              result.item.SelectedGarnishes.forEach(selGar => {
                if (selGar.Id == gar.Id) {
                  gar.IsSelected = true;
                }
              });
            });
          });
        }
        console.log("!!!! item", item);
        console.log("!!!! result.item.", result.item);
        item.SpecialRequests = result.item.SpecialRequests;
        item.IsSelected=true;
      }

    });
  }


  public selectComboItem(comboItem) {
    console.log("selectComboItem(): comboItem", comboItem);
     console.log("this.selectedItems", this.selectedItems);
       console.log("this.selectedItems[comboItem.Id]", this.selectedItems[comboItem.Id]);
       if (this.selectedItems[comboItem.Id] != undefined)
     this.selectedItems[comboItem.Id].forEach(si => {
          
            si.IsSelected = false;

        });
    if (comboItem) {
      this.tempArr = [];
      comboItem.IsSelected = true;
      let comboItemId = comboItem.Id;
      if (!this.isItemWithItemGroups) {
        this.combo.ItemCombos.forEach(comboItem => {
          if (comboItem.Id != comboItemId)
            comboItem.IsSelected = false;

        });
        this.combo.NewItemCombos.forEach(comboItem => {
          if (comboItem.Id != comboItemId)
            comboItem.IsSelected = false;

        });
        let comboPizzaId = comboItem.Id;
        this.combo.PizzaCombos.forEach(comboPizza => {
          if (comboPizza.Id != comboPizzaId)
            comboPizza.IsSelected = false;

        });
        this.combo.NewPizzaCombos.forEach(comboPizza => {
          if (comboPizza.Id != comboPizzaId)
            comboPizza.IsSelected = false;

        });
      }
      else if(this.isItemWithItemGroups){
        this.combo.ItemGroups.forEach(itemGroup => {
          if (itemGroup.Id != comboItemId)
          itemGroup.IsSelected = false;

        });
      }
    }
  }

  private loadingGarnishesPopupForPizza(item, isBeforePizza: boolean,
    garnishGroup: GarnishGroupAppModel,
    selectedGarnishes, isFirstPage,
    selectedGarnishesPrice?, cancellation?, adding?) {
    console.log("loadingGarnishesPopupForPizza - ITEM", item);
    console.log("loadingGarnishesPopupForPizza - SELECTED-GAR", selectedGarnishes);
    console.log("loadingGarnishesPopupForPizza - SELECTED-GAR", selectedGarnishes);
    console.log("cancellation", cancellation);
    console.log("adding", adding);
    const matDialogRef = this.matDialog.open(GarnishesComponent, {
      data: {
        garnishGroup: garnishGroup,
        garnishes: [],
        comments: "",
        selectedGarnishes,
        isFirstPage,
        item: item,
        isMenu: true,
        selectedGarnishesPrice,
        hideImage: !isBeforePizza
      },
      width: '100%',
      maxWidth: '1000px',
      disableClose: true,
      panelClass: 'custom-mat-dialog-mobile-garnishes-with-item'
    });
    matDialogRef.afterClosed().subscribe((result: GarnishesDialog) => {
      console.log("result - AFTER GARNISHES COMPONENT", result);


      if (result.isSaved) {

        if (result && result.allGettingGarnishes && item && !result.returnToPreviousPage) {
          //console.log("IDK- item.selectedGarnishes", item.SelectedGarnishes);
          console.log("result.allGettingGarnishes", result.allGettingGarnishes);
          item.SelectedGarnishes = result.allGettingGarnishes.slice();
          console.log("item.selectedGarnishes", item.SelectedGarnishes);
        }
        if (isBeforePizza) {

          if (!result.returnToPreviousPage && item &&
            item.GarnishGroupsBeforePizza &&
            item.GarnishGroupsBeforePizza.indexOf(garnishGroup) != -1 &&
            item.GarnishGroupsBeforePizza.indexOf(garnishGroup) + 1 <
            item.GarnishGroupsBeforePizza.length) {
            grnGrp = item.GarnishGroupsBeforePizza[item.GarnishGroupsBeforePizza.indexOf(garnishGroup) + 1];
            console.log("grnGrp", grnGrp);

            if (grnGrp && grnGrp.Garnishes && grnGrp.Garnishes.length > 0) {
              console.log("item1", item);
              this.loadingGarnishesPopupForPizza(item, isBeforePizza,
                grnGrp, item.SelectedGarnishes,
                false, result.selectedGarnishesPrice, cancellation, adding);
            }
          } else if (result.returnToPreviousPage && item &&
            item.GarnishGroupsBeforePizza &&
            item.GarnishGroupsBeforePizza.indexOf(garnishGroup) !== -1 &&
            item.GarnishGroupsBeforePizza.indexOf(garnishGroup) - 1 > -1) {
            var grnGrp = item.GarnishGroupsBeforePizza[item.GarnishGroupsBeforePizza.indexOf(garnishGroup) - 1];

            if (grnGrp && grnGrp.Garnishes && grnGrp.Garnishes.length > 0) {
              console.log("item2", item);
              this.loadingGarnishesPopupForPizza(item, isBeforePizza,
                grnGrp, item.SelectedGarnishes,
                item.GarnishGroupsBeforePizza.indexOf(grnGrp) === 0,
                result.selectedGarnishesPrice, cancellation, adding);
            }
          } else if (!result.returnToPreviousPage) {
            console.log("item3", item);
            this.addToCartPizzaWithGarnishes(item, isBeforePizza, result, adding);
          }
        } else {

          if (!result.returnToPreviousPage && item &&
            item.GarnishGroupsAfterPizza &&
            item.GarnishGroupsAfterPizza.indexOf(garnishGroup) != -1 &&
            item.GarnishGroupsAfterPizza.indexOf(garnishGroup) + 1 <
            item.GarnishGroupsAfterPizza.length) {
            grnGrp = item.GarnishGroupsAfterPizza[item.GarnishGroupsAfterPizza.indexOf(garnishGroup) + 1];
            console.log("grnGrp", grnGrp);

            if (grnGrp && grnGrp.Garnishes && grnGrp.Garnishes.length > 0) {
              console.log("item1", item);
              this.loadingGarnishesPopupForPizza(item, isBeforePizza,
                grnGrp, item.SelectedGarnishes,
                false, result.selectedGarnishesPrice, cancellation, adding);
            }
          } else if (result.returnToPreviousPage && item &&
            item.GarnishGroupsAfterPizza &&
            item.GarnishGroupsAfterPizza.indexOf(garnishGroup) !== -1 &&
            item.GarnishGroupsAfterPizza.indexOf(garnishGroup) - 1 > -1) {
            var grnGrp = item.GarnishGroupsAfterPizza[item.GarnishGroupsAfterPizza.indexOf(garnishGroup) - 1];

            if (grnGrp && grnGrp.Garnishes && grnGrp.Garnishes.length > 0) {
              console.log("item2", item);
              this.loadingGarnishesPopupForPizza(item, isBeforePizza,
                grnGrp, item.SelectedGarnishes,
                item.GarnishGroupsAfterPizza.indexOf(grnGrp) === 0,
                result.selectedGarnishesPrice, cancellation, adding);
            }
          } else if (!result.returnToPreviousPage) {
            console.log("item3", item);
            this.addToCartPizzaWithGarnishes(item, isBeforePizza, result, adding);
          }

        }


      }  else {
        if (cancellation) {
          cancellation();
        }

      }

    });
  }

  private addToCartPizzaWithGarnishes(item, isBeforePizza, data?, adding?) {
    console.log("addToCartPizzaWithGarnishes", item);
    console.log("data", data);
    console.log("isBeforePizza", isBeforePizza);
    console.log("adding", adding);
    if (isBeforePizza){
      this.pizzaBaseLoaded = true;
    } else {
     // this.myPrepare(item);
      if (adding) {
       console.log("adding");
       adding(item);
      }
    }
     
  }

  private loadingGarnishesPopup(item, garnishes: GarnishAppModel[], garnishGroup: GarnishGroupAppModel,
    comments: string, selectedGarnishes, isFirstPage?, cancellation?, adding?) {
    console.log("loadingGarnishesPopup - ITEM", item);
    console.log("loadingGarnishesPopup - SELECTED-GAR", selectedGarnishes);
    const matDialogRef = this.matDialog.open(GarnishesComponent, {
      data: {
        garnishGroup: garnishGroup,
        garnishes: garnishes,
        comments: comments,
        selectedGarnishes,
        isFirstPage,
        item: item,
        isMenu: true,

      },
      width: '100%',
      maxWidth: '1000px',
      disableClose: true,
      panelClass: 'custom-mat-dialog-mobile-garnishes-with-item'
    });
    matDialogRef.afterClosed().subscribe((result: GarnishesDialog) => {
      console.log("result - AFTER GARNISHES COMPONENT", result);


      if (result.isSaved) {
        console.log("IDK");
        if (result && result.allGettingGarnishes && item && !result.returnToPreviousPage) {
          //console.log("IDK- item.selectedGarnishes", item.SelectedGarnishes);
          console.log("result.allGettingGarnishes", result.allGettingGarnishes);
          item.SelectedGarnishes = result.allGettingGarnishes.slice();
          console.log("item.selectedGarnishes", item.SelectedGarnishes);
        }
        if ((!result.returnToPreviousPage && item && item.GarnishGroups && item.GarnishGroups.indexOf(garnishGroup) != -1 &&
          item.GarnishGroups.indexOf(garnishGroup) + 1 < item.GarnishGroups.length) ||
          (!result.returnToPreviousPage && item && item.GeneralGarnishGroups && item.GeneralGarnishGroups.indexOf(garnishGroup) != -1 &&
            item.GeneralGarnishGroups.indexOf(garnishGroup) + 1 < item.GeneralGarnishGroups.length)) {
          if (item.GarnishGroups && item.GarnishGroups.length > 0) {
            console.log(" if (item.GarnishGroups)");
            var grnGrp = item.GarnishGroups[item.GarnishGroups.indexOf(garnishGroup) + 1];
          }
          else {
            console.log(" else");
            grnGrp = item.GeneralGarnishGroups[item.GeneralGarnishGroups.indexOf(garnishGroup) + 1];
            console.log("grnGrp", grnGrp);
          }
          if (grnGrp && grnGrp.Garnishes && grnGrp.Garnishes.length > 0) {
            console.log("item1", item);
            this.loadingGarnishesPopup(item, null, grnGrp, result.comments,
              item.SelectedGarnishes, false, cancellation, adding);
          }
        } else if (!result.returnToPreviousPage && item.Garnishes && item.Garnishes.length > 0 && item.SelectedGarnishes &&
          result.isGarnishGroup) {
          this.loadingGarnishesPopup(item, item.Garnishes, null, result.comments,
            item.SelectedGarnishes, false, cancellation, adding);
        } else if ((result.returnToPreviousPage && item && item.GarnishGroups &&
          item.GarnishGroups.indexOf(garnishGroup) !== -1 &&
          item.GarnishGroups.indexOf(garnishGroup) - 1 > -1) ||
          (result.returnToPreviousPage && item && item.GeneralGarnishGroups &&
            item.GeneralGarnishGroups.indexOf(garnishGroup) !== -1 &&
            item.GeneralGarnishGroups.indexOf(garnishGroup) - 1 > -1)) {
          if (item.GarnishGroups && item.GarnishGroups.length>0) {
            var grnGrp = item.GarnishGroups[item.GarnishGroups.indexOf(garnishGroup) - 1];
          }
          else {
            grnGrp = item.GeneralGarnishGroups[item.GeneralGarnishGroups.indexOf(garnishGroup) - 1];
          }
          if (grnGrp && grnGrp.Garnishes && grnGrp.Garnishes.length > 0) {
            console.log("item2", item);
            this.loadingGarnishesPopup(item, null, grnGrp, result.comments,
              item.SelectedGarnishes, item.GarnishGroups.indexOf(grnGrp) === 0, cancellation, adding);
          }
        } else if (result.returnToPreviousPage && item.Garnishes &&
          item.Garnishes.length > 0 && item.SelectedGarnishes) {
          if (item.Garnishes) {
            const grnGrp = item.GarnishGroups[item.GarnishGroups.length - 1];
            if (grnGrp) {
              console.log("item5", item);
              this.loadingGarnishesPopup(item, null, grnGrp, result.comments,
                item.SelectedGarnishes, item.GarnishGroups.indexOf(grnGrp) === 0, cancellation, adding);
            }
          }
        } else if (!result.returnToPreviousPage) {
          // If everything was added to list of garnishes - add to card
          // console.log("---item",item);
          console.log("item3", item);
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
    console.log("addToCartItemWithGarnishes", item, adding);
    console.log("adding", adding);
    if (item) { //if(!this.isNotFilledAllRequiredGarnishesOfGarnishGroup(item))
      console.log("continue adding");
      if (data && data.comments) {
        console.log("data.comments", data.comments);
        item.SpecialRequests = data.comments || '';
      }
      if (data) {
        console.log("data", data);
      }
      if (adding) {
        if (!this.isMobileMode() && !item.PizzaPrices) this.selectItem(this.selectedItemTemp);
        console.log("adding");
        adding(item);
      }
    }
  }

  public addProperty() {
    this.combo.ItemCombos.forEach(group => {
      group.Items.forEach(item => {
        item.ComboItemId = group.Id;
        console.log("item", item);
      });

    });
  }

  public addPropertyForItemWithGroups() {
    this.combo.ItemGroups.forEach(group => {
      group.GroupItems.forEach(item => {
        item.ComboItemId = group.Id;
        console.log("item", item);
        item.ShortInfo = "";
        if (item.Information && item.Information.length > 0) {
          var txtArr = item.Information.split(' ');
          if (txtArr.length > 6) {
            for (let index = 0; index < 7; index++) {
              if (txtArr[index])
                item.ShortInfo = item.ShortInfo + txtArr[index] + " ";
            }
            item.ShortInfo += "..."
          }
          else {
            item.ShortInfo = item.Information;
          }
        }
      });

    });
  }


  public selectItem(item) {
    console.log("selectItem()");
    console.log("item", item);
    item.IsSelected = true;
    if (!this.isItemWithItemGroups) {
      const itemGroupFound = this.combo.ItemCombos.find(({ Id }) => Id === item.ComboItemId)
        || this.combo.NewItemCombos.find(({ Id }) => Id === item.ComboItemId);
      console.log("itemGroupFound", itemGroupFound);
      itemGroupFound.Items.forEach(otherItem => {
        if (otherItem.Id != item.Id)
          otherItem.IsSelected = false;

      });
      itemGroupFound.ItemIsSelected = true;
    }
    else if (this.isItemWithItemGroups) {
      const itemGroupFound = this.combo.ItemGroups.find(({ Id }) => Id === item.ComboItemId);
      console.log("itemGroupFound", itemGroupFound);
    
      if (itemGroupFound.Max != undefined && itemGroupFound.Max > 1){
        if (!item.Amount) item.Amount=0;
        item.Amount +=1;
        console.log("tem",item);
      } else {
          if (!item.Amount) item.Amount=1;
        itemGroupFound.GroupItems.forEach(otherItem => {
          if (otherItem.Id != item.Id)
            otherItem.IsSelected = false;

        });
      }
     
      itemGroupFound.ItemIsSelected = true;

    }



  }

   public subAmountItem(item, currentItem) {
    console.log("subAmountItem()",currentItem);
    console.log("item", item);
    item.IsSelected = true;
    if (this.isItemWithItemGroups) {
      const itemGroupFound = this.combo.ItemGroups.find(({ Id }) => Id === item.ComboItemId);
      console.log("itemGroupFound", itemGroupFound);
      if (itemGroupFound.Max != undefined && itemGroupFound.Max > 1){
        if (!item.Amount) item.Amount=0;
        if (item.Amount > 0) 
          item.Amount -=1;
        if (item.Amount == 0) {
          item.IsSelected = false;
          const i = currentItem.findIndex(x => x.Id === item.Id); 
           console.log("currentItem",currentItem);
            console.log("i",i);
            currentItem.splice(i, 1);
        } else{
           const selectedItemFound = currentItem.find(({ Id }) => Id === item.Id);
          if (selectedItemFound != undefined && selectedItemFound !=null){
            Object.keys(item).forEach(k => selectedItemFound[k] = item[k]);
          }
        }
      } /*else {
        itemGroupFound.GroupItems.forEach(otherItem => {
          if (otherItem.Id != item.Id)
            otherItem.IsSelected = false;

        });*/
      }
     
      //itemGroupFound.ItemIsSelected = true;

    }



  

  public selectPizza(item, pizzaComboId) {
    console.log("selectPizza()");
    console.log("item", item);
    item.IsSelected = true;
    const pizzaComboFound = this.combo.NewPizzaCombos.find(({ Id }) => Id === pizzaComboId);
      console.log("pizzaComboFound", pizzaComboFound);
      pizzaComboFound.Pizzas.forEach(otherItem => {
        if (otherItem.Id != item.Id)
          otherItem.IsSelected = false;
        else  otherItem.IsSelected = true;

      });
      pizzaComboFound.ItemIsSelected = true;
    
    



  }


  private isNotFilledAllRequiredGarnishesOfGarnishGroup(item: ItemAppAdvancedModel) {
    console.log("isNotFilledAllRequiredGarnishesOfGarnishGroup");
    console.log("item.SelectedGarnishes", item.SelectedGarnishes);
    let requireMinMaxOptions = false;
    if (item && item.GarnishGroups) {
      const countOfGarnishes = (arr: any[]) => {
        let counter = 0;
        arr.forEach((e) => {
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
          console.log("countOfGarnishesArray", countOfGarnishesArray);
          return ((garnishGroup.Min == garnishGroup.Max && garnishGroup.Max != 0) || (garnishGroup.Min != garnishGroup.Max)) ?
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

  public selectedItemTemp: any;

  addItem(selectedItem, comboItemId, currentItem, index, comboItem) {
     if (this.isItemWithItemGroups && comboItem.Max && comboItem.Max > 1) return;
    console.log(" addItem()");
    console.log("selectedItem", selectedItem);
    console.log("comboItemId", comboItemId);
    console.log("currentItem", currentItem);
    console.log("index", index);
    console.log("comboItem", comboItem);
    this.showErrorComboMessage = false;
    if (!selectedItem) {
      return;
    }
    this.selectedItemTemp = selectedItem;
    //const item = this.commonFunctionsService.deepCopy(selectedItem);
    selectedItem.ComboItemId = comboItemId;
    if (selectedItem && ((selectedItem.Garnishes && selectedItem.Garnishes.length > 0) ||
      (selectedItem.GarnishGroups && selectedItem.GarnishGroups.length > 0) || (selectedItem.GeneralGarnishGroups && selectedItem.GeneralGarnishGroups.length > 0))) {
      console.log("include Garnishes - OPEN ITEM FOR COMBO");
      this.includeGarnishes(selectedItem, () => {
        currentItem[index] = { ComboItemId: comboItemId };
      }, (item) => {
        console.log("434 item", item);
         if (!item.Amount) item.Amount=1;
        Object.keys(item).forEach(k => currentItem[index][k] = item[k]);
          console.log("currentItem[index]", currentItem[index]);
      });
    } else {
      console.log("else selectedItems", this.selectedItems);
      this.selectItem(selectedItem);
      console.log("440 item", selectedItem);
      Object.keys(selectedItem).forEach(k => currentItem[index][k] = selectedItem[k]);
    }
    // currentItem[index].IsItem = true;
    comboItem.IsCollapsed = true;
    currentItem[index].IsCollapsed = true;

  }

  getTotalAmount(currentItem): number {
    return currentItem.reduce((sum, item) => sum + (item.Amount || 0), 0);
  }

  addGroupItem(selectedItem, currentItem, comboItem) {
   
    console.log(" addGroupItem()");
    console.log("selectedItem", selectedItem);
   
    console.log("currentItem", currentItem);
  
    console.log("comboItem", comboItem);
    this.showErrorComboMessage = false;
    if (!selectedItem) {
      return;
    }
    this.selectedItemTemp = selectedItem;
    //const item = this.commonFunctionsService.deepCopy(selectedItem);
    selectedItem.ComboItemId = comboItem.Id;
    if (selectedItem && ((selectedItem.Garnishes && selectedItem.Garnishes.length > 0) ||
      (selectedItem.GarnishGroups && selectedItem.GarnishGroups.length > 0) || (selectedItem.GeneralGarnishGroups && selectedItem.GeneralGarnishGroups.length > 0))) {
      console.log("include Garnishes - OPEN ITEM FOR COMBO");
      this.includeGarnishes(selectedItem, () => {
        currentItem[0] = { ComboItemId: comboItem.Id };
      }, (item) => {
        console.log("434 item", item);
        Object.keys(item).forEach(k => currentItem[0][k] = item[k]);
      });
    } else {
      console.log("else selectedItems", this.selectedItems);
      this.selectItem(selectedItem);
      console.log("440 item", selectedItem);
      //currentItem.push(selectedItem);
      if (currentItem.length == 0){
  currentItem.push(selectedItem);
      }
      else if (!currentItem[0].Id)
        Object.keys(selectedItem).forEach(k => currentItem[0][k] = selectedItem[k]);
      else{

          const selectedItemFound = currentItem.find(({ Id }) => Id === selectedItem.Id);
          if (selectedItemFound != undefined && selectedItemFound !=null){
            Object.keys(selectedItem).forEach(k => selectedItemFound[k] = selectedItem[k]);
          } else {
            currentItem.push(selectedItem);
          }
          
      }

    }
    // currentItem[index].IsItem = true;
    if (!(comboItem.Max > 1))
    comboItem.IsCollapsed = true;
    currentItem[0].IsCollapsed = true;

  }

  getTotalSelectedAmount(currentItem){
    let count=0; 
    let i=0;
    currentItem.forEach(element => {
      count = count + element.Amount;
      i += 1;
      if (i == currentItem.length) return count;
    });
  }

  private initializeSettings() {
    this.lang = this.translationService.language();
    this.cashSymbol = AppConfig.cashSymbol;
    this.colors.menuColor = AppConfig.settings.menuColor;
    this.colors.buttonColor = AppConfig.settings.buttonColor;
  }

  private displayPizza(pizza, ToppingGroupId, MaxToppings, cancellation, adding) {
    const pizzaSize = pizza.SelectedPizzaPriceSize;
    console.log("cancellation:" + cancellation, " adding" + adding);
    this.loadToppings(pizza, ToppingGroupId, MaxToppings, pizzaSize, pizza.specialRequests, cancellation, adding);
  }

  private loadToppings(pizza: PizzaAppAdvancedModel,
    ToppingGroupId: number, MaxToppings: number,
    pizzaSize: PizzaSizeAppModel,
    specialRequests: string, cancellation, adding) {
      console.log("open pizza from combo");

    console.log("cancellation",cancellation);
    console.log("adding",adding);
    if (pizza.GarnishGroupsBeforePizza && pizza.GarnishGroupsBeforePizza.length > 0) { //(this.pizzaAdditionItems && this.pizzaAdditionItems.length > 0)
      this.pizzaBaseLoaded = false;
      this.includePizzaGarnishes(pizza, true, cancellation, adding);
    } else {
      this.pizzaBaseLoaded = true;
    }
    var stop = setInterval(() => {
      if (this.pizzaBaseLoaded) {
        clearInterval(stop);
        let cls = 'modal-dialog-new-pizza';
        let maxWidth = '1600px';
        let width = '1360px';

        if (this.isMobileMode()) {
          cls = 'custom-mat-dialog-pizza';
          maxWidth = '1280px';
          width = '100%';
        }
        const matDialogRefPizza = this.matDialog.open(NewPizzaComponent, {
          data: {
            pizza,
            pizzaSizePrice: pizzaSize,
            specialRequests,
            isCombo: true,
            ToppingGroupId: ToppingGroupId,
            MaxToppings: MaxToppings,
            Combo: this.combo,

          },
          width: width,
          //  minWidth: '800px',
          maxWidth: maxWidth,
          disableClose: false,
          panelClass: cls
        });
        matDialogRefPizza.afterClosed().subscribe((result: PizzaDialog) => {
          if (result && result.isSaved) {
            if (adding) {
              console.log("new-combo- RESUlt", result);
              const pizza = this.commonFunctionsService.deepCopy(result.pizza);
              console.log("new-combo - after save - copyed pizza", pizza);
              pizza.specialRequests = result.specialRequests;

             /* if (pizza.GeneralGarnishGroups && pizza.GeneralGarnishGroups.length > 0 && !this.isMobileMode()) {
                this.loadItemPopupDesktop(pizza, cancellation, adding);
              }
              else if (pizza.GeneralGarnishGroups && pizza.GeneralGarnishGroups.length > 0 && this.isMobileMode()) {
                console.log("THIS IS MOBILE_ AFTER PIZZACOMP");
                this.includeGarnishes(pizza, cancellation, adding);
              }*/
              if (pizza.GarnishGroupsAfterPizza && pizza.GarnishGroupsAfterPizza.length > 0 ) {               
                this.includePizzaGarnishes(pizza, false, cancellation, adding);
              }
              else {
                console.log("this.combo", this.combo);
                console.log("pizza", pizza);
                if (this.combo.NewPizzaCombos.length > 0) {
                  const itemGroupFound = this.combo.NewPizzaCombos.find(({ Id }) => Id === pizza.ComboPizzaId);
                  console.log("itemGroupFound", itemGroupFound);
                  if (itemGroupFound) {

                    itemGroupFound.ItemIsSelected = true;
                  }
                  adding(pizza);
                } else {
                  const itemGroupFound = this.combo.PizzaCombos.find(({ Id }) => Id === pizza.ComboPizzaId);
                  console.log("itemGroupFound", itemGroupFound);
                  if (itemGroupFound) {

                    itemGroupFound.ItemIsSelected = true;
                  }
                  adding(pizza);
                }

              }
            }
          }
        });
      }
    }, 10);




  }


  private loadToppings_old(pizza: PizzaAppAdvancedModel,
    ToppingGroupId: number, MaxToppings: number,
    pizzaSize: PizzaSizeAppModel,
    specialRequests: string, cancellation, adding) {

    console.log("open pizza from combo")

    let cls = 'modal-dialog-new-pizza';
    let maxWidth = '1600px';
    let width = '1360px';

    if (this.isMobileMode()) {
      cls = 'custom-mat-dialog-pizza';
      maxWidth = '1280px';
      width = '100%';
    }
    const matDialogRefPizza = this.matDialog.open(NewPizzaComponent, {
      data: {
        pizza,
        pizzaSizePrice: pizzaSize,
        specialRequests,
        isCombo: true,
        ToppingGroupId: ToppingGroupId,
        MaxToppings: MaxToppings,
        Combo: this.combo,

      },
      width: width,
      //  minWidth: '800px',
      maxWidth: maxWidth,
      disableClose: false,
      panelClass: cls
    });
    matDialogRefPizza.afterClosed().subscribe((result: PizzaDialog) => {
      if (result && result.isSaved) {
        if (adding) {
          console.log("new-combo- RESUlt", result);
          const pizza = this.commonFunctionsService.deepCopy(result.pizza);
          console.log("new-combo - after save - copyed pizza", pizza);
          pizza.specialRequests = result.specialRequests;
          if (pizza.GeneralGarnishGroups && pizza.GeneralGarnishGroups.length > 0 && !this.isMobileMode()) {
            this.loadItemPopupDesktop(pizza, cancellation, adding);
          }
          else if (pizza.GeneralGarnishGroups && pizza.GeneralGarnishGroups.length > 0 && this.isMobileMode()) {
            console.log("THIS IS MOBILE_ AFTER PIZZACOMP");
            this.includeGarnishes(pizza, cancellation, adding);
          }
          else {
            console.log("this.combo", this.combo);
            console.log("pizza", pizza);
            if (this.combo.NewPizzaCombos.length > 0) {
              const itemGroupFound = this.combo.NewPizzaCombos.find(({ Id }) => Id === pizza.ComboPizzaId);
              console.log("itemGroupFound", itemGroupFound);
              if (itemGroupFound) {
  
                itemGroupFound.ItemIsSelected = true;
              }
              adding(pizza);
            } else {
              const itemGroupFound = this.combo.PizzaCombos.find(({ Id }) => Id === pizza.ComboPizzaId);
              console.log("itemGroupFound", itemGroupFound);
              if (itemGroupFound) {
  
                itemGroupFound.ItemIsSelected = true;
              }
              adding(pizza);
            }
            
          }
        }
      }
    });


  }


  public printItem(selectedItem) {
    console.log("selectedItem", selectedItem);

  }






  addPizzaToppings(pizza, ToppingGroupId, MaxToppings, comboPizzaId, sizeId, currentItem, index) {
   console.log("pizza",pizza);
   console.log("ToppingGroupId",ToppingGroupId);
   console.log("MaxToppings",MaxToppings);
   console.log("comboPizzaId",comboPizzaId);
   console.log("pizzaComboPizzaId",pizza.PizzaComboPizzaId);
   console.log("sizeId",sizeId);
   console.log("currentItem",currentItem);
   console.log("index",index);
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

    this.displayPizza(pizza, ToppingGroupId, MaxToppings, () => {
      currentItem[index] = { comboPizzaId: comboPizzaId };
    }, (item) => {
     
      Object.keys(item).forEach(k => currentItem[index][k] = item[k]);
     // currentItem[index].IsCollapsed = true;
    });
  }

  addPizzaToppingsNew(pizza, pizzaCombo, sizeId, currentItem, index) {
    console.log("pizza",pizza);
    console.log("ToppingGroupId",pizzaCombo.ToppingGroupId);
    console.log("MaxToppings",pizzaCombo.MaxToppings);
    console.log("comboPizzaId",pizzaCombo.Id);
    console.log("pizzaComboPizzaId",pizza.PizzaComboPizzaId);
    console.log("sizeId",sizeId);
    console.log("currentItem",currentItem);
    console.log("index",index);
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
 
     this.displayPizza(pizza, pizzaCombo.ToppingGroupId, pizzaCombo.MaxToppings, () => {
       currentItem[index] = { comboPizzaId: pizzaCombo.Id };
     }, (item) => {
       this.selectPizza(item, pizzaCombo.Id);
       console.log("542 item", item);
       Object.keys(item).forEach(k => currentItem[index][k] = item[k]);
       pizza.IsSelected = true;
       item.IsSelected = true;
       currentItem.IsSelected = true;
       pizzaCombo.IsCollapsed = true;
       currentItem[index].IsCollapsed = true;
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

  private loadItemWithItems(combo) {
    console.log("loadItemWithItems(combo)");
    console.log("combo", combo);
    this.combo = this.commonFunctionsService.deepCopy(combo);
    if (!this.combo) {
      return;
    }
    this.combo.IsNotComboIsItem = true;
    let counter = 0;
    (this.combo.ItemGroups || []).forEach((groupOfItems, index) => {
      console.log("groupOfItems", groupOfItems);
      groupOfItems.GroupItems.forEach(item => {
        item.IsItemNewCombo = false;
      });
      if (counter >0) groupOfItems.IsCollapsed = true;
      counter+=1;
      const itemsToPush = [];
      for (let i = 0; i < +1; i++) {
        itemsToPush.push({});
      }
      console.log("itemsToPush",itemsToPush);
      itemsToPush.forEach((item) => {
        item.ComboItemId = groupOfItems.Id;
        item.IsCollapsed = true;
        item.Min = groupOfItems.Min;
      });
      this.selectedItems[groupOfItems.Id] = itemsToPush;
    });


    console.log("this.selectedItems", this.selectedItems);

  }

  private loadComboWithItems(combo) {
    console.log("loadComboWithItems(combo)");
    console.log("combo", combo);
    this.combo = this.commonFunctionsService.deepCopy(combo);
    if (!this.combo) {
      return;
    }
    (this.combo.ItemCombos || []).forEach((comboItem, index) => {
      console.log("comboItem", comboItem);
      comboItem.Items.forEach(item => {
        item.IsItemNewCombo = false;
      });
      comboItem.IsCollapsed = true;
      const itemsToPush = [];
      for (let i = 0; i < +comboItem.Quantity; i++) {
        itemsToPush.push({});
      }
      console.log("itemsToPush",itemsToPush);
      itemsToPush.forEach((item) => {
        item.ComboItemId = comboItem.Id;
        item.IsCollapsed = true;
      });
      this.selectedItems[comboItem.Id] = itemsToPush;
    });

    (this.combo.NewItemCombos || []).forEach((comboItem, index) => {
      console.log("comboItem", comboItem);

      comboItem.Items.forEach(item => {
        item.IsItemNewCombo = true;
      });
      comboItem.IsCollapsed = true;

      const itemsToPush = [];
      for (let i = 0; i < +comboItem.Quantity; i++) {
        itemsToPush.push({});
      }
      itemsToPush.forEach((item) => {
        item.ComboItemId = comboItem.Id;
        item.IsCollapsed = true;
      });
      this.selectedItems[comboItem.Id] = itemsToPush;
    });

    console.log("this.selectedItemsNew", this.selectedItems);
    console.log("this.combo.NewItemCombos", this.combo.NewItemCombos);
    if (this.combo.ItemCombos.length > 0){
      this.selectedItems[this.combo.ItemCombos[0].Id][0].IsSelected = true;
    } else if (this.combo.NewItemCombos.length > 0){
      this.selectedItems[this.combo.NewItemCombos[0].Id][0].IsSelected = true;
    }


    if (this.combo.NewPizzaCombos.length > 0){
      this.combo.NewPizzaCombos.forEach((comboPizza, index) => {
        console.log("comboPizza", comboPizza);
        const itemsToPush = [];
        for (let i = 0; i < +comboPizza.Quantity; i++) {
          itemsToPush.push({});
        }
        itemsToPush.forEach((item) => {
          item.ComboPizzaId = comboPizza.Id;
          item.IsCollapsed = true;
        });


      /*  for (let i = 0; i < +comboPizza.Quantity; i++) {
          const currentPizza = this.commonFunctionsService.deepCopy(comboPizza.Pizza);
          currentPizza.ComboPizza = this.commonFunctionsService.deepCopy(comboPizza);
          itemsToPush.push(currentPizza);
        }
        itemsToPush.forEach((item) => {
          item.ComboPizzaId = comboPizza.Id;
        });*/
        this.selectedPizzas[comboPizza.Id] = itemsToPush;
      });
      console.log("this.selectedPizzas", this.selectedPizzas);
    } else {
      (this.combo.PizzaCombos || []).forEach((comboPizza, index) => {
        console.log("comboPizza", comboPizza);
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
   
  }


  

  public isMobileBrowser() {
    return this.browserIdentificatorService.isMobile.Android() ||
      this.browserIdentificatorService.isMobile.Windows() ||
      this.browserIdentificatorService.isMobile.iOS();
  }

  private isAllDataFilled() {
    console.log("this.selectedItems",this.selectedItems)
    if (this.isItemWithItemGroups ) {
      const allItemFilled = Object.keys(this.selectedItems).every((key) => {
        console.log("605 item");
        const group = this.combo.ItemGroups.find(g => g.Id == key);
        if (!group.Min) group.Min=0;
        
  const items = this.selectedItems[key] || [];
          const amountSum = items.reduce((sum, item) => sum + (item.Amount || 0), 0);
        /*  return this.selectedItems[key] && 
               this.selectedItems[key].every(item => item.Id || item.Min == 0) &&
               this.selectedItems[key].length >= group.Min ;*/
        return this.selectedItems[key] && 
               this.selectedItems[key].every(item => item.Id || item.Min == 0) &&
               (this.selectedItems[key].length >= group.Min || amountSum >= group.Min );
      });
      
      return allItemFilled ;
    } else {
      const allItemFilled = Object.keys(this.selectedItems).every((key) => {
        console.log("605 item");
        return this.selectedItems[key] && this.selectedItems[key].every(item => item.Id);
      });
      const allPizzaFilled = Object.keys(this.selectedPizzas).every((key) => {
        console.log("608 item");
        return this.selectedPizzas[key] && this.selectedPizzas[key].every(item => item.Id);
      });
      return allItemFilled && allPizzaFilled;
    }
   
  }

  private preparePizzaSize() {
    const combosItems = {};
    (this.combo.PizzaCombos || []).forEach(p => {
      combosItems[p.Id] = p;
    });
    const myselectedPizzas = this.commonFunctionService.deepCopy(this.selectedPizzas);
    console.log("preparePizzaSize() - myselectedPizzas", myselectedPizzas);
    console.log("preparePizzaSize() - this.selectedPizzas", this.selectedPizzas);

    Object.keys(this.selectedPizzas).forEach((pizzaCombo) => {
      console.log("608 item");
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
    console.log("2 - this.selectedPizzas", this.selectedPizzas);
    const myselectedPizzas22 = this.commonFunctionService.deepCopy(this.selectedPizzas);
    console.log("preparePizzaSize() - myselectedPizzas22", myselectedPizzas22);
  }

  private getSelectedItemsFromCombo(selectedItems) {
    console.log("selectedItems", selectedItems);
    return Object.keys(selectedItems).reduce((sumItems, items) => {
      console.log("selectedItems[items]",selectedItems[items]);
      console.log("items",items);
      if (items) {
        sumItems = sumItems.concat(selectedItems[items] || []);
      }
      console.log("sumItems", sumItems);
      return sumItems;
    }, []);//.filter(item => item.Id !== undefined);;
  }

  public save(isPrevious?) {
    this.showErrorComboMessage = false;
    console.log("SAVE COMBO");
    console.log(" isAllDataFilled", this.isAllDataFilled());
    if (this.isAllDataFilled()) {

      this.preparePizzaSize();


      this.combo.SelectedItems = this.getSelectedItemsFromCombo(this.selectedItems);


      console.log("this.combo.SelectedItems", this.combo.SelectedItems);

      console.log("back to save() - this.selectedPizzas", this.selectedPizzas);
      this.combo.SelectedPizzas = this.getSelectedItemsFromCombo(this.selectedPizzas);
      console.log(" this.combo.SelectedPizzas", this.combo.SelectedPizzas);
      const thisComboSelectedPizzas = this.commonFunctionService.deepCopy(this.combo.SelectedPizzas);
      console.log("preparePizzaSize() - thisComboSelectedPizzas", thisComboSelectedPizzas);
      this.combo.SelectedPizzas =thisComboSelectedPizzas;
      this.isSaved = true;
      this.bsModalRef.hide();//{ //this.dialogRef.close({
      //isSaved: true,
      // combo: this.combo
      // });
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
    return this.message;
    //this.translationService.translate('COMBO_ERROR_NO_ITEMS');
  }

  public message: string = "";

  private displayNotificationMessage() {
    this.showErrorComboMessage = true;
    console.log("displayNotificationMessage()",this.selectedItems);
    var selectedItemsTemp = this.getSelectedItemsFromCombo(this.selectedItems);
    console.log("selectedItemsTemp", selectedItemsTemp);
    console.log("this.combo", this.combo);
    var isNotFilled = true;
    for (let i = 0; i < selectedItemsTemp.length; i++) {
      if (!selectedItemsTemp[i].Name && selectedItemsTemp[i].Min > 0) {
        var questionId = selectedItemsTemp[i].ComboItemId;
        console.log("questionId", questionId);
        var isNotFilled = false;
        break;
      }
    }
    if (!isNotFilled && !this.isItemWithItemGroups) {
      console.log ("questionId",questionId)
      var notFilledQuestion = this.combo.ItemCombos.find(({ Id }) => Id === questionId);
      if (notFilledQuestion == undefined) {
        notFilledQuestion = this.combo.NewItemCombos.find(({ Id }) => Id === questionId);
        console.log("notFilledQuestion", notFilledQuestion);
        console.log("notFilledQuestion.Name", notFilledQuestion.Name);
        this.message = "נא לבחור מוצר ב-" + notFilledQuestion.Name;
      } else {
        console.log("notFilledQuestion", notFilledQuestion);
        console.log("notFilledQuestion.Name", notFilledQuestion.Name);
        this.message = "נא לבחור מוצר ב-" + notFilledQuestion.Name;
      }
      
    }
    else if (!isNotFilled && this.isItemWithItemGroups) {
      var notFilledQuestion2 = this.combo.ItemGroups.find(({ Id }) => Id === questionId);
      console.log("notFilledQuestion2", notFilledQuestion2);
      console.log("notFilledQuestion2.Name", notFilledQuestion2.Name);
      this.message = "נא לבחור מוצר ב-" + notFilledQuestion2.Name;
    } else if (this.isItemWithItemGroups ) {
      const allItemFilled = Object.keys(this.selectedItems).every((key) => {
        
        const group = this.combo.ItemGroups.find(g => g.Id == key);
        if (group.Min && this.selectedItems[key].length < group.Min) 
          this.message = "יש לבחור מינימום " + group.Min + "פריטים ב" + group.Name;
        
      });
      
      return allItemFilled ;
    };
  }



  public cancel(isPrevious?) {
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

  focusElement(comboItemId) {
    console.log("focusElement",comboItemId);
    document.getElementById(comboItemId).scrollIntoView();
  }

}
