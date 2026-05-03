import { CommonModule } from '@angular/common';
import { NgModule} from '@angular/core';
import { PaymentComponent } from './payment.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from "../../shared/shared.module";
import { NgScrollbarModule } from "ngx-scrollbar";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {ScratchCouponModule} from "./scratch-coupon/scratch-coupon.module";
import {ScratchCouponComponent} from "./scratch-coupon/scratch-coupon.component";
import { PaymentRoutingModule } from './payment-routing.module';

@NgModule({
  declarations: [
    PaymentComponent
  ],
  imports: [
    FormsModule,
    PaymentRoutingModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    SharedModule,
    NgScrollbarModule,
    ScratchCouponModule,
  ],
  providers: [
  ],
  bootstrap: [
    PaymentComponent
  ],
  entryComponents: [ScratchCouponComponent]
})
export class PaymentModule { }
