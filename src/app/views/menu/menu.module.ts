import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { MenuComponent } from './menu.component';
import { MenuRoutingModule } from './menu-routing.module';
import { CommonModule } from '@angular/common';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../../shared/shared.module';
import { SlickModule } from 'ngx-slick';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { GarnishesModule } from './garnishes/garnishes.module';
import { DiscountModule } from '../../components/discount/discount.module';
import { NewPizzaModule } from './pizza/new-pizza.module';
import { MessagePopupComponent } from '../../shared/components/message-popup/message-popup.component';
import { SignInModule } from '../../components/sign-in/top-popup-sign-in/sign-in.module';
import { SignOutModule } from '../../components/sign-out/sign-out.module';
import { ScratchCouponModule } from './scratch-coupon/scratch-coupon.module';
import { ScratchCouponComponent } from './scratch-coupon/scratch-coupon.component';
import { DragScrollModule } from 'ngx-drag-scroll';
import {DiscountCouponModule} from "./discount-coupon/discount-coupon.module";
import {DiscountCouponComponent} from "./discount-coupon/discount-coupon.component";
import {ItemCommentsModule} from "./item-comments/item-comments.module";
import {ItemCommentsComponent} from "./item-comments/item-comments.component";
import {ComboModule} from "./combo/combo.module";
import {ComboComponent} from "./combo/combo.component";
import {NewComboComponent} from "./combo/new-combo.component";
import {ItemComponent} from "./item/item.component";
import {ItemWithGarnishesComponent} from "./item-with-garnishes/item-with-garnishes.component";
import {ItemForComboComponent} from "./item-for-combo/item-for-combo.component";

import {ItemModule} from "./item/item.module";
import {ItemWithGarnishesModule} from "./item-with-garnishes/item-with-garnishes.module";
import {ItemForComboModule} from "./item-for-combo/item-for-combo.module";

import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';

import { NgxPageScrollModule } from 'ngx-page-scroll';
import { ScrollSpyDirective } from './scroll-spy.directive';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { BiteCreditComponent } from '../../shared/components/bite-credit/bite-credit.component';

import { ClubMemberComponent } from '../../shared/components/club-member/club-member.component';
//import 'animate.css';
 
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
 

import { ModalModule } from 'ngx-bootstrap/modal';
import { TranslationsModule } from '../../shared/translations/translations.module';
import { TranslationsService} from '../../shared/translations/translations.service';

@NgModule({
  imports: [
    FormsModule,
    MenuRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    TranslationsModule.forRoot(),
    CommonModule,
    HttpClientModule,
    SharedModule,
    ItemModule,
    ItemWithGarnishesModule,
    //AppSidebarModule,
    //AppAsideModule,
    PerfectScrollbarModule,
    SlickModule.forRoot(),
    CollapseModule.forRoot(),
    NgScrollbarModule,
    DragScrollModule,
    GarnishesModule,
    DiscountModule,
    //PizzaModule,
    NewPizzaModule,
    ItemForComboModule,
    SignInModule,
    SignOutModule,
    ScratchCouponModule,
    DiscountCouponModule,
    ItemCommentsModule,
    ComboModule,
    NgxPageScrollCoreModule,
    ModalModule.forRoot(),
    NgxPageScrollModule
  ],
  entryComponents: [
    MessagePopupComponent,
    ScratchCouponComponent,
    DiscountCouponComponent,
    ItemCommentsComponent,
    ComboComponent,
    ItemComponent,
    ItemWithGarnishesComponent,
    NewComboComponent,
    ItemForComboComponent,
    ClubMemberComponent,
    BiteCreditComponent
  ],
  providers: [
    TranslationsService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  declarations: [ MenuComponent, ScrollSpyDirective ]
})
export class MenuModule { }
