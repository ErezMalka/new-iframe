import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { ErrorService } from "../services/common-settings/error.service";
import { Router } from "@angular/router";
import {SignInOutService} from "../services/sign-in-out.service";

@Injectable()
export class HttpErrorsInterceptor implements HttpInterceptor {

  constructor(private errorService: ErrorService,
              private router: Router,
              private signInOutService: SignInOutService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    req.headers.append('handleError', 'onService');
    const started = Date.now();
    let ok: string;
    let event1 = null;
    return next.handle(req)
      .pipe(
        tap(
          event => {
            ok = event instanceof HttpResponse ? 'succeeded' : '';
            event1 = event;
          },
          error => {
            ok = 'failed';
            event1 = error;
          }
        ),
        finalize(() => {
          const elapsed = Date.now() - started;
          const msg = `${req.method} "${req.urlWithParams}"
             ${ok} in ${elapsed} ms.`;
          this.errorService.errorSendMessage.next({
            msg,
            error: event1
          });
          //No internet, methods or server exceptions
          if (event1 && (event1.status === -1 || event1.status === 404 || event1.status === 401 || event1.status === 500)) {
            // this.signInOutService.signOut();
            // this.router.navigate(['/error']);
          }
        })
      );
  }

}
