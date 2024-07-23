import { effect, inject, Injectable, Signal, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { CacheItem, CacheParams } from 'app/interfaces/cache.type';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

const CACHE_PARAMS: CacheParams = {
  storageKey: 'cacheTTL',
  defaultValue: 2 * 60 * 60 * 1000, // 2 hours in milliseconds
};

@Injectable({
  providedIn: 'root',
})
export class CacheService<T> {
  private readonly storage = inject(StorageService<CacheItem<T>>);
  private defaultTTL$$ = signal<number>(this.loadCacheTTL());

  constructor() {
    effect(() => {
      if (this.defaultTTL() !== CACHE_PARAMS.defaultValue) {
        console.log(this.defaultTTL());
        this.storage.set(CACHE_PARAMS.storageKey, this.defaultTTL());
      }
    });
  }

  /**
   * Get the default TTL (Time To Live) value.
   * @returns Signal of the default TTL value.
   */
  get defaultTTL(): Signal<number> {
    return this.defaultTTL$$.asReadonly();
  }

  /**
   * Load the cache TTL (Time To Live) value from localStorage or set to default.
   * @returns The cache TTL value in milliseconds.
   */
  private loadCacheTTL(): number {
    const savedCacheTTL = this.storage.get(CACHE_PARAMS.storageKey);
    return savedCacheTTL ? parseInt(savedCacheTTL, 10) : CACHE_PARAMS.defaultValue;
  }

  /**
   * Set the default TTL (Time To Live) value.
   * @param ttl - The new default TTL value in milliseconds.
   */
  setDefaultTTL(ttl: number): void {
    this.defaultTTL$$.set(ttl);
  }

  /**
   * Reset the default TTL (Time To Live) value to its initial default and remove it from localStorage
   */
  resetDefaultTTL(): void {
    this.defaultTTL$$.set(CACHE_PARAMS.defaultValue);
    this.storage.remove(CACHE_PARAMS.storageKey);
  }

  /**
   * Store an item in the cache with an optional TTL (Time To Live).
   * @param key - The key under which the item should be stored.
   * @param data - The data to store in the cache.
   * @param ttl - Optional TTL in milliseconds. If not provided, the default TTL is used.
   */
  private setItem(key: string, data: any, ttl?: number): void {
    const now = new Date().getTime();
    const item = {
      data: data,
      expiry: now + (ttl ?? this.defaultTTL$$()),
    };
    this.storage.set(key, item);
  }

  /**
   * Retrieve an item from the cache.
   * @param key - The key of the item to retrieve.
   * @returns The cached item or null if it is not found or expired.
   */
  private getItem(key: string): T | null {
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

  /**
   * Remove an item from the cache.
   * @param key - The key of the item to remove.
   */
  removeItem(key: string): void {
    this.storage.remove(key);
  }

  /**
   * Fetch data using the provided function or retrieve it from the cache if available.
   * @param key - The key under which the data is stored in the cache.
   * @param fetchFn - The function to fetch data if it is not found in the cache.
   * @param ttl - Optional TTL in milliseconds for the cached data. If not provided, the default TTL is used.
   * @returns Observable of the data, either from the cache or fetched using the provided function.
   */
  fetchOrRetrieveFromCache(key: string, fetchFn: () => Observable<T>, ttl?: number): Observable<T> {
    const cachedData = this.getItem(key);
    if (cachedData) {
      return of(cachedData);
    } else {
      return fetchFn().pipe(
        tap(data => this.setItem(key, data, ttl))
      );
    }
  }
}
