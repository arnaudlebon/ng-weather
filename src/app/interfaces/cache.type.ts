export interface CacheItem<T> {
  data: T;
  expiry: number;
}

export interface CacheParams {
  storageKey: string;
  defaultValue: number;
}