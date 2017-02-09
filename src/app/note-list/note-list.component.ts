
//TODO - resetowanie wyboru;
//TODO - form clear
//TODO - Przy pustym jsonie wyskakuje formError
//TODO - Usuwanie z listy
//TODO - rozwijanie listy po kliknieciu na przycisk
//TODO - walidacja danych
//TODO - Bug z usunieciem ostatniego
//TODO - Add id
//TODO - performance problem
//Show to another function
import { Component, OnInit, ElementRef, DoCheck, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { LocalStorageService } from '../shared/local-storage.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  providers: [LocalStorageService]
})

export class NoteListComponent implements OnInit, DoCheck, AfterViewInit {
  public noteObject = 'noteObject';
  public html = [];
  public noteForm: FormGroup;
  public Description = 'Not available';
  public nameOnClick = 'Not available';
  private formErrors = {
    'Name': '',
    'Description': '',
  };

  constructor(private formBuilder: FormBuilder, private localStorageService: LocalStorageService, private elementRef: ElementRef) { }

  ngOnInit() {
    this.buildForm();
    this.show(JSON.parse(this.getData()));
    this.updateList();
  }

  ngDoCheck() {
    this.deleteClickEvent();
    this.clickableElementToFind();
  }

  ngAfterViewInit() {
    this.clickableElementToFind();
    this.deleteClickEvent();
  }

  buildForm(): void {
    this.noteForm = this.formBuilder.group({
      Name: [this.formErrors.Name, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(24)
      ]],
      Description: [this.formErrors.Description, [
        Validators.minLength(4),
        Validators.maxLength(24),
        Validators.required,
      ]]
    });
  }

  save() {
    const value: Array<Object> = JSON.parse(this.getData()) || [];
    this.onSave(value);
  }

  onSave(value: Array<Object>) {
    if (this.nameOnClick === 'Not available') {
      value.push([{
        'name': this.noteForm.value.Name,
        'children': [],
        'Description': this.noteForm.value.Description
      }]);
    } else {
      value.map((val: Object, index: number) => {
        if (val[0].name === this.nameOnClick && this.nameOnClick !== '') {
          val[0].children.push([{
            'name': this.noteForm.value.Name,
            'children': [],
            'Description': this.noteForm.value.Description
          }]);
        } else if (val[0].children[0] && val[0].name !== this.nameOnClick) {
          this.onSave(val[0].children);
        }
      });
    }
    this.localStorageService.saveItem(this.noteObject, value);
    this.removeList();
    if (this.html) {
      this.html = [];
    }
    this.show(JSON.parse(this.getData()));
    this.updateList();
  }

  deleteClickEvent() {
    const remove = this.elementRef.nativeElement.querySelectorAll('.delete');
    const click = Observable.fromEvent(remove, 'click');
    const subscription = click.subscribe(
      (e: any) => {
        this.nameOnClick = e.currentTarget.previousSibling.innerHTML.split('<ul>')[0];
        this.onDelete(JSON.parse(this.getData()));
      });
  }

  onDelete(value: Array<any>) {
    if (!this.nameOnClick) {
      value.splice(1, 1);
    }
    value.map((val, index) => {
      if (val[0].name === this.nameOnClick) {
        value[index].splice(1, 1);
      }
      if (val[0].name === this.nameOnClick) {
        val.splice(index, 1);
      } else if (val[0].children[0] && val[0].name !== this.nameOnClick) {
        this.onDelete(val[0].children);
      }
    });
    this.localStorageService.saveItem(this.noteObject, value);
    this.removeList();
    if (this.html) {
      this.html = [];
    }
    this.show(JSON.parse(this.getData()));
    this.updateList();
  }

  find(element: Array<Object>) {
    element.map((val) => {
      if (val[0].name === this.nameOnClick) {
        this.Description = val[0].Description;
      } else if (val[0].children[0] && val[0].name !== this.nameOnClick) {
        this.find(val[0].children);
      }
    });
  }

  clickableElementToFind() {
    const span = this.elementRef.nativeElement.querySelectorAll('span');
    const click = Observable.fromEvent(span, 'click');
    const subscription = click.subscribe(
      (e: any) => {
        this.nameOnClick = e.currentTarget.innerHTML.split('<ul>')[0];
        this.find(JSON.parse(this.getData()));
      }
    );
  }

  updateList() {
    const el = document.querySelector('app-note-list #note-list div');
    el.insertAdjacentHTML('afterbegin', this.html.join(''));
  }

  removeList() {
    const noteList = document.querySelector('app-note-list #note-list div ul');
    if (noteList) {
      noteList.parentNode.removeChild(noteList);
    }
  }

  show(element) {
    if (!element) {
      return;
    }
    this.html.push('<ul>');
    element.map((val) => {
      this.html.push('<li><span>' + val[0].name);
      this.html.push('</span><i class="delete">X</i>');
      if (val[0].children[0]) {
        this.show(val[0].children);
      }
      this.html.push('</li>');
    });
    this.html.push('</ul>');
  }

  getData() {
    return this.localStorageService.getItem(this.noteObject);
  }
  clearTopicAndDescription() {
    this.nameOnClick = 'Not available';
    this.Description = 'Not available';
  }
}
