import {Component, OnInit, OnDestroy} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { navItems } from '../../_nav';
import { SignInOutService } from '../../core/services/sign-in-out.service';
import {AppStorageService} from "../../app.storage.service";
import { ConfigService } from "../../core/services/common-settings/config.service";

import { StorageValueEnum } from '../../enums/advanced/storage-value.enum';
import { OrderAppModel } from '../../models/order/order-app.model';
import { OrderService } from '../../core/services/order.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AppConfig } from '../../app.config';
import {PreviousRouteService} from "../../core/services/common-settings/previous-route.service";
//import { DiscountModel } from '../../models/discount/discount.model';
//import {DiscountCouponComponent} from "./discount-coupon/discount-coupon.component";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {ItemComponent} from "../../views/menu/item/item.component";
import { take } from 'rxjs/operators';
import { CommonFunctionsService } from '../../core/services/common-settings/common-functions.service';
import { ItemAppAdvancedModel } from '../../models/advanced/menu/item-app-advanced.model';
import { OrderItemAppModel } from '../../models/order/order-item-app.model';
import { GarnishAppAdvancedModel } from '../../models/advanced/menu/garnish-app-advanced.model';
import { environment } from '../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { DialogSignInComponent } from '../../components/sign-in/popup/dialog-sign-in.component';
import { MenuService } from '../../core/services/menu.service';
import { BranchAppModel } from '../../models/franchise-branch/branch-app.model';
import { TranslationsService } from '../../shared/translations/translations.service';
import { MessagePopupComponent } from '../../shared/components/message-popup/message-popup.component';
import { ClubMemberComponent } from '../../shared/components/club-member/club-member.component';
import { BiteCreditComponent } from '../../shared/components/bite-credit/bite-credit.component';


@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit, OnDestroy {
  public sidebarMinimized = false;
  public navItems = navItems;
  public logo: string;
  public order: OrderAppModel;
  public franchiseId: number;
  //public discount: DiscountModel;
  public isSignedUser: boolean ;//= !!this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN);
  bsModalRef: BsModalRef;
  public lang: string;
  public lastOrderId: number;
  discount: any;
  public currentBranch: BranchAppModel;

  public selectedLang : string;
  public selectedLanguage:any;
  public languages: any[] = [];

  public inLinks = this.appStorageService.inLinks;
  public user: any;
  public cancelVerification: boolean = false;
    public terms: string;
  public privacyPolicy: string;
   public name: string;
  public taxId: string;
  ccTokens: any;
  addresses: any;
  displayBDayAndAnnScreen: boolean;
  displayBDayScreen: boolean;
  displayAnnScreen: boolean;
  currentDate: Date;
  userJoinedClub: any;
  clubMemberCategories: any;

  /*public isLoaded: any = {
    isDiscountLoaded: false,
    isSignIn: true // default it's loaded
  };

  public user: any;
  */


  constructor(private router: Router,
    private signInOutService: SignInOutService,
    private orderService: OrderService,
    private commonFunctionsService: CommonFunctionsService,
    private configService: ConfigService,
    private deviceService: DeviceDetectorService,
    private previousRouteService: PreviousRouteService,
    private matDialog: MatDialog,
    private modalService: BsModalService,
    private menuService: MenuService,
    private translationsService: TranslationsService,
    public appStorageService: AppStorageService) 
    {
      console.log("Default Layout constructor(",this.franchiseId);
      this.lang = environment.language;
      this.franchiseId = this.configService.franchiseId;
      this.navItems = [];//navItems;
      const body = document.getElementsByTagName('body')[0];
      if (body.classList.contains('sidebar-show')) {
        body.classList.remove('sidebar-show');
      } //else {
       // body.classList.add('sidebar-show');
     // }
    
     // this.logo = '{src: "' + this.appStorageService.logo +
                //  '", width: auto, height: 100, alt: "Logo"}' ;
      //console.log("this.logo",this.logo);


  }
  ngOnInit(): void {
    console.log("Default Layout ngOnInit",this.franchiseId);
    console.log("inLinks- DL", this.inLinks );
    this.terms = this.appStorageService.Terms || "";
    this.privacyPolicy = this.appStorageService.privacyPolicy || "";
    this.name = AppConfig.settings.name;
    this.taxId = this.appStorageService.franchise.AndroidName;
    
    this.clubMemberCategories = this.appStorageService.clubMembershipCategories;
    const body = document.getElementsByTagName('body')[0];
    console.log("body",body);
    if (body.classList.contains('sidebar-show')) {
       body.classList.remove('sidebar-show');
    }
    this.getOrdersInfo();
    if(AppConfig.configSettings.cancelPhoneVerification){
      this.cancelVerification = true;
    }

    //if(this.verifyToken()){

      const token = this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.franchiseId);
     
      this.user = this.appStorageService.appUser;
      if (token){
        console.log("this.appStorageService.appUser",this.appStorageService.appUser);
        if ( this.appStorageService.appUser &&  
             this.appStorageService.appUser.LoginToken == token){
              this.user = this.appStorageService.appUser
              this.ccTokens = this.appStorageService.ccTokens;
              this.addresses = this.appStorageService.addresses;
        } else {
          console.log("defaultLayout component verifyToken");
          this.signInOutService.verifyToken(token).subscribe((response) => {
            const result = response ? !!response.user : !!response;
            if (result && response.user!=null) {
              this.user = response.user;
              this.appStorageService.appUser = response.user;
              this.ccTokens = response.ccTokens;
              this.addresses = response.addresses;
              console.log("ngOnInit -defaultLayaout");
              console.log("this.user", this.user);
              if(AppConfig.configSettings.cancelPhoneVerification){
                this.user.Address = null;
                this.user.IsClubMember = null;
                this.appStorageService.appUser.Address = null;
                this.appStorageService.appUser.IsClubMember = null;
              }
      
            } else {
              this.signInOutService.signOut();
              this.isSignedUser=false;
            }
          }, (error) => {
            console.log("error", error);
          });
        }
      }
     

  //  }
   // console.log("defaultLayaout - NO TOKEN");
    this.navItems =[];// navItems;
    this.logo = this.appStorageService.logo;
    this.currentBranch = this.appStorageService.branch;
    console.log("this.currentBranch",this.currentBranch);
    if (AppConfig.configSettings.orderStatus 
      && AppConfig.configSettings.orderStatus == true) {
      this.navItems.push (
        {
          name: 'לתפריט',
          url: `/${this.configService.franchiseId}/menu`
        },
        {
          name: 'ההזמנה שלי',
          url: `/${this.configService.franchiseId}/my-order`
        },
        {
          name: 'מעקב הזמנה',
          url: `/${this.configService.franchiseId}/my-order-status`
        }
      )
    }
    this.currentDate = new Date();
    this.order = this.orderService.getOrder();
    //console.log("order from default-layout", this.order);
    this.checkSigning();
    this.getAppLanguages();
    /*console.log("this.appStorageService.branch",this.appStorageService.branch);
    if (this.appStorageService.branch) {
      this.currentBranch = this.appStorageService.branch;
      console.log("this.currentBranch",this.currentBranch);
    }*/
    
    this.menuService.getDiscount(this.order.BranchId, undefined).subscribe((result) => {
      if (result) {
        if(result.active)
        this.discount = result;
        console.log("this.discount",this.discount);
      }
    },(error) => {
        this.discount = undefined;
      });
    
  }

  public openDetails(){


    let header = this.translationsService.translate("CONTACT");
    //let icon = "../../../assets/images/items/phone.png";
    
    const phoneNumber = this.currentBranch.BranchPhone;
    const address = this.currentBranch.Address;
    const matDialogRef = this.matDialog.open(MessagePopupComponent, {
      data: {
        header,
        //icon,
        isContact: true,
        phoneNumber,
        address,
        withoutTimeout: true
      },
      minWidth: '345px',
      disableClose: true,
      panelClass: 'custom-mat-dialog-popup'
    });

    matDialogRef.afterClosed().subscribe((result) => {
      console.log("my-result", result);
    
    });
}

public openDesc() {

let header = this.translationsService.translate("ABOUT");
 
const desc = this.appStorageService.franchise.Description;
const matDialogRef = this.matDialog.open(MessagePopupComponent, {
  data: {
    header,
    desc,
  
    isAbout: true,
    withoutTimeout: true
  },
  minWidth: '345px',
  disableClose: true,
  panelClass: 'custom-mat-dialog-popup'
});

matDialogRef.afterClosed().subscribe((result) => {
  console.log("my-result", result);
 
});

}

  public openCustomerClub(isClubMember?) {

    console.log("openCustomerClub()");

    if(this.verifyToken()){

      const token = this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.franchiseId);
      console.log("defaultLayout component verifyToken");
      this.signInOutService.verifyToken(token).subscribe((response) => {
        const result = response ? !!response.user : !!response;
        if (result && response.user != null) {
          this.user = response.user;
          this.appStorageService.appUser = response.user;
          console.log("ngOnInit -defaultLayaout");
          if(AppConfig.configSettings.cancelPhoneVerification){
            this.user.Address = null;
            this.user.IsClubMember = null;
            this.appStorageService.appUser.Address = null;
            this.appStorageService.appUser.IsClubMember = null;
          }
          console.log("this.user", this.user);

          console.log("isClubMember", isClubMember);

          console.log("this.checkUserBirthDay", this.checkUserEvents());
          var minWidth;
          var maxWidth;
          var maxHeight;
          var cls;
          if(this.isMobileMode()){
            minWidth = '100vw';
            cls = '';
      
          }
          else{
            minWidth = 'none';
            maxHeight = '80vh';
            maxWidth = '40vw';
            cls = 'club-member-desktop'
          }
          if (this.clubMemberCategories && this.clubMemberCategories.length > 0) {
            const phoneNumber = this.currentBranch.BranchPhone;
            const address = this.currentBranch.Address;
            const matDialogRef = this.matDialog.open(ClubMemberComponent, {
              data: {
                userJoinedClub: this.userJoinedClub,
                userBirthDay: this.displayBDayScreen,
                userAnniversary: this.displayAnnScreen,
                userAnniversaryAndBDay: this.displayBDayAndAnnScreen,
                isClubMember: isClubMember,
                appUser: this.user,
                phoneNumber,
                address

              },
              minWidth: minWidth,
              maxHeight: maxHeight,
              maxWidth: maxWidth,
              disableClose: true,
              panelClass: cls
            });

            matDialogRef.afterClosed().subscribe((result) => {
              console.log("CLUB_MEMBER-RESULT", result);
              console.log("this.user", this.user);
              if (result) {
                this.appStorageService.showClubMember = false;

                if (result.signIn && result.bDay && result.email || result.canceledMembership) {

                  if (!result.canceledMembership) {
                    this.user.Anniversary = result.annDay;
                    this.user.BirthDate = result.bDay;
                    this.user.Email = result.email;
                    this.user.AllowAdvertisement = result.enablePush;
                  }

                  this.user.FirstName = result.fName;
                  this.user.LastName = result.lName;
                  this.user.IsClubMember = true;
                  this.user.JoinedToClub = new Date();
                  this.user.DontDisplayAnymore = false;
                  /*if (!this.dateIsValid(this.user.Anniversary) && this.user.AnniversaryStr != null) {
                    this.user.Anniversary = new Date(this.user.AnniversaryStr);
                  }
  
                  if (!this.dateIsValid(this.user.BirthDate) && this.user.BirthDateStr != null) {
                    this.user.BirthDate = new Date(this.user.BirthDateStr);
                  }
  
                  if (!this.dateIsValid(this.user.FirstLogin) && this.user.FirstLoginStr != null) {
                    this.user.FirstLogin = new Date(this.user.FirstLoginStr);
                  }
  
                  if (!this.dateIsValid(this.user.JoinedToClub) && this.user.JoinedToClubStr != null) {
                    this.user.JoinedToClub = new Date(this.user.JoinedToClubStr);
                  }*/
                  console.log("defaultLayaout - ClubMemberSignIn: this.user", this.user);
                  console.log(" this.user.JoinedToClub ", this.user.JoinedToClub);



                  this.signInOutService.updateUserDetails(this.user).subscribe((result) => {
                    console.log("result - update user", result);
                    const joinCategory = this.clubMemberCategories.filter((cat) => {
                      return cat.Name == this.translationsService.translate('CM_JOIN') || cat.Name == 'CM_JOIN'
                    });
                    console.log("joinCategory", joinCategory);
                    if (result && !this.user.UsedJoinVoucher && joinCategory && joinCategory[0] && joinCategory[0].Items && joinCategory[0].Items.length>0) {
                      this.userJoinedClub = true;
                      this.openCustomerClub()
                    }
                    else if (result && (this.user.UsedJoinVoucher || !joinCategory[0])) {
                      this.loadSuccessRegistrationMessage();
                    }
                  }, (error) => {
                    console.log("error update user");
      
                  });
                }
              }


              /*if (callback) {
                //this.isFirst=false;
                callback(result);
        
              }*/
            });
          }
  
        } else {
          this.signInOutService.signOut();
          this.isSignedUser=false;
        }
      }, (error) => {
        console.log("error", error);
      });

    }


  }

  public openBiteCreditPopup(){
    if(!this.verifyToken()) {
      let position: any;
      if(this.isMobileMode()){
        position = {top: '5vh'};
      }
      else{
        position = {} 
      }
    const matDialogRef = this.matDialog.open(DialogSignInComponent, {
      data: {
        isFirst: true,
      },
      width: '40%',
      maxWidth: '518px',
      minWidth: '346px',
      position: position,
      panelClass: ['padding-small-container', 'custom-mat-dialog-mobile'],
      disableClose: false,
    });
    
    matDialogRef.componentInstance.signInCompleted
      .subscribe((result) => {
        console.log("result", result);
        //this.loadOrderUserDataToUser(this.order);
        this.isSignedUser = result;
        console.log("defaultLayout component verifyToken");
        const token = this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.franchiseId);
        this.signInOutService.verifyToken(token).subscribe((response) => {
          const result = response ? !!response.user : !!response;
          if (result  && response.user != null) {
            this.user = response.user;
            this.appStorageService.appUser = response.user;
            this.ccTokens = response.ccTokens;
            this.addresses = response.addresses;
            console.log("loadSignInForm -defaultLayaout");
            if(AppConfig.configSettings.cancelPhoneVerification){
              this.user.Address = null;
              this.user.IsClubMember = null;
              this.appStorageService.appUser.Address = null;
              this.appStorageService.appUser.IsClubMember = null;
            }
            console.log("this.user", this.user);

            if (this.isSignedUser && this.user) {
              console.log("this.appStorageService.franchise", this.appStorageService.franchise);
              console.log("this.user", this.user);
              console.log("this.appStorageService", this.appStorageService);
              if( this.user.BiteCredit > 0){
                this.router.navigateByUrl(`/${this.franchiseId}/my-credit`);
              }
              else{
                console.log("this.isMobileMode()",this.isMobileMode());
                var minWidth;
                var maxWidth;
                var maxHeight;
                var cls;
                if(this.isMobileMode()){
                  minWidth = '100vw';
                  cls = 'mat-dialog-wrapper-close';
            
                }
                else{
                  minWidth = 'none';
                  maxHeight = '80vh';
                  maxWidth = '50vw';
                  cls = 'bite-credit-desktop'
                }
                console.log("cls",cls)
                const matDialogRef = this.matDialog.open(BiteCreditComponent, {
                  data: {
                    creditOptions: this.appStorageService.franchise.CreditOptions,
                    creditName: this.appStorageService.franchise.CreditName,
                    allowCustomCreditSum: this.appStorageService.franchise.AllowCustomCreditSum,
                    creditAddedValuePercent: this.appStorageService.franchise.CreditAddedValuePercent,
                    appUser: this.user,
                  },
                  minWidth: minWidth,
                  maxHeight: maxHeight,
                  maxWidth: maxWidth,
                  disableClose: true,
                  panelClass: cls
                });
                matDialogRef.afterClosed().subscribe((result) => {
            
                });
              }
            }
    
          } else {
            this.signInOutService.signOut();
            this.isSignedUser=false;
          }
        }, (error) => {
          console.log("error", error);
        });


      });
    } else {
      if (this.appStorageService.appUser?.BiteCredit > 0) {
        this.router.navigateByUrl(`/${this.franchiseId}/my-credit`);
      }else{
        console.log("this.isMobileMode()",this.isMobileMode());
        var minWidth;
        var maxWidth;
        var maxHeight;
        var cls;
        if(this.isMobileMode()){
          minWidth = '100vw';
          cls = 'mat-dialog-wrapper-close';
    
        }
        else{
          minWidth = 'none';
          maxHeight = '80vh';
          maxWidth = '50vw';
          cls = 'bite-credit-desktop'
        }
        console.log("cls",cls)
        const matDialogRef = this.matDialog.open(BiteCreditComponent, {
          data: {
            creditOptions: this.appStorageService.franchise.CreditOptions,
            creditName: this.appStorageService.franchise.CreditName,
            allowCustomCreditSum: this.appStorageService.franchise.AllowCustomCreditSum,
            creditAddedValuePercent: this.appStorageService.franchise.CreditAddedValuePercent,
            appUser: this.user,
          },
          minWidth: minWidth,
          maxHeight: maxHeight,
          maxWidth: maxWidth,
          disableClose: true,
          panelClass: cls
        });
        matDialogRef.afterClosed().subscribe((result) => {
    
        });
      }

      
    }
   
  }

  public checkUserEvents() {
    var birthStrToDate;
    var availableMonthBDay;
    var annStrToDate;
    var availableMonthAnn;
    const currentMonth = this.currentDate.getMonth();
    if (this.user.IsClubMember) {

      if (this.user.BirthDateStr != null) {
        birthStrToDate = new Date(this.user.BirthDateStr);
        console.log("birthStrToDate", birthStrToDate);
      }
      if (this.dateIsValid(this.user.BirthDate)) {
        availableMonthBDay = this.user.BirthDate?.getMonth();
      }
      else if (this.user.BirthDateStr != null) {
        availableMonthBDay = birthStrToDate?.getMonth();
      }
      console.log("availableMonthBDay", availableMonthBDay);
      console.log("currentMonth", currentMonth);

      if(this.user.AnniversaryStr != null){
        annStrToDate = new Date(this.user.AnniversaryStr);
        console.log("annStrToDate", annStrToDate);
      }
      if(this.dateIsValid(this.user.Anniversary)){
        availableMonthAnn = this.user.Anniversary?.getMonth();
       }
       else if(this.user.AnniversaryStr != null){
        availableMonthAnn =  annStrToDate?.getMonth();
       }
    
      console.log("availableMonthAnn", availableMonthAnn);
      console.log("currentMonth", currentMonth);


      if((availableMonthAnn == availableMonthBDay) && (availableMonthAnn == currentMonth)
          && !this.user.UsedAnniversaryVoucher && !this.user.UsedBirthdayVoucher){
          this.displayBDayAndAnnScreen = true;
          this.displayBDayScreen = false;
          this.displayAnnScreen = false;
          return;
      }
      else if (availableMonthAnn == currentMonth && !this.user.UsedAnniversaryVoucher){
        this.displayBDayAndAnnScreen = false;
        this.displayBDayScreen = false;
        this.displayAnnScreen = true;
        return;
      }
      else if (availableMonthBDay == currentMonth && !this.user.UsedBirthdayVoucher){
        this.displayBDayAndAnnScreen = false;
        this.displayBDayScreen = true;
        this.displayAnnScreen = false;
        return;
      }
      else{
        console.log("!!!!!!!else");
        this.displayBDayAndAnnScreen = false;
        this.displayBDayScreen = false;
        this.displayAnnScreen = false;
      } 

    }

  }

  dateIsValid(date) {
    if( date instanceof Date) return true;
    else{
      console.log("not instance of date: date", date);
      return false;

    }
  }

  public loadSuccessRegistrationMessage() {
    if(document){
    document.getElementById("snackbar-club-member").classList.add("show");    
    setTimeout(() => {
     document.getElementById("snackbar-club-member").classList.remove("show");    
    }, 3000);
   }
  
  }

  public cancelMembership(){
    const token = this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.franchiseId);
    
        console.log("cancelMembership :franchise", this.appStorageService.franchise);
        console.log("cancelMembership :showClubMember", this.appStorageService.showClubMember);
        console.log("this.user", this.appStorageService.appUser);

        if (this.appStorageService.appUser && this.appStorageService.appUser) {
          console.log("if (this.user && this.user.IsClubMember): user", this.appStorageService.appUser);
          this.appStorageService.appUser.IsClubMember = false;
          this.appStorageService.appUser.MemberPoints = 0;


          this.appStorageService.appUser.Anniversary = null;
          this.appStorageService.appUser.AnniversaryStr = null;
          this.appStorageService.appUser.BirthDate = null;
          this.appStorageService.appUser.BirthDateStr = null;

          this.router.navigateByUrl(`/${this.franchiseId}/menu`);
    
          this.appStorageService.showClubMember = false;
    
          this.signInOutService.updateUserDetails(this.appStorageService.appUser).subscribe((reslt) => {
            console.log("result - update user", reslt);
          }, (error) => {
            console.log("error update user");
    
          });
        }
  }

  public getLanguage() {
    return this.translationsService.language();
  }

  
  private getAppLanguages() {
    this.selectedLang = this.translationsService.language();
    console.log("this.translationService.language",this.translationsService.language());
    console.log(" this.selectedLang", this.selectedLang);
    this.languages =[];
    this.languages =this.languages.concat({Id:0, Name: "עברית", Code:"he"});
    this.signInOutService.getAppLanguages()
      .subscribe((response) => {
        console.log('getAppLanguages',response);
        if (response) {
          this.languages =response;
          //this.selectedLang = "he";
          console.log('getAppLanguages-2',this.languages)
          //this.selectedLang = "he"
          console.log(this.selectedLang)
          this.selectedLanguage = this.translationsService.language();

        }
    }, (error) => {
      //this.messageService.displayServerErrorMessage();
    });
  }

 /* public changeLanguage(code) {
    console.log("this.translationService.language",this.translationsService.language());
    this.translationsService.setLanguage(code);
    this.selectedLang = this.translationsService.language();
  }*/

  public changeLanguage() {
    console.log("selectedLang", this.selectedLang);
    console.log("this.translationService.language", this.translationsService.language());
    this.translationsService.setLanguage(this.selectedLang, ()=>{
      //this.selectedLang = this.translationService.language();
      console.log("this.translationService.language", this.translationsService.language());
      this.initializeMenuForBranch(() => {
        console.log("this.router.navigateByUrl(`/${this.franchiseId}/menu`)");
        console.log("---this.order",this.order);

        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload'
        this.router.navigateByUrl(`/${this.franchiseId}/menu`);
      });
    }
    );
    
  }

  private initializeMenuForBranch(continueCallBack?) {
    console.log("initializeMenuForBranch",this.appStorageService.orderType);
    console.log("this.translationService.language()", this.translationsService.language());
    // if (!this.appStorageService.isMenuWasLoaded) {
    let hasPizzas: boolean = false;
    let hascCombos: boolean = false;
    //this.isLoaded = false;
    this.menuService.getMenuForBranch(this.order.BranchId, this.appStorageService.orderType, AppConfig.configSettings.checkItemsByTime, this.translationsService.language()).subscribe((result) => {
    //  this.imageVersionService.updateImageUrlsOfMenu(result);

      this.appStorageService.backResultMenu = this.commonFunctionsService.deepCopy(result);
      this.appStorageService.isMenuWasLoaded = true;
      if (result) {
        this.appStorageService.categories = result.categories;
        this.appStorageService.clubMembershipCategories = result.clubMembershipCategories;

        this.appStorageService.clubMembershipCategories.forEach(cat => {
          if((cat.Name == this.translationsService.translate('CM_JOIN') || cat.Name == 'CM_JOIN')
          || (cat.Name == this.translationsService.translate('CM_BIRTHDAY') || cat.Name == 'CM_BIRTHDAY')
          || (cat.Name == this.translationsService.translate('CM_ANNIVERSARY') || cat.Name == 'CM_ANNIVERSARY')){
            
            cat.Items.forEach(item => {
              if(cat.Name == this.translationsService.translate('CM_JOIN') || cat.Name == 'CM_JOIN'){
                item.IsJoinBenefitItem;
              }
              if(cat.Name == this.translationsService.translate('CM_BIRTHDAY') || cat.Name == 'CM_BIRTHDAY'){
                item.IsBDayBenefitItem;
              }
              if(cat.Name == this.translationsService.translate('CM_ANNIVERSARY') || cat.Name == 'CM_ANNIVERSARY'){
                item.IsAnnBenefitItem;
              }
              item.isFreeMembershipBenefit = true;
            });
          }
          
        });

        console.log("this.appStorageService.clubMembershipCategories",this.appStorageService.clubMembershipCategories);

        this.appStorageService.pizzas = result.pizzas;
        if (result.pizzas && result.pizzas.length > 0) {
          hasPizzas = true;

        }
        this.appStorageService.pizzaToppings = result.pizzaToppings;
        this.appStorageService.startingPage = result.startingPage;
        // this.prepareOrderOfItemsAndPizza();
      }
      this.menuService.getCombosForBranch(this.order.BranchId, this.appStorageService.orderType).subscribe(result => {
        if (result) {
          hascCombos = true;
        }
        
        this.appStorageService.backResultCombo = this.commonFunctionsService.deepCopy(result);
        this.appStorageService.combos = result;



      }, (error) => {
       // this.isLoaded = true;
        console.log("this.isLoaded = true");
        console.log("ERROR: Couldn't load Combos");
        if (continueCallBack) {
          continueCallBack();
        }
        // this.messageService.displayServerErrorMessage();
      });

    }, (error) => {
     // this.isLoaded = true;
      console.log("this.isLoaded = true");
     // this.messageService.displayServerErrorMessage();
    });

 

  }

  public checkSigning(result?) {
    console.log("checkSigning-result", result);
    //this.isSignedUser = !!result;
    this.isSignedUser = !!this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.franchiseId);
    console.log("this.isSignedUser",this.isSignedUser)
      
    if (this.isSignedUser) {
      this.verifyToken();
    }
  }

  public loadSignInForm(){

    this.appStorageService.showClubMember = true;
    let position: any;
    if(this.isMobileMode()){
      position = {top: '5vh'};
    }
    else{
       position = {} 
    }
    const matDialogRef = this.matDialog.open(DialogSignInComponent, {
      data: {
        isFirst: true,
      },
      width: '40%',
      maxWidth: '518px',
      minWidth: '346px',
      position: position,
      panelClass: ['padding-small-container', 'custom-mat-dialog-mobile'],
      disableClose: false,
    });
    
    matDialogRef.componentInstance.signInCompleted
      .subscribe((result) => {
        console.log("result", result);
        //this.loadOrderUserDataToUser(this.order);
        this.isSignedUser = result;
        console.log("defaultLayout component verifyToken");
        const token = this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.franchiseId);
        this.signInOutService.verifyToken(token).subscribe((response) => {
          const result = response ? !!response.user : !!response;
          if (result  && response.user != null) {
            this.user = response.user;
            this.appStorageService.appUser = response.user;
            this.ccTokens = response.ccTokens;
            this.addresses = response.addresses;
            console.log("loadSignInForm -defaultLayaout");
            if(AppConfig.configSettings.cancelPhoneVerification){
              this.user.Address = null;
              this.user.IsClubMember = null;
              this.appStorageService.appUser.Address = null;
              this.appStorageService.appUser.IsClubMember = null;
            }
            console.log("this.user", this.user);

            if (this.isSignedUser && this.user) {
              console.log("this.appStorageService.franchise", this.appStorageService.franchise);
              console.log("this.user", this.user);
              console.log("this.appStorageService", this.appStorageService);
              if( this.appStorageService.showClubMember && !this.user.IsClubMember && !this.user.DontDisplayAnymore && this.appStorageService.franchise.UseMembersClub ) //this.appStorageService.franchise.UseMembersClub &&
              this.openCustomerClub(false);
              else if(this.appStorageService.showClubMember && this.user.IsClubMember && this.appStorageService.franchise.UseMembersClub)
              this.openCustomerClub(true);
              //this.completeOrder(true);
            }
    
          } else {
            this.signInOutService.signOut();
            this.isSignedUser=false;
          }
        }, (error) => {
          console.log("error", error);
        });


      });
    matDialogRef.afterClosed().subscribe((result: any) => {
      //this.checkSigning();
      

    });
  }

  ngOnDestroy() {

  }

  getOrdersInfo() {
    const token = this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.franchiseId);
    if (token) {
      this.orderService.GetPreviouseOrders(token)
      .subscribe((result) => {
        if (result) {
          this.lastOrderId=result[0];
       
         //console.log(result)
        }
      },(error) => {
        console.log("getOrderInfo Error", error)
       // this.messageService.displayServerErrorMessage();
      });
    }
   
  }

    openNav() {
    document.getElementById("mySidebar").style.width = "350px";
    document.getElementById("mySidebar").style.display = "flex";
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('sidebar-show');
  }

  public checkAvailabilityDiscount() {
    console.log(" this.discount", this.discount);
    // console.log("this.order.IsDiscount",this.order.IsDiscount);
      if( this.discount && this.discount.minSum != null && this.discount.minSum != undefined) {
       return this.discount && (this.discount.sum > 0) && (this.discount.active || this.discount.alwaysActive);
   }
     return false;
   }
  
   public returnToPrevPage() {
     console.log("!!!!!!!!!!!!!!!!!!!!window.location.hash", window.location.hash);
    localStorage.removeItem(window.location.hash);
    this.closeNav();
    this.router.navigate([`/${this.franchiseId}/home`]);
  }

    closeNav(isPopUp?, isAbout?) {
      this.inLinks = true;
      console.log("this.inLinks",this.inLinks);
      document.getElementById("mySidebar").style.display = "none";
      const body = document.getElementsByTagName('body')[0];
      body.classList.remove('sidebar-show');
      if(isPopUp && !isAbout){
          let header = this.translationsService.translate("CONTACT");
          //let icon = "../../../assets/images/items/phone.png";
          
          const phoneNumber = this.currentBranch.BranchPhone;
          const address = this.currentBranch.Address;
          const matDialogRef = this.matDialog.open(MessagePopupComponent, {
            data: {
              header,
              //icon,
              isContact: true,
              phoneNumber,
              address,
              withoutTimeout: true
            },
            minWidth: '345px',
            disableClose: true,
            panelClass: 'custom-mat-dialog-popup'
          });
    
          matDialogRef.afterClosed().subscribe((result) => {
            console.log("my-result", result);
          });
    
        
      }

      if(isPopUp && isAbout){
        let header = this.translationsService.translate("ABOUT");
        const desc = this.appStorageService.franchise.Description;
        console.log("desc!!!!!",desc)
        const matDialogRef = this.matDialog.open(MessagePopupComponent, {
          data: {
            header,
            desc,
            //icon,
            //isContact: true,
            //phoneNumber,
            //address,
            isAbout: true,
            withoutTimeout: true
          },
          minWidth: '345px',
          disableClose: true,
          panelClass: 'custom-mat-dialog-popup'
        });

        matDialogRef.afterClosed().subscribe((result) => {
          console.log("my-result", result);
        });

      
      }
  }


  getCartColor() {
   // if (this.darkMode) {
    //  var style = {
    //    'fill': 'white'
    //  }
     // return style;
    //} else {
      var style = {
        'fill': 'var(--orange)'
      }
      return style;
   // }
   
  }



 /* toggleCart() {
    const body = document.getElementsByTagName('body')[0];
    if (body.classList.contains('aside-menu-show')) {
      body.classList.remove('aside-menu-show');
    } else {
      body.classList.add('aside-menu-show');
    }
  }*/

  isMobileMode():boolean {
    return this.deviceService.isMobile();
  }

  isDigitalMenu() : boolean {

   // if (AppConfig.configSettings.isDigitalMenu 
     // && AppConfig.configSettings.isDigitalMenu == true) {
    if ( this.appStorageService.orderType == "digitalmenu") {
      return true;
    } else {
      return false;
    }
  }

  public verifyToken() {
    const token = this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.franchiseId);
    if (token) return true;
    else return false;
  }

  displaySidebarToggler()  {
//console.log ("AppConfig.configSettings",AppConfig.configSettings);
    if (AppConfig.configSettings.orderStatus 
      && AppConfig.configSettings.orderStatus == true) {
      return 'lg';
    } else {
      return '';
    }
  }

  orderHasItems():boolean {
    if (this.order && 
        ((this.order.OrderItems && this.order.OrderItems.length > 0) ||
        (this.order.OrderCombos && this.order.OrderCombos.length > 0) || 
        (this.order.OrderPizzas && this.order.OrderPizzas.length > 0))) {
      return true
    } else {
      return false;
    }
  }

  isAppDisplayMode() : boolean {

    if (AppConfig.configSettings.appDisplayMode 
      && AppConfig.configSettings.appDisplayMode == true) {
       // console.log("isDigitalMenu",true);
      return true;
    }else {
     // console.log("isDigitalMenu",false);
      return false;
    }
  }

  public getLogo() {
    let styles = {
      'src': this.appStorageService.logo,
      'width': 'auto',
      'height': '80', 
      'alt': 'Logo',
      'padding-top': '5px'
    };
    return styles;
  }

  
  public makeOrder() {
    if (this.order && ((this.order.OrderItems && this.order.OrderItems.length > 0)
      || (this.order.OrderPizzas && this.order.OrderPizzas.length > 0) ||
      (this.order.OrderCombos && this.order.OrderCombos.length > 0))) {
        this.router.navigateByUrl(`/${this.configService.franchiseId}/order`);
      //this.router.navigateByUrl('/order');
    } else {

    }
   // this.toggleCart();
  }
public signOut(){
  console.log("signOUT()", this.isSignedUser);
  this.signInOutService.signOut();
  this.isSignedUser=false;
  this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  this.router.onSameUrlNavigation = 'reload';
  this.router.navigate([`/${this.franchiseId}/menu`]);
}

public deleteAccount(){
  console.log("deleteAccount()", this.isSignedUser);
 
  this.signInOutService.DeleteAppUsersAccount().subscribe(result => {
    this.signInOutService.signOut();
    this.isSignedUser=false;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([`/${this.franchiseId}/menu`]);
  });
  
}

  public openItemPopup(res :any){
    console.log("openItemPopup",res);
   // let index = res.index;
     const initialState = {
       item: res.item.Item,
       isEdit: true
     };
     this.bsModalRef = this.modalService.show(ItemComponent, 
       {initialState, class:'modal-dialog-scrollable modal-xl'});
      this.modalService.onHide
     .pipe(take(1)).subscribe(() => {
 
         console.log("menu close modal item",this.bsModalRef.content)
         if (this.bsModalRef.content.isSaved && this.bsModalRef.content.item) {
           const orderItem = this.prepareEditedItemForOrder(this.bsModalRef.content.item);
           this.order.OrderItems[res.index] = orderItem;              
           this.orderService.recalculateSum();
           this.resetItem(res.item);
           
           //this.loadSuccessAddingToCartMessage(false);
           
         }
     });
 }

 private prepareEditedItemForOrder(item: ItemAppAdvancedModel) {
  // console.log("prepareItemForOrder", item)
    const orderItem = new OrderItemAppModel();
    orderItem.Amount = item.Amount;
    orderItem.ItemId = item.Id;
    orderItem.Comment = '';
    orderItem.Item = this.commonFunctionsService.deepCopy(item);
    const garnishes = [];
    if (item.SelectedGarnishes) {
      item.SelectedGarnishes.forEach((garnish: GarnishAppAdvancedModel) => {
        garnishes.push(garnish);
        if (garnish.SelectedAmount > 1) {
          for (let i = 0; i < garnish.SelectedAmount - 1; i++) {
            const grn = this.commonFunctionsService.deepCopy(garnish);
            grn.SelectedAmount = 1;
            garnishes.push(grn);
          }
        }
        garnish.SelectedAmount = 1;
      });
    }
     
    orderItem.Garnishes = garnishes;
    //console.log("prepareItemForOrder garnishes", garnishes)
    orderItem.Item.SelectedGarnishes = this.commonFunctionsService.deepCopy(garnishes);
    orderItem.SpecialRequests = '';
    orderItem.ComboItemId = 0;
    orderItem.IsScratchCoupon = false;
    orderItem.ScratchCouponId = 0;
    orderItem.Price = item.Price;
    orderItem.ImageUrl = item.ImageUrl;
    orderItem.Name = item.Name;
    
    return orderItem;
  }

  public resetItem(item) {
    if (item) {
      item.Amount = 1;
      item.SelectedGarnishes = [];
      if (item.Garnishes) {
        item.Garnishes.forEach((garnish) => {
          garnish.IsSelected = false;
          garnish.SelectedAmount = 0;
        });
      }
      if (item.GarnishGroups) {
        item.GarnishGroups.forEach((group) => {
          if (group && group.Garnishes) {
            group.Garnishes.forEach((grn) => {
              grn.IsSelected = false;
              grn.SelectedAmount = 0;
            })
          }
        });
      }
      if (item.SelectedToppings) {
        item.SelectedToppings = [];
      }
    }
  }

  public removeAll() {
    if (this.order) {
      this.order.OrderItems = [];
      this.order.OrderPizzas = [];
      this.order.OrderCombos = [];
      this.order.hasBonusItems = false;
      console.log("this.order.hasBonusItems = false;");
    }
    this.orderService.recalculateSum();
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  refreshPage() {
    window.location.reload();
   }

   public completeSignIn(result) {
    this.isSignedUser = result || !!this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.franchiseId);
    this.refreshPage();
  }

}
