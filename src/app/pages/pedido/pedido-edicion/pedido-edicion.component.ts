import { Arpfoe } from './../../../models/Arpfoe';
import { Arinda } from './../../../models/Arinda';
import { ArticuloService } from './../../../services/articulo.service';
import { IdArpfol } from './../../../models/IdArpfol';
import { Arpfol } from './../../../models/Arpfol';
import Swal from 'sweetalert2';
import { DatosClienteDTO } from './../../../DTO/DatosClienteDTO';
import { ArccmcService } from './../../../services/arccmc.service';
import { map, switchMap } from 'rxjs/operators';
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
import { MatRadioChange } from '@angular/material/radio';
import { MatDialog } from '@angular/material/dialog';
import { ItemsDialogoComponent } from '../../articulo/items-dialogo/items-dialogo.component';
import { BuscarItem } from '../../../models/buscar-item';
import { Detpedido } from '../../../models/detpedido';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ArpfoeService } from '../../../services/arpfoe.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'app-pedido-edicion',
  templateUrl: './pedido-edicion.component.html'
})
export class PedidoEdicionComponent implements OnInit {

  form: FormGroup;
  // NUEVO CAMBIOS
  groupEmpresa: FormGroup;
  groupArticulo: FormGroup;

  factuOptions: Observable<Arccmc[]>;
  arccmcs: Arccmc[];
  // FIN

  fechaSeleccionada: Date = new Date();
  detallePedido: Arpfol[] = [];
  articulos: Arinda[] = [];
  // PEDIDO CABECERA MUESTRA
  /*=====================================================*/
  orden: string;
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

  myControlArticulo: FormControl = new FormControl({value: '', disabled: true });

  articulosFiltrados: Observable<Arinda[]>;

  public arfacc: IArfacc;
  public arfaccs: IArfacc[];
  public arfaccPK: IarfaccPK;
  public cia: string;
  public centro: string;
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

  public tipoItem: string;

  public detPedidos: Detpedido[] = [];
  // NUEVO CAMBIOS
  displayedColumns: string[] = ['tipo', 'codigo', 'medida', 'descripcion', 'cantidad', 'precio', 'igv', 'total', 'eliminar'];
  // FIN
  dataSource: MatTableDataSource<Detpedido>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  arccmcObservable: Observable<Arccmc[]>;
  arccmc: Arccmc;
  descBien: string = '';
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

  constructor(public pedidoService: PedidoService,
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
              private snackBar: MatSnackBar,
              private dialogItems: MatDialog,
              private router: Router,
              public datepipe: DatePipe
              ) { }

  ngOnInit(): void {
    this.cia = sessionStorage.getItem('cia');
    this.centro = sessionStorage.getItem('centro');
    this.usuario = sessionStorage.getItem('usuario');
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

    this.listaMonedas();
    this.transaccionXCia();
    this.serieCorrelativoPedido();
    this.buscarTipoCambioClaseAndFecha();
    this.listaPrecio();
    this.listarFormaPago();

    this.groupEmpresa = new FormGroup({
      ruc: new FormControl(),
      racSoc: new FormControl()
    });

    this.groupArticulo = new FormGroup({
      codProd: new FormControl(),
      desProd: new FormControl(),
      umProd: new FormControl({ value: 'UND', disabled: false }, Validators.required),
      precProd: new FormControl({ value: 0, disabled: false }, Validators.required),
      cantProd: new FormControl({ value: 1, disabled: false }, Validators.required)
    });

    this.getCliente('99999999998');
    //BUSCAR POR RUC
    this.groupEmpresa.get('ruc').valueChanges.subscribe(valueChange => {
      if (valueChange.length > 3) {
         // this.factuOptions = this.clienteServices.listaClientesRucLike(this.cia,valueChange);
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
         let nombre: string = valueChange;
         this.factuOptions = this.arccmcService.listaClientesDescripLike(this.cia,nombre.toUpperCase().trim());
      }
      else {
        this.factuOptions = null;
      }
    });
  }
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
  public buscarClienteXnombre(e: any){
    const nombre: string = e.target.value;
    this.arccmcObservable = this.arccmcService.listaClientesDescripLike(this.cia, nombre.toUpperCase().trim());
  }

  // SELECCIONAMOS UN CLIENTE POR SU NOMBRE O RAZON SOCIA
  public seleccionarClienteXdescrip($event: MatAutocompleteSelectedEvent){
    this.arccmc = $event.option.value;
    this.groupEmpresa.controls.ruc.setValue(this.arccmc.objIdArc.id , {emitEvent: false});
    this.groupEmpresa.controls.racSoc.setValue(this.arccmc.nombre, {emitEvent: false});
    this.arcctdas = this.arccmc.arcctdaEntity;
  }

  // NUEVO CAMBIOS
  setFormData($event: MatAutocompleteSelectedEvent) {
    const factuOptions = $event.option.value;
    if (factuOptions){
      this.groupEmpresa.controls.ruc.setValue(factuOptions.ruc, {emitEvent: false});
      this.groupEmpresa.controls.racSoc.setValue(factuOptions.nombre, {emitEvent: false});
      this.arcctdas = factuOptions.arcctdaEntity;
    }
  }

   // NUEVO CAMBIOS
   public getDirecciones($event) {
      this.arcctda = $event.value;
      this.ubigeo = this.arcctda.codiDepa.concat(this.arcctda.codiProv).concat(this.arcctda.codiDist);
  }

  // FIN
  filtrarArticulos(val: any) {
    if (val != null) {
      const filtro: string = String(val);
      this.arindaService.listaArtiDesc(sessionStorage.getItem('cia'), filtro.trim()).subscribe(data => {
        this.articulos = data;
      });
      return this.articulos;
    }

  }

  mostrarArticulo(val: Arinda) {
    return val ? `${val.idArti.noArti} ${val.descripcion}` : val;

  }

  seleccionarArticulo(e: any) {
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

  calcularImporte() {
    this.precioCant = this.precio * this.cantAsignada;
    this.impIgv = (this.precio * this.cantAsignada) * 0.18;
    this.totalLin = (this.precio * this.cantAsignada) + this.impIgv;
  }

  noOrden() {
    this.pedidoService.noOrdern(sessionStorage.getItem('cia'), sessionStorage.getItem('centro')).subscribe(data => {
      this.orden = data;
    });
  }

  traeCliente() {
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
      if (err.status == 404) {
        Swal.close();
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          title: 'Cliente no Existe o se Encuentra inactivo!!'
        });
      }
    });
  }
  estadoBotonCliente() {
    return (this.codCliente === '');
  }

  removerDetalle(index: number) {
    this.detallePedido.splice(index, 1);
    this.getTotal();
  }

  public getTotal() {
    this.totalGeneral =  this.detallePedido.map(t => t.totalLin).reduce((acc, value) => acc + value, 0);
    // this.subTotal = this.detallePedido.map(t => t.operGravadas).reduce((acc, value) => acc + value, 0);
    this.totalIGV = this.detallePedido.map(t => t.impIgv).reduce((acc, value) => acc + value, 0);
    this.subTotal = this.totalGeneral - this.totalIGV;
  }

  limpiarControles() {
    this.detallePedido = [];
    this.articulos = [];

    this.orden = '';
    this.codCliente = '';
    this.nomCli = '';
    this.direccion = '';
    this.email = '';
  // DETALLE PEDIDO MUESTRA
  /*=====================================================*/
    this.tipoBS = '';
    this.tipoAfectacion = '';
    this.cantAsignada = 0;
    this.precioCant = 0;
    this.precio = 0;
    this.pDSCTO3 = 0;
    this.impIgv = 0;
    this.totalLin = 0;

    this.totalGeneral = 0;
    this.subTotal = 0;
    this.totalIGV = 0;
    this.impuesto = 18;


    this.articuloSeleccionado = null;
    // this.pacientesFiltrados = EMPTY;
    // this.medicosFiltrados = EMPTY;
    this.fechaSeleccionada = new Date();
    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setSeconds(0);
    this.fechaSeleccionada.setMilliseconds(0);
    this.myControlArticulo.reset();

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
        this.buscarTransaccion('1315');
      },
        error => {
          console.error(error);
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

  // EVENTO CUANDO HACE UN CAMBIO EL RADIO BUTTON DE TIPO ITEMS
  public getTipoItem(event: MatRadioChange){
    // console.log(event.source.name, event.value);
    if (event.value === 'B') {
       console.log('Entro en el radio button : BIEN');
    }else{
      console.log('Entro en el radio button : LIBRE');
    }

  }
  // FIN RADIO BUTTON DE TIPO ITEMS

  // ABRIR DIALOGO DE ITEMs
  public openDialogoItem(): void{
      // console.log(this.groupArticulo.get('desProd').value);
      const buscarItem = new BuscarItem(this.cia, this.arfatp.idArfa.tipo, this.descBien.toUpperCase().trim());
      const dialogRef = this.dialogItems.open(ItemsDialogoComponent, {
                        width: '100%',
                        data: buscarItem
                      });
      dialogRef.afterClosed().subscribe( result => {
        // VAMOR A RECORRER EL ARREGLO DE ITEMS
        result.forEach(element => {
           this.verificarItems(element);
        });
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
    if (this.detPedidos.length == 0){
          // this.detPedidos.push(dp);
          this.actualizarCorrelativo(dp);
    } else {
       const cod = dp.codigo;
       let valor = 'N';
       // VAMOS A RECORRER EL ARREGLO SI YA EXISTE EL ITEM
       for (const i in this.detPedidos){
            if (cod == this.detPedidos[i].codigo){
              valor = 'S';
              break;
            }
        }

       if (valor == 'N'){
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
          duration: 1000,
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
      /*this.Toast.fire({
        icon: 'success',
        title: `Se aumento la cantidad del cod: ${dp.codigo}`
      });*/
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
  public crearBoleta(){
    Swal.fire({
      title: '¿Está seguro de crear una BOLETA?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
          if (this.totalGeneral <= 700){
            this.crear_pedido('S', 'N');
          }else{
              const ruc: string = this.groupEmpresa.get('ruc').value;
              if ( ruc === '99999999998' || ruc === '99999999999' ){
                this.snackBar.open(`El valor de la media UIT S/700.00 fue superado. Ingrese su RUC del cliente y el cliente es nuevo registralo.`, 'Salir',
                {
                  duration: 5000,
                  verticalPosition: 'top',
                  horizontalPosition: 'center'
                });
              }else{
                this.crear_pedido('S', 'N');
              }

          }

      }

    });
  }
  // FIN
  // CREACION DE UNA FACTURA
  public crearFactura(){
    Swal.fire({
      title: '¿Está seguro de crear una FACTURA?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        const ruc: string = this.groupEmpresa.get('ruc').value;
        if ( ruc === '99999999998' || ruc === '99999999999' ){
          this.snackBar.open(`Ingrese su RUC del cliente y el cliente es nuevo registralo.`, 'Salir',
          {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
        }else{
          this.crear_pedido('N', 'S');
        }

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
    arpfoePK.noCia = sessionStorage.getItem('cia');
    arpfoePK.noOrden = this.orden;
    // PEDIDO
    const pedido = new Arpfoe();
    pedido.arpfoePK = arpfoePK;
    pedido.grupo = '00';
    pedido.tipoFpago = '20';
    pedido.tipo = 'N';

    pedido.indPvent = 'S';
    pedido.indGuiado = 'N';
    pedido.codiDepa = this.ubigeo.substring(0, 2); // 150137
    pedido.codiProv = this.ubigeo.substring(2, 3);
    pedido.codiDist = this.ubigeo.substring(3, 2);
    pedido.motivoTraslado = '1';
    pedido.indBoleta1 = indBoleta;
    pedido.indFactura1 = indFactura;

    pedido.noCliente = this.groupEmpresa.get('ruc').value;
    pedido.ruc = this.groupEmpresa.get('ruc').value;

    pedido.division = '003';
    pedido.noVendedor = sessionStorage.getItem('cod');
    pedido.codTPed = this.transaccion.codTPed;
    // console.log('Forma de Pago : '+this.tapfopa.tapfopaPK.codFpago);
    pedido.codFpago = this.tapfopa.tapfopaPK.codFpago;
    /*
    pedido.fechaRegistro = this.datepipe.transform(this.fechaSeleccionada,'YYYY-MM-DDTHH:mm:ss');
    pedido.fAprobacion = this.datepipe.transform(this.fechaSeleccionada,'YYYY-MM-DDTHH:mm:ss');
    pedido.fRecepcion = this.datepipe.transform(this.fechaSeleccionada,'YYYY-MM-DDTHH:mm:ss');
    */
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
    pedido.estado = 'E';
    pedido.bodega = '1A001';
    pedido.igv = 18;
    pedido.direccionComercial = this.arcctda.direccion;
    pedido.motivoTraslado = '1';
    pedido.nombreCliente = this.groupEmpresa.get('racSoc').value;
    pedido.codClasPed = 'V';
    pedido.tipoPago = '20';
    pedido.tValorVenta = this.getTotalPU();
    pedido.almaOrigen = '1A001';
    pedido.almaDestino = '1XLIE';
    // pedido.noClienteSalida = this.codCliente;
    pedido.totalBruto = this.getTotalPU();
    /*pedido.codTPed1='1352';
    pedido.codTPedb='1353';
    pedido.codTPedn='1214';*/
    pedido.centro = sessionStorage.getItem('centro');
    pedido.codCaja = 'C11';
    pedido.cajera = '000002';
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
        dPedido.noCliente = this.groupEmpresa.get('ruc').value;
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
        dPedido.precioUni = 0;
        dps.push(dPedido);
    }
    pedido.arpfolList = dps;
    console.log(pedido);

    // VAMOS A GUARDAR LA SERIE Y EL CORRELATIVO DEL PEDIDO
    this.arfaccService.saveArfacc(this.arfacc).subscribe( dato => {
      this.snackBar.open('Se actualizo el correlativo del pedido ', 'Salir',
          {
            duration: 1000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
    });
    // VAMOS A GUARDAR EL PEDIDO
    this.arpfoeService.savePedido(pedido).subscribe(dato => {
      this.snackBar.open('Se Guardo el pedido', 'Salir',
      {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    });
    // VAMOS A BOLETEAR O FACTURAR
    // this.router.navigateByUrl(`/pedido/arfafe/new?noCia=${this.cia}&noOrden=${this.orden}`);
    setTimeout(() => {
      this.router.navigate(['pedido/arfafe/new'], {queryParams: {noCia: this.cia, noOrden: this.orden}}); }, 2000
    );

  }

  // AÑADIR ITEMS LIBRES
  public addItem(){
    // console.log(this.groupArticulo.value);
    const cod: string = this.groupArticulo.get('codProd').value;
    const um: string = this.groupArticulo.get('umProd').value;
    const descrip: string = this.groupArticulo.get('desProd').value;
    const cantidad: number = this.groupArticulo.get('cantProd').value;

    const precio: number = this.groupArticulo.get('precProd').value / 1.18;
    const igv = (this.groupArticulo.get('precProd').value - precio) * cantidad;
    const total = (precio * cantidad) + igv;
    const d = new Detpedido(this.detPedidos.length + 1, 'L', cod.toUpperCase(), um.toUpperCase(), descrip.toUpperCase(), cantidad, precio, igv, total);
    if (precio <= 0){
      this.snackBar.open(`El precio no debe ser CERO.`, 'Salir',
      {
        duration: 1000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    }else{
        // BUSCAMOS SI EXISTE ITEM
        const dp = this.detPedidos.find(x => x.codigo === d.codigo);
        // console.log(dp);
        if (dp === undefined) {
          this.detPedidos.push(d);
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
}
