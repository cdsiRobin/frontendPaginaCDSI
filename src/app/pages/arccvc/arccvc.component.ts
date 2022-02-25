import { Component, OnInit } from '@angular/core';
import { ArccvcService } from '../../services/arccvc.service';
import { Arccvc } from '../../models/Arccvc';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { IdArccvc } from '../../models/IdArccvc';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ArpfoeService } from '../../services/arpfoe.service';

@Component({
  selector: 'app-arccvc',
  templateUrl: './arccvc.component.html'
})
export class ArccvcComponent implements OnInit {
  arccvc: Arccvc;
  fArccvc: FormGroup;
  cia: string;
  codEmp: string;
  nombre: string;

  constructor(private arpfoeService: ArpfoeService) { }

  ngOnInit(): void {
    this.cia = sessionStorage.getItem('cia');
    this.codEmp = sessionStorage.getItem('cod');
    this.nombre = sessionStorage.getItem('nombre');
    this.iniciarFormulario();
  }
  // MIDIFICAR
  public modificar(): void{
    if(this.fArccvc.get('pass').value === this.fArccvc.get('vpass').value ){
       this.llenarValoresArccvc();
    }else{
      Swal.fire('Password no son iguales');
    }
  }
  // FIN
  get f() { return this.fArccvc.controls; }
  // INICIAR FORMULARIO
  public iniciarFormulario(): void {
    this.fArccvc = new FormGroup({
      cia : new FormControl({value: this.cia, disabled: true },[Validators.required, Validators.minLength(2)]),
      codigo : new FormControl({value: this.codEmp, disabled: true },[Validators.required, Validators.minLength(2)]),
      descripcion : new FormControl({value: this.nombre.toUpperCase(), disabled: false },[Validators.required, Validators.minLength(5)]),
      pass : new FormControl({value: '', disabled: false },[Validators.required, Validators.minLength(2)]),
      vpass : new FormControl({value: '', disabled: false },[Validators.required, Validators.minLength(2)]),
    });
  }
  // fin
  // LLENAR VALORES ARCCVC
  private llenarValoresArccvc(): void {
    const arccvcpk = new IdArccvc();
    arccvcpk.cia = this.cia;
    arccvcpk.codigo = this.codEmp;
    this.arccvc = new Arccvc();
    this.arccvc.idArc = arccvcpk;
    this.arccvc.descripcion = this.fArccvc.get('descripcion').value;
    this.arccvc.pass = this.fArccvc.get('pass').value;
    // MODIFICAR
    this.arpfoeService.modificarArccvc(this.arccvc).subscribe(a => {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'SE MODIFICO CORRECTAMENTE',
        showConfirmButton: false,
        timer: 1500
      });
    });
  }

}
