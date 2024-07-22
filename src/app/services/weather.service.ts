import { effect, inject, Injectable, signal, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConditionsAndZip } from '../interfaces/conditions-and-zip.type';
import { CurrentConditions } from '../interfaces/current-conditions.type';
import { Forecast } from '../interfaces/forecast.type';
import { CacheService } from './cache.service';
import { LocationService } from './location.service';
import { tap, shareReplay } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable()
export class WeatherService {
  private readonly http = inject(HttpClient);
  private readonly cacheService = inject(CacheService<CurrentConditions | Forecast>);
  private readonly locationService = inject(LocationService);

  static URL = 'https://api.openweathermap.org/data/2.5';
  static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  static ICON_URL = 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';
  
  private currentConditions = signal<ConditionsAndZip[]>([]);
  private cacheTTL = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

  constructor() {
    effect(() => {
      this.updateCurrentConditions(this.locationService.locations());
    }, { allowSignalWrites: true });
  }

  private updateCurrentConditions(locations: string[]): void {
    this.currentConditions.set([]);
    for (let loc of locations) {
      this.addCurrentConditions(loc);
    }
  }

  addCurrentConditions(zipcode: string): void {
    const cachedData = this.cacheService.getItem(`currentConditions-${zipcode}`);
    if (cachedData) {
      this.currentConditions.update(conditions => [...conditions, { zip: zipcode, data: cachedData as CurrentConditions }]);
    } else {
      this.http.get<CurrentConditions>(`${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`)
        .pipe(
          tap(data => {
            this.cacheService.setItem(`currentConditions-${zipcode}`, data, this.cacheTTL);
            this.currentConditions.update(conditions => [...conditions, { zip: zipcode, data }]);
          }),
          shareReplay(1)
        )
        .subscribe();
    }
  }

  removeCurrentConditions(zipcode: string): void {
    this.currentConditions.update(conditions => conditions.filter(condition => condition.zip !== zipcode));
    this.cacheService.removeItem(`currentConditions-${zipcode}`);
  }

  getCurrentConditions(): Signal<ConditionsAndZip[]> {
    return this.currentConditions.asReadonly();
  }

  getForecast(zipcode: string): Observable<Forecast> {
    const cachedData = this.cacheService.getItem(`forecast-${zipcode}`);
    if (cachedData) {
      return of(cachedData as Forecast);
    } else {
      return this.http.get<Forecast>(`${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`)
        .pipe(
          tap(data => this.cacheService.setItem(`forecast-${zipcode}`, data, this.cacheTTL)),
          shareReplay(1)
        );
    }
  }

  getWeatherIcon(id): string {
    if (id >= 200 && id <= 232)
      return WeatherService.ICON_URL + "art_storm.png";
    else if (id >= 501 && id <= 511)
      return WeatherService.ICON_URL + "art_rain.png";
    else if (id === 500 || (id >= 520 && id <= 531))
      return WeatherService.ICON_URL + "art_light_rain.png";
    else if (id >= 600 && id <= 622)
      return WeatherService.ICON_URL + "art_snow.png";
    else if (id >= 801 && id <= 804)
      return WeatherService.ICON_URL + "art_clouds.png";
    else if (id === 741 || id === 761)
      return WeatherService.ICON_URL + "art_fog.png";
    else
      return WeatherService.ICON_URL + "art_clear.png";
  }
}
