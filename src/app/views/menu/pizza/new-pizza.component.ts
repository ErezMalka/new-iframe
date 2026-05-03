import { Component, DoCheck, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
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
import { SizeMobileInitializationComponent } from '../../../shared/classes/size-mobile-initialization.component';
import { ItemCommentsComponent } from "../item-comments/item-comments.component";
import { PizzaBuilderComponent } from "./pizza-builder/pizza-builder.component";
import { MatDialog } from "@angular/material/dialog";
import { FranchiseAppModel } from "../../../models/franchise-branch/franchise-app.model";
import { ItemAppAdvancedModel } from '../../../models/advanced/menu/item-app-advanced.model';
import { GarnishAppAdvancedModel } from "../../../models/advanced/menu/garnish-app-advanced.model";
import { GarnishGroupAppModel } from "../../../models/menu/garnish-group-app.model";
import ComboAppAdvancedModel from '../../../models/advanced/combo/combo-app-advanced.model';

class PizzaData {
  pizza: PizzaAppAdvancedModel;
  pizzaSizePrice: PizzaPriceAppModel;
  specialRequests: string;
  //additionItems: ItemAppAdvancedModel[];
  isCombo: boolean;
  ToppingGroupId: number;
  MaxToppings: number;
  Combo: ComboAppAdvancedModel;
}

@Component({
  selector: 'pizza',
  templateUrl: './new-pizza.component.html',
  styleUrls: ['./new-pizza.component.scss']
})
export class NewPizzaComponent extends SizeMobileInitializationComponent implements OnInit, DoCheck {

  public lang: string;
  public cashSymbol: string;

  public pizza: PizzaAppAdvancedModel;
  public toppings: ToppingAppModel[];
  //public additionItems: ItemAppAdvancedModel[];
  public isCombo: boolean = false;
  public toppingGroupId: number;
  public maxToppings: number;
  public selectFreeTop: boolean;
  public selectedQuartersCounter: number;
  public specialRequests: string;
  private pizzaPrice: PizzaPriceAppModel;

  public selectedPrice: PizzaPriceAppModel;
  // For scrollbar:
  public disabled = this.isMobileBrowser();
  public shown: 'native' | 'hover' | 'always' = 'native';
  public currentTopping: ToppingAppAdvancedModel;

  public combo: ComboAppAdvancedModel;

  public notSelectedToppingsArr: ToppingAppModel[];

  @ViewChild(NgScrollbar) itemsAreaScrollbar: NgScrollbar;
  private timeOutForScrollUpdate: number = 200;

  franchise: FranchiseAppModel;
  continue: boolean = true;

  constructor(
    private appStorageService: AppStorageService,
    private translationService: TranslationsService,
    public dialogRef: MatDialogRef<NewPizzaComponent>,
    public dialog: MatDialog,
    public matDialog: MatDialog,

    public commonFunctionService: CommonFunctionsService,
    protected browserIdentificatorService: BrowserIdentificatorService,
    @Inject(MAT_DIALOG_DATA) public data: PizzaData
  ) {
    super(browserIdentificatorService);
    this.selectFreeTop = false;
    this.selectedQuartersCounter = 0;
    if (this.data) {
      console.log("this.data - pizza data",this.data)
      this.pizza = this.data.pizza;
      console.log("Constructor - pizza", this.pizza);
      this.isCombo = this.data.isCombo;
      if (data.Combo) {
        this.combo = data.Combo;
      }
      if (this.data.ToppingGroupId == null || this.data.ToppingGroupId == undefined) {
        this.toppingGroupId = -1;
        this.selectFreeTop = false;
        console.log(" this.selectFreeTop", this.selectFreeTop);
        this.notSelectedToppingsArr = this.appStorageService.pizzaToppings || [];
      } else {
        this.toppingGroupId = this.data.ToppingGroupId;
        this.selectFreeTop = true;
      }
      this.maxToppings = this.data.MaxToppings;
      if (this.maxToppings == null ||
        this.maxToppings == undefined ||
        this.maxToppings < 1) {
          this.selectFreeTop = false;
          this.maxToppings =0;
        }
      //this.additionItems = this.data.additionItems;
      //this.pizzaPrice = this.data.pizzaSizePrice;
      this.specialRequests = this.data.specialRequests;
      this.preparePizza();
      this.toppings = this.appStorageService.pizzaToppings || [];
      console.log("this.toppings", this.toppings);
      this.franchise = this.appStorageService.franchise;
    }
    this.initializeSize();
  }

  public checkFreeToppingsStep(topping) {
    //console.log(topping);
    if (this.isCombo &&
      this.maxToppings > 0 &&
      this.toppingGroupId > 0 &&
      topping.ToppingGroupId == this.toppingGroupId &&
      topping.FirstQuarter &&
      topping.SecondQuarter &&
      topping.ThirdQuarter &&
      topping.ForthQuarter) return false;
    else return true;
  }

  private preparePizza() {
    // Deep cloning to avoid select multiple items
    this.pizza = this.commonFunctionService.deepCopy(this.pizza);
    // const e1 = {...this.pizza};
  }

  public colors = {
    menuColor: '',
    buttonColor: ''
  };

  ngOnInit() {
    this.initializeSettings();
    this.clearGlobalPizzaToppings();
    if (!this.data.isCombo) {
      this.clearSelectedPizzaToppings();
    }
    this.checkPizzaSettings();
    if (this.data.isCombo) {
      this.checkIfSelectedToppingsExist();
      this.checkToppingPrices();
    }

    


  }

  private getLanguage() {
    return this.translationService.language();
  }

  public checkToppingPrices() {
    this.combo.PizzaCombos.forEach(pizzaCombo => {
      //console.log("pizzaCombo",pizzaCombo);
      this.pizza.SelectedToppings.forEach(topping => {
        console.log("selected-topping", topping);
      });
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
      this.toppings = this.toppings.map((tpng: ToppingAppAdvancedModel) => {
        {
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
        }
      });

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
        return pizzaTopping && 
               pizzaTopping.Id && 
               pizzaTopping.Id === topping.Id && !pizzaTopping.ExcludedFromPizza;
      });
    }
    return false;
  }

  public checkToppingExcludedFromPizza(topping) {
    if (this.pizza && topping) {
      return this.pizza.PizzaToppings.some((pizzaTopping) => {
        return pizzaTopping && 
               pizzaTopping.Id && 
               pizzaTopping.Id === topping.Id && pizzaTopping.ExcludedFromPizza;
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


  public selectGarnish(garnish: GarnishAppAdvancedModel,
    item: ItemAppAdvancedModel,
    garnishGroup: GarnishGroupAppModel) {
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
    item.SelectedGarnishes = [];
    if (item.GarnishGroups.length === 1) {
      item.SelectedGarnishes = this.selectedGarnishes(garnishGroup.Garnishes);
    } else {
      item.GarnishGroups.forEach((grp) => {
        this.selectedGarnishes(garnishGroup.Garnishes).forEach((grn) => {
          item.SelectedGarnishes.push(grn);
        });

      });
    }
  }

  public selectToppingMobile(topping) {
    this.currentTopping = topping;
    const matDialogRefPizzaBuilder = this.matDialog.open(PizzaBuilderComponent, {
      data: {
        topping,
        isShowInHalfs: this.franchise.IsShowInHalfs,
        pizza: this.pizza
      },
      backdropClass: 'backdropBackground',
      width: '95%',
      maxWidth: '1000px',
      disableClose: true,
      panelClass: 'custom-mat-dialog-mobile'
    });
    matDialogRefPizzaBuilder.afterClosed().subscribe(result => {
      if (result.isSaved && result.selectedQuarters && result.selectedQuarters.length > 0) {

        this.selectedQuartersCounter = 0;
        let counter = 0;
        console.log("this.selectedQuartersCounter", this.selectedQuartersCounter);
        result.selectedQuarters.forEach(i => {
          counter += 1;
          this.selectQuarter(i, topping);
          if (counter == result.selectedQuarters.length && this.selectFreeTop) {
            this.pizza.SelectedToppings.forEach((t) => {
              this.selectedQuartersCounter += t.QuarterNums.length;
              console.log("this.selectedQuartersCounter", this.selectedQuartersCounter);
              if (this.selectedQuartersCounter == this.maxToppings * 4) {
                //this.selectFreeTop = false;
                console.log("this.selectFreeTop", this.selectFreeTop);
                this.continueToSelectNotFreeTops();
              }
            });
          }
        });
      }
    });
  }




  public counter: number = 0;

  public selectToppingElse(topping) {
    console.log("selectTopping() - WITHOUT GROUP")
      topping.IsSelect = !topping.IsSelect;
      console.log("topping.IsSelect", topping.IsSelect);
      
      if (topping.IsSelect) {
        console.log("IF - topping.IsSelect = true", topping.IsSelect);
        this.currentTopping = topping;
        this.setDefaultToppings(topping);
      } else {
        console.log("ELSE -  topping.IsSelect=false", topping.IsSelect)
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

  public selectTopping(topping) {
    if (this.checkToppingDefaultSelectedInPizza(topping)) {
      return;
    }

    console.log("selectTopping()")
    topping.IsSelect = !topping.IsSelect;
    if (topping.IsSelect == false) {
      this.counter--;
      console.log("counter--", this.counter);
    }
    console.log("topping.IsSelect", topping.IsSelect);
    if (this.counter >= this.maxToppings) {
      console.log("this.counter>= this.maxToppings");
      topping.IsSelect = false;
      console.log("topping.IsSelect", topping.IsSelect);
      return;
    }
    if (topping.IsSelect) {
      console.log("IF - topping.IsSelect = true", topping.IsSelect);
      this.counter++;
      console.log("this.counter", this.counter);
      this.currentTopping = topping;
      this.setDefaultToppings(topping);
    } else {
      console.log("ELSE -  topping.IsSelect=false", topping.IsSelect)
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

  public continueToSelectNotFreeTops(){
    console.log("continueToSelectNotFreeTops()");
    console.log("continueToSelectNotFreeTops() - this.pizza", this.pizza);
    const myPizza = this.commonFunctionService.deepCopy(this.pizza);
    console.log("continueToSelectNotFreeTops() - myPizza", myPizza);
    this.selectFreeTop = false;

    this.pizza.SelectedToppings.forEach(selTop => {
      selTop.TotalPrice = 0;
    });

    console.log("continueToSelectNotFreeTops() - this.pizza", this.pizza);

  }



  public buildNotSelectedArray(){
    console.log("buildNotSelectedArray()");
    console.log("buildNotSelectedArray() - this.pizza", this.pizza);
    const myPizza = this.commonFunctionService.deepCopy(this.pizza);
    console.log("buildNotSelectedArray() - myPizza", myPizza);

    this.pizza.SelectedToppings.forEach(selTop => {
      selTop.TotalPrice = 0;
    });

    this.notSelectedToppingsArr = this.toppings.filter((top) => {
      return !top.IsSelect
    });
    console.log("this.notSelectedToppingsArr",this.notSelectedToppingsArr);

    this.selectFreeTop=false; 
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
        console.log("originalTopping",originalTopping);
        console.log("freeTop",freeTop);
        originalTopping.TotalPrice = 0;
        originalTopping.CurrentPrice = 0;
        originalTopping.IsSelect = true;
        for (let i = 1; i <= 4; i++) {
          this.selectQuarter(i, originalTopping);
        }
      }
    });
  }

  public selectPizzaSize(pizzaPrice) {
    console.log("selectPizzaSize: this.pizza",this.pizza);
    // Default or the first selected pizza; the next time just selected pizza
    this.pizza.SelectedPizzaPriceSize = pizzaPrice;

    console.log("pizzaPrice",pizzaPrice);
    if (this.toppings) {
      this.toppings.forEach((topping: ToppingAppAdvancedModel) => {

        console.log("topping",topping);

        let toppingPrice: ToppingPriceAppModel = new ToppingPriceAppModel();
        toppingPrice.Price = 0;
        console.log("toppingPrice",toppingPrice);

        if (this.pizza.PizzaToppings && this.pizza.PizzaToppings.find((e) => {
          return e.Id === topping.Id && !e.ExcludedFromPizza;
        }) === undefined) {
          console.log("this.pizza.PizzaToppings",this.pizza.PizzaToppings);
          //console.log("this.pizza.PizzaToppings",this.pizza.PizzaToppings);
          toppingPrice = topping.ToppingPrices.find((e) => {
            return e.PizzaSizeId == pizzaPrice.PizzaSizeId
          });
          console.log("toppingPrice",toppingPrice);
        }
        topping.CurrentPrice = toppingPrice.Price;
        let quarterPrice = toppingPrice.Price / 4;

        this.pizza.SelectedToppings.forEach(function (top: ToppingAppAdvancedModel) {
          if (top.ToppingId == topping.Id) {
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
  
 /*    checkExcludedToppingFromPizza(topping) {
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

  public selectQuarter(quarterNum, topping) {
    this.selectQuarterToppings(quarterNum, topping);
  }

  private removeOrAddToppingToPizza(isAdd, toppingId, quarterNum,
    quarterPrice, toppingName, groupId, QuarterPizzaImageUrl, toppingDesc?, isDeselect?: boolean, top?) {

    if (isAdd) {
      const topping = this.pizza.SelectedToppings.find((e) => {
        return e.ToppingId === toppingId
      });
      if (topping != undefined) {
        topping.QuarterNums.push(quarterNum);
        topping.TotalPrice = quarterPrice * topping.QuarterNums.length;
        topping.Description = toppingDesc;
        return quarterPrice * topping.QuarterNums.length;
      } else {
        const topping = new ToppingAppAdvancedModel();
        topping.ToppingId = toppingId;
        topping.ToppingGroupId = groupId;
        topping.QuarterNums = [quarterNum];
        topping.TotalPrice = quarterPrice;
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
    this.dialog.open(ItemCommentsComponent, {
      data: {
        comments: this.specialRequests || ''
      },
      width: '80%',
      disableClose: true,
      panelClass: 'custom-mat-dialog-comments'
    }).afterClosed().subscribe((comments) => {
      this.specialRequests = comments || '';
    })
  }

  public priceOfPizza() {

    //console.log("selectQuarterToppings",this.pizza);
    let resultPrice = +this.pizza.SelectedPizzaPriceSize.Price;
    this.pizza.SelectedToppings.forEach((topping) => {
      resultPrice += +topping.TotalPrice;
    });
    resultPrice *= +this.pizza.Amount || 1;
    // console.log("priceOfPizza",resultPrice);
    return +resultPrice;
  }

  private selectQuarterToppings(quarterNum, topping) {
    console.log("selectQuarterToppings()");
    console.log("quarterNum", quarterNum);
    console.log("topping", topping);
    const mytopping = this.commonFunctionService.deepCopy(topping);
    console.log("mytopping", mytopping);
    console.log("this.pizza", this.pizza);

    //var selectedQuartersCounter = 0;

    this.currentTopping = topping;
    if (!topping) {
      return;
    }



      console.log("!if(this.pizza.ComboPizza)");
      switch (quarterNum) {
        case 0:
          if (!topping.FirstQuarter) {
            topping.FirstQuarter = true;
            topping.TotalPrice = this.removeOrAddToppingToPizza(topping.FirstQuarter, topping.Id, 1,
              this.calcToppingPrice(topping), topping.Name, topping.ToppingGroupId, topping.QuarterPizzaImageUrl, this.getToppingQuarterNumsDesc(topping));
          } else if (!topping.SecondQuarter) {
            topping.SecondQuarter = true;
            topping.TotalPrice = this.removeOrAddToppingToPizza(topping.SecondQuarter, topping.Id, 2,
              this.calcToppingPrice(topping), topping.Name, topping.ToppingGroupId, topping.QuarterPizzaImageUrl, this.getToppingQuarterNumsDesc(topping));
          } else if (!topping.ThirdQuarter) {
            topping.ThirdQuarter = true;
            topping.TotalPrice = this.removeOrAddToppingToPizza(topping.ThirdQuarter, topping.Id, 3,
              this.calcToppingPrice(topping), topping.Name, topping.ToppingGroupId, topping.QuarterPizzaImageUrl, this.getToppingQuarterNumsDesc(topping));
          } else if (!topping.ForthQuarter) {
            topping.ForthQuarter = true;
            topping.TotalPrice = this.removeOrAddToppingToPizza(topping.ForthQuarter, topping.Id, 4,
              this.calcToppingPrice(topping), topping.Name, topping.ToppingGroupId, topping.QuarterPizzaImageUrl, this.getToppingQuarterNumsDesc(topping));
          }
          break;
        case 1:
          topping.FirstQuarter = !topping.FirstQuarter;
          topping.TotalPrice =
            this.removeOrAddToppingToPizza(topping.FirstQuarter, topping.Id, quarterNum,
              this.calcToppingPrice(topping), topping.Name, topping.ToppingGroupId, topping.QuarterPizzaImageUrl, this.getToppingQuarterNumsDesc(topping));
          break;
        case 2:
          topping.SecondQuarter = !topping.SecondQuarter;
          topping.TotalPrice =
            this.removeOrAddToppingToPizza(topping.SecondQuarter, topping.Id, quarterNum,
              this.calcToppingPrice(topping), topping.Name, topping.ToppingGroupId, topping.QuarterPizzaImageUrl, this.getToppingQuarterNumsDesc(topping));
          break;
        case 3:
          topping.ThirdQuarter = !topping.ThirdQuarter;
          topping.TotalPrice =
            this.removeOrAddToppingToPizza(topping.ThirdQuarter, topping.Id, quarterNum,
              this.calcToppingPrice(topping), topping.Name, topping.ToppingGroupId, topping.QuarterPizzaImageUrl, this.getToppingQuarterNumsDesc(topping));
          break;
        case 4:
          topping.ForthQuarter = !topping.ForthQuarter;
          topping.TotalPrice =
            this.removeOrAddToppingToPizza(topping.ForthQuarter, topping.Id, quarterNum,
              this.calcToppingPrice(topping), topping.Name, topping.ToppingGroupId, topping.QuarterPizzaImageUrl, this.getToppingQuarterNumsDesc(topping));
          break;
        default:
      }
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

      } else {
        topping.IsSelect = true;
      }
      this.getToppingQuarterNumsDesc(topping);
    

  }

  private getToppingQuarterNumsDesc(topping) {

    if (!topping.FirstQuarter && !topping.SecondQuarter && !topping.ThirdQuarter && !topping.ForthQuarter) {
      topping.Description = "";
      return topping.Description;
    }
    if (topping.FirstQuarter && topping.SecondQuarter && topping.ThirdQuarter && topping.ForthQuarter) {
      topping.Description = this.translationService.translate('ALL_PIZZA');
      return topping.Description;
    }
    if (topping.FirstQuarter && topping.SecondQuarter) {
      if (!topping.ForthQuarter && !topping.ThirdQuarter) {
        topping.Description = this.translationService.translate('PIZZA_HALF_LEFT');
        return topping.Description;
      }
      topping.Description = this.translationService.translate('PIZZA_3QUARTERS');
      return topping.Description;
    }
    if (topping.ForthQuarter && topping.ThirdQuarter) {
      if (!topping.FirstQuarter && !topping.SecondQuarter) {
        topping.Description = this.translationService.translate('PIZZA_HALF_RIGHT');
        return topping.Description;
      }
      topping.Description = this.translationService.translate('PIZZA_3QUARTERS');
      return topping.Description;
    }
    if ((topping.FirstQuarter && topping.ThirdQuarter) || (topping.ForthQuarter && topping.SecondQuarter)) {
      topping.Description = this.translationService.translate('PIZZA_2QUARTERS');
      return topping.Description;
    }
    if ((topping.FirstQuarter && topping.ForthQuarter) || (topping.SecondQuarter && topping.ThirdQuarter)) {
      topping.Description = this.translationService.translate('PIZZA_HALF');
      return topping.Description;
    }
    topping.Description = this.translationService.translate('PIZZA_QUARTER');
    return topping.Description;

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

  private calcToppingPrice(topping) {

    let quertersSelected = 0;
    let currentPrice = topping.CurrentPrice / 4;
    let topPrice = undefined;

    if (this.pizza.SelectedPizzaPriceSize) {
      topPrice = topping.ToppingPrices.find((item) => {
        return item.PizzaSizeId ===
          this.pizza.SelectedPizzaPriceSize.PizzaSizeId;
      });
    }
    console.log ("Tanya calcToppingPrice topPrice", topPrice);
    if (topPrice) {

      if (topping.FirstQuarter === true) quertersSelected++;
      if (topping.SecondQuarter === true) quertersSelected++;
      if (topping.ThirdQuarter === true) quertersSelected++;
      if (topping.ForthQuarter === true) quertersSelected++;
console.log ("Tanya calcToppingPrice topping", topping);
console.log ("Tanya calcToppingPrice quertersSelected", quertersSelected);
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
    console.log ("Tanya calcToppingPrice currentPrice", currentPrice);
    return currentPrice;
  }

  // Check init settings for pizza:
  public checkPizzaSettings() {
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
    this.dialogRef.close({});
  }

  public selectedQuarters(result) {

    let selectedQuartersCounter = 0;
    let counter = 0;

    console.log("selectedQuarters()");
    console.log("result", result);
    console.log("this.selectFreeTop", this.selectFreeTop);
    const myPizzaBeforeTop = this.commonFunctionService.deepCopy(this.pizza);
    const myTopping2 = this.commonFunctionService.deepCopy(result.topping);
    console.log("myTopping2", myTopping2);
    console.log("myPizzaBeforeTop", myPizzaBeforeTop);
    console.log("this.pizza", this.pizza);

    this.currentTopping = result.topping;

    if (this.selectFreeTop) {

      if (myPizzaBeforeTop.SelectedToppings.length > 0) {

        myPizzaBeforeTop.SelectedToppings.forEach((t) => {
          if (!this.checkSelectedToppingDefaultSelectedInPizza(t.ToppingId))
          selectedQuartersCounter += t.QuarterNums.length;
          console.log("selectedQuartersCounter", selectedQuartersCounter);
        });

        let wantToBeSelectedCounter = selectedQuartersCounter + 1;
        console.log("wantToBeSelectedCounter", wantToBeSelectedCounter);

        if (wantToBeSelectedCounter > this.maxToppings * 4) {
          //this.selectFreeTop = false;
          console.log("if (wantToBeSelectedCounter > this.maxToppings * 4)");
          const foundTopOnPizza = this.pizza.SelectedToppings.find((top) => {
            return top.ToppingId == this.currentTopping.Id;
          })
          console.log("foundTopOnPizza", foundTopOnPizza);
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
      }
      else this.selectQuarter(result.selectedQuarter, result.topping);
    }
    else {
      if (!this.currentTopping.IsSelect) {
        this.currentTopping.IsSelect = true;
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
    console.log("save")
    this.checkPizza();
    this.dialogRef.close({
      pizza: this.pizza,
      //  additionItems: this.additionItems,
      specialRequests: this.specialRequests,
      isSaved: true
    });
  }

  public previousSection() {
    console.log("previousSections")
    this.dialogRef.close({
      isReturnToPrevPage: true,
      pizza: this.pizza,
      //additionItems: this.additionItems,
      specialRequests: this.specialRequests,
      pizzaSize: this.selectedPrice
    });
  }

  private updateScroll() {
    setTimeout(() => {
      this.itemsAreaScrollbar.update();
    }, this.timeOutForScrollUpdate);
  }

  ngDoCheck(): void {
    // this.updateScroll();
  }

}
