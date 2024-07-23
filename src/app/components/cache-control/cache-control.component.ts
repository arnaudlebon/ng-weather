import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { appConfig } from '../../app.config';
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
      alert(`Cache successfully cleared and Cache TTL updated to ${this.displayCacheTTL}.`);
    }
  }
  
  private updateCurrentCacheTTL(ttl: number) {
    this.displayCacheTTL = ttl;
  }

  private formatCacheTTL(seconds: number): string {
    if (seconds < 60) {
      return `${seconds} seconds`;
    } else if (seconds < 3600) {
      const minutes = Math.round(seconds / 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.round((seconds % 3600) / 60);
      if (minutes === 0) {
        return `${hours} hour${hours !== 1 ? 's' : ''}`;
      } else {
        return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
      }
    }
  }
}
