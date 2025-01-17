import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService<T> {
  constructor() {}

  get(key: string): T {
    return JSON.parse(localStorage.getItem(key) ?? null) as T;
  }

  set(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}