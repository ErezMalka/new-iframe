import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TranslationsService} from '../../shared/translations/translations.service';
import { TranslationsModule } from '../../shared/translations/translations.module';
import { MyOrderComponent } from './my-order.component';

const routes: Routes = [
  {
    path: '',
    component:MyOrderComponent,
    data: {
      title: 'Order'
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TranslationsModule],
  exports: [RouterModule],
  providers: [
    TranslationsService
  ],
})
export class MyOrderRoutingModule {}
