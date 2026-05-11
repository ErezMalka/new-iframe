import { Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { TranslationsService } from "../../../shared/translations/translations.service";
import { GarnishGroupAppModel } from "../../../models/menu/garnish-group-app.model";
import { AppConfig } from "../../../app.config";
import { GarnishAppAdvancedModel } from "../../../models/advanced/menu/garnish-app-advanced.model";
import { CommonFunctionsService } from "../../../core/services/common-settings/common-functions.service";
import { BrowserIdentificatorService } from "../../../core/services/common-settings/browser-identificator.service";
import { NgScrollbar } from "ngx-scrollbar";
import { SizeMobileInitializationComponent } from '../../../shared/classes/size-mobile-initialization.component';
import { MatDialog } from "@angular/material/dialog";
import { ItemCommentsComponent } from "../item-comments/item-comments.component";
import { ThrowStmt } from '@angular/compiler';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

interface Garnishes {
  refresh: any;
  refreshItemSum: any;
  isEdit: any;
  isPizza: any;
  garnishGroup: GarnishGroupAppModel;
  garnishes: GarnishAppAdvancedModel[];
  comments: string;
  selectedGarnishes: GarnishAppAdvancedModel[];
  isFirstPage: boolean;
  isCombo: boolean;
  item: any;
  isMenu: boolean;
  selectedGarnishesPrice: number;
  hideImage:boolean;
  
}

@Component({
  selector: 'garnishes',
  templateUrl: './garnishes.component.html',
  styleUrls: ['./garnishes.component.scss']
})
export class GarnishesComponent extends SizeMobileInitializationComponent implements OnInit {

  public lang: string;
  public garnishes: GarnishAppAdvancedModel[];
  public garnishGroup: GarnishGroupAppModel;
  public cashSymbol: string;
  public comments: string;
  public prevComments: string;
  public hideImage:boolean =false;

  public showErrorGarnishMessage = false;
  private selectedGarnishes: GarnishAppAdvancedModel[];
  public isFirstPage: boolean;
  // For scrollbar:
  public disabled = this.isMobileBrowser() && this.isMobileMode();
  public shown: 'native' | 'hover' | 'always' = 'native';
  private timeToDisplayImage = 5000;
  public totalGarnishsSum = 0;
  public item: any;
  public isMenu: boolean = false;

  public isSticky: boolean = false;

  public selectedGarnishesPerGroup: GarnishAppAdvancedModel[] = [];
  public priceWithNotFreeGarnishes: number =0;
  public itemPriceWithNotFreeGarnishes: number;

  //public totalNotFreeGarFrom: number;
  ///public totalNotFreeGarForward: number;

  //public refreshItemSum: boolean = false;

  

  



  public graphics = {
    logo: '',
    cover: '',
  };
  public colors = {
    menuColor: '',
    buttonColor: ''
  };

  @ViewChild(NgScrollbar) itemsAreaScrollbar: NgScrollbar;
  private timeOutForScrollUpdate: number = 200;
  imgSrc: string;
  isPizza: any;
  errorMessage: string;

  constructor(
    private translationService: TranslationsService,
    public dialogRef: MatDialogRef<GarnishesComponent>,
    public dialog: MatDialog,
    public commonFunctionsService: CommonFunctionsService,
    protected browserIdentificatorService: BrowserIdentificatorService,
    @Inject(MAT_DIALOG_DATA) public data: Garnishes
  ) {
    super(browserIdentificatorService);
    if (this.data) {
      //console.log("data.selectedGarnishesPrice",data.selectedGarnishesPrice)
      
      console.log("CONSTRUCTOR");
      //console.log(" this.totalNotFreeGarFrom", this.totalNotFreeGarFrom); ////////////////
      this.totalGarnishsSum = 0;
      if(this.data.item){
      this.item = data.item;
      if (data.hideImage) this.hideImage = true;
      }     
      /*if(data.refresh){
        this.refreshItemSum = data.refresh;
        console.log("this.refreshItemSum",this.refreshItemSum);
      }*/

      if(this.data.isPizza) this.isPizza = this.data.isPizza;
      //console.log("this.isPizza", this.isPizza);
      this.isMenu = data.isMenu;


      //console.log("this.totalGarnishsSum=0", this.totalGarnishsSum);
      this.garnishGroup = this.data.garnishGroup;
      this.garnishes = this.data.garnishes;
      // console.log("garnishGroup.Max", this.garnishGroup.Max);
      if (this.garnishGroup != null && this.garnishGroup != undefined && this.garnishGroup.Max == 0) {
        this.garnishGroup.Max = 100;
      }
      this.comments = this.data.comments || '';
      this.prevComments = this.data.comments || '';
      this.selectedGarnishes = this.data.selectedGarnishes || [];


      this.itemPriceWithNotFreeGarnishes = this.initializePrice();

      /*if(this.refreshItemSum){
        this.itemPriceWithNotFreeGarnishes = this.item.Price;
      }*/
      /*else if(!this.item.PizzaPrices){
        this.calcPrice();
      }
      else{
        this.itemPriceWithNotFreeGarnishes = this.item.Price;
      }*/


      if(this.item.GarnishGroups){
        this.item.GarnishGroups.forEach(gGroup => {
          if(gGroup.Garnishes){
            gGroup.Garnishes.forEach(garnish => {
              this.selectedGarnishes.forEach(selGar => {
                if(garnish.Id == selGar.Id){
                  garnish.IsSelected = true;
                }
              });
            });
          }
        });
      }


      //console.log("this.garnishGroup",this.garnishGroup);
      //console.log("this.selectedGarnishes",this.selectedGarnishes);

      if(this.isPizza){
        this.garnishGroup.Garnishes.forEach(gar => {
          this.selectedGarnishes.forEach(selGar => {
            if(gar.Id == selGar.Id){
              gar.IsSelected = true;
            }
          });
        });
        var currentGarGroup = this.commonFunctionsService.deepCopy(this.garnishGroup);

      }
      if(!this.isPizza){
      //console.log("GARNISHES_CONSTRUCTOR-SelectedGarnishes", this.selectedGarnishes);
      //console.log("this.garnishGroup", this.garnishGroup);
      this.isFirstPage = this.data.isFirstPage;
      this.prepareSelectedGarnishes();
      this.prepareGarnishesToUse();
      }
    }
  }

  public initializePrice(){
    console.log("initializePrice()");
    if(this.selectedGarnishes && this.selectedGarnishes.length>0){
      return this.generalCalc(); //this.item.Price //
    }
    else return this.item.Price;
  }

  public generalCalc(){
    var priceWithSelectedGarnishes:number;
    if (this.item.PizzaPrices && this.item.PizzaPrices.length > 0) {
     // console.log("this.item.PizzaPrices && this.item.PizzaPrices.length > 0",this.item.PizzaPrices);
      if (this.item.SelectedPizzaPriceSize && this.item.SelectedPizzaPriceSize.Price > 0) {
       // console.log("if (this.item.SelectedPizzaPriceSize && this.item.SelectedPizzaPriceSize.Price > 0",this.item.SelectedPizzaPriceSize);
        priceWithSelectedGarnishes = this.item.SelectedPizzaPriceSize.Price;
        if (this.item.SelectedToppings && this.item.SelectedToppings.length > 0) {
          this.item.SelectedToppings.forEach(top => {
            priceWithSelectedGarnishes += top.TotalPrice;
          });
        }
        
      } else {
        priceWithSelectedGarnishes = 0;
      }
    } else {
      priceWithSelectedGarnishes = this.item.Price;
    }
     // priceWithSelectedGarnishes = this.item.Price;
    
   
    ////////////
    const garnishes = [];
    if (this.item.SelectedGarnishes) {
      this.item.SelectedGarnishes.forEach((garnish: GarnishAppAdvancedModel) => {
        const grnNew = this.commonFunctionsService.deepCopy(garnish);
        garnishes.push(grnNew);
        if (garnish.SelectedAmount > 1) {
          for (let i = 0; i < garnish.SelectedAmount - 1; i++) {
            const grn = this.commonFunctionsService.deepCopy(grnNew);
            grn.SelectedAmount = 1;
            garnishes.push(grn);
          }
        }
        grnNew.SelectedAmount = 1;
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
      //console.log("KEY?");
      if (this.item.GarnishGroups) {
        for (let i = 0; i < this.item.GarnishGroups.length; i++) {
          if (this.item.GarnishGroups[i].Garnishes && this.item.GarnishGroups[i].Garnishes[0]
            && this.item.GarnishGroups[i].Garnishes[0].GarnishGroupId === +key && this.item.GarnishGroups[i].FreeCount) {
            garnishesGroup[key].sort((garnish1, garnish2) => {
              return garnish1.Price - garnish2.Price;
            }).map((garnish, index) => {
              if (index < this.item.GarnishGroups[i].FreeCount) {
                garnish.Price = 0;
              }
            });
          }
        }
      }
    });

    garnishes.forEach(gar => {
      priceWithSelectedGarnishes+=gar.Price;
    });

    return priceWithSelectedGarnishes





  /////////////////

    
  }

  private updateScroll() {
    setTimeout(() => {
      this.itemsAreaScrollbar.update();
    }, this.timeOutForScrollUpdate);
  }

  // ngDoCheck(): void {
  //  // this.updateScroll();
  // }

  ngOnInit() {
    this.initializeSettings();
    this.initializeSize();

    //console.log("this.garnishes", this.garnishes);

    //console.log("garnishGroup", this.garnishGroup.Garnishes);

    //window.addEventListener('scroll', this.scroll, true);

  }

  public getLanguage() {
    return this.translationService.language();
  }

  scroll = (event: any): void => {
    // Here scroll is a variable holding the anonymous function 
    // this allows scroll to be assigned to the event during onInit
    // and removed onDestroy
    // To see what changed:
    const number = event.srcElement.scrollTop;
    //console.log(event);
    //console.log('I am scrolling ' + number);
    if (number >= 150) {
      //console.log("window.pageYOffset >= 12")
      document.getElementById("product-details").classList.add("header-not-at-top");
    }
    else {
      document.getElementById("product-details").classList.remove("header-not-at-top");
    }
  };

  ngOnDestroy() {
    //window.removeEventListener('scroll', this.scroll, true);
}

  logo(event) {
  
    event.target.src = AppConfig.settings.logo; 
    //this.imgSrc = AppConfig.settings.logo;
  }




  /*@HostListener('window:scroll', ['$event'])
  public windowScrolled($event: Event) {
    console.log("window:scroll", window.pageYOffset);
    if (window.pageYOffset >= 1) {
      console.log("window.pageYOffset >= 12")
      document.getElementById("product-details").classList.add("header-not-at-top");
    }
    else {
      document.getElementById("product-details").classList.remove("header-not-at-top");
    }
    //  console.log( "window.pageYOffset",window.pageYOffset);
    // console.log( "isSticky",this.isSticky);
    //console.log("scrolled")
  }*/

  // every click on component
  public action() {

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
          if (garnishGroup.Max < 100) {
            minMaxText = this.translationService.translate("GARNISHES_ERROR_GARNISH_TILL") + " " +
            garnishGroup.Max + " " +
            this.translationService.translate("GARNISHES_ERROR_GARNISH_MAX") + " " +
            "(" + this.translationService.translate("GARNISHES_ERROR_GARNISH_MINIMUM") + " " +
            garnishGroup.Min + ")"
          } else {
            minMaxText = this.translationService.translate("GARNISHES_ERROR_GARNISH_MINIMUM") + " " +
            garnishGroup.Min +  this.translationService.translate("GARNISHES_ERROR_GARNISH_MAX")
          }
       
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
      if (garnishGroup.Min == 0 && garnishGroup.Max == 100) {
        console.log("1");
      minMaxText = "";
    } 
      const errorMessage = "" + minMaxText;
      //console.log("errorMessage", errorMessage);
      //this.errorMessage = errorMessage + " " + "?" + garnishGroup.Name;
      return errorMessage;
    }
    this.errorMessage = "";
    return "";
  }

  public isMobileBrowser() {
    return this.browserIdentificatorService.isMobile.Android() ||
      this.browserIdentificatorService.isMobile.Windows() ||
      this.browserIdentificatorService.isMobile.iOS();
  }

  public prepareSelectedGarnishes() {
    //console.log("prepareSelectedGarnishes()- sg",this.selectedGarnishes);
    this.selectedGarnishes = this.commonFunctionsService.deepCopy(this.selectedGarnishes);
    //console.log("prepareSelectedGarnishes() - sg",this.selectedGarnishes);
  }

  private prepareGarnishesToUse() {
    if (this.garnishes && Array.isArray(this.garnishes)) {
      this.garnishes = this.garnishes.slice();
      this.garnishes = this.garnishes.map((garnish) => {
        garnish.IsSelected = this.selectedGarnishes.some((selectedGarnish: GarnishAppAdvancedModel) => {
          return selectedGarnish.Id === garnish.Id;
        });
        const selectedGarnish = this.selectedGarnishes.find((selectedGarnish: GarnishAppAdvancedModel) => {
          return selectedGarnish.Id === garnish.Id;
        });
        if (selectedGarnish) {
          garnish.SelectedAmount = selectedGarnish.SelectedAmount || 0;
        }
        const deepCopyGarnish = this.commonFunctionsService.deepCopy(garnish);
        return deepCopyGarnish;
      });
    } else if (this.garnishGroup) {
      //console.log("this.garnishGroup",this.garnishGroup);
      //console.log("prepareGarnishesToUse() - sg",this.selectedGarnishes);
      const garnishGrp = new GarnishGroupAppModel();
      garnishGrp.Name = this.garnishGroup.Name;
      garnishGrp.Description = this.garnishGroup.Description;
      garnishGrp.Min = this.garnishGroup.Min;
      garnishGrp.Max = this.garnishGroup.Max;
      garnishGrp.MaxAmount = this.garnishGroup.MaxAmount;
      garnishGrp.FreeCount = this.garnishGroup.FreeCount;
      garnishGrp.Id = this.garnishGroup.Id;
      if (this.garnishGroup.Garnishes &&
        Array.isArray(this.garnishGroup.Garnishes)) {
          //console.log("prepareGarnishesToUse() - sg",this.selectedGarnishes);
        //Tanya 26/4/20 
        garnishGrp.Garnishes = this.garnishGroup.Garnishes.sort(function (garnish1, garnish2) {
          //console.log("garnishGrp.Garnishes", garnishGrp.Garnishes)
          return garnish1.Order - garnish2.Order;

        });
        //end of changes
        garnishGrp.Garnishes = this.garnishGroup.Garnishes.slice().map((garnish: GarnishAppAdvancedModel) => {
          garnish.IsSelected = this.selectedGarnishes.some((selectedGarnish: GarnishAppAdvancedModel) => {
            return selectedGarnish.Id === garnish.Id && selectedGarnish.GarnishGroupId === garnish.GarnishGroupId;
          });
          const selectedGarnish = this.selectedGarnishes.find((selectedGarnish: GarnishAppAdvancedModel) => {
            return selectedGarnish.Id === garnish.Id && selectedGarnish.GarnishGroupId === garnish.GarnishGroupId;
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
      //console.log("prepareGarnishesToUse() - sg",this.selectedGarnishes);
    }
  }

  public closeAndNotSaveGarnishes() {
    console.log("closeAndNotSaveGarnishes()");
    this.dialogRef.close({
      selectedGarnishes: [],
      comments: "",
      isSaved: false,
      //selectedGarnishesPrice : this.totalNotFreeGarForward
    });
  }

  public cancelGarnishesAndReturnToThePreviousPage() {

  }

  public checkFreeCountLimit() {
    if (this.garnishGroup) {
      const selectedGarnishes =
        (this.garnishGroup.Garnishes || []).filter((garnish: GarnishAppAdvancedModel) => {
          return garnish.IsSelected;
        });
      const selectedGarnishesSum = selectedGarnishes.reduce((sum, item) => {
        sum += item.SelectedAmount || 1;
        return sum;
      }, 0);

      if (selectedGarnishesSum >= this.garnishGroup.FreeCount) {
        return true;
      } else {
        return false;
      }
    }
  }
  private checkSelectedGarnishesFromGarnishGroup() {
    if (this.garnishGroup) {
      //console.log("garnishGroup", this.garnishGroup);
      const selectedGarnishes =
        (this.garnishGroup.Garnishes || []).filter((garnish: GarnishAppAdvancedModel) => {
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
      //console.log("this.totalGarnishsSum", selectedGarnishesSum);
      //console.log("selectedGarnishesSum", selectedGarnishesSum);

      if (
        selectedGarnishesSum <= this.garnishGroup.Max) return true;
      else if (this.garnishGroup.Max == 0 && this.garnishGroup.Min == 0) return true;
      else if (selectedGarnishesSum >= this.garnishGroup.Min && this.garnishGroup.Max == 0) return true;
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

  public myGars;

  public saveGarnishes(returnToPreviousPage?) {

    const modalElement = document.getElementsByClassName('mat-dialog-container');
    console.log("savee!!!!");


    this.myGars = this.commonFunctionsService.deepCopy(this.selectedGarnishes);
    if (returnToPreviousPage) {
      this.dialogRef.close({
        returnToPreviousPage,
        isSaved: true,
        comments: this.prevComments,
        //selectedGarnishesPrice : this.totalNotFreeGarForward || this.totalNotFreeGarFrom

        
      });
      return;
    }
    if (this.garnishGroup) {
      if (!this.checkSelectedGarnishesFromGarnishGroup2()) {
        this.showErrorGarnishMessage = true;
        this.displayErrorGarnishMessage();
        this.displayMessageByTime();
        return;
      }
    }
    this.showErrorGarnishMessage = false;
    let selectedGarnishes = [];
    if (this.garnishGroup) {
      
      selectedGarnishes = this.garnishGroup.Garnishes.slice()
        .filter((garnish: GarnishAppAdvancedModel) => {
          return garnish && garnish.IsSelected;
        });
    } /*else if (this.garnishes) {
      selectedGarnishes = this.garnishes.slice().filter((garnish) => {
        return garnish && garnish.IsSelected;
      });
    }*/
    //if(selectedGarnishes.length==0) this.totalNotFreeGarForward = (this.priceWithNotFreeGarnishes || 0) + (this.totalNotFreeGarFrom || 0);
    //console.log("this.selectedGarnishes",this.selectedGarnishes);
    //console.log("selectedGarnishes",selectedGarnishes);

    this.removeUnavailableSelections(selectedGarnishes);

    if(modalElement && ((this.item.GarnishGroups && this.garnishGroup.Id == this.item.GarnishGroups[this.item.GarnishGroups.length-1]?.Id)||
    (this.item.GeneralGarnishGroups && this.garnishGroup.Id == this.item.GeneralGarnishGroups[this.item.GeneralGarnishGroups.length-1]?.Id)) ){
      //modalElement[0].classList.add('animate__animated', 'animate__bounceOutUp');
      //console.log("modalElement[0]",modalElement[0]);
      console.log("save-setTimeout");
      setTimeout(() => {
        this.dialogRef.close({
          selectedGarnishes,
          comments: this.comments,
          isSaved: true,
          freeCount: this.garnishGroup ? this.garnishGroup.FreeCount : 0,
          allGettingGarnishes: this.selectedGarnishes,
          isGarnishGroup: !!this.garnishGroup,
          returnToPreviousPage,
          //itemPriceWithGarnishes: this.priceWithNotFreeGarnishes,
          //selectedGarnishesPrice : this.totalNotFreeGarForward
          
        });
      }, 800);
    }

    else{


    this.dialogRef.close({
      selectedGarnishes,
      comments: this.comments,
      isSaved: true,
      freeCount: this.garnishGroup ? this.garnishGroup.FreeCount : 0,
      allGettingGarnishes: this.selectedGarnishes,
      isGarnishGroup: !!this.garnishGroup,
      returnToPreviousPage,
      //itemPriceWithGarnishes: this.priceWithNotFreeGarnishes,
      //selectedGarnishesPrice : this.totalNotFreeGarForward
      
    });
  }
  }

  private removeUnavailableSelections(selectedGarnishesNew) {


    selectedGarnishesNew.forEach(gar => {
      gar.GarnishGroupId = this.garnishGroup.Id;
    });


    var selectedCurrentGarnishesToDelete;


    ///not working
    if(this.item.PizzaPrices){

        console.log("if(this.item.PizzaPrices)");
          selectedCurrentGarnishesToDelete = this.selectedGarnishes.filter((grn) => {
          return this.garnishGroup &&
            this.garnishGroup.Garnishes[0] ?
            grn.GarnishGroupId === this.garnishGroup.Id : !grn.GarnishGroupId;
        });
    }

    else{

      selectedCurrentGarnishesToDelete = this.selectedGarnishes.filter((grn) => {
      return this.garnishGroup &&
        this.garnishGroup.Garnishes[0] ?
        grn.GarnishGroupId === this.garnishGroup.Garnishes[0].GarnishGroupId : !grn.GarnishGroupId;
      });
    }



    if (selectedCurrentGarnishesToDelete) {
      console.log("if (selectedCurrentGarnishes)");
      selectedCurrentGarnishesToDelete.forEach((selectedCurrGrn) => {
        this.selectedGarnishes.splice(this.selectedGarnishes.indexOf(selectedCurrGrn), 1);
        
      })
    }

    this.selectedGarnishes = this.selectedGarnishes.concat(selectedGarnishesNew.filter((selectedGarnish) => {
      return this.selectedGarnishes.every((selectGrn) => {
        return selectGrn ; //&& selectGrn.Id != selectedGarnish.Id
      }); console.log("this.selectedGarnishes");
    }).slice()).filter((garnish) => {
      return (!garnish.GarnishGroupId && garnish.IsSelected) ||
        (garnish.GarnishGroupId && this.garnishGroup && this.garnishGroup.Garnishes[0] && this.garnishGroup.Garnishes[0].GarnishGroupId != garnish.GarnishGroupId) ||
        (garnish.GarnishGroupId && garnish.IsSelected)
    });
  }



  private displayMessageByTime() {
    setTimeout(() => {
      this.showErrorGarnishMessage = false;
    }, this.timeToDisplayImage)
  }

  private checkSelectedGarnishesFromGarnishGroup2() {
    if (this.garnishGroup) {
      //console.log("garnishGroup", this.garnishGroup);
      const selectedGarnishes =
        (this.garnishGroup.Garnishes || []).filter((garnish: GarnishAppAdvancedModel) => {
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
      //console.log("this.totalGarnishsSum", selectedGarnishesSum);
      //console.log("selectedGarnishesSum", selectedGarnishesSum);

      if (selectedGarnishesSum < this.garnishGroup.Min) return false;
      else {
        return true;
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

    }
  }



  private initializeSettings() {
    this.lang = this.translationService.language();
    this.cashSymbol = AppConfig.cashSymbol;
    this.colors.menuColor = AppConfig.settings.menuColor;
    this.colors.buttonColor = AppConfig.settings.buttonColor;
  }

  public displayErrorGarnishMessage() {
    if (this.garnishGroup) {
      let minMaxText = "";
      if (this.garnishGroup.Min) {
        minMaxText =
          this.translationService.translate("GARNISHES_ERROR_GARNISH_START") +
          this.garnishGroup.Min +
          this.translationService.translate("GARNISHES_ERROR_GARNISH_END");
      }
      if (this.garnishGroup.Min == 1 && this.garnishGroup.Max == 1) {
        console.log("Masha")
        minMaxText = this.translationService.translate("GARNISHES_ERROR_SELECT_ONE")
      }
      if (this.garnishGroup.Min > 0 && this.garnishGroup.Min != this.garnishGroup.Max &&
        this.garnishGroup.Min <= this.garnishGroup.Max) {
        minMaxText = this.translationService.translate("GARNISHES_ERROR_GARNISH_TILL") + " " +
          this.garnishGroup.Max + " " +
          this.translationService.translate("GARNISHES_ERROR_GARNISH_MAX") + " " +
          "(" + this.translationService.translate("GARNISHES_ERROR_GARNISH_MINIMUM") + " " +
          this.garnishGroup.Min + ")"
      } else if (this.garnishGroup.Min == 0 &&
        this.garnishGroup.Min <= this.garnishGroup.Max) {
        minMaxText = this.translationService.translate("GARNISHES_ERROR_GARNISH_MAXERR") + " " +
          this.garnishGroup.Max +
          this.translationService.translate("GARNISHES_ERROR_GARNISHES");
      }
      else if (this.garnishGroup.Min != this.garnishGroup.Max &&
        this.garnishGroup.Min > this.garnishGroup.Max) {
        minMaxText = (this.garnishGroup.Garnishes && this.garnishGroup.Garnishes.length > this.garnishGroup.Min ?
          this.translationService.translate("GARNISHES_ERROR_GARNISH_MIN") :
          this.translationService.translate("GARNISHES_ERROR_SELECT"))
          + " " +
          this.garnishGroup.Min + this.translationService.translate("GARNISHES_ERROR_GARNISHES");
      } else if (this.garnishGroup.Min == this.garnishGroup.Max && this.garnishGroup.Max != 0 && this.garnishGroup.Min != 1) {
        minMaxText = this.translationService.translate("GARNISHES_ERROR_SELECT") + " " +
          this.garnishGroup.Max + " " +
          this.translationService.translate("GARNISHES_ERROR_GARNISHES");
      }
      const errorMessage = "" + minMaxText;
      return errorMessage;
    }
    return "";
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

  public deselectGarnishAmount(garnish: GarnishAppAdvancedModel) {
    if (garnish) {
      //  console.log("deselectGarnishAmount",garnish);        
      garnish.SelectedAmount = garnish.SelectedAmount - 1;
      this.totalGarnishsSum = this.totalGarnishsSum - 1;
      if (garnish.SelectedAmount == 0) garnish.IsSelected = false;
      this.selectedGarnishesPerGroup = (this.garnishGroup.Garnishes || []).filter((garnish: GarnishAppAdvancedModel) => {
        return garnish.IsSelected;
      });
      const selectedGarnishes = this.commonFunctionsService.deepCopy(this.selectedGarnishesPerGroup);
      /*if (!this.item.PizzaPrices && !this.item.IsUpgrade && !this.refreshItemSum) {
      this.calcPrice();
      }*/
      //this.deleteFromNotFreeArr(garnish);
      //console.log(" garnish.SelectedAmount", garnish.SelectedAmount);
      
      // garnish.Amount = 0;
    }

  }

  calcPrice() {
    console.log("calcPrice");
    var beenhere;
    if(this.wasOnCalc){
      console.log("if(this.wasOnCalc)");
      this.itemPriceWithNotFreeGarnishes = this.myPrice;
    }
    else this.itemPriceWithNotFreeGarnishes = this.item.Price;
    var sumOFNotFreeGarnishes = 0;
    if (this.selectedGarnishesPerGroup && this.selectedGarnishesPerGroup.length > 0) {
      this.item.GarnishGroups.forEach(gGroup => {

        if (gGroup.Garnishes && this.selectedGarnishesPerGroup[0].GarnishGroupId == gGroup.Id) {
          gGroup.Garnishes.forEach(garnish => {
            var foundGar = this.selectedGarnishesPerGroup.find(({ Id }) => Id === garnish.Id);
            if ( foundGar) {
              console.log("if (foundGar)")
              garnish.IsSelected = true;
              if (!gGroup.FreeCount) {
                beenhere = true;
                sumOFNotFreeGarnishes += garnish.Price;
                this.itemPriceWithNotFreeGarnishes += garnish.Price;
              }
            }
            else {
              garnish.IsSelected = false;
            }
          });
        }
        if (gGroup.FreeCount  && this.selectedGarnishesPerGroup[0].GarnishGroupId == gGroup.Id) {
          var startFromMaxFreeIndex = gGroup.FreeCount;
          this.selectedGarnishesPerGroup.sort((a, b) => a.Price - b.Price);

          var totalSumNotFreeGarnishesFreeCount = 0;
          var sumOfSelectedGarnishesPerGroup = 0;
          this.selectedGarnishesPerGroup.forEach(gar => {
            if (gar.SelectedAmount) {
              sumOfSelectedGarnishesPerGroup += gar.SelectedAmount
            }
            else {
              sumOfSelectedGarnishesPerGroup += 1;
            }
          });

          var mySelectedGars = [];
          var myGar;

          this.selectedGarnishesPerGroup.forEach(gar => {
            if(gar.SelectedAmount){
              for (let index = 0; index < gar.SelectedAmount; index++) {
                myGar = this.commonFunctionsService.deepCopy(gar);
                mySelectedGars.push(myGar);
              }
            }
            else{
              mySelectedGars.push(myGar);
            }
            
          });
        
          for (let index = startFromMaxFreeIndex ; index < sumOfSelectedGarnishesPerGroup ; index++) {
            totalSumNotFreeGarnishesFreeCount += mySelectedGars[index].Price;
          }
          if(beenhere == true) sumOFNotFreeGarnishes = 0;
          this.itemPriceWithNotFreeGarnishes += (totalSumNotFreeGarnishesFreeCount + sumOFNotFreeGarnishes);
        }
        


      });
      
    }

    else{
      console.log("NO SELECTED YET _ JUST CALC ALL GARS");
      this.calcPriceNotSelectedYet();
    }


  }

  public calcPriceNotSelectedYet(withdelete?){
    var beenhere;
    this.itemPriceWithNotFreeGarnishes = this.item.Price;
    var sumOFNotFreeGarnishes = 0;
    
    if(withdelete){

      console.log("WITH DELETE");

      this.item.GarnishGroups.forEach(gGroup => {
        var selectedGarnishesPerGroup = [];
  
        if (gGroup.Garnishes) {
          gGroup.Garnishes.forEach(garnish => {
            var foundGar = this.selectedGarnishesPerGroup.find(({ Id }) => Id === garnish.Id);
            if (foundGar) {
              garnish.IsSelected = true;
              if (!gGroup.FreeCount) {
                beenhere = true;
                sumOFNotFreeGarnishes += garnish.Price;
                this.itemPriceWithNotFreeGarnishes += garnish.Price;
              }
              else{
                selectedGarnishesPerGroup.push(garnish);
              }
            }
            else {
              garnish.IsSelected = false;
            }
          });
        }
        if (gGroup.FreeCount) {
          var startFromMaxFreeIndex = gGroup.FreeCount;
          //console.log("startFromMaxFreeIndex", startFromMaxFreeIndex);
          selectedGarnishesPerGroup.sort((a, b) => a.Price - b.Price);
          //console.log("selectedGarnishesPerGroup- After- Sort", this.selectedGarnishesPerGroup);
  
          var totalSumNotFreeGarnishesFreeCount = 0;
          var sumOfSelectedGarnishesPerGroup = 0;
          selectedGarnishesPerGroup.forEach(gar => {
            if (gar.SelectedAmount) {
              sumOfSelectedGarnishesPerGroup += gar.SelectedAmount
            }
            else {
              sumOfSelectedGarnishesPerGroup += 1;
            }
          });
          for (let index = startFromMaxFreeIndex - 1; index < sumOfSelectedGarnishesPerGroup - 1; index++) {
            totalSumNotFreeGarnishesFreeCount += selectedGarnishesPerGroup[index].Price;
          }
          if(beenhere == true) sumOFNotFreeGarnishes = 0;
          this.itemPriceWithNotFreeGarnishes += (totalSumNotFreeGarnishesFreeCount + sumOFNotFreeGarnishes);
          this.myPrice = this.itemPriceWithNotFreeGarnishes;
          this.wasOnCalc = true;
        }
  
  
      });
      

    }

    else{

    this.item.GarnishGroups.forEach(gGroup => {
      var selectedGarnishesPerGroup = [];

      if (gGroup.Garnishes) {
        gGroup.Garnishes.forEach(garnish => {
          var foundGar = this.selectedGarnishes.find(({ Id }) => Id === garnish.Id);
          if (foundGar) {
            garnish.IsSelected = true;
            if (!gGroup.FreeCount) {
              beenhere = true;
              sumOFNotFreeGarnishes += garnish.Price;
              this.itemPriceWithNotFreeGarnishes += garnish.Price;
            }
            else{
              selectedGarnishesPerGroup.push(garnish);
            }
          }
          else {
            garnish.IsSelected = false;
          }
        });
      }
      if (gGroup.FreeCount) {
        var startFromMaxFreeIndex = gGroup.FreeCount;
        //console.log("startFromMaxFreeIndex", startFromMaxFreeIndex);
        selectedGarnishesPerGroup.sort((a, b) => a.Price - b.Price);
        //console.log("selectedGarnishesPerGroup- After- Sort", this.selectedGarnishesPerGroup);

        var totalSumNotFreeGarnishesFreeCount = 0;
        var sumOfSelectedGarnishesPerGroup = 0;
        selectedGarnishesPerGroup.forEach(gar => {
          if (gar.SelectedAmount) {
            sumOfSelectedGarnishesPerGroup += gar.SelectedAmount
          }
          else {
            sumOfSelectedGarnishesPerGroup += 1;
          }
        });
        for (let index = startFromMaxFreeIndex - 1; index < sumOfSelectedGarnishesPerGroup - 1; index++) {
          totalSumNotFreeGarnishesFreeCount += selectedGarnishesPerGroup[index].Price;
        }
        if(beenhere == true) sumOFNotFreeGarnishes = 0;
        this.itemPriceWithNotFreeGarnishes += (totalSumNotFreeGarnishesFreeCount + sumOFNotFreeGarnishes);
        this.myPrice = this.itemPriceWithNotFreeGarnishes;
        this.wasOnCalc = true;
      }


    });
  }


  }

  public myPrice;
  public wasOnCalc = false




  public selectGarnish(item: GarnishAppAdvancedModel) {
    if (item) {
      console.log("selectGarnish()");
      //console.log("item", item);
      //console.log("this.selectedGarnishes", this.selectedGarnishes);
      //console.log("this.garnishGroup", this.garnishGroup);

      
      const selectedGarnishes = this.commonFunctionsService.deepCopy(this.selectedGarnishes);
        //console.log("selectedGarnishes - before not select",selectedGarnishes);


      if(item.GarnishGroupId == null){
        item.GarnishGroupId = this.garnishGroup.Id;
        //console.log("item", item);
      }
      this.showErrorGarnishMessage = false;
      if (this.garnishGroup) {
        const selectedItemsLength = this.selectedItems(this.garnishGroup.Garnishes).length;
        //console.log("selectedItemsLength", selectedItemsLength);
        //console.log("this.selectedItems(this.garnishGroup.Garnishes)", this.selectedItems(this.garnishGroup.Garnishes));
        if (!item.IsSelected && (this.garnishGroup.Max === 1 &&
          this.garnishGroup.Min <= this.garnishGroup.Max) &&
          selectedItemsLength >= this.garnishGroup.Max) {
            //console.log("20")
          this.deselectGarnishesOfGarnishGroup(this.garnishGroup.Garnishes);
        }
        else if (!item.IsSelected && this.garnishGroup.Max !== 0 &&
          (selectedItemsLength >= this.garnishGroup.Max)) { //  ||  selectedItemsLength < this.garnishGroup.MaxAmount
          return;
        }


        //console.log("item.SelectedAmount-before-function-handle" ,item.SelectedAmount);
        
        
        this.handleGarnishMultiSelect(item);
        this.myNewCalc();

        //this.prepareSelectedGarnishes();
        //this.prepareGarnishesToUse();
        if (
          !this.checkSelectedGarnishesFromGarnishGroup()) {
          this.showErrorGarnishMessage = true;
          this.displayErrorGarnishMessage();
          this.displayMessageByTime();
          //console.log("chekAmount1", item.SelectedAmount);
          item.SelectedAmount = item.SelectedAmount - 1;
          //console.log("chekAmount2", item.SelectedAmount);
          //console.log("this.selectedItems(this.garnishGroup.Garnishes).length", this.selectedItems(this.garnishGroup.Garnishes).length) ;
          return;
        }
        //console.log("END OF SELECTGARNISH() - SG",this.selectedGarnishes);
      }
      else {
        this.handleGarnishMultiSelect(item);
        //console.log("if !this.garnihGroup");
      }
    }
  }

  public myNewCalc(){
    console.log("myNewCalc()");
    let selectedGarnishes = [];
    if (this.garnishGroup) {
      
      selectedGarnishes = this.garnishGroup.Garnishes.slice()
        .filter((garnish: GarnishAppAdvancedModel) => {
          return garnish && garnish.IsSelected;
        });
    }

  }

  public deselectMultipleGarnish(garnish, event) {
    if (garnish && garnish.MaxAmount) {
      if (event) {
        event.stopPropagation();
        garnish.SelectedAmount = 0;
        garnish.IsSelected = false;
      }
    }
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

  public errorLoadingImage(garnish) {
    if (garnish) {
      garnish.IsFailedLoadImg = true;
    }
  }

}
