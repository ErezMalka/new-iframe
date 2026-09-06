import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";
import { ConfigService } from './common-settings/config.service';
import { TranslationsService } from "../../shared/translations/translations.service";

@Injectable()
export class MetaDataService {

  private static readonly REDIRECT_FRAME_ID = 'franchise-redirect-frame';
  private static readonly REDIRECT_COVER_ID = 'franchise-redirect-cover';

  private isRedirecting = false;
  private isLeavingPage = false;

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
    // Hide the app before anything else, so its home screen is never painted
    // while we leave - this runs in the same tick as the server answer
    this.coverScreen();
    this.navigateOutOfApp(url);
  }

  private navigateOutOfApp(url: string) {
    // The android webview of the wrapper apps has no WebViewClient, so it hands
    // every page navigation over to the system instead of loading it, and a
    // navigation with no user gesture behind it is dropped without an error.
    // Show the target in an iframe there - an iframe is loaded as a sub resource
    // and never goes through that navigation handling
    if (this.isAndroidWebView()) {
      this.displayUrlInFullScreenFrame(url);
      return;
    }

    // When we sit in an iframe of our own site, move the hosting page.
    // A cross origin top navigation is refused silently (no exception is thrown),
    // so this must never be the only attempt - see the current window below
    if (window.top && window.top !== window.self && this.isSameOriginTop()) {
      try {
        window.top.location.replace(url);
      } catch (error) { }
    }

    // Watch for the page actually leaving, so the safety net below stays off
    // whenever the redirect did work
    const markLeaving = () => { this.isLeavingPage = true; };
    window.addEventListener('pagehide', markLeaving);
    window.addEventListener('beforeunload', markLeaving);

    // Redirect - the normal path on the web, in ios and in any webview that
    // loads navigations itself
    try {
      window.location.replace(url);
    } catch (error) {
      window.location.href = url;
    }

    // Safety net for a webview that swallows the redirect without announcing
    // itself as one. The screen is already covered, so this costs no visible
    // delay - it only decides what fills a screen the user cannot see yet
    setTimeout(() => {
      if (this.isLeavingPage) return;
      this.displayUrlInFullScreenFrame(url);
    }, 1500);
  }

  private coverScreen() {
    if (document.getElementById(MetaDataService.REDIRECT_COVER_ID)) return;
    try {
      const cover = document.createElement('div');
      cover.id = MetaDataService.REDIRECT_COVER_ID;
      cover.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;' +
        'background:#ffffff;z-index:2147483646;';
      document.body.appendChild(cover);
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } catch (error) { }
  }

  private displayUrlInFullScreenFrame(url: string) {
    if (document.getElementById(MetaDataService.REDIRECT_FRAME_ID)) return;
    try {
      const frame = document.createElement('iframe');
      frame.id = MetaDataService.REDIRECT_FRAME_ID;
      frame.src = url;
      frame.setAttribute('allow', 'geolocation *; payment *; clipboard-write *');
      frame.setAttribute('frameborder', '0');
      frame.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;' +
        'border:0;margin:0;padding:0;background:#ffffff;z-index:2147483647;';
      document.body.appendChild(frame);
    } catch (error) { }
  }

  private isAndroidWebView(): boolean {
    const userAgent = navigator.userAgent || '';
    // "wv" is the token android puts in the user agent of a webview, as opposed
    // to chrome itself
    return /Android/i.test(userAgent) && /;\s*wv[;)]/i.test(userAgent);
  }

  private isSameOriginTop(): boolean {
    try {
      // Throws when the hosting page belongs to another origin
      return !!window.top.location.href;
    } catch (error) {
      return false;
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
