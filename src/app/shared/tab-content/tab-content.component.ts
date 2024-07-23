import { ChangeDetectorRef, Component, Input } from '@angular/core';

@Component({
  selector: 'app-tab-content',
  template: `
    <div *ngIf="active">
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./tab-content.component.css']
})
export class TabContentComponent {
  @Input() title!: string;
  private _active: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {}

  get active(): boolean {
    return this._active;
  }

  set active(value: boolean) {
    this._active = value;
    this.cdr.detectChanges();
  }
}
