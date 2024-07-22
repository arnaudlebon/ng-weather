import { InjectionToken } from '@angular/core';
import { environment } from 'environments/environment';

export interface AppConfig {
  apiUrl: string;
  appId: string;
  iconUrl: string;
  cacheTTL: number
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');

export const appConfig: AppConfig = {
    apiUrl: environment.apiUrl,
    appId: environment.appId,
    iconUrl: environment.iconUrl,
    cacheTTL: 2 * 60 * 60 * 1000
  };