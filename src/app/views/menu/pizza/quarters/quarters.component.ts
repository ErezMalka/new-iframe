import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToppingAppAdvancedModel } from '../../../../models/advanced/pizza/topping-app-advanced.model';
import { AppConfig } from '../../../../app.config';
import { PizzaAppAdvancedModel } from '../../../../models/advanced/pizza/pizza-app-advanced.model';
import { CommonFunctionsService } from '../../../../core/services/common-settings/common-functions.service';
import { TranslationsService } from '../../../../shared/translations/translations.service';
@Component({
  selector: 'quarters',
  templateUrl: './quarters.component.html',
  styleUrls: ['./quarters.component.scss']
})
export class QuartersComponent implements OnInit {

  public lang: string;
  public cashSymbol: string;
  public selectedColor:string;

  @Input()
  public topping: ToppingAppAdvancedModel;

  @Output()
  public quartersSelected = new EventEmitter<any>();

  @Input()
  public isShouldBeSelected: boolean = false;

  @Input()
  public pizza: any;

  @Input()
  public disabled: boolean = false;

  @Input()
  public enabled: boolean = true;

  @Input()
  public isShowInHalfs: boolean = false;
  selectedQuartersCounter: number = 0;
  continue: boolean = false;


  constructor(
    public commonFunctionService: CommonFunctionsService,
    private translationsService: TranslationsService,
  ) { }

  ngOnInit(){
    this.selectedColor = AppConfig.settings.buttonColor;
    //console.log("Quarters Comp - ngOnInit - this.pizza", this.pizza);
    //console.log("Quarters Comp - ngOnInit - this.topping", this.topping);
  }


  public getLanguage() {
    return this.translationsService.language();
  }

  public selectQuarter(quarter, topping, $event) {

    console.log("QUARTER COMP - selectedQuarter()");
    console.log("quarter", quarter);
    console.log("topping", topping);
    const myToppping = this.commonFunctionService.deepCopy(topping);
    console.log("myToppping", myToppping);
    console.log("this.pizza", this.pizza);

    if(topping.FirstQuarter==false && topping.SecondQuarter==false && topping.ThirdQuarter==false && topping.ForthQuarter==false){
      topping.IsSelect = false;
    } 

    console.log("topping", topping);


    if(!this.continue) {
      console.log("if(!this.continue)");


      if (this.disabled) {
        return;
      }
      if (this.enabled) {
        let selectedQuarter = 0;
        switch (quarter) {
          case 'Quarter1': {
            selectedQuarter = 1;
            break;
          }
          case 'Quarter2': {
            selectedQuarter = 2;
            break;
          }
          case 'Quarter3': {
            selectedQuarter = 3;
            break;
          }
          case 'Quarter4': {
            selectedQuarter = 4;
            break;
          }
        }
        if ($event) {
          $event.stopPropagation();
        }
        console.log("selectedQuarter", selectedQuarter);
        console.log("topping", topping);
        this.quartersSelected.emit({
          selectedQuarter,
          topping
        });
      }
    }
    /*if (this.pizza.ComboPizza && this.pizza.ComboPizza.MaxToppings) {
      console.log("if (this.pizza.ComboPizza && this.pizza.ComboPizza.MaxToppings)");
      this.pizza.SelectedToppings.forEach((seltop) => {
        this.selectedQuartersCounter += seltop.QuarterNums.length;
        console.log("this.selectedQuartersCounter", this.selectedQuartersCounter);
        console.log("this.pizza.ComboPizza.MaxToppings", this.pizza.ComboPizza.MaxToppings);
        if (this.selectedQuartersCounter == this.pizza.ComboPizza.MaxToppings * 4) {
          console.log("return");
          this.continue = true;
          return;
        }

      });
    }*/
  }

}
