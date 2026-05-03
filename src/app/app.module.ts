import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_INITIALIZER, NO_ERRORS_SCHEMA,NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { CommonModule } from '@angular/common';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { GoogleTagManagerModule } from 'angular-google-tag-manager';
import { ModalModule } from 'ngx-bootstrap/modal';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { AppComponent } from './app.component';

// Import containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
//import { LoginComponent } from './views/terms/terms.component'; 
//import { RegisterComponent } from './views/register/register.component';


const APP_CONTAINERS = [
  DefaultLayoutComponent
];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts';


////////////////////////////////////

import { HttpClient ,HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { TranslationsService } from './shared/translations/translations.service';
import { CoreModule } from './core/core.module';
import { HomeModule } from './views/home/home.module';
import { MenuModule } from './views/menu/menu.module';
import { TVMenuModule } from './views/tv-menu/tv-menu.module';
import { OrderModule } from './views/order/order.module';
import { MyOrderModule } from './views/my-order/my-order.module';
import { MyCreditCardsModule } from './views/my-credit-cards/my-credit-cards.module';
import { MyAdressesModule } from './views/my-adresses/my-adresses.module';
import { MyOrderStatusModule } from './views/my-order-status/my-order-status.module';
import { AppConfig } from './app.config';
import { MatDialogModule } from '@angular/material/dialog';
import { ErrorModule } from './views/error/error.module';
import { AppStorageService } from './app.storage.service';
import { PaymentModule } from './views/payment/payment.module';
import { SignInPageModule } from './components/sign-in/sign-in-page/sign-in-page.module';
import { environment } from '../environments/environment';
import {MatNativeDateModule} from '@angular/material/core';
import { MomentDateModule } from "@angular/material-moment-adapter";
import { ActivateGuard } from './views/home/activate-guard';
import { MyMembershipModule } from './views/my-membership/my-membership.module';
import { MyBenefitsModule } from './views/my-benefits/my-benefits.module';

export function initializeApp(appConfig: AppConfig) {
  return () => appConfig.load();
}

//export function setupTranslationsFactory(
//  service: TranslationsService): Function {
 // return () => service.use();
//}

@NgModule({
  imports: [
    BrowserModule,
    ModalModule.forRoot(),
    BrowserAnimationsModule,
    MomentDateModule,
    MatNativeDateModule ,
    AppRoutingModule,
    AppAsideModule,
    CommonModule,
    MatDialogModule ,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    HttpClientModule,
    CoreModule,
    SharedModule,

    SignInPageModule,
    GoogleTagManagerModule.forRoot({
      id: environment.gtm,
    }),
    HomeModule,
    MenuModule,
    TVMenuModule,
    OrderModule,
    MyOrderModule,
    MyCreditCardsModule,
    MyAdressesModule,
    MyMembershipModule,
    MyBenefitsModule,
    MyOrderStatusModule
    // ErrorModule,
    // PaymentModule
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    P500Component,
   // LoginComponent,
    //RegisterComponent
  ],
  providers: [{
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  },
  ActivateGuard,
  //TranslationsService,
 // {
  //  provide: APP_INITIALIZER,
  //  useFactory: setupTranslationsFactory,
   // deps: [ TranslationsService ],
   // multi: true
  //},
  AppConfig,
  { provide: APP_INITIALIZER,
    useFactory: initializeApp,
    deps: [AppConfig], multi: true },
  AppStorageService,
  CoreModule
],
  bootstrap: [ AppComponent ],
  schemas:[NO_ERRORS_SCHEMA]
})
export class AppModule { }
