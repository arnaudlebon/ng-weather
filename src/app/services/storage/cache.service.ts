import { inject, Injectable, Signal, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { CacheItem } from 'app/interfaces/cache.type';
import { appConfig } from 'app/app.config';

@Injectable({
  providedIn: 'root',
})
export class CacheService<T> {
  private readonly storage = inject(StorageService<CacheItem<T>>)
  private defaultTTL$$ = signal<number>(appConfig.cacheTTL)

  get defaultTTL(): Signal<number> {
    return this.defaultTTL$$.asReadonly();
  }

  setDefaultTTL(ttl: number): void {
    this.defaultTTL$$.set(ttl);
  }

  setItem(key: string, data: any, ttl?: number): void {
    const now = new Date().getTime();
    const item = {
      data: data,
      expiry: now + (ttl ?? this.defaultTTL()),
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
