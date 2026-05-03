import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from "../../core/services/common-settings/config.service";
import { Observable } from "rxjs";

@Injectable()
export class MyOrderService {

  constructor(private http: HttpClient,
              private configService: ConfigService) {}



}
