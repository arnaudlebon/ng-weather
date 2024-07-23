export interface CacheItem<T> {
  data: T;
  expiry: number;
}