import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ArccmcService } from '../../services/arccmc.service';
import { Empresa } from '../../models/empresa';
import { Persona } from '../../models/persona';
import Swal from 'sweetalert2';
import { Arccdp } from '../../models/arccdp';
import { Arccpr } from '../../models/arccpr';
import { Arccdi } from '../../models/arccdi';
import { Observable } from 'rxjs';
import { Arccmc } from '../../models/Arccmc';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ArcctdaEntity } from '../../models/arcctda-entity';
import { IdArccmc } from '../../models/IdArccmc';
import { ArcctdaPKEntity } from '../../models/arcctda-pkentity';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-arccmc',
  templateUrl: './arccmc.component.html'
})
export class ArccmcComponent implements OnInit {

  cia: string;
  centro: string;
  usuario: string;

  rucDni: string;
  rznombre: string;

  fArccmc: FormGroup;

  empresa: Empresa;
  persona: Persona;

  arccdp: Arccdp;
  arccdps: Arccdp[] = [];
  arccpr: Arccpr;
  arccprs: Arccpr[] = [];
  arccdi: Arccdi;
  arccdis: Arccdi[] = [];

  arccmcObservable: Observable<Arccmc[]>;
  arccmc: Arccmc;

  public arcctdas: ArcctdaEntity[] = [];
  public arcctda: ArcctdaEntity;

  public depar: string = '15';
  public prov: string = '01';
  public distr: string = '14';

  constructor(private snackBar: MatSnackBar,
    public arccmcService: ArccmcService) { }

  ngOnInit(): void {
    this.cia = sessionStorage.getItem('cia');
    this.centro = sessionStorage.getItem('centro');
    this.usuario = sessionStorage.getItem('usuario');

    this.iniciarFormulario();
    this.traerDepartamentosXcia();

  }

  //BUSCAMOS CLIENTES POR SU NOMBRE O RAZON SOCIAL
  public buscarClienteXnombre(e: any){
    let nombre: string = e.target.value;
    this.arccmcObservable = this.arccmcService.listaClientesDescripLike(this.cia,nombre.toUpperCase().trim());
  }

  //SELECCIONAMOS UN CLIENTE POR SU NOMBRE O RAZON SOCIA
  public seleccionarClienteXdescrip($event: MatAutocompleteSelectedEvent){
     this.arccmc = $event.option.value;
     this.rucDni = this.arccmc.objIdArc.id;
     this.rznombre = this.arccmc.nombre;

     this.iniciarFormularioArccmc(this.arccmc);
     //this.arcctdas = this.arccmc.arcctdaEntity;
  }

  get f() { return this.fArccmc.controls; }

  public traerDepartamentosXcia(){
    this.arccmcService.listarDepartXcia(this.cia).subscribe( data =>{
       this.arccdps = data;
    });
  }

  //SELECCIONAR DEPARTAMENTOS POR COMPAÑIA
  public seleccionarDepartamento(e: any){
    this.arccdp = e.value;
    this.depar = this.arccdp.arccdpPK.codiDepa;
    //BUSCAMOS LAS PROVINCIAS
    this.arccmcService.listarProvincXciaAndDepart(this.cia,this.depar).subscribe(data =>{
       this.arccprs = data;
    });
  }

  //SELECCIONAR PROVINCIA POR COMPAÑIA Y DEPARTAMENTO
  public seleccionarProvincia(e: any){
    this.arccpr = e.value;
    this.prov = this.arccpr.arccprPK.codiProv;
    //BUSCAMOS LAS PROVINCIAS
    this.arccmcService.listarDistritoXciaAndDepartAndProvinc(this.cia,this.depar,this.prov).subscribe(data =>{
       this.arccdis = data;
    });
  }

  //SELECCIONAR DISTRITO
  public seleccionarDistrito(e: any){
     this.arccdi = e.value;
     this.distr = this.arccdi.arccdiPK.codiDist;
  }

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
      this.arccmcService.buscarClienteRUCApiSunat(this.rucDni.trim()).subscribe( value => {
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
    this.listarProvincia();
    this.listarDistrito();
    this.buscarDepartamento();

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
      codiDepa : new FormControl(this.depar),
      codiProv : new FormControl(this.prov),
      codiDist : new FormControl(this.distr),
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
      this.depar = e.ubigeo.substring(0,2);
      this.prov = e.ubigeo.substring(2,4);
      this.distr = e.ubigeo.substring(4);
      this.listarProvincia();
      this.listarDistrito();
      this.buscarDepartamento();

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
        codiDepa : new FormControl(this.depar),
        codiProv : new FormControl(this.prov),
        codiDist : new FormControl(this.distr),
        tipoDir : new FormControl('LEG'),
        activoD : new FormControl('S'),
        tipoEnti : new FormControl('C'),
        codSuc : new FormControl('001'),
        noCliente1 : new FormControl(''),
        estabSunat : new FormControl('0000'),
      });
  }

  //FORMULARIO
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
      codiDepa : new FormControl(this.depar),
      codiProv : new FormControl(this.prov),
      codiDist : new FormControl(this.distr),
      tipoDir : new FormControl('LEG'),
      activoD : new FormControl('S'),
      tipoEnti : new FormControl('C'),
      codSuc : new FormControl('001'),
      noCliente1 : new FormControl(''),
      estabSunat : new FormControl('0000')
    });
  }

  //FORMULARIO ARCCMC
  public iniciarFormularioArccmc(a: Arccmc){
    this.arcctdas = a.arcctdaEntity;
    this.arcctda = this.arcctdas[0];
    this.buscandoDeparProvDistrito(this.arcctda);
    this.fArccmc = new FormGroup({
      cia : new FormControl(a.objIdArc.cia),
      id : new FormControl(a.objIdArc.id),
      nombre : new FormControl(a.nombre),
      direccion : new FormControl(a.direccion),
      ruc : new FormControl(a.ruc),
      telefono : new FormControl(a.telefono),
      celular : new FormControl(a.celular),
      extranjero : new FormControl(a.extranjero), // N
      tipo : new FormControl(a.tipo), // N
      activo : new FormControl(a.activo),
      web : new FormControl(a.web),
      pais : new FormControl(a.pais),
      documento : new FormControl(a.documento),//RUC o DNI
      email : new FormControl(a.email),
      //DIRECCION
      noCliente : new FormControl(a.objIdArc.id),
      codTienda : new FormControl(this.arcctdas[0].arcctdaPKEntity.codTienda),
      nombreD : new FormControl(this.arcctdas[0].nombre),
      direccionD : new FormControl(this.arcctdas[0].direccion),
      telefonoD : new FormControl(this.arcctdas[0].telefono),
      fax : new FormControl(this.arcctdas[0].fax),
      direOfi : new FormControl(''),
      codiDepa : new FormControl(this.depar),
      codiProv : new FormControl(this.prov),
      codiDist : new FormControl(this.distr),
      tipoDir : new FormControl(this.arcctdas[0].tipoDir),
      activoD : new FormControl(this.arcctdas[0].activo),
      tipoEnti : new FormControl(this.arcctdas[0].tipoEnti),
      codSuc : new FormControl(this.arcctdas[0].codSuc),
      noCliente1 : new FormControl(''),
      estabSunat : new FormControl('0000')
    });
  }

  //BUSCANDO DEPARTAMENTO,PROVINCIA Y DISTRITO
 public buscandoDeparProvDistrito(d: ArcctdaEntity){
    this.depar = d.codiDepa;
    this.prov = d.codiProv;
    this.distr = d.codiDist;

    this.listarProvincia();
    this.listarDistrito();
    this.buscarDepartamento();

 }
 //BUSCAMOS EL DEPARTAMENTO
 public buscarDepartamento(){
  for (const t of this.arccdps) {
    if (t.arccdpPK.codiDepa === this.depar) {
        this.arccdp = t;
        break;
    }
  }
 }
 //BUSCAMOS EL PROVINCIA
 public buscarProvincia(): void{
  for (const t of this.arccprs) {
    if (t.arccprPK.codiProv === this.prov) {
        this.arccpr = t;
        break;
    }
  }
 }
 //BUSCAMOS EL DISTRITO
 public buscarDistrito(){
  //this.listarDistrito();
 for (const t of this.arccdis) {
   if (t.arccdiPK.codiDist === this.distr) {
       this.arccdi = t;
       break;
   }
 }
}
 //LISTAR  PROVINCIAS POR DEPARTAMENTO
 public listarProvincia(): void{
   this.arccmcService.listarProvincXciaAndDepart(this.cia,this.depar).subscribe( data => {
     //console.log('LISTA DE PROVINCIA, cia : '+this.cia+' , DEPAR : '+this.depar);
     this.arccprs = data;
     this.buscarProvincia();
   });
 }
 //LISTAR  PROVINCIAS POR DEPARTAMENTO
 public listarDistrito(): void{
  this.arccmcService.listarDistritoXciaAndDepartAndProvinc(this.cia,this.depar,this.prov).subscribe( data => {
    this.arccdis = data;
    this.buscarDistrito();
  });
}
  //METODO PARA GUARDAR EL CLIENTE
  public guardarCliente(){
    let rznombre: string =  this.fArccmc.get('nombre').value;
    let arccmc = new Arccmc();

     let idArccmc = new IdArccmc();
     idArccmc.cia = this.cia;
     idArccmc.id = this.fArccmc.get('id').value;

     arccmc.objIdArc = idArccmc;
     arccmc.nombre = rznombre.substring(0,199).toUpperCase();
     arccmc.ruc = this.fArccmc.get('id').value;
     arccmc.direccion = this.fArccmc.get('direccion').value;
     arccmc.telefono = this.fArccmc.get('telefono').value;
     arccmc.celular = this.fArccmc.get('celular').value;
     arccmc.extranjero = this.fArccmc.get('extranjero').value;
     arccmc.tipo = this.fArccmc.get('tipo').value;
     arccmc.activo = this.fArccmc.get('activo').value;
     arccmc.web = this.fArccmc.get('web').value;
     arccmc.pais = this.fArccmc.get('pais').value;
     arccmc.documento = this.fArccmc.get('documento').value;
     arccmc.email = this.fArccmc.get('email').value;
     //DIRECCION
     let arcctda = new ArcctdaEntity();

     let idArcctda = new ArcctdaPKEntity();
     idArcctda.noCia = this.cia;
     idArcctda.codTienda = '001';
     idArcctda.noCliente = this.fArccmc.get('id').value;

     arcctda.arcctdaPKEntity = idArcctda;
     arcctda.nombre ='LEGAL';
     arcctda.direccion = this.fArccmc.get('direccionD').value;
     arcctda.telefono ='';
     arcctda.fax ='';
     arcctda.direOfi ='';
     arcctda.codiDepa  =this.depar;
     arcctda.codiProv  =this.prov;
     arcctda.codiDist  =this.distr;
     arcctda.codiDepa  =this.depar;
     arcctda.tipoDir   ='LEG';
     arcctda.activo   ='S';
     arcctda.tipoEnti   ='C';
     arcctda.codSuc ='001';
     arcctda.noCliente1 ='';
     arcctda.estabSunat ='0000';

     let arcctdas: ArcctdaEntity[] = [];
     //this.arcctdas.push(arcctda);
     arcctdas.push(arcctda);

     arccmc.arcctdaEntity = arcctdas;
     //GUARDAR
     this.arccmcService.guardarCliente(arccmc).subscribe( data => {
        //this.arccmc = data;
        this.snackBar.open("Se registró ", "Aviso", { duration: 2000 });
        setTimeout(() => {
          this.Limpiar();
        }, 2000);
     });

  }

  //LIMPIAR FORMULARIO
  public Limpiar(): void{
    this.arccdp = undefined;
    this.arccpr = undefined;
    this.arccprs = [];
    this.arccdi = undefined;
    this.arccdis = [];
    this.iniciarFormulario();

  }

}
