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
export class EventsService implements IServices {

  constructor(private http: HttpClient, private appconfig: AppConfigService) { }

  getByAdvanceSearch(params:{
    order: any,
    columnDef: { apiNotation: string; filter: string; type?: string }[],
    pageSize: number,
    pageIndex: number
  }): Observable<ApiResponse<{ results: Events[], total: number}>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.events.getByAdvanceSearch,
      params)
    .pipe(
      tap(_ => this.log('event')),
      catchError(this.handleError('event', []))
    );
  }

  getByCode(eventCode: string): Observable<ApiResponse<Events>> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.events.getByCode + eventCode)
    .pipe(
      tap(_ => this.log('event')),
      catchError(this.handleError('event', []))
    );
  }

  createCharityVolunteerEvent(data: any): Observable<ApiResponse<Events>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.events.createCharityVolunteerEvent, data)
    .pipe(
      tap(_ => this.log('event')),
      catchError(this.handleError('event', []))
    );
  }

  createDonationEvent(data: any): Observable<ApiResponse<Events>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.events.createDonationEvent, data)
    .pipe(
      tap(_ => this.log('event')),
      catchError(this.handleError('event', []))
    );
  }


  createAssistanceEvent(data: any): Observable<ApiResponse<Events>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.events.createAssistanceEvent, data)
    .pipe(
      tap(_ => this.log('event')),
      catchError(this.handleError('event', []))
    );
  }

  updateCharityVolunteerEvent(id: string, data: any): Observable<ApiResponse<Events>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.events.updateCharityVolunteerEvent + id, data)
    .pipe(
      tap(_ => this.log('event')),
      catchError(this.handleError('event', []))
    );
  }

  updateDonationEvent(id: string, data: any): Observable<ApiResponse<Events>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.events.updateDonationEvent + id, data)
    .pipe(
      tap(_ => this.log('event')),
      catchError(this.handleError('event', []))
    );
  }

  updateAssistanceEvent(id: string, data: any): Observable<ApiResponse<Events>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.events.updateAssistanceEvent + id, data)
    .pipe(
      tap(_ => this.log('event')),
      catchError(this.handleError('event', []))
    );
  }

  updateStatus(id: string, data: any): Observable<ApiResponse<Events>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.events.updateStatus + id, data)
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
