import { Component, OnInit } from '@angular/core';
import { LocalStorageService} from '../shared/local-storage.service'
@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.css'],
  providers: [LocalStorageService]
})

export class NoteListComponent implements OnInit {
    public noteObject:string = "noteObject";
  constructor(private localStorageService: LocalStorageService) { }

  ngOnInit() {
    console.log(this.show())
  }
  save(newObject) {
    let value:Array<Object> = JSON.parse(this.show())
    value[0]["test4"] = newObject;
    this.localStorageService.saveItem(this.noteObject, value)
  }
  show() {
    return this.localStorageService.getItem(this.noteObject)
  }
}
