//import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule} from '@angular/core';
import { ScratchCouponComponent } from './scratch-coupon.component';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from "@ng-select/ng-select";
import { CustomMaterialModule } from "../../../shared/custom-material.module";
import { SharedModule } from "../../../shared/shared.module";

@NgModule({
  declarations: [
    ScratchCouponComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    NgSelectModule,
    CustomMaterialModule,
    SharedModule
  ],
  exports: [
    ScratchCouponComponent
  ],
  providers: [ ]
})
export class ScratchCouponModule { }
