//import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule} from '@angular/core';
import { NewPizzaComponent } from './new-pizza.component';
import { PizzaComponent } from './pizza.component';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { SizeModule } from './size/size.module';
import { SharedModule } from '../../../shared/shared.module';
import { QuartersModule } from './quarters/quarters.module';
import {NgScrollbarModule} from "ngx-scrollbar";
import {PizzaSizeModule} from "./pizza-size/pizza-size.module";
import {PizzaBuilderModule} from "./pizza-builder/pizza-builder.module";
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
@NgModule({
  declarations: [
    NewPizzaComponent,
    PizzaComponent
  ],
  imports: [
    CommonModule,
    //BrowserModule,
    HttpClientModule,
    SharedModule,
    NgSelectModule,
    FormsModule,
    SizeModule,
    NgScrollbarModule,
    PerfectScrollbarModule,
    QuartersModule,
    PizzaBuilderModule,
    PizzaSizeModule
  ],
  providers: [
  ],
  bootstrap: [
    NewPizzaComponent,
    PizzaComponent
  ],
  entryComponents: [

  ]
})
export class NewPizzaModule { }
