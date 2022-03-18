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
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<MarccmcComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Arccmc
    ) { }

  ngOnInit(): void {
    this.cia = sessionStorage.getItem('cia');
    this.iniciarFormularioBusquedaSunat();

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
        Validators.pattern(/^-?(0|[0-9]\d*)?$/)])
    });
  }
  // FIN
  // INICIAR EL FORMULARIO DE ARCCMC
  private iniciarFormularioArccmc(): void{
    this.fArccmc = new FormGroup({
      codigo: new FormControl({value: '', disabled: false}, [Validators.required,Validators.minLength(8),
        Validators.pattern(/^-?(0|[0-9]\d*)?$/)]),
      nombre : new FormControl({value: '', disabled: false },[Validators.required ,Validators.minLength(3)]),
      direccion : new FormControl(''),
      dni: new FormControl({value: '', disabled: false },
        [Validators.minLength(8), Validators.pattern(/^-?(0|[0-9]\d*)?$/)]),
      ruc: new FormControl({value: '', disabled: false },
        [Validators.minLength(11), Validators.pattern(/^-?(0|[0-9]\d*)?$/)]),
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
           Swal.fire('No se pudo obtener los datos del DNI. SUNAT no tiene el DNI registrado.');
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
          Swal.fire('No se pudo obtener los datos del RUC.SUNAT no tiene el RUC registrado.');
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
     this.editarFormularioArccmc(arccmc);
  }
  // FIN
  // NUEVO CLIENTE
  private nuevoCliente(): void {
    this.iniciarFormularioArccmc();
  }
  // FIN
   //FORMULARIO ARCCMC
  private editarFormularioArccmc(a: Arccmc): void{
        this.depar = a.arcctdaEntity[0].codiDepa;
        this.prov = a.arcctdaEntity[0].codiProv;
        this.distr = a.arcctdaEntity[0].codiDist;

      this.fArccmc = new FormGroup({
        codigo : new FormControl({value: a.objIdArc.id, disabled: true },[Validators.required ,Validators.minLength(8),
          Validators.pattern(/^-?(0|[0-9]\d*)?$/)]),
        nombre : new FormControl({value: a.nombre, disabled: false },[Validators.required ,Validators.minLength(3)]),
        direccion : new FormControl(a.direccion),
        dni : new FormControl({value: a.dni, disabled: false },[Validators.minLength(8),
          Validators.pattern(/^-?(0|[0-9]\d*)?$/)]),
        ruc : new FormControl({value: a.ruc, disabled: false },[Validators.minLength(8),
          Validators.pattern(/^-?(0|[0-9]\d*)?$/)]),
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
        codTienda : new FormControl(a.arcctdaEntity[0].arcctdaPKEntity.codTienda),
        nombreD : new FormControl(a.arcctdaEntity[0].nombre),
        direccionD : new FormControl(a.arcctdaEntity[0].direccion),
        telefonoD : new FormControl(a.arcctdaEntity[0].telefono),
        fax : new FormControl(a.arcctdaEntity[0].fax),
        direOfi : new FormControl(''),
        codiDepa : new FormControl(a.arcctdaEntity[0].codiDepa),
        codiProv : new FormControl(a.arcctdaEntity[0].codiProv),
        codiDist : new FormControl(a.arcctdaEntity[0].codiDist),
        tipoDir : new FormControl(a.arcctdaEntity[0].tipoDir),
        activoD : new FormControl(a.arcctdaEntity[0].activo),
        tipoEnti : new FormControl(a.arcctdaEntity[0].tipoEnti),
        codSuc : new FormControl(a.arcctdaEntity[0].codSuc),
        noCliente1 : new FormControl(''),
        estabSunat : new FormControl(a.arcctdaEntity[0].codSuc)
      });
      this.listarProvincia();
      this.listarDistrito();
  }
  // fin

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
        codigo : new FormControl({value: e.numeroDocumento, disabled: false },[Validators.required ,Validators.minLength(8),
          Validators.pattern(/^-?(0|[0-9]\d*)?$/)]),
        nombre : new FormControl({value: e.nombre, disabled: false },[Validators.required ,Validators.minLength(3)]),
        direccion : new FormControl(e.direccion),
        dni :  new FormControl({value: e.numeroDocumento, disabled: false },[Validators.minLength(8),
          Validators.pattern(/^-?(0|[0-9]\d*)?$/)]),
        ruc :  new FormControl({value: '', disabled: false },[Validators.minLength(11),
          Validators.pattern(/^-?(0|[0-9]\d*)?$/)]),
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
          codigo :  new FormControl({value: e.numeroDocumento, disabled: false },[Validators.required ,Validators.minLength(8),
            Validators.pattern(/^-?(0|[0-9]\d*)?$/)]),
          nombre : new FormControl({value: e.nombre, disabled: false },[Validators.required ,Validators.minLength(3)]),
          direccion : new FormControl(e.direccion),
          dni :  new FormControl({value: '', disabled: false },[Validators.minLength(8), Validators.pattern(/^-?(0|[0-9]\d*)?$/)]),
          ruc :  new FormControl({value: e.numeroDocumento, disabled: false },[Validators.minLength(11),
            Validators.pattern(/^-?(0|[0-9]\d*)?$/)]),
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
  //EVENTO QUE NOS PERMITE GUARDAR EL CLIENTE
  public guardarArccmc(): void {
    Swal.fire({
      title: '¿Está seguro de guardar los datos del cliente?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.mensajeBusca('Guardando los datos del cliente.');
        //GUARDAR
        this.arccmcService.guardarCliente(this.getArccmc()).subscribe( data => {
            Swal.close();
            this.cerrarModalArccmc();
            this.snackBar.open(`Se guardo correctamente`, 'Salir',
            {
              duration: 1000,
              verticalPosition: 'top',
              horizontalPosition: 'center'
            });
        }, error => {
            Swal.fire(error);
        }, ()=> Swal.close());
        }
    });

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
     idArcctda.noCliente = this.fArccmc.get('codigo').value;
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
     this.arccmc = arccmc;
     return arccmc;
  }
  // FIN
}
