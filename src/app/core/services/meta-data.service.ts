import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { ConfigService } from './common-settings/config.service';
import { TranslationsService } from "../../shared/translations/translations.service";

@Injectable()
export class MetaDataService {

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
      + '&method=' + method);
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
