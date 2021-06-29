import { Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { MapsAPILoader } from '@agm/core';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { markedStateTrigger, showStateTrigger } from './animations';

var tzlookup = require("tz-lookup");
var moment = require('moment-timezone');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [markedStateTrigger, showStateTrigger]
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'locationApp';
  lat = 51.678418;
  lng = 7.809007;
  map: any;
  zoom = 10;
  mapClickListener: any;
  locationChosen: boolean = false;
 
  formattedAddress = '';
  time = new Date();
  localTime: any;

  timestamp: any;
  geoCoder: any;
  timezone: string;
  //latitude: 43.8075392//longitude: -79.233024//timestamp: 1624942575746

  marked: boolean = false;

  constructor(private zone: NgZone, private mapsAPILoader: MapsAPILoader) {}

  ngOnInit() {
    this.mapsAPILoader.load().then(()=>{
      this.findMe();
      this.geoCoder = new google.maps.Geocoder;
    })
    
  }

  //initial current location
  findMe() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.showPosition(position);
        this.timestamp = position.timestamp;
        
        console.log(position);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  //show current location
  showPosition(position: any) {
    this.lat = position.coords.latitude;
    this.lng = position.coords.longitude;
    this.timezone = tzlookup(this.lat, this.lng);
    console.log(this.timezone);
    this.localTime = moment.tz(this.timestamp, this.timezone).format();
    console.log(this.localTime);
    this.getAddress(this.lat, this.lng);
    let location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    this.map.panTo(location);
    console.log(location);
  }


  //handle the address input change
  public addressChange(address: Address) {
    this.formattedAddress = address.formatted_address;
    this.zoom = 12;
    this.lat = address.geometry.location.lat();
    this.lng = address.geometry.location.lng();
    this.getAddress(this.lat, this.lng);
    this.marked = !this.marked;
    this.timezone = tzlookup(this.lat, this.lng);
    console.log(this.timezone);
    this.localTime = moment.tz(this.timestamp, this.timezone).format();
    console.log(this.localTime);
    
    console.log(address);
    console.log(this.formattedAddress);
    console.log(this.lat);
    console.log(this.lng);

    
  }

  //get address via input frame
  getAddress(latitude:any, longitude:any) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results:any, status:any) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.formattedAddress = results[0].formatted_address;
          
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }

  //handle change via click
  public mapReadyHandler(map: google.maps.Map): void {
    this.map = map;
    this.mapClickListener = this.map.addListener('click', (e: google.maps.MouseEvent) => {
      this.zone.run(() => {
        // Here we can get correct event
        this.lat = e.latLng.lat();
        this.lng = e.latLng.lng();
        this.locationChosen = true;
        console.log(e.latLng.lat(), e.latLng.lng());

        this.getAddress(this.lat, this.lng);
        this.marked = !this.marked;
        this.timezone = tzlookup(this.lat, this.lng);
        console.log(this.timezone);
        this.localTime = moment.tz(this.timestamp, this.timezone).format();
        console.log(this.localTime);
      });
    });
  }
  
  
  ngOnDestroy(): void {
    if (this.mapClickListener) {
      this.mapClickListener.remove();
    }
  }
}
