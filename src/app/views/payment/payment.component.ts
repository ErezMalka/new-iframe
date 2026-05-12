import { Component, OnInit } from '@angular/core';
import { OrderService } from "../../core/services/order.service";
import { AppConfig } from "../../app.config";
import { MenuService } from '../../core/services/menu.service';
import { CommonFunctionsService } from '../../core/services/common-settings/common-functions.service';

import { OrderAppModel } from "../../models/order/order-app.model";
import { TranslationsService } from "../../shared/translations/translations.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog , MatDialogConfig } from "@angular/material/dialog";
import { ScratchCouponComponent } from "./scratch-coupon/scratch-coupon.component";
import { AppStorageService } from "../../app.storage.service";
import { ScratchCouponService } from "../../core/services/scratch-coupon.service";
import { StorageValueEnum } from "../../enums/advanced/storage-value.enum";
import { LanguageEnum } from "../../enums/advanced/language.enum";
import * as moment from 'moment';
import { ConfigService } from '../../core/services/common-settings/config.service';
import { MeshulamService } from '../../shared/services/meshulam.service';
import { RouteActivateService } from "../home/route-activate.service";


@Component({
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {

  public graphics = {
    logo: '',
    cover: '',
  };

  public colors = {
    menuColor: '',
    buttonColor: ''
  };

  public cashSymbol: string;

  public lang: string;
  public order: OrderAppModel;

  public orderNumber: number;

  private notRemovedFields = ['BranchId', 'IsDelivery', 'IsTakeAway', 'OrderItems', 'OrderPizzas', 'Sum'];

  public paymentResult: any;
  public branch : any;
  public isTa : boolean = false;
  public branchAddress : string;
  public futureDateTime : Date;
  public lng: number;
  public lat: number;
  public ll: string;
  public isFutureOrder: boolean;
  public currentTime: Date;
  public estimatedTakeAwayTime: Date;


  public isLoading = {
    isScratchCoupon: false
  };

  public scratchCoupon: any;

  public franchiseId: any;
  public useTranzilaIframe: boolean;
  public useMeshulamIframe: boolean;
  private meshulamProcessId:string;
  private meshulamProcessToken:string;
  isDeivery: boolean;
  estdeliveryTimeInMinutes: Date;
  takeAwayTimeInMinutes: number;
  deliveryTimeInMinutes: number;
  pointsPerOrder: number;
  private timerId;

  constructor(private orderService: OrderService,
    private translationsService: TranslationsService,
    private matDialog: MatDialog,
    private appStorageService: AppStorageService,
    private menuService:MenuService,
    private commonFunctionsService:CommonFunctionsService,
    private scratchCouponService: ScratchCouponService,
    private router: Router,
    private routeActivate: RouteActivateService,

    private configService: ConfigService,
    private meshulamService:MeshulamService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    //this.useTranzilaIframe = this.configService.useTranzilaIframe;// false;
    //this.useMeshulamIframe = this.configService.useMeshulamIframe;
    this.initializeGraphics();
    //if (this.useMeshulamIframe) {
     // this.makePaymentMeshulam(); 
    //} else {
      this.makePayment();
    //}
   
   
    //this.franchiseId = this.route.snapshot.paramMap.get('franchiseId');
  }

  public getLanguage() {

    //console.log("this.translationsService.language()", this.translationsService.language());
    return this.translationsService.language();
  }

  displayOrderStatus()  {

    if (AppConfig.configSettings.orderStatus 
      && AppConfig.configSettings.orderStatus == true
      && (this.paymentResult && this.paymentResult.Data
      && this.paymentResult.Data?.success) ) {
      return true;
    } else {
      return false;
    }
  }

  /*public changeLanguage() {
    console.log("this.translationService.language", this.translationService.language());
    this.translationService.setLanguage(this.selectedLang, ()=>{
      //this.selectedLang = this.translationService.language();
      console.log("this.translationService.language", this.translationService.language());
      this.initializeMenuForBranch(() => {
        console.log("this.router.navigateByUrl(`/${this.franchiseId}/menu`)");
        console.log("---this.order",this.order);

        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload'
        this.router.navigateByUrl(`/${this.franchiseId}/menu`);
      });
    }
      
      
      );
    
  }*/

  openNav() {
    document.getElementById("mySidebar").style.width = "350px";
    document.getElementById("mySidebar").style.display = "flex";
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('sidebar-show');
  }

  hidePickUpTime()  {
    if (AppConfig.configSettings.hideFutureTATime 
      && AppConfig.configSettings.hideFutureTATime == true) {
      return true;
    } else {
      return false;
    }
  }

  hideDeliveryTime()  {
    if (AppConfig.configSettings.hideFutureDeliveryTime 
      && AppConfig.configSettings.hideFutureDeliveryTime == true) {
      return true;
    } else {
      return false;
    }
  }

  private makePayment() {
    this.franchiseId = this.configService.franchiseId;
     
    this.paymentResult = this.appStorageService.paymentResult;
    if (this.paymentResult && this.paymentResult.Data && this.paymentResult.Data?.success) {

      this.pointsPerOrder = this.appStorageService.pointsPerOrder;

      this.loadScratchCoupon();
      this.branchAddress = this.appStorageService.branch.Address;
      //console.log(this.branchAddress);
      this.lng = this.appStorageService.branch.Longitude;
      this.lat = this.appStorageService.branch.Latitude;
      //console.log(this.lat);
      //console.log(this.lng);
      this.ll = "https://waze.com/ul?ll="+this.lat+","+this.lng+"&navigate=yes";
      //console.log(this.ll);
      this.isTa = this.orderService.getOrder().IsTakeAway;
      this.isDeivery = this.orderService.getOrder().IsDelivery;
      this.futureDateTime = this.orderService.getOrder().FutureDateTime;
      this.isFutureOrder = this.orderService.getOrder().IsFutureOrder;
      var d = new Date();
      this.deliveryTimeInMinutes  = this.appStorageService.branch.DeliveryTimeInMinutes;
      this.takeAwayTimeInMinutes = this.appStorageService.branch.TakeawayTimeInMinutes;
      this.estimatedTakeAwayTime = moment(d).add(this.takeAwayTimeInMinutes, 'm').toDate();
      this.estdeliveryTimeInMinutes = moment(d).add(this.deliveryTimeInMinutes, 'm').toDate();
      this.orderNumber = this.paymentResult.Data?.orderId || "";
      this.appStorageService.setItemInLocalStorage("OrderId",this.orderNumber);
      this.orderService.getOrder().OrderPizzas = [];
      this.orderService.getOrder().OrderItems = [];
      this.orderService.getOrder().OrderCombos = [];
      this.orderService.getOrder().Comments = '';
      this.order.hasBonusItems = false;
      console.log("this.order.hasBonusItems = false;");
      this.orderService.recalculateSum();
    } else {
      this.isLoading.isScratchCoupon = true;
    }
  }

  private makePaymentMeshulam() {
    this.paymentResult = this.appStorageService.paymentResult;
    this.meshulamProcessId =  this.appStorageService.getItemFromLocalStorage("meshulamProcessId");
    this.meshulamProcessToken =  this.appStorageService.getItemFromLocalStorage("meshulamProcessToken");
    this.timerId= setInterval(() => this.checkTransactionStatus(), 2000);
    
  }


  public checkTransactionStatus() {
    this.meshulamService
            .CheckTransactionStatus(this.meshulamProcessId, this.meshulamProcessToken)
              .subscribe((response) => {
                if (response && response.Data && response.Data.success) {
                  if (this.timerId) {
                    clearInterval(this.timerId);
                  }
                }
              }, () => {
                 
                //this.messageService.displayServerErrorMessage();
              
              });
  }


  public isLoadingProgress() {
    return this.isLoading.isScratchCoupon;
  }

  private loadScratchCoupon() {
    this.scratchCoupon = undefined;
    const loginToken = this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.franchiseId);
    this.isLoading.isScratchCoupon = false;
    if (loginToken && this.paymentResult && this.paymentResult.Data &&
      this.paymentResult.Data?.success &&
      this.paymentResult.Data?.orderId) {
      this.scratchCouponService
        .getScratchCoupon(loginToken, this.paymentResult.Data?.orderId)
        .subscribe((result) => {
          if (result && result.Success && result.IsFoundScratchCoupons) {
            this.scratchCoupon = result.ScratchCoupon;
            setTimeout(() => {
              const matDialogRef = this.matDialog.open(ScratchCouponComponent, {
                data: {
                  scratchCoupon: this.scratchCoupon
                },
                width: '60%',
                minWidth: '380px',
                maxWidth: '600px',
                disableClose: true,
                panelClass: 'custom-mat-dialog'
              });
              matDialogRef.afterClosed().subscribe((result) => {
                if (result) {

                }
              });
            });
          }
          this.isLoading.isScratchCoupon = true;
        }, (error) => {
          this.isLoading.isScratchCoupon = true;
        });
    } else {
      this.isLoading.isScratchCoupon = true;
    }
  }

  private initializeGraphics() {
    this.graphics.logo = AppConfig.settings.logo;
    this.graphics.cover = AppConfig.settings.cover;
    this.colors.menuColor = AppConfig.settings.menuColor;
    this.colors.buttonColor = AppConfig.settings.buttonColor;
    this.lang = this.translationsService.language();
  }

  public goToMenu() {
    this.franchiseId = this.configService.franchiseId;
   
    this.routeActivate.canActivateHome = true;
  //  this.router.navigate([`/${this.franchiseId}/menu`]);
    if (this.appStorageService.branch.UseInventory ) {
      this.menuService.getMenuForBranch(this.appStorageService.branch.Id, this.appStorageService.orderType, AppConfig.configSettings.checkItemsByTime, this.translationsService.language()).subscribe((result) => {
      
        this.appStorageService.backResultMenu = this.commonFunctionsService.deepCopy(result);
        this.appStorageService.isMenuWasLoaded = true;
        if (result) {
          this.appStorageService.categories = result.categories;
          this.paymentResult = undefined;
          this.router.navigate([`${this.franchiseId}/menu`]);  
        }
    
      });
    } else  {
      this.paymentResult = undefined;
      this.router.navigate([`${this.franchiseId}/menu`]);  
    }
  }

  public navigateWaze(){
    window.location.href = this.ll;
  }

  public directionLanguage() {
    return LanguageEnum.HE;
  }

}
