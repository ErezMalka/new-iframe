//import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';
import { DiscountComponent } from './discount.component';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from "@ng-select/ng-select";
import { TranslationsModule } from "../../translations/translations.module";
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    DiscountComponent,
  ],
  imports: [
    CommonModule,
    //BrowserModule,
    HttpClientModule,
    NgSelectModule,
    TranslationsModule,
  ],
  exports: [
    DiscountComponent
  ],
  providers: [ ]
})
export class DiscountModule { }
