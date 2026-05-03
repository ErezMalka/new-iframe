import { NgModule } from '@angular/core';
import { TranslationsModule } from './translations/translations.module';
import { TranslationsService } from './translations/translations.service';
import { TranslationsPipe } from './translations/translations.pipe';
import { PaymentService } from './services/payment.service';
import { MeshulamService } from './services/meshulam.service';

import { LoaderModule } from './components/loader/loader.module';
import { AnimationDirective } from './directives/animation.directive';
import { MessageModule } from './components/message/message.module';
import { ReturnModule } from './components/return/return.module';
import { CustomMaterialModule } from './custom-material.module';
import { OrderResultModule } from "../components/order-result/order-result.module";
import { OrderResultMobileModule } from "../components/order-result-mobile/order-result-mobile.module";
import {DiscountTypePipe} from "./pipes/discount-type.pipe";
import {RoundPricePipe} from "./pipes/round-price.pipe";
import {MessagePopupModule} from "./components/message-popup/message-popup.module";
import {HideValuePipe} from "./pipes/hide-value.pipe";
import {ScrollCheckerDirective} from "./directives/scroll-checker.directive";
import {BiteCreditModule} from "./components/bite-credit/bite-credit.module";

import {ClubMemberModule} from "./components/club-member/club-member.module";

@NgModule({
  declarations: [
    AnimationDirective,
    ScrollCheckerDirective,
    DiscountTypePipe,
    RoundPricePipe,
    HideValuePipe
  ],
  imports: [
    TranslationsModule,
    LoaderModule,
    MessageModule,
    ReturnModule,
    CustomMaterialModule,
    OrderResultModule,
    OrderResultMobileModule,
    MessagePopupModule,
    BiteCreditModule,
    ClubMemberModule
  ],
  exports: [
    TranslationsModule,
    LoaderModule,
    AnimationDirective,
    ScrollCheckerDirective,
    MessageModule,
    ReturnModule,
    CustomMaterialModule,
    OrderResultModule,
    OrderResultMobileModule,
    DiscountTypePipe,
    RoundPricePipe,
    MessagePopupModule,
    HideValuePipe,
    BiteCreditModule,
    ClubMemberModule
  ],
  providers: [
    TranslationsService,
    PaymentService,
    MeshulamService,
    RoundPricePipe,
    HideValuePipe
  ],
  entryComponents: [

  ],

})
export class SharedModule { }
