/* eslint-disable @angular-eslint/no-host-metadata-property */
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AnimationService } from 'src/app/services/animation.service';
import { MapBoxComponent } from '../map-box/map-box.component';
import { MapPoint } from 'src/app/model/map';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
  host: {
    class: "location-picker"
  }
})
export class LocationPickerComponent  implements OnInit {
  modal: HTMLIonModalElement;
  autocompleteService = new google.maps.places.AutocompleteService();
  geocoder = new google.maps.Geocoder();
  placesService: google.maps.places.PlacesService;
  placeResults: {description?: string; place_id: string; main_text?: string }[] = [];
  placeHolder = "Search places";
  searchKey = "";
  isSearching = false;
  mapEnable = false;
  location: MapPoint;
  locationName: string;
  @ViewChild(MapBoxComponent) mapBox: MapBoxComponent;
  constructor(
    private cd: ChangeDetectorRef,
    private modalCtrl: ModalController,
    private animationService: AnimationService) { }

  ngOnInit() {
    this.mapEnable = true;
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.placesService = new google.maps.places.PlacesService(this.mapBox.googleMap.googleMap);
    this.mapBox.showPinMarker();
    this.mapBox.onMapCenterChanges.subscribe(async res=> {
      this.location = {
        latitude: res.lat,
        longitude: res.lng,
      }
      this.geocoder.geocode({ location: {
        lat: Number(this.location?.latitude),
        lng: Number(this.location?.longitude),
      }}).then(res=> {
        this.locationName = res.results && res.results.length > 0 ? res.results[0]?.formatted_address : null;
        this.cd.detectChanges();
      })
    });

    if(this.location && this.location?.latitude && this.location?.longitude) {
      this.mapBox.center = {
        lat: Number(this.location?.latitude),
        lng: Number(this.location?.longitude),}
      this.mapBox.setCenter(this.mapBox.center);
    }
  }
  onSearchChange(event) {
  }

  getAddress(place: Object) {
    this.constructor = place['formatted_address'];
    var location = place['geometry']['location'];
    var lat = location.lat();
    var lng = location.lng();
  }

  ionViewWillEnter() {
    let elem = <HTMLInputElement>document.querySelector('.searchbar-input');
    elem.value = this.searchKey;
    elem.click();
    this.search(this.searchKey);
    elem.addEventListener('input', () => {
      const input = elem.value;
      this.search(input);
    });
    elem.addEventListener('click', () => {
      const input = elem.value;
      this.search(input);
    });
  }

  placeSearchSelected(location) {
    this.placeResults = [];
    this.searchKey = location.description;
    this.placesService.getDetails({ placeId: location.place_id }, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        // Get the coordinates
        this.mapBox.googleMap.googleMap.setCenter(place.geometry.location);
      }
    });
  }

  search(input) {
    // Perform autocomplete prediction request
    this.autocompleteService.getPlacePredictions(
      { input },
      (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          // Process the predictions (results)
          this.placeResults = predictions.map(r=> {
            return {
              description: r.description,
              place_id: r.place_id,
              main_text: r.structured_formatting.main_text
            }
          });
        } else {
          console.error(
            'Autocomplete prediction request failed with status:',
            status
          );
        }
      }
    );
  }
  
  onContinue() {
    this.modal.dismiss({
      location: this.location,
      locationName: this.locationName,
    }, "ok")
  }

}
