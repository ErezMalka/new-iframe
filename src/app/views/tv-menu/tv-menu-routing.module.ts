import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TranslationsService} from '../../shared/translations/translations.service';
import { TranslationsModule } from '../../shared/translations/translations.module';
import { TVMenuComponent } from './tv-menu.component';

const routes: Routes = [
  {
    path: '',
    component:TVMenuComponent,
    data: {
      title: 'Menu'
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
export class TVMenuRoutingModule {}
