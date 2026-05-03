import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';

import { HomeComponent } from './views/home/home.component';
import { OrderComponent } from './views/order/order.component';

import { SignInPageComponent } from "./components/sign-in/sign-in-page/sign-in-page.component";
import { MenuComponent } from './views/menu/menu.component';
import { ActivateGuard } from './views/home/activate-guard';
import { TVMenuComponent } from './views/tv-menu/tv-menu.component';


export const routes: Routes = [
  {
    path: '404',
    loadChildren: () => import('./views/error/error.module').then(m => m.ErrorModule),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    loadChildren: () => import('./views/error/error.module').then(m => m.ErrorModule),
    data: {
      title: 'Page 500'
    }
  },
 // {
  //  path: ':franchiseId',
  //  redirectTo: ':franchiseId/sign-in',
 // },
  {
    path: ':franchiseId/sign-in',
    component: SignInPageComponent
  },
  {
    path: ':franchiseId/home',
    component: HomeComponent,
    canActivate: [ActivateGuard],
    data: {
      title: 'Home Page'
    }
  },
  {
    path: ':franchiseId/:branchId/home',
    component: HomeComponent,
    canActivate: [ActivateGuard],
    data: {
      title: 'Home Page'
    }
  },
  {
    path: ':franchiseId/:branchId/tv',
    component: TVMenuComponent,
    canActivate: [ActivateGuard],
    data: {
      title: 'Menu'
    }
  },
 // {
   // path: ':franchiseId/menu',
   // component: MenuComponent,
   //data: {
     // title: 'Home Page'
    //}
  //},
  {
    path: ':franchiseId/order',
    component: OrderComponent,
    
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      
      {
        path: ':franchiseId/menu',
        loadChildren: () => import('./views/menu/menu.module').then(m => m.MenuModule)
      },
     // {
      //  path: ':franchiseId/order',
      //  loadChildren: () => import('./views/order/order.module').then(m => m.OrderModule)
     // },
      {
        path: ':franchiseId/payment/:branchId',
        loadChildren: () => import('./views/payment/payment.module').then(m => m.PaymentModule)
      },
      {
        path: ':franchiseId/my-order',
        loadChildren: () => import('./views/my-order/my-order.module').then(m => m.MyOrderModule)
      },
      {
        path: ':franchiseId/my-credit-cards',
        loadChildren: () => import('./views/my-credit-cards/my-credit-cards.module').then(m => m.MyCreditCardsModule)
      },
      {
        path: ':franchiseId/my-adresses',
        loadChildren: () => import('./views/my-adresses/my-adresses.module').then(m => m.MyAdressesModule)
      },
      {
        path: ':franchiseId/my-adresses',
        loadChildren: () => import('./views/my-benefits/my-benefits.module').then(m => m.MyBenefitsModule)
      },
      {
        path: ':franchiseId/my-membership',
        loadChildren: () => import('./views/my-membership/my-membership.module').then(m => m.MyMembershipModule)
      },
      {
        path: ':franchiseId/my-credit',
        loadChildren: () => import('./views/my-credit/my-credit.module').then(m => m.MyCreditModule)
      },
      {
        path: ':franchiseId/my-order-status/:orderId',
        loadChildren: () => import('./views/my-order-status/my-order-status.module').then(m => m.MyOrderStatusModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
