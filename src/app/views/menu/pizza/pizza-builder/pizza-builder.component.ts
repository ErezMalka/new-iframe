import { Component, Inject, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToppingAppAdvancedModel } from '../../../../models/advanced/pizza/topping-app-advanced.model';
import { PizzaAppAdvancedModel } from '../../../../models/advanced/pizza/pizza-app-advanced.model';
import { CommonFunctionsService } from "../../../../core/services/common-settings/common-functions.service";

import { AppConfig } from '../../../../app.config';
import { MatDialogRef, MAT_DIALOG_DATA , MatDialogConfig } from '@angular/material/dialog';
import { TranslationsService } from '../../../../shared/translations/translations.service';

class  PizzaBuilderData {
  pizza: PizzaAppAdvancedModel;
  topping: ToppingAppAdvancedModel;
  isShowInHalfs: boolean = false;  
  isEdit: any;
  selectFreeTop:boolean=false;
  //isCombo: boolean;
}

@Component({
  selector: 'pizza-builder',
  templateUrl: './pizza-builder.component.html',
  styleUrls: ['./pizza-builder.component.scss']
})
export class PizzaBuilderComponent implements OnInit {

  public lang: string;
  public cashSymbol: string;
  public selectedColor:string;
  public selectedQuarter:number = 0;
  public selectedQuarters:number[] = [];
 // public currentTopping: ToppingAppAdvancedModel;
 // @Input()
  public currentTopping: ToppingAppAdvancedModel;
  public pizza: PizzaAppAdvancedModel;
  public buttonColor:string;
  public selectFreeTop:boolean = false;

  //@Output()
 //public quartersSelected = new EventEmitter<any>();

 // @Input()
 // public isShouldBeSelected: boolean = false;

  //@Input()
 // public disabled: boolean = false;

 // @Input()
 // public enabled: boolean = true;

 // @Input()
  public isShowInHalfs: boolean = false;
  isEdit: any;

  constructor ( public dialogRef: MatDialogRef<PizzaBuilderComponent>,
    private translationService: TranslationsService,
    public commonFunctionsService: CommonFunctionsService,

    @Inject(MAT_DIALOG_DATA) public data: PizzaBuilderData
  ) { 

    if (this.data) {
      this.currentTopping = this.commonFunctionsService.deepCopy(this.data.topping);

        if(this.currentTopping.FirstQuarter == true){
          this.currentTopping.QuarterNums.push(1);
        }
        if(this.currentTopping.SecondQuarter == true){
          this.currentTopping.QuarterNums.push(2);
        }
        if(this.currentTopping.ThirdQuarter == true){
          this.currentTopping.QuarterNums.push(3);
        }
        if(this.currentTopping.ForthQuarter == true){
          this.currentTopping.QuarterNums.push(4);
        }

      this.isShowInHalfs = this.data.isShowInHalfs;
      this.pizza= this.data.pizza;
      this.isEdit = this.data.isEdit;
      this.selectFreeTop = this.data.selectFreeTop;
    }
  }

  ngOnInit(){
    this.selectedColor = AppConfig.settings.buttonColor;
    this.initializeSettings();
  }

  private initializeSettings() {
    this.lang = this.translationService.language();
    this.cashSymbol = AppConfig.cashSymbol;
    
    this.buttonColor = AppConfig.settings.buttonColor;
  }

  private checkSelectedToppingDefaultSelectedInPizza(toppingId) {
    //  console.log("checkToppingDefaultSelectedInPizza",this.pizza.PizzaToppings, topping);
      if (this.pizza ) {
        return this.pizza.PizzaToppings.some((pizzaTopping) => {
          return pizzaTopping && pizzaTopping.Id && 
          pizzaTopping.Id === toppingId;
        });
      }
      return false;
    }

  public selectQuarter(quarter, topping, $event) {

    console.log("BUILDER - selectQuarter()");

    //console.log("topping", topping);
    
    let counter=0;
      let selectedToppingsCounter = 0;
    if (this.selectFreeTop && this.pizza.SelectedToppings.length > 0) {
     
      this.pizza.SelectedToppings.forEach((t) => {
    //   console.log("t", this.checkSelectedToppingDefaultSelectedInPizza(t.ToppingId));
        if (!this.checkSelectedToppingDefaultSelectedInPizza(t.ToppingId))
          counter += t.QuarterNums.length;
        
        selectedToppingsCounter++;
        if (selectedToppingsCounter == this.pizza.SelectedToppings.length){
          if (counter + this.selectedQuarters.length  < this.pizza.MaxFreeToppings * 4) {
            switch (quarter) {
              case 'Quarter1': {
                this.selectedQuarter = 1;
                this.currentTopping.FirstQuarter=!this.currentTopping.FirstQuarter;
                break;
              }
              case 'Quarter2': {
                this.selectedQuarter = 2;
                this.currentTopping.SecondQuarter=!this.currentTopping.SecondQuarter;
                break;
              }
              case 'Quarter3': {
                this.selectedQuarter = 3;
                this.currentTopping.ThirdQuarter=!this.currentTopping.ThirdQuarter;
                
                break;
              }
              case 'Quarter4': {
                this.selectedQuarter = 4;
                this.currentTopping.ForthQuarter=!this.currentTopping.ForthQuarter;
                break;
              }
            }
            
          } else {
            switch (quarter) {
              case 'Quarter1': {
                this.selectedQuarter = 1;
                this.currentTopping.FirstQuarter=false;
                break;
              }
              case 'Quarter2': {
                this.selectedQuarter = 2;
                this.currentTopping.SecondQuarter=false;
                break;
              }
              case 'Quarter3': {
                this.selectedQuarter = 3;
                this.currentTopping.ThirdQuarter=false;
                
                break;
              }
              case 'Quarter4': {
                this.selectedQuarter = 4;
                this.currentTopping.ForthQuarter=false;
                break;
              }
            }
           
          }
        }
        
       
      });

    } else {
      switch (quarter) {
        case 'Quarter1': {
          this.selectedQuarter = 1;
          this.currentTopping.FirstQuarter=!this.currentTopping.FirstQuarter;
          break;
        }
        case 'Quarter2': {
          this.selectedQuarter = 2;
          this.currentTopping.SecondQuarter=!this.currentTopping.SecondQuarter;
          break;
        }
        case 'Quarter3': {
          this.selectedQuarter = 3;
          this.currentTopping.ThirdQuarter=!this.currentTopping.ThirdQuarter;
          
          break;
        }
        case 'Quarter4': {
          this.selectedQuarter = 4;
          this.currentTopping.ForthQuarter=!this.currentTopping.ForthQuarter;
          break;
        }
      }
    }
   

      
      if ($event) {
        $event.stopPropagation();
      }

      if(this.isEdit && this.isShowInHalfs){
        if(!this.currentTopping.FirstQuarter || !this.currentTopping.SecondQuarter){
          this.pizza.SelectedToppings.forEach(selTop => {
            if(selTop.ToppingId == this.currentTopping.Id){

              selTop.QuarterNums.splice(selTop.QuarterNums.indexOf(1), 1);
              selTop.QuarterNums.splice(selTop.QuarterNums.indexOf(2), 1);

              //console.log("selTop.FirstQuarter", selTop.FirstQuarter);
            }
          });
        }

        if(!this.currentTopping.ThirdQuarter || !this.currentTopping.ForthQuarter){
          this.pizza.SelectedToppings.forEach(selTop => {
            if(selTop.ToppingId == this.currentTopping.Id){

              selTop.QuarterNums.splice(selTop.QuarterNums.indexOf(3), 1);
              selTop.QuarterNums.splice(selTop.QuarterNums.indexOf(4), 1);

              //console.log("selTop.FirstQuarter", selTop.FirstQuarter);
            }
          });
        }
      }

      
     // if (!this.selectedQuarters.find(e => {
       // return e === this.selectedQuarter })) {
        //  this.selectedQuarters.push(this.selectedQuarter);
        //}

        const index = this.selectedQuarters.findIndex((e) => {
          return e == this.selectedQuarter;
        });


        if (index >= 0) {
          this.selectedQuarters.splice(index, 1);
        } else {
          if (this.selectFreeTop){
            if (counter + this.selectedQuarters.length < this.pizza.MaxFreeToppings * 4){
              this.selectedQuarters.push(this.selectedQuarter);
            }
          } else {
            this.selectedQuarters.push(this.selectedQuarter);
          }
          
          
        }
      //this.quartersSelected.emit({
       // this.selectedQuarter,
       // topping
      //});
     // }
      //}
  }

  public closeToppingSelect(save:boolean) {
    if (save) {
      this.dialogRef.close({
        selectedQuarters:  this.selectedQuarters,
      //  additionItems: this.additionItems,
        //topping: this.currentTopping,
        isSaved: save
      });
    } else {
      this.dialogRef.close({
        selectedQuarters: [],
        isSaved: false
      });
    }
  }

}
