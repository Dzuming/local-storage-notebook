
//TODO - resetowanie wyboru;
//TODO - Przy pustym jsonie wyskakuje formError
//TODO - Usuwanie z listy
//TODO - rozwijanie listy po kliknieciu na przycisk
//TODO - walidacja danych
//TODO - Bug z usunieciem ostatniego
//Show to another function
import { Component, OnInit, ElementRef, Renderer, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { LocalStorageService } from '../shared/local-storage.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  providers: [LocalStorageService]
})

export class NoteListComponent implements OnInit, AfterViewInit {
  public noteObject = 'noteObject';
  public html = [];
  public noteForm: FormGroup;
  public Description: string;
  public nameOnClick = "";
  private formErrors = {
    'Name': '',
    'Description': '',
  };

  constructor(private formBuilder: FormBuilder, private localStorageService: LocalStorageService, private elementRef: ElementRef) { }

  ngOnInit() {
    this.buildForm();
    this.show(JSON.parse(this.getData()));
    this.updateList()
  }
  ngAfterViewInit() {

    this.clickableElementToFind();
    this.delete();
  }
  public buildForm(): void {
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
    this.removeList();
    this.onSave(value);


  }
  onSave(value) {
    if (this.html) {
      this.html = [];
    }
    if (!this.nameOnClick) {
      value.push([{
        'name': this.noteForm.value.Name,
        'children': [],
        'Description': this.noteForm.value.Description
      }]);
    }
    value.map((val, index) => {
      if (val[0].name === this.nameOnClick && this.nameOnClick !== "") {
        val[0].children.push([{
          'name': this.noteForm.value.Name,
          'children': [],
          'Description': this.noteForm.value.Description
        }]);
      } else if (val[0].children[0] && val[0].name !== this.nameOnClick) {
        this.onSave(val[0].children);
      }
    });
    this.localStorageService.saveItem(this.noteObject, value);
    this.show(JSON.parse(this.getData()));
    this.updateList();
  }
  delete() {
    const remove = this.elementRef.nativeElement.querySelectorAll('.delete');
    let click = Observable.fromEvent(remove, 'click');
    const subscription = click.subscribe(
      (e: any) => {
        this.nameOnClick = e.currentTarget.previousSibling.innerHTML.split('<ul>')[0];
        this.onDelete(JSON.parse(this.getData()));
      });

  }
  onDelete(value) {
    if (this.html) {
      this.html = [];
    }
    this.removeList();
    if (!this.nameOnClick) {
      value.splice(1, 1);
    }
    value.map((val, index) => {
      if (val[0].name === this.nameOnClick) {
        val.splice(index, 1);
      } else if (val[0].children[0] && val[0].name !== this.nameOnClick) {
        this.onDelete(val[0].children);
      }
    });
    this.localStorageService.saveItem(this.noteObject, value);
    this.updateList();
    this.delete();
  }
  find(element) {
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
    let click = Observable.fromEvent(span, 'click');
    const subscription = click.subscribe(
      (e: any) => {
        this.nameOnClick = e.currentTarget.innerHTML.split('<ul>')[0];
        this.find(JSON.parse(this.getData()));
      }
    );

  }
  updateList() {
    const el = document.querySelector('app-note-list');
    el.insertAdjacentHTML('afterbegin', this.html.join(''));
  }
  removeList() {
    const ul = document.querySelector('ul');
    if (ul) {
      ul.parentNode.removeChild(ul);
    }
  }
  show(element) {
    if (!element) {
      return;
    }
    this.html.push('<ul>');
    element.map((val) => {
      this.html.push('<li><i class="unroll">S</i><span>' + val[0].name);
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
}
