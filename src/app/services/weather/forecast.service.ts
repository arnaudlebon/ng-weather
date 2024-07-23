import { Inject, Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Forecast } from 'app/interfaces/forecast.type';
import { CacheService } from '../storage/cache.service';
import { APP_CONFIG, AppConfig } from 'app/app.config';

@Injectable()
export class ForecastService {
  private readonly http = inject(HttpClient);
  private readonly cacheService = inject(CacheService<Forecast>);
  
  constructor(@Inject(APP_CONFIG) private config: AppConfig) {}

  getForecast(zipcode: string): Observable<Forecast> {
    return this.cacheService.fetchOrRetrieveFromCache(
      `forecast-${zipcode}`,
      () => this.http.get<Forecast>(`${this.config.apiUrl}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${this.config.appId}`)
    );
  }
}
