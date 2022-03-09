import { Component, OnInit, Inject } from '@angular/core';
import { ArccmcService } from '../../../services/arccmc.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Arccmc } from '../../../models/Arccmc';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Arccdp } from '../../../models/arccdp';
import { Arccpr } from '../../../models/arccpr';
import { Arccdi } from '../../../models/arccdi';
import Swal from 'sweetalert2';
import { Empresa } from '../../../models/empresa';
import { Persona } from '../../../models/persona';
import { ArcctdaEntity } from '../../../models/arcctda-entity';
import { ArcctdaPKEntity } from '../../../models/arcctda-pkentity';
import { IdArccmc } from '../../../models/IdArccmc';

@Component({
  selector: 'app-marccmc',
  templateUrl: './marccmc.component.html'
})
export class MarccmcComponent implements OnInit {

  public arccmc: Arccmc;
  public estadoNuevo = false;
  public fBuscarSunat : FormGroup;
  public fArccmc: FormGroup;

  public depar: string = '15';
  public prov: string = '01';
  public distr: string = '14';
  public cia: string;

  public arccdps: Array<Arccdp>;
  public arccprs: Array<Arccpr>;
  public arccdis: Array<Arccdi>;

  public empresa: Empresa;
  public persona: Persona;

  constructor(private arccmcService: ArccmcService,
    private dialogRef: MatDialogRef<MarccmcComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Arccmc
    ) { }

  ngOnInit(): void {
    this.cia = sessionStorage.getItem('cia');
    this.iniciarFormularioBusquedaSunat();
    this.iniciarFormularioArccmc();
    this.verificarCliente();
    this.traerDepartamentosXcia();
    this.seleccionarDepartamento();
    this.seleccionarProvincia();

  }

  private traerDepartamentosXcia(){
    this.arccmcService.listarDepartXcia(this.cia).subscribe( data =>{
       this.arccdps = data;
    }, error => console.warn(error));
  }

  // VALIDADOR DEL FORMULARIO BUSCAR POR RUC
  get fbs(){
    return this.fBuscarSunat.controls;
  }
  // FIN
  // VALIDADOR DEL FORMULARIO ARCCMC
  get f(){
    return this.fArccmc.controls;
  }
  // FIN

  // INICIAR FORMULARIO
  private iniciarFormularioBusquedaSunat(): void{
    this.fBuscarSunat = new FormGroup({
      rucDni: new FormControl({value: '', disabled: false }, [Validators.required ,Validators.minLength(8),
        Validators.pattern(/^-?(0|[1-9]\d*)?$/)])
    });
  }
  // FIN
  // INICIAR EL FORMULARIO DE ARCCMC
  private iniciarFormularioArccmc(): void{
    this.fArccmc = new FormGroup({
      codigo: new FormControl({value: '', disabled: false}, [Validators.required,Validators.minLength(8),
        Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
      nombre : new FormControl(''),
      direccion : new FormControl(''),
      dni: new FormControl({value: '', disabled: false },
        [Validators.minLength(8), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
      ruc: new FormControl({value: '', disabled: false },
        [Validators.minLength(11), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
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
      noCliente : new FormControl(''),
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
  //FIN

  // MENSAJE QUE BUSCA
  private mensajeBusca(msj: string): void{
    Swal.fire({
      allowOutsideClick: false, // CLICK FUERA
      icon: 'info',
      text: msj
    });
    Swal.showLoading();
  }

  // METODOD QUE NOS PERMITE BUSCAR EN SUNAT
  public buscarSunat(): void{
    const rd: string = this.fBuscarSunat.get('rucDni').value;
    if (rd.length === 8){
        this.mensajeBusca('Buscando DNI en SUNAT...');
        this.arccmcService.buscarClienteDNIApiSunat(rd.trim()).subscribe( value => {
          this.persona = value;
          this.iniciarFormularioPersona(this.persona);
        }, error => {
           Swal.fire('No se pudo obtener los datos del DNI. SUNAT tiene problemas con sus servidores.');
           console.warn(error);
        }, () => {
          Swal.close();
        });
    }else if (rd.length === 11) {
        this.mensajeBusca('Buscando RUC en SUNAT...');
        this.arccmcService.buscarClienteRUCApiSunat(rd.trim()).subscribe( value => {
          this.empresa = value;
          this.iniciarFormularioEmpresa(this.empresa);
       }, error => {
          Swal.fire('No se pudo obtener los datos del RUC. SUNAT tiene problemas con sus servidores.');
          console.warn(error);
       }, () => {
         Swal.close();
       });
    } else {
      Swal.fire('RUC O DNI NO VALIDO.');
    }
  }
  // FIN

  // EVENTO QUE NOS PERMITE CERRAR EL MODAL DE CLIENTE
  public cerrarModalArccmc(): void{
    this.dialogRef.close();
  }
  // FIN
  // VERIFICAR SI ES PARA EDITAR O ES NUEVO
  private verificarCliente(): void{
    if(this.data !== undefined){
       this.arccmc = this.data;
       this.editarCliente(this.arccmc);
    }else{
       this.nuevoCliente();
    }
  }
  // FIN
  // EDITAR CLIENTE
  private editarCliente(arccmc: Arccmc): void{

  }
  // FIN
  // NUEVO CLIENTE
  private nuevoCliente(): void {

  }
  // FIN

   //SELECCIONAR DEPARTAMENTOS POR COMPAÑIA
   public seleccionarDepartamento(){
    this.depar = this.fArccmc.get('codiDepa').value;
    //BUSCAMOS LAS PROVINCIAS
    this.arccmcService.listarProvincXciaAndDepart(this.cia,this.depar).subscribe(data =>{
       this.arccprs = data;
    }, error => {
      console.warn(error);
    });

  }

  //SELECCIONAR PROVINCIA POR COMPAÑIA Y DEPARTAMENTO
  public seleccionarProvincia(){
    this.prov = this.fArccmc.get('codiProv').value;
    //BUSCAMOS LAS PROVINCIAS
    this.arccmcService.listarDistritoXciaAndDepartAndProvinc(this.cia,this.depar,this.prov).subscribe(data =>{
       this.arccdis = data;
    }, error => {
      console.warn(error);
    });
  }

  //SELECCIONAR DISTRITO
  public seleccionarDistrito(){
     this.distr =this.fArccmc.get('codiDist').value;
  }
  // FIN
  //LISTAR  PROVINCIAS POR DEPARTAMENTO
  public listarProvincia(): void{
    this.arccmcService.listarProvincXciaAndDepart(this.cia,this.depar).subscribe( data => {
      this.arccprs = data;
    });
  }
  //LISTAR  PROVINCIAS POR DEPARTAMENTO
  public listarDistrito(): void{
  this.arccmcService.listarDistritoXciaAndDepartAndProvinc(this.cia,this.depar,this.prov).subscribe( data => {
    this.arccdis = data;
  });
  }
  //FORMULARIO DE PERSONA
  public iniciarFormularioPersona(e: Persona){
      this.listarProvincia();
      this.listarDistrito();

      this.fArccmc = new FormGroup({
        codigo : new FormControl(e.numeroDocumento),
        nombre : new FormControl(e.nombre),
        direccion : new FormControl(e.direccion),
        dni : new FormControl(e.numeroDocumento),
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
        estabSunat : new FormControl('0000')
      });
  }

  //FORMULARIO EMPRESA
  public iniciarFormularioEmpresa(e: Empresa){
        this.depar = e.ubigeo.substring(0,2);
        this.prov = e.ubigeo.substring(2,4);
        this.distr = e.ubigeo.substring(4);
        this.listarProvincia();
        this.listarDistrito();

        this.fArccmc = new FormGroup({
          codigo : new FormControl(e.numeroDocumento),
          nombre : new FormControl(e.nombre),
          direccion : new FormControl(e.direccion),
          dni : new FormControl(''),
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
          estabSunat : new FormControl('0000')
        });
  }
  // FIN
  // METODO QUE NOS PERMITE GUARDAR EL CLIENTE
  public guardarArccmc(): void {
     this.mensajeBusca('Guardando los datos del nuevo cliente.');
     //GUARDAR
     this.arccmcService.guardarCliente(this.getArccmc()).subscribe( data => {
       Swal.close();
       Swal.fire('Se guardo correctamente.');
    }, error => {
        Swal.fire(error);
    }, ()=> Swal.close());
  }
  // fin
  // LLENANDO LOS VALORES PARA GUARDAR LOS DATOS DEL CLIENTE
  private getArccmc(): Arccmc {
    let rznombre: string =  this.fArccmc.get('nombre').value;
    let arccmc = new Arccmc();

     let idArccmc = new IdArccmc();
     idArccmc.cia = this.cia;
     idArccmc.id = this.fArccmc.get('codigo').value;

     arccmc.objIdArc = idArccmc;
     arccmc.nombre = rznombre.substring(0,199).toUpperCase();
     arccmc.dni = this.fArccmc.get('dni').value;
     arccmc.ruc = this.fArccmc.get('ruc').value;
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

     const arcctdas: Array<ArcctdaEntity> = [];
     arcctdas.push(arcctda);

     arccmc.arcctdaEntity = arcctdas;
     return arccmc;
  }
  // FIN
}
