import { Component } from '@angular/core';
import { city } from 'src/models';
import {  AppSettings } from '../../services';


@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent {
  public citiesData : city[] = AppSettings.citiesData;
  public searchedBy : string = "";

  constructor(
  ) { }

  getWeatherForecast(event : Event){
    const serarchQuery = (event.target as HTMLInputElement).value;
    
    // this.citiesData.find((city : city)=> city[this.searchedBy] === serarchQuery );
  }

  

}
