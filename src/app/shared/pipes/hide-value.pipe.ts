import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'hideValue' })
export class HideValuePipe implements PipeTransform {
  constructor() { }
  transform(value, countToLeave) {
    if (value) {
      if (countToLeave) {
          return value.slice(0, value.length - countToLeave)
            .replace(/\w/g, '*') + ' ' + value.slice(value.length - countToLeave);
      } else {
        return value.replace('\w', '*');
      }
    } else {
      return value;
    }
  }
}
