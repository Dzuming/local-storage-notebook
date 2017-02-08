import { Component, OnInit } from '@angular/core';
import { LocalStorageService} from '../shared/local-storage.service'
@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.css'],
  providers: [LocalStorageService]
})
export class NoteListComponent implements OnInit {

  constructor(private localStorageService: LocalStorageService) { }

  ngOnInit() {
    this.localStorageService.saveItem("test","test1")
  }

}
