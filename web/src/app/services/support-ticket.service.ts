import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../model/api-response.model';
import { AppConfigService } from './app-config.service';
import { IServices } from './interface/iservices';
import { SupportTicket, SupportTicketMessage } from '../model/support-ticket.model';

@Injectable({
  providedIn: 'root'
})
export class SupportTicketService implements IServices {

  constructor(private http: HttpClient, private appconfig: AppConfigService) { }

  getByAdvanceSearch(params:{
    order: any,
    columnDef: { apiNotation: string; filter: string; type?: string }[],
    pageSize: number,
    pageIndex: number
  }): Observable<ApiResponse<{ results: SupportTicket[], total: number}>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.supportTicket.getByAdvanceSearch,
      params)
    .pipe(
      tap(_ => this.log('support-ticket')),
      catchError(this.handleError('support-ticket', []))
    );
  }

  getByCode(supportTicketCode: string): Observable<ApiResponse<SupportTicket>> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.supportTicket.getByCode + supportTicketCode)
    .pipe(
      tap(_ => this.log('support-ticket')),
      catchError(this.handleError('support-ticket', []))
    );
  }


  create(data: any): Observable<ApiResponse<SupportTicket>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.supportTicket.create, data)
    .pipe(
      tap(_ => this.log('support-ticket')),
      catchError(this.handleError('support-ticket', []))
    );
  }

  update(id: string, data: any): Observable<ApiResponse<SupportTicket>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.supportTicket.update + id, data)
    .pipe(
      tap(_ => this.log('support-ticket')),
      catchError(this.handleError('support-ticket', []))
    );
  }

  updateStatus(id: string, data: any): Observable<ApiResponse<SupportTicket>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.supportTicket.updateStatus + id, data)
    .pipe(
      tap(_ => this.log('support-ticket')),
      catchError(this.handleError('support-ticket', []))
    );
  }

  getMessageByAdvanceSearch(params:{
    order: any,
    columnDef: { apiNotation: string; filter: string; type?: string }[],
    pageSize: number,
    pageIndex: number
  }): Observable<ApiResponse<{ results: SupportTicketMessage[], total: number}>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.supportTicket.getMessageByAdvanceSearch,
      params)
    .pipe(
      tap(_ => this.log('support-ticket-message')),
      catchError(this.handleError('support-ticket-message', []))
    );
  }

  postMessage(data: any): Observable<ApiResponse<SupportTicketMessage>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.supportTicket.postMessage, data)
    .pipe(
      tap(_ => this.log('support-ticket')),
      catchError(this.handleError('support-ticket-message', []))
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
