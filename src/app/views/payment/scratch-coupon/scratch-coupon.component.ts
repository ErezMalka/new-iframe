import {Component, EventEmitter, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import { ScratchCard, SCRATCH_TYPE } from 'scratchcard-js';
import {AppConfig} from "../../../app.config";
import {TranslationsService} from "../../../shared/translations/translations.service";
import {MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from "@angular/material/dialog";
import {BrowserIdentificatorService} from '../../../core/services/common-settings/browser-identificator.service';
import {SizeMobileInitializationComponent} from '../../../shared/classes/size-mobile-initialization.component';

@Component({
  selector: 'scratch-coupon',
  templateUrl: './scratch-coupon.component.html',
  styleUrls: ['./scratch-coupon.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ScratchCouponComponent extends SizeMobileInitializationComponent implements OnInit 
{

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
  public scratchCoupon: any;

  constructor(private translationsService: TranslationsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ScratchCouponComponent>,
    protected browserIdentificatorService: BrowserIdentificatorService) {
    super(browserIdentificatorService);
    if (this.data && this.data) {
      this.scratchCoupon = this.data.scratchCoupon;
    }
  }

  ngOnInit() {
    this.displayWinnerInformation = false;
    if (document.getElementById("cupon-img-win").classList.contains("show"))
    {document.getElementById("cupon-img-win").classList.remove("show");}
    this.initializeGraphics();
    this.loadScratchCoupon();
    this.initializeSize();
  }

  public getLanguage() {
    return this.translationsService.language();
  }

  private initializeGraphics() {
    this.graphics.logo = AppConfig.settings.logo;
    this.graphics.cover = AppConfig.settings.cover;
    this.colors.menuColor = AppConfig.settings.menuColor;
    this.colors.buttonColor = AppConfig.settings.buttonColor;
    this.lang = this.translationsService.language();
  }

  public next() {
    this.continue.emit();
    this.dialogRef.close(true);
  }

  public close() {
    this.continue.emit();
    this.dialogRef.close(true);
  }


  private loadScratchCoupon() {
    if (this.scratchCoupon) {
      const scContainer = document.getElementById('js--sc--container');
      const sc = new ScratchCard('#js--sc--container', {
        scratchType: SCRATCH_TYPE.CIRCLE,
        containerWidth: scContainer.offsetWidth,
        containerHeight: 300,
        imageForwardSrc: '../../../../assets/images/items/scratch-coupon-bg-new-full.jpg',//this.scratchCoupon.FranchiseImageUrl,
        imageBackgroundSrc: this.scratchCoupon.ImageUrl,
        clearZoneRadius: 50,
        nPoints: 30,
        pointSize: 4,
        callback: () => {
          this.displayWinnerInformation = true;
        }
      })
      // Init
      sc.init().then(() => { 
        setTimeout(() => {
          this.displayWinnerInformation = true; 
          document.getElementById("cupon-img-win").classList.add("show");
        } , 5000);
        sc.canvas.addEventListener('scratch.move', () => {})}).catch((error) => {});
    }
  }

}
