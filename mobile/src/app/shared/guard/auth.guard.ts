
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, catchError, filter, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  // sessionTimeout;
  constructor(
    private router: Router,
    private storageService: StorageService,
    private authService: AuthService,
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const url: string = state.url;

    return this.checkLogin(url);
  }

  checkLogin(url: string) {
    const user = this.storageService.getLoginProfile();
    // const token = this.getRefreshToken(user.userId, refresh_token);

    if (!user) {
      this.authService.redirectUrl = url;
      // this.authService.logout();
      this.router.navigate(['/landing-page'], { replaceUrl: true });
      return false;
    }
    return true;
  }
}
