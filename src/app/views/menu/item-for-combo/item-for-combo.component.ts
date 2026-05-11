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
  selector: 'item-for-combo',
  templateUrl: './item-for-combo.component.html',
  styleUrls: ['./item-for-combo.component.scss']
})
export class ItemForComboComponent implements OnInit {

  public lang: string;
  public cashSymbol: string;

  public toppings: ToppingAppAdvancedModel[] = [];

  public comments: string;

  public combo: ComboAppAdvancedModel;
  public item: ItemAppAdvancedModel;
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

  private timeToDisplayImage = 10000;

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

  public errorMessage: string;
  activeModal: any;

  public isOpenInput: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ItemForComboComponent>,
    private modalService: BsModalService,
    private translationService: TranslationsService,
    public dialog: MatDialog,
    public commonFunctionService: CommonFunctionsService,
    protected browserIdentificatorService: BrowserIdentificatorService,
    private commonFunctionsService: CommonFunctionsService,
    private matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
    
  ) {
    //this.totalGarnishsSum = 0;
    if (this.data) {
      console.log("Constructor");
      this.item = data.item;
      if (this.data.showBeforePizzaGarnishes)
        this.showBeforePizzaGarnishes = data.showBeforePizzaGarnishes;
    }
  }



  ngOnInit() {
    console.log("NG-OnINit");
    if(this.item.GarnishGroups && this.item.GarnishGroups.length>0){

      this.item.GarnishGroups.forEach(gGroup => {
        if(gGroup.Max == 0){
          gGroup.Max = 100;
        } 
        
      });
    }
    else if(this.item.GeneralGarnishGroups && this.item.GeneralGarnishGroups.length>0){
      this.item.GeneralGarnishGroups.forEach(gGroup => {
        gGroup.Garnishes.forEach(gar => {
          gar.GarnishGroupId = gGroup.Id;
          
        });
        if(gGroup.Max == 0){
          gGroup.Max = 100;
        } 
        
      });
    }
    this.initializeSettings();
    this.item = this.commonFunctionService.deepCopy(this.item);
    this.item.Amount = 1;
    this.price = this.item.Price;
    this.comments = "";

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



  /*private prepareGarnishGroupsToUse() {

    this.item.GarnishGroups.forEach((grp) => {
      const g = new gGroup();
      g.garnishGroup = this.commonFunctionsService.deepCopy(grp);
      g.isRequired = grp.Min > 0;
      g.isEnabled = true;
      g.hasError = false;
      g.errorMessage = "";
      this.groups.push(g);
    });

    this.groups[0].isExpanded = true;
    for (let i = 0; i < this.groups.length; i++) {
      this.groups[i].index = i;
      console.log("---------prepareGarnishGroupsToUse.item.GarnishGroups.length", this.groups.length);
      if (this.groups[i].isRequired) {
        for (let j = i + 1; j < this.groups.length; j++) {
          this.groups[j].isEnabled = false
        }
      }

    }
    console.log("---------prepareGarnishGroupsToUse groups", this.groups);


  }*/

  public prepareSelectedGarnishes() {
    this.selectedGarnishes = this.commonFunctionsService.deepCopy(this.selectedGarnishes);
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

  private prepareGarnishesToUse() { /*
    if (this.garnishes && Array.isArray(this.garnishes)) {
      this.garnishes = this.garnishes.slice();
      this.garnishes = this.garnishes.map((garnish) => {
        garnish.Selected = this.selectedGarnishes.some((selectedGarnish: AdvGarnishAppModel) => {
          return selectedGarnish.Id === garnish.Id;
        });
        const selectedGarnish = this.selectedGarnishes.find((selectedGarnish: AdvGarnishAppModel) => {
          return selectedGarnish.Id === garnish.Id;
        });
        if (selectedGarnish) {
          garnish.SelectedAmount = selectedGarnish.SelectedAmount || 0;
        }
        const deepCopyGarnish = this.commonFunctionsService.deepCopy(garnish);
        return deepCopyGarnish;
      });
    } else if (this.garnishGroup) {
      const garnishGrp = new GarnishGroupAppModel();
      garnishGrp.Name = this.garnishGroup.Name;
      garnishGrp.Min = this.garnishGroup.Min;
      garnishGrp.Max = this.garnishGroup.Max;
      garnishGrp.MaxAmount = this.garnishGroup.MaxAmount;
      garnishGrp.FreeCount = this.garnishGroup.FreeCount;
      if (this.garnishGroup.Garnishes &&
        Array.isArray(this.garnishGroup.Garnishes)) {
        garnishGrp.Garnishes = this.garnishGroup.Garnishes.slice().map((garnish: AdvGarnishAppModel) => {
          garnish.Selected = this.selectedGarnishes.some((selectedGarnish: AdvGarnishAppModel) => {
             return selectedGarnish.Id === garnish.Id;
          });
          const selectedGarnish = this.selectedGarnishes.find((selectedGarnish: AdvGarnishAppModel) => {
            return selectedGarnish.Id === garnish.Id;
          });
          if (selectedGarnish) {
            garnish.SelectedAmount = selectedGarnish.SelectedAmount || 0;
          }
          const deepCopyGarnish = this.commonFunctionsService.deepCopy(garnish);
          return deepCopyGarnish;
        });
      }
      const deepCopyGarnish = this.commonFunctionsService.deepCopy(garnishGrp);
      this.garnishGroup = deepCopyGarnish;
    }*/
  }

  public closeAndNotSaveGarnishes() {
    /*  this.activeModal.close({
        selectedGarnishes: [],
        comments: "",
        isSaved: false
      });*/


    this.showErrorComboMessage = false;
    this.isSaved = false;
    //this.bsModalRef.hide();
  }

  public cancelGarnishesAndReturnToThePreviousPage() {

  }

  

  private checkSelectedGarnishesFromGarnishGroup(garnishGroup) {
    if (garnishGroup) {
      
      const selectedGarnishes =
        (garnishGroup.Garnishes || []).filter((garnish: GarnishAppAdvancedModel) => {
          return garnish.IsSelected;
        });

      const selectedGarnishesSum = selectedGarnishes.reduce((sum, item) => {
        sum += item.SelectedAmount || 1;
        return sum;
      }, 0);
      this.totalGarnishsSum = selectedGarnishes.reduce((sum, item) => {
        sum += item.SelectedAmount || 1;
        return sum;
      }, 0);

      if (
        selectedGarnishesSum <= garnishGroup.Max) {
        console.log("6")
        return true;
      }
      else if (garnishGroup.Max == 0 && garnishGroup.Min == 0) return true;
      else if (selectedGarnishesSum >= garnishGroup.Min && garnishGroup.Max == 0) return true;
      else {
        console.log("else false");
        return false;
      }

      /* return ((selectedGarnishesSum >= this.garnishGroup.Min &&
         selectedGarnishesSum <= this.garnishGroup.Max) ||
         (selectedGarnishesSum >= this.garnishGroup.Min &&
           this.garnishGroup.Min > this.garnishGroup.Max)) ||
         (this.garnishGroup.Max == 0 && this.garnishGroup.Min == 0);*/


      /*(selectedGarnishes && (selectedGarnishes.length >= this.garnishGroup.Min &&
        selectedGarnishes.length <= this.garnishGroup.Max) ||
        (selectedGarnishes.length >= this.garnishGroup.Min &&
          this.garnishGroup.Min > this.garnishGroup.Max)) ||
        (this.garnishGroup.Max == 0 && this.garnishGroup.Min == 0);*/
    } else {
      console.log("false");
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
      /*this.totalGarnishsSum = selectedGarnishes.reduce((sum, item) => {
        sum += item.SelectedAmount || 1;
        return sum;
      }, 0);*/
      //console.log("this.totalGarnishsSum", selectedGarnishesSum);

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

  /*private removeUnavailableSelections(selectedGarnishes, garnishGroup) {

    const selectedCurrentGarnishes = this.selectedGarnishes.filter((grn) => {
      return garnishGroup &&
        garnishGroup.Garnishes[0] ?
        grn.GarnishGroupId === garnishGroup.Garnishes[0].GarnishGroupId : !grn.GarnishGroupId;
    });

    if (selectedCurrentGarnishes) {
      selectedCurrentGarnishes.forEach((selectedCurrGrn) => {
        this.selectedGarnishes.splice(this.selectedGarnishes.indexOf(selectedCurrGrn), 1);
      })
    }

    this.selectedGarnishes = this.selectedGarnishes.concat(selectedGarnishes.filter((selectedGarnish) => {
      return this.selectedGarnishes.every((selectGrn) => {
        return selectGrn && selectGrn.Id != selectedGarnish.Id;
      });
    }).slice()).filter((garnish) => {
      return (!garnish.GarnishGroupId && garnish.IsSelected) ||
        (garnish.GarnishGroupId && garnishGroup && garnishGroup.Garnishes[0] && garnishGroup.Garnishes[0].GarnishGroupId != garnish.GarnishGroupId) ||
        (garnish.GarnishGroupId && garnish.IsSelected)
    });
  }*/

  private displayMessageByTime() {
    setTimeout(() => {
      this.showErrorGarnishMessage = false;
    }, this.timeToDisplayImage)
  }

  public close() {
    this.showErrorComboMessage = false;
    this.isSaved = false;
    //this.bsModalRef.hide();
    this.dialogRef.close({
      selectedGarnishes: [],
      isSaved: false,
    });
  }


  public  flag: boolean = true;

   
  public save() {

    var stop: boolean = false;
    var counter : number = 0;
    console.log("save");
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

        this.dialogRef.close({
          item: this.item,
          isSaved: true,
        });
      }

    } else if (this.item.GarnishGroupsAfterPizza) {
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
        console.log("counter == this.item.GarnishGroupsAfterPizza.length");
        //console.log("check5");
        if (this.item.SelectedGarnishes == undefined || this.item.SelectedGarnishes == null)
        this.item.SelectedGarnishes = [];
        this.item.GarnishGroupsAfterPizza.forEach(ggroup => {
          ggroup.Garnishes.forEach(gar => {
            if (gar.IsSelected){
              this.selectedGarnishes.push(gar);
              this.item.SelectedGarnishes.push(gar);
            }
             
          });  
        });
        this.isSaved = true;
        console.log(" this.dialogRef.close({");
      //  this.item.SelectedGarnishes = this.selectedGarnishes;
        this.dialogRef.close({
          item: this.item,
          isSaved: true,
        });
      }
      
    } else if(this.item.GarnishGroups && this.item.GarnishGroups.length > 0){

      this.item.GarnishGroups.forEach(ggroup => {
        if (!stop) {
          if (!this.checkSelectedGarnishesFromGarnishGroupForSave(ggroup)) {
            console.log("NO GARNISHES SELECTED - group");
            this.showErrorGarnishMessage = true;
            //counter++;
            stop = true;
            this.displayErrorGarnishMessage(ggroup);
            this.displayMessageByTime();
            
          }
          else counter++;

        }
        
      });
      if(counter == this.item.GarnishGroups.length){
        this.item.GarnishGroups.forEach(ggroup => {
          ggroup.Garnishes.forEach(gar => {
            if (gar.IsSelected)
              this.selectedGarnishes.push(gar);
          });
  
        });
        this.isSaved = true;
        this.item.SelectedGarnishes = this.selectedGarnishes;
  
        //this.bsModalRef.hide();
        this.dialogRef.close({
          item: this.item,
          isSaved: true,
          comments: this.itemComments
        });
      }
    }
    else if(this.item.GeneralGarnishGroups && this.item.GeneralGarnishGroups.length > 0 && (!this.item.GarnishGroups || this.item.GarnishGroups.length == 0)){
      console.log("item has general groups");
      this.item.GeneralGarnishGroups.forEach(ggroup => {
        if (!stop) {
          if (!this.checkSelectedGarnishesFromGarnishGroupForSave(ggroup)) {
            console.log("NO GARNISHES SELECTED - group");
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
        this.item.GeneralGarnishGroups.forEach(ggroup => {
          ggroup.Garnishes.forEach(gar => {
            if (gar.IsSelected)
              this.selectedGarnishes.push(gar);
          });
  
        });
        this.isSaved = true;
        this.item.SelectedGarnishes = this.selectedGarnishes;
  
        //this.bsModalRef.hide();
        this.dialogRef.close({
          item: this.item,
          isSaved: true,
          comments: this.itemComments
        });
      }

    }
    
  }

  
  public saveItemWithGarnishes() {
    this.showErrorComboMessage = false;
    this.isSaved = true;
    //this.bsModalRef.hide();
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

  private handleGarnishMultiSelect(gar: GarnishAppAdvancedModel) {
    if (!gar) return;
    if (((gar.IsSelected && gar.SelectedAmount == gar.MaxAmount) || (gar.IsSelected && !gar.MaxAmount))) {
      gar.IsSelected = false;
      gar.SelectedAmount = 0;
      return;
    }
    //no special logic //maxAmount=null(1)
    if (!gar.MaxAmount) {
      console.log("3")
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

  private deselectGarnishesOfGarnishGroup(garnishes) {
    console.log("deselect????")
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
    if (garnish) { 
      garnish.SelectedAmount = garnish.SelectedAmount - 1;
      this.totalGarnishsSum = this.totalGarnishsSum - 1;
      if (garnish.SelectedAmount == 0) garnish.IsSelected = false;
      
    }

  }
  public selectGarnish(item: GarnishAppAdvancedModel, garnishGroup: GarnishGroupAppModel) {
    if (item) {

      console.log("selectGarnish()");
      this.showErrorGarnishMessage = false;
      if (garnishGroup) {
        const selectedItemsLength = this.selectedItems(garnishGroup.Garnishes).length;

        if (!item.IsSelected && (garnishGroup.Max === 1 &&
          garnishGroup.Min <= garnishGroup.Max) &&
          selectedItemsLength >= garnishGroup.Max) {
          console.log("1")
          this.deselectGarnishesOfGarnishGroup(garnishGroup.Garnishes);
        }
        else if (!item.IsSelected && garnishGroup.Max !== 0 &&
          (selectedItemsLength >= garnishGroup.Max)) { //  ||  selectedItemsLength < this.garnishGroup.MaxAmount
          return;
        }
        console.log("2")
        this.handleGarnishMultiSelect(item);
        if (selectedItemsLength < garnishGroup.Max) {
        }
        if (!this.checkSelectedGarnishesFromGarnishGroup(garnishGroup)) {
          console.log("5")
          this.showErrorGarnishMessage = true;
          this.displayErrorGarnishMessage(garnishGroup);
          this.displayMessageByTime();
          item.SelectedAmount = item.SelectedAmount - 1;
          return;
        }
      }
      else {
        this.handleGarnishMultiSelect(item);
        console.log("if !this.garnihGroup");
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
        console.log("Masha")
        minMaxText = this.translationService.translate("GARNISHES_ERROR_SELECT_ONE")
      }
      if (garnishGroup.Min > 0 && garnishGroup.Min != garnishGroup.Max &&
        garnishGroup.Min <= garnishGroup.Max) {
        minMaxText = this.translationService.translate("GARNISHES_ERROR_GARNISH_TILL") + " " +
          garnishGroup.Max + " " +
          this.translationService.translate("GARNISHES_ERROR_GARNISH_MAX") + " " +
          "(" + this.translationService.translate("GARNISHES_ERROR_GARNISH_MINIMUM") + " " +
          garnishGroup.Min + ")"
      } else if (garnishGroup.Min == 0 &&
        garnishGroup.Min <= garnishGroup.Max) {
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
      const errorMessage = "" + minMaxText;
      this.errorMessage = errorMessage + " " + "ב" + garnishGroup.Name;
      return errorMessage;
    }
    this.errorMessage = "";
    return "";
  }





}
