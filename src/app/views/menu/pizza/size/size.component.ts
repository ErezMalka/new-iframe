import { Component, Input, OnInit } from '@angular/core';
import { PizzaPriceAppModel } from '../../../../models/pizza/pizza-price-app.model';

@Component({
  selector: 'size',
  templateUrl: './size.component.html',
  styleUrls: ['./size.component.scss']
})
export class SizeComponent implements OnInit {

  public lang: string;
  public cashSymbol: string;

  @Input()
  public pizzaSize: PizzaPriceAppModel;

  @Input()
  public imageUrl: string;

  @Input()
  public size: number;

  @Input()
  public color: string;

  @Input()
  public selected: boolean = false;

  public defaultSize = 5;

  constructor() {
  }

  ngOnInit(){

  }

  public selectSize() {
    // this.selected = !this.selected;
  }

  public displayCondition() {
    return this.pizzaSize && this.pizzaSize.Price != undefined && this.pizzaSize.Price != null;
  }

}
