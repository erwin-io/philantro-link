import { HttpClient } from '@angular/common/http';
import { catchError, take, throwError } from 'rxjs';

import { Injectable, APP_INITIALIZER } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../shared/utility/config';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private static readonly configPath = "../../assets/config.json";

  private appConfig: AppConfig;
  constructor(private http: HttpClient) {
  }

  public loadAppConfig() {
    return new Promise((resolve)=> {
      this.http.get(AppConfigService.configPath)
      .pipe(
        take(1),
        catchError((err) =>{
          return throwError(err || 'Server error')
        } )
      )
      .subscribe((configResponse: object) => {
        this.appConfig = configResponse as AppConfig;
        resolve(true);
      })
    })

  }

  get config() : AppConfig {
    return this.appConfig;
  }
}
