import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidadorService {

  constructor() { }

  public passwordsIguales(pass1: string, pass2: string) {
    return ( formGrup: FormGroup ) => {
      const controlPass1 = formGrup.controls[pass1];
      const controlPass2 = formGrup.controls[pass2];
      if ( controlPass1.value === controlPass2.value ) {
        controlPass2.setErrors(null);
      } else {
        controlPass2.setErrors({noEsigual: true});
      }
    };
  }

}
