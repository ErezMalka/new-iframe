//import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { CustomMaterialModule } from '../../../shared/custom-material.module';
import { SharedModule } from '../../../shared/shared.module';
import { DeliveryConditionComponent } from './delivery-condition.component';

@NgModule({
  declarations: [
    DeliveryConditionComponent
  ],
  imports: [
   // BrowserModule,
    CommonModule,
    HttpClientModule,
    NgSelectModule,
    CustomMaterialModule,
    SharedModule
  ],
  exports: [
    DeliveryConditionComponent
  ],
  providers: [ ]
})
export class DeliveryConditionModule { }
