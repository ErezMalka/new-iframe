import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TranslationsService} from '../../shared/translations/translations.service';
import { TranslationsModule } from '../../shared/translations/translations.module';
import { MyAdressessComponent } from './my-adresses.component';

const routes: Routes = [
  {
    path: '',
    component:MyAdressessComponent,
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
export class MyAdressesRoutingModule {}
