import { InjectionToken } from '@angular/core';
import { environment } from 'environments/environment';

export interface AppConfig {
  apiUrl: string;
  appId: string;
  iconUrl: string;
  cacheTTL: number
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');

const savedCacheTTL = localStorage.getItem('cacheTTL');
const defaultCacheTTL = 2 * 60 * 60 * 1000;
const cacheTTL = savedCacheTTL ? parseInt(savedCacheTTL, 10) : defaultCacheTTL;

export const appConfig: AppConfig = {
    apiUrl: environment.apiUrl,
    appId: environment.appId,
    iconUrl: environment.iconUrl,
    cacheTTL
  };