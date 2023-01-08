import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BarChartData, city, UnitsMeasurement } from 'src/app/models';
import { List, OpenWeatherApiResponse } from 'src/app/services/open-weather-api/openweather-api.model';

@Component({
  selector: 'app-weather-details',
  templateUrl: './weather-details.component.html',
  styleUrls: ['./weather-details.component.css']
})
export class WeatherDetailsComponent {
    public unitsMeasurement = UnitsMeasurement;
    public barChartLabels : string[] = [];
    public showChart = false;
    public barChartData : BarChartData[] = [
      {data: [], label: 'Temperature'},
    ];
    public weeklyWeatherData :List[] = [];
  
  @Input() selectedCity :city | null = null;
  @Input() temperatureUnit :string = UnitsMeasurement.imperial;
  @Input() weatherApiData : OpenWeatherApiResponse | undefined ;
  @Input() getWeatherForecast : (selectedCity : city,unit : any) => void = ()=> null;

  getReleventTimeZoneDate = (seconds :number,timeZoneDiff : number) => {
    const date = new Date(seconds*1000);
    const tzDifference = timeZoneDiff * 60 + date.getTimezoneOffset();
    return new Date(date.getTime() + tzDifference * 60 * 1000);
  }

  parseBarChartData(weatherData : List[], timezone : number) {
    let previousDate : undefined | string;
    this.barChartLabels = [];
    this.barChartData[0].data = [];    
    weatherData.some((weatherItem : List)=> {
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
    const weatherData = this.weatherApiData?.list;
    const weatherDataForDay = weatherData?.filter((weatherItem : List)=>{
      itemDate == this.getReleventTimeZoneDate(weatherItem.dt,timezone);
    });
    weatherDataForDay && this.parseBarChartData(weatherDataForDay,timezone);
  }

  parseWeeklyData = (apiData: OpenWeatherApiResponse) => {
    const weatherData = apiData.list;
    let previousDate : undefined | string;
    let currentDayIndex :number = 0;
    weatherData.map((weatherItem : List) => {
      const itemDate = this.getReleventTimeZoneDate(weatherItem.dt,apiData.city.timezone);
      if(previousDate !== itemDate.toDateString())
      {
        if(previousDate)
          currentDayIndex++;
        previousDate = itemDate.toDateString();
        weatherItem.weatherData = [];
        weatherItem.weatherData.push(weatherItem); 
        this.weeklyWeatherData[currentDayIndex] = weatherItem;
        return;
      }
      previousDate = itemDate.toDateString();
      this.weeklyWeatherData[currentDayIndex]?.weatherData.push(weatherItem);
      if(this.getTimeOnly(itemDate) == "12:00")
        this.weeklyWeatherData[currentDayIndex] = {weatherItem,...this.weeklyWeatherData[currentDayIndex]};   
    });    
  }

  getTimeOnly(date : Date) : string {
    const addZero = ( simpleNumber : number) =>  simpleNumber < 10 ? `0${simpleNumber}` : simpleNumber;
    const h = addZero(date.getHours());
    const m = addZero(date.getMinutes());
    return h + ":" + m ;
  }

}
