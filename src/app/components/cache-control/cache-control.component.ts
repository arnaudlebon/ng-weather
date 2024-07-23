import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { appConfig, defaultCacheTTL } from '../../app.config';
import { StorageService } from 'app/services/storage/storage.service';

@Component({
  selector: 'app-cache-control',
  templateUrl: './cache-control.component.html',
  styleUrls: ['./cache-control.component.css']
})
export class CacheControlComponent {
  private readonly storageService = inject(StorageService<number>);
  private readonly fb = inject(FormBuilder);

  cacheForm: FormGroup;
  displayCacheTTL: number;

  constructor() {
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
      this.updateCurrentCacheTTL(this.cacheForm.value.cacheTTL);
      this.cacheForm.reset();
      alert(`Cache successfully cleared and Cache TTL updated to ${this.displayCacheTTL} seconds.`);
    }
  }
  
  private updateCurrentCacheTTL(ttl: number) {
    this.displayCacheTTL = ttl;
  }

  resetToDefault() {
    this.storageService.clear();
    appConfig.cacheTTL = defaultCacheTTL;
    this.updateCurrentCacheTTL(defaultCacheTTL / 1000);
    this.cacheForm.reset();
    alert(`Cache TTL reset to default value of ${this.displayCacheTTL} seconds.`);
  }
}
