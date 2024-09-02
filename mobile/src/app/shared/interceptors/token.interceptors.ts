import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, filter, switchMap, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AlertController, AlertOptions, ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment.prod';
import { StorageService } from 'src/app/services/storage.service';
import { AuthService } from 'src/app/services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private refreshRequest = 0;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  private hiddenURLKeyword = ['g.payx.ph'];
  constructor(
    private router: Router,
    public toastController: ToastController,
    private storageService: StorageService,
    private authService: AuthService,
    private alertController: AlertController,
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    if(this.hiddenURLKeyword.filter(x=>request.url.includes(x)).length <= 0) {
      const token = this.storageService.getAccessToken();

      if (token) {
        request = this.addTokenHeader(request, token);
      }

      request = request.clone({
        headers: request.headers.set('Accept', 'application/json'),
      });
      if (!request.headers.has('Content-Type')) {
        request = request.clone({
          setHeaders: {
            'content-type': 'application/json',
          },
        });
      }
      return next.handle(request).pipe(
        catchError((error) => {
          if (
            error instanceof HttpErrorResponse &&
            !request.url.includes('auth/signin') &&
            error.status === 401
          ) {
            return this.handle401Error(request, next);
          }
          return throwError(error);
        })
      );
    }else {
      return next.handle(request).pipe(catchError((error) => throwError(error)));
    }
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    this.refreshTokenSubject.next(null);
    const refreshToken = this.storageService.getRefreshToken();
    const user = this.storageService.getLoginProfile();
    if (
      refreshToken ||
      refreshToken === undefined ||
      refreshToken !== 'null'
    ) {
      if(this.refreshRequest > 1) {
          this.handleLogout();
          return next.handle(request);
      }
      this.refreshRequest = this.refreshRequest + 1;
      return this.authService
      .refreshToken({ userId: user.userId, refresh_token: refreshToken })
      .pipe(
        switchMap((token: any) => {
          this.refreshRequest = 0;
          this.storageService.saveAccessToken(token.accessToken);
          this.storageService.saveRefreshToken(token.refreshToken);
          this.refreshTokenSubject.next(token.accessToken);

          return next.handle(
            this.addTokenHeader(request, token.accessToken)
          );
        }),
        catchError((error) => {
          return throwError(error);
        }),
      );
    } else {
      this.handleLogout();
      return null;
    }
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    request = request.clone({
      setHeaders: {
        Authorization: 'Bearer ' + token,
      },
    });
    return request;
  }

  private async handleLogout() {
    // await this.presentToast('Session expired');
    await this.presentAlert({
      header: 'Session expired!',
      buttons: ['OK']
    });
    this.authService.logout();
  }

  private async presentAlert(options: AlertOptions) {
    const alert = await this.alertController.create(options);
    await alert.present();
  }
}
