//import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule} from '@angular/core';
import { DiscountCouponComponent } from './discount-coupon.component';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from "@ng-select/ng-select";
import { CustomMaterialModule } from "../../../shared/custom-material.module";
import { SharedModule } from "../../../shared/shared.module";

@NgModule({
  declarations: [
    DiscountCouponComponent
  ],
  imports: [
    //BrowserModule,
    CommonModule,
    HttpClientModule,
    NgSelectModule,
    CustomMaterialModule,
    SharedModule
  ],
  exports: [
    DiscountCouponComponent
  ],
  providers: [ ]
})
export class DiscountCouponModule { }
