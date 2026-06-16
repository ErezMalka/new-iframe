import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TranslationsService } from '../../translations/translations.service';
import { AppConfig } from '../../../app.config';
import { MAT_DIALOG_DATA, MatDialogRef , MatDialogConfig } from '@angular/material/dialog';
import { DiscountModel } from '../../../models/discount/discount.model';
import { AppStorageService } from '../../../app.storage.service';

import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import 'moment/locale/fr';
import { SignInOutService } from '../../../core/services/sign-in-out.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemAppAdvancedModel } from '../../../models/advanced/menu/item-app-advanced.model';
import { OrderItemAppModel } from '../../../models/order/order-item-app.model';
import { CommonFunctionsService } from '../../../core/services/common-settings/common-functions.service';
import { GarnishAppAdvancedModel } from '../../../models/advanced/menu/garnish-app-advanced.model';
import { OrderAppModel } from '../../../models/order/order-app.model';
import { BranchAppModel } from '../../../models/franchise-branch/branch-app.model';

import { OrderService } from '../../../core/services/order.service';
import { ConfigService } from '../../../core/services/common-settings/config.service';
import { BenefitAppModel } from '../../../models/menu/benefit-app.model';


import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'club-member',
  templateUrl: './club-member.component.html',
  styleUrls: ['./club-member.component.scss'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class ClubMemberComponent implements OnInit {

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  public graphics = {
    logo: '',
    cover: '',
  };

  public colors = {
    menuColor: '',
    buttonColor: ''
  };


  public lang: any;

public displayMemberClubEmailField:boolean = true;
  public firstName: string;
  public lastName: string;
  public birthDay: any;
  public anniversaryDay: any;
  public phoneNumber: any;
  public email: string;
  public isAlreadyClubMember: boolean;
  public appUser: any;

  public continueToSignUp: boolean = false;

  public succesfullyAdded:boolean = false;

  public orderErrors = {
    FirstName: false,
    LastName: false,
    Phone: false,
    Email:false,
    ExtraPhone: false,
    UserCity: false,
    Street: false,
    StreetNum: false,
    Floor: false,
    ApartmentNum: false,
    ownerId: false,
    number: false,
    cvv: false,
    expirationYear: false,
    expirationMonth: false,
    sum:false,

    Anniversary: false,
    BirthDate:false
  };
  public entryScreenNotMember: boolean = false;
  public franchiseId: any;
  public acceptTerms: boolean;
  public userJoinedClub: boolean = false;

  clubMemberCategories: any;
  currentUserPoints: any;
  currentDate: Date;

  joinCategory: any;
  selected: any;
  someOption: boolean = false;
  public comment: string = '';
  displayContinueButton: boolean;

  public order: OrderAppModel;
  currentBranch: BranchAppModel;
  userBirthDay: any;
  bdayCategory: any;
  annCategory: any;
  userAnniversary: any;
  userAnniversaryAndBDay: any;
  annAndBDayCategory: any;
  tempBDayCategory: any;
  minSumForVauchers: number;
  activeBenefits: any[];

  public memberClubPolicy = '';
  bsModalRef: BsModalRef;
  NewMemberVoucherActive: boolean;
  BirthdayVoucherActive: boolean;
  AnniversaryVoucherActive: boolean;
  

  constructor( private translationsService: TranslationsService,
    private modalService: BsModalService,
    private signInOutService: SignInOutService,
    private configService: ConfigService,
    private orderService: OrderService,
    private commonFunctionsService: CommonFunctionsService,
    private deviceService: DeviceDetectorService,
    private router: Router,
    private route: ActivatedRoute,
               public dialogRef: MatDialogRef<ClubMemberComponent>,
               private appStorageService: AppStorageService,
               private _adapter: DateAdapter<any>,
               @Inject(MAT_DATE_LOCALE) private _locale: string,
               @Inject(MAT_DIALOG_DATA) public data: any ) {

    this.memberClubPolicy = this.appStorageService.memberClubPolicy;

    if (data) {
      this.userJoinedClub = data.userJoinedClub;
      this.userBirthDay = data.userBirthDay;
      this.userAnniversary = data.userAnniversary;
      this.userAnniversaryAndBDay = data.userAnniversaryAndBDay;
      this.isAlreadyClubMember = this.data.isClubMember;

      if(!this.isAlreadyClubMember){
        this.entryScreenNotMember = true;

      }
        this.appUser = data.appUser;
        this.currentUserPoints = this.appUser.MemberPoints;
        this.clubMemberCategories = this.appStorageService.clubMembershipCategories;
        this.joinCategory = this.clubMemberCategories.filter((cat) => {
          return cat.Name == this.translationsService.translate('CM_JOIN') || cat.Name == 'CM_JOIN'
        });

        this.bdayCategory = this.clubMemberCategories.filter((cat) => {
          return cat.Name == this.translationsService.translate('CM_BIRTHDAY') || cat.Name == 'CM_BIRTHDAY'
        });

        this.annCategory = this.clubMemberCategories.filter((cat) => {
          return cat.Name == this.translationsService.translate('CM_ANNIVERSARY') || cat.Name == 'CM_ANNIVERSARY'
        });
        this.tempBDayCategory = this.bdayCategory;

        if(this.bdayCategory && this.annCategory) this.annAndBDayCategory = this.bdayCategory[0]?.Items.concat(this.annCategory[0]?.Items);


        this.minSumForVauchers = this.appStorageService.franchise.MinSumForVouchers;

        this.currentDate = new Date();

        this.appUser.DontDisplayAnymore = false;
        //this.appUser.AllowAdvertisement = false;
      
    }
  }

  public isMobileModeCheck(): boolean {
    //console.log("this.deviceService.isMobile()",this.deviceService.isMobile());
    return this.deviceService.isMobile() || this.deviceService.isTablet();
  }

  
  ngOnInit(): void {
    this.NewMemberVoucherActive = this.appStorageService.franchise.NewMemberVoucherActive;
    this.BirthdayVoucherActive =this.appStorageService.franchise.BirthdayVoucherActive;
    this.AnniversaryVoucherActive = this.appStorageService.franchise.AnniversaryVoucherActive;
    if (AppConfig.configSettings.hideMemberClubEmailField)
       this.displayMemberClubEmailField =false;
    console.log("this.displayMemberClubEmailField",this.displayMemberClubEmailField);
    //console.log("this.isback", this.isGoback);
    this.franchiseId = this.configService.franchiseId;
    this.initializeOrder();
    this.initializeGraphics();

    this.acceptTerms = false;

    //console.log("this.myScrollContainer",this.myScrollContainer);

    this.prepareActiveBenefits();


  }

  ngAfterViewInit(): void {
    //console.log("this.myScrollContainer",this.myScrollContainer);
  }

  ngAfterViewChecked(): void {
    //console.log("this.myScrollContainer",this.myScrollContainer);
    //this.myScrollContainer.nativeElement.scrollTop = 0;
    //console.log("this.myScrollContainer",this.myScrollContainer);
  }

  public prepareActiveBenefits(){


    this.activeBenefits = [];
    //if(this.appStorageService.franchise.ScratchCuponActive) 
    //this.activeBenefits.push(this.createBenefit(this.translationsService.translate("COUPON_BENEFIT_TEXT"), "coupon"));
    if(this.appStorageService.franchise.NewMemberVoucherActive) 
      this.activeBenefits.push(this.createBenefit(this.translationsService.translate("JOIN_BENEFIT_TEXT"), "join"));
    if(this.appStorageService.franchise.BonusActive) 
    this.activeBenefits.push(this.createBenefit(this.translationsService.translate("BONUS_BENEFIT_TEXT"), "bonus"));
    
    if(this.appStorageService.franchise.BirthdayVoucherActive) 
    this.activeBenefits.push(this.createBenefit(this.translationsService.translate("BDAY_BENEFIT_TEXT"), "bday"));
    if(this.appStorageService.franchise.AnniversaryVoucherActive) 
    this.activeBenefits.push(this.createBenefit(this.translationsService.translate("ANN_BENEFIT_TEXT"), "ann"));

  }

  public createBenefit(translatedName, benefitName){
    let newBenefit = new BenefitAppModel;
    newBenefit.Name = translatedName;
    newBenefit.Icon = benefitName;
    return newBenefit;
    


  }
  private initializeOrder() {
    this.order = this.orderService.getOrder();
    if (this.appStorageService.branch) {
      this.currentBranch = this.appStorageService.branch;
    }
  }

  public selectItem(item) {
    if ((item.Garnishes && item.Garnishes.length > 0) ||
      (item.GarnishGroups && item.GarnishGroups.length) > 0) {
      //this.addToCart(item)
    }

    else {

      if (this.userJoinedClub) {
        this.joinCategory[0].Items.forEach((i) => {
          if (i.Id != item.Id)
            i.IsSelected = false;
        });
        item.IsSelected = !item.IsSelected;
        if (item.IsSelected) {
          this.selected = this.prepareItemForOrder(item);

        }
        else { this.selected = null }
        this.someOption = true;
      }

      else if(this.userBirthDay){
        this.bdayCategory[0].Items.forEach((i) => {
          if (i.Id != item.Id)
            i.IsSelected = false;
        });
        item.IsSelected = !item.IsSelected;
        if (item.IsSelected) {
          this.selected = this.prepareItemForOrder(item);

        }
        else { this.selected = null }
        this.someOption = true;
      }

      else if(this.userAnniversary ){
        this.annCategory[0].Items.forEach((i) => {
          if (i.Id != item.Id)
            i.IsSelected = false;
        });
        item.IsSelected = !item.IsSelected;
        if (item.IsSelected) {
          this.selected = this.prepareItemForOrder(item);

        }
        else { this.selected = null }
        this.someOption = true;
      }
      else if(this.userAnniversaryAndBDay){
        this.annAndBDayCategory.forEach((i) => {
          if (i.Id != item.Id)
            i.IsSelected = false;
        });
        item.IsSelected = !item.IsSelected;
        if (item.IsSelected) {
          this.selected = this.prepareItemForOrder(item);

        }
        else { this.selected = null }
        this.someOption = true;
      }
    }
  }

  addToCart() {
    //console.log("this.selectedItemsEndKiosk",this.selectedItemsEndKiosk)
      console.log("addToCart()");
      this.order.OrderItems.push(this.selected);

      this.dialogRef.close({addToCart:true }); 


      /*console.log("selectedItems", this.selectedItems)
      if(this.selectedItemsEndKiosk){
        for (let index = 0; index < this.selectedItemsEndKiosk.length; index++) {
          const i = this.selectedItemsEndKiosk[index];
          this.selectedItems.push(i);
          var itemm : any = i;
          console.log("this.selectedItems.push(i);", this.selectedItems); 
          this.loadSuccessAddingToCartMessage()
          
        }
        this.loadSuccessAddingToCartMessage();

        console.log("this.selectedItems",this.selectedItems)
      }*/



      /*if (this.selected != null && this.selectedItemsEndKiosk.length==0) {
        this.selectedItems.push(this.selected)
        this.items.splice(this.items.indexOf(this.selected), 1);

        this.loadSuccessAddingToCartMessage();
        //}
        //}
        if (this.maxItems <= this.selectedItems.length) {
          this.cancelAction();
        }
        if ((this.items && this.items.length === 0) &&
          (this.selected && ((this.selected.Garnishes && this.selected.Garnishes.length === 0) && (this.selected.GarnishGroups && this.selected.GarnishGroups.length === 0)))) {
          this.cancelAction();
        }


        this.cancelAction();

      } else {
        this.cancelAction();
      }*/
    
  }

  private prepareItemForOrder(item: ItemAppAdvancedModel) {
    const orderItem = new OrderItemAppModel();
    orderItem.Amount = item.Amount;
    orderItem.ItemId = item.Id;
    orderItem.Comment = '';
    orderItem.IsClubMemberItem = true;
    orderItem.IsAnnBenefitItem = item.IsAnnBenefitItem;
    orderItem.IsBDayBenefitItem = item.IsBDayBenefitItem;
    orderItem.IsJoinBenefitItem = item.IsJoinBenefitItem;
    this.displayContinueButton = true;
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
    // Check if some garnish groups have free count of garnishes
    // Group of garnishes:
    const garnishesGroup = {};
    garnishes.forEach((garnish) => {
      if (garnish) {
        garnishesGroup[garnish.GarnishGroupId] = garnishesGroup[garnish.GarnishGroupId] || [];
        garnishesGroup[garnish.GarnishGroupId].push(garnish);
      }
    });
    // Check free count of garnishGroup:
    Object.keys(garnishesGroup).forEach((key) => {
      if (item.GarnishGroups) {
        for (let i = 0; i < item.GarnishGroups.length; i++) {
          if (item.GarnishGroups[i].Garnishes && item.GarnishGroups[i].Garnishes[0]
            && item.GarnishGroups[i].Garnishes[0].GarnishGroupId === +key && item.GarnishGroups[i].FreeCount) {
            garnishesGroup[key].sort((garnish1, garnish2) => {
              return garnish1.Price - garnish2.Price;
            }).map((garnish, index) => {
              if (index < item.GarnishGroups[i].FreeCount) {
                garnish.Price = 0;
              }
            });
          }
        }
      }
    });
    orderItem.Garnishes = garnishes;
    orderItem.SpecialRequests = '';
    orderItem.ComboItemId = 0;
    orderItem.IsScratchCoupon = false;
    orderItem.ScratchCouponId = 0;
    orderItem.Price = item.Price;
    orderItem.ImageUrl = item.ImageUrl;
    orderItem.Name = item.Name;
    if (this.comment.length >1) {
      orderItem.Comment = this.comment;
      orderItem.SpecialRequests = this.comment;
    }

    return orderItem;
  }


  public continueToBenefits(){
    this.router.navigate([`${this.franchiseId}/my-membership`]);
    this.close();

  }

  public loadSuccessAddingToCartMessage() {
    if(document){
    document.getElementById("snackbar-club-member").classList.add("show");    
    setTimeout(() => {
     document.getElementById("snackbar-club-member").classList.remove("show");    
    }, 90000);
   }

  }


  public scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { 
    }                 
  }


  public continueToSuccesfullyAdded(){


    if(!this.acceptTerms){
       document.getElementById("terms-alert11").classList.add("show");   
       this.scrollToBottom(); 
    }
      
    if (this.acceptTerms) {

      document.getElementById("terms-alert11").classList.remove("show");
      this.clearErrorFields();
      if (this.isAllValidUserData()) {
        //this.loadSuccessAddingToCartMessage();
        this.signIn();
        //this.succesfullyAdded = true;
        //this.continueToSignUp = false;
      }
      else {
        //this.displayCustomerErrorFields();
      }
    }
  }


  public isAllValidUserData() {
    return this.isFilledCustomerFields();
  }

  public isFilledCustomerFields() {
    var pattern = new RegExp('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}'); 
    if(this.appUser.CanceledMembership){
      return true;
    }
    if (/*this.sendInvoice &&*/ this.appUser.Email!= null && 
        this.appUser.Email!= undefined && 
        this.appUser.Email.toString().trim().length > 0 &&  pattern.test(this.appUser.Email.toString().trim()) && 
        this.dateIsValid(this.appUser.BirthDate?._d) && 
        (this.dateIsValid(this.appUser.Anniversary?._d)|| this.appUser.Anniversary?._d == undefined)) {

          console.log("email is not undefined and pattern and birthDate");
          return true;

        //return this.dateIsValid(this.appUser.BirthDate);
      
    }
    /*else if(this.appUser.Email == null ||
      this.appUser.Email == undefined ||
      this.appUser.Email.toString().trim().length == 0 ||  !pattern.test(this.appUser.Email.toString().trim())){
      console.log("email is undefined OR pattern");
      this.orderErrors.Email = true;
      return false;

    }*/
    
    else if(!this.dateIsValid(this.appUser.BirthDate?._d)){
      console.log("date is not valid");
      this.orderErrors.BirthDate = true;
      return false;
    }

    else if(this.appUser.Anniversary != undefined && !this.dateIsValid(this.appUser.Anniversary?._d)){
      console.log("ann is excist and not valid");
      this.orderErrors.Anniversary = true;
      return false;

    }
    return true;
  }

  public trimField(value) {
    return value ? value.toString().trim() : value;
  }

  dateIsValid(date) {
    if( date instanceof Date) return true;
    else{
      return false;

    }
  }

  public removeErrorWhileFocus(field) {
    if (this.orderErrors && field && this.orderErrors[field]) {
      this.orderErrors[field] = false;
    }
  }

  private displayCustomerErrorFields() {
    //  this.acceptTermsError = !this.acceptTerms;
      //var pattern = new RegExp('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}');
     //console.log("pattern.test(this.order.Email.toString().trim())",pattern.test(this.order.Email.toString().trim()));
     //console.log("this.sendInvoice",this.sendInvoice);
      //this.orderErrors.FirstName = !this.trimField(this.appUser.FirstName);
     // this.orderErrors.LastName = !this.trimField(this.appUser.LastName);
        this.orderErrors.Email = true;
         //this.orderErrors.Email = !pattern.test(this.order.Email.toString().trim());
    }


  public getLanguage() {
    return this.translationsService.language();
  }

  public trimEmptySpace(text:string) {
    
    return text ? text.trim() : text;
  }


  public close(updateUser?) {
    console.log("close membership"); 



    if(updateUser){
      this.signInOutService.updateUserDetails(this.appUser).subscribe((result) => {
      }, (error) => {
        console.log("error update user");
  
      });

    }

    this.dialogRef.close({signIn:false }); 
  }

  public signIn() {
    console.log("SIGNIN()"); 
    //this.dialogRef.close({signIn: true }); 


    this.dialogRef.close({
      signIn: true,
      bDay: this.appUser.BirthDate._d,
      canceledMembership: this.appUser.CanceledMembership,
      annDay: this.appUser.Anniversary?._d,
      email: this.appUser.Email,
      enablePush : this.appUser.AllowAdvertisement,
      fName: this.appUser.FirstName,
      lName: this.appUser.LastName

    });
    
  }

  private clearErrorFields() {
    this.orderErrors.FirstName = false;
    this.orderErrors.LastName = false;
    this.orderErrors.Email = false;
    this.orderErrors.UserCity = false;
    this.orderErrors.Street = false;
    this.orderErrors.StreetNum = false;
    this.orderErrors.number = false;
    this.orderErrors.cvv = false;
    this.orderErrors.ownerId = false;
    this.orderErrors.expirationYear = false;
    this.orderErrors.expirationMonth = false;
    this.orderErrors.sum =false;
  }

  private initializeGraphics() {
    this.graphics.logo = AppConfig.settings.logo;
    this.graphics.cover = AppConfig.settings.cover;
    this.colors.menuColor = AppConfig.settings.menuColor;
    this.colors.buttonColor = AppConfig.settings.buttonColor;
    this.lang = this.translationsService.language();
  }

}
