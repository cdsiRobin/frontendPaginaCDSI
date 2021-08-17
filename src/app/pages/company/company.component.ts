import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyService } from '../../services/company.service';
import { Company } from '../../models/company';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-company',
    templateUrl: './company.component.html'
})
export class CompanyComponent implements OnInit {

  // VARIABLES
  formulario: FormGroup;
  public cias: Company[];

  constructor(private fb: FormBuilder, public servi: CompanyService, private router: Router) {
    this.validarFormulario();
  }

  ngOnInit() {
    this.getCias();
  }
  // VALIDAR CAMPOS DEL FORMULARIO
  private validarFormulario(): void {
    this.formulario = this.fb.group({
      company: ['', Validators.required]
    });
  }

  get validarRol(): boolean {
    return this.formulario.get('company').invalid && this.formulario.get('company').touched;
  }

  // EVENTO PARA EL BOTON INGRESAR
  onSumit() {
    if (this.formulario.invalid) {
      return Object.values(this.formulario.controls).forEach( control => {
        /* if ( control instanceof FormGroup ){
           Object.values( control.controls ).forEach( cont => cont.markAllAsTouched() );
        } */
        control.markAsTouched();
      });
    }
    console.log(this.formulario.value);
    sessionStorage.setItem('cia', this.formulario.get('company').value);
    // sessionStorage.setItem('rs', comp.razonSocial);
    this.router.navigateByUrl('/home'); // NAVEGA HACIA EL HOME
  }
  // METODO QUE NOS PERMITE SELECCIONAR LA COMPAÑIA
  public getCias() {
      this.servi.getListaCias().subscribe( (rest: Company[]) => {
        this.cias = rest;
      },
      (err) => {
        Swal.fire({
          icon: 'warning',
          title: `Refrescar la pantalla(F5)`
        });
      });
  }

}
