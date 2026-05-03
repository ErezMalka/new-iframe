import { Component, OnInit } from '@angular/core';
import { TranslationsService } from "../../shared/translations/translations.service";
import { Router } from "@angular/router";
import { AppConfig } from "../../app.config";
import {VersionImageService} from "../../core/services/common-settings/version-image.service";
import {ConfigService} from "../../core/services/common-settings/config.service";

@Component({
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  public graphics = {
    logo: '',
    cover: '',
    homeHeaderPartUrlImage: ''
  };

  public colors = {
    menuColor: '',
    buttonColor: ''
  };

  public lang: string;

  constructor(private translationsService: TranslationsService,
              private router: Router,
              private imageVersionService: VersionImageService,
              private configService: ConfigService) {
  }

  ngOnInit(): void {
    this.initializeGraphics();
  }


  private initializeGraphics() {
    this.graphics.logo = AppConfig.settings.logo;
    this.lang = this.translationsService.language();
    this.graphics.homeHeaderPartUrlImage = this.imageVersionService.updateImageVersion(`${this.configService.imagePath}${this.configService.franchiseId}/${this.lang}/home-what-would-you-like.png`);
    this.colors.buttonColor = AppConfig.settings.buttonColor;
    this.colors.menuColor = AppConfig.settings.menuColor;
  }

}
