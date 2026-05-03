import { NgModule} from '@angular/core';
import { AddressSelectionComponent } from './address-selection.component';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslationsModule } from '../../../shared/translations/translations.module';
import { SharedModule } from '../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatSelectModule} from "@angular/material/select";
import { ModalModule } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { AlertModule } from 'ngx-bootstrap/alert';

@NgModule({
  declarations: [
    AddressSelectionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgSelectModule,
    TranslationsModule,
    SharedModule,
    GooglePlaceModule,
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    MatSelectModule
  ],
  exports: [

  ],
  providers: [ ],
  entryComponents: [
    AddressSelectionComponent
  ]
})
export class AddressSelectionModule { }
