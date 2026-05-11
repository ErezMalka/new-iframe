import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessagePopupComponent } from "../message-popup/message-popup.component";
import { MatDialog , MatDialogConfig } from "@angular/material/dialog";
import { TranslationsService } from "../../translations/translations.service";
import { Router } from '@angular/router';

@Injectable()
export class MessageService {

  data: any = {};

  constructor(private http: HttpClient,
    private router: Router,
              private matDialog: MatDialog,
              private translationsService: TranslationsService) {}

  public displayNoActiveOrderMessage(callback): any {
    let header = this.translationsService.translate('ERROR');
      let icon = "../../../assets/images/items/important-message.svg";
    let message = this.translationsService.translate('MESSAGE_NO_ACTIVE_ORDER');
    const data = {
      message,
      header,
      icon,
      withoutTimeout: true
    };

    this.displayPopupMessage(data, (result) => {
      if(callback){
        callback(result);
      }

    });
  }

  public displayServerErrorMessage(): any {
    let header = this.translationsService.translate('ERROR');
      let icon = "../../../assets/images/items/important-message.svg";
    let message = this.translationsService.translate('MESSAGE_SERVER_CONNECTION_PROBLEM');
    const data = {
      message,
      header,
      icon,
      withoutTimeout: true
    };
    this.displayPopupMessage(data);
  }

  public displayErrorMessage(message): any {
    let header = this.translationsService.translate('ERROR');
      let icon = "../../../assets/images/items/important-message.svg";
    
    const data = {
      message,
      header,
      icon,
      withoutTimeout: true
    };
    this.displayPopupMessage(data);
  }

  public displayBadCCMessage(): any {
    let header = this.translationsService.translate('ERROR');
      let icon = "../../../assets/images/items/important-message.svg";
    let message = "כרטיס אשראי לא תקין"
    const data = {
      message,
      header,
      icon,
      withoutTimeout: true
    };
    this.displayPopupMessage(data);
  }

  public displayPopupMessage(data, callback?) {
    const matDialogRef = this.matDialog.open(MessagePopupComponent, {
      data,
      //width: '50%',
      //maxWidth: '550px',
      minWidth: '350px',
      disableClose: false,
      panelClass: 'custom-mat-dialog-popup'
    });
    matDialogRef.afterClosed().subscribe((result) => {
      if (callback) {
        callback(result);
      }
    });
  }

}
