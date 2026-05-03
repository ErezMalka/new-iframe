import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { TranslationsService } from '../../shared/translations/translations.service';
import { AppConfig } from '../../app.config';
import {AppStorageService} from "../../app.storage.service";
import {StorageValueEnum} from "../../enums/advanced/storage-value.enum";
import {SignInOutService} from "../../core/services/sign-in-out.service";

@Component({
  selector: 'sign-out',
  templateUrl: './sign-out.component.html',
  styleUrls: ['./sign-out.component.scss']
})
export class SignOutComponent implements OnInit {

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

  @Output()
  public signOut = new EventEmitter<boolean>();

  constructor(private translationService: TranslationsService,
              private signInOutService: SignInOutService) { }

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

  public signOutUser() {
    // remove user data;
    this.signInOutService.signOut();
    this.signOut.emit(true);
  }

}
