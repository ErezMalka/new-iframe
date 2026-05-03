import { CommonModule } from '@angular/common';

import { NgModule} from '@angular/core';
import { OrderRoutingModule } from './order-routing.module';
import { OrderComponent } from './order.component';
import {HttpClient, HttpClientModule } from '@angular/common/http';
import { SharedModule } from "../../shared/shared.module";
import { NgScrollbarModule } from "ngx-scrollbar";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DialogSignInModule } from "../../components/sign-in/popup/dialog-sign-in.module";
import { DialogSignInComponent } from "../../components/sign-in/popup/dialog-sign-in.component";
import { SignOutModule } from "../../components/sign-out/sign-out.module";
import { SignInModule } from '../../components/sign-in/top-popup-sign-in/sign-in.module';
import { TabsModule } from 'ngx-bootstrap/tabs';

import {NgSelectModule} from "@ng-select/ng-select";
import {MatSelectModule} from "@angular/material/select";
import {DeliveryConditionModule} from "./delivery-condition/delivery-condition.module";
import {DeliveryConditionComponent} from "./delivery-condition/delivery-condition.component";
import { AdditionalItemsComponent } from '../../components/additional-items/additional-items.component';
import { AdditionalItemsModule } from '../../components/additional-items/additional-items.module';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { TermsComponent } from '../terms/terms.component';
import { TermsModule } from '../terms/terms.module';

import { PolicyComponent } from '../terms/policy.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AlertModule } from 'ngx-bootstrap/alert';
//import {MatNativeDateModule} from '@angular/material/core';
//import { MatMomentDateModule } from "@angular/material-moment-adapter";
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
// Datepicker
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
//import { setTheme } from 'ngx-bootstrap/utils';
//setTheme('bs4')
import { defineLocale } from 'ngx-bootstrap/chronos';
import { heLocale } from 'ngx-bootstrap/locale';
import {ItemComponent} from "../menu/item/item.component";
import {SelectDateModule} from "../home/select-date/select-date.module";


import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { TranslationsService } from '../../shared/translations/translations.service';

//////masha
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
//import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreditCardDirectivesModule } from 'angular-cc-library';

//////////////////masha-end

defineLocale('he', heLocale);

@NgModule({
  declarations: [
    OrderComponent,
    //AdditionalItemsComponent,
    //TermsComponent,
    //PolicyComponent,
    
  ],
  imports: [
    TermsModule,
    AdditionalItemsModule,
    SelectDateModule,
        /////masha
        TranslateModule.forRoot({
          loader: {
              provide: TranslateLoader,
              useFactory: HttpLoaderFactory,
              deps: [HttpClient]
          }
        }),
        FormsModule,
        ReactiveFormsModule,
        CreditCardDirectivesModule,
        /////masha-end

    MatDatepickerModule,
    BsDatepickerModule.forRoot(),
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    FormsModule,
    OrderRoutingModule,
    ReactiveFormsModule,
    TabsModule,
    CommonModule,
    //BrowserModule,
    HttpClientModule,
    SharedModule,
    DialogSignInModule,
    PerfectScrollbarModule,
    NgScrollbarModule,
    SignOutModule,
    SignInModule,
    NgSelectModule,
    MatSelectModule,
    DeliveryConditionModule
    //
  ],
  providers: [
    MatDatepickerModule
  ],
  bootstrap: [
    OrderComponent
  ],
  entryComponents: [
    DialogSignInComponent,
    DeliveryConditionComponent,
    AdditionalItemsComponent,
    TermsComponent,
    ItemComponent,
    PolicyComponent
  ]
})
export class OrderModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18nhf/', '.json');
}
