import {Component, EventEmitter, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import { ScratchCard, SCRATCH_TYPE } from 'scratchcard-js';
import {AppConfig} from "../../../app.config";
import {TranslationsService} from "../../../shared/translations/translations.service";
import {AppStorageService} from "../../../app.storage.service";
import {MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import {CommonFunctionsService} from "../../../core/services/common-settings/common-functions.service";

@Component({
  selector: 'scratch-coupon',
  templateUrl: './item-comments.component.html',
  styleUrls: ['./item-comments.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ItemCommentsComponent implements OnInit {

  public graphics = {
    logo: '',
    cover: '',
  };
  public colors = {
    menuColor: '',
    buttonColor: ''
  };
  public continue: EventEmitter<any> = new EventEmitter<any>();
  public displayWinnerInformation: boolean;
  public lang: string;

  public comments: any = "";

  constructor(private translationsService: TranslationsService,
              private appStorageService: AppStorageService,
              public dialogRef: MatDialogRef<ItemCommentsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.comments = '' + this.data.comments;
  }

  ngOnInit() {
    this.displayWinnerInformation = false;
    this.initializeGraphics();
  }

  private initializeGraphics() {
    this.graphics.logo = AppConfig.settings.logo;
    this.graphics.cover = AppConfig.settings.cover;
    this.colors.menuColor = AppConfig.settings.menuColor;
    this.colors.buttonColor = AppConfig.settings.buttonColor;
    this.lang = this.translationsService.language();
  }

  public ok() {
    this.dialogRef.close(this.comments);
  }

  public close() {
    this.dialogRef.close(this.data.comments);
  }

}
