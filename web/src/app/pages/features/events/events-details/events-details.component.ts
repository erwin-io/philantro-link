import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { AppConfigService } from 'src/app/services/app-config.service';
import { StorageService } from 'src/app/services/storage.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { MyErrorStateMatcher } from 'src/app/shared/form-validation/error-state.matcher';
import { MatTableDataSource } from '@angular/material/table';
import { Users } from 'src/app/model/users';
import { AccessPages } from 'src/app/model/access.model';
import { Events } from 'src/app/model/events.model';
import { EventsService } from 'src/app/services/events.service';
import { ApiResponse } from 'src/app/model/api-response.model';
import { MapBoxComponent } from 'src/app/shared/map-box/map-box.component';
import { LoaderService } from 'src/app/services/loader.service';
import { getEventCardDefaultImage } from 'src/app/shared/utility/utility';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-events-details',
  templateUrl: './events-details.component.html',
  styleUrls: ['./events-details.component.scss'],
  host: {
    class: "page-component events"
  }
})
export class EventsDetailsComponent {
  currentUserProfile:Users;
  eventCode;
  isNew = false;
  isReadOnly = true;
  error;
  isLoading = true;

  mediaWatcher: Subscription;
  matcher = new MyErrorStateMatcher();
  isProcessing = false;
  isLoadingRoles = false;
  canAddEdit = false;

  event: Events;

  @ViewChild(MapBoxComponent, { static: true}) mapBox: MapBoxComponent;

  pageAccess: AccessPages = {
    view: true,
    modify: false,
  } as any;

  constructor(
    private eventService: EventsService,
    private loaderService: LoaderService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private appconfig: AppConfigService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    public router: Router,
    private formBuilder: FormBuilder
  ) {
    this.currentUserProfile = this.storageService.getLoginProfile();
    const { isNew, edit } = this.route.snapshot.data;
    this.isNew = isNew;
    this.eventCode = this.route.snapshot.paramMap.get('eventCode');
    this.isReadOnly = !edit && !isNew;
    if (this.route.snapshot.data) {
      this.pageAccess = {
        ...this.pageAccess,
        ...this.route.snapshot.data['access'],
      };
    }
  }

  get pageRights() {
    let rights = {};
    for(var right of this.pageAccess.rights) {
      rights[right] = this.pageAccess.modify;
    }
    return rights;
  }

  ngOnInit(): void {
  }

  async ngAfterViewInit() {
    // await Promise.all([
    // ])
    if(!this.isNew) {
      this.canAddEdit = !this.isReadOnly;
      this.initDetails();
    } else {
      this.canAddEdit = true;
      this.isLoading = false;
    }
  }

  initDetails() {
    this.isLoading = true;
    try {
      this.loaderService.show();
      this.eventService.getByCode(this.eventCode).subscribe(res=> {
        this.loaderService.hide();
        if (res.success) {
          this.event = res.data;
          this.isLoading = false;
          this.mapBox.setMarker({ lat: Number(this.event.eventLocMap?.latitude), lng: Number(this.event.eventLocMap?.longitude)} as google.maps.LatLngLiteral);
          this.mapBox.map.setOptions({...this.mapBox.options, draggable: false, zoomControl: false, scrollwheel: false, disableDoubleClickZoom: true});
          this.mapBox.map.setCenter({ lat: Number(this.event.eventLocMap?.latitude), lng: Number(this.event.eventLocMap?.longitude)} as google.maps.LatLngLiteral);
        } else {
          this.isLoading = false;
          this.error = Array.isArray(res.message) ? res.message[0] : res.message;
          this.snackBar.open(this.error, 'close', {
            panelClass: ['style-error'],
          });
          this.router.navigate(['/events/']);
        }
      });
    } catch(ex) {
      this.loaderService.hide();
      this.error = Array.isArray(ex.message) ? ex.message[0] : ex.message;
      this.snackBar.open(this.error, 'close', {
        panelClass: ['style-error'],
      });
      this.router.navigate(['/events/']);
      this.isLoading = false;
    }
  }

  updateStatus(status: "APPROVED" | "REJECTED") {
    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    if(status === "REJECTED") {
      dialogData.message = 'Are you sure you want to reject event?';
    } else {
      dialogData.message = 'Are you sure you want to approve event?';
    }
    dialogData.confirmButton = {
      visible: true,
      text: 'yes',
      color: 'primary',
    };
    dialogData.dismissButton = {
      visible: true,
      text: 'cancel',
    };
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      maxWidth: '400px',
      closeOnNavigation: true,
    });
    dialogRef.componentInstance.alertDialogConfig = dialogData;


    dialogRef.componentInstance.conFirm.subscribe(async (data: any) => {

    this.isProcessing = true;
    dialogRef.componentInstance.isProcessing = this.isProcessing;
    try {
      this.loaderService.show();
      let res = await this.eventService.updateStatus(this.eventCode, { status }).toPromise();
      this.loaderService.hide();
      if (res.success) {
        this.snackBar.open('Successfully updated!', 'close', {
          panelClass: ['style-success'],
        });
        this.router.navigate(['/events/' + this.eventCode + '/details']);
        this.isProcessing = false;
        dialogRef.componentInstance.isProcessing = this.isProcessing;
        await this.ngAfterViewInit();
        dialogRef.close();
        this.dialog.closeAll();
      } else {
        this.isProcessing = false;
        dialogRef.componentInstance.isProcessing = this.isProcessing;
        this.error = Array.isArray(res.message)
          ? res.message[0]
          : res.message;
        this.snackBar.open(this.error, 'close', {
          panelClass: ['style-error'],
        });
        dialogRef.close();
      }
    } catch (e) {
      this.loaderService.hide();
      this.isProcessing = false;
      dialogRef.componentInstance.isProcessing = this.isProcessing;
      this.error = Array.isArray(e.message) ? e.message[0] : e.message;
      this.snackBar.open(this.error, 'close', {
        panelClass: ['style-error'],
      });
      dialogRef.close();
    }
    });
  }
  
  getThumbnail(referenceId) {
    return `${environment.apiBaseUrl}/events/thumbnail/${referenceId}`;
  }

  onOpenMap() {
    window.open('https://www.google.com/maps/search/?api=1&query='+this.event?.eventLocMap?.latitude+','+this.event?.eventLocMap?.longitude, "_blank");
  }

  imageErrorHandler(event) {
    event.target.src = getEventCardDefaultImage(this.event?.eventType);
  }

}
