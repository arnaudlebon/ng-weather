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

  constructor() {}

  showForecast(zipcode: string) {
    this.router.navigate(['/forecast', zipcode]);
  }

  removeLocation(index: number) {
    const locations = this.currentConditionsByZip();
    const locationToRemove = locations[index];
    this.locationService.removeLocation(locationToRemove.zip);
  }
}
