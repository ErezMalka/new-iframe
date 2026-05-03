//import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule} from '@angular/core';
import { ReturnComponent } from './return.component';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from "@ng-select/ng-select";


@NgModule({
  declarations: [
    ReturnComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    NgSelectModule,
  ],
  exports: [
    ReturnComponent
  ],
  providers: [ ]
})
export class ReturnModule { }
