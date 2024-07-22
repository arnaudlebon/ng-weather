import { Injectable, inject, signal, Signal, effect, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, shareReplay } from 'rxjs/operators';
import { ConditionsAndZip } from 'app/interfaces/conditions-and-zip.type';
import { CurrentConditions } from 'app/interfaces/current-conditions.type';
import { CacheService } from '../storage/cache.service';
import { APP_CONFIG, AppConfig } from 'app/app.config';

@Injectable()
export class CurrentConditionsService {
  private readonly http = inject(HttpClient);
  private readonly cacheService = inject(CacheService<CurrentConditions>);
  
  private currentConditions = signal<ConditionsAndZip[]>([]);

  constructor(@Inject(APP_CONFIG) private config: AppConfig) {}

  updateCurrentConditions(locations: string[]): void {
    const currentLocations = this.currentConditions().map(condition => condition.zip);
    const locationsToAdd = locations.filter(loc => !currentLocations.includes(loc));
    const locationsToRemove = currentLocations.filter(loc => !locations.includes(loc));

    locationsToAdd.forEach(loc => this.addCurrentConditions(loc));
    locationsToRemove.forEach(loc => this.removeCurrentConditions(loc));
  }

  private addCurrentConditions(zipcode: string): void {
    const cachedData = this.cacheService.getItem(`currentConditions-${zipcode}`);
    if (cachedData) {
      this.currentConditions.update(conditions => [...conditions, { zip: zipcode, data: cachedData as CurrentConditions }]);
    } else {
      this.http.get<CurrentConditions>(`${this.config.apiUrl}/weather?zip=${zipcode},us&units=imperial&APPID=${this.config.appId}`)
        .pipe(
          tap(data => {
            this.cacheService.setItem(`currentConditions-${zipcode}`, data, this.config.cacheTTL);
            this.currentConditions.update(conditions => [...conditions, { zip: zipcode, data }]);
          }),
          shareReplay(1)
        )
        .subscribe();
    }
  }

  private removeCurrentConditions(zipcode: string): void {
    this.currentConditions.update(conditions => conditions.filter(condition => condition.zip !== zipcode));
    this.cacheService.removeItem(`currentConditions-${zipcode}`);
  }

  getCurrentConditions(): Signal<ConditionsAndZip[]> {
    return this.currentConditions.asReadonly();
  }
}
