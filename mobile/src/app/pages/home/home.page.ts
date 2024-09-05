import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { DeviceInfo } from '@capacitor/device';
import { Style } from '@capacitor/status-bar';
import { Users } from 'src/app/model/users';
import { StatusBarService } from 'src/app/services/status-bar.service';
import { StorageService } from 'src/app/services/storage.service';
import { DashboardService } from '../../services/dashboard.service';
import { AlertController, IonRefresher, ModalController } from '@ionic/angular';
import { AnimationService } from 'src/app/services/animation.service';
import { LocationPickerComponent } from 'src/app/shared/location-picker/location-picker.component';
import { GeoLocationService } from 'src/app/services/geo-location.service';
import { Events } from 'src/app/model/events.model';
import { getEventCardDefaultImage, getPersonDefaultImage } from 'src/app/shared/utility/utility';
import { Subject, takeUntil, catchError, Observable, of, Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { EventDetailsComponent } from 'src/app/shared/event-details/event-details.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit, AfterViewInit {
  private routerSubscription: Subscription;
  isSearchModalOpen = false;
  currentUser: Users;
  searchKey;
  isSearching = false;
  @ViewChild(IonRefresher)ionRefresher: IonRefresher;
  currentLocation: {latitude: number;longitude: number};
  currentLocationName;
  allDisplayedEvents: { help: Events[]; nonHelpEvents: Events[]}= {
    help: [],
    nonHelpEvents: []
  }

  searchResults: Events[] = [];
  searchResultsTotal = 0;
  searchResultsPageIndex = 0;
  searchResultsPageSize = 10;
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(
    private router: Router,
    private statusBarService: StatusBarService,
    private storageService: StorageService,
    private modalCtrl: ModalController,
    private animationService: AnimationService,
    private dashboardService: DashboardService,
    private geoLocationService: GeoLocationService,
    private alertController: AlertController,
  ) {
    this.currentUser = this.storageService.getLoginProfile();

    this.dashboardService.refresh$.subscribe((res: { refresh: boolean })=> {
      if(!res.refresh) {
        if(this.ionRefresher) {
          this.ionRefresher.complete();
        }
      }
    })
    this.dashboardService.logAllDisplayedEvents$.subscribe((res: { help: Events[]; nonHelpEvents: Events[]})=> {
      if(res.help) {
        this.allDisplayedEvents.help = res.help;
      }
      if(res.nonHelpEvents) {
        this.allDisplayedEvents.nonHelpEvents = res.nonHelpEvents;
      }
    })
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // This code runs whenever the router has completed a navigation
        console.log('Navigation has changed to:', event.urlAfterRedirects);
        // Your logic here
        this.isSearchModalOpen = false;
      }
    });
  }

  ngOnInit() {
    this.statusBarService.overLay(false);
    this.statusBarService.show(true);
    this.statusBarService.modifyStatusBar(Style.Light, '#ffffff');
    this.searchResultsTotal = 0;
    this.searchResultsPageIndex = 0;
    this.searchResultsPageSize = 10;
    this.searchResults = [];
  }

  ngOnDestroy(): void {
    // It's important to unsubscribe to prevent memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
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

  async openEvent(eventCode) {
    let modal: HTMLIonModalElement = null;
    modal = await this.modalCtrl.create({
      component: EventDetailsComponent,
      cssClass: 'modal-fullscreen',
      backdropDismiss: false,
      canDismiss: true,
      enterAnimation: this.animationService.pushLeftAnimation,
      leaveAnimation: this.animationService.leavePushLeftAnimation,
      componentProps: { modal, eventCode },
    });
    modal.present();
    this.statusBarService.show();
    this.statusBarService.modifyStatusBar(Style.Dark, '#311B92');
    modal.onDidDismiss().then(res=> {
      this.statusBarService.modifyStatusBar(Style.Light, '#ffffff');
    });
  }

  onSearchInput(event: any) {
    const searchValue = event.target.value;
    console.log('Search input changed:', searchValue);
    if(searchValue && searchValue !== '') {
      this.searchResultsTotal = 0;
      this.searchResultsPageIndex = 0;
      this.searchResultsPageSize = 10;
      this.initSearchResults(true, true);
    }
  }

  async loadMore() {
    this.searchResultsPageIndex = this.searchResultsPageIndex + 1;
    await this.initSearchResults();
  }

  async initSearchResults(showProgress = false, clear = false) {
    try {
      if(clear) {
        this.searchResults = [];
      }
      this.isSearching = showProgress;
      this.dashboardService.getClientEventFeed({
        keyword: this.searchKey,
        latitude: this.currentLocation.latitude,
        longitude: this.currentLocation.longitude,
        radius: 40000,
        eventType: ["DONATION", "CHARITY", "VOLUNTEER", "ASSISTANCE"],
        skip: this.searchResultsPageIndex * this.searchResultsPageSize,
        limit: this.searchResultsPageSize,
        userCode: this.currentUser?.userCode
      }).pipe(
        takeUntil(this.ngUnsubscribe),
        catchError(this.handleError('dashboard', []))
      ).subscribe((res: {
          data: {
            results: Events[];
            total: number;
        };
          message: any;
          success: boolean;
        })=> {
          for (var event of res.data.results) {
            if(!this.searchResults.some(x=> x.eventId === event.eventId)) {
              this.searchResults.push(event);
            }
          }
          this.searchResultsTotal = res.data.total;
          this.isSearching = false;
      }, async (error)=> {
        this.isSearching = false;
        await this.presentAlert({
          header: 'Try again!',
          message: Array.isArray(error.message) ? error.message[0] : error.message,
          buttons: ['OK']
        });
      })
    } catch(ex) {
      this.isSearching = false;
      await this.presentAlert({
        header: 'Try again!',
        message: Array.isArray(ex.message) ? ex.message[0] : ex.message,
        buttons: ['OK']
      });
    }
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

  imageErrorHandler(event, type) {
    event.target.src = getEventCardDefaultImage(type);
  }

  profilePicErrorHandler(event) {
    event.target.src = getPersonDefaultImage(null);
  }

  handleError<T>(operation = 'operation', result?: any) {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    return (error: any): Observable<any> => {
      return of(error.error as any);
    };
  }

  async presentAlert(options: any) {
    const alert = await this.alertController.create(options);
    await alert.present();
  }
}
