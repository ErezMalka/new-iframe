import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TranslationsService} from '../../shared/translations/translations.service';
import { TranslationsModule } from '../../shared/translations/translations.module';
import { MyMembershipComponent } from './my-membership.component';

const routes: Routes = [
  {
    path: '',
    component:MyMembershipComponent,
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
export class MyMembershipRoutingModule {}
