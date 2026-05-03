import { NgModule} from '@angular/core';
import { SelectTimeComponent } from './select-time.component';
import { HttpClientModule } from '@angular/common/http';
//import { NgSelectModule } from '@ng-select/ng-select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    SelectTimeComponent
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
    SelectTimeComponent
  ],
  providers: [
  ],
  bootstrap: [
    SelectTimeComponent
  ]
})
export class SelectTimeModule { }
