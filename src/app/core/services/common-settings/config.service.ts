import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable()
export class ConfigService {

  constructor(private http: HttpClient) {}

  public serverUrl: string;
  public franchiseId: number;
  public branchId: number;
    public selectedBranchId: number =0;
  public isEatIn: boolean = false;
  public isDelivery: boolean = false;
  public isTakeaway: boolean = false;
  public isMenu: boolean = false;
  public isTVMenu: boolean = false;
  public useTranzilaIframe: boolean = false;
  public useMeshulamIframe: boolean = false;
  public meshulamEnviroment:string;
  public pwaUrl: string;
  public imagePath: string;
  public currentUrl: string;
  public configSettings: any={};

  public currentVersion = environment.currentVersion;
  public country = environment.country;
  public tvColumns:number;
  public tvRows:number;
  public tvTimer:number;
  public tvImagePath:string;
}
