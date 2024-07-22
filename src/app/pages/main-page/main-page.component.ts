import { Component, inject, OnDestroy } from "@angular/core";
import { LocationService } from "app/services/location/location.service";
import { WeatherFacadeService } from "app/services/weather/weather-facade.service";
import { toObservable } from "@angular/core/rxjs-interop";
import { Subscription } from "rxjs";

@Component({
  selector: "app-main-page",
  templateUrl: "./main-page.component.html",
})
export class MainPageComponent implements OnDestroy {
  private readonly locationService = inject(LocationService);
  private readonly weatherService = inject(WeatherFacadeService);
  private subscription: Subscription;

  constructor() {
    const locations$ = toObservable(this.locationService.locations);
    this.subscription = locations$.subscribe((locations) => {
      this.weatherService.updateCurrentConditions(locations);
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
