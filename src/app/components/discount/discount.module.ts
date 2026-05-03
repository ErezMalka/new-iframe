import { CommonModule } from '@angular/common';
import { NgModule} from '@angular/core';
import { DiscountComponent } from './discount.component';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from "@ng-select/ng-select";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  declarations: [
    DiscountComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    NgSelectModule,
    SharedModule
  ],
  exports: [
    DiscountComponent
  ],
  providers: [ ]
})
export class DiscountModule { }
