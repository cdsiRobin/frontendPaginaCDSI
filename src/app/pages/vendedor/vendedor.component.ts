import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vendedor',
  templateUrl: './vendedor.component.html',
  styles: [
  ]
})
export class VendedorComponent implements OnInit {
  nombre: string;
  nomCia: string;
  centro: string;
  codEmp: string;
  usuario: string;
  cod: string;
  constructor() {
  }

  ngOnInit(): void {
    this.nombre = sessionStorage.getItem('nombre');
    this.nomCia = sessionStorage.getItem('nomCia');
    this.centro = sessionStorage.getItem('centro');
    this.codEmp = sessionStorage.getItem('codEmp');
    this.usuario = sessionStorage.getItem('usuario');
    this.cod = sessionStorage.getItem('cod');
    setTimeout(() => {
      this.nombre = sessionStorage.getItem('nombre');
      this.nomCia = sessionStorage.getItem('nomCia');
      this.centro = sessionStorage.getItem('centro');
      this.codEmp = sessionStorage.getItem('codEmp');
      this.usuario = sessionStorage.getItem('usuario');
      this.cod = sessionStorage.getItem('cod');
      }, 2000
    );
  }

}
