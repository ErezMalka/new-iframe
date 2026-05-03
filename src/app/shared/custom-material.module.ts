import { MatDialogModule } from '@angular/material/dialog';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';


import { NgModule } from "@angular/core";

@NgModule({
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule
  ],
  exports: [
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule
  ],
})
export class CustomMaterialModule { }
