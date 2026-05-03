import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'roundPrice' })
export class RoundPricePipe implements PipeTransform {
  constructor() { }
  transform(value, count) {
    if (value) {
      if (count) {
          if (isNaN(value) || isNaN(value)) {
            return value;
          }
          const m = Math.pow(10, count);
          return (Math.round(value * m) / m);
      } else {
        return value;
      }
    } else {
      return value;
    }
  }
}
