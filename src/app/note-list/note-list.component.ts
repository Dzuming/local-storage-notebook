//On click = take object name
import { Component, OnInit, ElementRef, Renderer, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { LocalStorageService } from '../shared/local-storage.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.css'],
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
    
    this.testObserver()

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
    value[0][0].children.push([{
      "name": this.noteForm.value.Name,
      "children": {},
      "Description": this.noteForm.value.Description
    }])
    // value.push([{
    //   "name": this.noteForm.value.Name,
    //   "children": {},
    //   "Description": this.noteForm.value.Description
    // }])
    this.localStorageService.saveItem(this.noteObject, value)
    // let ul = document.querySelector('ul')
    //   ul.parentNode.removeChild(ul);
    //   if (ul.innerHTML !== "") {
    //     this.show(JSON.parse(this.getData()))
    //   }

  }
  find(element) {
    element.map((val) => {
      if (val[0].name === this.nameOnClick) {
        this.Description = val[0].Description;
      } else if (val[0].children[0] && val[0].name !== "dawid") {
        this.find(val[0].children)
      }
    })
  }
  click() {
    this.test()
    
    return 
  }
  testObserver() {
    let li = this.elementRef.nativeElement.querySelectorAll('li')
    let click = Observable.fromEvent(li, 'click');
    let subscription  = click.subscribe(
      (e:any) => {
              this.nameOnClick = e.currentTarget.innerHTML;
        this.find(JSON.parse(this.getData()))},
      error => console.log("eee"),
      () => console.log("ecd")
    )
  }
  test(): Observable<any> {
    let li = this.elementRef.nativeElement.querySelectorAll('li')
    return this.elementRef.nativeElement.addEventListener('click', function (e) {
      
      // this.find();
      // console.log("test")
    }, false);

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
