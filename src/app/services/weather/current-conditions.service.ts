import { Injectable, inject, signal, Signal, effect, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, shareReplay } from 'rxjs/operators';
import { ConditionsAndZip } from 'app/interfaces/conditions-and-zip.type';
import { CurrentConditions } from 'app/interfaces/current-conditions.type';
import { CacheService } from '../storage/cache.service';
import { APP_CONFIG, AppConfig } from 'app/app.config';
import { forkJoin, Observable, of } from 'rxjs';

@Injectable()
export class CurrentConditionsService {
  private readonly http = inject(HttpClient);
  private readonly cacheService = inject(CacheService<CurrentConditions>);
  
  private currentConditions = signal<ConditionsAndZip[]>([]);
  private isLoadingCurrentConditions$$ = signal<boolean>(false);

  constructor(@Inject(APP_CONFIG) private config: AppConfig) {}

  get isLoadingCurrentConditions(): Signal<boolean> {
    return this.isLoadingCurrentConditions$$.asReadonly();
  }

  updateCurrentConditions(locations: string[]): void {
    this.isLoadingCurrentConditions$$.set(true);
    const currentLocations = this.currentConditions().map(condition => condition.zip);
    const locationsToAdd = locations.filter(loc => !currentLocations.includes(loc));
    const locationsToRemove = currentLocations.filter(loc => !locations.includes(loc));

    const addObservables = locationsToAdd.map(loc => this.addCurrentConditions(loc));
    const removeObservables = locationsToRemove.map(loc => this.removeCurrentConditions(loc));

    forkJoin([...addObservables, ...removeObservables]).subscribe({
      complete: () => this.isLoadingCurrentConditions$$.set(false)
    });
  }

  private addCurrentConditions(zipcode: string): Observable<CurrentConditions> {
    const cachedData = this.cacheService.getItem(`currentConditions-${zipcode}`);
    if (cachedData) {
      this.currentConditions.update(conditions => [...conditions, { zip: zipcode, data: cachedData as CurrentConditions }]);
      return of();
    } else {
      return this.http.get<CurrentConditions>(`${this.config.apiUrl}/weather?zip=${zipcode},us&units=imperial&APPID=${this.config.appId}`)
        .pipe(
          tap(data => {
            this.cacheService.setItem(`currentConditions-${zipcode}`, data, this.config.cacheTTL);
            this.currentConditions.update(conditions => [...conditions, { zip: zipcode, data }]);
          }),
          shareReplay(1)
        );
    }
  }

  private removeCurrentConditions(zipcode: string): Observable<void> {
    this.currentConditions.update(conditions => conditions.filter(condition => condition.zip !== zipcode));
    this.cacheService.removeItem(`currentConditions-${zipcode}`);
    return of();

  }

  getCurrentConditions(): Signal<ConditionsAndZip[]> {
    return this.currentConditions.asReadonly();
  }
}
