import { NgModule} from '@angular/core';
import { SelectDateComponent } from './select-date.component';
import { HttpClientModule } from '@angular/common/http';
//import { NgSelectModule } from '@ng-select/ng-select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    SelectDateComponent
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
    SelectDateComponent
  ],
  providers: [
  ],
  bootstrap: [
    SelectDateComponent
  ]
})
export class SelectDateModule { }
