import { CommonModule } from '@angular/common';
import { NgModule} from '@angular/core';
import { DialogSignInComponent } from './dialog-sign-in.component';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslationsModule } from '../../../shared/translations/translations.module';
import { SharedModule } from '../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DialogSignInComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgSelectModule,
    TranslationsModule,
    SharedModule
  ],
  exports: [

  ],
  providers: [ ]
})
export class DialogSignInModule { }
