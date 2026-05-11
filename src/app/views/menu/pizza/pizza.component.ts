//import { Component, DoCheck, Inject, OnInit, ViewChild } from '@angular/core';
import { Component, Input , OnInit, } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

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
import {PizzaBuilderComponent} from "./pizza-builder/pizza-builder.component";
import {MatDialog} from "@angular/material/dialog";
import {FranchiseAppModel} from "../../../models/franchise-branch/franchise-app.model";
import { ItemAppAdvancedModel } from '../../../models/advanced/menu/item-app-advanced.model';
import { GarnishAppAdvancedModel } from "../../../models/advanced/menu/garnish-app-advanced.model";
import { CategoryAppAdvancedModel } from "../../../models/advanced/menu/category-app-advanced.model";
import { GarnishGroupAppModel } from "../../../models/menu/garnish-group-app.model";
import { GarnishAppModel } from '../../../models/menu/garnish-app.model';
import { GarnishesComponent } from '../garnishes/garnishes.component';
import { timeStamp } from 'console';

class PizzaData {
  pizza: PizzaAppAdvancedModel;
  pizzaSizePrice: PizzaPriceAppModel;
  specialRequests: string;
  //additionItems: ItemAppAdvancedModel[];
  isCombo: boolean;
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

@Component({
  selector: 'pizza-new',
  templateUrl: './pizza.component.html',
  styleUrls: ['./pizza.component.scss']
})
export class PizzaComponent extends SizeMobileInitializationComponent implements OnInit {
  public  isSaved:boolean = false;
  public lang: string;
  public cashSymbol: string;
  public sizeSelection: boolean;
  public pizza: PizzaAppAdvancedModel;
  public pizzaPrice: PizzaPriceAppModel;
  public specialRequests: string;
  public isCombo: boolean = false;
  public maxToppings: number;
  public pizzaComments;

  public comments: string;

  public toppings: ToppingAppModel[];
  //public additionItems: ItemAppAdvancedModel[];

  public  isEdit:boolean = false;

  public editTopps: boolean = false;

  public selectFreeTop: boolean;
  public selectedQuartersCounter: number;
  public notSelectedToppingsArr: ToppingAppModel[];

 

  public selectedPrice: PizzaPriceAppModel;
  // For scrollbar:
  public disabled = this.isMobileBrowser();
  public shown: 'native' | 'hover' | 'always' = 'native';
  public currentTopping: ToppingAppAdvancedModel;
public showToppings: boolean = true;
  //@ViewChild(NgScrollbar) itemsAreaScrollbar: NgScrollbar;
  //private timeOutForScrollUpdate: number = 200;

  franchise: FranchiseAppModel;
  fullPizza: any;
  pizzaFromOrder: any;
  pizzaId: number;
  categories: CategoryAppAdvancedModel[];
  pizzas: PizzaAppAdvancedModel[];
  foundPizza: PizzaAppAdvancedModel;
  afterToppingsEdit: boolean = false;
  saveEdit: boolean;
  edit: boolean;

  constructor (
    private appStorageService: AppStorageService,
    private translationService: TranslationsService,
   // public dialogRef: MatDialogRef<NewPizzaComponent>,
   public bsModalRef: BsModalRef,
    public dialog : MatDialog,
    public matDialog : MatDialog,
    public commonFunctionService: CommonFunctionsService,
    protected browserIdentificatorService: BrowserIdentificatorService//,
   // @Inject(MAT_DIALOG_DATA) public data: PizzaData
  ) {
    super(browserIdentificatorService);
   
     
    
      this.preparePizza();
      this.toppings = this.appStorageService.pizzaToppings || [];
     
      this.franchise = this.appStorageService.franchise;
    //}
    this.initializeSize();
  }

  public checkFreeToppingsStep(topping) {
    //console.log(topping);
    if (this.maxToppings > 0 &&
      //this.toppingGroupId > 0 &&
     // topping.ToppingGroupId == this.toppingGroupId &&
     (topping.FirstQuarter ||
      topping.SecondQuarter ||
      topping.ThirdQuarter ||
      topping.ForthQuarter)  ) return false;
    else return true;
  }


  private preparePizza() {
    
    // Deep cloning to avoid select multiple items
    this.pizza = this.commonFunctionService.deepCopy(this.pizza);
   // 
   /* this.toppings = this.commonFunctionService.deepCopy(this.appStorageService.pizzaToppings)|| [];
    this.toppings.forEach((t,index)=>{
      console.log("checkExcludedToppingFromPizza",this.checkExcludedToppingFromPizza(t))
      if (this.checkExcludedToppingFromPizza(t)){
        console.log("checkExcludedToppingFromPizza",t)
        this.toppings.splice(index,1);
      }
    });*/
    // const e1 = {...this.pizza};
  }

  public colors = {
    menuColor: '',
    buttonColor: ''
  };

  ngOnInit() {
    //console.log("pizza.PizzaPrices",this.pizza.PizzaPrices);

    this.selectedQuartersCounter = 0;
    if (this.pizza.PizzaToppings.length == this.appStorageService.pizzaToppings.length)
    {
      this.showToppings = false;
    } //else {

   // }
   // 
    if (this.maxToppings < 1 || this.maxToppings == undefined) {     
      this.selectFreeTop = false;
      this.notSelectedToppingsArr = this.appStorageService.pizzaToppings || [];
    } else {
      this.selectFreeTop = true;
    }
    if (this.isEdit && this.isMobileMode()) {
      this.edit = true;
      if (this.pizza.FullPizza.PizzaPrices.length > 0){
         this.saveEdit = true;
         this.sizeSelection = true;

         this.pizzaFromOrder = this.commonFunctionService.deepCopy(this.pizza);
         this.pizza = this.commonFunctionService.deepCopy(this.pizza.FullPizza);
         this.pizza.SelectedToppings.forEach(top => {
           top.IsSelect = true;
           if(top.QuarterNums.includes(1)) top.FirstQuarter = true;
           if(top.QuarterNums.includes(2)) top.SecondQuarter = true;
           if(top.QuarterNums.includes(3)) top.ThirdQuarter = true;
           if(top.QuarterNums.includes(4)) top.ForthQuarter = true;
         });
         this.pizzaId = this.pizza.Id;
         this.pizzas = this.appStorageService.pizzas;
         this.pizzas.forEach(pizza => {
           if(pizza.Id == this.pizzaId){
             this.foundPizza = pizza;
           }
           
         });
      }
      this.initializeSettings();
    }


    else {

      console.log("!!!!!!!!!!!!!!!!else");
      
      if(this.isEdit && !this.isMobileMode()){
        this.pizza = this.commonFunctionService.deepCopy(this.pizza.FullPizza);
      }

      if (this.pizza.PizzaPrices.length > 1) this.sizeSelection = true;
      else this.selectSize(this.pizza.PizzaPrices[0]);
      this.initializeSettings();
      this.clearGlobalPizzaToppings();
      if (!this.isCombo && !this.isEdit) {
        this.clearSelectedPizzaToppings();
      }
      this.checkPizzaSettings();
      if (this.isCombo) {
        this.checkIfSelectedToppingsExist();
      }

      if(this.isEdit && !this.isMobileMode()){
        this.toppings.forEach(top => {
          this.pizza.SelectedToppings.forEach(seltop => {
            if(seltop.ToppingId == top.Id){
              top.IsSelect = true;

              if(seltop.QuarterNums.includes(4)){
                top.ForthQuarter = true;
              }
              if(seltop.QuarterNums.includes(3)){
                top.ThirdQuarter = true;
              }
              if(seltop.QuarterNums.includes(1)){
                top.FirstQuarter = true;
              }
              if(seltop.QuarterNums.includes(2)){
                top.SecondQuarter = true;
              }
            }
          });
        });
      }
    }
  }


  public continueToSelectNotFreeTops(){
    console.log("continueToSelectNotFreeTops()");
    const myPizza = this.commonFunctionService.deepCopy(this.pizza);
    this.selectFreeTop = false;

    this.pizza.SelectedToppings.forEach(selTop => {
      selTop.TotalPrice = 0;
    });


  }

  public goBackToFreeTops(){
    console.log("goBackToFreeTops()");
    this.pizza.SelectedToppings.forEach((top, index)=>{
   //   console.log(index,top); 
      if ( !this.checkToppingDefaultSelectedInPizza(top.ToppingId) &&
           top.TotalPrice > 0){
            const originalTopping: ToppingAppAdvancedModel =
            this.toppings.find((e: ToppingAppAdvancedModel) => {
            return e.Id == top.ToppingId;
          }) as ToppingAppAdvancedModel;
            if (originalTopping) {
              originalTopping.IsSelect = false; 
            }
            this.pizza.SelectedToppings.splice(index, 1);
      }
    });
    //console.log("goBackToFreeTops() - this.pizza", this.pizza);
    //const myPizza = this.commonFunctionService.deepCopy(this.pizza);
   // console.log("continueToSelectNotFreeTops() - myPizza", myPizza);
    /*this.toppings.forEach((top)=>{
      let toppingsToRemove :number[];
      const index = this.pizza.SelectedToppings.findIndex((t) => {
       // console.log("top",top);
        console.log("t",t);
        return  !this.checkToppingDefaultSelectedInPizza(t.ToppingId) &&
        t.TotalPrice > 0;
      });
      console.log("index",index);
      if (index >= 0) {
        toppingsToRemove.push(index);
      //this.pizza.SelectedToppings.splice(index, 1);
      }
     });*/
    this.selectFreeTop = true;

   

     

  }



  public buildNotSelectedArray(){
    console.log("buildNotSelectedArray()");
    const myPizza = this.commonFunctionService.deepCopy(this.pizza);

    this.pizza.SelectedToppings.forEach(selTop => {
      selTop.TotalPrice = 0;
    });

    this.notSelectedToppingsArr = this.toppings.filter((top) => {
      return !top.IsSelect
    });

    this.selectFreeTop=false; 
  }

  public checkIfBackToSizaSelection(){
    if(this.pizza && this.pizza.PizzaPrices && this.pizza.PizzaPrices.length == 1){
      this.cancel();
    }
    else{
      this.sizeSelection = true;
    }
  }

  private getLanguage() {
    return this.translationService.language();
  }




  public cancel(isPrevious?) {
    console.log("cancel()");
    //this.showErrorComboMessage = false;
    this.isSaved = false;
    this.bsModalRef.hide();
   // this.dialogRef.close({
    //  isSaved: false
   // });
  }

  logo(event) {
  
    event.target.src = AppConfig.settings.logo; 
    //this.imgSrc = AppConfig.settings.logo;
  }

  public findGarnishGroupToOpenForEdit(garnish, cancellation?, adding?) {
    console.log("findGarnishGroupToOpenForEdit()");
    if (this.pizza.GeneralGarnishGroups && this.pizza.GeneralGarnishGroups.length > 0) {
      this.pizza.GeneralGarnishGroups.forEach(gGroup => {
        if (garnish.GarnishGroupId == gGroup.Id) {
          console.log("foundGroup");
          var foundGroup = gGroup;
          this.loadingGarnishesPopup(this.pizza, null, foundGroup, '', this.pizza.SelectedGarnishes, true, cancellation, adding)
        }

      });
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
        isCombo: true,
        isPizza: true,
        item: item
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
            this.loadingGarnishesPopup(item, null, grnGrp, result.comments,
              item.SelectedGarnishes, false, cancellation, adding);
          }
        } else if (!result.returnToPreviousPage && item.Garnishes && item.Garnishes.length > 0 && item.SelectedGarnishes &&
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
          item.Garnishes.length > 0 && item.SelectedGarnishes) {
          if (item.Garnishes) {
            const grnGrp = item.GarnishGroups[item.GarnishGroups.length - 1];
            if (grnGrp) {
              this.loadingGarnishesPopup(item, null, grnGrp, result.comments,
                item.SelectedGarnishes, item.GarnishGroups.indexOf(grnGrp) === 0, cancellation, adding);
            }
          }
        } else if (!result.returnToPreviousPage) {
          // If everything was added to list of garnishes - add to card
          console.log("addToCartItemWithGarnishes");
          //this.addToCartItemWithGarnishes(item, result, adding);

        } else {

        }
      } else {
        if (cancellation) {
          cancellation();
        }
      }
    });
  }

  public save(isPrevious?) {
    console.log("save");
    //this.showErrorComboMessage = false;
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

  public editPizzaSize(){
    console.log("editPizzaSize()");
    this.saveEdit = false;
    this.isEdit = false;
    this.sizeSelection = true;
    this.afterToppingsEdit = true;

  }

  public editToppings(topping){
    console.log("editToppings()");
    this.saveEdit = false;
    this.currentTopping = topping;
    this.sizeSelection = false;
    this.isEdit = false;
    this.editTopps = true;
    this.afterToppingsEdit = true;
  }

  public goToEdit(){
    console.log("goToEdit()");
    this.afterToppingsEdit = false;
    this.isEdit = true;
    this.sizeSelection = true;
    this.saveEdit = true;
         this.pizza.SelectedToppings.forEach(top => {
           top.IsSelect = true;
         });

  }

  private clearSelectedPizzaToppings() {
    this.pizza.SelectedToppings = [];
  }

  private checkIfSelectedToppingsExist() {
    const toppingObject = {};
    if (this.pizza && this.pizza.SelectedToppings && this.toppings) {
      this.pizza.SelectedToppings.forEach((selectTopping) => {
        if (selectTopping) {
          toppingObject[selectTopping.ToppingId] = selectTopping;
        }
      });
      this.toppings = this.toppings.map((tpng: ToppingAppAdvancedModel) => {{
        if (tpng && this.pizza.SelectedToppings.some((selectTopping) => {
          return selectTopping && tpng.Id === selectTopping.ToppingId;
        }) && toppingObject && toppingObject[tpng.Id] &&
          toppingObject[tpng.Id].QuarterNums) {
          tpng.CurrentCalcPrice = 0;
          tpng.TotalPrice = 0;
          tpng.FirstQuarter = false;
          tpng.SecondQuarter = false;
          tpng.ThirdQuarter = false;
          tpng.ForthQuarter = false;
          const nums = toppingObject[tpng.Id].QuarterNums.slice();
          toppingObject[tpng.Id].QuarterNums = [];
          nums.forEach((num) => {
            this.selectQuarter(num, tpng);
          });
          tpng.IsSelect = true;
        }
        return tpng;
      }});

    }
  }

  private clearGlobalPizzaToppings() {
    this.toppings.forEach((top: ToppingAppAdvancedModel) => {
      this.resetSelectedTopping(top);
    });
  }

  private setDefaultToppings(topping) {
    if (topping && topping.IsSelect) {
      topping.FirstQuarter = false;
      topping.SecondQuarter = false;
      topping.ThirdQuarter = false;
      topping.ForthQuarter = false;
      topping.CurrentCalcPrice = 0;
      topping.TotalPrice = 0;
      topping.QuarterNums = [];
      for (let i = 1; i <= 4; i++) {
        this.selectQuarter(i, topping);
      }
    }
  }

  private checkToppingDefaultSelectedInPizza(topping) {
    if (this.pizza && topping) {
      return this.pizza.PizzaToppings.some((pizzaTopping) => {
        return pizzaTopping && pizzaTopping.Id && 
        pizzaTopping.Id === topping.Id  ;
      });
    }
    return false;
  }

  private checkSelectedToppingDefaultSelectedInPizza(toppingId) {
  //  console.log("checkToppingDefaultSelectedInPizza",this.pizza.PizzaToppings, topping);
    if (this.pizza ) {
      return this.pizza.PizzaToppings.some((pizzaTopping) => {
        return pizzaTopping && pizzaTopping.Id && 
        pizzaTopping.Id === toppingId  && !pizzaTopping.ExcludedFromPizza;
      });
    }
    return false;
  }

   /*checkExcludedToppingFromPizza(topping) {
     console.log("checkExcludedToppingFromPizza",this.pizza.PizzaToppings, topping);
    if (this.pizza && topping) {
      return this.pizza.PizzaToppings.some((pizzaTopping) => {
        return pizzaTopping && pizzaTopping.Id && 
        pizzaTopping.Id === topping.Id  && pizzaTopping.ExcludedFromPizza;
      });
    }
    return false;
  }*/

    checkToppingsInPizza(topping) {
    if (this.pizza && topping) {
      return this.pizza.PizzaToppings.some((pizzaTopping) => {
        return pizzaTopping && pizzaTopping.Id &&  pizzaTopping.Id === topping.Id ;
      });
    }
    return false;
  }

  checkSelectedFreeToppingsInPizza(topping) {
    if (this.pizza && topping) {
      return this.pizza.SelectedToppings.some((top) => {
        return top && top.ToppingId == topping.Id && top.TotalPrice == 0;
      });
    }
    return false;
  }


  

  private selectedGarnishes(garnishes) {
    return garnishes.slice().filter((garnish) => {
      return garnish && garnish.IsSelected;
    })
  }

  private deselectGarnishesOfGarnishGroup(garnishes) {
    if (garnishes) {
      garnishes.forEach((garnish) => {
        if (garnish) {
          garnish.IsSelected = false;
          garnish.SelectedAmount = 0;
          garnish.Amount = 0;
        }
      });
    }
  }

  private handleGarnishMultiSelect(gar: GarnishAppAdvancedModel) {
    if (!gar) return;
    if (((gar.IsSelected && gar.SelectedAmount == gar.MaxAmount) || (gar.IsSelected && !gar.MaxAmount))) {
      gar.IsSelected = false;
      gar.SelectedAmount = 0;
      return;
    }
    //no special logic
    if (!gar.MaxAmount) {
      gar.IsSelected = true;
      gar.SelectedAmount = 1;
      return;
    }

    //first time select
    if (!gar.SelectedAmount || gar.SelectedAmount == 0) {
      gar.SelectedAmount = 1;
      gar.IsSelected = true;
      return;
    }

    //selected more then allowed:
    if (gar.SelectedAmount == gar.MaxAmount) {
      gar.SelectedAmount = 0;
      gar.IsSelected = false;
    }
    //more selection available:
    else {
      gar.IsSelected = true;
      gar.SelectedAmount++;
    }
  }

 /* public calcSelectedGarnishesPrice() {
    let resultPrice = 0;
    this.additionItems.forEach((item) => {
      item.SelectedGarnishes.forEach((grn) => {
        resultPrice += grn.Price;
      }); 
    });
    return resultPrice;
  }*/
  

  public selectGarnish(garnish : GarnishAppAdvancedModel, 
                       item : ItemAppAdvancedModel, 
                       garnishGroup : GarnishGroupAppModel) {
    if (garnish) {
     // this.showErrorGarnishMessage = false;
      if (garnishGroup) {

        const selectedItemsLength = this.selectedGarnishes(garnishGroup.Garnishes).length;
        if (!garnish.IsSelected && (garnishGroup.Max === 1 &&
          garnishGroup.Min <= garnishGroup.Max) &&
          selectedItemsLength >= garnishGroup.Max) {
          this.deselectGarnishesOfGarnishGroup(garnishGroup.Garnishes);
        } else if (!garnish.IsSelected && garnishGroup.Max !== 0 &&
          (selectedItemsLength >= garnishGroup.Max)) { //  ||  selectedItemsLength < this.garnishGroup.MaxAmount
          return;
        }
        this.handleGarnishMultiSelect(garnish);
      } //else {
       // this.handleGarnishMultiSelect(item);
      //}
    }
    item.SelectedGarnishes=[];
    if (item.GarnishGroups.length ===  1 ){
      item.SelectedGarnishes = this.selectedGarnishes(garnishGroup.Garnishes);
    } else {
      item.GarnishGroups.forEach((grp) => {
        this.selectedGarnishes(garnishGroup.Garnishes).forEach((grn) => {
          item.SelectedGarnishes.push(grn);
        });
     
      });
    }
   
  }

public selectToppingMobile (topping) {
  //this.currentTopping = topping;
  const matDialogRefPizzaBuilder = this.matDialog.open(PizzaBuilderComponent, {
    data: {
      topping,
      isShowInHalfs: this.franchise.IsShowInHalfs,
      pizza: this.pizza,
      isEdit: this.editTopps,
      selectFreeTop: this.selectFreeTop
    },
    backdropClass: 'backdropBackground',
      width: '95%',
      maxWidth: '1000px',
      disableClose: true,
      panelClass:  'custom-mat-dialog-mobile'
  });
  matDialogRefPizzaBuilder.afterClosed().subscribe(result => {
    if (result.isSaved && result.selectedQuarters && result.selectedQuarters.length > 0) {
      this.selectedQuartersCounter = 0;
      let counter = 0;
      result.selectedQuarters.forEach(i => {
        counter += 1;
        this.selectQuarter(i, topping);
        if (counter == result.selectedQuarters.length && this.selectFreeTop) {
          this.pizza.SelectedToppings.forEach((t) => {
            if (!this.checkSelectedToppingDefaultSelectedInPizza(t.ToppingId)){
              this.selectedQuartersCounter += t.QuarterNums.length;
              if (this.selectedQuartersCounter == this.maxToppings * 4) {
                //this.selectFreeTop = false;
                this.continueToSelectNotFreeTops();
              }
            }
           
          });
        }
      });
    }
  });
}

  public selectTopping(topping) {
    if (this.checkToppingDefaultSelectedInPizza(topping)) {
     return;
    }
    topping.IsSelect = !topping.IsSelect;
    if (topping.IsSelect) {
      this.currentTopping = topping;
      this.setDefaultToppings(topping);
    } else {
      // this.currentTopping = undefined;
      topping.IsSelect = false;
      topping.FirstQuarter = true;
      topping.SecondQuarter = true;
      topping.ThirdQuarter = true;
      topping.ForthQuarter = true;
      topping.TotalPrice = 0;
      for (let i = 1; i <= 4; i++) {
        this.selectQuarter(i, topping);
      }
    }

  }

  public selectQuartersTopping(topping) {
    this.currentTopping = topping;
}

  public setPizzaFreeToppings() {
    if (!this.pizza.PizzaToppings) return;
    this.pizza.PizzaToppings.forEach((freeTop) => {
      const originalTopping: ToppingAppAdvancedModel =
        this.toppings.find((e: ToppingAppAdvancedModel) => {
        return e.Id == freeTop.Id && !freeTop.ExcludedFromPizza;
      }) as ToppingAppAdvancedModel;
        if (originalTopping) {
          originalTopping.TotalPrice = 0;
          originalTopping.CurrentPrice = 0;
          originalTopping.IsSelect = true;
          for (let i = 1; i <= 4; i++) {
            this.selectQuarter(i, originalTopping);
            if (i==4)  this.currentTopping = undefined;
          }
        }
    });
  }

  public selectPizzaSize(pizzaPrice) {
    // Default or the first selected pizza; the next time just selected pizza
    this.pizza.SelectedPizzaPriceSize = pizzaPrice;
    if (this.toppings) {
      this.toppings.forEach((topping: ToppingAppAdvancedModel) => {
        let quarterPrice: number = 0;
        let toppingPrice: ToppingPriceAppModel;// = new ToppingPriceAppModel();
        //toppingPrice.Price = 0;
        if (this.pizza.PizzaToppings && this.pizza.PizzaToppings.find((e) => {
          return e.Id === topping.Id;//  && !e.ExcludedFromPizza;
        }) === undefined) {
          toppingPrice = topping.ToppingPrices.find((e) => {
            return e.PizzaSizeId == pizzaPrice.PizzaSizeId
          });
          topping.CurrentPrice = toppingPrice.Price;
        } else {
          
          toppingPrice = new ToppingPriceAppModel();
          toppingPrice.Price = 0;
        }
       
         quarterPrice = toppingPrice.Price / 4;

        this.pizza.SelectedToppings.forEach(function (top: ToppingAppAdvancedModel) {
          if (top.ToppingId == topping.Id && top.TotalPrice != 0) {
            top.QuarterNums = top.QuarterNums || [];
            switch (top.QuarterNums.length) {
              case 1:
                if (toppingPrice.QuarterPrice) quarterPrice = toppingPrice.QuarterPrice;
                break;
              case 2:
                if (toppingPrice.HalfPrice) quarterPrice = toppingPrice.HalfPrice / 2;
                break;
              case 3:
                if (toppingPrice.ThreeQuarterPrice) quarterPrice = toppingPrice.ThreeQuarterPrice / 3;
                break;
              default:
                break;
            }
            topping.TotalPrice = quarterPrice * top.QuarterNums.length;
            top.TotalPrice = quarterPrice * top.QuarterNums.length
          };

        });
      });
    }
  }

  public selectQuarter (quarterNum, topping) {
    this.selectQuarterToppings(quarterNum, topping);
  }

  private removeOrAddToppingToPizza (isAdd, toppingId, quarterNum,
    quarterPrice, toppingName, QuarterPizzaImageUrl, toppingDesc?, isDeselect?: boolean, top?) {
      
    if (isAdd) {
      const topping = this.pizza.SelectedToppings.find((e) => {
        return e.ToppingId === toppingId
      });
      if (topping != undefined) {
        topping.QuarterNums.push(quarterNum);
        if (this.selectFreeTop)  topping.TotalPrice = 0;
        else  topping.TotalPrice = quarterPrice * topping.QuarterNums.length;
        topping.Description = toppingDesc;
        return quarterPrice * topping.QuarterNums.length;
      } else {
        const topping = new ToppingAppAdvancedModel();
        topping.ToppingId = toppingId;
        topping.QuarterNums = [quarterNum];
        if (this.selectFreeTop)  topping.TotalPrice = 0;
        else topping.TotalPrice = quarterPrice;
        topping.Name = toppingName;
        topping.Description = toppingDesc;
        topping.QuarterPizzaImageUrl = QuarterPizzaImageUrl;
        this.pizza.SelectedToppings.push(topping);
        return quarterPrice;
      }
    } else {
      const topping = this.pizza.SelectedToppings.find((e) => {
        return e.ToppingId == toppingId;
      });
      if (topping && topping.QuarterNums) {
        const index = topping.QuarterNums.findIndex((e) => {
          return e == quarterNum;
        });
        if (index >= 0) {
          topping.QuarterNums.splice(index, 1);
        }
        topping.TotalPrice = quarterPrice * topping.QuarterNums.length;
        topping.Description = toppingDesc;
      } else {
        return 0;
      }
      return topping.TotalPrice;
      
    }
  }

  public displayComments() {
    this.comments = '';
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

  public priceOfPizza() {
    
    //console.log("selectQuarterToppings",this.pizza);
    let resultPrice = +this.pizza.SelectedPizzaPriceSize.Price;
    this.pizza.SelectedToppings.forEach((topping)=> {
      resultPrice += +topping.TotalPrice;
    });
    resultPrice *= +this.pizza.Amount || 1;
   // console.log("priceOfPizza",resultPrice);
    return +resultPrice;
  }

  private selectQuarterToppings (quarterNum, topping) {

    this.currentTopping = topping;
    if (!topping) {
      return;
    }
    switch (quarterNum) {
      case 0:
        if (!topping.FirstQuarter) {
          topping.FirstQuarter = true;
          topping.TotalPrice = this.removeOrAddToppingToPizza(topping.FirstQuarter, topping.Id, 1,
            this.calcToppingPrice(topping), topping.Name, topping.QuarterPizzaImageUrl ,this.getToppingQuarterNumsDesc(topping));
        } else if (!topping.SecondQuarter) {
          topping.SecondQuarter = true;
          topping.TotalPrice = this.removeOrAddToppingToPizza(topping.SecondQuarter, topping.Id, 2,
            this.calcToppingPrice(topping), topping.Name, topping.QuarterPizzaImageUrl ,this.getToppingQuarterNumsDesc(topping));
        } else if (!topping.ThirdQuarter) {
          topping.ThirdQuarter = true;
          topping.TotalPrice = this.removeOrAddToppingToPizza(topping.ThirdQuarter, topping.Id, 3,
            this.calcToppingPrice(topping), topping.Name, topping.QuarterPizzaImageUrl ,this.getToppingQuarterNumsDesc(topping));
        } else if (!topping.ForthQuarter) {
          topping.ForthQuarter = true;
          topping.TotalPrice = this.removeOrAddToppingToPizza(topping.ForthQuarter, topping.Id, 4,
            this.calcToppingPrice(topping), topping.Name, topping.QuarterPizzaImageUrl ,this.getToppingQuarterNumsDesc(topping));
        }
        break;
      case 1:
        topping.FirstQuarter = !topping.FirstQuarter;
        topping.TotalPrice =
          this.removeOrAddToppingToPizza(topping.FirstQuarter, topping.Id, quarterNum,
            this.calcToppingPrice(topping), topping.Name, topping.QuarterPizzaImageUrl ,this.getToppingQuarterNumsDesc(topping));
        break;
      case 2:
        topping.SecondQuarter = !topping.SecondQuarter;
        topping.TotalPrice =
          this.removeOrAddToppingToPizza(topping.SecondQuarter, topping.Id, quarterNum,
            this.calcToppingPrice(topping), topping.Name, topping.QuarterPizzaImageUrl ,this.getToppingQuarterNumsDesc(topping));
        break;
      case 3:
        topping.ThirdQuarter = !topping.ThirdQuarter;
        topping.TotalPrice =
          this.removeOrAddToppingToPizza(topping.ThirdQuarter, topping.Id, quarterNum,
            this.calcToppingPrice(topping), topping.Name, topping.QuarterPizzaImageUrl ,this.getToppingQuarterNumsDesc(topping));
        break;
      case 4:
        topping.ForthQuarter = !topping.ForthQuarter;
        topping.TotalPrice =
          this.removeOrAddToppingToPizza(topping.ForthQuarter, topping.Id, quarterNum,
            this.calcToppingPrice(topping), topping.Name, topping.QuarterPizzaImageUrl ,this.getToppingQuarterNumsDesc(topping));
        break;
      default:
    }
    //if (this.selectFreeTop) topping.TotalPrice = 0;
    if (topping && !topping.FirstQuarter && !topping.ForthQuarter &&
      !topping.SecondQuarter && !topping.ThirdQuarter) {
      topping.IsSelect = false;
      //this.currentTopping = undefined;
    
      const index = this.pizza.SelectedToppings.findIndex((e) => {
        return e.ToppingId === topping.Id;
      });
      if (index >= 0) {        
        this.pizza.SelectedToppings.splice(index, 1);
      }
;
    } else {
      topping.IsSelect = true;
    }
    this.getToppingQuarterNumsDesc(topping);
    
  }

  private getToppingQuarterNumsDesc(topping) {

    if (!topping.FirstQuarter && !topping.SecondQuarter && !topping.ThirdQuarter && !topping.ForthQuarter)
    {
      topping.Description = "";
      return topping.Description ;
    }
    if (topping.FirstQuarter && topping.SecondQuarter && topping.ThirdQuarter && topping.ForthQuarter)
    {
      topping.Description = this.translationService.translate('ALL_PIZZA');
      return topping.Description ;
    }
    if (topping.FirstQuarter && topping.SecondQuarter)
    {
      if (!topping.ForthQuarter && !topping.ThirdQuarter ) {
        topping.Description = this.translationService.translate('PIZZA_HALF_LEFT');
        return topping.Description ;
      }
      topping.Description = this.translationService.translate('PIZZA_3QUARTERS');
      return topping.Description ;
    }
    if (topping.ForthQuarter && topping.ThirdQuarter)
    {
      if (!topping.FirstQuarter && !topping.SecondQuarter) {
        topping.Description = this.translationService.translate('PIZZA_HALF_RIGHT');
        return topping.Description ;
      }
      topping.Description = this.translationService.translate('PIZZA_3QUARTERS');
      return topping.Description ;
    }
    if ((topping.FirstQuarter && topping.ThirdQuarter) || (topping.ForthQuarter && topping.SecondQuarter))
    {
      topping.Description = this.translationService.translate('PIZZA_2QUARTERS');
      return topping.Description ;
    }
    if ((topping.FirstQuarter && topping.ForthQuarter) || (topping.SecondQuarter && topping.ThirdQuarter))
    {
      topping.Description = this.translationService.translate('PIZZA_HALF');
      return topping.Description ;
    }
    topping.Description = this.translationService.translate('PIZZA_QUARTER');
      return topping.Description ;

/*
 "PIZZA_QUARTER": "Quarter",
  "PIZZA_HALF_LEFT": "Half Left",
  "PIZZA_HALF_RIGHT": "Half Right",
  "PIZZA_2QUARTERS": "2 Quarters",
  "PIZZA_3QUARTERS": "3 Quarters",
  "ALL_PIZZA":  "All Pizza",
*/
    
  }


  public resetSelectedTopping(topping) {
    topping.IsSelect = false;
    topping.FirstQuarter = false;
    topping.SecondQuarter = false;
    topping.ThirdQuarter = false;
    topping.ForthQuarter = false;
    topping.CurrentCalcPrice = 0;
    topping.QuarterNums = [];
    topping.TotalPrice = 0;
  }

  private calcToppingPrice (topping) {

    let quertersSelected = 0;
    let currentPrice = topping.CurrentPrice / 4;
    let topPrice = undefined;

    if (this.pizza.SelectedPizzaPriceSize) {
      topPrice = topping.ToppingPrices.find((item) => {
        return item.PizzaSizeId ===
          this.pizza.SelectedPizzaPriceSize.PizzaSizeId;
      });
    }
    if (topPrice) {

      if (topping.FirstQuarter === true) quertersSelected++;
      if (topping.SecondQuarter === true) quertersSelected++;
      if (topping.ThirdQuarter === true) quertersSelected++;
      if (topping.ForthQuarter === true) quertersSelected++;

      switch (quertersSelected) {
        case 1:
          if (topPrice.QuarterPrice) currentPrice = topPrice.QuarterPrice;
          break;
        case 2:
          if (topPrice.HalfPrice) currentPrice = topPrice.HalfPrice / 2;
          break;
        case 3:
          if (topPrice.ThreeQuarterPrice) currentPrice = topPrice.ThreeQuarterPrice / 3;
          break;
        default:
          break;
      }
    }
    return currentPrice;
  }

  // Check init settings for pizza:
  public checkPizzaSettings() {
    console.log("checkPizzaSettings()");
    if (this.pizza) {
      if (!this.pizza.Amount) {
        this.pizza.Amount = 1;
      }
      if (!this.pizza.SelectedToppings) {
        this.pizza.SelectedToppings = [];
      }
      if (this.pizza && !this.pizza.SelectedPizzaPriceSize &&
        this.pizza.PizzaPrices && this.pizza.PizzaPrices.length > 0) {
        const pizzaPrice = this.pizza.PizzaPrices.find((price) => {
          return price.IsDefault;
        });
        if (pizzaPrice) {
          this.selectedPrice = pizzaPrice;
        } else {
          this.selectedPrice = this.pizza.PizzaPrices[0];
        }
        this.selectPizzaSize(this.selectedPrice);
      } else {
        this.selectedPrice = this.pizza.SelectedPizzaPriceSize;
        this.selectPizzaSize(this.selectedPrice);
      }
      if (this.pizza && (!this.pizza.SelectedToppings ||
        this.pizza.SelectedToppings.length === 0)) {
        this.setPizzaFreeToppings();
      }
    }
  }

  public isMobileBrowser() {
    return this.browserIdentificatorService.isMobile.Android() ||
      this.browserIdentificatorService.isMobile.Windows() ||
      this.browserIdentificatorService.isMobile.iOS();
  }

  public selectSize(pizzaPrice) {
    console.log("selectSize()");
    this.selectedPrice = pizzaPrice;
    this.selectPizzaSize(this.selectedPrice);
  }

  private initializeSettings() {
    this.lang = this.translationService.language();
    this.cashSymbol = AppConfig.cashSymbol;
    this.colors.menuColor = AppConfig.settings.menuColor;
    this.colors.buttonColor = AppConfig.settings.buttonColor;
  }

  public closeAndNotSaveGarnishes() {
  //  this.dialogRef.close({});
  this.isSaved = false;
  this.bsModalRef.hide();
  }

  public selectedQuarters(result) {
    let selectedQuartersCounter = 0;
    console.log("selectedQuarters()");
    this.currentTopping = result.topping;
    if (this.selectFreeTop){
      const myPizzaBeforeTop = this.commonFunctionService.deepCopy(this.pizza);
      const myTopping2 = this.commonFunctionService.deepCopy(result.topping);
      if (myPizzaBeforeTop.SelectedToppings.length > 0) {

        myPizzaBeforeTop.SelectedToppings.forEach((t) => {
          if (!this.checkSelectedToppingDefaultSelectedInPizza(t.ToppingId))
           selectedQuartersCounter += t.QuarterNums.length;
        });

        let wantToBeSelectedCounter = selectedQuartersCounter + 1;

        if (wantToBeSelectedCounter > this.maxToppings * 4) {
          //this.selectFreeTop = false;
          console.log("if (wantToBeSelectedCounter > this.maxToppings * 4)");
          const foundTopOnPizza = this.pizza.SelectedToppings.find((top) => {
            return top.ToppingId == this.currentTopping.Id;
          })
          if (foundTopOnPizza) {
            foundTopOnPizza.QuarterNums.forEach(quarterNum => {
              if (quarterNum == result.selectedQuarter) {
                console.log("if(quarterNum == result.selectedQuarter)");
                this.selectQuarter(result.selectedQuarter, result.topping);
              }

            });
          }
        }
        else {
          console.log("CAN SELECT");
          this.selectQuarter(result.selectedQuarter, result.topping);
        }
      } else this.selectQuarter(result.selectedQuarter, result.topping);
    } else {
      if (!this.currentTopping.IsSelect) {
        this.currentTopping.IsSelect= true;
      }
      this.selectQuarter(result.selectedQuarter, result.topping);
    }
    

   
    
  }

  public checkPizza() {
   
    if (this.pizza && this.pizza.SelectedToppings) {
      this.pizza.SelectedToppings =
        this.pizza.SelectedToppings.filter((topping) => {
          return topping.QuarterNums && topping.QuarterNums.length > 0;
        });
    }
  }

  public savePizza(isPrevious?) {
    console.log("savePizza");
    this.checkPizza();
    this.isSaved = true;
    this.bsModalRef.hide();
 /*   this.dialogRef.close({
      pizza: this.pizza,
    //  additionItems: this.additionItems,
      specialRequests: this.specialRequests,
      isSaved: true
    });*/
  }

  public previousSection() {
    this.isSaved = false;
    this.bsModalRef.hide();
   /* this.dialogRef.close({
      isReturnToPrevPage: true,
      pizza: this.pizza,
      //additionItems: this.additionItems,
      specialRequests: this.specialRequests,
      pizzaSize: this.selectedPrice
    });*/
  }

 /* private updateScroll() {
    setTimeout(() => {
      this.itemsAreaScrollbar.update();
    }, this.timeOutForScrollUpdate);
  }

  ngDoCheck(): void {
   // this.updateScroll();
  }*/

}
