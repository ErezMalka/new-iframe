import { Component, OnInit } from '@angular/core';
import { AppConfig } from '../../app.config';
import {AppStorageService} from "../../app.storage.service";


@Component({
  selector: 'app-policy',
  templateUrl: 'policy.component.html'
})
export class PolicyComponent implements OnInit { 

  public name:string;
  public taxId:string;

  constructor(private appStorageService: AppStorageService){}
  
  ngOnInit(): void {
    this.name = AppConfig.settings.name;
    this.taxId = this.appStorageService.franchise.AndroidName;
  }
}
