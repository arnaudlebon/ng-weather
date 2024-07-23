import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, AppConfig } from 'app/app.config';

@Injectable()
export class WeatherIconService {
 
  constructor(@Inject(APP_CONFIG) private config: AppConfig) {}

  getWeatherIcon(id: number): string {
    if (id >= 200 && id <= 232) return `${this.config.iconUrl}art_storm.png`;
    if (id >= 501 && id <= 511) return `${this.config.iconUrl}art_rain.png`;
    if (id === 500 || (id >= 520 && id <= 531)) return `${this.config.iconUrl}art_light_rain.png`;
    if (id >= 600 && id <= 622) return `${this.config.iconUrl}art_snow.png`;
    if (id >= 801 && id <= 804) return `${this.config.iconUrl}art_clouds.png`;
    if (id === 741 || id === 761) return `${this.config.iconUrl}art_fog.png`;
    return `${this.config.iconUrl}art_clear.png`;
  }
}
