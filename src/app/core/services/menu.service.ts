import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { ConfigService } from "./common-settings/config.service";
import {TranslationsService} from "../../shared/translations/translations.service";

@Injectable()
export class MenuService {

  constructor(private http: HttpClient,
              private configService: ConfigService,
              private translationService: TranslationsService) {}

  public getMenu(branchId): Observable<any> {
   // return this.http.get<any>(this.configService.serverUrl + 'Menu/GetMenu?franchiseId=' +
    //  this.configService.franchiseId);
      return this.http.get<any>(this.configService.serverUrl + 'Menu/GetMenuNew?branchId=' + branchId);
  }

  public getTVSettings(branchId): Observable<any> {
     return this.http.get<any>(this.configService.serverUrl + 'Iframe/GetTVSettings?branchId=' + branchId);
   }

  public getDiscount(branchId, userId?): Observable<any> {
    return this.http.get<any>(this.configService.serverUrl + 'MetaData/GetDiscountNew?franchiseId=' +
      this.configService.franchiseId + 
      '&branchId=' + branchId +
      '&lang=' + this.translationService.language()+(userId ? '&userId=' + userId : ''));
  }

  public getAllDiscounts(branchId, userId?): Observable<any> {
    return this.http.get<any>(this.configService.serverUrl + 'MetaData/GetAllDiscounts?franchiseId=' +
      this.configService.franchiseId + 
      '&branchId=' + branchId + 
      '&lang=' + this.translationService.language()+
      (userId ? '&userId=' + userId : ''));
  }
  public getCombosForBranch(branchId, method): Observable<any> {
    return this.http.get(this.configService.serverUrl +
      'MetaData/GetCombosForBranch?branchID=' + branchId + '&franchiseId=' +
      this.configService.franchiseId + '&method=' + method +
      '&lang=' + this.translationService.language() +
      '&forApp=true&forKiosk=false');
  }

  public getMenuForBranch(branchId, method, checkHours, lang?): Observable<any> {
   this.configService.selectedBranchId = branchId;
    if (lang != 
        this.translationService.getDefaultLanguage()){
          return this.http.get<any>(this.configService.serverUrl +
            'Menu/GetTranslatedMenuForBranch?branchID=' + branchId + 
            '&lang=' + lang + 
            '&method=' + method + '&checkHours=true&forApp=true&forKiosk=false');

    } else {
      return this.http.get<any>(this.configService.serverUrl +
        'Menu/GetMenuForBranch_?branchID=' +
        branchId + '&franchiseId=' +
        this.configService.franchiseId + '&method=' + method + '&checkHours=true&forApp=true&forKiosk=false');
    }
    
  }

   public getFutureMenuForBranch(branchId, method, dayOfWeek, dateString, timeString, lang?): Observable<any> {
     this.configService.selectedBranchId = branchId;
    if (lang != 
        this.translationService.getDefaultLanguage()){
          return this.http.get<any>(this.configService.serverUrl +
            'Menu/GetTranslatedFutureMenuForBranch?branchID=' + branchId + 
            '&lang=' + lang + 
            '&method=' + method + '&dayOfWeek=' + dayOfWeek +
            '&dateString=' + dateString + 
            '&timeString=' + timeString + '&forApp=true&forKiosk=false');

    } else {
      return this.http.get<any>(this.configService.serverUrl +
        'Menu/GetFutureMenuForBranch?branchID=' +
        branchId + '&franchiseId=' +
       '&method=' + method + '&dayOfWeek=' + dayOfWeek +
            '&dateString=' + dateString + 
            '&timeString=' + timeString + '&forApp=true&forKiosk=false');
    }
    
  }

}
