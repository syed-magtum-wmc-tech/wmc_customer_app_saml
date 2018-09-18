import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { Injectable } from '@angular/core';

/*
  Generated class for the UtilServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UtilServiceProvider {

  constructor(public http: HttpClient) {
    console.log('Hello UtilServiceProvider Provider');
  }

  public validateAllFormFields(formGroup: FormGroup) {         
    Object.keys(formGroup.controls).forEach(field => {  
      const control = formGroup.get(field);             
      if (control instanceof FormControl) {             
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {        
        this.validateAllFormFields(control);            
      }
      else if (control instanceof FormArray) {
        for (var i = 0; i < control.controls.length; i++) {
          this.validateAllFormFields(control.controls[i] as FormGroup);
        }
      }
    });
  }

}
