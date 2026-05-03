import { Component, EventEmitter, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { ScratchCard, SCRATCH_TYPE } from 'scratchcard-js';
import { AppConfig } from '../../../app.config';
import { TranslationsService } from '../../../shared/translations/translations.service';
import { AppStorageService } from '../../../app.storage.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import {DeliveryGroupAppModel} from "../../../models/order/delivery-group-app.model";
import {LanguageEnum} from "../../../enums/advanced/language.enum";

@Component({
  selector: 'delivery-condition',
  templateUrl: './delivery-condition.component.html',
  styleUrls: ['./delivery-condition.component.scss']
})
export class DeliveryConditionComponent implements OnInit {

  public graphics = {
    logo: '',
    cover: '',
  };
  public colors = {
    menuColor: '',
    buttonColor: ''
  };
  
  public lang: string;
  public deliveryGroup: DeliveryGroupAppModel;

  public scratchCoupon: any;

  constructor(private translationsService: TranslationsService,
              private appStorageService: AppStorageService,
              public dialogRef: MatDialogRef<DeliveryConditionComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.scratchCoupon = this.data.scratchCoupon;
    if (this.data) {
      this.deliveryGroup = this.data.deliveryGroup;
    }
  }

  ngOnInit() {
    this.initializeGraphics();
  }

  private initializeGraphics() {
    this.graphics.logo = AppConfig.settings.logo;
    this.graphics.cover = AppConfig.settings.cover;
    this.colors.menuColor = AppConfig.settings.menuColor;
    this.colors.buttonColor = AppConfig.settings.buttonColor;
    this.lang = this.translationsService.language();
  }
  
  public continue() {
    this.dialogRef.close(true);
  }

  public close() {
    this.dialogRef.close(false);
  }

  public getCashSymbol() {
    return this.translationsService.translate('COMMON_CASH');
  }

  public getPriceDisplay() {
    if (this.deliveryGroup) {
      return this.lang == LanguageEnum.EN ? this.deliveryGroup.MinSumForDelivery + '' + this.getCashSymbol() :
        this.getCashSymbol() + '' + this.deliveryGroup.MinSumForDelivery;
    }
    return '';
  }

}
