//import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule} from '@angular/core';
import { ComboComponent } from './combo.component';
import { NewComboComponent } from './new-combo.component';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import {NgScrollbarModule} from "ngx-scrollbar";
import {MatCardModule} from "@angular/material/card";
import {MatSelectModule} from "@angular/material/select";
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    NewComboComponent,
    ComboComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    //BrowserModule,
    CollapseModule.forRoot(),
    HttpClientModule,
    SharedModule,
    NgSelectModule,
    FormsModule,
    NgScrollbarModule,
    MatCardModule,
    MatSelectModule,
    PerfectScrollbarModule
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  bootstrap: [
    NewComboComponent
  ],
  entryComponents: [

  ]
})
export class ComboModule { }
