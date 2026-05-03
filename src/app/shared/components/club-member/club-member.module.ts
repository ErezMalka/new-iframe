//import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule} from '@angular/core';
import { ClubMemberComponent } from './club-member.component';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslationsModule } from '../../translations/translations.module';
import { FormsModule } from "@angular/forms";
import { MCTermsComponent } from '../../../views/terms/mc-terms.component';
import { TermsModule } from '../../../views/terms/terms.module';

import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { AlertModule } from 'ngx-bootstrap/alert';

import { ModalModule } from 'ngx-bootstrap/modal';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};




@NgModule({
  declarations: [
    ClubMemberComponent
  ],
  imports: [
    ModalModule.forRoot(),
    CommonModule,
    TermsModule,
    //BrowserModule,
    HttpClientModule,
    NgSelectModule,
    TranslationsModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    PerfectScrollbarModule,
    AlertModule

  ],
  exports: [
    ClubMemberComponent
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  entryComponents: [
     MCTermsComponent
    
  ]
})
export class ClubMemberModule { }
