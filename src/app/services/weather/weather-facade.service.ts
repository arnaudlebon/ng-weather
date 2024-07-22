import { Injectable, Signal, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrentConditionsService } from './current-conditions.service';
import { ForecastService } from './forecast.service';
import { WeatherIconService } from './weather-icon.service';
import { ConditionsAndZip } from 'app/interfaces/conditions-and-zip.type';
import { Forecast } from 'app/interfaces/forecast.type';

@Injectable()
export class WeatherFacadeService {
  private readonly currentConditionsService = inject(CurrentConditionsService);
  private readonly forecastService = inject(ForecastService);
  private readonly weatherIconService = inject(WeatherIconService);

  getCurrentConditions(): Signal<ConditionsAndZip[]> {
    return this.currentConditionsService.getCurrentConditions();
  }

  getForecast(zipcode: string): Observable<Forecast> {
    return this.forecastService.getForecast(zipcode);
  }

  getWeatherIcon(id: number): string {
    return this.weatherIconService.getWeatherIcon(id);
  }
}
