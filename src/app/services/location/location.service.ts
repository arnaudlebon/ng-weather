import { Injectable, Signal, signal, effect, inject } from '@angular/core';
import { StorageService } from '../storage/storage.service';

const LOCATIONS: string = "locations";

@Injectable()
export class LocationService {
  private readonly storage = inject(StorageService<string[]>)
  private locations$$ = signal<string[]>(this.storage.get(LOCATIONS) || []);

  constructor() {
    effect(() => {
      this.storage.set(LOCATIONS, this.locations());
    });
  }

  get locations(): Signal<string[]> {
    return this.locations$$.asReadonly();
  }

  addLocation(zipcode: string) {
    const updatedLocations = [...this.locations(), zipcode];
    this.locations$$.set(updatedLocations);
  }

  removeLocation(zipcode: string) {
    const locations = this.locations();
    const hasLocation = locations.includes(zipcode);
    if (hasLocation) {
      const updatedLocations = locations.filter(loc => loc !== zipcode);
      this.locations$$.set(updatedLocations);
    }
  }
}
