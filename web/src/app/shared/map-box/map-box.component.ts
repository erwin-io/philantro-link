import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { GoogleMap, MapDirectionsRenderer, MapDirectionsService } from '@angular/google-maps';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { AppConfigService } from 'src/app/services/app-config.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-map-box',
  templateUrl: './map-box.component.html',
  styleUrls: ['./map-box.component.scss'],
  host: {
    class: "map-component"
  }
})
export class MapBoxComponent {
  @ViewChild('googleMap', { static: false }) googleMap: GoogleMap; // Replace with actual selector
  directionsRenderer = new google.maps.DirectionsRenderer({
    polylineOptions: {
      strokeWeight: 20,
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

  options: google.maps.MapOptions = {
    disableDefaultUI: true,
    zoom: this.zoom,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    gestureHandling: "cooperative",
  }

  marker: google.maps.Marker[] = [];

  info: {
    start?: google.maps.InfoWindow;
    end?: google.maps.InfoWindow;
  } = {};

  directionsRoute: google.maps.DirectionsRoute;
  mapLoaded = false;

  private markerClicked = new BehaviorSubject({});
  markerClicked$ = this.markerClicked.asObservable();
  constructor() {

  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  onMapInitialized() {
    // this.spinner.show();
    google.maps.event.trigger(this.map, 'resize');
    console.log("map  ok");
  }

  public setMarker( position: google.maps.LatLng | google.maps.LatLngLiteral, clickable = false, icon = {
    scaledSize: new google.maps.Size(30, 30),
    url: "../../../../../assets/img/pin-location.png"
  }, data: any = null) {
    const marker = new google.maps.Marker({
      position,
      map: this.map,
      clickable,
      zIndex: 99,
      draggable: false,
      icon: {
        scaledSize: icon.scaledSize,
        url: icon.url
      },
    });
    this.marker.push(marker);
    if(clickable) {
      marker.addListener('click', (e) => {
        console.log("marker clicked! ", data);
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
