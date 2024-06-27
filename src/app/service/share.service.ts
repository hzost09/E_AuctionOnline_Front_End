import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  private eventSubject = new BehaviorSubject<any>(null);
  constructor() { }

  sendEvent(event: any) {
    this.eventSubject.next(event);
  }

  getEvent() {
    return this.eventSubject.asObservable();
  }
}
