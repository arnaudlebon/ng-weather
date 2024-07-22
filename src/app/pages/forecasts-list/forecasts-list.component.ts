import { Component } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Forecast} from '../../interfaces/forecast.type';
import { WeatherFacadeService } from 'app/services/weather/weather-facade.service';

@Component({
  selector: 'app-forecasts-list',
  templateUrl: './forecasts-list.component.html',
  styleUrls: ['./forecasts-list.component.css']
})
export class ForecastsListComponent {

  zipcode: string;
  forecast: Forecast;

  constructor(protected weatherService: WeatherFacadeService, route : ActivatedRoute) {
    route.params.subscribe(params => {
      this.zipcode = params['zipcode'];
      weatherService.getForecast(this.zipcode)
        .subscribe(data => this.forecast = data);
    });
  }
}
