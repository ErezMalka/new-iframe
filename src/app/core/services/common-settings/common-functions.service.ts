import { Injectable } from '@angular/core';

@Injectable()
export class CommonFunctionsService {

  public sortOrderItems(items: any[], fieldName = 'Id') {
    if (Array.isArray(items)) {
      items.sort((item1, item2) => {
        return item1[fieldName] - item2[fieldName];
      });
    }
    return items;
  }

  public restrictKeysExceptDigitsAndPlus(event, dontIncludePlus) {
    const k = event.charCode;  // k = event.keyCode;  (Both can be used)
    if ((k > 64 && k < 91) || k == 8 || k == 32 || (k >= 48 && k <= 57) || k == 46) {

    } else {
      if (!dontIncludePlus) {
        if (k != 43) {
          event.preventDefault();
          return;
        } else {
          return;
        }
      }
      if (event) {
        event.preventDefault();
      }
    }
  }

  public deepCopy(oldObj: any) {
    let newObj = oldObj;
    if (oldObj && typeof oldObj === 'object') {
      newObj = Object.prototype.toString.call(oldObj) === '[object Array]' ? [] : {};
      for (var i in oldObj) {
        newObj[i] = this.deepCopy(oldObj[i]);
      }
    }
    return newObj;
  }

}
