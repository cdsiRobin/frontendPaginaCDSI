import { Component, Input, Output, EventEmitter } from '@angular/core';
import { renderFlagCheckIfStmt } from '@angular/compiler/src/render3/view/template';

@Component({
  selector: 'app-ingrementador',
  templateUrl: './ingrementador.component.html',
  styles: [
  ]
})
export class IngrementadorComponent {

  @Input("valor") progreso: number = 50;
  @Input() btnClass: String = 'btn btn-primary';

  @Output() valorSalida: EventEmitter<number> = new EventEmitter();

  constructor() { }

  cambiarValor(valor: number) {
    this.progreso = this.progreso + valor;
    this.valorSalida.emit(this.progreso);
  }

  onChange(nuevoValor: number){
    if(nuevoValor >= 100){
        this.progreso = 100;
    }else if(nuevoValor <= 0) {
        this.progreso = 0;
    }else{
      this.progreso = nuevoValor;
    }
    this.valorSalida.emit( this.progreso );
  }

}
