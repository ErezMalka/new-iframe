import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TranslationsService} from '../../shared/translations/translations.service';
import { TranslationsModule } from '../../shared/translations/translations.module';
import { MenuComponent } from './menu.component';

const routes: Routes = [
  {
    path: '',
    component:MenuComponent,
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
export class MenuRoutingModule {}
