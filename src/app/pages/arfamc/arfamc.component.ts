import { Component, OnInit } from '@angular/core';
import { Arfamc } from '../../models/arfamc';
import { ArfamcService } from '../../services/arfamc.service';
import Swal from 'sweetalert2';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-arfamc',
  templateUrl: './arfamc.component.html'
})
export class ArfamcComponent implements OnInit {
  arfamc: Arfamc;
  fArfamc: FormGroup;
  cia: string;
  nombre: string;
  usuario: string;
  codEmp: string;
  centro: string

  constructor(private arfamcService: ArfamcService,
    private router: Router) { }

  ngOnInit(): void {
    this.iniciarFormulario();
    this.optenerValoresSession();
    this.getArfamc();
  }

  get f() { return this.fArfamc.controls;}

  // VAMOS A TRAER LOS DATOS DE LA EMPRESA
  private getArfamc(): void{
    this.mensajeEspera();
    this.arfamc = new Arfamc();
    this.arfamcService.buscarId(this.cia).subscribe( result => {
      this.arfamc = result;
    }, err =>{
       console.log(err);
       Swal.fire('Error al traer los datos de la empresa.');
    }, () => { Swal.close();
        this.iniciarArfamcFormulario();
    } );
  }
  // FIN
  // MENSAJE DE ESPERA
  private mensajeEspera(): void{
    Swal.fire({
      allowOutsideClick: false, // CLICK FUERA
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();
  }
  // FIN
  // TREAER DATOS DEL ALMACENAMIENTO DE SESSION
  private optenerValoresSession(): void {
    this.cia = sessionStorage.getItem('cia');
    this.nombre = sessionStorage.getItem('nombre');
    this.usuario = sessionStorage.getItem('usuario');
    this.codEmp = sessionStorage.getItem('codEmp');
    this.centro = sessionStorage.getItem('centro');
  }
  // FIN
  // EVENTO ACTUALIZAR
  public actualizar(): void {
    Swal.fire({
      title: 'Está Seguro de Actualizar?',
      showDenyButton: true,
      confirmButtonText: 'SI'
    }).then((result) => {
      if (result.isConfirmed) {
          this.llenarValores();
      }
    });
  }
  // FIN
  // LLENAR VALORES PARA ACTUALIZAR
  private llenarValores(): void {
     const arfamc = new Arfamc();
     arfamc.cia = this.fArfamc.value.cia;
     arfamc.nombre = this.fArfamc.value.nombre;
     arfamc.nombreAno = this.fArfamc.value.nombreAno;
     arfamc.ruc = this.fArfamc.value.ruc;
     arfamc.email = this.fArfamc.value.email;
     arfamc.banco = this.fArfamc.value.banco;
     arfamc.cuentaSol = this.fArfamc.value.cuentaSol;
     arfamc.cuentaDol = this.fArfamc.value.cuentaDol;
     arfamc.descripcion = this.fArfamc.value.descripcion;

     this.arfamcService.update(arfamc).subscribe(result => {
        this.arfamc = result;
     }, err => Swal.fire('Error al Actualizar los datos.')
     , () => {
       Swal.fire('Se Actualizo Correctamente. Se va salir del sistema para actualizar los datos', '', 'success');
       sessionStorage.clear();
       this.router.navigate(['dashboard/log_arti']);
     });
  }
  // FIN
  //INICIAR FORMULARIO
  private iniciarFormulario(){
    this.fArfamc  = new FormGroup({
      cia : new FormControl(''),
      nombre : new FormControl({value: '', disabled: false },
             [ Validators.required ,Validators.minLength(5)]),
      nombreAno : new FormControl(''),
      ruc: new FormControl({value: '', disabled: false },
        [Validators.required ,Validators.minLength(11), Validators.pattern(/^-?(0|[0-9]\d*)?$/)]),
      email: new FormControl({value: '', disabled: false },
        [Validators.minLength(3), Validators.email]),
      banco : new FormControl(''),
      cuentaSol : new FormControl(''),
      cuentaDol : new FormControl(''),
      descripcion : new FormControl('')
    });
  }
  // FIN
  //INICIAR FORMULARIO
  private iniciarArfamcFormulario(){
    this.fArfamc  = new FormGroup({
      cia : new FormControl(this.cia),
      nombre : new FormControl({value: this.arfamc.nombre, disabled: false },
             [ Validators.required ,Validators.minLength(5)]),
      nombreAno : new FormControl(this.arfamc.nombreAno),
      ruc: new FormControl({value: this.arfamc.ruc, disabled: false },
        [Validators.required ,Validators.minLength(11), Validators.pattern(/^-?(0|[0-9]\d*)?$/)]),
      email: new FormControl({value: this.arfamc.email, disabled: false },
        [Validators.minLength(3), Validators.email]),
      banco : new FormControl(this.arfamc.banco),
      cuentaSol : new FormControl(this.arfamc.cuentaSol),
      cuentaDol : new FormControl(this.arfamc.cuentaDol),
      descripcion : new FormControl(this.arfamc.descripcion)
    });
  }
  // FIN


}
