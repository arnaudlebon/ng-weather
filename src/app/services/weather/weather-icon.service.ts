import { Injectable } from '@angular/core';

@Injectable()
export class WeatherIconService {
  private static readonly ICON_URL = 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';

  getWeatherIcon(id: number): string {
    if (id >= 200 && id <= 232) return `${WeatherIconService.ICON_URL}art_storm.png`;
    if (id >= 501 && id <= 511) return `${WeatherIconService.ICON_URL}art_rain.png`;
    if (id === 500 || (id >= 520 && id <= 531)) return `${WeatherIconService.ICON_URL}art_light_rain.png`;
    if (id >= 600 && id <= 622) return `${WeatherIconService.ICON_URL}art_snow.png`;
    if (id >= 801 && id <= 804) return `${WeatherIconService.ICON_URL}art_clouds.png`;
    if (id === 741 || id === 761) return `${WeatherIconService.ICON_URL}art_fog.png`;
    return `${WeatherIconService.ICON_URL}art_clear.png`;
  }
}
