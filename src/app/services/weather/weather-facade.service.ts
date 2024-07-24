import { Injectable, Signal, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrentConditionsService } from './current-conditions.service';
import { ForecastService } from './forecast.service';
import { WeatherIconService } from './weather-icon.service';
import { ConditionsAndZip } from 'app/interfaces/conditions-and-zip.type';
import { Forecast } from 'app/interfaces/forecast.type';
import { CurrentConditions } from 'app/interfaces/current-conditions.type';

@Injectable()
export class WeatherFacadeService {
  private readonly currentConditionsService = inject(CurrentConditionsService);
  private readonly forecastService = inject(ForecastService);
  private readonly weatherIconService = inject(WeatherIconService);

  /**
   * Fetch the current weather conditions for a given zipcode.
   * @param zipcode - The zipcode to fetch weather for.
   * @returns Observable of CurrentConditions.
   */
  fetchWeather(zipcode: string): Observable<CurrentConditions> {
    return this.currentConditionsService.fetchWeather(zipcode);
  }

  /**
   * Get the current weather conditions signal.
   * @returns Signal of ConditionsAndZip array.
   */
  getCurrentConditions(): Signal<ConditionsAndZip[]> {
    return this.currentConditionsService.getCurrentConditions();
  }

  /**
   * Update the current weather conditions for a list of locations.
   * @param locations - Array of zipcodes to update weather conditions for.
   */
  updateCurrentConditions(locations: string[]): void {
    this.currentConditionsService.updateCurrentConditions(locations);
  }

  /**
   * Get the weather forecast for a given zipcode.
   * @param zipcode - The zipcode to fetch the forecast for.
   * @returns Observable of Forecast.
   */
  getForecast(zipcode: string): Observable<Forecast> {
    return this.forecastService.getForecast(zipcode);
  }

  /**
   * Get the weather icon URL for a given weather condition ID.
   * @param id - The weather condition ID.
   * @returns URL of the weather icon.
   */
  getWeatherIcon(id: number): string {
    return this.weatherIconService.getWeatherIcon(id);
  }
}
