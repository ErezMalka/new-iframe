import { NgModule } from '@angular/core';
import { TranslationsService } from './translations.service';
import { TranslationsPipe } from "./translations.pipe";

@NgModule({
    declarations: [
      TranslationsPipe
    ],
    exports: [
      TranslationsPipe
    ],
    providers: [
      TranslationsService
    ]
})
export class TranslationsModule {
  static forRoot() {
    return {
        ngModule: TranslationsModule,
        providers: [ //services that you want to share across modules
          TranslationsService
        ]
    }
  }
}
