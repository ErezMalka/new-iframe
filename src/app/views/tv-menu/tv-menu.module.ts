import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { TVMenuComponent } from './tv-menu.component';
import { TVMenuRoutingModule } from './tv-menu-routing.module';
import { CommonModule } from '@angular/common';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../../shared/shared.module';
import { SlickModule } from 'ngx-slick';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { CarouselModule } from 'ngx-bootstrap/carousel';

import { DiscountModule } from '../../components/discount/discount.module';

import { MessagePopupComponent } from '../../shared/components/message-popup/message-popup.component';
import { SignInModule } from '../../components/sign-in/top-popup-sign-in/sign-in.module';
import { SignOutModule } from '../../components/sign-out/sign-out.module';

import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';

import { NgxPageScrollModule } from 'ngx-page-scroll';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
 

import { ModalModule } from 'ngx-bootstrap/modal';
import { TranslationsModule } from '../../shared/translations/translations.module';
import { TranslationsService} from '../../shared/translations/translations.service';

@NgModule({
  imports: [
    FormsModule,
    TVMenuRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    TranslationsModule.forRoot(),
    CarouselModule.forRoot(),
    CommonModule,
    HttpClientModule,
    SharedModule,

    PerfectScrollbarModule,
    SlickModule.forRoot(),
    CollapseModule.forRoot(),
    NgScrollbarModule,
 
    DiscountModule,
    //PizzaModule,
   
    SignInModule,
    SignOutModule,
    NgxPageScrollCoreModule,
    ModalModule.forRoot(),
    NgxPageScrollModule
  ],
  entryComponents: [
    MessagePopupComponent 
  ],
  providers: [
    TranslationsService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  declarations: [ TVMenuComponent ]
})
export class TVMenuModule { }
