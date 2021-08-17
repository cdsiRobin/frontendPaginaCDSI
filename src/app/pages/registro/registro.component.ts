import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ValidadorService } from '../../services/validador.service';
import { RolService } from '../../services/rol.service';
import Swal from 'sweetalert2';
import { Rol } from '../../models/rol';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html'
})
export class RegistroComponent implements OnInit {

    formulario: FormGroup;
    roles: Array<Rol> = [];
    rol: Rol;
    public usuario = new Usuario();

    constructor(private fb: FormBuilder, public valiServi: ValidadorService, 
                public rolServi: RolService,
                public usuServi: UsuarioService, public servi: AuthService ) {
      this.validarFormulario();
    }

    ngOnInit() {
      this.getAllRoles();
    }

    // CAPTURAR LOS ROLES
    public getAllRoles() {
      this.rolServi.getListaRoles().subscribe( rest => {
        // console.log(rest);
        this.roles = rest;
      },
      (err) => {
         console.warn(err.error);
        /*
        Swal.fire({
          icon: 'error',
          title: `Error en los roles`
        });
        */
      });
    }

    get validarUsername(): boolean {
      return this.formulario.get('username').invalid && this.formulario.get('username').touched;
    }
    get validarPassword(): boolean {
      return this.formulario.get('password').invalid && this.formulario.get('password').touched;
    }
    get validarRol(): boolean {
      return this.formulario.get('rol').invalid && this.formulario.get('rol').touched;
    }
    get validarAuthority(): boolean {
      return this.formulario.get('authority').invalid && this.formulario.get('authority').touched;
    }
    get validarRoles(): boolean {
      return (this.Roles.length === 0) ? false : true;
    }
    get Roles() {
      return this.formulario.get('sRoles') as FormArray;
    }
    get validarPassword2(): boolean {
      const pass1 = this.formulario.get('password').value;
      const pass2 = this.formulario.get('password2').value;
      return (pass1 === pass2) ? false : true;
    }
    // DESDE EL EVENTO SELECT
    agregarRoles() {
      const srol = this.formulario.get('rol').value;
      const rolesFormGroup = this.fb.group(srol);
      if (this.Roles.length === 0 || this.Roles.length === 1) {
          this.Roles.push(rolesFormGroup);
      } else {
        let i = 0;
        for ( let r of this.Roles.value) {
            if ( r.authority === srol) { i++; }
        }
        if (i === 0) { this.Roles.push(rolesFormGroup); }
      }
    }

    eliminarRol(i: number): void {
        this.Roles.removeAt(i);
    }
    private validarFormulario(): void {
        this.formulario = this.fb.group({
          username: ['', [Validators.required, Validators.minLength(3)]],
          password: ['', [Validators.required, Validators.minLength(3)]],
          password2: ['', Validators.required],
          rol: ['', Validators.required],
          sRoles: this.fb.array([])
        }, {
          validators: this.valiServi.passwordsIguales('password', 'password2')
        });
    }

    // METODO QUE NOS PERMITE GUARDAR
    public guardar(): void {
      if (this.formulario.invalid) {
        return Object.values(this.formulario.controls).forEach( control => {
          control.markAsTouched();
        });
      }
      // console.log(this.formulario.value);
      // this.usuario = new Usuario();
      // console.warn(this.formulario.value);
      this.usuario.username = this.formulario.get('username').value;
      this.usuario.password = this.formulario.get('password').value;
      this.usuario.cia = this.servi.usuario.cia;
      this.usuario.enabled = 1;
      this.usuario.email = 'usuario@cdsi.com.pe';
      this.usuario.roles = this.formulario.get('sRoles').value;
      // console.log(this.usuario);
      // MENSAJE DE VERIFICACIÓN CUANDO HACE UN REGISTRO DE USUARI
      Swal.fire({
        title: `Está seguro de registrar el usuario ${this.usuario.username}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'SI'
      }).then((result) => {
        if (result.value) {
          this.usuServi.saveUsuario(this.usuario).subscribe(
            json => {
              // MENSAJE DE CONFIRMACION CUANDO SE REGISTRA
              Swal.fire({
                position: 'center',
                icon: 'success',
                text: json.mensaje,
                showConfirmButton: false,
                timer: 2000
              });
              this.formulario.reset({});
            },
            err => {
              Swal.fire({
                position: 'center',
                icon: 'error',
                text: err.error.mensaje,
                showConfirmButton: false,
                timer: 2000
              });
              console.error('Código del error desde el backend: ' + err.status);
              console.error(err.error);
            }
          );
        }
      });
    }

}
