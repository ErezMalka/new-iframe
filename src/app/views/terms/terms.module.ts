import { CommonModule } from '@angular/common';
import { NgModule} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MCTermsComponent } from './mc-terms.component';
import { TermsComponent } from './terms.component';
import { PolicyComponent } from './policy.component';

import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [TermsComponent,
    MCTermsComponent,
    PolicyComponent],
  imports: [
    FormsModule,

    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
  ],
  providers: [
  ],
  exports: [
    TermsComponent,
    PolicyComponent,
    MCTermsComponent
  ],
  
   
})
export class TermsModule { }