import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { InfoMenuComponent } from './info-menu.component';

@NgModule({
  imports: [CommonModule, MatDialogModule],
  declarations: [InfoMenuComponent],
  exports: [InfoMenuComponent]
})
export class InfoMenuModule {}
