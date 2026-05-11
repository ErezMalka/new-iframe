import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import { AppConfig } from '../../app.config';
import { Observable } from "rxjs";

@Injectable()
export class TranslationsService {

  static data: any = {};


  private defaultLanguage = environment.language || 'he';
   //private defaultLanguage = 'en';

  private currentLanguage = this.defaultLanguage;

  constructor(private http: HttpClient) {
  }

  public getLanguagesForIframe(): Observable<any> {
    return this.http.get<any>(AppConfig.config.serverUrl + 
      'Localization/GetLanguagesForIframe?franchiseId='+ AppConfig.franchiseId);
  }

/*  public use_(lang?: string): Promise<{}> {

    return new Promise<{}>((resolve, reject) => {
     // this.currentLanguage = lang || this.defaultLanguage;
      
      const langPath = `assets/i18n/${this.currentLanguage.toLowerCase()}.json?v=${new Date().getTime()}`;
      this.http.get<{}>(langPath).subscribe(
        translation => {
          TranslationsService.data = Object.assign({}, translation || {});
          resolve(TranslationsService.data);
        },
        (error) => { 
          TranslationsService.data = {};
          resolve(TranslationsService.data);
        }
      );
    });
  }*/


  public use(): Promise<{}> {

    return new Promise<{}>((resolve, reject) => {
      this.http.get<any>(AppConfig.config.serverUrl + 
        'Localization/GetI18ForIframe?franchiseId='+ AppConfig.franchiseId +'&languageCode=' +this.currentLanguage.toLowerCase())
        .subscribe((i18res) => {
          //var translation = JSON.parse(i18res);
          //console.log("translation",translation);
          TranslationsService.data = Object.assign({}, i18res || {});
          resolve(TranslationsService.data);
        },
        (error) => {
          TranslationsService.data = {};
          resolve(TranslationsService.data);
        });





      /*const langPath = `assets/i18n/${this.currentLanguage.toLowerCase()}.json?v=${new Date().getTime()}`;
      this.http.get<{}>(langPath).subscribe(
        translation => {
          TranslationsService.data = Object.assign({}, translation || {});
          resolve(TranslationsService.data);
        },
        (error) => {
          TranslationsService.data = {};
          resolve(TranslationsService.data);
        }
      );*/
    });
  }

  public language() {
 //   console.log("this.currentLanguage",this.currentLanguage);
    //console.log("environmentlanguage",environment.language);
    return this.currentLanguage.toLowerCase();
  }

  public getDefaultLanguage() {
    return this.defaultLanguage.toLowerCase();
  }

  public setLanguage(lang, callback?) {
    environment.language = lang;
    this.currentLanguage = lang;
    this.use();
   
    if (callback) {
      callback();
    }
    //this.defaultLanguage = lang;
  }


  translate(key: any): any {
    return (TranslationsService.data[key] != undefined || 
            TranslationsService.data[key] != null) 
            ? TranslationsService.data[key] : key;
  }

  

}
