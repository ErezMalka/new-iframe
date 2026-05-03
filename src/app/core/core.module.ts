import { NgModule } from '@angular/core'
import { MetaDataService } from './services/meta-data.service';
import { ConfigService } from './services/common-settings/config.service';
import { OrderService } from './services/order.service';
import { BrowserIdentificatorService } from './services/common-settings/browser-identificator.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorsInterceptor } from './interceptors/http-errors.interceptor';
import { ErrorService } from './services/common-settings/error.service';
import { MenuService } from './services/menu.service';
import { VersionImageService } from './services/common-settings/version-image.service';
import { CommonFunctionsService } from './services/common-settings/common-functions.service';
import { SignInOutService } from './services/sign-in-out.service';
import { ScratchCouponService } from './services/scratch-coupon.service';
import {PreviousRouteService} from "./services/common-settings/previous-route.service";

@NgModule({
    declarations: [

    ],
    imports: [

    ],
    exports: [

    ],
    providers: [
        MetaDataService,
        OrderService,
        ConfigService,
        ErrorService,
        MenuService,
        SignInOutService,
        BrowserIdentificatorService,
        PreviousRouteService,
        [
          { provide: HTTP_INTERCEPTORS, useClass: HttpErrorsInterceptor, multi: true }
        ],
        CommonFunctionsService,
        VersionImageService,
      ScratchCouponService
    ],
    entryComponents: [],

})
export class CoreModule { }
