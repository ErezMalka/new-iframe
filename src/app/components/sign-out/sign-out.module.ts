//import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from "@ng-select/ng-select";
import { TranslationsModule } from "../../shared/translations/translations.module";
import { SharedModule } from "../../shared/shared.module";
import {SignOutComponent} from "./sign-out.component";


@NgModule({
  declarations: [
    SignOutComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    NgSelectModule,
    TranslationsModule,
    SharedModule
  ],
  exports: [
    SignOutComponent
  ],
  providers: [ ]
})
export class SignOutModule { }
