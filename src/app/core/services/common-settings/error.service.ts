import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from "rxjs";

@Injectable()
export class ErrorService {

  public errorSendMessage = new BehaviorSubject<any>(null);

  constructor(private router: Router) {}

}
