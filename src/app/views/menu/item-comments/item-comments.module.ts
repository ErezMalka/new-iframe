//import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule} from '@angular/core';
import { ItemCommentsComponent } from './item-comments.component';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from "@ng-select/ng-select";
import { CustomMaterialModule } from "../../../shared/custom-material.module";
import { SharedModule } from "../../../shared/shared.module";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    ItemCommentsComponent
  ],
  imports: [
  //  BrowserModule,
  CommonModule,
    HttpClientModule,
    NgSelectModule,
    CustomMaterialModule,
    SharedModule,
    FormsModule
  ],
  exports: [
    ItemCommentsComponent
  ],
  providers: [ ]
})
export class ItemCommentsModule { }
