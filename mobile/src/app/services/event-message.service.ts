import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../model/api-response.model';
import { AppConfigService } from './app-config.service';
import { EventMessage } from '../model/events.model';

@Injectable({
  providedIn: 'root'
})
export class EventMessageService {
  constructor(
    private http: HttpClient,
    private appconfig: AppConfigService) { }


  getByAdvanceSearch(params:{
    order: any,
    columnDef: { apiNotation: string; filter: string; type?: string }[],
    pageSize: number,
    pageIndex: number
  }): Observable<ApiResponse<{ results: EventMessage[], total: number}>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.eventMessage.getByAdvanceSearch,
      params)
    .pipe(
      tap(_ => this.log('event-message')),
      catchError(this.handleError('event-message', []))
    );
  }

  postMessage(data: any): Observable<ApiResponse<EventMessage>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.eventMessage.postMessage, data)
    .pipe(
      tap(_ => this.log('event-message')),
      catchError(this.handleError('event-message-message', []))
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
