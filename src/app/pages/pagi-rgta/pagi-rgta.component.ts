import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pagi-rgta',
  templateUrl: './pagi-rgta.component.html'
})
export class PagiRgtaComponent implements OnInit {
  @Input() paginador: any;
  paginas: number[];
  constructor() { }

  ngOnInit() {
    this.paginas = new Array(this.paginador.totalPages).fill(0).map((valor, indice) => indice + 1);
  }

}

