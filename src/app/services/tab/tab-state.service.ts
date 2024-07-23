import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TabStateService {
  private selectedIndexSubjects: { [key: string]: BehaviorSubject<number> } = {};

  setSelectedIndex(key: string, index: number) {
    if (!this.selectedIndexSubjects[key]) {
      this.selectedIndexSubjects[key] = new BehaviorSubject<number>(0);
    }
    this.selectedIndexSubjects[key].next(index);
  }

  getSelectedIndex(key: string): Observable<number> {
    if (!this.selectedIndexSubjects[key]) {
      this.selectedIndexSubjects[key] = new BehaviorSubject<number>(0);
    }
    return this.selectedIndexSubjects[key].asObservable();
  }
}
