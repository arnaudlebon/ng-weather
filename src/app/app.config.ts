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
    /********************************************************************/
    /** You can customize cacheTTL there and set a few seconds to test **/ 
    cacheTTL: 2 * 60 * 60 * 1000 // 2 hours in milliseconds
    // cacheTTL: 30 * 1000 // 30 seconds in milliseconds
  };