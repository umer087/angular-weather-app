import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'

import { NgChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WeatherComponent } from './components/weather/weather.component';
import { HeaderComponent } from './components/header/header.component';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { WeatherDetailsComponent } from './components/weather-details/weather-details.component';
import { MapsComponent } from './components/weather-details/maps/maps.component';

@NgModule({
  declarations: [
    AppComponent,
    WeatherComponent,
    HeaderComponent,
    BarChartComponent,
    ClickOutsideDirective,
    WeatherDetailsComponent,
    MapsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgChartsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
