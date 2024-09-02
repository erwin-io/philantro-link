import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { ActionSheetController, AlertController, ModalController, Platform, ToastController } from '@ionic/angular';
import { AlertOptions } from '@ionic/core';
import { Events } from 'src/app/model/events.model';
import { Users } from 'src/app/model/users';
import { EventsService } from 'src/app/services/events.service';
import { StorageService } from 'src/app/services/storage.service';
import { DonateFormComponent } from '../donate-form/donate-form.component';
import { AnimationService } from 'src/app/services/animation.service';
import { EVENT_DONATION_THUMBNAIL, EVENT_HELP_THUMBNAIL, EVENT_THUMBNAIL } from '../constant/image.constant';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { base64ToBlob, isBase64, isBlob, readAsBase64 } from '../utility/utility';
import { FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { LocationPickerComponent } from '../location-picker/location-picker.component';
import { EventTypePickerComponent } from '../event-type-picker/event-type-picker.component';
import { ApiResponse } from 'src/app/model/api-response.model';
import { Files } from 'src/app/model/files';
import { PageLoaderService } from 'src/app/services/page-loader.service';
import { GeoLocationService } from 'src/app/services/geo-location.service';

@Component({
  selector: 'app-create-event-form',
  templateUrl: './create-event-form.component.html',
  styleUrls: ['./create-event-form.component.scss'],
})
export class CreateEventFormComponent implements OnInit {
  eventCode;
  modal: HTMLIonModalElement;
  event: Events;
  isLoading = false;
  isSubmitting = false;
  showError = false;
  currentViewImage;
  currentUser: Users;
  eventThumbnails: Files[] = [];
  eventDonationThumbnails: Files[] = [];
  eventHelpThumbnails: Files[] = [];
  openedPic: Files = this.eventThumbnails[0];
  eventType: "CHARITY" | "VOLUNTEER" | "DONATION" | "ASSISTANCE";
  dateTime = new FormControl(moment().format("MMM DD YYYY h:mm A"));
  eventName = new FormControl(null, [Validators.required]);
  eventDesc = new FormControl(null, [Validators.required]);
  eventLocName = new FormControl(null, [Validators.required]);
  eventLocMap = new FormControl(null, [Validators.required]);
  eventAssistanceItems = new FormControl([], [Validators.required]);
  transferType = new FormControl("WALLET");
  transferAccountNumber = new FormControl(null, [Validators.required]);
  transferAccountName = new FormControl(null, [Validators.required]);
  donationTargetAmount = new FormControl(null, [Validators.required]);
  
  datePreferedStart = new Date().toISOString();
  constructor(
    private pageLoaderService: PageLoaderService,
    private cd: ChangeDetectorRef,
    private platform: Platform,
    private eventsService: EventsService,
    private storageService: StorageService,
    private animationService: AnimationService,
    private alertController: AlertController,
    private modalCtrl: ModalController,
    private geoLocationService: GeoLocationService,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController
  ) {
    this.currentUser = this.storageService.getLoginProfile();
    const currentLocation = this.storageService.getCurrentLocation();
    this.eventLocMap.setValue({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    });
    this.geoLocationService.getLocationName(Number(currentLocation.coords.latitude), Number(currentLocation.coords.longitude))
    .then(res=> {
      this.eventLocName.setValue(res);
    })
    this.eventThumbnails = EVENT_THUMBNAIL.map((x,i)=> {
      return {
        fileId: i.toString(),
        url: x,
        new: true
      } as any
    });
    this.eventDonationThumbnails = EVENT_DONATION_THUMBNAIL.map((x,i)=> {
      return {
        fileId: i.toString(),
        url: x,
        new: true
      } as any
    });
    this.eventHelpThumbnails = EVENT_HELP_THUMBNAIL.map((x,i)=> {
      return {
        fileId: i.toString(),
        url: x,
        new: true
      } as any
    });
   }

  ngOnInit() {
    this.showEventTypePicker();
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
  }

  async showEventTypePicker() {
    let modal: HTMLIonModalElement = null;
    modal = await this.modalCtrl.create({
      component: EventTypePickerComponent,
      cssClass: 'modal-fullscreen',
      backdropDismiss: false,
      canDismiss: true,
      enterAnimation: this.animationService.pushLeftAnimation,
      leaveAnimation: this.animationService.leavePushLeftAnimation,
      componentProps: { 
        modal,
        eventType: this.eventType
       },
    });
    modal.present();
    modal.onWillDismiss().then((res)=> {
      if(res?.data && res?.data !== '') {
        this.eventType = res?.data;
        if(this.eventType.toString() !== "DONATION") {
          this.transferAccountNumber = new FormControl(null, [Validators.required]);
          this.transferAccountName = new FormControl(null, [Validators.required]);
          this.donationTargetAmount = new FormControl(null, [Validators.required]);
        } if(this.eventType.toString() !== "ASSISTANCE") {
          this.eventAssistanceItems = new FormControl([], [Validators.required]);
        }
      } if(!res?.data || res?.data === '') {
        this.modal.dismiss();
      }
    });
  }

  get isFormValid () {
    let _isValid = false;
    if(this.eventType === "CHARITY" || this.eventType === "VOLUNTEER") {
      _isValid = this.eventType && (this.eventName.valid) &&
      (this.eventDesc.valid) &&
      (this.dateTime.valid) &&
      (this.eventLocName.valid) &&
      (this.eventLocMap.valid);
    } else if(this.eventType === "DONATION") {
      _isValid = this.eventType && (this.eventName.valid) &&
      (this.eventDesc.valid) &&
      (this.dateTime.valid) &&
      (this.eventLocName.valid) &&
      (this.eventLocMap.valid) &&
      (this.transferType.valid) &&
      (this.transferAccountName.valid) &&
      (this.transferAccountNumber.valid) &&
      (this.donationTargetAmount.valid);
    } else if(this.eventType === "ASSISTANCE") {
      _isValid = this.eventType && (this.eventName.valid) &&
      (this.eventDesc.valid) &&
      (this.dateTime.valid) &&
      (this.eventLocName.valid) &&
      (this.eventLocMap.valid) &&
      (this.eventAssistanceItems.valid);
    }
    return _isValid;
  }

  get formValue () {
    let _form;
    if(this.eventType === "CHARITY" || this.eventType === "VOLUNTEER") {
      _form = {
        eventType: this.eventType,
        eventName: this.eventName.value,
        eventDesc: this.eventDesc.value,
        dateTime: moment(this.dateTime.value).format("YYYY-MM-DD HH:mm:ss"),
        eventLocName: this.eventLocName.value,
        eventLocMap: this.eventLocMap.value,
        userCode: this.currentUser?.userCode,
        eventImages: this.eventThumbnails.filter(x=>x.fileName && x.fileName !== null).map(x=> {
          return {
            new: true,
            data: isBase64(x.url) ? x.url : x.url.toString().split(',')[1],
            fileName: x.fileName
          }
        })
      }
    } else if(this.eventType === "DONATION") {
      _form = {
        eventName: this.eventName.value,
        eventDesc: this.eventDesc.value,
        dateTime: moment(this.dateTime.value).format("YYYY-MM-DD HH:mm:ss"),
        eventLocName: this.eventLocName.value,
        eventLocMap: this.eventLocMap.value,
        transferType: this.transferType.value,
        transferAccountName: this.transferAccountName.value,
        transferAccountNumber: this.transferAccountNumber.value,
        donationTargetAmount: this.donationTargetAmount.value,
        userCode: this.currentUser?.userCode,
        eventImages: this.eventDonationThumbnails.filter(x=>x.fileName && x.fileName !== null).map(x=> {
          return {
            new: true,
            data: isBase64(x.url) ? x.url : x.url.toString().split(',')[1],
            fileName: x.fileName
          }
        })
      }
    } else if(this.eventType === "ASSISTANCE") {
      _form = {
        eventName: this.eventName.value,
        eventDesc: this.eventDesc.value,
        dateTime: moment(this.dateTime.value).format("YYYY-MM-DD HH:mm:ss"),
        eventLocName: this.eventLocName.value,
        eventLocMap: this.eventLocMap.value,
        eventAssistanceItems: this.eventAssistanceItems.value,
        userCode: this.currentUser?.userCode,
        eventImages: this.eventHelpThumbnails.filter(x=>x.fileName && x.fileName !== null).map(x=> {
          return {
            new: true,
            data: isBase64(x.url) ? x.url : x.url.toString().split(',')[1],
            fileName: x.fileName
          }
        })
      }
    }
    return _form;
  }

  async showDatePicker() {
    let modal: HTMLIonModalElement = null;
    modal = await this.modalCtrl.create({
      component: DatePickerComponent,
      cssClass: 'modal-fullscreen',
      backdropDismiss: false,
      canDismiss: true,
      enterAnimation: this.animationService.pushLeftAnimation,
      leaveAnimation: this.animationService.leavePushLeftAnimation,
      componentProps: { 
        modal
       },
    });
    modal.present();
    modal.onDidDismiss().then(res=> {
      if(res?.data) {
        this.dateTime.setValue(moment(res.data).format("MMM DD YYYY h:mm A"));
        this.dateTime.markAsDirty();
        this.dateTime.markAsTouched();
      }
    });
  }

  async showLocationPicker() {
    let modal: HTMLIonModalElement = null;
    modal = await this.modalCtrl.create({
      component: LocationPickerComponent,
      cssClass: 'modal-fullscreen',
      backdropDismiss: false,
      canDismiss: true,
      enterAnimation: this.animationService.pushLeftAnimation,
      leaveAnimation: this.animationService.leavePushLeftAnimation,
      componentProps: { 
        modal,
        location: this.eventLocMap.value
       },
    });
    modal.present();
    modal.onDidDismiss().then((res: { data: { location: {
      latitude: string;
      longitude: string;
    }; locationName;}, role})=> {
      if(res?.data && res?.role === "ok") {
        this.eventLocMap.setValue(res.data.location);
        this.eventLocMap.markAsDirty();
        this.eventLocMap.markAsTouched();
        this.eventLocName.setValue(res.data.locationName);
        this.eventLocName.markAsDirty();
        this.eventLocName.markAsTouched();
      }
    });
  }

  isAssistanceItemSelected(helpType) {
    const items: string[] = this.eventAssistanceItems.value;
    return items.some(x=> x.toString().toLowerCase() === helpType.toString().toLowerCase());
  }

  selectAssistanceItem(helpType) {
    let items: string[] = this.eventAssistanceItems.value
    if(!this.isAssistanceItemSelected(helpType)) {
      items.push(helpType);
    } else {
      items = items.filter(x=> x.toString().toLowerCase() !== helpType.toString().toLowerCase());
    }
    this.eventAssistanceItems.setValue(items);
    this.eventAssistanceItems.markAsDirty();
    this.eventAssistanceItems.markAsTouched();
  }
  
  async onSave() {
    
    try {
      const actionSheet = await this.actionSheetController.create({
        header: "Do you want to proceed with saving this event?",
        subHeader: "By continuing, you agree to our Terms of Service and Privacy Policy",
        buttons: [
          {
            text: "Yes, save it",
            handler: async () => {
              try {
                await this.pageLoaderService.open('Please wait...');
                this.isSubmitting = true;
                this.isLoading = true;
                let res: ApiResponse<Events>;
                const formValue = this.formValue
                if(this.eventType === "CHARITY" || this.eventType === "VOLUNTEER") {
                  res = await this.eventsService.createCharityVolunteerEvent(formValue).toPromise();
                } else if(this.eventType === "DONATION") {
                  res = await this.eventsService.createDonationEvent(formValue).toPromise();
          
                } else if(this.eventType === "ASSISTANCE") {
                  res = await this.eventsService.createAssistanceEvent(formValue).toPromise();
                }
                await this.pageLoaderService.close();
                this.isSubmitting = false;
                if(res.success && res.data) {
                  this.presentAlert({
                    header: 'Success!',
                    backdropDismiss: false,
                    message: `
                    ${this.eventType === "CHARITY" ? 'Charity event ' : ''}
                    ${this.eventType === "VOLUNTEER" ? 'Volunteer event ' : ''}
                    ${this.eventType === "DONATION" ? 'Donation event ' : ''}
                    ${this.eventType === "ASSISTANCE" ? 'Help request ' : ''} saved successfully!`,
                    buttons: [{
                      text: 'OK',
                      handler: ()=> {
                        this.modal.dismiss(res.data, "ok");
                      }
                    }]
                  });
                } else {
                  this.presentAlert({
                    header: 'Try again!',
                    message: Array.isArray(res.message) ? res.message[0] : res.message,
                    buttons: ['OK']
                  });
                }
              } catch(ex) {
                this.isSubmitting = false;
                this.isLoading = false;
                this.presentAlert({
                  header: 'Try again!',
                  message: Array.isArray(ex.message) ? ex.message[0] : ex.message,
                  buttons: ['OK']
                });
              }
            },
          },
          {
            text: 'Cancel',
            cssClass: 'close dismiss cancel',
            handler: async () => {
              actionSheet.dismiss();
            },
          },
        ],
      });
      actionSheet.present();
    } catch (e) {
      this.isSubmitting = false;
      this.isLoading = false;
      this.presentAlert({
        header: 'Try again!',
        message: Array.isArray(e.message) ? e.message[0] : e.message,
        buttons: ['OK']
      });
    }
  }

  close() {
    this.modal.dismiss();
  }

  async presentAlert(options: AlertOptions) {
    const alert = await this.alertController.create(options);
    await alert.present();
  }

}