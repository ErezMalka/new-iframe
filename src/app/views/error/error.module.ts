import { NgModule} from '@angular/core';
import { ErrorComponent } from './error.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from "../../shared/shared.module";
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    ErrorComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    SharedModule,
    NgSelectModule,
    FormsModule,
  ],
  providers: [
  ],
  bootstrap: [
    ErrorComponent
  ]
})
export class ErrorModule { }
