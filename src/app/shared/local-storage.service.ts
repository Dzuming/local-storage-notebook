import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

  constructor() { }
  saveItem(name: string, value: Object): any {
    localStorage.setItem(name, JSON.stringify(value));
  }
  getItem(name) {
    return localStorage.getItem(name);
  }
  removeItem() {

  }
}
