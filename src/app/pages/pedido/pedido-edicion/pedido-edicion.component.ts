import { Arpffe } from './../../../models/arpffe';
import { ArintdService } from './../../../services/arintd.service';
import { Arinda } from './../../../models/Arinda';
import { ArticuloService } from './../../../services/articulo.service';
import { IdArpfol } from './../../../models/IdArpfol';
import { Arpfol } from './../../../models/Arpfol';
import Swal from 'sweetalert2';
import { DatosClienteDTO } from './../../../DTO/DatosClienteDTO';
import { ArccmcService } from './../../../services/arccmc.service';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { PedidoService } from './../../../services/pedido.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IdArpfoe } from 'src/app/models/IdArpfoe';

import {ArfaccService} from '../../../services/arfacc.service';
import {IArfacc} from '../../../interfaces/IArfacc';
import {Arfacc} from '../../../models/arfacc';
import {Arccmc} from '../../../models/Arccmc';
import {IarfaccPK} from '../../../interfaces/IarfaccPK';
import {ArfaccPK} from '../../../models/arfaccPK';
import {TransaccionService} from '../../../services/transaccion.service';
import {Transaccion} from '../../../models/transaccion';
import {MatSnackBar} from '@angular/material/snack-bar';

import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ArcgtcService } from '../../../services/arcgtc.service';
import { IArcgtc } from '../../../interfaces/IArcgtc';
import { Arfatp } from '../../../models/Arfatp';
import { ArfatpService } from '../../../services/arfatp.service';
import { TapfopaService } from '../../../services/tapfopa.service';
import { Tapfopa } from '../../../models/tapfopa';
import { ArcgmoService } from '../../../services/arcgmo.service';
import { Arcgmo } from '../../../models/arcgmo';
import { ArcctdaEntity } from '../../../models/arcctda-entity';
import { MatDialog } from '@angular/material/dialog';
import { ItemsDialogoComponent } from '../../articulo/items-dialogo/items-dialogo.component';
import { BuscarItem } from '../../../models/buscar-item';
import { Detpedido } from '../../../models/detpedido';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ArpfoeService } from '../../../services/arpfoe.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { Arintd } from '../../../models/arintd';
import { Arfacf } from '../../../models/arfacf';
import { ArfacfService } from '../../../services/arfacf.service';
import { Arfacfpk } from '../../../models/Arfacfpk';
import { Arinse } from '../../../models/arinse';
import { ArinseService } from '../../../services/arinse.service';
import { ArpffeService } from '../../../services/arpffe.service';
import { Arpfoe } from '../../../models/Arpfoe';
import { Arpffepk } from '../../../models/arpffepk';
import {Arpffl} from '../../../models/arpffl';
import {Arpfflpk} from '../../../models/arpfflpk';
import {Arinme1} from '../../../models/arinme1';
import {Arinme1pk} from '../../../models/arinme1pk';
import {Arinml1} from '../../../models/arinml1';
import {Arinml1pk} from '../../../models/arinml1pk';
import {Arinme1Service} from '../../../services/arinme1.service';
import { Arinum } from '../../../models/arinum';
import { ArinumService } from '../../../services/arinum.service';
import { MarccmcComponent } from '../../arccmc/marccmc/marccmc.component';
import { Arcaaccaj } from '../../../models/Arcaaccaj';
import { ArcaaccajService } from '../../../services/arcaaccaj.service';
import { Artsccb } from '../../../models/artsccb';
import { CajaEdicionComponent } from '../caja/caja-edicion/caja-edicion.component';
import { OnExit } from '../../../guards/exit.guard';

@Component({
  selector: 'app-pedido-edicion',
  templateUrl: './pedido-edicion.component.html',
  styleUrls: ['./pedido-edicion.component.scss']
})
export class PedidoEdicionComponent implements OnInit, OnExit {
  ordenCompra: string = '';
  edtDescripDet: boolean = true;
  d: Detpedido;
  anularBF = 'N';
  emailCliente = '';
  arinse: Arinse;
  tipoItem = 'L';
  form: FormGroup;
  // NUEVO CAMBIOS
  groupEmpresa: FormGroup;
  groupArticulo: FormGroup;

  factuOptions: Observable<Arccmc[]>;
  arccmcs: Arccmc[];
  // FIN
  savePed = true;

  fechaSeleccionada: Date = new Date();
  detallePedido: Arpfol[] = [];
  articulos: Arinda[] = [];
  // PEDIDO CABECERA MUESTRA
  /*=====================================================*/
  orden: string;
  guia: string;
  codCliente = '';
  nomCli: string;
  direccion: string;
  email: string;
  // DETALLE PEDIDO MUESTRA
  /*=====================================================*/
  tipoBS: string;
  articuloSeleccionado: Arinda;
  tipoAfectacion: string;
  cantAsignada = 0;
  precioCant = 0;
  precio = 0;
  pDSCTO3 = 0;
  impIgv = 0;
  totalLin = 0;

  totalGeneral = 0;
  subTotal = 0;
  totalIGV = 0;
  impuesto = 18;
  arinme1: Arinme1;
  myControlArticulo: FormControl = new FormControl({value: '', disabled: true });

  articulosFiltrados: Observable<Arinda[]>;

  public arfacc: IArfacc;
  public arfaccs: IArfacc[];
  public arfaccPK: IarfaccPK;
  public cia: string;
  public centro: string;
  public codEmp: string;
  public usuario: string;
  public nroPedido: string;
  public fecha: Date;
  public transacciones: Transaccion[];
  public transaccion: Transaccion;

  public arcgtc: IArcgtc;
  public tipocambio: number;

  public arfatps: Arfatp[];
  public arfatp: Arfatp;

  public tapfopas: Tapfopa[];
  public tapfopa: Tapfopa;

  public arcgmos: Arcgmo[];
  public arcgmo: Arcgmo;

  public arcctdas: ArcctdaEntity[];
  public arcctda: ArcctdaEntity;

  public ubigeo: string;

  public fechaP = new FormControl(new Date());

  public detPedidos: Detpedido[] = [];
  // NUEVO CAMBIOS
  displayedColumns: string[] = ['tipo', 'codigo', 'medida', 'descripcion', 'cantidad', 'precio','dcto' ,'igv', 'total', 'eliminar'];
  // FIN
  dataSource: MatTableDataSource<Detpedido>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  arccmcObservable: Observable<Arccmc[]>;
  arccmc: Arccmc;

  descBien = '';
  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });

  public arintd: Arintd;
  public arfacf: Arfacf;
  public arpffe: Arpffe;
  public arinums: Array<Arinum>;
  public arcaaccajs: Array<Arcaaccaj>;
  public arcaaccaj: Arcaaccaj;
  public artsccb: Artsccb;
  public caja: string = '';

  constructor(public pedidoService: PedidoService,
              public arinumService: ArinumService,
              public clienteServices: ArccmcService,
              public arindaService: ArticuloService,
              public arfaccService: ArfaccService,
              public arpfoeService: ArpfoeService,
              public transaccionService: TransaccionService,
              public arcgtcService: ArcgtcService,
              public arfatpService: ArfatpService,
              public tapfopaService: TapfopaService,
              public arcgmoService: ArcgmoService,
              public arccmcService: ArccmcService,
              public arinme1Service: Arinme1Service,
              public arintdService: ArintdService,
              public arinseService: ArinseService,
              public arfacfService: ArfacfService,
              public arpffeService: ArpffeService,
              private snackBar: MatSnackBar,
              private dialogItems: MatDialog,
              private router: Router,
              private route: ActivatedRoute,
              public datepipe: DatePipe,
              private modalArccmc: MatDialog,
              private arcaaccajService: ArcaaccajService
              ) { }

  ngOnInit(): void {
    this.arcgmo = new Arcgmo();
    this.cia = sessionStorage.getItem('cia');
    this.centro = sessionStorage.getItem('centro');
    this.usuario = sessionStorage.getItem('usuario');
    this.codEmp = sessionStorage.getItem('codEmp');
    this.verificarCajaAbiertaVendedor();
    this.form = new FormGroup({
      cia: new FormControl(sessionStorage.getItem('cia')),
      grupo: new FormControl('00'),
      cliente: new FormControl({ value: ''}, Validators.required),
      nomCli: new FormControl({ value: '', disabled: true }, Validators.required),
      direccion: new FormControl({ value: '', disabled: true }, Validators.required),
      email: new FormControl({value: '', disabled: true }),
      articulo: this.myControlArticulo,
      cantAsignada: new FormControl({ value: 0, disabled: true }, Validators.required),
      precio: new FormControl({ value: 0, disabled: true }, Validators.required),
      impIgv: new FormControl({ value: 0, disabled: true }, Validators.required),
      totalLin: new FormControl({ value: 0, disabled: true }, Validators.required)
    });
    // VAMOS A OPTENER LOS DATOS DEL CENTRO EMISOR
    this.getCentroEmisor(this.cia, this.centro);
    this.listaMonedas();
    this.transaccionXCia();
    this.serieCorrelativoPedido();
    this.buscarTipoCambioClaseAndFecha();
    this.listaPrecio();
    this.listarFormaPago();
    this.groupEmpresa = new FormGroup({
      codCli: new FormControl({value: '', disabled: false}, [Validators.required,Validators.minLength(1),Validators.pattern(/^-?(0|[0-9]\d*)?$/)]),
      racSoc: new FormControl({value: '', disabled: false}, [Validators.required,Validators.minLength(2)])
    });
    this.groupArticulo = new FormGroup({
      codProd: new FormControl(),
      desProd: new FormControl(),
      umProd: new FormControl({ value: 'UND', disabled: false }, Validators.required),
      precProd: new FormControl({ value: 0, disabled: false }, Validators.required),
      cantProd: new FormControl({ value: 1, disabled: false }, Validators.required)
    });
    this.getCliente('99999999998');
    // BUSCAR POR RUC
    this.groupEmpresa.get('codCli').valueChanges.subscribe(valueChange => {
      if (valueChange.length > 2) {
         this.factuOptions = this.clienteServices.listaClientesRucLike(this.cia, valueChange).pipe(
           map( value => value.resultado)
         );
      }
      else {
        this.factuOptions = null;
      }
    });
    // BUSCAR POR RAZON SOCIAL O NOMBRE
    this.groupEmpresa.get('racSoc').valueChanges.subscribe(valueChange => {
      if (valueChange.length > 3) {
         const nombre: string = valueChange;
         this.factuOptions = this.arccmcService.listaClientesDescripLike(this.cia, nombre.toUpperCase().trim());
      }
      else {
        this.factuOptions = null;
      }
    });
    this.listarUnidades();
    // TRAER EL PEDIDOD
    this.traerPedido();
  }

  onExist() {

    if( this.form.dirty && this.groupEmpresa.dirty && this.groupArticulo.dirty){
        const rta = confirm('Esta seguro de salir?');
        return rta;
    }
    return true;
 }
  // VERIFICAR SI EL VENDEDOR TIENE CAJA ABIERTA
  private verificarCajaAbiertaVendedor(): void {
    //obtener la fecha actual
    const fActual = new Date();
    const fecha = String(fActual.getDate()).padStart(2,'0')+'/'+String(fActual.getMonth() + 1).padStart(2,'0')+'/'+fActual.getFullYear();
    this.arcaaccajService.verificarCajaAbiertaCajero(this.cia,this.centro,this.codEmp,'A',fecha).subscribe( result => {
         this.arcaaccajs = result;
    }, err => {
       console.warn(err);
    }, () => {
       this.vericarCajaVendedora();
    });
  }
  // VERIFICAR QUE CAJA LE CORRESPONDE A LA VENDEDORA
  private vericarCajaVendedora(): void{
       this.arcaaccajService.verificarCajaVendedor(this.cia,'C',this.centro,this.usuario).subscribe( resul => {
           this.artsccb = resul;
       }, err =>{
          console.warn(err);
       }, () =>{
           this.buscarCajaDesigna();
       });
  }
  // FIN
  // MENSAJE QUE PREGUNTA SI DESEA ABRIR CAJA
  private mDeseaAbrirCaja(): void{
    Swal.fire({
      title: `El usuario ${this.usuario} no tiene aperturado caja . Desea aperturar caja?`,
      showDenyButton: true,
      confirmButtonText: 'SI'
    }).then((result) => {
      if (result.isConfirmed) {
            this.abrirModalCaja();
      }else{
          this.router.navigate( ['pedido/empresa']);
      }
    });
  }
  // FIN
  // BUSCAMOS SI LA CAJA DESIGNA ESTA ABIERTA
  private buscarCajaDesigna(): void{
    //console.log(this.arcaaccajs);
    const x = this.arcaaccajs.find( i => {
      if(i.idArcaja.codCaja === this.artsccb.artsccbPK.noCaba){ //this.artsccb.artsccbPK.noCaba
        return i;
      }
    }); //undefined
    if(x === undefined){
      this.mDeseaAbrirCaja();
    }else{
      this.arcaaccaj = x;
      this.caja = this.arcaaccaj.idArcaja.codCaja;
    }
  }
  // FIN
  // ABRIR MODAL PARA ABRIR UNA CAJA
  private abrirModalCaja(): void {
    this.modalArccmc.open(CajaEdicionComponent, {
      width: '30%',
      height: '40%',
      data: this.artsccb
    });
  }
  // FIN
  // EVENTO CLICK QUE NOS PERMITER EDITAR LA DESCRIPCION
  public editDescripDet(): void {
    this.edtDescripDet = !this.edtDescripDet;
  }
  // VAMOS A TRAER EL PEDIDO
  private traerPedido(): void{
      this.route.queryParams.subscribe(p => {
        if (p['noOrden'] !== undefined) {
            this.pedidoService.pedidoParaFactura(this.cia, p['noOrden']).
              subscribe(p => {
                console.warn(p);

                }, error => { console.warn(error.error.estado.mensaje);});
        }
      });
  }
  // LISTAMOS TODAS LAS UNIDADES POR COMPAÑIA
  private listarUnidades(): void {
    this.arinumService.listarDepartXcia(this.cia).subscribe(u => {
      this.arinums = u;
    });
  }
  // FIN
  // LIMPIANDO ITEMS LIBRES
  public limpiarItemsLibre(): void{
    this.groupArticulo = new FormGroup({
      codProd: new FormControl(''),
      desProd: new FormControl(''),
      umProd: new FormControl({ value: 'UND', disabled: false }, Validators.required),
      precProd: new FormControl({ value: 0, disabled: false }, Validators.required),
      cantProd: new FormControl({ value: 1, disabled: false }, Validators.required)
    });
  }

  // BUSCAMOS CLIENTES POR SU NOMBRE O RAZON SOCIAL
  public buscarClienteXnombre(e: any): void{
    const nombre: string = e.target.value;
    this.arccmcObservable = this.arccmcService.listaClientesDescripLike(this.cia, nombre.toUpperCase().trim());
  }

  // SELECCIONAMOS UN CLIENTE POR SU NOMBRE O RAZON SOCIA
  public seleccionarClienteXdescrip($event: MatAutocompleteSelectedEvent): void{
    this.arccmc = $event.option.value;
    this.groupEmpresa.controls.codCli.setValue(this.arccmc.objIdArc.id , {emitEvent: false});
    this.groupEmpresa.controls.racSoc.setValue(this.arccmc.nombre, {emitEvent: false});
    this.emailCliente = this.arccmc.email;
    this.arcctdas = this.arccmc.arcctdaEntity;
  }

  // NUEVO CAMBIOS
  public setFormData($event: MatAutocompleteSelectedEvent): void {
    this.arccmc = $event.option.value;
    this.groupEmpresa.controls.codCli.setValue(this.arccmc.objIdArc.id , {emitEvent: false});
    this.groupEmpresa.controls.racSoc.setValue(this.arccmc.nombre, {emitEvent: false});
    this.emailCliente = this.arccmc.email;
    this.arcctdas = this.arccmc.arcctdaEntity;
  }

   // NUEVO CAMBIOS
   public getDirecciones($event): void {
      this.arcctda = $event.value;
      this.ubigeo = this.arcctda.codiDepa.concat(this.arcctda.codiProv).concat(this.arcctda.codiDist);
  }

  // FIN
  filtrarArticulos(val: any): any {
    if (val != null) {
      const filtro: string = String(val);
      this.arindaService.listaArtiDesc(sessionStorage.getItem('cia'), filtro.trim()).subscribe(data => {
        this.articulos = data;
      });
      return this.articulos;
    }
  }

  mostrarArticulo(val: Arinda): any {
    return val ? `${val.idArti.noArti} ${val.descripcion}` : val;
  }

  seleccionarArticulo(e: any): void {
    this.articuloSeleccionado = e.option.value;
    this.arindaService.precStock(sessionStorage.getItem('cia'), '1A001', 'F8', this.articuloSeleccionado.idArti.noArti).subscribe(data => {
      if (data.stock === null) {
        Swal.close();
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          title: 'Articulo sin Stock'
        });
      } else {
        this.precio = data.precio;
      }
    });
  }

  calcularImporte(): void {
    this.precioCant = this.precio * this.cantAsignada;
    this.impIgv = (this.precio * this.cantAsignada) * 0.18;
    this.totalLin = (this.precio * this.cantAsignada) + this.impIgv;
  }

  noOrden(): void {
    this.pedidoService.noOrdern(sessionStorage.getItem('cia'), sessionStorage.getItem('centro')).subscribe(data => {
      this.orden = data;
    });
  }

  traeCliente(): void {
    const datos = new DatosClienteDTO(sessionStorage.getItem('cia'));
    datos.documento = this.codCliente.trim();
    this.clienteServices.traeCliente(datos).subscribe(data => {
      if (data.direccion != null) {
        this.direccion = data.direccion;
      } else {
        this.form.controls.direccion.enable();
      }
      this.nomCli = data.nombre;
      if (data.email != null) {
        this.email = data.email;
      } else {
        this.form.controls.email.enable();
      }
      this.form.controls.articulo.enable();
      this.form.controls.cantAsignada.enable();
    }, err => {
      if (err.status === 404) {
        Swal.close();
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          title: 'Cliente no Existe o se Encuentra inactivo!!'
        });
      }
    });
  }
  estadoBotonCliente(): any {
    return (this.codCliente === '');
  }

  removerDetalle(index: number): void {
    this.detallePedido.splice(index, 1);
    this.getTotal();
  }

  public getTotal(): void {
    this.totalGeneral =  this.detallePedido.map(t => t.totalLin).reduce((acc, value) => acc + value, 0);
    // this.subTotal = this.detallePedido.map(t => t.operGravadas).reduce((acc, value) => acc + value, 0);
    this.totalIGV = this.detallePedido.map(t => t.impIgv).reduce((acc, value) => acc + value, 0);
    this.subTotal = this.totalGeneral - this.totalIGV;
  }

  // METODO QUE NOS PERMITE TRAER LA SERIE Y CORRELATIVO DEL PEDIDO
  public serieCorrelativoPedido(): void{
    this.arfacc = new Arfacc();
    this.arfaccPK = new ArfaccPK();
    this.arfaccPK.noCia = this.cia;
    this.arfaccPK.centro = this.centro;
    this.arfaccPK.tipoDoc = 'P';
    this.arfacc.arfaccPK = this.arfaccPK;
    this.arfacc.activo = 'S';
    this.arfaccService.getSerieAndCorrelativoPedido(this.arfacc).subscribe(json => {

      this.arfaccs = json;
      if (this.arfaccs.length === 1) {
         this.arfacc = this.arfaccs[0];
      }else{
        this.snackBar.open('Debe elegir un Nro de Pedido para el centro: ' + this.centro, 'Salir',
          {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
      }
    },
      error => {
       console.error(error);
      }
    );
  }
  // METODO QUE NOS PERMITE TRAER LA TRANSACCION POR USUARIO Y COMPAÑIA
  public transaccionXCia(): void{
      this.transaccionService.listarTransacconPorUsuario(this.cia, this.usuario).subscribe(json => {
        this.transacciones = json.resultado;
      },
        error => {
          console.warn('TRANSACCION');
          console.warn(error);
      }, () => {
        this.buscarTransaccion('1315');
        this.getTrasaccion(this.cia, this.transaccion.codTPed);
      });
  }
  // METODO QUE NOS PERMITE A BUSCAR TRANSACCION
  public buscarTransaccion(codigo: string): void {
      for (const t of this.transacciones) {
          if (t.codTPed === codigo) {
            this.transaccion = t;
            break;
          }
      }
  }

  // METODO QUE TRAE EL TIPO DE CAMBIO DE FECHA ACTUAL
  public buscarTipoCambioClaseAndFecha(): void{
    const date = new Date();
    const day = `${(date.getDate())}`.padStart(2, '0');
    const month = `${(date.getMonth() + 1)}`.padStart(2, '0');
    const year = date.getFullYear();

    this.arcgtcService.getTipoCambioClaseAndFecha('02', `${day}/${month}/${year}`).subscribe(json => {
         this.arcgtc = json.resultado;
         this.tipocambio = this.arcgtc.tipoCambio;
    },
    error => {
      Swal.fire({
        allowOutsideClick: false,
        icon: 'info',
        title: `No tiene tipo cambio para la fecha: ${day}/${month}/${year}`
      });

    });

  }

  // METODO QUE NOS PERMITE TRAER LA LISTA DE PRECIO DE PUNTO DE VENTA
  public listaPrecio(): void{
    this.arfatpService.getAllListaPrecio(this.cia, 'S').subscribe(json => {
      this.arfatps = json.resultado;
      this.buscarListaPrecio('A3');
    },
      error => {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          title: `No tiene Lista de Precio A3`
        });
    });
  }

  // METODO QUE NOS PERMITE A BUSCAR LISTA DE PRECIO
  public buscarListaPrecio(codigo: string): void {
    for (const t of this.arfatps) {
        if (t.idArfa.tipo === codigo) {
            this.arfatp = t;
            this.buscarMoneda(t.moneda);
            break;
        }
    }
  }

  // CAMBIAR MONEDA POR LISTA DE PRECIO
  public cambiarMoneda(arfatp: Arfatp): void{
     this.buscarMoneda(arfatp.moneda);
  }
  // FIN

  // BUSCAR FORMA DE PAGO
  public buscarFormaPago(cod: string): void{
    for (const t of this.tapfopas) {
      if (t.tapfopaPK.codFpago === cod) {
        this.tapfopa = t;
        break;
      }
    }
  }

  // VAMOS A LISTAR LAS FORMAS DE PAGO
  public listarFormaPago(): void{
     this.tapfopaService.listarFormaPagoCiaAndEstado(this.cia, 'A').subscribe(json => {
        this.tapfopas = json.resultado;
        this.buscarFormaPago('01');
     });
  }

 // BUSCAR MONEDA
 public buscarMoneda(cod: string): void{
    for (const m of this.arcgmos) {
      if (m.moneda === cod) {
          this.arcgmo = m;
          break;
      }
    }
 }

  // LISTA DE MONEDAS
  public listaMonedas(): void{
    this.arcgmoService.listarArcgmo().subscribe(json => {
      this.arcgmos = json.resultado;
      // console.log(this.arcgmos);
   });
  }

  // CLIENTE DE INICIO
  public getCliente(ruc: string): void{
    this.factuOptions = this.clienteServices.listaClientesRucLike(this.cia, ruc).pipe(
      map( value => value.resultado)
    );
  }

  // ABRIR DIALOGO DE ITEMs
  public openDialogoItem(): void{
      // console.log(this.groupArticulo.get('desProd').value);
      const buscarItem = new BuscarItem(this.cia, this.arfatp.idArfa.tipo, this.descBien.toUpperCase().trim());
      const dialogRef = this.dialogItems.open(ItemsDialogoComponent, {
                        width: '100%',
                        data: buscarItem
                      });
      dialogRef.afterClosed().subscribe( result => {

        for(const i of result) {
          this.verificarItems(i);
        }
        this.llenarTablaArticulos();
        // total de general
        this.totalGeneral = this.getTotalPedido();
      });
  }
  // LLENAR TABLA DE ARTICULOS
  private llenarTablaArticulos(): void{
    this.dataSource = new MatTableDataSource(this.detPedidos);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  // VERIFICAR DUPLICADO DE ITEMS
  public verificarItems(dp: Detpedido): void {
    if (this.detPedidos.length === 0){
          // this.detPedidos.push(dp);
          this.actualizarCorrelativo(dp);
    } else {
       const cod = dp.codigo;
       let valor = 'N';
       // VAMOS A RECORRER EL ARREGLO SI YA EXISTE EL ITEM
       for (const i in this.detPedidos){
            if (cod === this.detPedidos[i].codigo){
              valor = 'S';
              break;
            }
        }

       if (valor === 'N'){
         this.actualizarCorrelativo(dp);
       }
    }
  }

   // ACTUALIZANDO EL CORRELATIVO DE LOS ITEMS
  // LLENAR DETALLE DE PEDIDO
  private actualizarCorrelativo(va: Detpedido): void{
      if (this.arfatp.moneda === this.arcgmo.moneda){
        const d = new Detpedido(this.detPedidos.length + 1, va.tipo, va.codigo, va.medida, va.descripcion,
          va.cantidad, va.precio, va.igv, va.total);
        this.detPedidos.push(d);
      }else{
        if (this.arfatp.moneda === 'SOL' && this.arcgmo.moneda === 'DOL' ){
            const prec = va.precio / this.tipocambio;
            const igv = prec * 0.18;
            const d = new Detpedido(this.detPedidos.length + 1, va.tipo, va.codigo, va.medida, va.descripcion,
              va.cantidad, prec, igv, (prec + igv));
            this.detPedidos.push(d);
        }
        if (this.arfatp.moneda === 'DOL' && this.arcgmo.moneda === 'SOL' ){
            const prec = va.precio * this.tipocambio;
            const igv = prec * 0.18;
            const d = new Detpedido(this.detPedidos.length + 1, va.tipo, va.codigo, va.medida, va.descripcion,
              va.cantidad, prec, igv , (prec + igv));
            this.detPedidos.push(d);
        }
      }

  }

  // TOTAL DE TOTAL
   private getTotalPedido(): number{
    return this.detPedidos.map(t => t.total).reduce((acc, value) => acc + value, 0);
  }
  // FIN

  // TOTAL DE IGV
  private getTotalIgv(): number{
    return this.detPedidos.map(t => t.igv).reduce((acc, value) => acc + value, 0);
  }
  // FIN

  // TOTAL DE P.U
  private getTotalPU(): number{
    return this.detPedidos.map(t => t.precio).reduce((acc, value) => acc + value, 0);
  }
  // FIN

  // CALCULAR RESTA
  public calcularResta(dp: Detpedido): void{
    const cantidad = dp.cantidad - 1;
    if (cantidad > 0) {
      const codigo = dp.codigo;
      this.detPedidos = this.detPedidos.map( (item: Detpedido) => {
           if (codigo === item.codigo){
              item.cantidad = cantidad;
              item.igv = item.calcularIgv();
              item.total = item.calcularTotal();
           }
           return item;
      } );
      // total de general
      this.totalGeneral = this.getTotalPedido();

      this.Toast.fire({
        icon: 'warning',
        title: `Se resto la cantidad del cod: ${dp.codigo}`
      });
    }else{
      this.snackBar.open(`La cantidad  del articulo ${dp.descripcion} no debe ser CERO`, 'Salir',
        {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
    }
  }

  // CALCULAR SUMA
  public calcularSuma(event: any, dp: Detpedido): void{
      const cant: number = event.target.value;
      const codigo = dp.codigo;
      const cantidad = cant;

      this.detPedidos = this.detPedidos.map( (item: Detpedido) => {
           if (codigo === item.codigo){
              item.cantidad = cantidad;
              item.igv = (dp.precio * 0.18 ) * cantidad;
              item.total = (dp.precio * 1.18 ) * cantidad;
           }
           return item;
      } );

      // total de general
      this.totalGeneral = this.getTotalPedido();
  }
   // CALCULAR SUMA
   public calcularDescuento(event: any, dp: Detpedido): void{
    const codigo = dp.codigo;
    const descuto: number = event.target.value;

    this.detPedidos = this.detPedidos.map( (item: Detpedido) => {
         if (codigo === item.codigo){
             // can = item.total - ((item.precio * item.cantidad) * (descuto/100));
             item.dcto = descuto;
             item.igv = ((dp.precio * 0.18 ) * item.cantidad) - (((dp.precio * 0.18 ) * item.cantidad) * (descuto/100) );
             item.total = ((dp.precio * 1.18 ) * item.cantidad) - (((dp.precio * 1.18 ) * item.cantidad) * (descuto/100) );
         }
         return item;
    } );
    // total de general
    this.totalGeneral = this.getTotalPedido();
}

  // ACTUALIZAR DESCRIPCION
  public actualizarDescripcion(event: any, dp: Detpedido): void{
    const codigo = dp.codigo;
    const descripcion: string = event.target.value;

    this.detPedidos = this.detPedidos.map( (item: Detpedido) => {
         if (codigo === item.codigo){
             item.descripcion = descripcion;
         }
         return item;
    } );
}

  // ELIMINAR ARTICULO
  public eliminarArticulo(dp: Detpedido): void{
    Swal.fire({
      title: 'Estas seguro de eliminar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
          const cod = dp.codigo;
          this.detPedidos = this.detPedidos.filter( (item: Detpedido) => cod !== item.codigo );
          this.llenarTablaArticulos();
          // total de general
          this.totalGeneral = this.getTotalPedido();
      }

    });

  }

  // CAMBIAMOS EL TIPO DE MONEDA DEL DETALLE DEL PEDIDO
  public cambiarMonedaDetPedido(a: Arcgmo): void{
    if (this.arfatp.moneda === 'SOL' && a.moneda === 'SOL'){

      this.detPedidos = this.detPedidos.map( (item: Detpedido) => {
              item.precio = item.precio * this.tipocambio;
              item.igv = item.calcularIgv();
              item.total = item.calcularTotal();
              return item;
      } );
      this.llenarTablaArticulos();
      // total de general
      this.totalGeneral = this.getTotalPedido();

    } else if (this.arfatp.moneda === 'SOL' && a.moneda === 'DOL'){
        this.detPedidos = this.detPedidos.map( (item: Detpedido) => {
                  item.precio = item.precio / this.tipocambio;
                  item.igv = item.calcularIgv();
                  item.total = item.calcularTotal();
                  return item;
        } );
        this.llenarTablaArticulos();
        // total de general
        this.totalGeneral = this.getTotalPedido();

    }else if (this.arfatp.moneda === 'DOL' && a.moneda === 'SOL'){
      this.detPedidos = this.detPedidos.map( (item: Detpedido) => {
              item.precio = item.precio * this.tipocambio;
              item.igv = item.calcularIgv();
              item.total = item.calcularTotal();
              return item;
      } );
      this.llenarTablaArticulos();
      // total de general
      this.totalGeneral = this.getTotalPedido();

    }else{
      this.detPedidos = this.detPedidos.map( (item: Detpedido) => {
              item.precio = item.precio / this.tipocambio;
              item.igv = item.calcularIgv();
              item.total = item.calcularTotal();
              return item;
      } );
      this.llenarTablaArticulos();
      // total de general
      this.totalGeneral = this.getTotalPedido();
    }
  }
  // FIN
  // CREACION DE UNA BOLETA
  public crearBoleta(): void{
    if (this.arccmc !== undefined){
        if (this.arcctda !== undefined){
            Swal.fire({
              title: '¿Está seguro de crear una BOLETA?',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'SI'
            }).then((result) => {
              if (result.isConfirmed) {
                  if (this.totalGeneral <= 700){
                      const codC2: string = this.groupEmpresa.get('codCli').value;
                      if(codC2 === '99999999998' || codC2 === '99999999999') {
                          this.crear_pedido('S', 'N');
                      }else{
                        if(this.arccmc.dni === null ) {
                          Swal.fire({
                            title: 'El cliente no tiene DNI. ¿Quiere actualizar el DNI del cliente?',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'SI'
                          }).then((result) => {
                            if (result.isConfirmed) {
                                this.ajusteCliente();
                            }
                          });
                        }else {
                          if(this.arccmc.dni.length === 8) {
                             this.crear_pedido('S', 'N');
                          }else{
                            Swal.fire({
                              title: 'DNI no valido. ¿Quiere verificar el DNI del cliente?',
                              icon: 'warning',
                              showCancelButton: true,
                              confirmButtonColor: '#3085d6',
                              cancelButtonColor: '#d33',
                              confirmButtonText: 'SI'
                            }).then((result) => {
                              if (result.isConfirmed) {
                                  this.ajusteCliente();
                              }
                            });
                          }

                        }
                      }

                  }else{
                      const codC: string = this.groupEmpresa.get('codCli').value;
                      if ( codC === '99999999998' || codC === '99999999999'){
                          this.snackBar.open(`El valor de la media UIT S/700.00 fue superado. No puede hacer una boleta con Clientes Varios`, 'Salir',
                          {
                            duration: 7000,
                            verticalPosition: 'top',
                            horizontalPosition: 'center'
                          });

                      }else{
                        if (this.arccmc.dni !== null) {
                          this.crear_pedido('S', 'N');
                        }else{
                          Swal.fire({
                            title: `DNI no valido. ¿Quiere verificar el DNI del cliente?`,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'SI'
                          }).then((result) => {
                            if (result.isConfirmed) {
                                this.ajusteCliente();
                            }
                          });
                        }

                      }
                  }
              }
            });
        }else {
            Swal.fire('Dirección del cliente es invalido.');
        }
    }else {
      Swal.fire('El codigo o nombre del cliente es invalido.');
    }
  }
  // FIN
  // CREACION DE UNA FACTURA
  public crearFactura(): void{
    if (this.arccmc !== undefined){
        if (this.arcctda !== undefined){
            Swal.fire({
              title: '¿Está seguro de crear una FACTURA?',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes'
            }).then((result) => {
              if (result.isConfirmed) {
                const ruc: string = this.groupEmpresa.get('codCli').value;
                if ( ruc === '99999999998' || ruc === '99999999999'){
                     Swal.fire('No puede hacer una FACTURA con Clientes Varios');
                }else{
                  if (this.arccmc.ruc === null ) {
                      Swal.fire({
                        title: 'El cliente no tiene RUC. ¿Quiere actualizar el RUC del cliente?',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'SI'
                      }).then((result) => {
                        if (result.isConfirmed) {
                            this.ajusteCliente();
                        }
                      });
                  }else {
                    if (this.arccmc.ruc.length === 11) {
                        this.crear_pedido('N', 'S');
                    }else{
                        Swal.fire({
                          title: 'RUC no valido. ¿Quiere verificar el RUC del cliente?',
                          icon: 'warning',
                          showCancelButton: true,
                          confirmButtonColor: '#3085d6',
                          cancelButtonColor: '#d33',
                          confirmButtonText: 'SI'
                        }).then((result) => {
                          if (result.isConfirmed) {
                              this.ajusteCliente();
                          }
                        });
                    }
                  }

                }

              }

            });
        }else {
            Swal.fire('Dirección del cliente es invalido.');
        }
    }else {
      Swal.fire('El codigo o nombre del cliente es invalido.');
    }
  }
  // FIN
  // CREACION DE UNA BOLETA
  public crearCotizacion(): void{
      Swal.fire({
        title: '¿Está seguro de crear una Proforma?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.isConfirmed) {
            this.crear_pedido('N', 'N');
        }
      });
    }
    // FIN

  // CREAR PEDIDO
  public crear_pedido(indBoleta: string, indFactura: string): void{

    const correlativo = '0000000';
    const cortar = this.arfacc.consDesde.toString().length  * -1;
    this.orden = this.arfacc.arfaccPK.serie + correlativo.slice(0, cortar) + this.arfacc.consDesde;
    // PEDIDO PK
    const arpfoePK = new IdArpfoe();
    arpfoePK.noCia = this.cia;
    arpfoePK.noOrden = this.orden;
    // PEDIDO
    const pedido = new Arpfoe();
    pedido.arpfoePK = arpfoePK;
    pedido.grupo = '00';
    pedido.tipoFpago = '20';
    pedido.tipo = 'N';
    pedido.noSolic = this.ordenCompra;
    pedido.indPvent = 'S';
    pedido.indGuiado = 'N';
    pedido.codiDepa = this.ubigeo.substring(0, 2);
    pedido.codiProv = this.ubigeo.substring(2, 3);
    pedido.codiDist = this.ubigeo.substring(3, 2);
    pedido.motivoTraslado = '1';
    pedido.indBoleta1 = indBoleta;
    pedido.indFactura1 = indFactura;
    pedido.noCliente = this.groupEmpresa.get('codCli').value;
    pedido.ruc = this.groupEmpresa.get('codCli').value;
    pedido.division = '003';
    pedido.noVendedor = sessionStorage.getItem('cod');
    pedido.codTPed = this.transaccion.codTPed;
    pedido.codFpago = this.tapfopa.tapfopaPK.codFpago;
    pedido.fechaRegistro = moment(this.fechaSeleccionada).format('YYYY-MM-DDTHH:mm:ss');
    pedido.fAprobacion = moment(this.fechaSeleccionada).format('YYYY-MM-DDTHH:mm:ss');
    pedido.fRecepcion = moment(this.fechaSeleccionada).format('YYYY-MM-DDTHH:mm:ss');
    pedido.tipoPrecio = this.arfatp.idArfa.tipo;
    pedido.moneda = this.arcgmo.moneda;
    pedido.tipoCambio = this.tipocambio;
    pedido.subTotal = this.getTotalPedido() - this.getTotalIgv();
    pedido.tValorVenta = this.getTotalPedido() - this.getTotalIgv();
    pedido.totalBruto = this.getTotalPedido() - this.getTotalIgv();
    pedido.tImpuesto = this.getTotalIgv();
    pedido.tPrecio = this.getTotalPedido();
    pedido.impuesto = 18;
    if (indBoleta === 'N' && indFactura === 'N') {
      pedido.estado = 'R';
    } else {
      pedido.estado = 'C';
    }

    pedido.bodega = this.arintd.almaOri;
    pedido.igv = 18;
    pedido.direccionComercial = this.arcctda.direccion.substring(0,190);
    pedido.motivoTraslado = '1';
    pedido.nombreCliente = this.groupEmpresa.get('racSoc').value;
    pedido.codClasPed = 'V';
    pedido.tipoPago = '20';
    pedido.tValorVenta = this.getTotalPU();
    pedido.almaOrigen = this.arintd.almaOri;
    pedido.almaDestino = this.arintd.almaDes;
    pedido.totalBruto = this.getTotalPU();
    pedido.centro = sessionStorage.getItem('centro');
    pedido.codCaja = this.arcaaccaj.idArcaja.codCaja;
    pedido.cajera = this.arcaaccaj.cajera;
    pedido.centroCosto = '3201';
    pedido.operExoneradas = 0;
    pedido.operGratuitas = 0;
    pedido.operGravadas = this.getTotalPedido() - this.getTotalIgv();
    pedido.operInafectas = 0;
    pedido.tipoOperacion = '0101';
    pedido.emailPedido = this.email;
    pedido.tipoArti = '1';
    let contador = 0;
    const dps: Arpfol[] = [];
    for (const x of this.detPedidos){
        contador = contador + 1;
        const dPedidoPK = new IdArpfol();
        dPedidoPK.noCia = sessionStorage.getItem('cia');
        dPedidoPK.noOrden = this.orden;
        dPedidoPK.noArti = x.codigo;

        const dPedido = new Arpfol();
        dPedido.arpfolPK = dPedidoPK;
        dPedido.noCliente = this.groupEmpresa.get('codCli').value;
        dPedido.tipoArti = 'C';
        dPedido.artiNuevo = 'N';
        dPedido.bodega = '1A001';
        dPedido.cantComp = x.cantidad;
        dPedido.cantSolicitada = x.cantidad;
        dPedido.cantEntreg = x.cantidad;
        dPedido.cantAsignada = x.cantidad;
        dPedido.cantReasignada = 0;
        dPedido.precio = x.precio;
        dPedido.totLinea = x.cantidad * x.precio;
        dPedido.igv = 18;
        dPedido.noLinea = contador;
        dPedido.impIgv = x.igv;
        dPedido.totalLin = x.total;
        dPedido.descripcion = x.descripcion;
        dPedido.tipoBs = x.tipo;
        dPedido.operExoneradas = 0;
        dPedido.operGratuitas = 0;
        dPedido.operGravadas = x.cantidad * x.precio;
        dPedido.operInafectas = 0;
        dPedido.tipoAfectacion = '10';
        dPedido.medida = x.medida;
        dPedido.icbper = 0;
        dPedido.precioUni = x.precio;
        dPedido.dscto = x.dcto;
        dps.push(dPedido);
    }
    pedido.arpfolList = dps;
    // VAMOS A GUARDAR LA SERIE Y EL CORRELATIVO DEL PEDIDO
    this.arfaccService.saveArfacc(this.arfacc).subscribe( dato => {
      this.snackBar.open('Se actualizo el correlativo del pedido ', 'Salir',
          {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
    });
    // VAMOS A GUARDAR EL PEDIDO
    this.arpfoeService.savePedido(pedido).subscribe(dato => {
      // GUARDAR GUIA REMISION
      this.guardarGuiaRemision(pedido);
      this.guardarArinme1(pedido);
      this.actualizarArinse();
      this.actualizarArfacf();
    }, error => {
      this.savePed = false;
      Swal.fire('No se pudo guardo la información.');
      }
    );
    if(this.savePed) {
      if (indBoleta === 'N' && indFactura === 'N') {
          this.snackBar.open('SE GUARDO COTIZACIÓN', 'Salir',
          {
            duration: 1500,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
          // VAMOS A LA LISTA DE PEDIDOS
          this.router.navigate(['pedido/lista']);
          // FIN
      }else{
          // VAMOS A BOLETEAR O FACTURAR
          setTimeout(() => {
            this.router.navigate(['pedido/arfafe/new'], {queryParams: {noCia: this.cia, noOrden: this.orden, guia: this.guia}}); }, 2000
          );
          // FIN
      }
    }

  }

  // METODO QUE NOS PERMITE GUARDAR LA ARPFFE (GUIA DE REMISION)
  private guardarGuiaRemision(arpfoe: Arpfoe): void{
    const arpffepk = new Arpffepk();
    arpffepk.noCia = this.cia;
    arpffepk.bodega = arpfoe.almaOrigen;
    const correlativo = '0000000';
    const cortar = this.arfacf.correlFict.toString().length  * -1;
    this.guia = this.arfacf.serieGr + correlativo.slice(0, cortar) + this.arfacf.correlFict;
    arpffepk.noGuia = this.guia;
    const arpffe = new Arpffe();
    arpffe.arpffePK = arpffepk;
    arpffe.fecha = moment(this.fechaSeleccionada).format('YYYY-MM-DDTHH:mm:ss');
    arpffe.grupo = '00';
    arpffe.noCliente = arpfoe.noCliente;
    arpffe.noVendedor = this.codEmp;
    arpffe.descripcion = `Generado por Inventarios - Transc.:${arpfoe.codTPed}, No Doc.:${this.arinse.secuencia}`;
    arpffe.noOrden = arpfoe.arpfoePK.noOrden;
    arpffe.estado = 'D';
    arpffe.tipoDoc = '';
    arpffe.noFactu = '';
    arpffe.centro = this.centro;
    arpffe.tipo = 'V';
    arpffe.clase = 'V';
    arpffe.noDocu = this.arinse.secuencia.toString();
    arpffe.tipoTransc = arpfoe.codTPed;
    arpffe.usuario = 'VENTAS';
    arpffe.fechaInicio = moment(this.fechaSeleccionada).format('YYYY-MM-DDTHH:mm:ss');
    arpffe.codFpago = this.tapfopa.tapfopaPK.codFpago;
    arpffe.almaOrigen = arpfoe.almaOrigen;
    arpffe.almaDestino = arpfoe.almaDestino;
    arpffe.nombreDigi = arpfoe.nombreCliente;
    arpffe.indFactura = arpfoe.indFactura1;
    arpffe.indBoleta = arpfoe.indBoleta1;
    arpffe.codTienda = '001';
    arpffe.tipoGuia = 'GR';
    arpffe.imprime = 'S';
    arpffe.indPvent = 'S';
    arpffe.codCaja = this.arcaaccaj.idArcaja.codCaja;
    arpffe.indFerias = 'N';
    arpffe.indProvincia = 'N';
    arpffe.consumo = 'N';
    arpffe.convenio = 'N';
    arpffe.indCodBarra = 'N';
    arpffe.indFicta = 'N';
    arpffe.indProforma = 'N';
    // DETALLE DE GUIA DE REMISION
    const arpffls: Arpffl[] = [];
    for ( const p of arpfoe.arpfolList ){
      const arpfflpk = new Arpfflpk();
      arpfflpk.noGuia = this.guia;
      arpfflpk.noCia = this.cia;
      arpfflpk.bodega = arpfoe.almaOrigen;
      arpfflpk.noArti = p.arpfolPK.noArti;
      const arpffl = new Arpffl();
      arpffl.arpfflPK = arpfflpk;
      arpffl.descripcion = p.descripcion;
      arpffl.cantidad = p.cantEntreg.toString();
      arpffl.indParentesco = 'N';
      arpffl.noLinea = p.noLinea;
      arpffl.tipoBs = this.tipoItem;
      // AGREGAR EL DETALLE DE GUIA
      arpffls.push(arpffl);
    }
    arpffe.arpfflList = arpffls;
    // GUARDAMOS LA GUIA DE REMISION
    this.arpffeService.guardar(arpffe).subscribe(value => {
      this.arpffe = value;
    });
  }
  // FIN
  // METODO QUE NOS PERMITE ACTUALIZAR EL NO-DOCU
  private actualizarArinse(): void{
    this.arinseService.actualizar(this.arinse).subscribe(value => {
       this.arinse = value;
    });
  }
  // FIN
  // METODO QUE NOS PERMITE ACTUALIZAR ARFACF, INCREMENTAR CORRE-FICTA
  private actualizarArfacf(): void{
    this.arfacfService.ingrementarCorreFicta(this.arfacf).subscribe();
  }
  // FIN
  // METODO QUE NOS PERMITE GUARDAR ARINME
  private guardarArinme1(ped: Arpfoe): void{
    const arinme1pk = new Arinme1pk();
    arinme1pk.noCia = this.cia;
    arinme1pk.bodega = ped.almaOrigen;
    arinme1pk.tipoDoc = ped.codTPed;
    arinme1pk.noDocu = this.arinse.secuencia.toString();
    // ARINME1
    const arinme1 = new Arinme1();
    arinme1.arinme1PK = arinme1pk;
    arinme1.grupo = '1A';
    arinme1.noOrden = ped.almaDestino;
    arinme1.noGuia = this.guia;
    arinme1.tipoDocRec = 'G';
    arinme1.tipoDocRem = 'G';
    arinme1.serieDocRem = this.arfacf.serieGr;
    arinme1.corrDocRem = this.guia.substring(3);
    arinme1.noRefe = '';
    arinme1.tipoDocRec = 'P';
    arinme1.corrDocRec = '';
    arinme1.fecha = moment(this.fechaSeleccionada).format('YYYY-MM-DDTHH:mm:ss');
    arinme1.estado = 'D';
    arinme1.formaPago = this.tapfopa.tapfopaPK.codFpago;
    arinme1.tipoCambio = this.tipocambio;
    arinme1.anoProce = Number(moment(this.fechaSeleccionada).format('YYYY'));
    arinme1.mesProce = Number(moment(this.fechaSeleccionada).format('MM'));
    arinme1.moneda = this.arcgmo.moneda;
    arinme1.indControl = 'N';
    arinme1.statusControl = 'N';
    arinme1.usuario = this.usuario;
    arinme1.almaOrigen = ped.almaOrigen;
    arinme1.almaDestino = ped.almaDestino;
    arinme1.motivoTraslado = '1';
    arinme1.noPedMant = ped.arpfoePK.noOrden;
    arinme1.noCliente = ped.noCliente;
    arinme1.direccionComercial = ped.direccionComercial;
    arinme1.noVendedor = this.codEmp;
    arinme1.tipoCosto = 'P';
    arinme1.indGuiado = 'S';
    arinme1.codFpago = ped.codFpago;
    arinme1.tipoArti = '1';
    arinme1.claseTransc = 'V';
    arinme1.nombreDigi = ped.nombreCliente;
    arinme1.indFactura = ped.indFactura1;
    arinme1.indBoleta = ped.indBoleta1;
    arinme1.codTienda = '001';
    arinme1.codDirEntrega = '001';
    arinme1.codDirSalida = '001';
    arinme1.imprime = 'N';
    arinme1.centro = this.centro;
    arinme1.indPvent = 'S';
    arinme1.codCaja = this.arcaaccaj.idArcaja.codCaja;
    arinme1.indProvincia = 'N';
    arinme1.convenio = 'N';
    arinme1.consumo = 'N';
    arinme1.demasia = 'N';
    arinme1.grabaCodBarra = 'N';
    arinme1.indCodBarra = 'N';
    // DETALLE ARINME1
    const arinml1s: Arinml1[] = [];
    for (const pl of ped.arpfolList){
      const arinml1pk = new Arinml1pk();
      arinml1pk.noCia = this.cia;
      arinml1pk.bodega = ped.almaOrigen;
      arinml1pk.tipoDoc = ped.codTPed;
      arinml1pk.noDocu = this.arinse.secuencia.toString();
      arinml1pk.noArti = pl.arpfolPK.noArti;
      const arinml1 = new Arinml1();
      arinml1.arinml1PK = arinml1pk;
      arinml1.noLinea = pl.noLinea;
      arinml1.lote = moment(this.fechaSeleccionada).format('YYYY-MM-DDTHH:mm:ss');
      arinml1.noEntrada = '-';
      arinml1.unidades = pl.cantEntreg;
      arinml1.contenido = pl.cantEntreg;
      arinml1.undReferencia = pl.cantEntreg;
      arinml1.loteLog = pl.cantEntreg;
      arinml1.stockAlmacen = pl.cantEntreg;
      arinml1.tipoBs = this.tipoItem;
      arinml1s.push(arinml1);
    }
    arinme1.arinml1List = arinml1s;
    // LLAMAMOS AL SERVICIO DE PARA GUARDAR EL REGISTRO DE MOVIMIENTO
    this.arinme1Service.guardar(arinme1).subscribe();

  }
  // FIN
  // AÑADIR ITEMS LIBRES
  public addItem(): void{
    // console.log(this.groupArticulo.value);
    const cod: string = this.groupArticulo.get('codProd').value;
    const um: string = this.groupArticulo.get('umProd').value;
    const descrip: string = this.groupArticulo.get('desProd').value;
    const cantidad: number = this.groupArticulo.get('cantProd').value;

    /*if(um === 'UND'){*/
    const precio  = this.groupArticulo.get('precProd').value / 1.18;
    const igv = (this.groupArticulo.get('precProd').value - precio) * cantidad;
    const total = (precio * cantidad) + igv;
    this.d = new Detpedido(this.detPedidos.length + 1, 'L', cod.toUpperCase(), um.toUpperCase(), descrip.toUpperCase(),cantidad, precio, igv, total);
     /*}else {
      const total = this.groupArticulo.get('precProd').value * cantidad;
      const precio  = total / 1.18;
      const igv = precio * 0.18;
      this.d = new Detpedido(this.detPedidos.length + 1, 'L', cod.toUpperCase(), um.toUpperCase(), descrip.toUpperCase(),
        cantidad, precio, igv, total);
    }*/
    if (this.groupArticulo.get('precProd').value <= 0){
      this.snackBar.open(`El precio no debe ser CERO.`, 'Salir',
      {
        duration: 1000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    }else{
        // BUSCAMOS SI EXISTE ITEM
        const dp = this.detPedidos.find(x => x.codigo === this.d.codigo);
        // console.log(dp);
        if (dp === undefined) {
          this.detPedidos.push(this.d);
          this.snackBar.open(`Se agrego el articulo`, 'Salir',
          {
            duration: 1000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
          this.llenarTablaArticulos();
          // total de general
          this.totalGeneral = this.getTotalPedido();
          this.limpiarItemsLibre();
        }else{
          // EL CODIGO YA EXISTE
          this.snackBar.open(`El codigo ya existe del articulo ${dp.descripcion}`, 'Salir',
          {
            duration: 1000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
        }
    }
  }
  // FIN

  // SELECCIONAR UNA TRANSACCION
  private getTrasaccion(cia: string, trans: string): void{
      this.arintdService.findArintd(cia, trans).subscribe(data => {
        this.arintd = data;
        // VERIFICAMOS SI EL DOCUMENTO NO TIENE G
        if ( this.arintd.docuGene === 'G'){
          // BUSCAR EL NO-DOCU
          this.getNoDocu(this.cia, this.arintd.almaOri, trans);
        }else{
          this.anularBF = 'S';
          this.snackBar.open(`Tipo de Documento Incorrecto, Verifiqué`, 'Salir',
          {
            duration: 2000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
        }
      }, err => {
        console.warn(err);
      });
  }

  // BUSCAMOS EL NO_DOCU DE LA COMPAÑIA, BODEGA y TRANSACCION
  private getNoDocu(cia: string, bodega: string, trans: string): void{
      this.arinseService.getArinse(cia, bodega, trans).subscribe(value => {
         this.arinse = value;
      });
  }

  // SELECCIONAR CENTRO EMISOR
  private getCentroEmisor(cia: string, centro: string): void{
     const arfacfpk = new Arfacfpk();
     arfacfpk.noCia = cia;
     arfacfpk.centro = centro;
     this.arfacfService.getArfacf(arfacfpk).subscribe( data => {
         this.arfacf = data;
     });
  }
  // FIN
  // EVENTO SELECCIONAR DE TRANSACCION
  public findTransaccion($event): void{
    this.transaccion = $event.value;
    this.getTrasaccion(this.cia, this.transaccion.codTPed);
  }
  // SABER QUE TIPO DE ITEM ESTAMOS TRABAJANDO
  public saberItem(tipo: string): void{
    this.tipoItem = tipo;
  }
  // AJUSTE DE CLIENTE
  public ajusteCliente(): void{
    this.modalArccmc.open(MarccmcComponent, {
          width: '500px',
          height: '80%',
          data: this.arccmc
    });
    this.groupEmpresa.controls['codCli'].setValue('');
    this.groupEmpresa.controls['racSoc'].setValue('');
    this.arccmc = null;
  }
  // FIN

}
