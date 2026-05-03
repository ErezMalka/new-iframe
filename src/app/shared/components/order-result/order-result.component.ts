import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { TranslationsService } from '../../translations/translations.service';
import { AppConfig } from '../../../app.config';
import {OrderAppModel} from "../../../models/order/order-app.model";
import {SizeMobileInitializationComponent} from '../../classes/size-mobile-initialization.component';
import {BrowserIdentificatorService} from '../../../core/services/common-settings/browser-identificator.service';
import {OrderPizzaAppAdvancedModel} from "../../../models/advanced/order/order-pizza-app-advanced.model";

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
    buttonColor: ''
  };

  public lang: string;

  public cashSymbol: string;

  @Input()
  public order: OrderAppModel;

  @Output()
  public removeAll: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public makeOrder: EventEmitter<any> = new EventEmitter<any>();

  constructor( private translationService: TranslationsService,
               protected browserIdentificatorService: BrowserIdentificatorService) {
    super(browserIdentificatorService);
  }

  ngOnInit() {
    this.initializeGraphics();
    this.initializeSize();
  }

  public countOfItems() {
    let count = 0;
    if (this.order && this.order.OrderItems) {
      count = this.order.OrderItems.reduce((sum, item) => {
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
    if (this.order && this.order.OrderPizzas) {
      count = this.order.OrderPizzas.reduce((sum, item) => {
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

  private initializeGraphics() {
    this.graphics.logo = AppConfig.settings.logo;
    this.colors.menuColor = AppConfig.settings.menuColor;
    this.colors.buttonColor = AppConfig.settings.buttonColor;
    this.lang = this.translationService.language();
    this.cashSymbol = AppConfig.cashSymbol;
  }

}
