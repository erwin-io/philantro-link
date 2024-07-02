import { Component, ViewChild } from '@angular/core';
import * as ApexCharts from 'apexcharts';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {  Moment } from 'moment';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject, catchError, forkJoin, of, takeUntil } from 'rxjs';
import { DashboardService } from 'src/app/services/dashboard.service';
import { GeoLocationService } from 'src/app/services/geo-location.service';
import { MapBoxComponent } from 'src/app/shared/map-box/map-box.component';
import { StorageService } from 'src/app/services/storage.service';
import { MatTableDataSource } from '@angular/material/table';
import { EventsTableColumn } from 'src/app/shared/utility/table';
import { ApiResponse } from 'src/app/model/api-response.model';
import { Events } from 'src/app/model/events.model';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { Router } from '@angular/router';
import { EVENT_STATUS } from 'src/app/constant/events.constant';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  host: {
    class: 'page-component',
  },
})
export class DashboardComponent {
  isLoading = false;
  isLoadingMap = false;
  showMap = true;
  totalClients = 0;
  totalEventsPending = 0;
  totalEventsRegistered = 0;
  totalSupportTicket = 0;
  error;
  @ViewChild(MapBoxComponent) mapBox: MapBoxComponent;
  geolocationPosition;
  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  eventStatusCtrl = new FormControl("ALL");

  constructor(
    private snackBar: MatSnackBar,
    private dashboardService: DashboardService,
    private geoLocationService: GeoLocationService,
    private storageService: StorageService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.geoLocationService.data$.subscribe((pos: GeolocationPosition)=> {
      if(pos && pos?.coords && pos?.coords?.latitude && pos?.coords?.longitude) {
        console.log("location changes", pos);
        this.storageService.saveCurrentLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
      }
    });
    this.eventStatusCtrl.valueChanges.subscribe(async res=> {
      console.log("eventStatusCtrl ", res);
      this.showMap = false;
      setTimeout(()=>{
        this.showMap = true;
      }, 500);
    })
  }

  async ngAfterViewInit(): Promise<void> {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.initDashboardUsers();
    let savedLocation = this.storageService.getCurrentLocation();
    if (
      savedLocation &&
      savedLocation.latitude &&
      savedLocation.longitude
    ) {
      this.mapBox.map.setCenter({
        lat: Number(savedLocation.latitude),
        lng: Number(savedLocation.longitude),
      });
    } else {
      const position = await this.geoLocationService.getCurrentPosition();
      console.log('getCurrentPosition ', position);
      if (
        position['coords'] &&
        position['coords']['latitude'] &&
        position['coords']['longitude']
      ) {
        this.storageService.saveCurrentLocation({latitude: position['coords']['latitude'], longitude: position['coords']['longitude']});
        this.mapBox.map.setCenter({
          lat: position['coords']['latitude'],
          lng: position['coords']['longitude'],
        });
      }
    }

    this.initEvents();
  }

  initDashboardUsers() {
    try {
      forkJoin([this.dashboardService.getDashboardSummary()]).subscribe(
        (res) => {
          const [dashboardSummary] = res;

          console.log('dashboardSummary ', dashboardSummary);
          this.isLoading = false;

          this.totalClients = dashboardSummary.data.totalClients;
          this.totalEventsPending = dashboardSummary.data.totalEventsPending;
          this.totalEventsRegistered =
            dashboardSummary.data.totalEventsRegistered;
          this.totalSupportTicket = dashboardSummary.data.totalSupportTicket;
        },
        (error) => {
          this.isLoading = false;
          this.error = Array.isArray(error?.error?.message)
            ? error?.error?.message[0]
            : error?.error?.message;
          this.snackBar.open(this.error, 'close', {
            panelClass: ['style-error'],
          });
        }
      );
    } catch (ex) {
      this.isLoading = false;
      this.error = Array.isArray(ex?.message) ? ex?.message[0] : ex?.message;
      this.snackBar.open(this.error, 'close', { panelClass: ['style-error'] });
    }
  }

  initEvents() {
    setTimeout(()=> {
      this.getEvents();
      this.mapBox.markerClicked$.subscribe((res:{ data: Events})=> {
        if(res.data) {
          const dialogData = new AlertDialogModel();
          dialogData.title = res.data.eventName;
          dialogData.message = res.data.eventType;
          dialogData.confirmButton = {
            visible: true,
            text: 'View details',
            color: 'primary',
          };
          dialogData.dismissButton = {
            visible: true,
            text: 'close',
          };
          const dialogRef = this.dialog.open(AlertDialogComponent, {
            maxWidth: '400px',
            closeOnNavigation: true,
          });
          dialogRef.componentInstance.alertDialogConfig = dialogData;


          dialogRef.componentInstance.conFirm.subscribe(async (data: any) => {
            dialogRef.close();
            this.router.navigate(['/events/' + res.data.eventCode + '/details']);
          });

        }
      });
    }, 1000);
    this.mapBox.map.addListener('dragend', ()=> {
      if(!this.isLoading) {
        this.getEvents();
      }
    });

    this.mapBox.map.addListener('zoom_changed', ()=> {
      if(!this.isLoading) {
        this.getEvents();
      }
    });
  }


  async getEvents(){
    try{
      this.isLoadingMap = true;
      console.log("markers ", this.mapBox.marker.length);
      this.mapBox.clearMarker();
      console.log("markers after removed ", this.mapBox.marker.length);
      const res = this.getDiameter();
      const center = this.mapBox.map.getCenter();
      const status = this.eventStatusCtrl.value;
      await this.dashboardService.getEventsByGeo({
        status,
        latitude: center.lat().toString(), longitude: center.lng().toString(), radius: res.radius.toString()
    }).pipe(
        takeUntil(this.ngUnsubscribe),
        catchError(this.handleError('event', []))
      )
      .subscribe(async (res: ApiResponse<Events[]>) => {
        setTimeout(()=> {
          this.isLoadingMap = false;
        }, 1000);
        if(res.success){
          console.log(res.data);
          for (var event of res.data) {
            this.mapBox.setMarker(
              {
                lat: Number(event.eventLocMap?.latitude),
                lng: Number(event.eventLocMap?.longitude),
              } as google.maps.LatLngLiteral,
              true,
              {
                scaledSize: new google.maps.Size(55, 55),
                url: event.eventStatus === EVENT_STATUS.PENDING ? "../../../../../assets/img/pin-location.png" : "../../../../../assets/img/event-pin-location.png"
              },
              event
            );
          }
          console.log("markers after loaded ", this.mapBox.marker.length);
        }
        else{
          this.error = Array.isArray(res.message) ? res.message[0] : res.message;
          this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
          this.isLoadingMap = false;
        }
      }, async (err) => {
        this.error = Array.isArray(err.message) ? err.message[0] : err.message;
        this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
        this.isLoadingMap = false;
      });
    }
    catch(e){
      this.error = Array.isArray(e.message) ? e.message[0] : e.message;
      this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
      this.isLoadingMap = false;
    }

  }

  getDiameter() {
    const center = this.mapBox.map.getCenter();
    const bounds = this.mapBox.map.getBounds();

    // Calculate the north-east and south-west corners of the map
    const northEast = bounds.getNorthEast();
    const southWest = bounds.getSouthWest();

    // Calculate the distance from the center to the north-east corner
    const radius = google.maps.geometry.spherical.computeDistanceBetween(center, northEast);

    // The diameter is twice the radius
    const diameter = 2 * radius;

    console.log(`Radius: ${radius} meters`);
    console.log(`Diameter: ${diameter} meters`);
    return {
      radius,
      diameter
    }
  }

  handleError<T>(operation = 'operation', result?: any) {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    return (error: any): Observable<any> => {
      return of(error.error as any);
    };
  }
}
