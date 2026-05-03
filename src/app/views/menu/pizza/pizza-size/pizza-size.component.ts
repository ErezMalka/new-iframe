import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA , MatDialogConfig } from '@angular/material/dialog';
import { TranslationsService } from '../../../../shared/translations/translations.service';
import { AppConfig } from '../../../../app.config';
import { AppStorageService } from '../../../../app.storage.service';
import { ToppingAppModel } from '../../../../models/menu/topping-app.model';
import { PizzaPriceAppModel } from '../../../../models/pizza/pizza-price-app.model';
import { PizzaAppAdvancedModel } from '../../../../models/advanced/pizza/pizza-app-advanced.model';
import { ToppingPriceAppModel } from '../../../../models/menu/topping-price-app.model';
import { ToppingAppAdvancedModel } from '../../../../models/advanced/pizza/topping-app-advanced.model';
import { CommonFunctionsService } from "../../../../core/services/common-settings/common-functions.service";
import {BrowserIdentificatorService} from "../../../../core/services/common-settings/browser-identificator.service";
import {SizeMobileInitializationComponent} from '../../../../shared/classes/size-mobile-initialization.component';

class PizzaData {
  pizza: PizzaAppAdvancedModel;
  pizzaSize: PizzaPriceAppModel;
  specialRequests: string;
}

@Component({
  selector: 'pizza',
  templateUrl: './pizza-size.component.html',
  styleUrls: ['./pizza-size.component.scss']
})
export class PizzaSizeComponent extends SizeMobileInitializationComponent implements OnInit {

  public lang: string;
  public cashSymbol: string;

  public pizza: PizzaAppAdvancedModel;
  public toppings: ToppingAppModel[];

  public selectedPrice: PizzaPriceAppModel;
  // For scrollbar:
  public disabled = this.isMobileBrowser();
  public shown: 'native' | 'hover' | 'always' = 'native';

  public currentTopping: ToppingAppAdvancedModel;
  public defaultPizzaSize = 140;

  private specialRequests: string;

  public sizeOfPizzaImage = 0;
  public extraIndex = 10;

  constructor (
    private appStorageService: AppStorageService,
    private translationService: TranslationsService,
    public dialogRef: MatDialogRef<PizzaSizeComponent>,
    protected browserIdentificatorService: BrowserIdentificatorService,
    public commonFunctionService: CommonFunctionsService,
    @Inject(MAT_DIALOG_DATA) public data: PizzaData
  ) {
    super(browserIdentificatorService);
    if (this.data) {
      this.pizza = this.data.pizza;
      if (this.pizza) {
        const countOfPizzas = this.pizza.PizzaPrices.length || 0;
        if (countOfPizzas) {
          this.sizeOfPizzaImage = (this.defaultPizzaSize / countOfPizzas);
        }
      }
      this.specialRequests = this.data.specialRequests;
      this.preparePizza();
    }
    this.toppings = this.appStorageService.pizzaToppings;
    this.initializeSize();
  }

  slideConfig = {
    "slidesToShow": 4,
    "slidesToScroll": 1,
    "draggable": false,
    "arrows": false,
    "infinite": false,
    //"variableWidth": true
  };


  @ViewChild('slickModal')
  public carousel: ElementRef;
  private interval = 5000;
  private instanceInterval;
  private index = this.slideConfig.slidesToShow;
  private timeOut = 2000;
  private timeOutInterval;


  public autoPlayCarousel() {
    clearInterval(this.instanceInterval);
    this.timeOutInterval = setTimeout(() => {
      clearTimeout(this.timeOutInterval);
      this.instanceInterval = setInterval(() => {
        if (!this.isMobileMode()) {
          const slickModal: any = this.carousel;
          slickModal.slickNext();
          this.index++;
          if (slickModal.slides && this.index === slickModal.slides.length) {
            this.autoPlayCarouselReverse();
          }
        }
      }, this.interval);
    }, this.timeOut);
  }

  public autoPlayCarouselReverse() {
    clearInterval(this.instanceInterval);
    this.timeOutInterval = setTimeout(() => {
      clearTimeout(this.timeOutInterval);
      this.instanceInterval = setInterval(() => {
        if (!this.isMobileMode()) {
          const slickModal: any = this.carousel;
          slickModal.slickPrev();
          this.index--;
          if (slickModal.slides && this.index === this.slideConfig.slidesToShow) {
            this.autoPlayCarousel();
          }
        }
      }, this.interval);
    }, this.timeOut);
  }

  public stopAutoPlayCarousel() {
    clearInterval(this.instanceInterval);
    clearTimeout(this.timeOutInterval);
    this.index = this.slideConfig.slidesToShow;
  }

  private preparePizza() {
    // Deep cloning to avoid select multiple items
    this.pizza = this.commonFunctionService.deepCopy(this.pizza);
    // const e1 = {...this.pizza};
  }

  ngOnInit() {
    this.initializeSettings();
    this.checkPizzaSettings();
    this.pizzaCarouselSetting();
  }

  private pizzaCarouselSetting() {
    if (this.pizza && this.pizza.PizzaPrices && this.pizza.PizzaPrices.length > this.slideConfig.slidesToShow) {
      this.autoPlayCarousel();
    }
  }

  public isMobileBrowser() {
    return this.browserIdentificatorService.isMobile.Android() ||
      this.browserIdentificatorService.isMobile.Windows() ||
      this.browserIdentificatorService.isMobile.iOS();
  }

  private checkToppingDefaultSelectedInPizza(topping) {
    if (this.pizza && topping && this.pizza.PizzaToppings) {
      return this.pizza.PizzaToppings.some((pizzaTopping) => {
        return pizzaTopping && pizzaTopping.Id && pizzaTopping.Id === topping.Id;
      });
    }
    return false;
  }

  public selectPizzaSize(pizzaPrice) {

    // Default or the first selected pizza; the next time just selected pizza
    this.pizza.SelectedPizzaPriceSize = pizzaPrice;

    if (this.toppings) {
      this.toppings.forEach((topping: ToppingAppAdvancedModel) => {
        if (topping) {
          let toppingPrice: ToppingPriceAppModel = new ToppingPriceAppModel();
          toppingPrice.Price = 0;

          if (this.pizza.PizzaToppings && this.pizza.PizzaToppings.find((e) => {
            return e.Id === topping.Id;
          }) === undefined) {
            toppingPrice = topping.ToppingPrices.find((e) => {
              return e.PizzaSizeId == pizzaPrice.PizzaSizeId
            });
          }
          if (toppingPrice) {
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
          }

        }

      });
    }
  }

  public selectSize(pizzaPrice) {
    this.stopAutoPlayCarousel();
    this.selectedPrice = pizzaPrice;
    this.selectPizzaSize(this.selectedPrice);
  }

  public colors = {
    menuColor: '',
    buttonColor: ''
  };

  private initializeSettings() {
    this.lang = this.translationService.language();
    this.cashSymbol = AppConfig.cashSymbol;
    this.colors.menuColor = AppConfig.settings.menuColor;
    this.colors.buttonColor = AppConfig.settings.buttonColor;
  }

  public closeAndNotSaveGarnishes() {
    this.dialogRef.close({ });
  }

  public saveSizePizza(isPrevious?) {
    this.dialogRef.close({
      pizza: this.pizza,
      pizzaSize: this.selectedPrice,
      isSaved: true,
      specialRequests: this.specialRequests
    });
  }

  private preparePreSelectedPizzaSizesAndToppings() {
    if (this.pizza) {

    }
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
      if (this.pizza && this.pizza.SelectedPizzaPriceSize) {
        const pizzaPrice = this.pizza.PizzaPrices.find((price) => {
          return price && price.Id === this.pizza.SelectedPizzaPriceSize.Id;
        });
        if (pizzaPrice) {
          this.selectedPrice = pizzaPrice;
        } else {
          this.selectedPrice = this.pizza.PizzaPrices[0];
        }
      } else if (this.pizza.PizzaPrices && this.pizza.PizzaPrices.length > 0) {
        const pizzaPrice = this.pizza.PizzaPrices.find((price) => {
          return price.IsDefault;
        });
        if (pizzaPrice) {
          this.selectedPrice = pizzaPrice;
        } else {
          this.selectedPrice = this.pizza.PizzaPrices[0];
        }
        this.selectPizzaSize(this.selectedPrice);
      }
    }
  }

}
