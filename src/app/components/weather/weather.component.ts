import { Component, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { city, UnitsMeasurement } from '../../models';
import { OpenWeatherApiResponse } from '../../services/open-weather-api/openweather-api.model';
import {  OpenWeatherApiService, CitiesApiService } from '../../services';
import { WeatherDetailsComponent } from '../weather-details/weather-details.component';


@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent {
  @ViewChild('weatherView') weatherView: WeatherDetailsComponent | undefined;
  
  constructor(
      private openWeatherService  : OpenWeatherApiService,
      private citiesService       : CitiesApiService
  ) {}

  public citiesData : city[] = [];
  public citiesDataFiltered : city[] = [];
  public selectedCity : city | null = null;
  public unitsMeasurement = UnitsMeasurement;
  public searchedBy : string = "zip_code";
  public temperatureUnit : string = UnitsMeasurement.imperial;
  public weatherApiData : OpenWeatherApiResponse | undefined;
  public inputCity : string  = "";
  public showCities : boolean = false;
  public destroy$   : Subject<boolean> = new Subject<boolean>();


  ngOnInit(){
    this.citiesService.getCities()
    .pipe(takeUntil(this.destroy$))
    .subscribe((response : city[])=>{
    this.citiesData = response;
    this.citiesDataFiltered = this.citiesData.slice(0, 10);
    
  });

  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  getWeatherForecast(selectedCity : city, unit : UnitsMeasurement | undefined = UnitsMeasurement.imperial){
    this.temperatureUnit = unit;
    this.selectedCity = selectedCity;
    selectedCity && this.openWeatherService.getWeatherForecast(selectedCity.latitude,selectedCity.longitude, unit)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response : OpenWeatherApiResponse)=>{
        this.weatherApiData = response;
        this.weatherView?.parseBarChartData(response.list, response.city.timezone);
        this.weatherView?.parseWeeklyData(response);
        console.log(response);
      });
  }

  

  closeCitiesDropDown(event : Event){
    this.hideCities();
  }

  selectCity(city : city){
    this.inputCity = city.city;
    this.hideCities();
    this.getWeatherForecast(city);
  }

  filterCities() {
    this.citiesDataFiltered = this.citiesData.filter((city :city)=> {
      if(this.searchedBy == 'city')
        return city.city.toLowerCase().includes(this.inputCity.toLowerCase());
      return city.zip_code.toString().includes(this.inputCity);
    }
    );
    this.citiesDataFiltered =  this.citiesDataFiltered.slice(0, 10);
  }

  showcities() {
    this.showCities = true;
  }

  hideCities() {
    this.showCities = false;
  }

}
