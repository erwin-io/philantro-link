/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable max-len */
/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @angular-eslint/no-output-on-prefix */
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { GoogleMap, MapDirectionsRenderer, MapDirectionsService } from '@angular/google-maps';
// import { Spinkit, SpinnerVisibilityService } from 'ng-http-loader';
import { AppConfigService } from 'src/app/services/app-config.service';
import { GeoLocationService } from 'src/app/services/geo-location.service';
import { StorageService } from 'src/app/services/storage.service';
import { getDistance } from '../utility/utility';
import { BackgroundGeolocationService } from 'src/app/services/background-geolocation.service';
import { Capacitor } from '@capacitor/core';
import { StatusBar } from '@capacitor/status-bar';
import { Users } from 'src/app/model/users';
import { Icon } from 'ionicons/dist/types/components/icon/icon';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-map-box',
  templateUrl: './map-box.component.html',
  styleUrls: ['./map-box.component.scss']
})
export class MapBoxComponent {
  @ViewChild(GoogleMap) googleMap: GoogleMap;
  directionsRenderer = new google.maps.DirectionsRenderer({
    polylineOptions: {
      strokeWeight: 10,
      strokeColor: "#536DFE",
      strokeOpacity: 0.9,
    }
  });
  center: google.maps.LatLngLiteral = { lat: 24, lng: 12 };
  zoom = 15;

  loading = false;
  isRouteLoading = false;
  loadingMyLocation = false;

  private loadingMyLocationSubject = new BehaviorSubject({});
  loadingMyLocation$ = this.loadingMyLocationSubject.asObservable();

  private loadingSubject = new BehaviorSubject({});
  loading$ = this.loadingSubject.asObservable();

  @Output() get map(): google.maps.Map {
    return this.googleMap ? this.googleMap.googleMap : null;
  }

  @Output() fare = 0;
  @Output() get distance() {
    return this.directionsRoute && this.directionsRoute?.legs[0] && this.directionsRoute?.legs[0].distance?.text;
  };

  @Output() onLocationChanges = new EventEmitter<google.maps.LatLng | google.maps.LatLngLiteral>()
  @Output() onMapBoundInitialized = new EventEmitter<google.maps.LatLngBounds>()
  @Output() markerStartDragEnd = new EventEmitter()
  @Output() markerEndDragEnd = new EventEmitter()
  @Output() infoWindowStartClick = new EventEmitter()
  @Output() infoWindowEndClick = new EventEmitter()
  @Output() onMapCenterChanges = new EventEmitter<google.maps.LatLngLiteral>()

  options: google.maps.MapOptions = {
    disableDefaultUI: true,
    zoom: this.zoom,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: new google.maps.LatLng({ lat: 16.962720, lng: 120.603509})
    // gestureHandling: "cooperative",
  }

  geolocationPosition: GeolocationPosition | {
    coords: {
      latitude?: number;
      longitude?: number;
      heading?: number;
    }
} = {
   coords: {
    latitude: 16.962720,
    longitude: 120.603509,
   }
};

  marker: google.maps.Marker[] = [];

  myLocationMarker: {
    me: google.maps.Marker;
    circle: google.maps.Circle;
  } = {} as any;

  locationPinMarker: google.maps.Marker;

  info: {
    start?: google.maps.InfoWindow;
    end?: google.maps.InfoWindow;
  } = {};

  directionsRoute: google.maps.DirectionsRoute;
  mapLoaded = false;

  private markerClicked = new BehaviorSubject({});
  markerClicked$ = this.markerClicked.asObservable();
  constructor(
    private mapDirectionsService: MapDirectionsService,
    private geoLocationService: GeoLocationService,
    private appConfg: AppConfigService,
    private storageService: StorageService
  ) {
    // this.spinner.show();

    this.geoLocationService.data$.subscribe((pos: any) => {
      if(pos && pos.coords && pos.coords.latitude && pos.coords.longitude) {
        this.geolocationPosition = pos;
        this.loadingMyLocation = false;
        this.loadingMyLocationSubject.next(this.loadingMyLocation);
        this.center = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        this.onLocationChanges.emit(this.center);
        if(this.mapLoaded) {
          this.initMyLocationMarker();
        }
      }
    });
    this.getMyLocation();

  }

  ngOnInit(): void {
    // this.spinner.show();

    // this.geoLocationService.getCurrentPosition().then(res=> {
    //   this.geolocationPosition = res;
    //   this.center = { lat: this.geolocationPosition?.coords?.latitude, lng: this.geolocationPosition?.coords?.longitude };
    //   this.setCenter(this.center);
    // });

  }

  setCenter(latlng: google.maps.LatLngLiteral) {
    this.googleMap.googleMap.setCenter(latlng);
  }

  async getMyLocation() {
    this.loadingMyLocation = true;
    this.loadingMyLocationSubject.next(this.loadingMyLocation);
    const pos = await this.geoLocationService.getCurrentPosition();
    this.geolocationPosition = pos;
    if(this.mapLoaded && pos.coords && pos.coords?.latitude && pos.coords?.longitude) {
      this.center = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      const distance = getDistance(this.center, this.googleMap.googleMap.getCenter());
      if(this.center && distance > 1000) {
        this.initMyLocationMarker();
        this.onLocationChanges.emit(this.center);
      }

      this.loadingMyLocation = false;
      this.loadingMyLocationSubject.next(this.loadingMyLocation);
    }
  }

  ngAfterViewInit(): void {
    // this.spinner.show();
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    // this.playRider();

    const profile = this.storageService.getLoginProfile();
    if(this.googleMap?.googleMap) {
      const geolocationPosition = { coords: (profile as Users).currentLocation as any };
      if(geolocationPosition && geolocationPosition?.coords && geolocationPosition?.coords?.latitude && geolocationPosition?.coords?.longitude) {
        this.geolocationPosition = geolocationPosition;
      }
      if(this.geolocationPosition && this.geolocationPosition?.coords && this.geolocationPosition?.coords?.latitude && this.geolocationPosition?.coords?.longitude) {
        this.center = { lat: this.geolocationPosition?.coords?.latitude, lng: this.geolocationPosition?.coords?.longitude };
        this.setCenter(this.center);
      }
      this.initMyLocationMarker();

      // Add a listener for the center_changed event
      this.googleMap.googleMap.addListener('center_changed', () => {
        // Get the map's new center
        const newCenter = this.googleMap.getCenter();

        this.onMapCenterChanges.emit({
          lat: newCenter.lat(),
          lng: newCenter.lng(),
        });
        if(this.locationPinMarker) {
          this.locationPinMarker.setPosition(newCenter);
        }
        // Update the marker's position to the new center
      });
    }
  }

  showPinMarker() {
    if(!this.locationPinMarker) {
      this.locationPinMarker = new google.maps.Marker({
        zIndex: 99,
        map: this.googleMap.googleMap,
        position: this.googleMap.googleMap.getCenter(),
        icon: {
          scaledSize: new google.maps.Size(70, 70),
          url: "../../../assets/img/pin-location.png"
        },
      });
    }
  }

  onMapInitialized() {
    // this.spinner.show();
    google.maps.event.trigger(this.map, 'resize');
    setTimeout(()=> {
      // this.spinner.hide();
      this.mapLoaded = true;
      this.initMyLocationMarker();
    }, 1000)
  }

  initMyLocationMarker(opts?: { icon?: string | { scaledSize?: google.maps.Size, url: string, rotation?: number }, zIndex?: number}) {
    let iconUrl = "", animate = false, showCircle = false;
    iconUrl = "../../../assets/img/map-current-location-marker.png";
    if(this.googleMap?.googleMap && !this.myLocationMarker?.me) {
      this.myLocationMarker.me = new google.maps.Marker({
        zIndex: 1,
        animation: animate ? google.maps.Animation.BOUNCE : null,
        map: this.googleMap.googleMap,
        icon: opts && opts.icon ? opts.icon : {
          scaledSize: new google.maps.Size(50, 50),
          url: iconUrl
        },
      });
    } else if(this.googleMap?.googleMap && this.myLocationMarker.me) {
      this.myLocationMarker.me.setMap(this.googleMap?.googleMap);
      this.myLocationMarker.me.setPosition(this.center);
      this.myLocationMarker.me.setZIndex(1);
      this.myLocationMarker.me.setIcon(opts && opts.icon ? opts.icon : {
        scaledSize: new google.maps.Size(50, 50),
        url: iconUrl
      })
    }
    // if(this.googleMap?.googleMap && this.myLocationMarker.me && !this.myLocationMarker.circle) {
    //   this.myLocationMarker.circle = new google.maps.Circle({
    //     strokeColor: '#0000FF',
    //     strokeOpacity: 0.5,
    //     strokeWeight: 2,
    //     fillColor: '#0000FF',
    //     fillOpacity: 0.2,
    //     map: this.googleMap?.googleMap,
    //     center: this.myLocationMarker.me.getPosition(),
    //     radius: 100 // Specify the radius in meters
    //   });
    //   this.myLocationMarker.circle.bindTo('center', this.myLocationMarker.me, 'position');
    // } else if(this.googleMap?.googleMap && this.myLocationMarker.me) {
    //   this.myLocationMarker.circle.bindTo('center', this.myLocationMarker.me, 'position');
    // } else if(this.myLocationMarker.circle) {
    //   this.myLocationMarker.circle.setVisible(false);
    // }
    if(this.googleMap?.googleMap && this.myLocationMarker?.me) {

      window.addEventListener('deviceorientation', (event) => {
        const heading = event.alpha; // Get the device's current heading
        if (!isNaN(Number(event.alpha?.toString()))) {
          const icon = this.myLocationMarker.me.getIcon() as {
            scaledSize?: google.maps.Size;
            size?: google.maps.Size;
            url: string;
        };
          this.myLocationMarker.me.setIcon({
            rotation: heading,
            scaledSize: new google.maps.Size(50, 50),
            url: icon.url
          });
        }
      });

    }

  }

  async focusToMyLocation() {
    if(this.myLocationMarker && this.myLocationMarker.me && this.myLocationMarker.me.getMap() && this.myLocationMarker.me.getPosition()) {
      const pos = this.myLocationMarker.me.getPosition();
      this.geolocationPosition = {
         coords: { latitude: pos.lat(), longitude: pos.lng() },
      };
    } else {
      const pos = await this.geoLocationService.getCurrentPosition();
      this.geolocationPosition = pos;
    }
    if(this.geolocationPosition?.coords?.latitude && this.geolocationPosition?.coords?.longitude) {
      this.center = { lat: this.geolocationPosition?.coords?.latitude, lng: this.geolocationPosition?.coords?.longitude };
      var latlng = new google.maps.LatLng(this.geolocationPosition.coords.latitude, this.geolocationPosition.coords.longitude);
      this.myLocationMarker.me.setPosition(latlng);
      this.setCenter(this.center);
      this.googleMap.googleMap.setZoom(15);
    }
  }

  public setMarker( position: google.maps.LatLng | google.maps.LatLngLiteral, clickable = false, icon = {
    scaledSize: new google.maps.Size(30, 30),
    url: "../../../assets/img/place-marker.png"
  }, data: any = null) {
    const marker = new google.maps.Marker({
      position,
      map: this.map,
      clickable,
      zIndex: 1,
      draggable: false,
      icon: {
        scaledSize: icon.scaledSize,
        url: icon.url
      },
    });
    this.marker.push(marker);
    if(clickable) {
      marker.addListener('click', (e) => {
        this.markerClicked.next({ data});
      })
    }
  }

  public clearMarker() {
    for (let i = 0; i < this.marker.length; i++) {
      this.marker[i].setMap(null);
      this.marker.splice(i);
    }
    this.marker = [];

  }
}
