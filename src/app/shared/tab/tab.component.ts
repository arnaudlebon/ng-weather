import { Component, ContentChildren, QueryList, AfterContentInit, EventEmitter, Output } from '@angular/core';
import { TabContentComponent } from '../tab-content/tab-content.component';

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
export class TabComponent implements AfterContentInit {
  @ContentChildren(TabContentComponent) tabs!: QueryList<TabContentComponent>;
  @Output() tabRemoved = new EventEmitter<number>();
  selectedIndex: number = 0;

  ngAfterContentInit() {
    const activeTabs = this.tabs.filter(tab => tab.active);
    if (activeTabs.length === 0) {
      this.selectTab(0);
    }
  }

  selectTab(index: number) {
    this.tabs.toArray().forEach((tab, i) => tab.active = i === index);
    this.selectedIndex = index;
  }

  onRemoveTab(index: number, event: MouseEvent) {
    event.stopPropagation();
    this.tabRemoved.emit(index);
    const tabsArray = this.tabs.toArray();
    tabsArray.splice(index, 1);
    if (this.selectedIndex >= index && this.selectedIndex > 0) {
      this.selectTab(this.selectedIndex - 1);
    } else if (this.selectedIndex >= tabsArray.length) {
      this.selectTab(tabsArray.length - 1);
    } else {
      this.selectTab(this.selectedIndex);
    }
  }
}
