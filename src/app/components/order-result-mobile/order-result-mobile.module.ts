import { NgModule} from '@angular/core';
import { OrderResultMobileComponent } from './order-result-mobile.component';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from "@ng-select/ng-select";
import {TranslationsModule} from "../../shared/translations/translations.module";
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    OrderResultMobileComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    NgSelectModule,
    TranslationsModule
  ],
  exports: [
    OrderResultMobileComponent
  ],
  providers: [ ]
})
export class OrderResultMobileModule { }
