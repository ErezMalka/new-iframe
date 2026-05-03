//import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule} from '@angular/core';
import { ItemWithGarnishesComponent } from './item-with-garnishes.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
//import {MessageModule} from "../../../components/message/message.module";
import {MatExpansionModule} from '@angular/material/expansion';
import {NgScrollbarModule} from "ngx-scrollbar";
import {MatCardModule} from "@angular/material/card";
import {MatSelectModule} from "@angular/material/select";
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { TranslationsService } from '../../../shared/translations/translations.service';
import { PopoverModule } from 'ngx-bootstrap/popover';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    ItemWithGarnishesComponent
  ],
  imports: [
    CommonModule,
    //BrowserModule,
    CollapseModule.forRoot(),
    PopoverModule.forRoot(),
    HttpClientModule,
    SharedModule,
    FormsModule,
    //MessageModule,
    NgScrollbarModule,
    MatCardModule,
    MatSelectModule,
    MatExpansionModule,
    PerfectScrollbarModule,
  ],
  providers: [
    TranslationsService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  bootstrap: [
    ItemWithGarnishesComponent
  ]
})
export class ItemWithGarnishesModule { }
