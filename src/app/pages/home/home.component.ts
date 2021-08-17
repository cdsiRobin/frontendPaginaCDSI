import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Usuario } from '../../models/usuario';
import { GelocationService } from '../../services/gelocation.service';
import { Router } from '@angular/router';
import { timer } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  horaActualImp: string;
  DiaActualImp: string;

  hora: number;
  minuto: number;
  segundo: number;

  horas: string;
  minutos: string;
  segundos: string;
  ampm: string;

  semana: string[] = ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'];
  meses: string[] = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

  constructor(public serviGelo: GelocationService,public authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.mensajeGelocalizacion();
    this.mostrarDiaSeman();
    this.mostrarHoraActual();
  }
  public mensajeGelocalizacion(): void {
      let usuario = new Usuario();
      usuario = JSON.parse(sessionStorage.getItem('usuario'));
      this.serviGelo.getGelocation(usuario).subscribe(
        rest => {
          // console.log(rest);
          if (rest.longitud == null || rest.latitud == null ) {
              Swal.fire(`Hola ${rest.usuario}, necesita actualizar su geolocalización.`);
              this.router.navigateByUrl('/gelocation'); // NAVEGA HACIA GEOLOCALIZACION
          }

        }
      );
  }
  // METODO QUE NOS BRINDA EL MENSAJE DE BIENVENIDA
  public getMensaje() {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });
    Toast.fire({
      icon: 'success',
      title: sessionStorage.getItem('mesaje')
    });
  }
  mostrarDiaSeman(){
    let horaActual = new Date();

    const diaSemana = horaActual.getDay();
    const dia = horaActual.getDate();
    const mes = horaActual.getMonth();
    const anio = horaActual.getFullYear();
    this.DiaActualImp = `${this.semana[diaSemana]} ${dia} ${this.meses[mes]} ${anio}`;
  }
  // FUNCION QUE NOS VA PERMITIR MOSTRAR LA HORA ACTUAL
  mostrarHoraActual(){
    let horaActual = new Date();

    this.hora = horaActual.getHours();
    this.minuto = horaActual.getMinutes();
    this.segundo = horaActual.getSeconds();

    if(this.hora < 10) { 
      this.horas = '0' + this.hora; 
    }else{
      this.horas = this.hora.toString();
    }
    
    if(this.minuto < 10) { 
      this.minutos = '0' + this.minuto; 
    }else{
      this.minutos = this.minuto.toString();
    }

    if(this.segundo < 10) { 
      this.segundos = '0' + this.segundo; 
    }else{
      this.segundos = this.segundo.toString();
    }

    if( this.hora>=12){
      this.hora = this.hora - 12;
      if(  this.hora == 0){
        this.hora = 12;
      }
      this.horas = this.hora.toString();
      this.ampm = "PM";
    }else{
      this.ampm = "AM";
    }

    this.horaActualImp = `${this.horas} : ${this.minutos} : ${this.segundos} ${this.ampm}`;

    const contador = timer(1000);
    contador.subscribe( () => this.mostrarHoraActual() )
  }

  // SALIR DEL REGISTRO DE ASISTENCIA
  logout(): void {
    let username = this.authService.usuario.username;
    Swal.fire({
      title: `Está seguro de cerrar sesión ${username}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.value) {
        // this.other.limpiar();
        this.authService.logout();
        this.router.navigateByUrl('/dashboard/reg_asis');
      }
    });
  }

}// FIN
