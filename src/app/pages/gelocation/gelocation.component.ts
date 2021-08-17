import { Component, OnInit } from '@angular/core';
import { OtherService } from '../../services/other.service';
import { GelocationService } from '../../services/gelocation.service';
import { Gelocation } from '../../models/gelocation';
import { Usuario } from '../../models/usuario';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gelocation',
  templateUrl: './gelocation.component.html'
})
export class GelocationComponent implements OnInit {
  // VARIABLES
  public gelocation = new Gelocation();
  formulario: FormGroup;

  constructor(private fb: FormBuilder , public other: OtherService, public serviGelo: GelocationService, private router: Router) {}

  ngOnInit() {
    this.getGeloByCiaAndUser();
    // this.validarFormulario();
  }
  public guardar() {
    if (this.formulario.invalid) {
      return Object.values(this.formulario.controls).forEach( control => {
        control.markAsTouched();
      });
    }
    let gelocation = new Gelocation();
    gelocation.id = this.formulario.get('id').value;
    gelocation.usuario = this.formulario.get('usuario').value;
    gelocation.longitud = this.formulario.get('longitud').value;
    gelocation.latitud = this.formulario.get('latitud').value;
    gelocation.dni = this.formulario.get('dni').value;
    gelocation.codEmp = this.formulario.get('codEmp').value;
    gelocation.direccion = this.formulario.get('direccion').value;
    gelocation.urbanizacion = this.formulario.get('urbanizacion').value;
    gelocation.ubigeo = this.formulario.get('ubigeo').value;
    gelocation.estado = this.formulario.get('estado').value;
    // MENSAJE DE VERIFICACIÓN CUANDO HACE UN REGISTRO DE USUARIO
    Swal.fire({
      title: `Está seguro de actualizar la geolocalización ${gelocation.usuario}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.value) {
        this.serviGelo.update(gelocation)
          .subscribe(
            json => {
              Swal.fire('Se ha Actualizado', `${json.mensaje}`, 'success');
              this.router.navigateByUrl('/home'); // NAVEGA HACIA GEOLOCALIZACION
            },
            err => {
              // this.errores = err.error.errors as string[];
              console.error('Código del error desde el backend: ' + err.status);
              console.error(err.error.errors);
            }
          );
      }
    });
  }

  private validarFormulario(gelo: Gelocation): void {
    if (gelo.longitud == null) {
        gelo.longitud = sessionStorage.getItem('lng');
    }
    if (gelo.latitud == null) {
        gelo.latitud = sessionStorage.getItem('lat');
    }
    this.formulario = this.fb.group( {
      id: [gelo.id, Validators.required],
      usuario: [gelo.usuario, [Validators.required]],
      codEmp: [gelo.codEmp, [Validators.required]],
      dni: [gelo.dni, Validators.required],
      longitud: [gelo.longitud, Validators.required],
      latitud: [gelo.latitud, Validators.required],
      estado: [gelo.estado, Validators.required],
      direccion: [gelo.direccion, Validators.required],
      ubigeo: [gelo.ubigeo, Validators.required],
      urbanizacion: [gelo.urbanizacion, Validators.required],
    });
  }
  get validarUsername(): boolean {
    return this.formulario.get('usuario').invalid && this.formulario.get('usuario').touched;
  }
  get validarCodEmp(): boolean {
    return this.formulario.get('codEmp').invalid && this.formulario.get('codEmp').touched;
  }
  get validarDni(): boolean {
    return this.formulario.get('dni').invalid && this.formulario.get('dni').touched;
  }
  get validarLongitud(): boolean {
    return this.formulario.get('longitud').invalid && this.formulario.get('longitud').touched;
  }
  get validarLatitud(): boolean {
    return this.formulario.get('latitud').invalid && this.formulario.get('latitud').touched;
  }
  get validarEstado(): boolean {
    return this.formulario.get('estado').invalid && this.formulario.get('estado').touched;
  }
  get validarDireccion(): boolean {
    return this.formulario.get('direccion').invalid && this.formulario.get('direccion').touched;
  }
  get validarUbigeo(): boolean {
    return this.formulario.get('ubigeo').invalid && this.formulario.get('ubigeo').touched;
  }
  get validarUrbanizacion(): boolean {
    return this.formulario.get('urbanizacion').invalid && this.formulario.get('urbanizacion').touched;
  }
    // METODOS QUE TRAE LOS DATOS DE LA GEOLOCALIZACION DEL USUARIO POR COMPAÑIA
  getGeloByCiaAndUser() {
      let usuario = new Usuario();
      usuario = JSON.parse(sessionStorage.getItem('usuario'));
      this.serviGelo.getGelocation(usuario).subscribe(
        rest => {
          // this.gelocation = new Gelocation();
          this.gelocation = rest;
          this.validarFormulario(this.gelocation);
          // console.log(this.gelocation);
          // this.validarFormulario(this.gelocation);
        }
      );
  }

}
