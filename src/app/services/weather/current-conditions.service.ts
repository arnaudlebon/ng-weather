import { Injectable, inject, signal, Signal, Inject, DestroyRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, shareReplay } from 'rxjs/operators';
import { ConditionsAndZip } from 'app/interfaces/conditions-and-zip.type';
import { CurrentConditions } from 'app/interfaces/current-conditions.type';
import { CacheService } from '../storage/cache.service';
import { APP_CONFIG, AppConfig } from 'app/app.config';
import { Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable()
export class CurrentConditionsService {
  private readonly http = inject(HttpClient);
  private readonly cacheService = inject(CacheService<CurrentConditions>);
  private readonly destroyRef = inject(DestroyRef);

  private currentConditions = signal<ConditionsAndZip[]>([]);

  constructor(@Inject(APP_CONFIG) private config: AppConfig) {}

  updateCurrentConditions(locations: string[]): void {
    const currentLocations = this.currentConditions().map(condition => condition.zip);
    const locationsToAdd = locations.filter(loc => !currentLocations.includes(loc));
    const locationsToRemove = currentLocations.filter(loc => !locations.includes(loc));

    locationsToAdd.forEach(loc => this.addCurrentCondition(loc));
    locationsToRemove.forEach(loc => this.removeCurrentCondition(loc));
  }

  private addCurrentCondition(zipcode: string): void {
    this.fetchWeather(zipcode).pipe(
      tap(data => {
        this.currentConditions.update(conditions => [...conditions, { zip: zipcode, data }]);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  private removeCurrentCondition(zipcode: string): void {
    this.currentConditions.update(conditions => conditions.filter(condition => condition.zip !== zipcode));
    this.cacheService.removeItem(`weather-${zipcode}`);

  }

  fetchWeather(zipcode: string): Observable<CurrentConditions> {
    return this.cacheService.fetchOrRetrieveFromCache(
      `weather-${zipcode}`,
      () => this.http.get<CurrentConditions>(`${this.config.apiUrl}/weather?zip=${zipcode},us&units=imperial&APPID=${this.config.appId}`)
    );
  }

  getCurrentConditions(): Signal<ConditionsAndZip[]> {
    return this.currentConditions.asReadonly();
  }
}
