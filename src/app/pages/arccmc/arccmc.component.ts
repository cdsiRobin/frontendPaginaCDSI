import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ArccmcService } from '../../services/arccmc.service';
import { Empresa } from '../../models/empresa';
import { Persona } from '../../models/persona';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-arccmc',
  templateUrl: './arccmc.component.html'
})
export class ArccmcComponent implements OnInit {

  cia: string;
  centro: string;
  usuario: string;

  rucDni: string;

  fArccmc: FormGroup;

  empresa: Empresa;
  persona: Persona;

  constructor(public arccmcService: ArccmcService) { }

  ngOnInit(): void {
    this.cia = sessionStorage.getItem('cia');
    this.centro = sessionStorage.getItem('centro');
    this.usuario = sessionStorage.getItem('usuario');

    this.iniciarFormulario();
  }

  get f() { return this.fArccmc.controls; }

  public mensajeBuscar(id: string): void{
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Buscando '+id,
      showConfirmButton: false,
      timer: 1500
    });
  }

  public buscarNuevoClienteApi(){
    let cantidad = this.rucDni.length;
    if(cantidad == 11){
      this.arccmcService.buscarClienteRUCApiSunat(this.rucDni).subscribe( value => {
        this.empresa = value;
        this.mensajeBuscar('RUC');
        this.iniciarFormularioEmpresa(this.empresa);
      });
    }
    if(cantidad == 8){
      this.arccmcService.buscarClienteDNIApiSunat(this.rucDni).subscribe( value => {
        //console.log(value);
        this.persona = value;
        this.mensajeBuscar('DNI');
        this.iniciarFormularioPersona(this.persona);
      });
    }
  }

  //FORMULARIO DE PERSONA
  public iniciarFormularioPersona(e: Persona){

    this.fArccmc = new FormGroup({
      cia : new FormControl(this.cia),
      id : new FormControl(e.numeroDocumento),
      nombre : new FormControl(e.nombre),
      direccion : new FormControl(e.direccion),
      ruc : new FormControl(''),
      telefono : new FormControl(''),
      celular : new FormControl(''),
      extranjero : new FormControl('N'), // N
      tipo : new FormControl('N'), // N
      activo : new FormControl('S'),
      web : new FormControl(''),
      pais : new FormControl('001'),
      documento : new FormControl('DNI'),//RUC o DNI
      email : new FormControl(''),
      //DIRECCION
      noCliente : new FormControl(e.numeroDocumento),
      codTienda : new FormControl('001'),
      nombreD : new FormControl('LEGAL'),
      direccionD : new FormControl(`${e.direccion} ${e.distrito}-${e.provincia}-${e.departamento}`),
      telefonoD : new FormControl(''),
      fax : new FormControl(''),
      direOfi : new FormControl(''),
      codiDepa : new FormControl('15'),
      codiProv : new FormControl('01'),
      codiDist : new FormControl('14'),
      tipoDir : new FormControl('LEG'),
      activoD : new FormControl('S'),
      tipoEnti : new FormControl('C'),
      codSuc : new FormControl('001'),
      noCliente1 : new FormControl(''),
      estabSunat : new FormControl('0000'),
    });
  }

  //FORMULARIO EMPRESA
  public iniciarFormularioEmpresa(e: Empresa){
    this.fArccmc = new FormGroup({
      cia : new FormControl(this.cia),
      id : new FormControl(e.numeroDocumento),
      nombre : new FormControl(e.nombre),
      direccion : new FormControl(e.direccion),
      ruc : new FormControl(e.numeroDocumento),
      telefono : new FormControl(''),
      celular : new FormControl(''),
      extranjero : new FormControl('N'), // N
      tipo : new FormControl('J'), // N
      activo : new FormControl('S'),
      web : new FormControl(''),
      pais : new FormControl('001'),
      documento : new FormControl('RUC'),//RUC o DNI
      email : new FormControl(''),
      //DIRECCION
      noCliente : new FormControl(e.numeroDocumento),
      codTienda : new FormControl('001'),
      nombreD : new FormControl('LEGAL'),
      direccionD : new FormControl(`${e.direccion} ${e.distrito}-${e.provincia}-${e.departamento}`),
      telefonoD : new FormControl(''),
      fax : new FormControl(''),
      direOfi : new FormControl(''),
      codiDepa : new FormControl(e.ubigeo.substring(0,2)),
      codiProv : new FormControl(e.ubigeo.substring(-4,2)),
      codiDist : new FormControl(e.ubigeo.substring(-2)),
      tipoDir : new FormControl('LEG'),
      activoD : new FormControl('S'),
      tipoEnti : new FormControl('C'),
      codSuc : new FormControl('001'),
      noCliente1 : new FormControl(''),
      estabSunat : new FormControl('0000'),
    });
  }

  //FORMULARIO ARCCMC
  public iniciarFormulario(){
    this.fArccmc = new FormGroup({
      cia : new FormControl(this.cia),
      id : new FormControl(this.rucDni),
      nombre : new FormControl(''),
      direccion : new FormControl(''),
      ruc : new FormControl(''),
      telefono : new FormControl(''),
      celular : new FormControl(''),
      extranjero : new FormControl('N'), // N
      tipo : new FormControl('J'), // N
      activo : new FormControl('S'),
      web : new FormControl(''),
      pais : new FormControl('001'),
      documento : new FormControl(''),//RUC o DNI
      email : new FormControl(''),
      //DIRECCION
      noCliente : new FormControl(this.rucDni),
      codTienda : new FormControl('001'),
      nombreD : new FormControl('LEGAL'),
      direccionD : new FormControl(''),
      telefonoD : new FormControl(''),
      fax : new FormControl(''),
      direOfi : new FormControl(''),
      codiDepa : new FormControl(''),
      codiProv : new FormControl(''),
      codiDist : new FormControl(''),
      tipoDir : new FormControl('LEG'),
      activoD : new FormControl('S'),
      tipoEnti : new FormControl('C'),
      codSuc : new FormControl('001'),
      noCliente1 : new FormControl(''),
      estabSunat : new FormControl('0000'),
    });
  }


  //METODO PARA GUARDAR EL CLIENTE
  public guardarCliente(){

  }

}
