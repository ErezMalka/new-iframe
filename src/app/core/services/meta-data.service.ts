import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";
import { ConfigService } from './common-settings/config.service';
import { TranslationsService } from "../../shared/translations/translations.service";

@Injectable()
export class MetaDataService {

  private isRedirecting = false;

  constructor(private http: HttpClient,
    private configService: ConfigService,
    private translationsService: TranslationsService) { }

    public getBranchCuponCodes (branchId): Observable<any> {
      return this.http.get(this.configService.serverUrl + 
        'MetaData/GetBranchCuponCodes?branchId=' + branchId);
    } 
    public getAppLanguages(): Observable<any> {
      return this.http.get(this.configService.serverUrl + 
        'MetaData/GetAppLanguages');
    }

  public getFranchiseGraphics(): Observable<any> {
    return this.http.get(this.configService.serverUrl +
      'MetaData/GetFranchiseGraphics?franchiseId=' + this.configService.franchiseId);
  }

  public GetFranchiseIdByName(name: string): Observable<any> {
    return this.http.get(`${this.configService.serverUrl}MetaData/GetFranchiseIdByName?franchiseName=${name}`);
  }

  public getFranchiseWithBranches(method): Observable<any> {
    return this.http.get(this.configService.serverUrl +
      'MetaData/GetFranchiseWithBranches?currentVersion=' +
      this.configService.currentVersion + '&franchiseId=' +
      this.configService.franchiseId + '&lang=' + this.translationsService.language() 
      + '&method=' + method)
      .pipe(switchMap((data: any) => {
        if (data && data.franchise && data.franchise.IsRedirect && data.franchise.RedirectURL) {
          this.redirectFranchise(data.franchise.RedirectURL);
          // Stop here - do not continue loading the app
          return EMPTY;
        }
        return of(data);
      }));
  }

  private redirectFranchise(redirectUrl: string) {
    if (this.isRedirecting) return;
    this.isRedirecting = true;
    let url = (redirectUrl || '').trim();
    if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
      url = 'https://' + url;
    }
    try {
      // When running inside an iframe redirect the hosting page, if allowed
      const target = window.top || window;
      target.location.replace(url);
    } catch (error) {
      // Cross origin iframe - redirect the iframe itself
      window.location.replace(url);
    }
  }

  public getCombos(): Observable<any> {
    return this.http.get(this.configService.serverUrl +
      'MetaData/GetCombos?franchiseId=' + this.configService.franchiseId);
  }

  public getCombosForBranch(branchId, method): Observable<any> {
    return this.http.get(this.configService.serverUrl +
      'MetaData/GetCombosForBranch?branchID=' + branchId + '&franchiseId=' +
      this.configService.franchiseId + '&method=' + method +
      '&lang=' + this.translationsService.language() +
      '&forApp=true&forKiosk=false');
  }

  public getDeliveryCitiesInformation(branchId): Observable<any> {
    return this.http.get(this.configService.serverUrl +
      'MetaData/GetDeliveryGroupCities?branchId=' + branchId);
  }

  public isOpen(branchId): Observable<any> {
    return this.http.get(this.configService.serverUrl +
      'MetaData/IsOpen?branchId=' + branchId);
  }

  public isOpenForPickupMethod(branchId,pickupMethod): Observable<any> {
    return this.http.get(this.configService.serverUrl +
      'MetaData/IsOpenForPickupMethod?branchId=' + branchId +'&pickupMethod=' + pickupMethod);
  }

  public BranchOpenForPickupMethod(branchId, method): Observable<any> {
    return this.http.get(this.configService.serverUrl +
      'MetaData/BranchOpenForPickupMethod?branchId=' + branchId +
      '&lang=' + this.translationsService.language() + '&method=' + method);
  }

  public getCoordinates(city, street, number): Observable<any> {
    return this.http.get(this.configService.serverUrl +
      'Locations/GetCoordinates?city=' + city + '&street=' + street + '&numberInStreet=' + number);
  }

  public getCities(): Observable<any> {
    return this.http.get(this.configService.serverUrl +
      'Locations/GetCities');
  }

  public getCityStreets(cityCode): Observable<any> {
    return this.http.get(this.configService.serverUrl +
      'Locations/GetCityStreets?cityCode=' + cityCode);
  }

  public getDeliveryGroupCities(branchId): Observable<any> {
    return this.http.get(this.configService.serverUrl +
      'MetaData/GetDeliveryGroupCities?branchId=' + branchId);
  }

  public getDeliveryGroup(lat, lng): Observable<any> {
    return this.http.get(this.configService.serverUrl +
      'Polygon/GetDeliveryGroup?franchiseId=' + this.configService.franchiseId +
      '&lat=' + lat +
      '&lng=' + lng);
  }


}
