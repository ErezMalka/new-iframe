//import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule} from '@angular/core';
import { PizzaSizeComponent } from './pizza-size.component';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { SizeModule } from '../size/size.module';
import { SharedModule } from '../../../../shared/shared.module';
import { QuartersModule } from '../quarters/quarters.module';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SlickModule } from 'ngx-slick';

@NgModule({
  declarations: [
    PizzaSizeComponent
  ],
  imports: [
    //BrowserModule,
    CommonModule,
    HttpClientModule,
    SharedModule,
    SlickModule.forRoot(),
    NgSelectModule,
    FormsModule,
    SizeModule,
    NgScrollbarModule,
    QuartersModule,

    NgScrollbarModule,
  ],
  providers: [
  ],
  bootstrap: [
    PizzaSizeComponent
  ],
  entryComponents: [

  ]
})
export class PizzaSizeModule { }
