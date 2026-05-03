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
    console.log("this.currentLanguage",this.currentLanguage);
  }

  public getLanguagesForIframe(): Observable<any> {
    return this.http.get<any>(AppConfig.config.serverUrl + 
      'Localization/GetLanguagesForIframe?franchiseId='+ AppConfig.franchiseId);
  }

/*  public use_(lang?: string): Promise<{}> {

    return new Promise<{}>((resolve, reject) => {
      console.log("this.currentLanguage",this.currentLanguage);
     // this.currentLanguage = lang || this.defaultLanguage;
      console.log("this.currentLanguage",this.currentLanguage);
      
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
      console.log("this.currentLanguage",this.currentLanguage);
      this.http.get<any>(AppConfig.config.serverUrl + 
        'Localization/GetI18ForIframe?franchiseId='+ AppConfig.franchiseId +'&languageCode=' +this.currentLanguage.toLowerCase())
        .subscribe((i18res) => {
          console.log("i18res",i18res);
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
    console.log("setLanguage",lang);
    environment.language = lang;
    this.currentLanguage = lang;
    this.use();
   
    console.log("this.currentLanguage",this.currentLanguage);
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
