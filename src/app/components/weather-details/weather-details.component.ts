import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UnitsMeasurement } from 'src/app/models';

@Component({
  selector: 'app-weather-details',
  templateUrl: './weather-details.component.html',
  styleUrls: ['./weather-details.component.css']
})
export class WeatherDetailsComponent {
  public unitsMeasurement = UnitsMeasurement;
  @Input() selectedCity :any = {};
  @Input() weeklyWeatherData :any = [];
  @Input() barChartData :any = [];
  @Input() barChartLabels :any = [];
  @Input() weatherApiData : any = {};
  @Input() showChart : boolean = false;
  // @Input() parseWeeklyData : () => void = ()=> null;
  @Input() getWeatherForecast : (selectedCity : any,unit : any) => void = ()=> null;
  @Input() parseBarChartData : (weatherData : any,timezone: any) => void = ()=> null;
  // @Output("parseBarChartData") parseBarChartData : EventEmitter<any> = new EventEmitter();

  // getBarChartData(weatherData: any,timezone: any) {
  //   this.parseBarChartData(weatherData,timezone);
  // }

  // getWeeklyWeather() {
  //   this.parseWeeklyData()
  // }
}
