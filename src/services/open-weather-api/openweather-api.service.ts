import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

import { OpenWeatherApiResponse } from './openweather-api.model';
import { UnitsMeasurement } from '../../models/related.enum';

@Injectable({
  providedIn: 'root'
})

export class OpenWeatherApiService {

  private currentWeatherApiUrl = 'https://api.openweathermap.org/data/2.5/forecast?';
  constructor( private http: HttpClient) { }

  getWeatherForecast(lat: number, lon: number, units: UnitsMeasurement = UnitsMeasurement.imperial)
    : Observable<OpenWeatherApiResponse> {
    return this.http.get<OpenWeatherApiResponse>(`${this.currentWeatherApiUrl}lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=${units}&appid=${environment.openWeatherApiKey}`);
  }
}
