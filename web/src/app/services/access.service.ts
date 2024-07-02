import { Injectable } from '@angular/core';
import { Access } from '../model/access.model';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../model/api-response.model';
import { AppConfigService } from './app-config.service';
import { IServices } from './interface/iservices';

@Injectable({
  providedIn: 'root'
})
export class AccessService implements IServices {

  constructor(private http: HttpClient, private appconfig: AppConfigService) { }

  getByAdvanceSearch(params:{
    order: any,
    columnDef: { apiNotation: string; filter: string }[],
    pageSize: number,
    pageIndex: number
  }): Observable<ApiResponse<{ results: Access[], total: number}>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.access.getByAdvanceSearch,
      params)
    .pipe(
      tap(_ => this.log('access')),
      catchError(this.handleError('access', []))
    );
  }

  getByCode(accessCode: string): Observable<ApiResponse<Access>> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.access.getByCode + accessCode)
    .pipe(
      tap(_ => this.log('access')),
      catchError(this.handleError('access', []))
    );
  }

  create(data: any): Observable<ApiResponse<Access>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.access.create, data)
    .pipe(
      tap(_ => this.log('access')),
      catchError(this.handleError('access', []))
    );
  }

  update(accessCode: string, data: any): Observable<ApiResponse<Access>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.access.update + accessCode, data)
    .pipe(
      tap(_ => this.log('access')),
      catchError(this.handleError('access', []))
    );
  }

  delete(accessCode: string): Observable<ApiResponse<Access>> {
    return this.http.delete<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.access.delete + accessCode)
    .pipe(
      tap(_ => this.log('access')),
      catchError(this.handleError('access', []))
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
