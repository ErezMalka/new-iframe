import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TranslationsService} from '../../shared/translations/translations.service';
import { TranslationsModule } from '../../shared/translations/translations.module';
import { MyCreditComponent } from './my-credit.component';

const routes: Routes = [
  {
    path: '',
    component:MyCreditComponent,
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
export class MyCreditRoutingModule {}
