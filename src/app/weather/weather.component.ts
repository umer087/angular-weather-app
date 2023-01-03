import { Component, Inject } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { city } from 'src/models';
import { searchOptions } from 'src/models/related.enum';
import { OpenWeatherApiResponse } from 'src/services/open-weather-api/openweather-api.model';
import {  AppSettings, OpenWeatherApiService } from '../../services';


@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent {
  public citiesData : city[] = AppSettings.citiesData;
  public searchedBy : string = searchOptions.zip_code;
  public destroy$   : Subject<boolean> = new Subject<boolean>();
  constructor(
      private openWeatherService  :OpenWeatherApiService
  ) { }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  getWeatherForecast(event : Event){
    const serarchQuery = (event.target as HTMLInputElement).value;
    
    const selectedCity = this.citiesData.find((city : city)=> city.city.includes(serarchQuery) );
    console.log("selectedCity",selectedCity);
    
    selectedCity && this.openWeatherService.getWeatherForecast(selectedCity.latitude,selectedCity.longitude)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response : OpenWeatherApiResponse)=>{
        console.log(response);
      });
  }

}
