//import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule} from '@angular/core';
import { LoaderComponent } from './loader.component';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from "@ng-select/ng-select";


@NgModule({
  declarations: [
    LoaderComponent
  ],
  imports: [
    CommonModule,
   // BrowserModule,
    HttpClientModule,
    NgSelectModule,
  ],
  exports: [
    LoaderComponent
  ],
  providers: [
  ]
})
export class LoaderModule { }
