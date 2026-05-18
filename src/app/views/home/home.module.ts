import { NgModule} from '@angular/core';
import { HomeComponent } from './home.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SelectBranchModule} from './select-branch/select-branch.module';
import {SelectTimeModule} from './select-time/select-time.module';
import {SelectDateTimeModule} from './select-date-time/select-date-time.module';
import { EntryCodeModule } from '../../components/entry-code/entry-code.module';
import { EntryCodeComponent} from '../../components/entry-code/entry-code.component';

import {AddressSelectionModule} from "./address-selection/address-selection.module";
import {SelectBranchComponent} from "./select-branch/select-branch.component";
import {SelectTimeComponent} from "./select-time/select-time.component";
import { MatDialogModule } from '@angular/material/dialog';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { InfoMenuModule } from '../../shared/info-menu/info-menu/info-menu.module';
@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    EntryCodeModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    NgSelectModule,
    SelectBranchModule,
    SelectTimeModule,
    SelectDateTimeModule,
    MatDialogModule,
    ModalModule.forRoot(),
    AddressSelectionModule,
    MatSelectModule,
    TabsModule,
    InfoMenuModule
  ],
  providers: [
  ],
  bootstrap: [
    HomeComponent
  ],
  entryComponents: [
    SelectBranchComponent,
    EntryCodeComponent

  ]
})
export class HomeModule { }
