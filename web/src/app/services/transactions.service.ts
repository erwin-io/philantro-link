import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../model/api-response.model';
import { AppConfigService } from './app-config.service';
import { IServices } from './interface/iservices';
import { Transactions } from '../model/transactions.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService implements IServices {

  constructor(private http: HttpClient, private appconfig: AppConfigService) { }

  getByCode(transactionCode: string): Observable<ApiResponse<Transactions>> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.transactions.getByCode + transactionCode)
    .pipe(
      tap(_ => this.log('event')),
      catchError(this.handleError('event', []))
    );
  }

  getByAdvanceSearch(params:{
    order: any,
    columnDef: { apiNotation: string; filter: any; type: string }[],
    pageSize: number,
    pageIndex: number
  }): Observable<ApiResponse<{ results: Transactions[], total: number}>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.transactions.getByAdvanceSearch,
      params)
    .pipe(
      tap(_ => this.log('driver')),
      catchError(this.handleError('driver', []))
    );
  }

  getPaymentLink(id): Observable<ApiResponse<{
    id?: string;
    checkout_url?: string;
    payment_intent?: {
      id?: string;
      status?: string;
    };
    status?: string;
    paid?: boolean;
  }>> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.transactions.getPaymentLink + id)
    .pipe(
      tap(_ => this.log('wallet')),
      catchError(this.handleError('wallet', []))
    );
  }

  requestPaymentLink({amount, userId}): Observable<ApiResponse<{
    id?: string;
    checkout_url?: string;
    payment_intent?: {
      id?: string;
      status?: string;
    };
    status?: string;
    paid?: boolean;
  }>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.transactions.requestPaymentLink, {amount, userId})
    .pipe(
      tap(_ => this.log('wallet')),
      catchError(this.handleError('wallet', []))
    );
  }

  expirePaymentLink(id): Observable<ApiResponse<any>> {
    return this.http.delete<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.transactions.expirePaymentLink + id)
    .pipe(
      tap(_ => this.log('wallet')),
      catchError(this.handleError('wallet', []))
    );
  }

  comleteTopUpPayment(id): Observable<ApiResponse<any>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.transactions.comleteTopUpPayment + id, {})
    .pipe(
      tap(_ => this.log('wallet')),
      catchError(this.handleError('wallet', []))
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
