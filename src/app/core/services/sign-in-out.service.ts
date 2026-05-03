import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfigService } from './common-settings/config.service';
import { AppStorageService } from "../../app.storage.service";
import {StorageValueEnum} from "../../enums/advanced/storage-value.enum";
import * as moment from "moment";

@Injectable()
export class SignInOutService {

  constructor(private http: HttpClient,
              private configService: ConfigService,
              
              private appStorageService: AppStorageService) {

  }

  public isUserSigned = new BehaviorSubject(false);

  public createUserAndGetCode(phone, cancelVerification): Observable<any> {
    return this.http.post(this.configService.serverUrl +
      'Account/CreateUserAndGetCode', {
      franchiseId: this.configService.franchiseId,
      phone: phone,
      country: this.configService.country,
      noVerification: cancelVerification
    });
  };

  public resendCode(phone): Observable<any> {
    return this.http.post(this.configService.serverUrl + 'Account/ResendCode',
      {
        franchiseId: this.configService.franchiseId,
        phone: phone
      }
    );
  }

  public verifyLoginCode(phone, code): Observable<any> {
    return this.http.post(this.configService.serverUrl + 'Account/VerifyLoginCode',
      {
        franchiseId: this.configService.franchiseId,
        phone: phone,
        code: code
      });
  }

  public DeleteAppUsersAccount(): Observable<any> {
    var token = this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.configService.franchiseId);
    return this.http.post(this.configService.serverUrl + 'Account/DeleteAppUsersAccount',
      {
        franchiseId: this.configService.franchiseId,
        token: token
      });
  }

  public DeleteAppUserAccount(id): Observable<any> {
    return this.http.post(this.configService.serverUrl + 'Account/DeleteAppUserAccount',
      {
       id: id
      });
  }

  public GetUserMemberPointsLog(appUserId): Observable<any> {
    return this.http.get(this.configService.serverUrl + 'Account/GetUserMemberPointsLog?appUserId='
    + appUserId );
  }


  public saveAppUserAddress(loginToken, address): Observable<any> {
    return this.http.post<any>(this.configService.serverUrl +
      'Account/SaveAppUserAddress',
      {
        loginToken: loginToken,
        address: address,
        franchiseId: this.configService.franchiseId
    });
  }

  public savePushToken(pushToken, loginToken): Observable<any> {
    return this.http.post<any>(this.configService.serverUrl +
      'Account/SaveAppUserPushToken',
      {
        pushToken: pushToken,
        loginToken: loginToken
    });
  }

  public verifyToken (token): Observable<any> {
    return this.http.post<any>(this.configService.serverUrl +
      "Account/VerifyLoginToken",
      {
        token: token,
        franchiseId: this.configService.franchiseId || null
    });
  }

  public deleteCCToken (id): Observable<any> {
    return this.http.post<any>(this.configService.serverUrl +
      "Account/DeleteCCToken",
      {
        id: id
      });
  }

  public updateUserDetails (user): Observable<any> {
    console.log("sign-in-out-service: user", user);

    if(!this.dateIsValid(user.Anniversary) && user.AnniversaryStr != null){
      user.Anniversary = new Date(user.AnniversaryStr);
    }

    if(!this.dateIsValid(user.BirthDate) && user.BirthDateStr != null){
      user.BirthDate = new Date(user.BirthDateStr);
    }

    if(!this.dateIsValid(user.FirstLogin) && user.FirstLoginStr != null){
      user.FirstLogin = new Date(user.FirstLoginStr);
    }

    if(!this.dateIsValid(user.JoinedToClub) && user.JoinedToClubStr != null){
      user.JoinedToClub = new Date(user.JoinedToClubStr);
    }

    return this.http.post<any>(this.configService.serverUrl +
      "Account/UpdateUserDetails",
      {
        user: user
    });
  }

  dateIsValid(date) {
    if( date instanceof Date) return true;
    else{
      console.log("not instance of date: date", date);
      return false;

    }
  }

  public getAppLanguages(): Observable<any> {
    return this.http.get(this.configService.serverUrl +
      'Localization/GetLanguagesForIframe?franchiseId='+ this.configService.franchiseId );
 
  }

  public signOut() {
    console.log("signOut");
    this.appStorageService.removeItemInStorage(StorageValueEnum.USER_DETAILS);
    this.appStorageService.removeItemInStorage(StorageValueEnum.LOGIN_TOKEN + "_" + + this.configService.franchiseId);
    this.appStorageService.removeItemInStorage(StorageValueEnum.PUSH_TOKEN);
    this.appStorageService.removeItemInStorage(StorageValueEnum.PAYMENT_DATA);
    this.appStorageService.removeItemInStorage(StorageValueEnum.CREDIT_CARD_ENCRYPTED);
    this.appStorageService.removeItemInStorage(StorageValueEnum.CREDIT_CARD_FOR_DIGITS);
    this.appStorageService.removeItemInStorage(StorageValueEnum.CODE_SENT_DATE);
    this.appStorageService.removeItemInStorage(StorageValueEnum.PHONE);
      this.appStorageService.wasScratchDisplayed = false;
      this.appStorageService.isUsedScratchCoupon = false;
      this.appStorageService.useScratchCoupon = true;
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  public isLoggedOut() {
    return !this.isLoggedIn();
  }

  public getExpiration() {
    const expiration = this.appStorageService.getItemFromLocalStorage(StorageValueEnum.EXPIRES_AT);
    if (expiration) {
      const expiresAt = JSON.parse(expiration);
      return moment(expiresAt);
    } else {
      return new Date();
    }
  }

  public deleteUserAddress(id): Observable<any> {
    return this.http.post<any>(this.configService.serverUrl +
      'Account/DeleteUserAddress',
      {
        id: id
      });
  }


}
