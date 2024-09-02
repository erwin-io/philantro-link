import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../model/api-response.model';
import { UserFirebaseToken } from '../model/user-firebase-token';
import { AppConfigService } from './app-config.service';
import { IServices } from './interface/iservices';

@Injectable({
  providedIn: 'root'
})
export class UserFirebaseTokenService implements IServices {

  constructor(private http: HttpClient, private appconfig: AppConfigService) { }

  getByDevice(params: {
    userid: string,
    device: string
  }): Observable<ApiResponse<UserFirebaseToken>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.userFirebaseToken.getByDevice,
      params)
    .pipe(
      tap(_ => this.log('user-firebase-token')),
      catchError(this.handleError('user-firebase-token', []))
    );
  }

  create(data: any): Observable<ApiResponse<UserFirebaseToken>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.userFirebaseToken.create, data)
    .pipe(
      tap(_ => this.log('user-firebase-token')),
      catchError(this.handleError('user-firebase-token', []))
    );
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.log(`${operation} failed: ${Array.isArray(error.error.message) ? error.error.message[0] : error.error.message}`);
      return of(error.error as T);
    };
  }

  log(message: string) {
    console.log(message);
  }
}
