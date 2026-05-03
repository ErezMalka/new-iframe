//import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule} from '@angular/core';
import { MessageComponent } from './message.component';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { MessageService } from './message.service';


@NgModule({
  declarations: [
    MessageComponent
  ],
  imports: [
    CommonModule,
   // BrowserModule,
    HttpClientModule,
    NgSelectModule,
  ],
  exports: [
    MessageComponent
  ],
  providers: [ 
    MessageService
  ]
})
export class MessageModule { }
