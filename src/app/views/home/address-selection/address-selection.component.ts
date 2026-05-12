import {Component, EventEmitter, ElementRef, ViewChild, Inject, OnInit, Output} from '@angular/core';
import { TranslationsService } from '../../../shared/translations/translations.service';
import { AppConfig } from '../../../app.config';
import {ConfigService} from "../../../core/services/common-settings/config.service";
import {SignInOutService} from "../../../core/services/sign-in-out.service";
import {AppStorageService} from "../../../app.storage.service";
import {MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from "@angular/material/dialog";
import {CommonFunctionsService} from "../../../core/services/common-settings/common-functions.service";
import {StorageValueEnum} from "../../../enums/advanced/storage-value.enum";
import {BrowserIdentificatorService} from "../../../core/services/common-settings/browser-identificator.service";
import {LanguageEnum} from "../../../enums/advanced/language.enum";
import {OrderAppModel} from "../../../models/order/order-app.model";
import {CityModel} from "../../../models/order/city.model";
import {BranchAppModel} from "../../../models/franchise-branch/branch-app.model";
import {MetaDataService} from "../../../core/services/meta-data.service";
import {MessageService} from "../../../shared/components/message/message.service";
import {AppUserAppModel} from "../../../models/user/app-user-app.model";
import {PaymentTypeEnum} from "../../../enums/payment-type.enum";
import {CountryEnum} from "../../../enums/advanced/country.enum";
import {FormControl} from "@angular/forms";
import StreetModel from "../../../models/order/street.model";
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";
import { MatDialog } from '@angular/material/dialog';
import { DialogSignInComponent } from '../../../components/sign-in/popup/dialog-sign-in.component';
import { GooglePlaceDirective } from "ngx-google-places-autocomplete";
import { DeviceDetectorService } from 'ngx-device-detector';


@Component({
  selector: 'dialog-sign-in',
  templateUrl: './address-selection.component.html',
  styleUrls: ['./address-selection.component.scss']
})
export class AddressSelectionComponent implements OnInit {

  public graphics = {
    logo: '',
    cover: '',
  };

  public colors = {
    menuColor: '',
    buttonColor: ''
  };
  public googleMaps: boolean;
  public dummyDeliveryGroups:boolean;
  public displayAddress:boolean;
  public address: string;
  public currentCity: CityModel;
  public streets: string[] = [];
  public filteredStreets: Observable<string[]>;
  public filteredCities: Observable<CityModel[]>;
  public currentCityCode: number;
  public googlePlaceAddress:any;
  public order: OrderAppModel;
  public cities: CityModel[] = [];
  public dummyCities: any[] = [];
  public isDisplayedSignInForm: boolean = false;
 public noHouseNr:boolean = false;
  public lang: string;
  public cashSymbol: string;
  public branch: BranchAppModel;
  public user: AppUserAppModel;
  public addresses: any[] = [];
  public newAddress: boolean = false;
  public availableGroups: any[] = [];
  public isSignedUser: boolean = false;

  public orderErrors = {
    UserCity: false,
    Street: false,
    StreetNum: false,
    Floor: false,
    ApartmentNum: false,
  };

  public isLoaded: any = {
    isDeliveryDataLoaded: true,
    isBranchOpenLoaded: true,
  };

  public options = {
    fields: [
      "address_component", "adr_address", "alt_id", 
      "formatted_address", "geometry", "name", "vicinity"]
    }

  public cityStreetControl = new FormControl();
  public cityControl = new FormControl();

  constructor(protected translationService: TranslationsService,
              protected configService: ConfigService,
              protected signInOutService: SignInOutService,
              protected appStorageService: AppStorageService,
              public dialogRef: MatDialogRef<any>,
              public commonFunctionsService: CommonFunctionsService,
              protected browserService: BrowserIdentificatorService,
              private deviceService: DeviceDetectorService,
              private metadataService: MetaDataService,
              private messageService: MessageService,
              private matDialog: MatDialog,
              @Inject(MAT_DIALOG_DATA)
              public data: {order: OrderAppModel, cities: CityModel[], branch: BranchAppModel, user: AppUserAppModel}) {
  }

  @ViewChild("placesRef") placesRef : GooglePlaceDirective;

  @ViewChild('addressInput') addressInput: ElementRef;

  

  ngOnInit() {
    this.googleMaps = true;
    this.dummyDeliveryGroups = AppConfig.configSettings.dummyDeliveryGroups;
    this.displayAddress = false;
    this.initializeGraphics();
    this.initializeOrder();
    this.checkSigning();
    if ( this.dummyDeliveryGroups) {
      //this.initializeCitiesForDummyDeliveryGroups();
    } else {
      this.initializeStreetSettings();
      this.initializeCitySettings();
    }
    
  }

  public getLanguage() {
    return this.translationService.language();
  }

  isMobileMode(): boolean {
    //console.log("this.deviceService.isTablet()",this.deviceService.isTablet());
    return this.deviceService.isMobile() || this.deviceService.isTablet();
  }

  public loadSignInForm(){
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
      panelClass: ['padding-small-container', 'custom-mat-dialog-mobile' , 'custom-mat-dialog-mobile-top'],
      disableClose: false,
    });
    matDialogRef.componentInstance.isSignLoaded
      .subscribe((result) => {
        this.isLoaded.isSignInLoaded = result;
      });
    matDialogRef.componentInstance.signInCompleted
      .subscribe((result) => {
        //this.loadOrderUserDataToUser(this.order);
        this.isSignedUser = result;
        if (this.isSignedUser) {
          //this.completeOrder(true);
        }
      });
    matDialogRef.afterClosed().subscribe((result: any) => {
      this.checkSigning();
      
  
    });
  }
  

  private initializeStreetSettings() {
    this.filteredStreets = this.cityStreetControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterStreet(value))
      );
  }

  private initializeCitySettings() {
    this.filteredCities = this.cityControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterCity(value))
      );
  }

  private _filterStreet(value: string): string[] {
    const filterValue = value ? value.toLowerCase() : '';
    return this.streets.filter(option => option && option.toLowerCase().includes(filterValue));
  }

  private _filterCity(value: string): CityModel[] {
    const filterValue = value ? value.toLowerCase() : '';
    return this.cities.filter(option => option.Name && option.Name.toLowerCase().includes(filterValue));
  }

  private initializeOrder() {
    this.order = this.data.order;
    this.branch = this.data.branch;
  }

  private checkUserCityInListOfCities(checkedCity) {
    if (this.cities) {
      const city = this.cities.find((city) => {
        return city && checkedCity && city.Name.trim().toLowerCase() === checkedCity.trim().toLowerCase();
      });
      return city ? city.Name.trim() : '';
    }
    return '';
  }

  public deleteUserAddress(id, index) {
    this.signInOutService.deleteUserAddress(id)
        .subscribe((res) => {
          if (res) {
            this.addresses.splice(index,1);
          }
        });
  }

  public completeSelectionAddress() {
    console.log("completeSelectionAddress")
    this.clearErrorFields();
    if (this.isFilledRequiredFields()) {

      if(this.dummyDeliveryGroups) {
        this.metadataService.getFranchiseWithBranches(this.appStorageService.orderType)
        .subscribe((franchiseRes) => {
          if (franchiseRes && franchiseRes.branches) {
            franchiseRes.branches.forEach((brn) => {
              if (brn.IsDelivery) {
                brn.DeliveryGroups.forEach((group) => {

                  var currentGroup = group.Cities.find(c=> c.Name == this.order.UserCity);
                  if (currentGroup) {
                    this.availableGroups.push(
                      { branchID: brn.Id , branchName: brn.Name ,  group  }
                      );
                    this.isLoaded.isDeliveryDataLoaded = true;
                    this.dialogRef.close({
                      isSaved: true,
                      order: this.order,
                      availableGroups: this.availableGroups
                    });
                  }
                });
              }
        
            });
          }
     
        });
      } else { 
        this.dialogRef.close({
          isSaved: true,
          order: this.order,
          availableGroups: this.availableGroups
        })
      }
      

   /*   this.addressSelection(() => {
        this.dialogRef.close({
          isSaved: true,
          order: this.order,
          availableGroups: this.availableGroups
        })
      });*/
    } else {
      console.log("completeSelectionAddress else")
      this.displayErrorFields();
    }
  }

  private displayErrorFields() {
    if (this.order && this.order.IsDelivery) {
      this.orderErrors.UserCity = !this.trimField(this.order.UserCity);
      this.orderErrors.Street = !this.trimField(this.order.Street);
      this.orderErrors.StreetNum = !this.order.StreetNum;
    }
  }

  public isFilledRequiredFields() {
    if (this.order && this.order.IsDelivery) {
      if (AppConfig.configSettings.allowIncompletAddress)  return this.trimField(this.order.UserCity);
      else
      return this.trimField(this.order.UserCity) && this.trimField(this.order.Street) && 
             (this.order.StreetNum || this.noHouseNr);
    } else {
      return true;
    }
  }

  public trimField(value) {
    return value ? value.toString().trim() : value;
  }

  private clearErrorFields() {
    Object.keys(this.orderErrors).forEach((key) => {
      this.orderErrors[key] = false;
    });
  }

  private findCity(city) {
    const selectedCity = this.cities.find(i => i.Name && i.Name.trim().toLowerCase() === city.trim().toLowerCase());
    if (selectedCity) {
      return selectedCity.Name;
    }
    return city;
  }

  private findStreet(street) {
    const selectedStreet = this.streets.find(i => i && i.trim().toLowerCase() === street.trim().toLowerCase());
    if (selectedStreet) {
      return selectedStreet;
    }
    return street;
  }

  private addressSelection(callback) {
    this.isLoaded.isDeliveryDataLoaded = false;
    if (this.dummyDeliveryGroups) {
      
    }
    else {
      const UserCity = this.findCity(this.order.UserCity);
      const Street = this.findStreet(this.order.Street);
      this.metadataService.getCoordinates(UserCity, Street,
        this.order.StreetNum).subscribe( (data: any) => {
        if (data.success) {
          this.order.Lat = data.lat;
          this.order.Lng = data.lng;
          // Get List of available delivery areas
          this.metadataService.getDeliveryGroup(this.order.Lat, this.order.Lng)
            .subscribe((result) => {
              this.isLoaded.isDeliveryDataLoaded = true;
              this.order.UserCity = UserCity;
              this.order.Street = Street;
              const avilableGroups = result;
              if (avilableGroups.sucess) {
                this.availableGroups = avilableGroups.avilibaleGroups;
                if (callback) {
                  callback();
                }
              } else {
                this.notFoundBranchMessage();
              }
            }, () => {
              this.isLoaded.isDeliveryDataLoaded = true;
            })
        } else {
          this.isLoaded.isDeliveryDataLoaded = true;
          this.notFoundBranchMessage();
        }
      }, () => {
        this.isLoaded.isDeliveryDataLoaded = true;
      });
    }
   
  }

  private notFoundBranchMessage() {
    let header = this.translationService.translate('ERROR');
      let icon = "../../../assets/images/items/important-message.svg";
    const data = {
      header,
      icon,
      message: this.translationService.translate('DELIVERY_BRANCH_NOT_FOUND'),
      withoutTimeout: true,
      isUsedPre: false
    };
    this.messageService.displayPopupMessage(data);
    this.dialogRef.close({
      isSaved: true,
      order: this.order,
      availableGroups: this.availableGroups
    });
  }

  private checkIfSelectedCity($event) {
    if (!this.order.UserCity) {
      const data = {
        message: this.translationService.translate('CITY_NOT_SELECTED'),
        withoutTimeout: true,
        isUsedPre: true
      };
      // this.messageService.displayPopupMessage(data)
    } else {
      //if (!this.dummyDeliveryGroups) this.loadCurrentStreetsForCity();
    }
  }

  private loadCurrentStreetsForCity() {
    this.currentCity = this.cities.find(it => it.Name.trim().toLowerCase() == this.order.UserCity.trim().toLowerCase());
    this.loadCityStreets();
  }

  private loadCityStreets() {
    // if (this.currentCity && this.currentCity.Code != this.currentCityCode) {
    this.isLoaded.isDeliveryDataLoaded = false;
    this.metadataService.getCityStreets(this.currentCity.Code).subscribe((streets) => {
      this.currentCityCode = this.currentCity.Code;
      this.streets = streets || [];
      // this.streets = this.removeSpace(this.streets);
      this.isLoaded.isDeliveryDataLoaded = true;
    }, () => {
      this.isLoaded.isDeliveryDataLoaded = true;
      this.messageService.displayServerErrorMessage();
    });
    // }
  }

  private removeSpace(cities, field?) {
    if (!cities) {
      return;
    }
    return cities.map((city) => {
      if (field) {
        if (city && city[field]) {
          city[field] = city[field].trim();
        }
      } else {
        if (city) {
          city = city.trim();
        }
      }
      return city;
    })
  }

  public displayStreetFn(street?): string | undefined {
    return street ? street.trim() : undefined;
  }

  private initializeCities() {
    this.isLoaded.isDeliveryDataLoaded = false;
    this.metadataService
      .getCities()    // this.order.BranchId .getDeliveryCitiesInformation(this.order.BranchId)
      .subscribe((result) => {
        this.cities = result;
        // this.cities = this.removeSpace(this.cities, 'Name');
        if (this.order && this.cities && this.cities.length > 0) {
          if (!this.order.UserCity) {
            this.order.UserCity = this.user ?
              this.checkUserCityInListOfCities(this.user.UserCity) || '' : '';
            if (this.order.UserCity) {
              this.loadCurrentStreetsForCity();
            }
          } else {
            const findCity = this.cities.find((city) => {
              return city && city.Name && this.order.UserCity &&
                city.Name.trim().toLowerCase() === this.order.UserCity.trim().toLowerCase();
            });
            if (findCity) {
              this.order.UserCity = findCity ? findCity.Name.trim() : '';
              this.loadCurrentStreetsForCity();
            } else {
              this.order.UserCity = '';
            }
          }
          this.citySettings(true);
        }
        this.isLoaded.isDeliveryDataLoaded = true;
      }, (error) => {
        this.isLoaded.isDeliveryDataLoaded = true;
        this.messageService.displayServerErrorMessage();
      });
  }

  private initializeCitiesForDummyDeliveryGroups() {
    this.isLoaded.isDeliveryDataLoaded = false;
    this.dummyCities= [];
    this.metadataService.getFranchiseWithBranches(this.appStorageService.orderType)
      .subscribe((result) => {
        if (result && Array.isArray(result.branches)) {
          result.branches.forEach((brn) => {
            this.metadataService.getDeliveryCitiesInformation(brn.Id)
              .subscribe((citiesResult) => {
                if (citiesResult && citiesResult.length > 0) {
                  citiesResult.forEach((city) => {
                    this.dummyCities.push(city);
                  });
                }
                 
 ////
      if (this.order && this.cities && this.cities.length > 0) {
        if (!this.order.UserCity) {
          this.order.UserCity = this.user ?
            this.checkUserCityInListOfCities(this.user.UserCity) || '' : '';
          if (this.order.UserCity) {
          // this.loadCurrentStreetsForCity();
          }
        } else {
          const findCity = this.cities.find((city) => {
            return city && city.Name && this.order.UserCity &&
              city.Name.trim().toLowerCase() === this.order.UserCity.trim().toLowerCase();
          });
          if (findCity) {
            this.order.UserCity = findCity ? findCity.Name.trim() : '';
          // this.loadCurrentStreetsForCity();
          } else {
            this.order.UserCity = '';
          }
        }
        this.citySettings(true);
      }
///

            }, (error) => {
              this.isLoaded.isDeliveryDataLoaded = true;
              this.messageService.displayServerErrorMessage();
            });
            this.isLoaded.isDeliveryDataLoaded = true;
          });
          
         
        } else {
          this.isLoaded.isDeliveryDataLoaded = true;
        }
      }, (error) => {
        this.isLoaded.isDeliveryDataLoaded = true;
        this.messageService.displayServerErrorMessage();
      });
  }

  
  public citySettings(notDisplay?: boolean) {
    if (!this.order) return;
    if (!this.order.UserCity) return;
  }

  public removeErrorWhileFocus(field) {
    if (this.orderErrors && field && this.orderErrors[field]) {
      this.orderErrors[field] = false;
    }
  }

  public restrictKeysExceptDigitsAndPlus(event, dontIncludePlus?) {
    this.commonFunctionsService.restrictKeysExceptDigitsAndPlus(event, !!dontIncludePlus);
  }

  private initializeGraphics() {
    this.graphics.logo = AppConfig.settings.logo;
    this.colors.menuColor = AppConfig.settings.menuColor;
    this.colors.buttonColor = AppConfig.settings.buttonColor;
    this.lang = this.translationService.language();
    this.cashSymbol = AppConfig.cashSymbol;
  }


  public close() {
    this.order.UserCity = '';
    this.order.Street = '';
    this.order.StreetNum = undefined;
    this.order.ApartmentNum = undefined;
    this.order.Floor = undefined;
    this.dialogRef.close(false);
    console.log("address selection close")
  }

  public directionLanguage() {
    return LanguageEnum.HE;
  }

  private loadUserDataToOrder(user, withAddress) {
    if (user) {
      this.user = user;
    
      this.order.FirstName = user.FirstName || '';
      this.order.LastName = user.LastName || '';
      this.order.Phone = user.Phone || '';
      this.order.ExtraPhone = user.ExtraPhone || '';
      if (withAddress) {
        this.order.UserCity = this.checkUserCityInListOfCities(user.UserCity);
        this.order.Street = user.Street || '';
        this.order.Floor = user.Floor || '';
        this.order.ApartmentNum = user.ApartmentNum || '';
        this.order.StreetNum = user.StreetNum || '';
      }
    }
  }

  public itemCitySelected(event) {
    this.currentCity = event;
  }


  public checkLoading() {
    return Object.keys(this.isLoaded).every((key) => {
      return this.isLoaded[key];
    });
  }

  public verifyToken(isFirstTime?) {
    const token = this.appStorageService
      .getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN  + "_" + this.configService.franchiseId);
    if (token) {
      this.isLoaded.isValidationUserLoaded = false;
      this.signInOutService.verifyToken(token).subscribe((response) => {
        if (response && response.addresses) {
          if (AppConfig.configSettings.cancelPhoneVerification) {
            this.addresses = [];
          }
          else {
            this.addresses = response.addresses;
          }
        }
       /* if (response && response.user) {
          if (response.user.FranchiseId != this.franchiseId) {
            this.signInOutService.signOut();
          }
        } else {
          this.signInOutService.signOut();
        }*/
        const result = response ? !!response.user : !!response;
        const resultAction = () => {
          if (result) {
            this.loadUserDataToOrder(response.user, true);
          } else {
            this.signInOutService.signOut();
          }
        }
        resultAction();
      //  this.initializeCities();
        if ( this.dummyDeliveryGroups) {
          this.initializeCitiesForDummyDeliveryGroups();
        } else {
          this.initializeCities();
        }
        this.isLoaded.isValidationUserLoaded = true;
      }, (error) => {
        //this.signInOutService.signOut();
        this.isLoaded.isValidationUserLoaded = true;
        this.isLoaded.isDiscountLoaded = true;
        // this.checkedUserSigning();
        this.messageService.displayServerErrorMessage();
      });
    } else {
      this.isLoaded.isDiscountLoaded = true;
      this.signInOutService.signOut();
      console.log("initializeCities")
    //  this.initializeCities();
      if ( this.dummyDeliveryGroups) {
        this.initializeCitiesForDummyDeliveryGroups();
      } else {
        this.initializeCities();
      }
    }
  }

  public checkSigning(result?) {
    //this.isSignedUser = !!result;
    this.isSignedUser = !!this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + this.configService.franchiseId);
      
    if (this.isSignedUser) {
      this.verifyToken(true);
    } else {
      if ( this.dummyDeliveryGroups) {
        this.initializeCitiesForDummyDeliveryGroups();
      } else {
        this.initializeCities();
      }
     
    }
  }
  
  public changeSelectedAddress(userAddress, isContinue){
    this.order.StreetNum = userAddress.StreetNum;
    this.order.Lat = userAddress.Lat;
    this.order.Lng =  userAddress.Lng;
    this.metadataService.getDeliveryGroup(this.order.Lat, this.order.Lng)
          .subscribe((result) => {
            this.order.UserCity = userAddress.City;
            this.order.Street = userAddress.Street;
            this.order.ApartmentNum = userAddress.ApartmentNum;
            this.order.Floor = userAddress.Floor;
            this.address = userAddress.Street + " " + userAddress.StreetNum +
                           ", " + userAddress.City;  
            this.order.UserAddressId = userAddress.Id;

                                     
            this.displayAddress = true;
            const avilableGroups = result;
            this.isLoaded.isDeliveryDataLoaded = true;
            if (avilableGroups.sucess) {
              this.availableGroups = avilableGroups.avilibaleGroups;
              if (isContinue) {
                this.completeSelectionAddress();
              }
            
            } else {
              this.notFoundBranchMessage();
            }
          }, () => {
            this.isLoaded.isDeliveryDataLoaded = true;
          });
  }

   public handleAddressChange(address: any) {
    this.isLoaded.isDeliveryDataLoaded = false;
    this.googlePlaceAddress = address;
    var addressData = this.getDataFromGooglePlaceObject(address);
    if (AppConfig.configSettings.allowIncompletAddress){

    } else {

    }
    if (addressData.Street == '' && !AppConfig.configSettings.allowIncompletAddress){
      this.orderErrors.Street = true;    
      this.isLoaded.isDeliveryDataLoaded = true;
    } else if (addressData.StreetNum == '' && !this.noHouseNr){
      this.orderErrors.Street = false;
      this.orderErrors.StreetNum = true;
      this.isLoaded.isDeliveryDataLoaded = true;
    } else {
      this.orderErrors.Street = false;
      this.order.StreetNum = addressData.StreetNum;
      this.order.Lat = addressData.Latitude;
      this.order.Lng =  addressData.Longitude;
      this.metadataService.getDeliveryGroup(this.order.Lat, this.order.Lng)
            .subscribe((result) => {
              this.order.UserCity = addressData.City;
              this.order.Street = addressData.Street;
              this.order.Address = addressData.Address
              this.order.Premise = addressData.Premise
              this.address = addressData.Address;  
              if (addressData.StreetNum == '')
              {
                this.order.Street = this.addressInput.nativeElement.value.split(",")[0];
              //  this.address = this.addressInput.nativeElement.value
              }                        
              this.displayAddress = true;
              const avilableGroups = result;
              this.isLoaded.isDeliveryDataLoaded = true;
              if (avilableGroups.sucess) {
                this.availableGroups = avilableGroups.avilibaleGroups;

              //  if (callback) {
               //   callback();
               // }
              } else {
                this.notFoundBranchMessage();
              }
            }, () => {
              this.isLoaded.isDeliveryDataLoaded = true;
            });
    }
    
  }

  getDataFromGooglePlaceObject(place): any {
    if (place == undefined || place.geometry == undefined) return {};
    let streetNum = "";
    let street = "";//""
    let premise="";
    
    place.address_components.forEach((element) => {
      switch (element.types[0]) {
        case "street_number":
          streetNum = element.long_name;
          break;
        case "route":
          street = element.long_name;
          break;
        case "premise":
          premise = element.long_name;
          break;
     
      }
     /* if (element.types[0]=="street_number")  streetNum = element.long_name;
      else if (element.types[0]=="route")  street = element.long_name;
      else if (element.types[0]=="premise")  premise = element.long_name;*/
      
    });
    if (street == "" && AppConfig.configSettings.allowIncompletAddress)
      street = place.name;
    
       const city =
        place.address_components.find(c =>
          c.types.includes("locality")
        ) ||
        place.address_components.find(c =>
          c.types.includes("administrative_area_level_2")
        ) ||
        place.address_components.find(c =>
          c.types.includes("administrative_area_level_1")
        );
      var data ={
        Longitude: place.geometry.location.lng(),
        Latitude: place.geometry.location.lat(),
        Address: place.formatted_address,
        City: city ? city.long_name :"",//place.vicinity,
        Street: street,
        StreetNum: streetNum,
        Premise:premise
      }
      return {
        Longitude: place.geometry.location.lng(),
        Latitude: place.geometry.location.lat(),
        Address: place.formatted_address,
        City:  city ? city.long_name :"",//place.vicinity,
        Street: street,
        StreetNum: streetNum,
        Premise:premise
      }
    /*if (place.address_components[0].types[0]=="street_number") {
      streetNum = place.address_components[0].long_name;
      if (place.address_components[1].types[0]=="route") {
        street = place.address_components[1].long_name;        
      }
    } else if (place.address_components[0].types[0]=="route") {
        street = place.address_components[0].long_name;     
    } else if (place.address_components[1].types[0]=="street_number") {
      streetNum = place.address_components[0].long_name;
      if (place.address_components[2].types[0]=="route") {
        street = place.address_components[1].long_name;        
      }
    } else {
      if (street == "" && AppConfig.configSettings.allowIncompletAddress){
        street = place.name;
      } else {
        street = "";//place.name;
      }
     
    //}
    console.log(" place.name",place.name);
    console.log("street",street);
    return {
      Longitude: place.geometry.location.lng(),
      Latitude: place.geometry.location.lat(),
      Address: place.formatted_address,
      City: place.vicinity,
      Street: street,
      StreetNum: streetNum,
      Premise:premise
    }*/
  }

  noHouseNrChanged(){
    if (this.noHouseNr) {
      this.orderErrors.StreetNum = false;
     this.handleAddressChange(this.googlePlaceAddress);
    } else {
      this.orderErrors.StreetNum = true;
    }
  }

}
