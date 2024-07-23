import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { ZipcodeEntryComponent } from "./components/zipcode-entry/zipcode-entry.component";
import { LocationService } from "./services/location/location.service";
import { MainPageComponent } from "./pages/main-page/main-page.component";
import { RouterModule } from "@angular/router";
import { routing } from "./app.routing";
import { HttpClientModule } from "@angular/common/http";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { CurrentConditionsComponent } from "./components/current-conditions/current-conditions.component";
import { ForecastsListComponent } from "./pages/forecasts-list/forecasts-list.component";
import { TabContentComponent } from "./shared/components/tab-content/tab-content.component";
import { TabComponent } from "./shared/components/tab/tab.component";
import { CurrentConditionsService } from "./services/weather/current-conditions.service";
import { ForecastService } from "./services/weather/forecast.service";
import { WeatherIconService } from "./services/weather/weather-icon.service";
import { WeatherFacadeService } from "./services/weather/weather-facade.service";
import { APP_CONFIG, appConfig } from "./app.config";
import { CacheControlComponent } from "./components/cache-control/cache-control.component";
import { FormatCacheTTLPipe } from "./shared/pipes/format-cache-ttl.pipe";

export const WEATHER_SERVICES = [
  CurrentConditionsService,
  ForecastService,
  WeatherIconService,
  WeatherFacadeService
];

@NgModule({
  declarations: [
    AppComponent,
    ZipcodeEntryComponent,
    ForecastsListComponent,
    CurrentConditionsComponent,
    TabComponent,
    CacheControlComponent,
    TabContentComponent,
    FormatCacheTTLPipe,
    MainPageComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    routing,
    ServiceWorkerModule.register("/ngsw-worker.js", {
      enabled: environment.production,
    }),
  ],
  providers: [
    LocationService,
    WEATHER_SERVICES,
    { provide: APP_CONFIG, useValue: appConfig }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
