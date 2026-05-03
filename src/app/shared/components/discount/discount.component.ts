import { Component, Input, OnInit } from '@angular/core';
import { TranslationsService } from '../../translations/translations.service';
import { AppConfig } from '../../../app.config';
import { DiscountModel } from "../../../models/discount/discount.model";

@Component({
  selector: 'discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.scss']
})
export class DiscountComponent implements OnInit {

  public graphics = {
    logo: '',
    cover: '',
  };

  public colors = {
    menuColor: '',
    buttonColor: ''
  };

  public lang: string;

  public cashSymbol: string;

  @Input()
  public discount: DiscountModel;

  constructor( private translationService: TranslationsService) {
  }

  ngOnInit() {
    this.initializeGraphics();
  }

  private initializeGraphics() {
    this.graphics.logo = AppConfig.settings.logo;
    this.colors.menuColor = AppConfig.settings.menuColor;
    this.colors.buttonColor = AppConfig.settings.buttonColor;
    this.lang = this.translationService.language();
    this.cashSymbol = AppConfig.cashSymbol;
  }

}
