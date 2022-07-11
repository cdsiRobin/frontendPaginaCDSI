import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { UsuacService } from '../../services/usuac.service';
import { Usuacpk } from '../../models/usuacpk';
import { Usuac } from '../../models/usuac';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html'
})
export class PedidoComponent implements OnInit {

  nombre: string;
  nomCia: string;
  sMensaje = 5;
  private usuac: Usuac;

  constructor(private router: Router,
     private usuacService: UsuacService,
     private datePipe: DatePipe,
     private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.nombre = sessionStorage.getItem('nombre');
    this.nomCia = sessionStorage.getItem('nomCia');
    this.openSnackBar();
  }
  public openSnackBar(): void {
      this.snackBar.open('Bienvenido '.concat(this.nombre).concat(' a la empresa ').concat(this.nomCia),'Cerrar',
        {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
  }
  // METODO QUE VAMOS A SALIR DEL SISTEMA
  public salir(): void{
    Swal.fire({
      title: 'Estás seguro de cerrar sessión?',
      showDenyButton: true,
      confirmButtonText: 'SI',
      denyButtonText: `NO`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
          this.eliminarAlmacenamientoSession();
      }
    })
  }
  // FIN
  // ELIMINAR ALMACENAMIENTO DE SESSION
  private eliminarAlmacenamientoSession(): void{
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();
    this.actualizarUsuac();
  }
  // FIN
   // ACTUALIZAR EL USUARIO
  private actualizarUsuac(): void{
      const usupk: Usuacpk = new Usuacpk();
      usupk.noCia = sessionStorage.getItem('cia');
      usupk.usuario = sessionStorage.getItem('usuario');
      const usuac = new Usuac();
      usuac.usuacPK = usupk;
      usuac.activo = 'N';
      usuac.modulo = '';
      usuac.salida = this.datePipe.transform(Date.now(), 'yyyy-MM-ddTHH:mm:ss');
      this.usuacService.guardar(usuac).subscribe(data => {
          this.usuac = data;
      }, err =>{
        console.log(err);
      }, () =>{
         Swal.close();
         sessionStorage.clear();
         this.router.navigate(['dashboard/log_arti']);
      });
 }
 // FIN
}
