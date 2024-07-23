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

  get isLoadingCurrentConditions(): Signal<boolean> {
    return this.currentConditionsService.isLoadingCurrentConditions;
  }

  getCurrentConditions(): Signal<ConditionsAndZip[]> {
    return this.currentConditionsService.getCurrentConditions();
  }

  updateCurrentConditions(locations: string[]): void {
    return this.currentConditionsService.updateCurrentConditions(locations);
  }

  getForecast(zipcode: string): Observable<Forecast> {
    return this.forecastService.getForecast(zipcode);
  }

  getWeatherIcon(id: number): string {
    return this.weatherIconService.getWeatherIcon(id);
  }
}
