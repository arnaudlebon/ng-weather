import { Component, ContentChildren, QueryList, AfterContentInit, EventEmitter, Output, OnDestroy, Input, inject } from '@angular/core';
import { TabContentComponent } from '../tab-content/tab-content.component';
import { Subscription } from 'rxjs';
import { TabStateService } from 'app/services/tab/tab-state.service';

@Component({
  selector: 'app-tab',
  template: `
    <div>
      <ul class="nav nav-tabs">
        <li *ngFor="let tab of tabs; let i = index" [class.active]="i === selectedIndex" (click)="selectTab(i)">
          <a href="javascript:void(0)">{{tab.title}}
            <span class="close-tab" (click)="onRemoveTab(i, $event)">&times;</span>
          </a>
        </li>
      </ul>
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./tab.component.css']
})
export class TabComponent implements AfterContentInit, OnDestroy {
  private readonly tabStateService = inject(TabStateService);
  @ContentChildren(TabContentComponent) tabs!: QueryList<TabContentComponent>;
  @Output() tabRemoved = new EventEmitter<number>();
  @Input() tabKey: string = 'default';
  selectedIndex: number = 0;
  private subscription: Subscription;

  ngAfterContentInit() {
    this.subscription = this.tabStateService.getSelectedIndex(this.tabKey).subscribe(index => {
      this.selectedIndex = index;
      this.updateTabSelection();
    });

    this.updateTabSelection();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  selectTab(index: number) {
    this.selectedIndex = index;
    this.tabStateService.setSelectedIndex(this.tabKey, index);
  }

  updateTabSelection() {
    this.tabs.toArray().forEach((tab, i) => tab.active = i === this.selectedIndex);
  }

  onRemoveTab(index: number, event: MouseEvent) {
    event.stopPropagation();
    this.tabRemoved.emit(index);
    const tabsArray = this.tabs.toArray();
    tabsArray.splice(index, 1);
    if (this.selectedIndex >= index && this.selectedIndex > 0) {
      this.selectedIndex--;
    }
    this.tabStateService.setSelectedIndex(this.tabKey, this.selectedIndex);
    this.updateTabSelection();
  }
}