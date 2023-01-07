import { Component } from '@angular/core';
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
  constructor(
      private openWeatherService  :OpenWeatherApiService,
  ) {}

  public citiesData : city[] = AppSettings.citiesData;
  public citiesDataFiltered : city[] = AppSettings.citiesData.slice(0, 10);
  public searchedBy : string = "zip_code";
  public mockBarChartData : any = [];
  public weeklyWeatherData : any = [];
  public weatherApiData : any;
  public inputCity : string = "";
  public showCities : boolean = false;
  public destroy$   : Subject<boolean> = new Subject<boolean>();

  // bar chart start
  public barChartLabels : string[] = [];
  public showChart = false;
  public barChartData : any = [
    {data: [], label: 'Temperature'},
  ];

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  getWeatherForecast(event : Event){
    const serarchQuery = (event.target as HTMLInputElement).value;
    const selectedCity = this.citiesData.find((city : city)=> city.city.includes(serarchQuery) );
    
    selectedCity && this.openWeatherService.getWeatherForecast(selectedCity.latitude,selectedCity.longitude)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response : OpenWeatherApiResponse)=>{
        this.weatherApiData = response;
        this.parseBarChartData(response.list, response.city.timezone);
        this.parseWeeklyData(response);
        console.log(response);
      });
  }

  getReleventTimeZoneDate = (seconds :number,timeZoneDiff : number) => {
    const date = new Date(seconds*1000);
    const tzDifference = timeZoneDiff * 60 + date.getTimezoneOffset();
    return new Date(date.getTime() + tzDifference * 60 * 1000);
  }

  parseBarChartData(weatherData : any, timezone : number) {
    let previousDate : undefined | string;
    this.barChartLabels = [];
    this.barChartData[0].data = [];
    weatherData.some((weatherItem : any)=> {
      const itemDate = this.getReleventTimeZoneDate(weatherItem.dt,timezone);
      if(previousDate && previousDate !== itemDate.toDateString())
        return true;
      this.barChartLabels.push(this.getTimeOnly(itemDate));
      this.barChartData[0].data.push(weatherItem.main.temp);
      previousDate = itemDate.toDateString();
      return false;
    });
    this.showChart = true;
  }
  

  showBarChart(seconds : number,timezone :number){
    const itemDate = this.getReleventTimeZoneDate(seconds,timezone);
    const weatherData = this.weatherApiData.list;
    const weatherDataForDay = weatherData.filter((weatherItem : any)=>{
      itemDate == this.getReleventTimeZoneDate(weatherItem.dt,timezone);
    });
    this.parseBarChartData(weatherDataForDay,timezone);
  }

  parseWeeklyData(apiData: any) {
    const weatherData = apiData.list;
    let previousDate : undefined | string;
    let currentDayIndex :number = 0;
    weatherData.map((weatherItem : any) => {
      const itemDate = this.getReleventTimeZoneDate(weatherItem.dt,apiData.city.timezone);
      if(previousDate !== itemDate.toDateString())
      {
        if(previousDate)
          currentDayIndex++;
        previousDate = itemDate.toDateString();
        this.weeklyWeatherData[currentDayIndex] = weatherItem;
        return;
      }
      previousDate = itemDate.toDateString();
      if(this.getTimeOnly(itemDate) == "12:00")
        this.weeklyWeatherData[currentDayIndex] = weatherItem;      
    });
    
  }

  getTimeOnly(date : Date) : string {
    const addZero = ( simpleNumber : number) =>  simpleNumber < 10 ? `0${simpleNumber}` : simpleNumber;
    const h = addZero(date.getHours());
    const m = addZero(date.getMinutes());
    return h + ":" + m ;
  }

  closeCitiesDropDown(event : any){
    this.inputCity = "";
    this.hideCities();
  }

  selectCity(city : any){
    this.inputCity = city.city;
    this.hideCities();
  }

  filterCities() {
    console.log("this.citiesDataFiltered",this.citiesDataFiltered);
    
    this.citiesDataFiltered = this.citiesData.filter((city)=> 
      city.city.toLowerCase().includes(this.inputCity.toLowerCase())
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
