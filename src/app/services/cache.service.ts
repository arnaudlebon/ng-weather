import { inject, Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private readonly storage = inject(StorageService<any>)

  setItem(key: string, data: any, ttl: number): void {
    const now = new Date().getTime();
    const item = {
      data: data,
      expiry: now + ttl,
    };
    this.storage.set(key, item);
  }

  getItem(key: string): any | null {
    const item = this.storage.get(key);
    if (!item) {
      return null;
    }

    const now = new Date().getTime();

    if (now > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return item.data;
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}
