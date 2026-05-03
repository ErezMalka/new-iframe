import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { StorageValueEnum } from '../enums/advanced/storage-value.enum';
import { AppStorageService } from '../app.storage.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private isFirstLoad: boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private appStorageService: AppStorageService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let franchiseId = route.params['franchiseId'];
    if (this.appStorageService.getItemFromLocalStorage(StorageValueEnum.LOGIN_TOKEN + "_" + franchiseId) || !this.isFirstLoad) {
      // logged in so return true
      this.isFirstLoad = false;
      return true;
    }

    // not logged in so redirect to login page with the return url
    //let franchiseId = route.params['franchiseId'];
    this.router.navigate([`${franchiseId}/sign-in`], { queryParams: { returnUrl: state.url } });
    this.isFirstLoad = false;
    return false;
  }

}
