/* eslint-disable @angular-eslint/use-lifecycle-interface */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../model/api-response.model';
import { AppConfigService } from './app-config.service';
import { IServices } from './interface/iservices';
import { Users } from '../model/users';
import { Subject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService implements IServices {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private http: HttpClient, private appconfig: AppConfigService) { }


  async ngOnDestroy() {
    this.ngUnsubscribe.next();
    // This completes the subject properlly.
    this.ngUnsubscribe.complete();
  }

  getUsersByAdvanceSearch(params:{
    order: any,
    columnDef: { apiNotation: string; filter: string }[],
    pageSize: number,
    pageIndex: number
  }): Observable<ApiResponse<{ results: Users[], total: number}>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.users.getUsersByAdvanceSearch,
      params)
    .pipe(
      tap(_ => this.log('users')),
      catchError(this.handleError('users', []))
    );
  }
  getByCode(userCode: string): Observable<ApiResponse<Users>> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.users.getByCode + userCode + "/details")
    .pipe(
      tap(_ => this.log('users')),
      catchError(this.handleError('users', []))
    );
  }

  updateProfile(userCode: string, data: any): Observable<ApiResponse<Users>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.users.updateProfile + userCode, data)
    .pipe(
      tap(_ => this.log('users')),
      catchError(this.handleError('users', []))
    );
  }

  updateUsers(id: string, data: any): Observable<ApiResponse<Users>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.users.updateUsers + id, data)
    .pipe(
      tap(_ => this.log('users')),
      catchError(this.handleError('users', []))
    );
  }

  resetUserPassword(userCode: string, data: any): Observable<ApiResponse<Users>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.users.resetUserPassword + userCode + "/resetPassword", data)
    .pipe(
      tap(_ => this.log('users')),
      catchError(this.handleError('users', []))
    );
  }

  updateProfilePicture(userCode: string, data: any): Observable<ApiResponse<Users>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.users.updateProfilePicture + userCode, data)
    .pipe(
      tap(_ => this.log('users')),
      catchError(this.handleError('users', []))
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
