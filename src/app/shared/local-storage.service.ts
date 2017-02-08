import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

  constructor() { }
saveItem(name, value){
  localStorage.setItem(name, value )
}
getItem(){

}
removeItem(){

}
}
