//import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { NgModule} from '@angular/core';
import { MyAdressesRoutingModule } from './my-adresses-routing.module';
import { MyAdressessComponent } from './my-adresses.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from "../../shared/shared.module";
import { NgScrollbarModule } from "ngx-scrollbar";
 
import { DialogSignInModule } from "../../components/sign-in/popup/dialog-sign-in.module";
import { DialogSignInComponent } from "../../components/sign-in/popup/dialog-sign-in.component";
import { SignOutModule } from "../../components/sign-out/sign-out.module";
 
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
//import {MatNativeDateModule} from '@angular/material/core';
//import { MatMomentDateModule } from "@angular/material-moment-adapter";
import {MatDatepickerModule} from '@angular/material/datepicker';
 
//import { setTheme } from 'ngx-bootstrap/utils';
//setTheme('bs4')
import { defineLocale } from 'ngx-bootstrap/chronos';
import { heLocale } from 'ngx-bootstrap/locale';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// RECOMMENDED
import { CollapseModule } from 'ngx-bootstrap/collapse';
defineLocale('he', heLocale);

@NgModule({
  declarations: [
    MyAdressessComponent,
    
  ],
  imports: [
 
    //BrowserAnimationsModule,
    MyAdressesRoutingModule,
 
    CommonModule,
    CollapseModule.forRoot(),
    HttpClientModule,
    SharedModule,
    DialogSignInModule,
    PerfectScrollbarModule,
    NgScrollbarModule,
    SignOutModule,
 
     
  ],
  providers: [
    MatDatepickerModule
  ],
  bootstrap: [
    MyAdressessComponent
  ],
  entryComponents: [
    DialogSignInComponent,
    
  ]
})
export class MyAdressesModule { }
