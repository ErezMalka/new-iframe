import {Component, EventEmitter, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import { ScratchCard, SCRATCH_TYPE } from 'scratchcard-js';
import {AppConfig} from "../../../app.config";
import {TranslationsService} from "../../../shared/translations/translations.service";
import {AppStorageService} from "../../../app.storage.service";
import {MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import {CommonFunctionsService} from "../../../core/services/common-settings/common-functions.service";

@Component({
  selector: 'scratch-coupon',
  templateUrl: './discount-coupon.component.html',
  styleUrls: ['./discount-coupon.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DiscountCouponComponent implements OnInit {

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

  public discount: any;

  constructor(private translationsService: TranslationsService,
              private appStorageService: AppStorageService,
              public dialogRef: MatDialogRef<DiscountCouponComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.discount = this.data.discount;
  }

  ngOnInit() {
    this.displayWinnerInformation = false;
    this.initializeGraphics();
  }

  private getLanguage() {
    return this.translationsService.language();
  }

  private initializeGraphics() {
    this.graphics.logo = AppConfig.settings.logo;
    this.graphics.cover = AppConfig.settings.cover;
    this.colors.menuColor = AppConfig.settings.menuColor;
    this.colors.buttonColor = AppConfig.settings.buttonColor;
    this.lang = this.translationsService.language();
  }

  public ok() {
    this.dialogRef.close(true);
  }

  public displayDate(date) {
    const d = new Date(date);
    const curr_date = d.getDate();
    const curr_month = d.getMonth() + 1;
    const curr_year = d.getFullYear();
    return (curr_date < 10 ? '0' + curr_date : curr_date) + '.' + (curr_month < 10 ? '0' + curr_month : curr_month) + '.' + curr_year;
  }

  public close() {
    this.dialogRef.close(true);
  }

}
