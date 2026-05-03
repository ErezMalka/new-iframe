import { Pipe, PipeTransform } from '@angular/core';
import { TranslationsService } from './translations.service';
@Pipe({
  name: 'translate',
  pure: false
})
export class TranslationsPipe implements PipeTransform {

  constructor() {}
  transform(key: any): any {
    //return this.translate.data[key] || key;
    return (TranslationsService.data[key] != undefined || 
      TranslationsService.data[key] != null) 
      ? TranslationsService.data[key] : key;
  }

}
