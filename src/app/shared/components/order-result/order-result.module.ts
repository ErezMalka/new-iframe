//import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';
import { OrderResultComponent } from './order-result.component';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from "@ng-select/ng-select";
import {TranslationsModule} from "../../translations/translations.module";
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    OrderResultComponent
  ],
  imports: [
    CommonModule,
   // BrowserModule,
    HttpClientModule,
    NgSelectModule,
    TranslationsModule
  ],
  exports: [
    OrderResultComponent
  ],
  providers: [ ]
})
export class OrderResultModule { }
