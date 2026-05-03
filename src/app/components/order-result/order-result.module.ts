import { CommonModule } from '@angular/common';
import { NgModule} from '@angular/core';
import { OrderResultComponent } from './order-result.component';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslationsModule } from '../../shared/translations/translations.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
//import { RoundPricePipe } from '../../shared/pipes/round-price.pipe';
//import { SharedModule } from '../../shared/shared.module';
//import { ScrollSpyDirective } from './scroll-spy.directive';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { TranslationsService } from '../../shared/translations/translations.service';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    OrderResultComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    NgSelectModule,
    TranslationsModule.forRoot(),
    FormsModule,
    RouterModule,
    PerfectScrollbarModule,
  ],
  exports: [
    OrderResultComponent
  ],
  providers: [
    TranslationsService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class OrderResultModule { }
