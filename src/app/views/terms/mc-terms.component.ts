import { Component, OnInit } from '@angular/core';
import { AppConfig } from '../../app.config';
import {AppStorageService} from "../../app.storage.service";

@Component({
  selector: 'app-mc-terms',
  templateUrl: 'mc-terms.component.html'
})
export class MCTermsComponent implements OnInit { 
  public email:string;
  public name:string;
  public address:string="";
  public taxId:string;
  public franchiseId:number;

  constructor(private appStorageService: AppStorageService){}
  
  ngOnInit(): void {
    this.name = AppConfig.settings.name;
    this.email = this.appStorageService.franchise.ManagerEmail;
    this.taxId = this.appStorageService.franchise.AndroidName;
    this.franchiseId = AppConfig.franchiseId;
  }
}
