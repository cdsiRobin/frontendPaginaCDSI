import { CorrelDTO } from './../../../DTO/CorrelDTO';
import { PedidoDTO } from './../../../DTO/PedidoDTO';
import { Arpfoe } from './../../../models/Arpfoe';
import { Arinda } from './../../../models/Arinda';
import { ArticuloService } from './../../../services/articulo.service';
import { IdArpfol } from './../../../models/IdArpfol';
import { Arpfol } from './../../../models/Arpfol';
import Swal from 'sweetalert2';
import { DatosClienteDTO } from './../../../DTO/DatosClienteDTO';
import { ArccmcService } from './../../../services/arccmc.service';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { PedidoService } from './../../../services/pedido.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { IdArpfoe } from 'src/app/models/IdArpfoe';
import * as moment from 'moment';
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
import { Moneda } from '../../../models/moneda';

@Component({
  selector: 'app-pedido-edicion',
  templateUrl: './pedido-edicion.component.html'
})
export class PedidoEdicionComponent implements OnInit {

  form: FormGroup;
  //NUEVO CAMBIOS
  groupEmpresa:FormGroup;
  groupArticulo:FormGroup;
  factuOptions: Observable<Arccmc[]>;
  //FIN

  fechaSeleccionada: Date = new Date();
  detallePedido: Arpfol[] = [];
  articulos: Arinda[] = [];
  //PEDIDO CABECERA MUESTRA
  /*=====================================================*/
  orden:string;
  codCliente: string = '';
  nomCli: string;
  direccion: string;
  email: string;
  //DETALLE PEDIDO MUESTRA
  /*=====================================================*/
  tipoBS: string;
  articuloSeleccionado: Arinda;
  tipoAfectacion: string;
  cantAsignada: number = 0;
  precioCant: number = 0;
  precio: number = 0;
  pDSCTO3: number = 0;
  impIgv: number = 0;
  totalLin: number = 0;

  totalGeneral:number=0;
  subTotal:number=0;
  totalIGV:number=0;
  impuesto:number=18;

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

  public monedas: Moneda[];
  public moneda: Moneda;

  //NUEVO CAMBIOS
  displayedColumns: string[] = ['item', 'codigo', 'medida', 'descripcion', 'tipoAfec', 'cantidad','pu', 'descu','icbCop', 'IGV', 'total','eliminar'];
  //FIN

  constructor(public pedidoService: PedidoService,
              public clienteServices: ArccmcService,
              public arindaService: ArticuloService,
              public arfaccService: ArfaccService,
              public transaccionService: TransaccionService,
              public arcgtcService: ArcgtcService,
              public arfatpService: ArfatpService,
              public tapfopaService: TapfopaService,
              private snackBar: MatSnackBar
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
   // this.noOrden();
   // this.articulosFiltrados = this.myControlArticulo.valueChanges.pipe(map(val => this.filtrarArticulos(val)));
    this.listaPrecio();
    this.transaccionXCia();
    this.serieCorrelativoPedido();
    this.buscarTipoCambioClaseAndFecha();
    this.listarFormaPago();

    this.groupEmpresa = new FormGroup({
      ruc: new FormControl(),
      racSoc: new FormControl()
    });
    this.groupArticulo = new FormGroup({
      codProd: new FormControl(),
      desProd: new FormControl(),
      cantProd: new FormControl()
    });

    this.groupEmpresa.get("ruc").valueChanges.subscribe(valueChange => {
      if(valueChange.length > 3)
      this.factuOptions = this.clienteServices.listaClientesRucLike('01',valueChange);
      else
      this.factuOptions = null;
    });

  }
  //NUEVO CAMBIOS
  setFormData($event: MatAutocompleteSelectedEvent) {
    let factuOptions = $event.option.value;
    if(factuOptions){
      this.groupEmpresa.controls['ruc'].setValue(factuOptions.ruc, {emitEvent: false});
      this.groupEmpresa.controls['racSoc'].setValue(factuOptions.nombre, {emitEvent: false});
    }
  }


  //FIN
  filtrarArticulos(val: any) {
    if (val != null) {
      let filtro: string = String(val);
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

    })
  }

  calcularImporte() {
    this.precioCant = this.precio * this.cantAsignada
    this.impIgv = (this.precio * this.cantAsignada) * 0.18;
    this.totalLin = (this.precio * this.cantAsignada) + this.impIgv;
  }

  noOrden() {
    this.pedidoService.noOrdern(sessionStorage.getItem('cia'), sessionStorage.getItem('centro')).subscribe(data => {
      this.orden = data;
    })
  }
  traeCliente() {
    let datos = new DatosClienteDTO(sessionStorage.getItem('cia'));
    datos.documento = this.codCliente.trim();
    this.clienteServices.traeCliente(datos).subscribe(data => {
      if (data.direccion != null) {
        this.direccion = data.direccion;
      } else {
        this.form.controls['direccion'].enable();
      }
      this.nomCli = data.nombre;
      if (data.email != null) {
        this.email = data.email;
      } else {
        this.form.controls['email'].enable();
      }
      this.form.controls['articulo'].enable();
      this.form.controls['cantAsignada'].enable();
    }, err => {
      if (err.status == 404) {
        Swal.close();
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          title: 'Cliente no Existe o se Encuentra inactivo!!'
        });
      }
    })
  }
  estadoBotonCliente() {
    return (this.codCliente === '');
  }
  agregar() {
    if (this.articuloSeleccionado) {
      let cont = 0;
      for (let i = 0; i < this.detallePedido.length; i++) {
        let detalle = this.detallePedido[i];
        if (detalle.idArpfol.noArti === this.articuloSeleccionado.idArti.noArti) {
          cont++;
          break;
        }
      }
      if (cont > 0) {
        Swal.close();
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          title: 'Articulo duplicado'
        });
      } else {
        let idDetalle = new IdArpfol();
        idDetalle.cia = sessionStorage.getItem('cia');
        idDetalle.noOrden = this.orden;

        idDetalle.noArti = this.articuloSeleccionado.idArti.noArti;
        let detalle = new Arpfol();
        detalle.idArpfol = idDetalle;
        detalle.descripcion = this.articuloSeleccionado.descripcion;
        if (this.cantAsignada > 0) {
          detalle.tipoArti='B';
          detalle.cantAsignada = this.cantAsignada;
          detalle.precio = this.precio;
          detalle.impIgv = this.impIgv;
          detalle.totalLin = this.totalLin;
          detalle.fechaRegistro = moment(this.fechaSeleccionada).format('YYYY-MM-DDTHH:mm:ss');
          detalle.operExoneradas = 0;
          detalle.operGratuitas = 0;
          detalle.operGravadas = this.precioCant;
          detalle.operInafectas = 0;
          detalle.tipoAfectacion = '10';
          this.detallePedido.push(detalle);
          this.getTotal();
          this.myControlArticulo.reset();
          this.tipoBS = '';
          this.tipoAfectacion = '';
          this.cantAsignada = 0;
          this.precio = 0;
          this.pDSCTO3 = 0;
          this.impIgv = 0;
          this.totalLin = 0;
        } else {
          Swal.close();
          Swal.fire({
            allowOutsideClick: false,
            icon: 'info',
            title: 'Agregar cantidad'
          });
        }
      }
    } else {
      Swal.close();
      Swal.fire({
        allowOutsideClick: false,
        icon: 'info',
        title: 'Debe agregar Articulo'
      });
    }

  }
  removerDetalle(index: number) {
    this.detallePedido.splice(index, 1);
    this.getTotal();
  }
  getTotal() {
    this.totalGeneral =  this.detallePedido.map(t => t.totalLin).reduce((acc, value) => acc + value, 0);
    this.subTotal = this.detallePedido.map(t => t.operGravadas).reduce((acc, value) => acc + value, 0);
    this.totalIGV = this.detallePedido.map(t => t.impIgv).reduce((acc, value) => acc + value, 0);
  }
  operar() {

    let idPedido = new IdArpfoe;
    idPedido.cia = sessionStorage.getItem('cia');
    idPedido.noOrden = this.orden;
    let pedido = new Arpfoe;
    pedido.idArpfoe = idPedido;
    pedido.grupo = '00';
    pedido.noCliente = this.codCliente;
    pedido.noVendedor = sessionStorage.getItem('cod');
    pedido.codTPed = '1315';
    pedido.codFPago ='01';
    pedido.fRecepcion = moment(this.fechaSeleccionada).format('YYYY-MM-DDTHH:mm:ss');
    pedido.fechaRegistro = moment(this.fechaSeleccionada).format('YYYY-MM-DDTHH:mm:ss');
    pedido.fAprobacion = moment(this.fechaSeleccionada).format('YYYY-MM-DDTHH:mm:ss');
    pedido.fechaEntrega = moment(this.fechaSeleccionada).format('YYYY-MM-DDTHH:mm:ss');
    pedido.fechaEntregaReal =moment(this.fechaSeleccionada).format('YYYY-MM-DDTHH:mm:ss');
    pedido.fechaVence =moment(this.fechaSeleccionada).format('YYYY-MM-DDTHH:mm:ss');
    pedido.tipoPrecio = 'F8';
    pedido.moneda = 'SOL';
    pedido.tipoCambio = '3.50';
    pedido.subTotal =this.subTotal;
    pedido.tImpuesto = this.totalIGV;
    pedido.tPrecio = this.totalGeneral;
    pedido.impuesto = this.impuesto;
    pedido.estado= 'R';
    pedido.bodega = '1A001';
    pedido.igv = this.impuesto;
    pedido.direccionComercial = this.direccion;
    pedido.motivoTraslado = '1';
    pedido.nombreCliente = this.nomCli;
    pedido.codClasPed ='V';
    pedido.tipoPago = '20';
    pedido.tValorVenta = this.subTotal;
    pedido.almaOrigen = '1A001';
    pedido.almaDestino = '1XLIE';
    pedido.noClienteSalida = this.codCliente;
    pedido.totalBruto= this.subTotal;
    pedido.codTPed1='1352';
    pedido.codTPedb='1353';
    pedido.codTPedn='1214';
    pedido.centro=sessionStorage.getItem('centro');
    pedido.codCaja ='C12';
    pedido.cajera = '000002';
    pedido.centroCosto='3201';

    pedido.operExoneradas = 0;
    pedido.operGratuitas = 0;
    pedido.operGravadas=this.subTotal;
    pedido.operInafectas = 0;
    pedido.tipoOperacion = '0101';
    pedido.emailPedido = this.email;

    let ped = new PedidoDTO();
    ped.pedido = pedido;
    ped.detallePedido = this.detallePedido;

    this.pedidoService.registraPedido(ped).pipe(switchMap(()=>{
      let correl = new CorrelDTO();
      correl.cia = ped.pedido.idArpfoe.cia;
      correl.orden = ped.pedido.idArpfoe.noOrden;
      correl.centro = ped.pedido.centro;
      return null;
      //return this.pedidoService.actualizaCorrel(correl);
    })).subscribe(()=>{
      Swal.close();
      Swal.fire({
        allowOutsideClick: false,
        icon: 'info',
        title: `Pedido N° ${this.orden}`
      });
      setTimeout(() => {
        this.limpiarControles();
      }, 2000)
    })
  }
  limpiarControles() {
    this.detallePedido = [];
    this.articulos = [];

    this.orden='';
    this.codCliente='';
    this.nomCli='';
    this.direccion='';
    this.email='';
  //DETALLE PEDIDO MUESTRA
  /*=====================================================*/
    this.tipoBS='';
    this.tipoAfectacion='';
    this.cantAsignada= 0;
    this.precioCant = 0;
    this.precio = 0;
    this.pDSCTO3 = 0;
    this.impIgv = 0;
    this.totalLin= 0;

    this.totalGeneral=0;
    this.subTotal=0;
    this.totalIGV=0;
    this.impuesto=18;


    this.articuloSeleccionado = null;
    //this.pacientesFiltrados = EMPTY;
    //this.medicosFiltrados = EMPTY;
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
      this.arfaccs = json.resultado;
      if (this.arfaccs.length === 1) {
        this.arfacc = this.arfaccs[0];
      }else{
        this.snackBar.open('Debe elegir un Nro de Pedido para el centro: ' + this.centro,'Salir',
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
            console.log(this.transaccion);
            break;
          }
      }
  }

  // METODO QUE TRAE EL TIPO DE CAMBIO DE FECHA ACTUAL
  public buscarTipoCambioClaseAndFecha(): void{
    let date = new Date();
    let day = `${(date.getDate())}`.padStart(2,'0');
    let month = `${(date.getMonth()+1)}`.padStart(2,'0');
    let year = date.getFullYear();

    this.arcgtcService.getTipoCambioClaseAndFecha('02',`${day}/${month}/${year}`).subscribe(json => {
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

  //METODO QUE NOS PERMITE TRAER LA LISTA DE PRECIO DE PUNTO DE VENTA
  public listaPrecio(): void{
    this.arfatpService.getAllListaPrecio(this.cia,'S').subscribe(json => {
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
          break;
        }
    }
  }

  //BUSCAR FORMA DE PAGO
  public buscarFormaPago(cod: string): void{
    for (const t of this.tapfopas) {
      if (t.tapfopaPK.codFpago === cod) {
        this.tapfopa = t;
        break;
      }
  }
  }

  //VAMOS A LISTAR LAS FORMAS DE PAGO
  public listarFormaPago(): void{
     this.tapfopaService.listarFormaPagoCiaAndEstado(this.cia,'A').subscribe(json => {
        this.tapfopas = json.resultado;
        this.buscarFormaPago('01');
     })
  }

  public listaMonedas(): void{

  }

}
