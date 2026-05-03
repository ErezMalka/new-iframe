import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CategoryAppAdvancedModel } from './models/advanced/menu/category-app-advanced.model';
import { PizzaAppAdvancedModel } from './models/advanced/pizza/pizza-app-advanced.model';
import { ToppingAppModel } from './models/menu/topping-app.model';
import {BranchAppModel} from "./models/franchise-branch/branch-app.model";
import {FranchiseAppModel} from "./models/franchise-branch/franchise-app.model";
import ComboAppModel from "./models/combo/combo.model";
import ComboAppAdvancedModel from "./models/advanced/combo/combo-app-advanced.model";
import {PickupsMethodsEnum} from "./enums/pickups-methods.enum";
import {DeliveryGroupAppModel} from "./models/order/delivery-group-app.model";

/*
* function body that test if storage is available
* returns true if localStorage is available and false if it not
*/
function lsTest(){
  const test = 'test';
  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch(e) {
    return false;
  }
}

/*/!*
* execute Test and run our custom script
*!/
if(lsTest()) {
  // window.sessionStorage.setItem(name, 1); // session and storage methods are very similar
  window.localStorage.setItem(name, 1);
  console.log('localStorage where used'); // log
} else {
  document.cookie="name=1; expires=Mon, 28 Mar 2016 12:00:00 UTC";
  console.log('Cookie where used'); // log
}*/

function cookieStorage() {
  const cookieValue = document.cookie;
  if (cookieValue) {

  }
}

@Injectable()
export class AppStorageService {
  public languages: any[];
  public categories: CategoryAppAdvancedModel[];
  public pizzas: PizzaAppAdvancedModel[];
  public pizzaToppings: ToppingAppModel[];
  public combos: ComboAppAdvancedModel[];
  // To save current branch;
  public branch: BranchAppModel;
  public branchAndGroup: any;
  public franchise: FranchiseAppModel;
  public paymentResult: any;

  public deliveryGroup: DeliveryGroupAppModel;

  // Checks need of loading scratch coupon to user to choose option
  public useScratchCoupon: boolean = true;
  // checks if user will use scratch coupon in the order
  public isUsedScratchCoupon: boolean = false;
  public wasScratchDisplayed: boolean = false;
  public paymentOptions: any;
  public branches: BranchAppModel[];

  public isMenuWasLoaded: boolean = false;
  public backResultMenu: any;
  public backResultCombo: any;

  public isFranchiseBranchesWasLoaded: boolean = false;
  public backResultFranchiseBranches: any;

  public orderType: PickupsMethodsEnum;

  public startingPage: string;
  public logo:string;
  public isFirstPopUp: boolean = true;

  public nameOnce: boolean = true;

  public inLinks: boolean = false;

  public canStartMessages: boolean = false;
  public addNameOnce: boolean = true;
  public tranzilaRes: any;
  public chargeFields: boolean = true;

  public showClubMember: boolean = true;

  public appUser : any;
  public ccTokens : any;
  public addresses : any;
  public pointsPerOrder: number;
  public clubMembershipCategories: any;
  public currentUserPoints: number;
  public itemsFromShopPrice: number;
  public franchiseDiscount: any;
  public loadSuccessCancelMembershipMessage: boolean = false;
  public dontShowAgainCancelMessage: boolean = false;
  public memberClubPolicy: string;
  public privacyPolicy: string;
  public Terms: string;
  public Info:string;
  public MoreInfo:string;
  public UseBiteCredit :boolean;
  public   CreditOptions:string;
  public   CreditName :string;
  public   AllowCustomCreditSum :boolean;
  public   CreditAddedValuePercent :number;
  constructor(private http: HttpClient) {}

  public setItemInLocalStorage(key, value) {
    if (lsTest()) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  public getItemFromLocalStorage(key) {
    if (lsTest()) {
      const value = localStorage.getItem(key);
      if (value == undefined) {
        return value;
      }
      else {
        try {
          return JSON.parse(value);
        } catch (e) {
          return value;
        }
      }
    }
  }

  public removeItemInStorage(key) {
    if (lsTest()) {
      localStorage.removeItem(key);
    }
  }

}
