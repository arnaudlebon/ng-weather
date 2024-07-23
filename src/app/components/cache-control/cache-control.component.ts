import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from 'app/services/storage/storage.service';
import { CacheService } from 'app/services/storage/cache.service';

@Component({
  selector: 'app-cache-control',
  templateUrl: './cache-control.component.html',
  styleUrls: ['./cache-control.component.css']
})
export class CacheControlComponent implements OnInit{
  private readonly cacheService = inject(CacheService<number>);
  private readonly storageService = inject(StorageService<number>);
  private readonly fb = inject(FormBuilder);

  displayCacheTTL = signal<number>(this.cacheService.defaultTTL() / 1000);
  cacheForm: FormGroup;

  ngOnInit(): void {
    this.cacheForm = this.fb.group({
      cacheTTL: [undefined, [Validators.required, Validators.min(1)]],
    });
  }

  updateCacheTTL() {
    if (this.cacheForm.valid) {
      const newTTL = this.cacheForm.value.cacheTTL * 1000;
      this.storageService.clear();
      this.cacheService.setDefaultTTL(newTTL);
      this.notifyChanges({
        message: `Cache successfully cleared and Cache TTL updated to ${Number(newTTL) / 1000} seconds.`,
        ttl: this.cacheForm.value.cacheTTL
      });
    }
  }

  resetToDefault():void {
    this.storageService.clear();
    this.cacheService.resetDefaultTTL();

    const defaultCacheTTL = this.cacheService.defaultTTL();
    this.notifyChanges({
      message: `Cache TTL reset to default value of ${defaultCacheTTL / 1000} seconds.`,
      ttl: defaultCacheTTL / 1000
    });
  }
  
  private notifyChanges(changes: {message: string, ttl: number}): void {
    this.cacheForm.reset();
    alert(changes.message);
    window.location.reload();
  }
}
