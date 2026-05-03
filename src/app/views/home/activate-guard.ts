import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { CanActivate, CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs";
import { AppConfig } from "../../app.config";
import { ConfigService } from "../../core/services/common-settings/config.service";
import { MessagePopupComponent } from "../../shared/components/message-popup/message-popup.component";
import { TranslationsService } from "../../shared/translations/translations.service";
import { RouteActivateService } from "./route-activate.service";

@Injectable()
export class ActivateGuard implements CanActivate {
  franchiseId: any;
  

  constructor(private routeActivate: RouteActivateService,
    private translationService: TranslationsService,
    private matDialog: MatDialog,
    private router: Router,
    private configService: ConfigService) {
    
   }

   ngOnInit() {
    
    this.franchiseId = this.configService.franchiseId;
  
    }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    console.log("canActivate");
    return this.routeActivate.canActivateHome || confirm("Do you really want to go back?");
   
    /*if (this.routeActivate.canActivateHome) {
      return true;
    }
    else {
      confirm("Do you really want to go back?");
     /* let header = this.translationService.translate('IMPORTANT_MESSAGE');
      let icon = "../../../assets/images/items/important-message.svg";
      const message = this.translationService.translate('GO_BACK');
      const matDialogRef = this.matDialog.open(MessagePopupComponent, {
        data: {
          isGoback : true,
          header,
          icon,
          message,
          withoutTimeout: true
        },
        minWidth: '345px',
        disableClose: true,
        panelClass: 'custom-mat-dialog-popup'
      });

      matDialogRef.afterClosed().subscribe((result) => { 
        console.log("my-result",result); 
        if (result.isDigitalMenu == true) {
          return false;
         }
        else{
          console.log("return true")
          //this.router.navigate([`${this.franchiseId}/home`]);
          return true;
        }});

        console.log("after")*/
    //}
  }
}
//|| confirm("Do you really want to go back?");