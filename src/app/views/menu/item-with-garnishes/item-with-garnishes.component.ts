import { Component, Inject, Input, OnInit, } from '@angular/core';
import { AppConfig } from "../../../app.config";
import { TranslationsService } from '../../../shared/translations/translations.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { BrowserIdentificatorService } from '../../../core/services/common-settings/browser-identificator.service';
import { PizzaAppAdvancedModel } from '../../../models/advanced/pizza/pizza-app-advanced.model';
import { ToppingAppAdvancedModel } from '../../../models/advanced/pizza/topping-app-advanced.model';
import { CommonFunctionsService } from "../../../core/services/common-settings/common-functions.service";
import { ItemCommentsComponent } from "../item-comments/item-comments.component";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import ComboAppAdvancedModel from "../../../models/advanced/combo/combo-app-advanced.model";
import { ItemAppAdvancedModel } from "../../../models/advanced/menu/item-app-advanced.model";
import { GarnishAppModel } from "../../../models/menu/garnish-app.model";
import { GarnishGroupAppModel } from "../../../models/menu/garnish-group-app.model";
import { GarnishesComponent } from "../garnishes/garnishes.component";
import { GarnishAppAdvancedModel } from "../../../models/advanced/menu/garnish-app-advanced.model";
import { PizzaSizeAppModel } from "../../../models/pizza/pizza-size-app.model";


@Component({
  selector: 'item-with-garnishes',
  templateUrl: './item-with-garnishes.component.html',
  styleUrls: ['./item-with-garnishes.component.scss']
})
export class ItemWithGarnishesComponent implements OnInit {

  public lang: string;
  public cashSymbol: string;

  public toppings: ToppingAppAdvancedModel[] = [];

  public  isEdit:boolean = false;

  public comments: string;

  public combo: ComboAppAdvancedModel;
  public item: ItemAppAdvancedModel;
 // public pizza: PizzaAppAdvancedModel;
  public isPizza:boolean = false;
  public showBeforePizzaGarnishes: boolean = false;

  public price: number;
  public isSaved: boolean = false;
  public imgSrc: any;
  public isExists: boolean;

  public myGarnishGroups: GarnishGroupAppModel[] = [];

  public showErrorGarnishMessage: boolean = false;
  public selectedGarnishes: GarnishAppAdvancedModel[] = [];
  public tempSelectedGarnishes: GarnishAppAdvancedModel[] = [];

  public itemComments: string;
  public itemName: string;

  private timeToDisplayImage = 3000;

  public graphics = {
    logo: '',
    cover: '',
  };
  public colors = {
    menuColor: '',
    buttonColor: ''
  };

  public showErrorComboMessage = false;
  bsModal: BsModalRef;

  public totalGarnishsSum = 0;
  public totalPizzaSum = 0;

  public errorMessage: string;
  activeModal: any;

  public isOpenInput: boolean = false;
  closing: boolean;

  constructor(
    public bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private translationService: TranslationsService,
    public dialog: MatDialog,
    public commonFunctionService: CommonFunctionsService,
    protected browserIdentificatorService: BrowserIdentificatorService,
    private commonFunctionsService: CommonFunctionsService,
    private matDialog: MatDialog,
    
    
  ) {
    //this.totalGarnishsSum = 0;
    
      
      
    
  }



  ngOnInit() {
    /*this.item.GarnishGroups.forEach(gGroup => {
      if(gGroup.Max == 0) gGroup.Max = 20;
      /*gGroup.Garnishes.forEach(gar => {
        gar.SelectedAmount = 0;
        if(gar.MaxAmount == null) gar.MaxAmount = 20;
        
      })*/

      if(this.item.GarnishGroups){

      this.item.GarnishGroups.forEach(gGroup => {
        if(gGroup.Max == 0){
          gGroup.Max = 100;
        } 
        
      });
    }
      
    
    this.initializeSettings();
    this.item = this.commonFunctionService.deepCopy(this.item);
   
    if(Array.isArray(this.item)){
      //console.log("item-is array");
      this.item = this.item[0];
    }
   /* if (this.isPizza && this.showBeforePizzaGarnishes) {
      this.item.GarnishGroups = this.item.GarnishGroups.filter((g) => {
        return g.ShowBeforePizza;
      });
    }*/

    // OOS-FIX: drop garnish groups that have no available garnish, so a
    // mandatory group with zero available garnishes never blocks the order.
    const isGarnishAvailable = (g: any): boolean => {
      if (!g) return false;
      if (g.ActiveInApp === false) return false;
      if (g.ActiveToday !== true && g.ActiveAllWeek !== true) return false;
      if (Array.isArray(g.DayAvailability) && g.DayAvailability.length > 0) {
        const today = new Date().getDay();
        if (!g.DayAvailability.some((d: any) => Number(d) === today)) return false;
      }
      if (typeof g.Quantity === 'number' && g.Quantity <= 0) return false;
      return true;
    };
    const dropEmptyGarnishGroups = (groups: any[]): any[] => {
      if (!Array.isArray(groups)) return groups;
      return groups.filter((gr: any) => (gr.Garnishes || []).some(isGarnishAvailable));
    };
    this.item.GarnishGroups = dropEmptyGarnishGroups(this.item.GarnishGroups);
    this.item.GeneralGarnishGroups = dropEmptyGarnishGroups(this.item.GeneralGarnishGroups);
    this.item.GarnishGroupsBeforePizza = dropEmptyGarnishGroups(this.item.GarnishGroupsBeforePizza);
    this.item.GarnishGroupsAfterPizza = dropEmptyGarnishGroups(this.item.GarnishGroupsAfterPizza);
    
    this.price = this.item.Price;
    this.comments = "";
    if (this.item.SelectedPizzaPriceSize && this.item.SelectedPizzaPriceSize.Price > 0) {
      this.totalPizzaSum = this.item.SelectedPizzaPriceSize.Price;
       if (this.item.SelectedToppings && this.item.SelectedToppings.length > 0) {
         this.item.SelectedToppings.forEach(top => {
          this.totalPizzaSum += top.TotalPrice;
         });
       }
       if (this.item.SelectedGarnishes && this.item.SelectedGarnishes.length > 0) {
        this.item.SelectedGarnishes.forEach(g => {
         this.totalPizzaSum += g.Price;
        });
      } else  if (!this.item.SelectedGarnishes || this.item.SelectedGarnishes == undefined ) {
        this.item.SelectedGarnishes = [];
      }
       
    }
    if (this.isEdit) {
      if (this.item.GeneralGarnishGroups &&  
          this.item.GeneralGarnishGroups.length > 0) {
        this.item.SelectedGarnishes.forEach(g => {
          this.item.GeneralGarnishGroups.forEach(group => {
            group.Garnishes.forEach(gar => {
              if (gar.Id == g.Id) gar.IsSelected = true;
            });   
          });    
        });
      }
    }

  }

  public getLanguage() {
    return this.translationService.language();
  }

  public subAmount(item) {
    if (item.Amount > 1)   {
      item.Amount--;
      this.isOpenInput=false;
    }
  }

  public addAmount(item) {   
    item.Amount++;
    this.isOpenInput=false;
   // item.Price += this.price; 
  }

  public openInput(){
    this.isOpenInput=true;
  }


  logo(event) {
    event.target.src = AppConfig.settings.logo;
  }



  
  public prepareSelectedGarnishes() {
    this.selectedGarnishes = this.commonFunctionsService.deepCopy(this.selectedGarnishes);
  }

  
  public closeAndNotSaveGarnishes() {
    this.showErrorComboMessage = false;
    this.isSaved = false;
    this.bsModalRef.hide();
  }

  public cancelGarnishesAndReturnToThePreviousPage() {

  }

  
  private checkSelectedGarnishesFromGarnishGroup(garnishGroup) {
    if (garnishGroup) {
      //console.log("garnishGroup",garnishGroup);
      
      const selectedGarnishes =
        (garnishGroup.Garnishes || []).filter((garnish: GarnishAppAdvancedModel) => {
          return garnish.IsSelected;
        });
      //console.log("selectedGarnishes", selectedGarnishes);

      const selectedGarnishesSum = selectedGarnishes.reduce((sum, item) => {
        sum += item.SelectedAmount || 1;
        return sum;
      }, 0);
      this.totalGarnishsSum = selectedGarnishes.reduce((sum, item) => {
        sum += item.SelectedAmount || 1;
        return sum;
      }, 0);
      //("this.totalGarnishsSum", selectedGarnishesSum);
      //console.log("selectedGarnishesSum", selectedGarnishesSum);

      if (
        selectedGarnishesSum <= garnishGroup.Max) {
        //console.log("6")
        return true;
      }
      else if (garnishGroup.Max == 0 && garnishGroup.Min == 0) return true;
      else if (selectedGarnishesSum >= garnishGroup.Min && garnishGroup.Max == 0) return true;
      else {
        //console.log("else false");
        return false;
      }

      
    } else {
      //console.log("false");
      return false;
    }
  }

  private checkSelectedGarnishesFromGarnishGroupForSave(garnishGroup) {
    if (garnishGroup) {
      const selectedGarnishes =
        (garnishGroup.Garnishes || []).filter((garnish: GarnishAppAdvancedModel) => {
          return garnish.IsSelected;
        });

      const selectedGarnishesSum = selectedGarnishes.reduce((sum, item) => {
        sum += item.SelectedAmount || 1;
        return sum;
      }, 0);
       

      if (selectedGarnishesSum == garnishGroup.Max ) { //for g.max = 1 && g.min = 1
        console.log("NO-ERROR");
        return true;
      }
      else if (garnishGroup.Max == 0 && garnishGroup.Min == 0){
        console.log("true1");
         return true;
      }
      else if (selectedGarnishesSum >= garnishGroup.Min && garnishGroup.Max == 0){
        console.log("true2");
         return true;
      }
      else if ( garnishGroup.Min < garnishGroup.Max){
        console.log("?????????????")
         if (selectedGarnishesSum >= garnishGroup.Min || garnishGroup.Min == 0){
            console.log("true3");
          return true;
          }
        
          return false;
      }
      else {
        console.log("ERROR");
        return false;
      }


    }
    
    else {
      console.log("false");
      return false;
    }
  }


  private displayMessageByTime() {
    setTimeout(() => {
      this.showErrorGarnishMessage = false;
    }, this.timeToDisplayImage)
  }

  public close() {
    this.showErrorComboMessage = false;
    this.isSaved = false;
    this.bsModalRef.hide();
  }

  public checkFreeCountLimit(garnishGroup) {
    if (garnishGroup) {
      const selectedGarnishes =
        (garnishGroup.Garnishes || []).filter((garnish: GarnishAppAdvancedModel) => {
          return garnish.IsSelected;
        });
      const selectedGarnishesSum = selectedGarnishes.reduce((sum, item) => {
        sum += item.SelectedAmount || 1;
        return sum;
      }, 0);

      if (selectedGarnishesSum >= garnishGroup.FreeCount) {
        return true;
      } else {
        return false;
      }
    }
  }

  public  flag: boolean = true;

  public save() {

    const modalElement = document.getElementsByClassName('modal-dialog-item-with-garnishes');
    console.log("savee!!!!");

    var stop: boolean = false; // find first group with unselected garnishes, which should be selected
    var counter : number = 0; // check all groups for right selection

    if (this.showBeforePizzaGarnishes && this.item.GarnishGroupsBeforePizza) {
      console.log("GarnishGroupsBeforePizza");
      this.item.GarnishGroupsBeforePizza.forEach(ggroup => {
        if (!stop) {
          //console.log("ggroup", ggroup);
          if (!this.checkSelectedGarnishesFromGarnishGroupForSave(ggroup)) {           
            this.showErrorGarnishMessage = true;
            stop = true;
            this.displayErrorGarnishMessage(ggroup);
            this.displayMessageByTime();            
          }
          else counter++;
        }        
      });
      if(counter == this.item.GarnishGroupsBeforePizza.length){
        //console.log("check5");
        this.item.GarnishGroupsBeforePizza.forEach(ggroup => {
          ggroup.Garnishes.forEach(gar => {
            if (gar.IsSelected)
              this.selectedGarnishes.push(gar);
          });  
        });
        this.isSaved = true;
        this.item.SelectedGarnishes = this.selectedGarnishes;

        if(modalElement){
          modalElement[0].classList.add('animate__animated', 'animate__bounceOutLeft');
        }
        this.bsModalRef.hide();
      }

    } else if (this.item.GarnishGroupsAfterPizza && !this.isEdit) {
      console.log("GarnishGroupsAfterPizza");
      this.item.GarnishGroupsAfterPizza.forEach(ggroup => {
        if (!stop) {
          //console.log("ggroup", ggroup);
          if (!this.checkSelectedGarnishesFromGarnishGroupForSave(ggroup)) {           
            this.showErrorGarnishMessage = true;
            stop = true;
            this.displayErrorGarnishMessage(ggroup);
            this.displayMessageByTime();            
          }
          else counter++;
        }        
      });
      if(counter == this.item.GarnishGroupsAfterPizza.length){
        //console.log("check5");
        this.item.GarnishGroupsAfterPizza.forEach(ggroup => {
          ggroup.Garnishes.forEach(gar => {
            if (gar.IsSelected){
              this.selectedGarnishes.push(gar);
              this.item.SelectedGarnishes.push(gar);
            }
             
          });  
        });
        this.isSaved = true;
      //  this.item.SelectedGarnishes = this.selectedGarnishes;

        if(modalElement){
          modalElement[0].classList.add('animate__animated', 'animate__bounceOutLeft');
        }
        this.bsModalRef.hide();
      }
      
    } else if(this.item.GarnishGroups){

      this.item.GarnishGroups.forEach(ggroup => {
        if (!stop) {
          if (!this.checkSelectedGarnishesFromGarnishGroupForSave(ggroup)) {
            console.log("NO GARNISHES SELECTED - group");
            this.showErrorGarnishMessage = true;
            //counter++;
            stop = true;
            this.displayErrorGarnishMessage(ggroup);
            this.displayMessageByTime();
            //console.log("check1");
            return;
            
          }
          else {
             counter++;
             //console.log("check2");
          }

        }
        
      });
      if(counter == this.item.GarnishGroups.length){
        //console.log("check3");
        this.item.GarnishGroups.forEach(ggroup => {
          //console.log("ggroup-save", ggroup);
          ggroup.Garnishes.forEach(gar => {
            if (gar.IsSelected)
              this.selectedGarnishes.push(gar);
              //console.log("check4");
          });
  
        });
        //console.log("this.selectedGarnishes-save()", this.selectedGarnishes);
        this.isSaved = true;
        this.item.SelectedGarnishes = this.selectedGarnishes;
        console.log("1111");

        if(modalElement){
          modalElement[0].classList.add('animate__animated', 'animate__bounceOutLeft');
        }
        this.bsModalRef.hide();
      }
    }
    else if(this.item.GeneralGarnishGroups){
      console.log("item has general groups");
      this.item.GeneralGarnishGroups.forEach(ggroup => {
        if (!stop) {
          //console.log("ggroup", ggroup);
          if (!this.checkSelectedGarnishesFromGarnishGroupForSave(ggroup)) {
            //console.log("NO GARNISHES SELECTED - group");
            this.showErrorGarnishMessage = true;
            //counter++;
            stop = true;
            this.displayErrorGarnishMessage(ggroup);
            this.displayMessageByTime();
            
          }
          else counter++;

        }
        
      });
      if(counter == this.item.GeneralGarnishGroups.length){
        //console.log("check5");
        this.item.GeneralGarnishGroups.forEach(ggroup => {
          //console.log("ggroup-save", ggroup);
          ggroup.Garnishes.forEach(gar => {
            if (gar.IsSelected)
              this.selectedGarnishes.push(gar);
          });
  
        });
        //console.log("this.selectedGarnishes-save()", this.selectedGarnishes);
        this.isSaved = true;
        this.item.SelectedGarnishes = this.selectedGarnishes;

        if(modalElement){
          modalElement[0].classList.add('animate__animated', 'animate__bounceOutLeft');
        }
        this.bsModalRef.hide();
      }

    }
    
  }

  
  public saveItemWithGarnishes() {
    this.showErrorComboMessage = false;
    this.isSaved = true;
    this.bsModalRef.hide();
  }

  private initializeSettings() {
    this.lang = this.translationService.language();
    this.cashSymbol = AppConfig.cashSymbol;
    this.colors.menuColor = AppConfig.settings.menuColor;
    this.colors.buttonColor = AppConfig.settings.buttonColor;
  }



  private selectedItems(garnishes) {
    return garnishes.slice().filter((garnish) => {
      return garnish && garnish.IsSelected;
    })
  }

  private handleGarnishMultiSelect(gar: GarnishAppAdvancedModel, garnishGroup? : GarnishGroupAppModel) {
    console.log("handleGarnishMultiSelect");
    


    if (!gar) return;
    if (((gar.IsSelected && gar.SelectedAmount == gar.MaxAmount) || (gar.IsSelected && !gar.MaxAmount))) {
      console.log("21");
      gar.IsSelected = false;
      gar.SelectedAmount = 0;
      return;
    }
    //no special logic //maxAmount=null(1)
    if (!gar.MaxAmount) {
      console.log("3")
      gar.IsSelected = true;
      gar.SelectedAmount = 1;
      //console.log("gar", gar);
      //console.log("gar.isselected", gar.IsSelected);
      //console.log("gar.amount", gar.SelectedAmount);
      return;
    }

    //first time select
    if (!gar.SelectedAmount || gar.SelectedAmount == 0) {
      console.log("4");
      gar.SelectedAmount = 1;
      gar.IsSelected = true;
      return;
    }

    //selected more then allowed:
    if (gar.SelectedAmount == gar.MaxAmount) {
      console.log("5");
      gar.SelectedAmount = 0;
      gar.IsSelected = false;
    }
    //more selection available:
    else {
      console.log("else");
      gar.IsSelected = true;
      gar.SelectedAmount++;
    }
  }

  private deselectGarnishesOfGarnishGroup(garnishes) {
    if (garnishes) {
      garnishes.forEach((garnish) => {
        if (garnish) {
          garnish.IsSelected = false;
          garnish.SelectedAmount = 0;
          garnish.Amount = 0;
        }
      })
    }
  }

  public deselectGarnishAmount(garnish: GarnishAppAdvancedModel, garnishGroup: GarnishGroupAppModel) {
    //console.log("deselectGarnishAmount", garnish);
    if (garnish) { 
      garnish.SelectedAmount = garnish.SelectedAmount - 1;
      this.totalGarnishsSum = this.totalGarnishsSum - 1;
      if (garnish.SelectedAmount == 0) garnish.IsSelected = false;
      
    }

  }
  public selectGarnish(item: GarnishAppAdvancedModel, garnishGroup: GarnishGroupAppModel) {
    if (item) {

      this.showErrorGarnishMessage = false;
      if (garnishGroup) {
        const selectedItemsLength = this.selectedItems(garnishGroup.Garnishes).length;

        if (!item.IsSelected && (garnishGroup.Max === 1 &&
          garnishGroup.Min <= garnishGroup.Max) &&
          selectedItemsLength >= garnishGroup.Max) {
          //console.log("1")
          this.deselectGarnishesOfGarnishGroup(garnishGroup.Garnishes);
        }
        else if (!item.IsSelected && garnishGroup.Max !== 0 &&
          (selectedItemsLength >= garnishGroup.Max)) { 
          console.log("return");
          return;
        }
        console.log("2");
        this.handleGarnishMultiSelect(item, garnishGroup);
        if (selectedItemsLength < garnishGroup.Max) {
          //console.log("this.tempSelectedGarnishes", this.tempSelectedGarnishes);
        }
        if (!this.checkSelectedGarnishesFromGarnishGroup(garnishGroup)) {
          console.log("5")
          this.showErrorGarnishMessage = true;
          this.displayErrorGarnishMessage(garnishGroup);
          this.displayMessageByTime();
          //console.log("chekAmount1", item.SelectedAmount);

          //console.log("chekAmount2", item.SelectedAmount);
          if(item.IsSelected && item.SelectedAmount ==1){
            console.log("==1");
            item.IsSelected = false;
            item.SelectedAmount = 0;
          }
          else{
            console.log("more than 1");
            item.SelectedAmount = item.SelectedAmount - 1;
          }
          return;
        }
      }
      else {
        this.handleGarnishMultiSelect(item);
        //console.log("if !this.garnihGroup");
      }
    }
  }

  

  

  

  public deselectMultipleGarnish(garnish, event) {
    if (garnish && garnish.MaxAmount) {
      if (event) {
        event.stopPropagation();
        garnish.SelectedAmount = 0;
        garnish.Selected = false;
      }
    }
  }

  public displayErrorGarnishMessage(garnishGroup) {
    if (garnishGroup) {
      let minMaxText = "";
      if (garnishGroup.Min) {
        minMaxText =
          this.translationService.translate("GARNISHES_ERROR_GARNISH_START") +
          garnishGroup.Min +
          this.translationService.translate("GARNISHES_ERROR_GARNISH_END");
      }
      if (garnishGroup.Min == 1 && garnishGroup.Max == 1) {
        //console.log("Masha")
        minMaxText = this.translationService.translate("GARNISHES_ERROR_SELECT_ONE")
      }
      if (garnishGroup.Min > 0 && garnishGroup.Min != garnishGroup.Max &&
        garnishGroup.Min <= garnishGroup.Max) {
        minMaxText = this.translationService.translate("GARNISHES_ERROR_GARNISH_TILL") + " " +
          garnishGroup.Max + " " +
          this.translationService.translate("GARNISHES_ERROR_GARNISH_MAX") + " " +
          "(" + this.translationService.translate("GARNISHES_ERROR_GARNISH_MINIMUM") + " " +
          garnishGroup.Min + ")"
          
      }

      else if (garnishGroup.Min == 0 &&
        garnishGroup.Min <= garnishGroup.Max) {
          console.log("2");
        minMaxText = this.translationService.translate("GARNISHES_ERROR_GARNISH_MAXERR") + " " +
          garnishGroup.Max +
          this.translationService.translate("GARNISHES_ERROR_GARNISHES");
      }
      else if (garnishGroup.Min != garnishGroup.Max &&
        garnishGroup.Min > garnishGroup.Max) {
          console.log("3");
        minMaxText = (garnishGroup.Garnishes && garnishGroup.Garnishes.length > garnishGroup.Min ?
          this.translationService.translate("GARNISHES_ERROR_GARNISH_MIN") :
          this.translationService.translate("GARNISHES_ERROR_SELECT"))
          + " " +
          garnishGroup.Min + this.translationService.translate("GARNISHES_ERROR_GARNISHES");
      } else if (garnishGroup.Min == garnishGroup.Max && garnishGroup.Max != 0 && garnishGroup.Min != 1) {
        minMaxText = this.translationService.translate("GARNISHES_ERROR_SELECT") + " " +
          garnishGroup.Max + " " +
          this.translationService.translate("GARNISHES_ERROR_GARNISHES");
      }
      const errorMessage = "" + minMaxText;
      //console.log("errorMessage", errorMessage);
      this.errorMessage = errorMessage + " " + "ב" + garnishGroup.Name;
      return errorMessage;
    }
    this.errorMessage = "";
    return "";
  }

  public displayRequires(garnishGroup){
    if (garnishGroup) {
      let minMaxText = "";
      if (garnishGroup.Min) {
        minMaxText =
          this.translationService.translate("GARNISHES_ERROR_GARNISH_START") +
          garnishGroup.Min +
          this.translationService.translate("GARNISHES_ERROR_GARNISH_END");
      }
      if (garnishGroup.Min == 1 && garnishGroup.Max == 1) {
        //console.log("Masha")
        minMaxText = this.translationService.translate("GARNISHES_ERROR_SELECT_ONE")
      }
      if (garnishGroup.Min > 0 && garnishGroup.Min != garnishGroup.Max &&
        garnishGroup.Min <= garnishGroup.Max) {
        minMaxText = this.translationService.translate("GARNISHES_ERROR_GARNISH_TILL") + " " +
          garnishGroup.Max + " " +
          this.translationService.translate("GARNISHES_ERROR_GARNISH_MAX") + " " +
          "(" + this.translationService.translate("GARNISHES_ERROR_GARNISH_MINIMUM") + " " +
          garnishGroup.Min + ")"
      }
      else if (garnishGroup.Min == 0 &&
        garnishGroup.Min <= garnishGroup.Max && garnishGroup.Max == 100) {
          console.log("1");
        minMaxText = "";
      } 
      else if (garnishGroup.Min == 0 &&
        garnishGroup.Min <= garnishGroup.Max && garnishGroup.Max != 100) {
        minMaxText = this.translationService.translate("GARNISHES_ERROR_GARNISH_MAXERR") + " " +
          garnishGroup.Max +
          this.translationService.translate("GARNISHES_ERROR_GARNISHES");
      }
      else if (garnishGroup.Min != garnishGroup.Max &&
        garnishGroup.Min > garnishGroup.Max) {
        minMaxText = (garnishGroup.Garnishes && garnishGroup.Garnishes.length > garnishGroup.Min ?
          this.translationService.translate("GARNISHES_ERROR_GARNISH_MIN") :
          this.translationService.translate("GARNISHES_ERROR_SELECT"))
          + " " +
          garnishGroup.Min + this.translationService.translate("GARNISHES_ERROR_GARNISHES");
      } else if (garnishGroup.Min == garnishGroup.Max && garnishGroup.Max != 0 && garnishGroup.Min != 1) {
        minMaxText = this.translationService.translate("GARNISHES_ERROR_SELECT") + " " +
          garnishGroup.Max + " " +
          this.translationService.translate("GARNISHES_ERROR_GARNISHES");
      }

      if (garnishGroup.Min == 0 && garnishGroup.Max == 100) {
          console.log("1");
        minMaxText = "";
      } 
      const errorMessage = "" + minMaxText;
      //console.log("errorMessage", errorMessage);
      //this.errorMessage = errorMessage + " " + "ב" + garnishGroup.Name;
      return errorMessage;
    }
    this.errorMessage = "";
    return "";
  }





}
