import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { TranslationsService } from '../../shared/translations/translations.service';
import { AppConfig } from '../../app.config';
import {OrderAppModel} from '../../models/order/order-app.model';
import { CategoryAppAdvancedModel } from '../../models/advanced/menu/category-app-advanced.model';
import {OrderItemAppModel} from '../../models/order/order-item-app.model';
import {OrderPizzaAppAdvancedModel} from '../../models/advanced/order/order-pizza-app-advanced.model';
import {SizeMobileInitializationComponent} from '../../shared/classes/size-mobile-initialization.component';
import {BrowserIdentificatorService} from '../../core/services/common-settings/browser-identificator.service';
import {OrderComboAppModel} from "../../models/order/order-combo-app.model";
import { RoundPricePipe } from '../../shared/pipes/round-price.pipe';
import { OrderService } from '../../core/services/order.service';
import {MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MessagePopupComponent } from '../../shared/components/message-popup/message-popup.component';
import { GarnishAppAdvancedModel } from '../../models/advanced/menu/garnish-app-advanced.model';
import { MenuService } from '../../core/services/menu.service';
import { BranchAppModel } from '../../models/franchise-branch/branch-app.model';
import { NavigationEnd, Router } from '@angular/router';
import { ConfigService } from '../../core/services/common-settings/config.service';
import { ToppingAppModel } from '../../models/menu/topping-app.model';
import { CommonFunctionsService } from '../../core/services/common-settings/common-functions.service';
import { AppStorageService } from '../../app.storage.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AdditionalItemsComponent } from '../additional-items/additional-items.component';
import { ItemAppAdvancedModel } from '../../models/advanced/menu/item-app-advanced.model';

@Component({
  selector: 'order-result',
  templateUrl: './order-result.component.html',
  styleUrls: ['./order-result.component.scss']
})
export class OrderResultComponent extends SizeMobileInitializationComponent implements OnInit {

  public graphics = {
    logo: '',
    cover: '',
  };

  public colors = {
    menuColor: '',
    buttonColor: '',
    priceColor:''
  };

  public lang: string;

  public cashSymbol: string;

  @Input()
  public categories: CategoryAppAdvancedModel[];

  @Input()
  public currentBranch: BranchAppModel;

  @Input()
  public order: OrderAppModel;

  @Input()
  public discount: any;

  @Input()
  public isDiscount: boolean;


  @Output()
  public removeAll: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public makeOrder: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public openItemPopup: EventEmitter<any> = new EventEmitter<any>();
  //discount: any;

  public franchiseId: number;
  public isFutureDatesOrderAvailable: boolean;
  public futureTATime: any;
  public futureDate: any;
  //categories: any;
  toppings:  ToppingAppModel[];

  public bonusItems: ItemAppAdvancedModel[] = [];
  public displayPickupPoints:boolean = false;


  constructor( private translationService: TranslationsService,
    private router: Router,
    private configService: ConfigService,
               private roundPricePipe: RoundPricePipe,
               protected browserIdentificatorService: BrowserIdentificatorService,
               private deviceService: DeviceDetectorService,
               private matDialog: MatDialog,
               private commonFunctionsService: CommonFunctionsService,
               private appStorageService: AppStorageService,
              private orderService: OrderService) {
                 
    super(browserIdentificatorService);
    this.franchiseId = this.configService.franchiseId;
    
  }

  ngOnInit() {
     this.displayPickupPoints=AppConfig.configSettings.pickupPoints;
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!ORDER", this.order);
    console.log("currentBranch  !", this.currentBranch);
    console.log(" AppConfig.configSettings.displayBranchPhoneLink", AppConfig.configSettings.displayBranchPhoneLink);
     
    console.log("order", this.order);
    this.isFutureDatesOrderAvailable = this.appStorageService.franchise.IsFutureDatesOrderAvailable;
    console.log("IsFutureDatesOrderAvailable", this.appStorageService.franchise.IsFutureDatesOrderAvailable);
    if (this.order.IsFutureOrder) {
      if (this.appStorageService.franchise.IsFutureDatesOrderAvailable){
        console.log("futurefutureDateTATime", this.order.FutureDate);
        this.futureTATime = this.order.FutureTime;
        this.futureDate = this.order.FutureDate;
      } else {
        if (this.order.FutureDateTime && this.order.FutureDateTime instanceof Date) {
          this.futureTATime = this.order.FutureDateTime.toLocaleTimeString();
          console.log("futureTATime", this.futureTATime);
        }
        else {
          this.futureTATime = this.order.FutureDateTime;
        }
      }
     
    }


    this.initializeGraphics();
    this.initializeSize();
    this.checkForCombo();

    if (AppConfig.configSettings.bonusCategory && AppConfig.configSettings.bonusCategory != '') {
      console.log("if (AppConfig.configSettings.bonusCategory && AppConfig.configSettings.bonusCategory != '')");
      const bonusItemsCategory = this.categories.find
        (it => it.Name === AppConfig.configSettings.bonusCategory);
        console.log("bonusItemsCategory",bonusItemsCategory);
      if (bonusItemsCategory && bonusItemsCategory.Items
        && bonusItemsCategory.Items.length > 0) {
        this.bonusItems = bonusItemsCategory.Items;
      }
    }

    
    
    //console.log("this.franchiseId",this.franchiseId);

  }

  /*public printInfo(){
    console.log("print info", this.order);

  }*/

  public displayPrice(item){
    //console.log("displayPrice(): item",item);
    if(item.Item?.isFreeMembershipBenefit) return false;
    else return true
  }

  public getTopName(top){

    this.toppings = this.appStorageService.pizzaToppings || [];

    //console.log("this.toppings", this.toppings);
    //console.log("top", top);
    var topName = '';
    this.toppings.forEach(t => {
      if(t.Id == top.ToppingId){
        //console.log("t.Name",t.Name)
        topName = t.Name;
        return topName
      }

      return 'not found'
      
    });

    return topName;
  }

  
  public getLanguage() {
    return this.translationService.language();
  }

  public checkForCombo(){


    const myorderitems = this.commonFunctionsService.deepCopy(this.order.OrderItems);

    console.log("myorderitems",myorderitems);
    console.log("myorderitems",this.order.OrderCombos);

   // this.categories = this.appStorageService.categories || [];


    this.categories.forEach(category => {
      category.Items.forEach(originalItem => {
        this.order.OrderItems.forEach(orderItem => {
          if(originalItem.Id == orderItem.Item.Id && !orderItem.IsItemsGroupItemKeptPrice){
            orderItem.Price = originalItem.Price;
            console.log("rderItem",orderItem);
          }
        });
      });
    });


    console.log('this.checkForCombo()');


    let itemsInCombos = [];
    this.order.OrderItems.forEach(orderItem => {
      if(orderItem.IsCombo){
        if(orderItem.Amount>1){
          console.log("if(orderItem.Amount>1)");
          for (let i = 0; i < orderItem.Amount; i++) {
            const newItem = new OrderItemAppModel();
            newItem.Amount = 1;
            newItem.CategoryId = orderItem.CategoryId;
            newItem.Comment = orderItem.Comment;
            newItem.Garnishes = orderItem.Garnishes;
            newItem.GarnishesListDisplay = orderItem.GarnishesListDisplay;
            newItem.ImageUrl = orderItem.ImageUrl;
            newItem.IsCombo = orderItem.IsCombo;
            newItem.IsScratchCoupon = orderItem.IsScratchCoupon;
            newItem.IsUpgrade = orderItem.IsUpgrade;
            newItem.Item = orderItem.Item;
            newItem.ItemId =  orderItem.ItemId;
            newItem.Name = orderItem.Name;
            newItem.Price = orderItem.Price;
            newItem.ScratchCouponId = orderItem.ScratchCouponId;
            newItem.SpecialRequests = orderItem.SpecialRequests;
            itemsInCombos.push(newItem);
          }
        }else itemsInCombos.push(orderItem);
      }
    });
    console.log("itemsInCombos",itemsInCombos);

    const sortedItemsCombos = itemsInCombos.sort(
      (i1, i2) =>
      +i2.CategoryId - +i1.CategoryId ||
      +i2.Price - +i1.Price
    )
    console.log("sortedItemsCombos", sortedItemsCombos);
    const mySorted = this.commonFunctionsService.deepCopy(sortedItemsCombos);
    console.log("mySorted", mySorted);
    for (let index = 0; index < sortedItemsCombos.length; index++) {
      console.log("sortedItemsCombos[index]", sortedItemsCombos[index]);

      if (sortedItemsCombos[index].CategoryId == sortedItemsCombos[index + 1]?.CategoryId
        && sortedItemsCombos[index]?.Price == 0) {
        console.log("same category but price alredy fixed - skip");

      }

      else if (sortedItemsCombos[index].CategoryId == sortedItemsCombos[index + 1]?.CategoryId
        && sortedItemsCombos[index]?.Price > 0  //masha 6.9.22
      ) {
        console.log("next item from same category, reset to 0");
        sortedItemsCombos[index + 1].Price = 0;
      }

      else {
        console.log("next item is not from same category, keep price");
      }


    }
    const myselectedItems = this.commonFunctionsService.deepCopy(this.order.OrderItems);
    console.log("myselectedItems", myselectedItems);

    this.order.OrderItems = this.order.OrderItems.filter(item => !(item.IsCombo));

    const mySorted4 = this.commonFunctionsService.deepCopy(this.order.OrderItems);
    console.log("mySorted4 - after delete all combo", mySorted4);

    sortedItemsCombos.forEach(itemWithRightPrice => {
      console.log("itemWithRightPrice",itemWithRightPrice);
      this.order.OrderItems.push(itemWithRightPrice);
    });
  }

   myFunction(item) {
    //console.log("!!!!!!!!!!checkOrderResultHeight()")
    if (!this.isMobileMode()) {
      //var resultHeight = document.getElementById("myOrderResult").style.height;
      var height = this.otherIdentifier.nativeElement.offsetHeight;
      //console.log("height", height);

      if (height > 550) {
        console.log("HEIGHT > 700");
        var resultBTN = document.getElementById("result-btn");
        var perfectScroll = document.getElementById("my-scroll");
        console.log("resultBTN", resultBTN);
        console.log("perfectScroll", perfectScroll);
        resultBTN.classList.add("greater-height");
        perfectScroll.classList.add("greater-scroll-height");
        return true;

      }
      return false;
    }
    return false;
  }

  

  myFunccClose(){
    if(!this.isMobileMode()){
    console.log("!!!!!!!!!!myFunccClose()")
    //var resultHeight = document.getElementById("myOrderResult").style.height;
    var height = this.otherIdentifier.nativeElement.offsetHeight;
    console.log("height-Close",height);
    
    if(height>730){
      console.log("HEIGHT > 730");
      var resultBTN = document.getElementById("result-btn");
      var perfectScroll = document.getElementById("my-scroll");
      perfectScroll.classList.remove("greater-scroll-height");
      console.log("resultBTN", resultBTN);
      resultBTN.classList.remove("greater-height");
      
    }
  }
  }

  public itemPrice(item, isPizza?) {
  //  console.log("item",item);
    if (!isPizza) {
      let sum = item.Price;
      if (item.Garnishes) {
        sum = item.Garnishes.reduce((sm, garnish) => {
          if (garnish) {
            sm += garnish.Price;
          }
          return sm;
        }, sum);
      }
      if (item.Items) {
        item.Items.forEach((i) => {
          let garnishesSum_ = 0;
          
          if (i.Garnishes) {
            i.Garnishes.forEach((g: GarnishAppAdvancedModel) => {
              if (g.MaxAmount && g.SelectedAmount) {
                garnishesSum_ += g.Price * g.SelectedAmount;
              } else {
                garnishesSum_ += g.Price;
              }
            })
          }
          sum += (i.Price + garnishesSum_) * (i.Amount || 1);
        });
      }
      return sum * (item.Amount || 1);
    } else {
      if (item.FullPizza.SelectedPizzaPriceSize) {
        let sum = item.FullPizza.SelectedPizzaPriceSize.Price;
        if (item.FullPizza.SelectedToppings) {
          sum += item.FullPizza.SelectedToppings.reduce((s, item) => {
            s += +item.TotalPrice;
            return s;
          }, 0);
        }
        if (item.Garnishes) {//FullPizza.SelectedGarnishes
          item.Garnishes.forEach((g)=> {
            sum += g.Price;
          });
           
        }
        return sum * (item.Amount || 1);
        //return sum * (item.FullPizza ? (item.FullPizza.Amount || 1) : (item.Amount || 1));
      }
    }

  }

  // Todo: move to Pipe
  public roundSum(value, count) {
    if (value) {
      if (count) {
        if (isNaN(value) || isNaN(value)) {
          return value;
        }
        const m = Math.pow(10, count);
        return (Math.round(value * m) / m);
      } else {
        return value;
      }
    } else {
      return value;
    }
  }

  public countOfItems() {
    let count = 0;
    if (this.order && this.order.OrderItems) {
      count = this.order.OrderItems.reduce((sum, item: OrderItemAppModel) => {
        sum += item.Amount;
        return sum;
      }, count);
    }
    if (this.order && this.order.OrderPizzas) {
      count = this.order.OrderPizzas.reduce((sum, item: OrderPizzaAppAdvancedModel) => {
        sum += item.FullPizza.Amount;
        return sum;
      }, count);
    }
    if (this.order && this.order.OrderCombos) {
      count = this.order.OrderCombos.reduce((sum, item: OrderComboAppModel) => {
        sum += item.Amount;
        return sum;
      }, count);
    }
    return count;
  }

  public removeAllOrder() {
    this.removeAll.emit(true);
  }

  public toMakeOrder() {
    this.makeOrder.emit();
  }

  public editItem(item, index) {
    console.log("editItem editItem",item.ItemId);
    this.openItemPopup.emit({item, index});
  }

   

  public addAmount(item, isPizza?, isCombo?) {

    console.log("addAmount",item)
    
    if (isPizza) {
      if (!item.FullPizza.Amount) {
        item.FullPizza.Amount = 1;
      }
      if (!item.Amount) {
        item.Amount = 1;
      }
      item.FullPizza.Amount++;
      item.Amount++;

      
      var dataLayerItems =[];
      var dataLayerItem={
        "item_id": item.PizzaId,
        "item_name":item.Name,
        "price":this.itemPrice(item,true),
        "quantity" :1
      }
      console.log("dataLayerItem",dataLayerItem);
      dataLayerItems=[];
      dataLayerItems.push(dataLayerItem);
      window['dataLayer'].push({
        'event': 'add_to_cart',
        'items': dataLayerItems,
        'currency':'ILS',
        'value': this.itemPrice(item,true),
        'contents':[{'id':item.PizzaId, 'quantity':item.Amount}],
        'content_type': 'product_group',
        'content_ids': [item.PizzaId]
     });

    } else {
      if (!item.Amount) {
        item.Amount = 1;
      }
      if (this.currentBranch.UseInventory && item.Item.Quantity == 0) return;
      item.Amount++;
      if (this.currentBranch.UseInventory ) {
        item.Item.Quantity -=1;
        this.categories.forEach((cat)=> {
          cat.Items.forEach((i)=> {
            if (i.CatalogNumber == item.CatalogNumber)
              i.Quantity = item.Item.Quantity;          
          });
        });
        this.order.OrderItems.forEach((orderItem)=> {        
            if (orderItem.Item.CatalogNumber == item.CatalogNumber)
              orderItem.Item.Quantity = item.Item.Quantity;                 
        });

        if (item.Items) {
          item.Items.forEach((gi) => {
            gi.Item.Quantity -= gi.Amount     
            
             this.categories.forEach((cat)=> {
              cat.Items.forEach((i)=> {
                if (i.CatalogNumber ==  gi.Item.CatalogNumber)
                  i.Quantity = gi.Item.Quantity;     
                if (i.ItemGroups) {
                    i.ItemGroups.forEach((grp) => {
                      grp.GroupItems.forEach((gii) => {                 
                        if (gii.CatalogNumber == gi.Item.CatalogNumber)            
                          gii.Quantity = gi.Item.Quantity;
                      })           
                    });
                }   
                                
              });
            });

             this.order.OrderItems.forEach((orderItem)=> {        
              if (orderItem.Item.CatalogNumber == gi.Item.CatalogNumber)
                orderItem.Item.Quantity = gi.Item.Quantity;
              if (orderItem.Items) {
                orderItem.Items.forEach((gii) => {
                  if (gii.Item.CatalogNumber ==  gi.Item.CatalogNumber)    
                    gii.Item.Quantity =  gi.Item.Quantity;
                });         
              
              }     
              
            });

          });                     
        }

      }
     

      var dataLayerItems =[];
      if (isCombo) {
        var dataLayerItem={
          "item_id": item.ComboId,
          "item_name":item.Name,
          "price":this.itemComboPrice(item) ,
          "quantity" :1
        }
        console.log("dataLayerItem",dataLayerItem);
        
        dataLayerItems.push(dataLayerItem);
    
        window['dataLayer'].push({
          'event': 'add_to_cart',
          'items': dataLayerItems,
          'currency':'ILS',
          'value': this.itemComboPrice(item) ,
          'contents':[{'id':item.ComboId, 'quantity':item.Amount}],
          'content_type': 'product_group',
          'content_ids': [item.ComboId]
       });
      } else {
        var dataLayerItem={
          "item_id": item.ItemId,
          "item_name":item.Name,
          "price":this.itemPrice(item,false),
          "quantity" :1
        }
        console.log("dataLayerItem",dataLayerItem);
        dataLayerItems=[];
        dataLayerItems.push(dataLayerItem);
        window['dataLayer'].push({
          'event': 'add_to_cart',
          'items': dataLayerItems,
          'currency':'ILS',
          'value': this.itemPrice(item,false),
          'contents':[{'id':item.ItemId, 'quantity':item.Amount}],
          'content_type': 'product_group',
          'content_ids': [item.ItemId]
       });
      }
      
  
    }
    this.checkForCombo();
    this.orderService.recalculateSum();
    if (AppConfig.configSettings.minAmountForBonus && !this.order.hasBonusItems
      && (this.order.Sum >= AppConfig.configSettings.minAmountForBonus)) {
        console.log("go to - this.displayBonusItems();")
      this.displayBonusItems();
    }
  }

  public itemComboPrice(combo) {
    let sum = (combo.Price * (combo.Amount || 1));
    let extraPrice = 0;
    if (combo.Pizzas) {
      combo.Pizzas.forEach((pizza) => {
        extraPrice += pizza.FullPizza.PriceInCombo;
        pizza.Toppings.forEach(p => {
          extraPrice += p.Price;
        })
      })
    }
    if (combo.Items) {
      combo.Items.forEach((item) => {
        if(item.IsItemNewCombo){
          extraPrice += item.Price;
        }
        item.Garnishes.forEach(g => {
          extraPrice += g.Price;
        })
        
      })
    }
    sum += extraPrice * (combo.Amount || 1);
    return sum;
  }


  public displayBonusItems() {
    //const message = this.translationService.translate('BONUS_SECOND');
    const minForBonus = AppConfig.configSettings.minAmountForBonus;
    const firstMessage = this.translationService.translate('BONUS_FIRST');
    const bonusMSG = AppConfig.configSettings.bonusMsg;
    console.log(minForBonus);
    console.log(firstMessage);
    console.log("this.bonusItems",this.bonusItems);
    if (this.bonusItems && this.bonusItems.length > 0) {
      console.log("if (this.bonusItems && this.bonusItems.length > 0)");
      const matDialogRef = this.matDialog.open(AdditionalItemsComponent, {
        data: {
          //header: message,
          items: this.commonFunctionsService.deepCopy(this.bonusItems),
          maxItems: 1,
          isBonusMode: true,
          minForBonus: minForBonus,
          firstMessage: firstMessage,
          icon: '../../../../assets/images/items/cart-icon-big.svg',
          bonusMSG: bonusMSG,
        },
        minWidth: '350px',
        width: '100%',
        maxWidth: '1000px',
        disableClose: false,
        panelClass: 'custom-mat-dialog-mobile-bonus'
      });
      matDialogRef.afterClosed().subscribe((result) => {
        console.log("afterClosed()-->", result);
        if (result.isSaved && result.selectedItems) {
          result.selectedItems.forEach(orderAdditionalItem => {
            this.order.OrderItems.push(orderAdditionalItem);
            this.checkOrderResultHeight();
            this.order.hasBonusItems = true;
          });
          //  this.addToCartComboItem(result.combo, comboItem);
        }
      });
    }
  }

  public pizzaTopFreeGroupId;
  public myFlag;
  checkSelectedToppings(pizza){
    if(pizza.FullPizza.SelectedToppings[0]){
      this.pizzaTopFreeGroupId = pizza.FullPizza.SelectedToppings[0].ToppingGroupId;
    }
    //console.log("checkSelectedToppings");
    //console.log("pizza",pizza);
    //console.log("pizza?.FullPizza?.SelectedToppings?.length",pizza.FullPizza.SelectedToppings.length);
    if (pizza.FullPizza!= undefined && 
      pizza.FullPizza.SelectedToppings!=undefined &&
      pizza.FullPizza.SelectedToppings.length > 0) return true;
    return false;
  }
  public subAmount(item, isPizza?) {
    // display warning msg
    let header = this.translationService.translate('ERROR');
      let icon = "../../../assets/images/items/important-message.svg";
    if (AppConfig.configSettings.minAmountForBonus && AppConfig.configSettings.minAmountForBonus > 0) {
      const msg = this.translationService.translate('ORDER_BONUS_WARNING')
            + ' ' +  this.translationService.translate('COMMON_CASH')
            +  AppConfig.configSettings.minAmountForBonus;
      const matDialogRef = this.matDialog.open(MessagePopupComponent, {
        data: {
          header,
          icon,
                message: msg,
                withoutTimeout: true
              },
        minWidth: '400px',
        disableClose: true,
        panelClass: 'custom-mat-dialog-popup'
      });
      matDialogRef.afterClosed().subscribe((result) => {});
    } 

    if (isPizza) {
      if (!item.FullPizza.Amount) {
        item.FullPizza.Amount = 1;
      }
      if (!item.Amount) {
        item.Amount = 1;
      }
      if (item.FullPizza.Amount > 1) {
        item.FullPizza.Amount--;
      }
      if (item.Amount > 1) {
        item.Amount--;
      } else {
       // if (this.isMobileMode()) {
        //  this.remove(item, isPizza);
      //  }
      }
    } else {
      if (!item.Amount) {
        item.Amount = 1;
      }
      if (item.Amount > 1) {
        item.Amount--;
        if (this.currentBranch.UseInventory ) {
          item.Item.Quantity +=1;
          this.categories.forEach((cat)=> {
            cat.Items.forEach((i)=> {
              if (i.CatalogNumber == item.Item.CatalogNumber)
                i.Quantity =  item.Item.Quantity;   
                if (i.ItemGroups) {
                  i.ItemGroups.forEach((grp) => {
                    grp.GroupItems.forEach((gi) => {
                      if (gi.CatalogNumber == item.Item.CatalogNumber)            
                        gi.Quantity = item.Item.Quantity;
                    })           
                  });
                }         
            });
          });
           
          this.order.OrderItems.forEach((orderItem)=> {        
              if (orderItem.Item.CatalogNumber == item.CatalogNumber)
                orderItem.Item.Quantity = item.Item.Quantity;   
              if (orderItem.Items) {
                 orderItem.Items.forEach((gi) => {
                  if (gi.Item.CatalogNumber == item.Item.CatalogNumber)            
                    gi.Item.Quantity = item.Item.Quantity;
                });         
              
              }                  
          });
        }
       
      } else {
        if (this.isMobileMode()) {
         // this.remove(item, isPizza);
        }
      }
    }
    this.checkForCombo();
    this.orderService.recalculateSum();
    this.checkRemoveBonusItems();
    this.checkRemoveUpgrade();
  }

  isInStock(orderItem){
    if (orderItem.Item.Quantity < 1) return false;
    if (orderItem.Items) {
      orderItem.Items.forEach((gi) => {
        if (gi.Item.Quantity < gi.Amount)            
          return false;
        });         
              
    }   
    return true;
  }


  displayBranchPhone()  {
    if (AppConfig.configSettings.displayBranchPhoneLink && 
        this.currentBranch.BranchPhone != null &&  this.currentBranch.BranchPhone != undefined &&
        this.currentBranch.BranchPhone.trim() != "") {
      return true;
    } else {
      return false;
    }
  }

  private checkRemoveBonusItems() {
    if (AppConfig.configSettings.minAmountForBonus) {
      let bonusItemsSum = 0;
      const bonusItems = this.order.OrderItems.filter((i)=> 
        {return i.IsBonus});
      bonusItems.forEach((bonusItem)=> {
        let garnishesSum = 0;
        if (bonusItem.Garnishes) {
          bonusItem.Garnishes.forEach((garnish: GarnishAppAdvancedModel) => {
            if (garnish.MaxAmount && garnish.SelectedAmount) {
              garnishesSum += garnish.Price * garnish.SelectedAmount;
            } else {
              garnishesSum += garnish.Price;
            }
          });
        }
        bonusItemsSum += (bonusItem.Price + garnishesSum) * (bonusItem.Amount || 1);
      });
        
      if (this.order.Sum - bonusItemsSum < AppConfig.configSettings.minAmountForBonus) {
        bonusItems.forEach((bonusItem)=> {this.remove(bonusItem, false)});
        this.order.hasBonusItems = false;
        this.orderService.recalculateSum();
      }             
    }
  }

  public remove(item, isPizza?) {
    // display warning msg
    console.log("remove");
    let header = this.translationService.translate('ERROR');
      let icon = "../../../assets/images/items/important-message.svg";
    if (AppConfig.configSettings.minAmountForBonus && !item.IsBonus) {
     const msg = this.translationService.translate('ORDER_BONUS_WARNING')
           + ' ' +  this.translationService.translate('COMMON_CASH')
           +  AppConfig.configSettings.minAmountForBonus;
     const matDialogRef = this.matDialog.open(MessagePopupComponent, {
       data: {
         header,
         icon,
               message: msg,
               withoutTimeout: true
             },
       minWidth: '400px',
       disableClose: true,
       panelClass: 'custom-mat-dialog-popup'
     });
     matDialogRef.afterClosed().subscribe((result) => {});
   } 

   if (isPizza) {
     this.order.OrderPizzas.splice(this.order.OrderPizzas.indexOf(item), 1);
   } else {
    if (!this.currentBranch.UseInventory ) {
      this.order.OrderItems.splice(this.order.OrderItems.indexOf(item), 1);
    } else {
      let amount = item.amount;
      this.categories.forEach((cat)=> {
        cat.Items.forEach((i)=> {
          if (i.CatalogNumber == item.Item.CatalogNumber){
            console.log(i)
            i.Quantity += item.Amount;   
          }
                  
        });
      });
     
   this.order.OrderItems.splice(this.order.OrderItems.indexOf(item), 1);
   if (this.order.OrderItems.length > 0){
    this.order.OrderItems.forEach((orderItem)=> {        
      if (orderItem.Item.CatalogNumber == item.CatalogNumber)
        orderItem.Item.Quantity += amount;                 
    });
   }
    }
     
   }
  
   this.checkOrderResultHeight();

   this.checkForCombo();
   this.orderService.recalculateSum();

   if (!item.IsBonus) {
     this.checkRemoveBonusItems();
   }
   this.checkRemoveUpgrade();
 }

 private checkRemoveUpgrade() {
  const hasUpgrageItems = this.order.OrderItems.filter((i) => { return i.Item.MealUpgrade });
  const upgrageItems = this.order.OrderItems.filter((i) => { return i.IsUpgrade });
  if (upgrageItems.length > hasUpgrageItems.length){
    console.log("upgrageItems",upgrageItems)
    var item = upgrageItems[0];
    if (item.Amount > 1) {
      item.Amount--;
      this.orderService.recalculateSum();
    } else {
      this.order.OrderItems.splice(this.order.OrderItems.indexOf(item), 1);
      this.orderService.recalculateSum();
    }
  }
  
    
  
}

 @ViewChild('otherIdentifier')
 otherIdentifier: ElementRef;

 public checkOrderResultHeight(){
  if(!this.isMobileMode()){
  console.log("!!!!!!!!!!checkOrderResultHeight()")
  //var resultHeight = document.getElementById("myOrderResult").style.height;
  var height = this.otherIdentifier.nativeElement.offsetHeight;
  console.log("height",height);

  if(height<930){
    console.log("HEIGHT < 1000");
    var resultBTN = document.getElementById("result-btn");
    var perfectScroll = document.getElementById("my-scroll");
    perfectScroll.classList.remove("greater-scroll-height");
    console.log("resultBTN", resultBTN);
    resultBTN.classList.remove("greater-height");
  }
}
}

public returnToPrevPage() {
  localStorage.removeItem(window.location.hash);
  this.router.navigate([`/${this.franchiseId}/home`]);
}

 public removeCombo(item) {
  // display warning msg
  let header = this.translationService.translate('ERROR');
      let icon = "../../../assets/images/items/important-message.svg";
  if (AppConfig.configSettings.minAmountForBonus) {
   const msg = this.translationService.translate('ORDER_BONUS_WARNING')
         + ' ' +  this.translationService.translate('COMMON_CASH')
         +  AppConfig.configSettings.minAmountForBonus;
   const matDialogRef = this.matDialog.open(MessagePopupComponent, {
     data: {
       header,
       icon,
             message: msg,
             withoutTimeout: true
           },
     minWidth: '400px',
     disableClose: true,
     panelClass: 'custom-mat-dialog-popup'
   });
   matDialogRef.afterClosed().subscribe((result) => {});
 } 

  this.order.OrderCombos.splice(this.order.OrderCombos.indexOf(item), 1);
 
  this.orderService.recalculateSum();
  this.checkRemoveBonusItems();
 
}

  private initializeGraphics() {
    this.graphics.logo = AppConfig.settings.logo;
    this.colors.menuColor = AppConfig.settings.menuColor;
    this.colors.buttonColor = AppConfig.settings.buttonColor;
    this.colors.priceColor = AppConfig.settings.priceColor;
    this.lang = this.translationService.language();
    this.cashSymbol = AppConfig.cashSymbol;
  }

  /*private loadItemPopup(item) {
    const initialState = {
      item: item
    };
    this.bsModalRef = this.modalService.show(ItemComponent, 
      {initialState, class:''});
     this.modalService.onHide
    .pipe(take(1)).subscribe(() => {

        console.log("menu close modal item",this.bsModalRef.content)
        if (this.bsModalRef.content.isSaved && this.bsModalRef.content.item) {
          const orderItem = this.prepareItemForOrder(this.bsModalRef.content.item);
          const index = this.getIndexIfNotHavingGarnishes(this.bsModalRef.content.item);
         
          if (index >= 0) {
          
            const item = this.order.OrderItems[index];
           
            item.Amount += orderItem.Amount;
         
          } else {
          
            this.order.OrderItems.push(orderItem);
           
          }
          this.orderService.recalculateSum();
          this.resetItem(item);
          if (item.MealUpgrade && this.upgradeItems && this.upgradeItems.length>0) {
            this.loadSuccessAddingToCartMessage(true);
          } else {
            this.loadSuccessAddingToCartMessage(false);
          }
         // this.loadSuccessAddingToCartMessage();
        }
    });
     
  }*/

}
