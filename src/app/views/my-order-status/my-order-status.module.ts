//import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { NgModule} from '@angular/core';
import { MyOrderStatusRoutingModule } from './my-order-status-routing.module';
import { MyOrderStatusComponent } from './my-order-status.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from "../../shared/shared.module";
import { NgScrollbarModule } from "ngx-scrollbar";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DialogSignInModule } from "../../components/sign-in/popup/dialog-sign-in.module";
import { DialogSignInComponent } from "../../components/sign-in/popup/dialog-sign-in.component";
import { SignOutModule } from "../../components/sign-out/sign-out.module";
import {NgSelectModule} from "@ng-select/ng-select";
import {MatSelectModule} from "@angular/material/select";
 import { AdditionalItemsComponent } from '../../components/additional-items/additional-items.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
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
defineLocale('he', heLocale);

@NgModule({
  declarations: [
    MyOrderStatusComponent,
    
  ],
  imports: [
    MatDatepickerModule,
    BsDatepickerModule.forRoot(),
    FormsModule,
    MyOrderStatusRoutingModule,
    ReactiveFormsModule,
    CommonModule,
    //BrowserModule,
    HttpClientModule,
    SharedModule,
    DialogSignInModule,
    PerfectScrollbarModule,
    NgScrollbarModule,
    SignOutModule,
    NgSelectModule,
    MatSelectModule,
     
  ],
  providers: [
    MatDatepickerModule
  ],
  bootstrap: [
    MyOrderStatusComponent
  ],
  entryComponents: [
    DialogSignInComponent,
    
  ]
})
export class MyOrderStatusModule { }
