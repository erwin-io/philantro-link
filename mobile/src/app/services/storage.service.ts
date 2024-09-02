import { Injectable } from '@angular/core';
import { Users } from '../model/users';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }


  getLoginProfile(): Users {
    let res: any = this.get('loginProfile');
    if(JSON.parse(res) !== null && res !== ''){
      const profile: Users = JSON.parse(res);
      if(!profile) {
        return null;
      }
      return profile;
    }
    else {return null;}
  }
  saveLoginProfile(value: Users){
    return this.set('loginProfile', JSON.stringify(value));
  }
  getAccessToken(){
    return this.get('accessToken');
  }
  saveAccessToken(value: any){
    return this.set('accessToken', value);
  }
  getOneSignalSubscriptionId(){
    return this.get('oneSignalSubscriptionId');
  }
  saveOneSignalSubscriptionId(value: any){
    return this.set('oneSignalSubscriptionId', value);
  }
  getFirebaseToken(){
    return this.get('firebaseToken');
  }
  saveFirebaseToken(value: any){
    return this.set('firebaseToken', value);
  }
  getRefreshToken(){
    return this.get('refreshToken');
  }
  saveRefreshToken(value: any){
    return this.set('refreshToken', value);
  }
  getTotalUnreadNotif(){
    return this.get('totalUnreadNotif');
  }
  saveTotalUnreadNotif(value: any){
    return this.set('totalUnreadNotif', value);
  }
  getSessionExpiredDate(){
    return this.get('sessionExpiredDate');
  }
  saveSessionExpiredDate(value: any){
    return this.set('sessionExpiredDate', value);
  }
  getReceivedNotification(): any[] {
    const receivedNotification = this.get('receivedNotification');
    if(receivedNotification !== null && receivedNotification !== ''){
      return JSON.parse(receivedNotification);
    }
    else {return null;}
  }
  saveReceivedNotification(value: any){
    return this.set('receivedNotification', JSON.stringify(value));
  }
  getCurrentLocation(): GeolocationPosition {
    const currentLocation = this.get('currentLocation');
    if(currentLocation !== null && currentLocation !== ''){
      const data: GeolocationPosition = JSON.parse(currentLocation);
      return data;
    }
    else {return null;}
  }
  saveCurrentLocation(value: any){
    return this.set('currentLocation', JSON.stringify(value));
  }
  private set(key: string, value: any){
    localStorage.setItem(key, value);
  }
  private get(key: string){
    return localStorage.getItem(key);
  }
}
