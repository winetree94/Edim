import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  public constructor() {
    console.log('global service init');
  }
}
