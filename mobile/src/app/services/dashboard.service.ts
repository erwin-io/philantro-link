/* eslint-disable @typescript-eslint/member-ordering */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../model/api-response.model';
import { AppConfigService } from './app-config.service';
import { IServices } from './interface/iservices';
import { Events } from '../model/events.model';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardService implements IServices {

  private refresh = new BehaviorSubject({});
  refresh$ = this.refresh.asObservable();
  constructor(private http: HttpClient, private appconfig: AppConfigService) { }

  doRefresh() {
    this.refresh.next({ refresh: true });
  }
  stopRefresh() {
    this.refresh.next({ refresh: false });
  }

  getClientEventFeed(params: {
    latitude: number;
    longitude: number;
    radius: number;
    eventType: string[];
    skip: number;
    limit: number;
    userCode: string;
  }): Observable<ApiResponse<{ results: Events[]; total: number}>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.dashboard.getClientEventFeed,
      params)
    .pipe(
      tap(_ => this.log('event')),
      catchError(this.handleError('event', []))
    );
  }

  getClientHelpFeed(params: {
    latitude: number;
    longitude: number;
    radius: number;
    helpType: string[];
    skip: number;
    limit: number;
    userCode: string;
  }): Observable<ApiResponse<{ results: Events[]; total: number}>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.dashboard.getClientHelpFeed,
      params)
    .pipe(
      tap(_ => this.log('event')),
      catchError(this.handleError('event', []))
    );
  }

  handleError<T>(operation: string, result?: T) {
    return (error: any): Observable<T> => {
      this.log(`${operation} failed: ${Array.isArray(error.error.message) ? error.error.message[0] : error.error.message}`);
      return of(error.error as T);
    };
  }
  log(message: string) {
    console.log(message);
  }
}
