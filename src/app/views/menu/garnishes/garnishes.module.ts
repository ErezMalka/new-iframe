//import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule} from '@angular/core';
import { GarnishesComponent } from './garnishes.component';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
//import {NgScrollbarModule} from 'ngx-scrollbar';
import { PopoverModule } from 'ngx-bootstrap/popover';

@NgModule({
  declarations: [
    GarnishesComponent
  ],
  imports: [
    //BrowserModule,
    CommonModule,
    HttpClientModule,
    SharedModule,
    NgSelectModule,
    FormsModule,
    PopoverModule.forRoot(),
   // NgScrollbarModule
  ],
  providers: [
  ],
  bootstrap: [
    GarnishesComponent
  ]
})
export class GarnishesModule { }
