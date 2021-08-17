import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  public usuario: Usuario;
  recordar = false;

  public lat: number;
  public lng: number;

  constructor( public servi: AuthService, private router: Router) { }

  ngOnInit() {
    // OBTENER LA UBICACION
    this.getGeolocalizacion();
    this.usuario = new Usuario();
    if (localStorage.getItem('usuario')) {
        this.usuario.username = sessionStorage.getItem('user');
        this.recordar = true;
    }
  }
  // EVENTO PARA EL BOTON INGRESAR
  onSumit(form: NgForm) {
    // Swal.fire(`Latitud : ${sessionStorage.getItem('lat')} , Longuitud : ${sessionStorage.getItem('lng')}`);
    
    if (form.invalid) {
      return;
    }
    // ALERTA
    Swal.fire({
      allowOutsideClick: false, // CLICK FUERA
      icon: 'info',
      text: 'Espere por favor...'
    });

    Swal.showLoading();

    if (sessionStorage.getItem('lat') && sessionStorage.getItem('lng') ) { // SI ACEPTO DAR SU UBICACION
      this.servi.login(this.usuario).subscribe( rest => {
        Swal.close(); // SE CIERRA EL MENSAJE
        this.servi.guardarUsuario(rest.access_token);
        this.servi.guardarToken(rest.access_token);
        this.router.navigateByUrl('/dashboard/home'); // NAVEGA HACIA EL HOME
      }, err => {
        if (err.status == 400) {
           console.error(err);
           Swal.close(); // SE CIERRA EL MENSAJE
           Swal.fire({
            allowOutsideClick: false, // CLICK FUERA
            icon: 'info',
            title: 'Usuario o Clave incorrecta !!'
          });
        }
      });
    } else {
       Swal.close(); // SE CIERRA EL MENSAJE
      // ALERTA
       Swal.fire({
         allowOutsideClick: false, // CLICK FUERA
         icon: 'info',
         title: 'Debe permitir acceder a su ubicación.'
       });
       // OBTENER LA UBICACION
       this.getGeolocalizacion();
    }

  }
  // METODO QUE NOS PERMITE SABER LA UBICACION DEL USUSARIO
  public getGeolocalizacion() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition( position => {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          // GUARDAR LAS UBICACIONES
          sessionStorage.setItem('lat', this.lat.toString());
          sessionStorage.setItem('lng', this.lng.toString());
      } );
    }

  }

}