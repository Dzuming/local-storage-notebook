//On click = take object name
import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl, FormBuilder, Validators } from '@angular/forms';
import { LocalStorageService} from '../shared/local-storage.service';
@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.css'],
  providers: [LocalStorageService]
})

export class NoteListComponent implements OnInit {
    public noteObject:string = "noteObject";
    public html = [];
    public noteForm: FormGroup;
    private formErrors = {
        'Name': '',
        'Description': '',
    };
  constructor(private formBuilder: FormBuilder, private localStorageService: LocalStorageService) { }

  ngOnInit() {
    this.buildForm();
    this.show(JSON.parse(this.getData()));
     let el = document.querySelector('body')
    el.insertAdjacentHTML('afterbegin', this.html.join(''))
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
        // this.loginForm.valueChanges
        //     .subscribe(data => this.onValueChanged(data));

        // this.onValueChanged();

    }
  save() {
    let value:Array<Object> = JSON.parse(this.getData()) || [];
    value.map((element)=> {
      //Check if chosen name is equal
      if (Object.keys(element[0].children).length !== 0 && element[0].children.constructor === Object) {
        console.log(element[0].children)
      }
      
    })
    // for(var prop in value[0]["test5"]) {
    //   if( value[0].hasOwnProperty(prop) && typeof value[0][prop] === 'object' ) {
    //   }
    //   console.log(prop)
    // }
    value[value.length] = [{
      "name": this.noteForm.value.Name,
      "children": {},
      "Description": this.noteForm.value.Description
    }]
    this.localStorageService.saveItem(this.noteObject, value)
    let ul = document.querySelector('ul')
      ul.parentNode.removeChild(ul);
      if (ul.innerHTML !== "") {
        this.show(JSON.parse(this.getData()))
      }
     
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
