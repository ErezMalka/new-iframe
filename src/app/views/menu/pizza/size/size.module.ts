//import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule} from '@angular/core';
import { SizeComponent } from './size.component';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';


@NgModule({
  declarations: [
    SizeComponent
  ],
  imports: [
   // BrowserModule,
   CommonModule,
    HttpClientModule,
    SharedModule,
    NgSelectModule,
    FormsModule,
  ],
  exports: [
    SizeComponent
  ],
  providers: [
  ],
  bootstrap: [
    SizeComponent
  ]
})
export class SizeModule { }
