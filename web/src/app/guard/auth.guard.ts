import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private storageService: StorageService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      let canActivate = false;
    const profile = this.storageService.getLoginProfile();
    if(!profile) {
      this.router.navigate(['auth']);
    }
    if(!profile.access) {
      this.router.navigate(['auth']);
    }

    if(next.data["title"] && !["home","map", "dashboard"].some(x=>x === next.data["title"].toLowerCase()) &&
    (profile.access && !profile.access.accessPages.some(x=>x.page.trim().toUpperCase() === next.data["title"].trim().toUpperCase() && x.view === true))) {
      this.router.navigate(['no-access'], {
        state: {
          "no-access-url": state.url,
          "no-access-page": next.data["title"]
        }
      });
    }
    if(profile && profile.accessGranted) {
      canActivate = true;
    }
    if(canActivate && next.data && next.data["title"]) {
      next.data = {
        ...next.data,
        access: profile.access && profile.access.accessPages.find(x=>x.page.trim().toUpperCase() === next.data["title"].toString().toUpperCase())
      };
    }
    return canActivate;
  }

}
