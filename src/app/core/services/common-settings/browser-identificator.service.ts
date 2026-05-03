import { Injectable } from "@angular/core";

@Injectable()
export class BrowserIdentificatorService {
  public isMobile = {
    Android: function() {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
      return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
      return (this.isMobile.Android() || this.isMobile.BlackBerry() || this.isMobile.iOS() || this.isMobile.Opera() || this.isMobile.Windows());
    }
  };
}
