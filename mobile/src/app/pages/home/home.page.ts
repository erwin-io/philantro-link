import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { DeviceInfo } from '@capacitor/device';
import { Style } from '@capacitor/status-bar';
import { Users } from 'src/app/model/users';
import { StatusBarService } from 'src/app/services/status-bar.service';
import { StorageService } from 'src/app/services/storage.service';
import { DashboardService } from '../../services/dashboard.service';
import { IonRefresher, ModalController } from '@ionic/angular';
import { AnimationService } from 'src/app/services/animation.service';
import { LocationPickerComponent } from 'src/app/shared/location-picker/location-picker.component';
import { GeoLocationService } from 'src/app/services/geo-location.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit, AfterViewInit {
  isSearchModalOpen = false;
  currentUser: Users;
  searchKey;
  @ViewChild(IonRefresher)ionRefresher: IonRefresher;
  currentLocation: {latitude: number;longitude: number};
  currentLocationName;
  constructor(private statusBarService: StatusBarService,
    private storageService: StorageService,
    private modalCtrl: ModalController,
    private animationService: AnimationService,
    private dashboardService: DashboardService,
    private geoLocationService: GeoLocationService,
  ) {
    this.currentUser = this.storageService.getLoginProfile();

    this.dashboardService.refresh$.subscribe((res: { refresh: boolean })=> {
      if(!res.refresh) {
        if(this.ionRefresher) {
          this.ionRefresher.complete();
        }
      }
    })
  }

  ngOnInit() {
    this.statusBarService.overLay(false);
    this.statusBarService.show(true);
    this.statusBarService.modifyStatusBar(Style.Light, '#ffffff');
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.

    this.geoLocationService.getCurrentPosition().then(res=> {
      this.currentLocation = { latitude: res?.coords?.latitude, longitude: res?.coords?.longitude };
      this.storageService.saveCurrentLocation(res)
      this.geoLocationService.getLocationName(Number(this.currentLocation.latitude), Number(this.currentLocation.longitude))
      .then(res=> {
        this.currentLocationName = res;
      });
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
        location: this.currentLocation
       },
    });
    this.statusBarService.show();
    this.statusBarService.modifyStatusBar(Style.Dark, '#311B92');
    modal.present();
    modal.onDidDismiss().then((res: { data: { location: {
      latitude: string;
      longitude: string;
    }; locationName;}, role})=> {
      this.statusBarService.modifyStatusBar(Style.Light, '#ffffff');
      if(res?.data && res?.role === "ok") {
        this.currentLocation = {
          latitude: Number(res?.data?.location?.latitude),
          longitude: Number(res?.data?.location?.longitude),
        };
        this.currentLocationName = res.data.locationName;
        this.geoLocationService.setLocationPicker({
          latitude: Number(res?.data?.location?.latitude),
          longitude: Number(res?.data?.location?.longitude),
        })
      }
    });
  }

  ionViewWillEnter(){
    this.statusBarService.overLay(false);
    this.statusBarService.show(true);
    this.statusBarService.modifyStatusBar(Style.Light, '#ffffff');
  }

  doRefresh() {
    this.dashboardService.doRefresh();
  }
}
