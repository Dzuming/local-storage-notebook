//On click = take object name
//TODO - resetowanie wyboru;
//TODO - Odświeżanie;
//TODO - Przy pustym jsonie wyskakuje formError
//TODO - Problem z wyborem rodzica
//TODO - Usuwanie z listy
//TODO - rozwijanie listy po kliknieciu na przycisk

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
  public noteObject: string = "noteObject";
  public html = [];
  public noteForm: FormGroup;
  public Description: string;
  public nameOnClick: string = "";
  private formErrors = {
    'Name': '',
    'Description': '',
  };

  constructor(private formBuilder: FormBuilder, private localStorageService: LocalStorageService, private elementRef: ElementRef) { }

  ngOnInit() {
    this.buildForm();
    this.show(JSON.parse(this.getData()));
    let el = document.querySelector('app-note-list')
    el.insertAdjacentHTML('afterbegin', this.html.join(''))
  }
  ngAfterViewInit() {

    this.clickableElementToFind()

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
    let value: Array<Object> = JSON.parse(this.getData()) || [];
    // value.map((element)=> {

    //  this.localStorageService.saveItem(this.noteObject, value)
    //   if (Object.keys(element[0].children).length !== 0 && element[0].children.constructor === Object) {
    //     console.log(element[0].children)
    //   }

    // })
    // for(var prop in value[0]["test5"]) {
    //   if( value[0].hasOwnProperty(prop) && typeof value[0][prop] === 'object' ) {
    //   }
    //   console.log(prop)
    // }
    // value[0][0].children.push([{
    //   "name": this.noteForm.value.Name,
    //   "children": {},
    //   "Description": this.noteForm.value.Description
    // }])
    this.onSave(value);

    // let ul = document.querySelector('ul')
    //   ul.parentNode.removeChild(ul);
    //   if (ul.innerHTML !== "") {
    //     this.show(JSON.parse(this.getData()))
    //   }

  }
  onSave(value) {
    if (!this.nameOnClick) {
      value.push([{
        "name": this.noteForm.value.Name,
        "children": [],
        "Description": this.noteForm.value.Description
      }])
    }
    value.map((val, index) => {
      if (val[0].name === this.nameOnClick) {
        val[0].children.push([{
          "name": this.noteForm.value.Name,
          "children": [],
          "Description": this.noteForm.value.Description
        }])
      } else if (val[0].children[0] && val[0].name !== this.nameOnClick) {
        this.onSave(val[0].children)
      }
    })
    console.log(value)
    this.localStorageService.saveItem(this.noteObject, value)
  }
  find(element) {
    element.map((val) => {
      if (val[0].name === this.nameOnClick) {
        this.Description = val[0].Description;
      } else if (val[0].children[0] && val[0].name !== this.nameOnClick) {
        this.find(val[0].children)
      }
    })
  }
  clickableElementToFind() {
    let li = this.elementRef.nativeElement.querySelectorAll('li');
    let clickFlag: boolean = false;
    let click = Observable.fromEvent(li, 'click');
    let subscription = click.subscribe(
      (e: any) => {
        if (!clickFlag) {
          this.nameOnClick = e.currentTarget.innerHTML.split("<ul>")[0];
          console.log(this.nameOnClick.split("<ul>")[0])
          this.find(JSON.parse(this.getData()))
          return clickFlag = true;
        } else {


          return clickFlag = false;
        }

      })

  }
  show(element) {
    this.html.push('<ul>');
    element.map((val) => {
      this.html.push('<li>' + val[0].name);
      if (val[0].children[0]) {
        this.show(val[0].children)
      }
      this.html.push('</li>');
    })
    this.html.push('</ul>');

  }
  getData() {
    return this.localStorageService.getItem(this.noteObject)
  }
}
