import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../model/api-response.model';
import { AppConfigService } from './app-config.service';
import { IServices } from './interface/iservices';
import { Users } from '../model/users';

@Injectable({
  providedIn: 'root'
})
export class UserService implements IServices {

  constructor(private http: HttpClient, private appconfig: AppConfigService) { }

  getUsersByAdvanceSearch(params:{
    order: any,
    columnDef: { apiNotation: string; filter: string }[],
    pageSize: number,
    pageIndex: number
  }): Observable<ApiResponse<{ results: Users[], total: number}>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.user.getUsersByAdvanceSearch,
      params)
    .pipe(
      tap(_ => this.log('user')),
      catchError(this.handleError('user', []))
    );
  }

  getByCode(userCode: string): Observable<ApiResponse<Users>> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.user.getByCode + userCode + "/details")
    .pipe(
      tap(_ => this.log('user')),
      catchError(this.handleError('user', []))
    );
  }

  createClientUser(data: any): Observable<ApiResponse<Users>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.user.createClientUser, data)
    .pipe(
      tap(_ => this.log('user')),
      catchError(this.handleError('user', []))
    );
  }

  createAdminUser(data: any): Observable<ApiResponse<Users>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.user.createAdminUser, data)
    .pipe(
      tap(_ => this.log('user')),
      catchError(this.handleError('user', []))
    );
  }

  createTenantUsers(data: any): Observable<ApiResponse<Users>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.auth.registerClient, data)
    .pipe(
      tap(_ => this.log('user')),
      catchError(this.handleError('user', []))
    );
  }

  updateAdminProfile(userCode: string, data: any): Observable<ApiResponse<Users>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.user.updateAdminProfile + userCode, data)
    .pipe(
      tap(_ => this.log('user')),
      catchError(this.handleError('user', []))
    );
  }

  updateClientUser(id: string, data: any): Observable<ApiResponse<Users>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.user.updateClientUser + id, data)
    .pipe(
      tap(_ => this.log('user')),
      catchError(this.handleError('user', []))
    );
  }

  updateAdminUser(id: string, data: any): Observable<ApiResponse<Users>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.user.updateAdminUser + id, data)
    .pipe(
      tap(_ => this.log('user')),
      catchError(this.handleError('user', []))
    );
  }

  updateUserPassword(userCode: string, data: any): Observable<ApiResponse<Users>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.user.updateUserPassword + userCode , data)
    .pipe(
      tap(_ => this.log('user')),
      catchError(this.handleError('user', []))
    );
  }

  profileResetPassword(userCode: string, data: any): Observable<ApiResponse<Users>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.user.profileResetPassword + userCode , data)
    .pipe(
      tap(_ => this.log('user')),
      catchError(this.handleError('user', []))
    );
  }

  delete(userCode): Observable<ApiResponse<Users>> {
    return this.http.delete<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.user.delete + userCode)
    .pipe(
      tap(_ => this.log('user')),
      catchError(this.handleError('user', []))
    );
  }

  approveAccessRequest(data: any): Observable<ApiResponse<Users>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.user.approveAccessRequest + "approveAccessRequest", data)
    .pipe(
      tap(_ => this.log('user')),
      catchError(this.handleError('user', []))
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
