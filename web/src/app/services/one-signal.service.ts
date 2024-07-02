import { Injectable } from '@angular/core';
import { OneSignal } from 'onesignal-ngx';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Users } from '../model/users';

@Injectable({
  providedIn: 'root'
})
export class OneSignalService {

  private data = new BehaviorSubject({});
  data$ = this.data.asObservable();

  constructor(private oneSignal: OneSignal) {
   }

  async init(profile: Users) {
    await this.oneSignal.init({
      appId: environment.oneSignalAppId,
    });
    if(!environment.production) {
      this.oneSignal.Notifications.requestPermission();
    }
    console.log("PushSubscription.permission ", this.oneSignal.Notifications?.permission);
    console.log("PushSubscription.token ", this.oneSignal.User?.PushSubscription?.token);
    await this.oneSignal.User.addTag("Access", profile?.access.accessCode);
    // await this.oneSignal.User.addTag("Position", this.profile?.employee?.employeePosition?.name);
    await this.oneSignal.login(profile?.userName);
    this.oneSignal.Notifications.addEventListener("foregroundWillDisplay", (e)=> {
      console.log("Notif in forground");
      console.log(e);
      this.notifChanged(e);
    })
  }
  notifChanged(data: any) {
    this.data.next(data)
  }

}
