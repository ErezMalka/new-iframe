import { NgModule} from '@angular/core';
import { SelectDateTimeComponent } from './select-date-time.component';
import { HttpClientModule } from '@angular/common/http';
//import { NgSelectModule } from '@ng-select/ng-select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    SelectDateTimeComponent
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    //NgSelectModule,
    MatSelectModule,
    FormsModule,
    
  ],
  exports: [
    SelectDateTimeComponent
  ],
  providers: [
  ],
  bootstrap: [
    SelectDateTimeComponent
  ]
})
export class SelectDateTimeModule { }
