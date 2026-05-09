import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrderAppModel } from "../../models/order/order-app.model";
import {GarnishAppAdvancedModel} from "../../models/advanced/menu/garnish-app-advanced.model";
import {OrderPizzaAppAdvancedModel} from "../../models/advanced/order/order-pizza-app-advanced.model";
import {OrderComboAppModel} from "../../models/order/order-combo-app.model";
import { AppConfig } from '../../app.config';
import { Observable } from "rxjs";
import { ConfigService } from './common-settings/config.service';

@Injectable()
export class OrderService {

  private order: OrderAppModel;

  constructor(private http: HttpClient,
    private configService: ConfigService) {
    this.resetOrder();
  }

  public GetOrderInfo(orderId): Observable<any> {
    return this.http.get(this.configService.serverUrl +
      'Order/GetOrderInfo?orderId=' + orderId);
  }

  public GetPreviouseOrders(loginToken): Observable<any> {
    return this.http.get(this.configService.serverUrl +
      'Order/GetPreviouseOrders?loginToken=' + loginToken + "&franchiseId=" + this.configService.franchiseId) ;
  }

  public resetOrder() {
    console.log("resetOrder");
    this.order = new OrderAppModel();
    this.order.OrderItems = [];
    this.order.OrderPizzas = [];
    this.order.OrderCombos = [];
    this.order.Sum = 0;
    this.order.hasBonusItems = false;
  }

  //tax:
  public tax(usaTaxProc) {
    if (usaTaxProc) {
      let procMulti = (usaTaxProc / 100) + 1;
      this.order.SumWithTax = (this.order.Sum * procMulti).toFixed(2);
    }
  }


  public getOrder() {
    return this.order;
  }

  public setOrder(order) {
    
      this.order = order;
  }

  public recalculateSum() {

    let sum = 0;
    if (this.order) {

      if (this.order.OrderItems) {
        const orderItems = this.order.OrderItems.filter((item) => {
          return !item.IsClubMemberItem;
        });
        // Items:
        if (orderItems) {
          orderItems.forEach((item) => {
            let garnishesSum = 0;
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
           
            if (item.Garnishes) {
              item.Garnishes.forEach((garnish: GarnishAppAdvancedModel) => {
                if (garnish.MaxAmount && garnish.SelectedAmount) {
                  garnishesSum += garnish.Price * garnish.SelectedAmount;
                } else {
                  garnishesSum += garnish.Price;
                }
              })
            }
            sum += (item.Price + garnishesSum) * (item.Amount || 1);
          });
        }
        // Pizzas:
        if (this.order.OrderPizzas) {
          
          this.order.OrderPizzas.forEach((pizza: OrderPizzaAppAdvancedModel) => {
            let garnishesSum = 0;
            if (pizza.Garnishes) {//FullPizza.SelectedGarnishes
              pizza.Garnishes.forEach((garnish: GarnishAppAdvancedModel) => {
                if (garnish.MaxAmount && garnish.SelectedAmount) {
                  garnishesSum += garnish.Price * garnish.SelectedAmount;
                } else {
                  garnishesSum += garnish.Price;
                }
              });
            }
            let pizzaSum = 0;
            if (pizza.FullPizza && pizza.FullPizza.SelectedPizzaPriceSize &&
              !isNaN(pizza.FullPizza.SelectedPizzaPriceSize.Price)) {
              pizzaSum += pizza.FullPizza.SelectedPizzaPriceSize.Price;
            }
            pizza.FullPizza.SelectedToppings.forEach((topping) => {
              if (topping && topping.TotalPrice && !isNaN(topping.TotalPrice)) {
                pizzaSum += topping.TotalPrice;
              }
            });
            sum += (pizzaSum + garnishesSum) * (pizza.FullPizza.Amount || 1) ;
            //sum += pizzaSum * (pizza.FullPizza.Amount || 1) + (garnishesSum || 0)
          });
        }
        if (this.order.OrderCombos) {
          this.order.OrderCombos.forEach((combo: OrderComboAppModel) => {
            sum += combo.Price * (combo.Amount || 1);
            let extraPrice = 0;
            let garnishesSum = 0;
            if (combo.Pizzas) {
              combo.Pizzas.forEach((pizza) => {
                extraPrice += pizza.FullPizza.PriceInCombo;
                if (pizza.Garnishes) {//pizza.FullPizza.SelectedGarnishes
                  pizza.Garnishes.forEach((garnish: GarnishAppAdvancedModel) => {
                    if (garnish.MaxAmount && garnish.SelectedAmount) {
                      garnishesSum += garnish.Price * garnish.SelectedAmount;
                    } else {
                      garnishesSum += garnish.Price;
                    }
                  })
                }
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
             
            sum += extraPrice * (combo.Amount || 1) + (garnishesSum || 0) ;
          });
        }

      }
      this.order.Sum = sum;
    
    //  if (this.order.Sum > 0) {
        localStorage.setItem(window.location.hash, JSON.stringify(this.order));
        
     // } else {
        //localStorage.removeItem(window.location.hash);
     // }

    }
  }

}
