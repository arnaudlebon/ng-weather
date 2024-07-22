import { Inject, Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, shareReplay } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Forecast } from 'app/interfaces/forecast.type';
import { CacheService } from '../storage/cache.service';
import { APP_CONFIG, AppConfig } from 'app/app.config';

@Injectable()
export class ForecastService {
  private readonly http = inject(HttpClient);
  private readonly cacheService = inject(CacheService<Forecast>);
  
  private cacheTTL = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

  constructor(@Inject(APP_CONFIG) private config: AppConfig) {}

  getForecast(zipcode: string): Observable<Forecast> {
    const cachedData = this.cacheService.getItem(`forecast-${zipcode}`);
    if (cachedData) {
      return of(cachedData as Forecast);
    } else {
      return this.http.get<Forecast>(`${this.config.apiUrl}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${this.config.appId}`)
        .pipe(
          tap(data => this.cacheService.setItem(`forecast-${zipcode}`, data, this.cacheTTL)),
          shareReplay(1)
        );
    }
  }
}
