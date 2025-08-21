import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private dataUpdatedSource = new Subject<void>();
  dataUpdated$ = this.dataUpdatedSource.asObservable();

  constructor() { }

  notifyDataUpdated() {
    console.log('EventService: Notificando actualización de datos');
    this.dataUpdatedSource.next();
  }
}
