import { Injectable } from '@angular/core';
import { Device } from '@capacitor/device';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {


  private data = new BehaviorSubject({});
  data$ = this.data.asObservable();
  constructor() { }

  async init() {
    const deviceInfo = await Device.getInfo();
    this.data.next(deviceInfo);
  }

  async getInfo() {
    return await Device.getInfo();
  }
}
