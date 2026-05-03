//import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule} from '@angular/core';
import { SignInComponent } from './sign-in.component';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslationsModule } from '../../../shared/translations/translations.module';
import { SharedModule } from '../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SignInComponent
  ],
  imports: [
    CommonModule,
   // BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgSelectModule,
    TranslationsModule,
    SharedModule
  ],
  exports: [
    SignInComponent
  ],
  providers: [ ]
})
export class SignInModule { }
