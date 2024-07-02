import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../model/api-response.model';
import { AppConfigService } from './app-config.service';
import { IServices } from './interface/iservices';
import { Events } from '../model/events.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService implements IServices {

  constructor(private http: HttpClient, private appconfig: AppConfigService) { }

  getDashboardSummary(): Observable<ApiResponse<{
    totalClients: number;
    totalEventsPending: number;
    totalEventsRegistered: number;
    totalSupportTicket: number;
}>> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.dashboard.getDashboardSummary)
    .pipe(
      tap(_ => this.log('dashboard')),
      catchError(this.handleError('dashboard', []))
    );
  }

  getEventsByGeo(params:{
    status?: string;
    latitude: string;
    longitude: string;
    radius: string;
  }): Observable<ApiResponse<Events[]>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.dashboard.getEventsByGeo,
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
