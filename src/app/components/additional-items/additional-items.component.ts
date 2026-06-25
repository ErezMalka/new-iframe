import { Component, DoCheck, Inject, EventEmitter, ViewChild, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog , MatDialogConfig } from '@angular/material/dialog';
import { TranslationsService } from '../../shared/translations/translations.service';
import { MessagePopupComponent } from '../../shared/components/message-popup/message-popup.component';
import { OrderAppModel } from '../../models/order/order-app.model';
import {NavigationEnd, Router} from '@angular/router';
import { BrowserIdentificatorService } from '../../core/services/common-settings/browser-identificator.service';
import { GarnishesComponent } from '../../views/menu/garnishes/garnishes.component';
import { GarnishAppAdvancedModel } from '../../models/advanced/menu/garnish-app-advanced.model';
import { GarnishGroupAppModel } from '../../models/menu/garnish-group-app.model';
import { GarnishAppModel } from '../../models/menu/garnish-app.model';
import {SizeMobileInitializationComponent} from '../../shared/classes/size-mobile-initialization.component';
import { AppConfig } from '../../app.config';
import { CommonFunctionsService } from "../../core/services/common-settings/common-functions.service";
import { Subscription } from "rxjs";
import { OrderService } from '../../core/services/order.service';
import { OrderItemAppModel } from '../../models/order/order-item-app.model';
import { ItemAppAdvancedModel } from '../../models/advanced/menu/item-app-advanced.model';
import { LanguageEnum } from '../../enums/advanced/language.enum';
import {NgScrollbar} from "ngx-scrollbar";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ItemWithGarnishesComponent } from '../../views/menu/item-with-garnishes/item-with-garnishes.component';
import { ItemForComboComponent } from '../../views/menu/item-for-combo/item-for-combo.component';
import { ChangeDetectorRef } from '@angular/core';

class ItemsData {
  items: ItemAppAdvancedModel[];
  header: string;
  maxItems: number;
  isBonusMode: boolean;
  minForBonus : number;
  firstMessage : string;
  bonusMSG : string;
  icon : any;
  isShowInKioskEndOrder : boolean = false;
  isUpgrade: any;
  useInventory: boolean;
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
  selector: 'additional-items',
  templateUrl: './additional-items.component.html',
  styleUrls: ['./additional-items.component.scss']
})
export class AdditionalItemsComponent  extends SizeMobileInitializationComponent implements OnInit, DoCheck, OnDestroy {

   // For scrollbar:
   public disabled = this.isMobileBrowser() && this.isMobileMode();
   public shown: 'native' | 'hover' | 'always' = 'native';
   private timeToDisplayImage = 10000;

 // @Input()
  public items: ItemAppAdvancedModel[];
  public header :string;
  public maxItems: number = 100;
  public isBonusMode: boolean = false;
  public useInventory: boolean = false;
  public comment: string;
  public minForBonus : number;
  public firstMessage : string;
  public bonusMSG : string;
  public icon : any;
  public isShowInKioskEndOrder : boolean = false;
  public temp : any;
  

  public selectedItems: OrderItemAppModel[]=[];
  public selectedItemsEndKiosk: OrderItemAppModel[]=[];

  
  public selected: any;

  @Output()
  public cancel: EventEmitter<any> = new EventEmitter();
  @Output()
  public addItem: EventEmitter<any> = new EventEmitter();
  public currency: string;
  public currencyPosition: string;


  @ViewChild(NgScrollbar) itemsAreaScrollbar: NgScrollbar;
  private timeOutForScrollUpdate: number = 200;

  public commonGraphics = {
    addToCart: ''
  };
  public graphics = {
    logo: '',
    cover: '',
  };

  public colors = {
    menuColor: '',
    buttonColor: '',
    priceColor: '',
    categoryColor: ''
  };
  public lang: string;
  public cashSymbol = '';
  public order: OrderAppModel;

  private itemWithGarnishes: ItemAppAdvancedModel
  private closeSubscriber: Subscription;

  public isAnySelected: boolean = false;
  public itemIsSelected = false;
public  displayItems: boolean = false
  public someOption = false;
  isUpgrade: boolean = false;

  constructor(public dialogRef: MatDialogRef<AdditionalItemsComponent>,
              public dialog: MatDialog,
              private cdr: ChangeDetectorRef,
              //public activeModal: NgbActiveModal,
              private orderService: OrderService,
              //private modalService: NgbModal,
              private modalService: BsModalService,
              private translationService: TranslationsService,
              private router: Router,
              private matDialog: MatDialog,
              protected browserIdentificatorService: BrowserIdentificatorService,
              private commonFunctionsService: CommonFunctionsService,
              @Inject(MAT_DIALOG_DATA) public data: ItemsData
  ) {
                super(browserIdentificatorService);
                this.comment = '';
                if (this.data) {
                
                  //const sorted = [...this.data.items.sort(function(a, b) {return a.Order - b.Order}) ]
                  var json_= JSON.stringify(this.data.items.sort(function(a, b) {return a.Order - b.Order} ));
                  
                  
                  this.items = JSON.parse(json_);
                 // console.log('Sorted items:', sorted.map(i => i.Order));
                 
                  //this.items =this.data.items;
                  //console.log("data.items",data.items);
                  //this.items = this.items.sort((a, b) => a.Order - b.Order).slice();
                 // this.items.sort(function(a, b) {return a.Order - b.Order} );
                  this.displayItems = true;
                //  console.log("this.items sort",this.items.sort((a, b) => a.Order - b.Order).slice());
                 // this.cdr.detectChanges(); 
                  if (this.useInventory) {
            this.items = this.items.filter((i) => this.isInStockUpsale(i));
          }
          this.items.forEach((i)=>{
                    if (!i.Amount || i.Amount == 1) i.Amount = 0;
                  });
                  this.header =data.header;
                  this.minForBonus = data.minForBonus;
                  this.firstMessage = data.firstMessage;
                  this.bonusMSG = data.bonusMSG;
                  this.icon = data.icon;
                  this.isShowInKioskEndOrder = data.isShowInKioskEndOrder;
                  
                  if (data.maxItems) {
                    this.maxItems = data.maxItems;
                  }
                  if(data.isUpgrade){
                    this.isUpgrade = data.isUpgrade;
      }
      if (data.useInventory) {
        this.useInventory = data.useInventory;
                  }
                  if (data.isBonusMode) {
                    this.isBonusMode = data.isBonusMode;
                    this.comment = this.translationService.translate('ADDITIONAL_ITEMS_CONDITION')
                     + ' ' +  this.translationService.translate('COMMON_CASH')
                     +  AppConfig.configSettings.minAmountForBonus ;
                  }
                }
                this.initializeSize();
              //  this.cdr.detectChanges(); 
  }


  private getLanguage() {
    return this.translationService.language();
  }
  
  private updateScroll() {
    setTimeout(() => {
      this.itemsAreaScrollbar.update();
    }, this.timeOutForScrollUpdate);
  }

  ngOnDestroy(): void {
    if (this.closeSubscriber) {
      this.closeSubscriber.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.lang = this.translationService.language();
    this.initializeGraphics();
    //this.currency = AppConfig.settings.currency;
    //this.currencyPosition = AppConfig.settings.currencyPosition;
    this.commonGraphics.addToCart = 'assets/images/add-to-cart-additions.svg';
    //this.checkTimeoutSubscription()
  }

  // every click on component
  public action() {

  }
  
  private initializeGraphics() {
    this.graphics.logo = AppConfig.settings.logo;
    //this.colors.menuColor = AppConfig.settings.menuColor || environment.defaultColor;
    this.colors.buttonColor = AppConfig.settings.buttonColor;
    this.colors.priceColor = AppConfig.settings.priceColor;
    this.colors.categoryColor = AppConfig.settings.categoryColor;
    this.lang = this.translationService.language();
    this.cashSymbol = AppConfig.cashSymbol;
  }


  public getItemWidth() {
    var style = {
      'width': 'calc(100%/' + this.items.length + ' - 18px);'
    }
    return style;
  }

  public getItemHeight() {
    var style = {
      'height': 'calc(100%/' + this.items.length + ' - 18px);'
    }
    return style;
  }

  public getItemStyle() {
    if (this.isMobileMode()) {
      return this.getItemHeight();
    } else {
      return this.getItemWidth();
    }
  }

  public save(isPrevious?) {

    console.log("AdditionalItems: save()");
    
      this.dialogRef.close({
        isSaved: true,
        selectedItems: this.selectedItems
      });
   

  }

 // private checkTimeoutSubscription() {
  //  this.closeSubscriber = this.orderService.orderApp.subscribe((result) => {
   //   if (!result) {
    //    this.close();
    //  }
  //  });
 // }

  public close() {
    this.dialogRef.close({
      isSaved: false
    });
    return;
  }

  public addAmount(item, isPizza?) {
    if (this.useInventory && !this.isInStockUpsale(item)) { return; }
    item.IsSelected = true;
      if (!item.Amount) {
        item.Amount = 0;
      }
      item.Amount++;
      if (item.Amount == 1){
        this.selected = this.prepareItemForOrder(item);
        this.selectedItemsEndKiosk.push(this.selected);
      } else {
        const index =  this.selectedItemsEndKiosk.findIndex((e) => {
          return e.ItemId == item.Id;
        });
        this.selectedItemsEndKiosk[index].Amount ++; 
        this.selectedItemsEndKiosk[index].Item.Amount ++; 
      }
    
  }

public subAmount(item) {
    const index =  this.selectedItemsEndKiosk.findIndex((e) => {
      return e.ItemId == item.Id;
    });
    item.Amount--;
    if (item.Amount > 0) {
    
      this.selectedItemsEndKiosk[index].Amount--; 
      this.selectedItemsEndKiosk[index].Item.Amount--; 
    } else {
      if (this.isMobileMode()) {
        this.selectedItemsEndKiosk.splice(index, 1);
        item.IsSelected = false;
      }
    }
  }



  public isInStockUpsale(item): boolean {
    // When inventory tracking is enabled, an item is out of stock if its Quantity is below 1.
    if (!this.useInventory) { return true; }
    return !!item && item.Quantity != null && item.Quantity >= 1;
  }

  public selectItem(item) {
    if (this.useInventory && !this.isInStockUpsale(item)) { return; }
    if ((item.Garnishes && item.Garnishes.length > 0) ||
      (item.GarnishGroups && item.GarnishGroups.length  > 0 )) {
        console.log("if ((item.Garnishes && item.Garnishes.length > 0)");
        item.Amount=1;
      this.addToCart(item);
    }
    else if (this.isBonusMode || this.isUpgrade) {
      this.items.forEach((i) => {
        if (i.Id != item.Id)
          i.IsSelected = false;
      });
      item.IsSelected = !item.IsSelected;
      if (item.IsSelected) {
        item.Amount=1;
        this.selected = this.prepareItemForOrder(item);

      }
      else { this.selected = null }
      this.someOption = true;
    }


   /* else {
      item.IsSelected = !item.IsSelected;
      if (item.IsSelected) {
        console.log("SELECTED")
        this.selected = this.prepareItemForOrder(item);
        this.selectedItemsEndKiosk.push(this.selected);
        console.log("this.selectedItemsEndKiosk", this.selectedItemsEndKiosk);

      }
      else {
        console.log("NOT SELECTED")
        this.selected = null
        const index =  this.selectedItemsEndKiosk.findIndex((e) => {
          return e.ItemId == item.Id;
        });
        this.selectedItemsEndKiosk.splice(index, 1);
        console.log("this.selectedItemsEndKiosk", this.selectedItemsEndKiosk);
        console.log("this.selected", this.selected);

        this.someOption = true;
      };

    }*/
  }

  private loadItemPopupDesktop(item, adding?) {
    console.log("loadItemPopupDesktop(item)");
    const matDialogRef = this.matDialog.open(ItemForComboComponent, {
      data: {
        item: item
      },
      backdropClass: 'backdropBackground',
      disableClose: false,
      panelClass: 'modal-dialog-item-with-garnishes-mat-dialog'
    });
    matDialogRef.afterClosed().subscribe((result) => {
      if (result.isSaved) {
        console.log("item-with-garnishes-saved");
        this.addToCartItemWithGarnishes(result.item ,result,adding );
      }

    });
  }

  addToCart(item?) {
    if (item && this.useInventory && !this.isInStockUpsale(item)) { return; }
    if (item) 
    {
      if (!this.isMobileMode()) {
        console.log("this.loadItemPopupDesktop(item);");
        this.loadItemPopupDesktop(item);
      }
      else if (item && ((item.Garnishes && item.Garnishes.length > 0) ||
        (item.GarnishGroups && item.GarnishGroups.length > 0))) {
        this.includeGarnishes(item, this.items.indexOf(item));
      } 
      else 
      {
        if (!this.isNotFilledAllRequiredGarnishesOfGarnishGroup(item)) {
        const orderItem = this.prepareItemForOrder(item);
        this.selectedItems.push(orderItem)
        this.items.splice(this.items.indexOf(item), 1);
     
        this.loadSuccessAddingToCartMessage();
      }
      }
    }
    else {
      console.log("else")
      if(this.selectedItemsEndKiosk){
        for (let index = 0; index < this.selectedItemsEndKiosk.length; index++) {
          const i = this.selectedItemsEndKiosk[index];
          this.selectedItems.push(i);
          var itemm : any = i;


          //this.items.splice(this.items.indexOf(itemm), 1);
          this.loadSuccessAddingToCartMessage()
          
        }
        //this.selectedItemsEndKiosk.forEach(i => {
        //this.selectedItems.push(i)
        //var itemm : any = i;


        //this.items.splice(this.items.indexOf(itemm), 1);
        this.loadSuccessAddingToCartMessage();
        //});
      }



      if (this.selected != null && this.selectedItemsEndKiosk.length==0) {
        this.selectedItems.push(this.selected)
        this.items.splice(this.items.indexOf(this.selected), 1);

        this.loadSuccessAddingToCartMessage();
        //}
        //}
        if (this.maxItems <= this.selectedItems.length) {
          this.cancelAction();
        }
        if ((this.items && this.items.length === 0) &&
          (this.selected && ((this.selected.Garnishes && this.selected.Garnishes.length === 0) && (this.selected.GarnishGroups && this.selected.GarnishGroups.length === 0)))) {
          this.cancelAction();
        }


        this.cancelAction();

      } else {
        this.cancelAction();
      }
    }
  }

  addToCartUpgradeMobile() {
   var item = this.items[0];
   if (this.useInventory && !this.isInStockUpsale(item)) { return; }
   item.Amount=1;
   if ((item.Garnishes && item.Garnishes.length > 0) ||
       (item.GarnishGroups && item.GarnishGroups.length  > 0 )) {
      console.log("if ((item.Garnishes && item.Garnishes.length > 0)");
      
    this.addToCart(item);
   }
   else {
    this.selected = this.prepareItemForOrder(item);
    this.items.splice(0, 1);
    this.selectedItems.push(this.selected)
    this.loadSuccessAddingToCartMessage();
    this.cancelAction();
   }
   
 
    
    
  }

  bsModalRef: BsModalRef;

  

  public includeGarnishes(item: ItemAppAdvancedModel, index:number) {
    if (item) {
      if (item.GarnishGroups && item.GarnishGroups.length > 0) {
        const garnishGrp = item.GarnishGroups[0];
        this.loadingGarnishesPopup(item,  index, null, garnishGrp, '', item.SelectedGarnishes, true);
      } else if (item.Garnishes && item.Garnishes.length > 0) {
        this.loadingGarnishesPopup(item,  index, item.Garnishes, null, '', item.SelectedGarnishes, true);
      }
    }
  }

  
 public directionLanguage() {
  return LanguageEnum.HE;
}
  private loadingGarnishesPopup(item, index:number, garnishes: GarnishAppModel[], garnishGroup: GarnishGroupAppModel,
    comments: string, selectedGarnishes, isFirstPage?) {
      console.log("loadingGarnishesPopup()");
    const matDialogRef = this.matDialog.open(GarnishesComponent, {
      data: {
        item: item,
        garnishGroup: garnishGroup,
        garnishes: garnishes,
        comments: comments,
        selectedGarnishes,
        isFirstPage
      },
      backdropClass: 'backdropBackground',
      width: '100%',
      maxWidth: '1000px',
      disableClose: true,
      panelClass: 'custom-mat-dialog-mobile-garnishes-with-item'
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
            this.loadingGarnishesPopup(item,  index, null, grnGrp, result.comments,
              item.SelectedGarnishes);
          }
        } else if (!result.returnToPreviousPage && item.Garnishes && item.Garnishes.length > 0 && item.SelectedGarnishes &&
          result.isGarnishGroup) {
          this.loadingGarnishesPopup(item,  index, item.Garnishes, null, result.comments,
            item.SelectedGarnishes);
        } else if (result.returnToPreviousPage && item && item.GarnishGroups &&
          item.GarnishGroups.indexOf(garnishGroup) !== -1 &&
          item.GarnishGroups.indexOf(garnishGroup) - 1 > -1) {
          const grnGrp = item.GarnishGroups[item.GarnishGroups.indexOf(garnishGroup) - 1];
          if (grnGrp && grnGrp.Garnishes && grnGrp.Garnishes.length > 0) {
            this.loadingGarnishesPopup(item, index, null, grnGrp, result.comments,
              item.SelectedGarnishes, item.GarnishGroups.indexOf(grnGrp) === 0);
          }
        } else if (result.returnToPreviousPage && item.Garnishes &&
          item.Garnishes.length > 0 && item.SelectedGarnishes) {
          if (item.Garnishes) {
            const grnGrp = item.GarnishGroups[item.GarnishGroups.length - 1];
            if (grnGrp) {
              this.loadingGarnishesPopup(item,  index, null, grnGrp, result.comments,
                item.SelectedGarnishes, item.GarnishGroups.indexOf(grnGrp) === 0);
            }
          }
        } else if (!result.returnToPreviousPage) {
          // If everything was added to list of garnishes - add to card
          this.addToCartItemWithGarnishes(item,  index, result);
        } else {

        }
      } else {

      }
    });
  }


  private isNotFilledAllRequiredGarnishesOfGarnishGroup(item: ItemAppAdvancedModel) {
    let requireMinMaxOptions = false;
    if (item && item.GarnishGroups) {
      const countOfGarnishes = (arr:any[]) => {
        let counter=0;
        arr.forEach((e)=> {
          counter += e.SelectedAmount;
        });
        return counter;
        
      };
      const isSelectedAllNeededGarnishesByGroup = (garnishGroup, item) => {
        if (garnishGroup) {
          const countOfGarnishesArray = item.SelectedGarnishes.filter((garnish) => {
            return garnish.IsSelected && garnishGroup.Garnishes && garnishGroup.Garnishes[0] &&
              garnish.GarnishGroupId === garnishGroup.Garnishes[0].GarnishGroupId;
          });
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

  private prepareItemForOrder(item: ItemAppAdvancedModel) {
    const orderItem = new OrderItemAppModel();
    orderItem.Amount = item.Amount;
    orderItem.ItemId = item.Id;
    orderItem.Comment = '';
    orderItem.Item = this.commonFunctionsService.deepCopy(item);
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
            garnishesGroup[key].sort((garnish1, garnish2) => {
              return garnish1.Price - garnish2.Price;
            }).map((garnish, index) => {
              if (index < item.GarnishGroups[i].FreeCount) {
                garnish.Price = 0;
              }
            });
          }
        }
      }
    });
    orderItem.Garnishes = garnishes;
    orderItem.SpecialRequests = '';
    orderItem.ComboItemId = 0;
    orderItem.IsScratchCoupon = false;
    orderItem.ScratchCouponId = 0;
    orderItem.Price = item.Price;
    orderItem.ImageUrl = item.ImageUrl;
    orderItem.Name = item.Name;
    if (this.comment.length >1) {
      orderItem.Comment = this.comment;
      orderItem.SpecialRequests = this.comment;
    }
    if (this.isBonusMode) {
      orderItem.IsBonus =true;
    }
    return orderItem;
  }

  /*private getIndexIfNotHavingGarnishes(currentItem) {
    if (this.order && this.order.OrderItems && currentItem) {
      const item = this.order.OrderItems.find((item) => {
        return item.ItemId === currentItem.Id && item.Garnishes && item.Garnishes.length === 0
          && currentItem.GarnishGroups && currentItem.GarnishGroups.length === 0
          && currentItem.Garnishes && currentItem.Garnishes.length === 0;
      });
      return this.order.OrderItems.indexOf(item);
    }
    return -1;
  }*/



  public resetItem(item) {
    if (item) {
      item.Amount = 1;
      item.SelectedGarnishes = [];
      if (item.Garnishes) {
        item.Garnishes.forEach((garnish) => {
          garnish.IsSelected = false;
          garnish.SelectedAmount = 0;
        });
      }
      if (item.GarnishGroups) {
        item.GarnishGroups.forEach((group) => {
          if (group && group.Garnishes) {
            group.Garnishes.forEach((grn) => {
              grn.IsSelected = false;
              grn.SelectedAmount = 0;
            })
          }
        });
      }
      if (item.SelectedToppings) {
        item.SelectedToppings = [];
      }
    }
  }


  private addToCartItemWithGarnishes(item, index, data?) {
    if (!this.isNotFilledAllRequiredGarnishesOfGarnishGroup(item)) {
      console.log("!this.isNotFilledAllRequiredGarnishesOfGarnishGroup(item)");

      const orderItem = this.prepareItemForOrder(item);
      if (data && data.comments) {
        orderItem.SpecialRequests = data.comments || '';
      }
      if (this.comment.length >1 ) 
      {
        orderItem.SpecialRequests = this.comment;
      }
     //const index = this.getIndexIfNotHavingGarnishes(item);
     // if (index >= 0) {
      //  const item = this.order.OrderItems[index];
      //  item.Amount += orderItem.Amount;
     // } else {
      this.selectedItems.push(orderItem);
      //}
      const index_ =  this.items.findIndex((e) => {
        return e.Id == item.Id;
      });
      this.items.splice(index_, 1);
      this.loadSuccessAddingToCartMessage();

      if (this.items.length==0) {
       this.cancelAction();
      }
      if (this.maxItems <= this.selectedItems.length) {
        this.cancelAction();
      }
     
    }
  }

  public loadSuccessAddingToCartMessage() {
    console.log("loadSuccessAddingToCartMessage");
    if( document ){
    document.getElementById("snackbar-a").classList.add("show");    
    setTimeout(() => {

     document.getElementById("snackbar-a").classList.remove("show");    
    }, 3000);
   }

  }

  cancelAdditionsAction() {
    this.dialogRef.close(false);
  }

  cancelAction() {
    console.log("cancelAction");
    this.dialogRef.close({
      isSaved: true,
      selectedItems: this.selectedItems
    });
    //this.cancel.emit(false);
   // this.dialogRef.close(false);
  }

 // getLanguage() {
  //  return getLanguage();
 // }

  ngDoCheck(): void {
    if (!this.header) {
      this.header = "";
    }


    //this.commonFunctionsService.sortOrderItems(this.items);
  }

  public closeAdditionalItems(){
    this.dialogRef.close();
  }

}
