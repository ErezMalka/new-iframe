//import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInPageComponent } from './sign-in-page.component';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslationsModule } from '../../../shared/translations/translations.module';
import { SharedModule } from '../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SignInPageComponent
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
    SignInPageComponent
  ],
  providers: [ ]
})
export class SignInPageModule { }
