/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { IServices } from './interface/iservices';
import { StorageService } from './storage.service';
import { Geolocation, Position } from '@capacitor/geolocation';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeoLocationService implements IServices {
  private data = new BehaviorSubject({});
  geocoder = new google.maps.Geocoder();
  data$ = this.data.asObservable();
  private locationPickerData = new BehaviorSubject({});
  locationPickerData$ = this.locationPickerData.asObservable();
  tempPosition = {timestamp:1720652526525,coords:{accuracy:466752.6180911824,latitude:10.319657864375076 ,longitude:123.97007521394602,altitude:null,altitudeAccuracy:null,heading:null,speed:null}};
  constructor(private storageService: StorageService) {
  }

  async getCurrentPosition() {
    // return this.tempPosition; PLEASE COMMENT WHEN USING PRODUCTION
     return await Geolocation.getCurrentPosition({
      timeout: 4000,
      enableHighAccuracy: true,
      maximumAge: 3600
    });
  }

  async startWatchingPosition() {
    const options: PositionOptions = {
      enableHighAccuracy: true, // Set to true for better accuracy (if available)
      timeout: 1000, // Maximum time to wait for a position (in milliseconds)
    };

    try {
      const watchId = await Geolocation.watchPosition(options, (position) => {
        // position = this.tempPosition; PLEASE COMMENT WHEN USING PRODUCTION
        if(position && position?.coords && position?.coords?.latitude && position?.coords?.longitude) {
          console.log('New position:', position.coords.latitude, position.coords.longitude);
          this.data.next(position);
          this.storageService.saveCurrentLocation(position);
          // Handle the updated position here (e.g., update a map marker)
        }
      });

      console.log('Watch ID:', watchId); // Save this ID if you want to clear the watch later
    } catch (error) {
      console.error('Error watching position:', error);
    }
  }

  async setLocationPicker(location: {
    latitude: number,
    longitude: number,
  }) {
    this.locationPickerData.next(location);
  }

  async getLocationName(
    lat: number,
    lng: number) {
    return this.geocoder.geocode({ location: {
      lat,
      lng,
    }}).then(res=> {
      return res.results && res.results.length > 0 ? res.results[0]?.formatted_address : null;
    })
  }

  handleError<T>(operation: string, result?: T) {
    throw new Error('Method not implemented.');
  }
  log(message: string) {
    throw new Error('Method not implemented.');
  }
}
