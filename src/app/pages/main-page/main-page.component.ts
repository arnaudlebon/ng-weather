import { Component, effect, inject } from '@angular/core';
import { LocationService } from 'app/services/location/location.service';
import { WeatherFacadeService } from 'app/services/weather/weather-facade.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html'
})
export class MainPageComponent {
  private readonly locationService = inject(LocationService);
  private readonly weatherService = inject(WeatherFacadeService);

  constructor() {
    effect(() => {
      const locations = this.locationService.locations();
      this.weatherService.updateCurrentConditions(locations);
    }, { allowSignalWrites: true });
  }
}
