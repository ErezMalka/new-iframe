import { NgModule} from '@angular/core';
import { SelectBranchComponent } from './select-branch.component';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    SelectBranchComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgSelectModule,
    FormsModule,
  ],
  exports: [
    SelectBranchComponent
  ],
  providers: [
  ],
  bootstrap: [
    SelectBranchComponent
  ]
})
export class SelectBranchModule { }
