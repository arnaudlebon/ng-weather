import { Component, DestroyRef, inject, signal } from '@angular/core';
import { LocationService } from '../../services/location/location.service';
import { WeatherFacadeService } from '../../services/weather/weather-facade.service';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { combineLatest, Observable, of, throwError } from 'rxjs';
import { toObservable, takeUntilDestroyed  } from '@angular/core/rxjs-interop';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html'
})
export class ZipcodeEntryComponent {
  protected readonly locationService = inject(LocationService);
  protected readonly weatherService = inject(WeatherFacadeService);
  protected readonly destroyRef = inject(DestroyRef);

  private locations$ = toObservable(this.locationService.locations) as Observable<string[]>;
  
  zipcodeControl = new FormControl<string>('', [Validators.required]);
  errorMessage = signal<string | null>(null);

  addLocation() {
    const zipcode = this.zipcodeControl.value;
    this.checkDuplicateLocation(zipcode).pipe(
      switchMap(validZip => this.checkCanFetchWeather(validZip)),
      catchError(error => {
        this.errorMessage.set(error.message);
        return of(null);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(weather => {
      if (weather) {
        this.locationService.addLocation(zipcode);
        this.errorMessage.set(null);
        this.zipcodeControl.reset();
      }
    });
  }

  private checkDuplicateLocation(zipcode: string): Observable<string> {
    return this.locations$.pipe(
      take(1),
      map(locations => {
        if (locations.includes(zipcode)) {
          throw new Error('This location already exists.');
        }
        return zipcode;
      })
    );
  }

  private checkCanFetchWeather(zipcode: string): Observable<any> {
    return this.weatherService.fetchWeather(zipcode).pipe(
      catchError(() => {
        return throwError(new Error(`Failed to load weather data for zipcode: ${zipcode}`));
      })
    );
  }
}
