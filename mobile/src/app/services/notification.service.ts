import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../model/api-response.model';
import { AppConfigService } from './app-config.service';
import { IServices } from './interface/iservices';
import { Notifications } from '../model/notifications.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements IServices {

  constructor(private http: HttpClient, private appconfig: AppConfigService) { }

  getUnreadByUser(userCode: string): Observable<ApiResponse<number>> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.notifications.getUnreadByUser + userCode)
    .pipe(
      tap(_ => this.log('notifications')),
      catchError(this.handleError('notifications', []))
    );
  }

  getByAdvanceSearch(params: {
    order: any;
    columnDef: { apiNotation: string; filter: string }[];
    pageSize: number;
    pageIndex: number;
  }): Observable<ApiResponse<{ results: Notifications[]; total: number}>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.notifications.getByAdvanceSearch,
      params)
    .pipe(
      tap(_ => this.log('notifications')),
      catchError(this.handleError('notifications', []))
    );
  }

  marAsRead(notificationId) {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.notifications.marAsRead + notificationId, {})
    .pipe(
      tap(_ => this.log('notifications')),
      catchError(this.handleError('notifications', []))
    );
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (res: any): Observable<T> => {
      if(res.error && res.error?.message) {
        if(res.error?.error) {
          this.log(`${operation} failed: ${Array.isArray(res.error?.errorerror) ? res.error?.error[0] : res.error?.error}`);
          return of({
            success: false,
            message: res.error?.error
          } as any);
        } else {
          this.log(`${operation} failed: ${Array.isArray(res.error.message) ? res.error.message[0] : res.error.message}`);
          return of(res.error as T);
        }
      } else {
        if((res.name && res.name?.toString().toLowerCase().includes('httperrorresponse')) ||
        (res.message && res.message?.toString().toLowerCase().includes('http'))) {
          this.log(`${operation} failed: ${Array.isArray(res.message) ? res.message[0] : res.message}`);
          return of({
            success: false,
            message: 'Something went wrong, We cannot connect you to our server this time. Please try again!'
          } as any);
        } else {
          this.log(`${operation} failed: ${Array.isArray(res.message) ? res.message[0] : res.message}`);
          return of(res as any);
        }
      }
    };
  }

  log(message: string) {
    console.log(message);
  }
}
