import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
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
      this.snackBar.open('Bienvenido '.concat(this.nombre).concat(' a la empresa ').concat(this.nomCia),'Done',
        {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
  }
}
