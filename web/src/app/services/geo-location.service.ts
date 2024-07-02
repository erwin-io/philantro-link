import { Injectable } from '@angular/core';
import { IServices } from './interface/iservices';
import { BehaviorSubject, Observable, timeInterval } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeoLocationService implements IServices {
  private data = new BehaviorSubject({});
  data$ = this.data.asObservable();
  constructor() {
    navigator.geolocation.watchPosition((pos: GeolocationPosition) => {
      this.data.next(pos);
    },
      () => {
        console.log('Position is not available');
      },
      {
        timeout: 4000,
        enableHighAccuracy: true,
      });
  }

  public getPosition(): Observable<GeolocationPosition> {
    return Observable.create((observer) => {
      navigator.geolocation.watchPosition((pos: GeolocationPosition) => {
        observer.next(pos);
        this.data.next(pos);
      }, ()=> {

      }, { timeout: 4000, enableHighAccuracy: true})
    });
  }

  public getCurrentPosition() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((pos: GeolocationPosition)=>{
        resolve(pos);
      }, (res)=>{
        reject(res);
      },{ enableHighAccuracy: true, timeout: 4000 })
    });
  }


  handleError<T>(operation: string, result?: T) {
    throw new Error('Method not implemented.');
  }
  log(message: string) {
    throw new Error('Method not implemented.');
  }
}
