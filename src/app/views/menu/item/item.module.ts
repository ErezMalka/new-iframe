//import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule} from '@angular/core';
import { ItemComponent } from './item.component';
 import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import {NgScrollbarModule} from "ngx-scrollbar";
import {MatCardModule} from "@angular/material/card";
import {MatSelectModule} from "@angular/material/select";
import { CollapseModule } from 'ngx-bootstrap/collapse';

@NgModule({
  declarations: [
   
    ItemComponent
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
  ],
  providers: [
  ],
  bootstrap: [
    ItemComponent
  ],
  entryComponents: [

  ]
})
export class ItemModule { }
