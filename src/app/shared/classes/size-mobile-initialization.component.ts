import { DeviceDetectorService } from 'ngx-device-detector';
import {BrowserIdentificatorService} from '../../core/services/common-settings/browser-identificator.service';

export class SizeMobileInitializationComponent {

  constructor(protected browserIdentificatorService: BrowserIdentificatorService, //private deviceService: DeviceDetectorService
    ) {}

  public currentSize: number;

  public minWidth = 825;

  public initializeSize() {
    this.currentSize = window.innerWidth;
  }


  public isMobileMode() {
    //console.log("this.deviceService.isTablet()",this.deviceService.isTablet());
    //console.log("this.deviceService.isMobile()",this.deviceService.isMobile());
    //return this.deviceService.isMobile() || this.deviceService.isTablet() ;
    //console.log("!!!!!!!!!!this.currentSize",this.currentSize);
    //console.log("!!!!!!!!!!this.currentSize",this.currentSize);
    return this.currentSize < this.minWidth;
  }

  public onResize(event) {
    this.currentSize = event.target.innerWidth;
  }

  public isMobileBrowser() {
    return this.browserIdentificatorService.isMobile.Android() ||
      this.browserIdentificatorService.isMobile.Windows() ||
      this.browserIdentificatorService.isMobile.iOS();
  }

}
