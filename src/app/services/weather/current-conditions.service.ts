import { Injectable, inject, signal, Signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, shareReplay } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ConditionsAndZip } from 'app/interfaces/conditions-and-zip.type';
import { CurrentConditions } from 'app/interfaces/current-conditions.type';
import { CacheService } from '../storage/cache.service';
import { LocationService } from '../location/location.service';

@Injectable()
export class CurrentConditionsService {
  private readonly http = inject(HttpClient);
  private readonly cacheService = inject(CacheService<CurrentConditions>);
  private readonly locationService = inject(LocationService);

  private static readonly URL = 'https://api.openweathermap.org/data/2.5';
  private static readonly APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  private cacheTTL = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

  private currentConditions = signal<ConditionsAndZip[]>([]);

  constructor() {
    effect(() => {
      this.updateCurrentConditions(this.locationService.locations());
    }, { allowSignalWrites: true });
  }


  updateCurrentConditions(locations: string[]): void {
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
      this.http.get<CurrentConditions>(`${CurrentConditionsService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${CurrentConditionsService.APPID}`)
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
}
