import { CommonModule } from '@angular/common';
import { NgModule} from '@angular/core';
import { AdditionalItemsComponent } from './additional-items.component';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from "@ng-select/ng-select";
import { SharedModule } from "../../shared/shared.module";
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    AdditionalItemsComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    NgSelectModule,
    SharedModule,
    PerfectScrollbarModule
  ],
  exports: [
    AdditionalItemsComponent
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class AdditionalItemsModule { }
