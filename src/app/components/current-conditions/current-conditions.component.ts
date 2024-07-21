import { Component, effect, inject, Signal } from '@angular/core';
import { Router } from "@angular/router";
import { ConditionsAndZip } from 'app/interfaces/conditions-and-zip.type';
import { LocationService } from 'app/services/location.service';
import { WeatherService } from 'app/services/weather.service';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css']
})
export class CurrentConditionsComponent {

  private weatherService = inject(WeatherService);
  private router = inject(Router);
  protected locationService = inject(LocationService);
  protected currentConditionsByZip: Signal<ConditionsAndZip[]> = this.weatherService.getCurrentConditions();

  selectedLocation: ConditionsAndZip | null = null;
  selectedIndex: number = 0;

  constructor() {
    effect(() => {
      const locations = this.currentConditionsByZip();
      if (locations.length > 0 && !this.selectedLocation) {
        this.selectedLocation = locations[0];
      }
    });
  }

  showForecast(zipcode: string) {
    this.router.navigate(['/forecast', zipcode]);
  }
  
  selectLocation(location: ConditionsAndZip, index: number) {
    this.selectedLocation = location;
    this.selectedIndex = index;
  }

  removeLocation(zipcode: string, event: MouseEvent) {
    this.locationService.removeLocation(zipcode);
    event.stopPropagation();
    if (this.selectedLocation?.zip === zipcode) {
      const remainingLocations = this.currentConditionsByZip();
      this.selectedLocation = remainingLocations.length > 0 ? remainingLocations[0] : null;
      this.selectedIndex = 0;
    }
  }
}
