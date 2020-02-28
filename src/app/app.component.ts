import {Component, ViewChild, ElementRef, OnInit, AfterViewInit} from '@angular/core';
import {environment} from '../environments/environment';
import {PlacesService} from './places.service';
import { finalize, map } from 'rxjs/operators';


declare var H: any

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'limefront';
  ui: any;
  public mapPlatform: any;
  public mapPlaces: any[];
  constructor(public places: PlacesService) {
    this.mapPlatform = new H.service.Platform({
      'apikey': environment.hereMapApiSecret
    });
  }
  @ViewChild("map",  {static: false})

  public mapElement: ElementRef;

  public munichPoint = { 'lat': environment.defaultCenterLat, 'lng': environment.defaultCenterLng}

  public ngOnInit() {

  }

  public ngAfterViewInit() {
    this.places.getAccomodationPlaces().pipe(
      finalize(() => {
        this.addMap()
      })
    ).subscribe((data: any) => {
      if(data.results) {
        this.mapPlaces = data.results.items
      }
    })



  }

  public addMap() {
    // Generate Map
    let defaultLayers = this.mapPlatform.createDefaultLayers();
    let map = new H.Map(
      this.mapElement.nativeElement,
      defaultLayers.vector.normal.map,
      {
        zoom: 14,
        center: { lat: this.munichPoint.lat, lng: this.munichPoint.lng }
      }
    );
    this.ui = H.ui.UI.createDefault(map, defaultLayers)

    // position Ui controls
    const mapSetting  = this.ui.getControl('mapsettings');
    const zoomSetting  = this.ui.getControl('zoom');
    mapSetting.setAlignment('top-left');
    zoomSetting.setAlignment('top-left');

    // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
    const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

    this.addAccommodationMarkers(map)

    map.addEventListener('resize', function() {
      map.getViewPort().resize();
    })
  }

  public addAccommodationMarkers(map: any) {
    /** Add markers to map  **/
    const svgIcon = new H.map.Icon("assets/icons/home-address.svg", {size: {w: 32, h: 32}});
    this.mapPlaces.forEach((place) => {
      const marker =  new H.map.Marker({lat: place.position[0], lng: place.position[1]},
              { icon : svgIcon}
          );
      marker.addEventListener('pointerenter', () => {

      })
      map.addObject(marker);
    })

  }


}

