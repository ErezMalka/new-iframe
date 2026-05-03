import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './common-settings/config.service';

@Injectable()
export class ScratchCouponService {

  constructor(private http: HttpClient,
              private configService: ConfigService) { }

  public getActiveCoupons (loginToken): Observable<any>  {
    return this.http.post(this.configService.serverUrl + 
      'ScratchCoupon/ActiveCoupons',
      {
        loginToken: loginToken
    });
  }

  public GetItem (itemId): Observable<any> {
    return this.http.get(this.configService.serverUrl + 
      'Menu/GetItem?itemId=' + itemId);
  }

  public getScratchCoupon(loginToken, orderId): Observable<any> {
    return this.http.post(this.configService.serverUrl +  "ScratchCoupon/ScratchCoupon",
      {
        loginToken: loginToken,
        orderId: orderId
      }
    );
  }

}
