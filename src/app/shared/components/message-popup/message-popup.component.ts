import { Component, Inject, OnInit } from '@angular/core';
import { TranslationsService } from '../../translations/translations.service';
import { AppConfig } from '../../../app.config';
import { MAT_DIALOG_DATA, MatDialogRef , MatDialogConfig } from '@angular/material/dialog';
import { DiscountModel } from '../../../models/discount/discount.model';

@Component({
  selector: 'message-popup',
  templateUrl: './message-popup.component.html',
  styleUrls: ['./message-popup.component.scss']
})
export class MessagePopupComponent implements OnInit {

  public graphics = {
    logo: '',
    cover: '',
  };

  public colors = {
    menuColor: '',
    buttonColor: ''
  };

  public lang: string;
  public txtArr: string[];
  public messageText: any;
  public header: string;
  public isBranchClose: boolean;
  public icon: string;
  public discount: DiscountModel;

  public timeOut: number;
  public withoutTimeout: boolean;
  public isUsedPre: boolean;
  public workingHours: string;
  public workingHoursStr: string[];
  public workingHoursArr: any[] =[];
  public isGoback: boolean;
  public displayHours:boolean = false;

  private defaultTimeOut = 3000;

  public phoneNumber: string;
  public address: string;
  public isContact: boolean;
  public desc: any;
  isAbout: boolean;

  public fullMessage: any;
  isOpenForDelivery: any;
  isOpenForTA: any;

  public sun: string;
  public mon: string;
  public tue: string;
  public wed: string;
  public thu: string;
  public fri: string;
  public sat: string;


  constructor( private translationsService: TranslationsService,
               public dialogRef: MatDialogRef<MessagePopupComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any ) {
    if (data) {
      this.isGoback = data.isGoback;
      this.fullMessage = data.message;
      console.log("this.fullMessage",this.fullMessage);
      this.messageText = data.myMessageText || this.fullMessage;
      console.log("this.messageText",this.messageText);
      this.withoutTimeout = data.withoutTimeout;
      this.isUsedPre = data.isUsedPre;
      this.timeOut = data.timeOut || this.defaultTimeOut;
      if(this.messageText && (this.messageText.Message != null)){
      this.txtArr = this.trimEmptySpace(this.messageText).split('\n');
      }
      if(data.isContact){
        this.phoneNumber = data.phoneNumber;
        this.address = data.address;
        this.isContact = data.isContact;

        console.log("this.isContact",this.isContact);
        console.log("this.phoneNumber",this.phoneNumber);
        console.log("this.address",this.address);
      }
      if(data.isAbout){
        this.desc = data.desc;
        console.log("this.desc",this.desc);
        console.log("data.isAbout",data.isAbout);
        this.isAbout = true;
      }


      this.header = data.header;
      this.isBranchClose = data.isBranchClose;
      if(this.fullMessage && this.fullMessage?.ImageGuid && this.fullMessage?.ImageGuid != null){
      this.icon = data.icon;
      console.log("this.icon", this.icon);
      }
      else {
        this.icon = "../../../assets/images/items/important-message.svg";
        console.log("this.icon", this.icon);
      }

      if(data.workingHours){
        console.log("workingHours", data.workingHours);
        this.sun = this.translationsService.translate('SUNDAY');
        this.mon = this.translationsService.translate('MONDAY');
        this.tue = this.translationsService.translate('TUESDAY');
        this.wed = this.translationsService.translate('WEDNESDAY');
        this.thu = this.translationsService.translate('THIRSDAY');
        this.fri = this.translationsService.translate('FRIDAY');
        this.sat = this.translationsService.translate('SATURDAY');
        console.log(data.workingHoursArr[this.sun]);
        this.workingHoursArr.push(
          {
            day: this.sun,
            hours: data.workingHoursArr[this.sun],
          });
        this.workingHoursArr.push(
          {
            day: this.mon,
            hours: data.workingHoursArr[this.mon],
          });
        this.workingHoursArr.push(
          {
            day: this.tue,
            hours: data.workingHoursArr[this.tue],
          });
        this.workingHoursArr.push(
          {
            day: this.wed,
            hours: data.workingHoursArr[this.wed],
          });
        this.workingHoursArr.push(
          {
            day: this.thu,
            hours: data.workingHoursArr[this.thu],
          });
        this.workingHoursArr.push(
          {
            day: this.fri,
            hours: data.workingHoursArr[this.fri],
          });
        this.workingHoursArr.push(
          {
            day: this.sat,
            hours: data.workingHoursArr[this.sat],
          });

          console.log(this.workingHoursArr);

        this.workingHours = data.workingHours;
       // this.workingHoursArr = data.workingHoursArr;
        //this.workingHoursStr = this.trimEmptySpace(this.workingHours).split(':');
        this.workingHoursStr = this.trimEmptySpace(this.workingHours).split('\n');

      }
      
      
      //console.log("TEXT " + this.txtArr.length,this.txtArr);
      if (!this.withoutTimeout) {
        setTimeout(() => {
         this.close();
        }, this.timeOut);
      }
    }
  }


  public getLanguage() {
    return this.translationsService.language();
  }

  public trimEmptySpace(text:string) {
   // console.log("text", text);
    //console.log("texttrim()", text.trim());
    var find = ':';
    var re = new RegExp(find, 'g');
    
    //text = text.replace(re, '');
    if(text.includes(this.translationsService.translate('SUNDAY')+":")){
     // console.log("textstartsWith",text);
      text = text.replace(this.translationsService.translate('SUNDAY')+":", '');
    }
    if(text.includes(this.translationsService.translate('MONDAY'))){
     // console.log("textstartsWith",text);
      text = text.replace(this.translationsService.translate('MONDAY')+":", '');
     // console.log("replace",text);
    }
    if(text.includes(this.translationsService.translate('TUESDAY'))){
      //console.log("textstartsWith",text);
      text = text.replace(this.translationsService.translate('TUESDAY')+":", '');
     // console.log("replace",text);
    }
    if(text.includes(this.translationsService.translate('WEDNESDAY'))){
      //console.log("textstartsWith",text);
      text = text.replace(this.translationsService.translate('WEDNESDAY')+":", '');
      //console.log("replace",text);
    }
    if(text.includes(this.translationsService.translate('THIRSDAY'))){
     // console.log("textstartsWith",text);
      text = text.replace(this.translationsService.translate('THIRSDAY')+":", '');
    }
    if(text.includes(this.translationsService.translate('FRIDAY'))){
      text = text.replace(this.translationsService.translate('FRIDAY')+":", '');
    }
    if(text.includes(this.translationsService.translate('SATURDAY'))){
      text = text.replace(this.translationsService.translate('SATURDAY')+":", '');
    }
    return text ? text?.trim() : text;
  }

  public watchMenu() {
    this.dialogRef.close({isDigitalMenu:true });
  }

  public close() {
    this.dialogRef.close({isDigitalMenu:false });
  }

 

  ngOnInit(): void {
    //console.log("this.isback", this.isGoback);
    this.initializeGraphics();
  }

  private initializeGraphics() {
    this.graphics.logo = AppConfig.settings.logo;
    this.graphics.cover = AppConfig.settings.cover;
    this.colors.menuColor = AppConfig.settings.menuColor;
    this.colors.buttonColor = AppConfig.settings.buttonColor;
    this.lang = this.translationsService.language();
  }

}
