import { inject, Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { CacheItem } from 'app/interfaces/cache.type';

@Injectable({
  providedIn: 'root',
})
export class CacheService<T> {
  private readonly storage = inject(StorageService<CacheItem<T>>)

  setItem(key: string, data: any, ttl: number): void {
    const now = new Date().getTime();
    const item = {
      data: data,
      expiry: now + ttl,
    };
    this.storage.set(key, item);
  }

  getItem(key: string): T | null {
    const item = this.storage.get(key);
    if (!item) {
      return null;
    }

    const now = new Date().getTime();

    if (now > item.expiry) {
      this.storage.remove(key);
      return null;
    }

    return item.data;
  }

  removeItem(key: string): void {
    this.storage.remove(key);
  }
}
