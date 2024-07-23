import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { appConfig, defaultCacheTTL } from '../../app.config';
import { StorageService } from 'app/services/storage/storage.service';

@Component({
  selector: 'app-cache-control',
  templateUrl: './cache-control.component.html',
  styleUrls: ['./cache-control.component.css']
})
export class CacheControlComponent implements OnInit{
  private readonly storageService = inject(StorageService<number>);
  private readonly fb = inject(FormBuilder);

  displayCacheTTL = signal<number>(appConfig.cacheTTL / 1000);
  cacheForm: FormGroup;

  ngOnInit(): void {
    this.cacheForm = this.fb.group({
      cacheTTL: [undefined, [Validators.required, Validators.min(1)]],
    });
  }

  updateCacheTTL() {
    if (this.cacheForm.valid) {
      const newTTL = this.cacheForm.value.cacheTTL * 1000;
      this.clearCache();
      this.setCacheTTL(newTTL);
      this.notifyChanges({
        message: `Cache successfully cleared and Cache TTL updated to ${Number(newTTL) / 1000} seconds.`,
        ttl: this.cacheForm.value.cacheTTL
      });
    }
  }

  resetToDefault():void {
    this.clearCache();
    this.setCacheTTL(defaultCacheTTL, false);
    this.notifyChanges({
      message: `Cache TTL reset to default value of ${defaultCacheTTL / 1000} seconds.`,
      ttl: defaultCacheTTL / 1000
    });
  }

  private clearCache(): void {
    this.storageService.clear();
  }

  private setCacheTTL(ttl: number, enableStorage: boolean = true): void {
    appConfig.cacheTTL = ttl;
    this.displayCacheTTL.set(ttl / 1000);
    if (enableStorage) {
      this.storageService.set('cacheTTL', ttl);
    }
  }
  
  private notifyChanges(changes: {message: string, ttl: number}): void {
    this.cacheForm.reset();
    alert(changes.message);
    window.location.reload();
  }
}
