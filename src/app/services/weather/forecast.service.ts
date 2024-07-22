import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, shareReplay } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Forecast } from 'app/interfaces/forecast.type';
import { CacheService } from '../storage/cache.service';

@Injectable()
export class ForecastService {
  private readonly http = inject(HttpClient);
  private readonly cacheService = inject(CacheService<Forecast>);
  private static readonly URL = 'https://api.openweathermap.org/data/2.5';
  private static readonly APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  private cacheTTL = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

  constructor() {}

  getForecast(zipcode: string): Observable<Forecast> {
    const cachedData = this.cacheService.getItem(`forecast-${zipcode}`);
    if (cachedData) {
      return of(cachedData as Forecast);
    } else {
      return this.http.get<Forecast>(`${ForecastService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${ForecastService.APPID}`)
        .pipe(
          tap(data => this.cacheService.setItem(`forecast-${zipcode}`, data, this.cacheTTL)),
          shareReplay(1)
        );
    }
  }
}
