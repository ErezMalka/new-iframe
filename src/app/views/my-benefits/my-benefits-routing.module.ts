import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TranslationsService} from '../../shared/translations/translations.service';
import { TranslationsModule } from '../../shared/translations/translations.module';
import { MyBenefitsComponent } from './my-benefits.component';

const routes: Routes = [
  {
    path: '',
    component:MyBenefitsComponent,
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
export class MyBenefitsRoutingModule {}
