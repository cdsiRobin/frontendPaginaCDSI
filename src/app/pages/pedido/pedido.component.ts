import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit {

  nombre: string;
  nomCia: string;

  constructor(private router: Router, public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.nombre = sessionStorage.getItem('nombre');
    this.nomCia = sessionStorage.getItem('nomCia');
  }
  regresar() {
    this.router.navigateByUrl('/log_arti');
  }
  genera(){

  }
}
