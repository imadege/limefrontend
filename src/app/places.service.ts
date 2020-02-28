import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  places: Subject<any>[];

  constructor(public http: HttpClient) {
  }

  getAccomodationPlaces() {
    let url = environment.hereMapPLacesApi
    const distance = 5000
    const center = environment.defaultCenterLat + ',' + environment.defaultCenterLng + ';r=' + distance
    const params = {
      'apikey': environment.hereMapApiSecret,
      'in': center,
      'cat': 'accommodation'
    }

    return this.http.get(url, {params});
  }
}

/**
 * https://places.sit.ls.hereapi.com/places/v1/discover/explore
 ?apiKey={YOUR_API_KEY}
 &in=53.2711,-9.0541;r=150
 &cat=sights-museums
 &pretty
 * **/
