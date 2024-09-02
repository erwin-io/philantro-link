/* eslint-disable max-len */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../model/api-response.model';
import { AppConfigService } from './app-config.service';
import { IServices } from './interface/iservices';
import { Events } from '../model/events.model';
import { ModalController } from '@ionic/angular';
import { EventDetailsComponent } from '../shared/event-details/event-details.component';
import { AnimationService } from './animation.service';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventsService implements IServices {

  constructor(
    private http: HttpClient,
    private appconfig: AppConfigService) { }

  getByAdvanceSearch(params: {
    order: any;
    columnDef: { apiNotation: string; filter: string; type?: string }[];
    pageSize: number;
    pageIndex: number;
  }): Observable<ApiResponse<{ results: Events[]; total: number}>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.events.getByAdvanceSearch,
      params)
    .pipe(
      tap(_ => this.log('event')),
      catchError(this.handleError('event', []))
    );
  }

  getPageJoinedEvents(params: {
    order: any;
    userCode: string;
    pageSize: number;
    pageIndex: number;
  }): Observable<ApiResponse<{ results: Events[]; total: number}>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.events.getPageJoinedEvents,
      params)
    .pipe(
      tap(_ => this.log('event')),
      catchError(this.handleError('event', []))
    );
  }

  getPageInterestedEvents(params: {
    order: any;
    userCode: string;
    pageSize: number;
    pageIndex: number;
  }): Observable<ApiResponse<{ results: Events[]; total: number}>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.events.getPageInterestedEvents,
      params)
    .pipe(
      tap(_ => this.log('event')),
      catchError(this.handleError('event', []))
    );
  }

  getByCode(eventCode: string, currentUserCode = ''): Observable<ApiResponse<Events>> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.events.getByCode + eventCode + '?currentUserCode=' + currentUserCode)
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

  updateEventInterested(id: string, data: any): Observable<ApiResponse<Events>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.events.updateEventInterested + id, data)
    .pipe(
      tap(_ => this.log('event')),
      catchError(this.handleError('event', []))
    );
  }

  updateEventResponded(id: string, data: any): Observable<ApiResponse<Events>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.events.updateEventResponded + id, data)
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
