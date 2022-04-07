import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html'
})
export class PedidoComponent implements OnInit {

  nombre: string;
  nomCia: string;
  sMensaje = 5;

  constructor(private router: Router, public route: ActivatedRoute,private snackBar: MatSnackBar) { }

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
    sessionStorage.clear();
    this.router.navigate(['dashboard/log_arti']);
  }
  // FIN
}
