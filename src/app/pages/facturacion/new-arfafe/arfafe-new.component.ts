// new factura .ts component
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Infor } from 'src/app/interfaces/infor';
import { Informacion } from 'src/app/interfaces/informacion';
import { Arccmc } from 'src/app/models/Arccmc';
import { Arfacc } from 'src/app/models/arfacc';
import { ArfaccPK } from 'src/app/models/arfaccPK';
import { Arfafe } from 'src/app/models/Arfafe';
import { ArfafePK } from 'src/app/models/ArfafePK';
import { Arfafl } from 'src/app/models/arfafl';
import { arfaflPK } from 'src/app/models/arfaflPK';
import { Arpfoe } from 'src/app/models/Arpfoe';
import { IdArpfoe } from 'src/app/models/IdArpfoe';
import { ArccmcService } from 'src/app/services/arccmc.service';
import { ArfaccService } from 'src/app/services/arfacc.service';
import { ArfafeService } from 'src/app/services/arfafe.service';
import { ArticuloService } from 'src/app/services/articulo.service';
import { PedidoService } from 'src/app/services/pedido.service';

@Component({
  selector: 'app-arfafe-new',
  templateUrl: './arfafe-new.component.html',
  styleUrls: []
})
export class NewArfafeComponent implements OnInit {

    detalle:Arfafe = new Arfafe();
    cia: string;
    doc: string;
    fact: string;
    tipoArfafe: string;

  totalFactu:number = 0;

  noCia: string;
  noOrden: string;
  tipoDoc: string;


  constructor(public pedidoService: PedidoService,
    private route: ActivatedRoute,
    public clienteServices: ArccmcService,
    public arindaService: ArticuloService,
    private arfafeService: ArfafeService,
    private arfaccService: ArfaccService,
    private router: Router) { }


  ngOnInit(): void {
    this.traerData();
  }

  traerData(){
    /*this.arfafeService.arfafeDetalle(new ArfafeDTO('01','F','00010004866'))
      .subscribe(a => {
          this.detalle = a.resultado;
          console.log(a.resultado);
        }
      );*/
      let idArpfoe: IdArpfoe = new IdArpfoe();
      this.route.queryParams.subscribe(p => {
        //this.noCia = p['cia'];
        this.noOrden = p['noOrden'];
        this.tipoArfafe = p['tipoA'];
        idArpfoe.noCia = '01';
        idArpfoe.noOrden = this.noOrden;
        console.log(idArpfoe);
        this.pedidoService.pedidoParaFactura(idArpfoe).pipe(
          map((response: Infor<Arpfoe>) => response.resultado)).
          subscribe(d => {console.log(d);this.setArfafe(d)});
        
        /*.subscribe(
          d => this.setArfafe(d.resultado[0])
          
        )*/
      });
      //{"noCia":"01","noOrden":"9410003419"}
  }
  addArfafe(){
    this.detalle.arfafePK.noFactu = 'F0010002213';
    this.detalle.fecha = new Date();
    //this.detalle.ind_PVENT = 'S'
    this.detalle.arfaflList.forEach(
      value => {value.arfaflPK.noFactu = 'F0010002213';value.arfaflPK.tipoDoc = 'F'}
    );
    console.log("creo factura - "+this.detalle.arfafePK.noFactu);
    console.log(this.detalle);
    this.arfafeService.addArfafe(this.detalle)
    .subscribe(data => console.log(data), error => console.log(error));
    //console.log();
    //this.arfafeService.
    this.router.navigate(['pedido/arfafe/list']);
    }

    generarCorrelativo(){

    }

    setArfafe(arfoe: Arpfoe){
      //trae correlativo
      if (arfoe.indBoleta1 == 'S') this.tipoDoc = 'B';
      else this.tipoDoc = 'F';
      
      let corre: Arfacc = new Arfacc();
      corre.arfaccPK = new ArfaccPK();
      corre.arfaccPK.noCia = sessionStorage.getItem('cia');
      corre.arfaccPK.centro = sessionStorage.getItem('centro');
      corre.arfaccPK.tipoDoc = this.tipoDoc;
      //corre.arfaccPK.serie
      corre.activo = 'S';

      this.arfaccService.getSerieAndCorrelativoPedido(corre).subscribe(d => console.log(d));

      //creacion llave primaria
      this.detalle.arfafePK = new ArfafePK();

      this.detalle.arfafePK.noCia = '01';
      this.detalle.arfafePK.noFactu = 'F0010002212';
      this.detalle.arfafePK.tipoDoc = this.tipoArfafe;

      //insercion data adicional
      this.detalle.ind_PVENT = arfoe.indPvent;
      this.detalle.no_CLIENTE = arfoe.noCliente;
      this.detalle.no_VENDEDOR = arfoe.noVendedor;
      this.detalle.moneda = arfoe.moneda;
      this.detalle.tipo_FPAGO = arfoe.tipoFpago;
      this.detalle.cod_FPAGO = arfoe.codFpago;
      this.detalle.igv = arfoe.igv;
      this.detalle.tipo_PRECIO = arfoe.tipoPrecio;
      this.detalle.cod_CLAS_PED = arfoe.codClasPed;
      this.detalle.m_DSCTO_GLOBAL = arfoe.tDsctoGlobal;
      this.detalle.tipo_DOC_CLI = arfoe.tipoDocCli;
      this.detalle.num_DOC_CLI = arfoe.numDocCli;
      this.detalle.alm_DESTINO = arfoe.almaDestino;
      this.detalle.bodega = arfoe.bodega;
      this.detalle.centro = arfoe.centro;
      this.detalle.centro_COSTO = arfoe.centroCosto;
      this.detalle.cod_CAJA = arfoe.codCaja;
      this.detalle.cuser = arfoe.cuser;


      //detalle productos
      this.detalle.arfaflList = [];
      arfoe.arpfolList.forEach(
        list => {
          let arfafl: Arfafl = new Arfafl();
          arfafl.arfaflPK = new arfaflPK();
          arfafl.arfaflPK.noCia = '01';
          arfafl.arfaflPK.noFactu = list.arpfolPK.noOrden;
          arfafl.arfaflPK.consecutivo = list.noLinea;
          arfafl.no_ARTI = "L"+list.noLinea;
          arfafl.bodega = list.bodega;
          arfafl.cantidad_FACT = list.cantEntreg;
          arfafl.cantidad_ENTR = list.cantEntreg;
          arfafl.descripcion = list.descripcion;
          arfafl.imp_IGV = list.impIgv;
          arfafl.igv = list.igv;
          //arfafl.unidMed = list.medida;
          arfafl.total = list.totalLin;
          arfafl.precio_UNIT = list.precio;
          arfafl.tipo_AFECTACION = list.tipoAfectacion;
          arfafl.tipo_ARTI = list.tipoArti;

          this.totalFactu += list.totalLin;
          this.detalle.arfaflList.push(arfafl);
        }
      );
      this.detalle.total = this.totalFactu;
      console.log(this.detalle);
    }

  }

