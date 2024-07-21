import { effect, inject, Injectable, Signal, signal } from '@angular/core';
import {WeatherService} from "./weather.service";
import { StorageService } from './storage.service';

export const LOCATIONS : string = "locations";

@Injectable()
export class LocationService {
  private readonly storage = inject(StorageService<string[]>)
  private locations$$ = signal<string[]>(
    this.storage.get(LOCATIONS)
  )

  constructor(private weatherService : WeatherService) {
    for (let loc of this.locations$$()) {
      this.weatherService.addCurrentConditions(loc);
    }
    
    effect(() => this.storage.set(LOCATIONS, this.locations$$()));
  }

  get locations(): Signal<string[]> {
    return this.locations$$.asReadonly();
  }

  addLocation(zipcode : string) {
    const locations = this.locations$$();
    const updatedLocations = [...locations, zipcode];
    this.locations$$.set(updatedLocations);
    this.weatherService.addCurrentConditions(zipcode);
  }

  removeLocation(zipcode : string) {
    const locations = this.locations$$();
    const hasLocation = locations.includes(zipcode);
    if (hasLocation) {
      const updatedLocations = locations.filter((loc) => loc !== zipcode);
      this.locations$$.set(updatedLocations);
      this.weatherService.removeCurrentConditions(zipcode);
    }
  }
}
