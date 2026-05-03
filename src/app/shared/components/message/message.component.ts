import { Component, Input, OnInit } from '@angular/core';
import { TranslationsService } from '../../translations/translations.service';
import { AppConfig } from '../../../app.config';

@Component({
  selector: 'messsage',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  public graphics = {
    logo: '',
    cover: '',
  };

  public colors = {
    menuColor: '',
    buttonColor: ''
  };

  public lang: string;

  @Input()
  public type: string; // error; success
  @Input()
  public message: string;

  private defaultType = 'error';

  constructor( private translationsService: TranslationsService) {
  }

  ngOnInit(): void {
    this.initializeGraphics();
    this.type = this.type || this.defaultType;
  }

  private initializeGraphics() {
    this.graphics.logo = AppConfig.settings.logo;
    this.graphics.cover = AppConfig.settings.cover;
    this.colors.menuColor = AppConfig.settings.menuColor;
    this.colors.buttonColor = AppConfig.settings.buttonColor;
    this.lang = this.translationsService.language();
  }

}
