import { Component, inject, OnInit } from '@angular/core';
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

  cacheForm: FormGroup;
  displayCacheTTL: number;

  ngOnInit(): void {
    this.cacheForm = this.fb.group({
      cacheTTL: [undefined, [Validators.required, Validators.min(1)]],
    });
    this.updateCurrentCacheTTL(appConfig.cacheTTL / 1000);
  }

  updateCacheTTL() {
    if (this.cacheForm.valid) {
      this.storageService.clear();
      const newTTL = this.cacheForm.value.cacheTTL * 1000;
      appConfig.cacheTTL = newTTL;
      this.storageService.set('cacheTTL', Number(newTTL));
      this.notifyChanges({
        message: `Cache successfully cleared and Cache TTL updated to ${Number(newTTL) / 1000} seconds.`,
        ttl: this.cacheForm.value.cacheTTL
      });
    }
  }

  resetToDefault():void {
    this.storageService.clear();
    appConfig.cacheTTL = defaultCacheTTL;
    this.notifyChanges({
      message: `Cache TTL reset to default value of ${defaultCacheTTL / 1000} seconds.`,
      ttl: defaultCacheTTL / 1000
    });
  }
  
  private notifyChanges(changes: {message: string, ttl: number}): void {
    this.updateCurrentCacheTTL(changes.ttl);
    this.cacheForm.reset();
    alert(changes.message);
    window.location.reload();
  }

  private updateCurrentCacheTTL(ttl: number) {
    this.displayCacheTTL = ttl;
  }
}
