// new factura .ts component
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { DatosClienteDTO } from 'src/app/DTO/DatosClienteDTO';
import { Infor } from 'src/app/interfaces/infor';
import { Arfacc } from 'src/app/models/arfacc';
import { ArfaccPK } from 'src/app/models/arfaccPK';
import { Arfafe } from 'src/app/models/Arfafe';
import { ArfafePK } from 'src/app/models/ArfafePK';
import { Arfafl } from 'src/app/models/arfafl';
import { arfaflPK } from 'src/app/models/arfaflPK';
import { Arfatp } from 'src/app/models/Arfatp';
import { Arpfoe } from 'src/app/models/Arpfoe';
import { IdArpfoe } from 'src/app/models/IdArpfoe';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { ArccmcService } from 'src/app/services/arccmc.service';
import { ArcgtcService } from 'src/app/services/arcgtc.service';
import { ArfaccService } from 'src/app/services/arfacc.service';
import { ArfafeService } from 'src/app/services/arfafe.service';
import { ArfatpService } from 'src/app/services/arfatp.service';
import { ArticuloService } from 'src/app/services/articulo.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { Utils } from "../utils";
import { ArfacfService } from 'src/app/services/arfacf.service';
import { ArfafpService } from 'src/app/services/arfafp.service';
import { Arfafp } from 'src/app/models/Arfafp';
import { Arfacfpk } from 'src/app/models/Arfacfpk';
import { ArpffeService } from 'src/app/services/arpffe.service';
import { Arpffe } from 'src/app/models/arpffe';
import { MatSnackBar } from '@angular/material/snack-bar';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-arfafe-new',
  templateUrl: './arfafe-new.component.html',
  styleUrls: []
})
export class NewArfafeComponent implements OnInit {

    detalle:Arfafe = new Arfafe();
    arfacc:Arfacc = new Arfacc();
    arfafp: Arfafp = new Arfafp();
    arfatp: Arfatp = new Arfatp();
    arpffe: Arpffe = new Arpffe();
    cia: string;
    doc: string;
    fact: string;
    selecc: string;
    arfaccList: Arfacc[] = [];
    logoDataUrl: string;
    nomCentro: string;
    uniMed: string[] = ['Med'];
  totalFactu:number = 0;
  totalIGV:number = 0;
  correlativo = '0000000';

  noCia: string;
  noGuia: string;
  noOrden: string;
  tipoDoc: string;
  tipoCambio: number;


  constructor(public pedidoService: PedidoService,
    private route: ActivatedRoute,
    public clienteServices: ArccmcService,
    public arindaService: ArticuloService,
    private arfafeService: ArfafeService,
    private arfaccService: ArfaccService,
    private arcgtcService: ArcgtcService,
    private arfafpservice: ArfafpService,
    private arfatpService: ArfatpService,
    private arfacfservice: ArfacfService,
    public arpffeService: ArpffeService,
    public datepipe: DatePipe,
    private router: Router,
    private sb: MatSnackBar) { }


  ngOnInit(): void {
    Utils.getImageDataUrlFromLocalPath1('assets/Logo'+sessionStorage.getItem('cia')+'.jpg').then(
        result => this.logoDataUrl = result
    )
    this.arfacc.arfaccPK = new ArfaccPK();
    this.detalle.arfafePK = new ArfafePK();
    this.centroEmisor();
    this.traerData();
  }

  traerData(){
      this.route.queryParams.subscribe(p => {
        this.noCia = p['noCia'];
        this.noOrden = p['noOrden'];
        this.noGuia = p['guia'];
        this.pedidoService.pedidoParaFactura1(this.noCia, this.noOrden).
          subscribe(d => {
              this.setArfafe(d);
              this.traerGuia(d.bodega);
            });
      });
  }

  traerGuia(bodega: string){
    this.arpffeService.consultarGuia(this.noCia,bodega,this.noGuia)
    .subscribe( data => {
        this.arpffe = data;
        console.log(this.arpffe);
    })
  }

  updateGuia(){
    this.arpffe.estado = 'F';
    this.arpffe.tipoDoc = this.detalle.arfafePK.tipoDoc;
    this.arpffe.noFactu = this.detalle.arfafePK.noFactu;

    console.log(this.arpffe);
    this.arpffeService.guardar(this.arpffe).subscribe(data =>
        console.log(data), error => console.log(error)
    );
  }

  addArfafe(){
    // console.log(this.selecc);
    if(this.selecc === undefined) {
        // console.log('Seleccionar serie');
        const snackBar = this.sb.open('Debe seleccionar una serie','Cerrar',{ duration : 3000});
        snackBar.onAction().subscribe(() => this.sb.dismiss());
    }
    else {

        // console.log('imprimio factura');
        // this.detalle.fecha = new Date();
        // console.log(this.detalle);
        this.detalle.fecha = new Date();

        this.arfafeService.addArfafe(this.detalle)
        .subscribe(data => console.log(data), error => console.log(error));

        this.updateGuia();

        this.arfaccService.saveArfacc(this.arfacc)
        .subscribe(data => console.log(data), error => console.log(error));

        setTimeout(() => {this.ProperDesing();
        this.router.navigate(['pedido/arfafe/list'])},1000
        );
        }
    }

    public cambioSerie(selecc){
        // console.log('entro select');
        for (const l of this.arfaccList) {
            if (l.arfaccPK.serie === selecc) {
                this.arfacc = l;
                let cortar = this.arfacc.consDesde.toString().length  * -1;
                this.correlativo = this.correlativo.slice(0,cortar)+this.arfacc.consDesde;
                this.detalle.arfafePK.noFactu = this.arfacc.arfaccPK.serie+this.correlativo;
                this.detalle.arfaflList.forEach(
                    list => {
                        list.arfaflPK.noFactu = this.detalle.arfafePK.noFactu;
                    }
                );
                break;
            }
        }
    }

    setArfafe(arfoe: Arpfoe){
      //trae correlativo
      this.totalFactu = 0;
      this.totalIGV = 0;
      if (arfoe.indBoleta1 == 'S') this.tipoDoc = 'B';
      else this.tipoDoc = 'F';

      let corre: Arfacc = new Arfacc();
      corre.arfaccPK = new ArfaccPK();
      corre.arfaccPK.noCia = sessionStorage.getItem('cia');
      corre.arfaccPK.centro = sessionStorage.getItem('centro');
      corre.arfaccPK.tipoDoc = this.tipoDoc;
      corre.activo = 'S';

      this.arfaccService.getSerieAndCorrelativoPedido(corre).subscribe(d => {
        // this.arfaccList = d;
        if(d.length > 0){
            for(const l of d){
                if(l.arfaccPK.serie.slice(0,1) === this.tipoDoc){
                    this.arfaccList.push(l);
                }
            }
        } else{
            this.arfacc = d[0];
            //this.selecc = this.arfacc.arfaccPK.serie;
            let cortar = this.arfacc.consDesde.toString().length  * -1;
                this.correlativo = this.correlativo.slice(0,cortar)+this.arfacc.consDesde;
                this.detalle.arfafePK.noFactu = this.arfacc.arfaccPK.serie+this.correlativo;
                this.detalle.arfaflList.forEach(
                    list => {
                        list.arfaflPK.noFactu = this.detalle.arfafePK.noFactu;
                    }
                );
        }
        //this.arfacc = d[0];
        //this.arfacc.consDesde;
        //console.log(d);
        //creacion llave primaria
        this.detalle.arfafePK = new ArfafePK();

        this.detalle.arfafePK.noCia = sessionStorage.getItem('cia');
        //creacion correlativo
        /*let cortar = d[0].consDesde.toString().length  * -1;
        this.correlativo = this.correlativo.slice(0,cortar)+d[0].consDesde;
        this.detalle.arfafePK.noFactu = d[0].arfaccPK.serie+this.correlativo;*/

        this.detalle.arfafePK.tipoDoc = this.tipoDoc;

        //insercion data adicional
        this.detalle.estado = 'D';
        this.detalle.ind_PVENT = arfoe.indPvent;
        this.detalle.no_ORDEN = arfoe.arpfoePK.noOrden;
        //this.detalle.tipo_CLIENTE = arfoe.tipoDocCli;
        this.detalle.no_CLIENTE = arfoe.noCliente;
        this.traeCliente();
        this.detalle.no_VENDEDOR = arfoe.noVendedor;
        this.detalle.moneda = arfoe.moneda;
        this.detalle.tipo_FPAGO = arfoe.tipoFpago;
        this.detalle.cod_FPAGO = arfoe.codFpago;
        this.detalle.igv = arfoe.igv;
        this.detalle.tipo_PRECIO = arfoe.tipoPrecio;
        this.detalle.cod_CLAS_PED = arfoe.codClasPed;
        this.detalle.m_DSCTO_GLOBAL = arfoe.tDsctoGlobal;
        this.detalle.tipo_DOC_CLI = arfoe.tipoDocCli;
        this.detalle.num_DOC_CLI = arfoe.noCliente;
        this.detalle.ruc = arfoe.noCliente;
        this.detalle.cod_T_PED = '1315';
        this.detalle.alm_DESTINO = arfoe.almaDestino;
        this.detalle.bodega = arfoe.bodega;
        this.detalle.centro = arfoe.centro;
        this.detalle.centro_COSTO = arfoe.centroCosto;
        this.detalle.cod_CAJA = arfoe.codCaja;
        this.detalle.cuser = sessionStorage.getItem('usuario');
        this.detalle.tipo_CAMBIO = arfoe.tipoCambio;
        this.detalle.ind_DOC = 'N';
        this.detalle.imprime = 'S';
        this.detalle.ind_VTA_ANTICIPADA = 'N';
        this.detalle.total_BRUTO = 0;
        this.detalle.oper_GRAVADAS = 0;
        this.detalle.sub_TOTAL = 0;
        this.detalle.impuesto = 0;
        this.detalle.ind_NOTA_CRED = 'N';
        this.detalle.ind_EXPORTACION = 'N';
        this.detalle.ind_FERIAS = 'N';
        this.detalle.ind_PROVINCIA = 'N';
        this.detalle.usu_CREA = sessionStorage.getItem('usuario');
        this.detalle.consumo = 'N';
        this.detalle.redondeo = 0;
        this.detalle.convenio = 'N';
        this.detalle.ind_FACT_TEXTO = 'N';
        this.detalle.excl_AUX = 'N';
        this.detalle.impuesto_FLETE = 0;
        this.detalle.on_LINE = 'N';
        this.detalle.cont_NETO = 'N';
        this.detalle.ind_FMULTIPLE = 'N';
        this.detalle.ind_NC_FICTA = 'N';
        this.detalle.ind_PROMARG = 'N';
        this.detalle.oper_EXONERADAS = 0;
        this.detalle.oper_GRATUITAS = 0;
        this.detalle.oper_INAFECTAS = 0;
        this.detalle.mot_CONTING = '0';
        this.detalle.tipo_OPERACION = '0101';
        this.detalle.est_RES_CON = 'N';
        this.detalle.imp_FACT_DESC = 'N';
        this.detalle.ind_GUIA_TEXTO = 'N';
        this.detalle.no_GUIA = this.noGuia;
        this.detalle.tipo = 'N';
        this.detalle.estado_SUNAT = '0';
        this.listaPrecio(arfoe.tipoPrecio);
        // this.TCambio();
        this.formaPago(arfoe.codFpago);
        //detalle productos
        this.detalle.arfaflList = [];
        this.detalle.oper_GRAVADAS = 0;
        arfoe.arpfolList.forEach(
          list => {
            let arfafl: Arfafl = new Arfafl();
            arfafl.arfaflPK = new arfaflPK();
            arfafl.arfaflPK.noCia = this.detalle.arfafePK.noCia;
            arfafl.arfaflPK.tipoDoc = this.detalle.arfafePK.tipoDoc;
            //arfafl.arfaflPK.noFactu = this.detalle.arfafePK.noFactu;
            arfafl.arfaflPK.consecutivo = list.noLinea;
            arfafl.no_ARTI = list.arpfolPK.noArti;
            arfafl.bodega = list.bodega;
            arfafl.cantidad_FACT = list.cantEntreg;
            arfafl.cantidad_ENTR = list.cantEntreg;
            arfafl.descripcion = list.descripcion;
            arfafl.p_DSCTO3 = 0;
            arfafl.tipo_BS = list.tipoBs;
            arfafl.imp_IGV = parseFloat(this.trunc(list.impIgv,2));
            arfafl.igv = list.igv;
            this.uniMed.push(list.medida);
            arfafl.total = parseFloat(this.trunc(list.totalLin,2));
            arfafl.precio_UNIT = parseFloat(this.trunc(list.precio,5));
            arfafl.tipo_AFECTACION = list.tipoAfectacion;
            arfafl.tipo_ARTI = list.tipoArti;
            arfafl.total_LIN = list.totalLin;
            this.detalle.oper_GRAVADAS += (arfafl.cantidad_FACT*parseFloat(this.trunc(arfafl.precio_UNIT,2)));
            this.detalle.sub_TOTAL += (arfafl.cantidad_FACT*parseFloat(this.trunc(arfafl.precio_UNIT,2)));
            this.totalFactu += list.totalLin;
            this.totalIGV += arfafl.imp_IGV;
            this.detalle.impuesto += arfafl.imp_IGV;
            this.detalle.arfaflList.push(arfafl);
          }
        );
        this.totalFactu = parseFloat(this.trunc(this.totalFactu,3));
        this.detalle.total = this.totalFactu;
        this.detalle.total_BRUTO = this.totalFactu;
        this.detalle.cajera = sessionStorage.getItem('codEmp');
        this.detalle.valor_VENTA = this.detalle.sub_TOTAL;
        this.detalle.m_DSCTO_GLOBAL = 0;
        this.detalle.descuento = 0;
        // this.detalle.total_b
        console.log(this.detalle);
      });

    }

    trunc (x, de = 0) {
        return Number(Math.round(parseFloat(x + 'e' + de)) + 'e-' + de).toFixed(de);
      }

    traeCliente() {
      let cli = new DatosClienteDTO(sessionStorage.getItem('cia'));
      // cli.documento = this.detalle.no_CLIENTE;
      cli.id = this.detalle.no_CLIENTE;
      console.log(cli);
      this.clienteServices.traeCliente(cli).subscribe(data => {
        this.detalle.direccion = data.arcctdaEntity[0].direccion;
        this.detalle.codi_DEPA = data.arcctdaEntity[0].codiDepa;
        this.detalle.codi_PROV = data.arcctdaEntity[0].codiProv;
        this.detalle.codi_DIST = data.arcctdaEntity[0].codiDist;
        this.detalle.nbr_CLIENTE = data.nombre;
        console.log(data);
      })
    }

    public formaPago(cod: string){
        let list: Arfafp[] = [];
        this.arfafpservice.listarFPFactu(sessionStorage.getItem('cia'),'A').subscribe(data => {
            list = data.resultado;
            console.log(data);
            for (const l of list) {
              if (l.arfafpPK.codFpago === cod) {
                this.arfafp = l;
                break;
              }
            }
        })
      }

   public TCambio(){
    let fecha = this.datepipe.transform(new Date,'dd/MM/yyyy');
    this.arcgtcService.getTipoCambioClaseAndFecha('02',fecha).subscribe(data => {
         this.tipoCambio = data.resultado.tipoCambio;
    });

  }

  public listaPrecio(cod: string){
    let list: Arfatp[] = [];
    this.arfatpService.getAllListaPrecio(sessionStorage.getItem('cia'),'S').subscribe(json => {
      list = json.resultado;
      for (const l of list) {
        if (l.idArfa.tipo === cod) {
            this.arfatp = l;
            break;
        }
    }
    });
  }

  public centroEmisor(){
    //this.arfacfservice.buscarCentro(sessionStorage.getItem('cia'),sessionStorage.getItem('centro'))
    let arfacfPk: Arfacfpk = new Arfacfpk();
    arfacfPk.noCia = sessionStorage.getItem('cia');
    arfacfPk.centro = sessionStorage.getItem('centro');
    this.arfacfservice.getArfacf(arfacfPk)
    .subscribe(data => {
        this.nomCentro = data.descripcion;
    })
  }

  ProperDesing() {
    var body = [];
    body.push([
        {text: 'Código', bold: true, fontSize: 8, alignment: 'center',fillColor: '#008CD9',color:'#FFF'},
        {text: 'Descripción', bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'},
        {text: 'UM', bold: true, fontSize: 8, alignment: 'center',fillColor: '#008CD9',color:'#FFF'},
        {text: 'Cantidad', bold: true, fontSize: 8, alignment: 'center',fillColor: '#008CD9',color:'#FFF'},
        {text: 'Valor Unitario', bold: true, fontSize: 8, alignment: 'center',fillColor: '#008CD9',color:'#FFF'},
        {text: '% Desc', bold: true, fontSize: 8, alignment: 'center',fillColor: '#008CD9',color:'#FFF'},
        {text: 'ICBPER', bold: true, fontSize: 8, alignment: 'center',fillColor: '#008CD9',color:'#FFF'},
        {text: 'IGV', bold: true, fontSize: 8, alignment: 'center',fillColor: '#008CD9',color:'#FFF'},
        {text: 'Valor Total', bold: true, fontSize: 8, alignment: 'center',fillColor: '#008CD9',color:'#FFF'}]);
    this.detalle.arfaflList.forEach(l => {
        body.push(
            [{text: l.no_ARTI, bold: false, fontSize: 8},
            {text: l.descripcion, bold: false, fontSize: 8},
            {text: this.uniMed[l.arfaflPK.consecutivo], bold: false, fontSize: 8},
            {text: l.cantidad_ENTR, bold: false, fontSize: 8, alignment: 'right'},
            {text: l.precio_UNIT, bold: false, fontSize: 8, alignment: 'right'},
            {text: l.p_DSCTO3, bold: false, fontSize: 8, alignment: 'right'},
            {text: 0.00, bold: false, fontSize: 8, alignment: 'right'},
            {text: l.imp_IGV.toFixed(2), bold: false, fontSize: 8, alignment: 'right'},
            {text: l.total.toFixed(2), bold: false, fontSize: 8, alignment: 'right'}
            ]
        );
      });
    var bodyDet = [];
    bodyDet.push([
        {text: 'Descuento Global', bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'},
        {
            columns: [
                {text: 'S/ ', alignment: 'left'},
                {text: this.detalle.descuento, alignment: 'right'}
            ],
            bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF',
            margin: [0,0,5,0]
        }
        // {text: [
        //     {text: 'S/ ', alignment: 'left'},
        //     {text: this.detalle.descuento, alignment: 'right'}],
        //      bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'}
    ]);
    bodyDet.push([
        {text: 'Total Valor Venta - Operaciones Gravadas:', bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'},
        // {text: 'S/ '+this.detalle.oper_GRAVADAS, bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'}
        {
            columns: [
                {text: 'S/ ', alignment: 'left'},
                {text: this.detalle.oper_GRAVADAS, alignment: 'right'}
            ],
            bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF',
            margin: [0,0,5,0]
        }
    ]);
    bodyDet.push([
        {text: 'ICBPER', bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'},
        // {text: 'S/ 0', bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'}
        {
            columns: [
                {text: 'S/ ', alignment: 'left'},
                {text: '0', alignment: 'right'}
            ],
            bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF',
            margin: [0,0,5,0]
        }
    ]);
    bodyDet.push([
        {text: 'IGV', bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'},
        // {text: 'S/ '+this.totalIGV, bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'}
        {
            columns: [
                {text: 'S/ ', alignment: 'left'},
                {text: this.totalIGV, alignment: 'right'}
            ],
            bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF',
            margin: [0,0,5,0]
        }
    ]);
    bodyDet.push([
        {text: 'Importe Total', bold: true, fontSize: 9,fillColor: '#008CD9',color:'#FFF'},
        // {text: 'S/ '+this.detalle.total, bold: true, fontSize: 9,fillColor: '#008CD9',color:'#FFF'}
        {
            columns: [
                {text: 'S/ ', alignment: 'left'},
                {text: this.detalle.total, alignment: 'right'}
            ],
            bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF',
            margin: [0,0,5,0]
        }
    ]);
    bodyDet.push([
        {text: 'Redondeo', bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'},
        // {text: 'S/ 0', bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'}
        {
            columns: [
                {text: 'S/ ', alignment: 'left'},
                {text: '0', alignment: 'right'}
            ],
            bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF',
            margin: [0,0,5,0]
        }
    ]);
    bodyDet.push([
        {text: 'Descuentos Totales', bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'},
        // {text: 'S/.'+this.detalle.descuento, bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'}
        {
            columns: [
                {text: 'S/ ', alignment: 'left'},
                {text: this.detalle.descuento, alignment: 'right'}
            ],
            bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF',
            margin: [0,0,5,0]
        }
    ]);

    const documentDefinition = {
    //   pageSize: 'A5',
    //   pageOrientation: 'landscape',
    pageMargins: [40, 20, 40, 220],
      footer: {
        columns: [
            [
            {
                columns: [
                    [
                         {qr: 'pagina de FE qr. k', fit: '60' },
                         {text: 'Representación Impresa de la Factura electrónica',
                        fontSize: 8}
                    ],
                    [
                        {
                            margin: [ 0, 5, 0, 0],
                            layout: 'noBorders',
                            table: {
                              headerRows: 0,
                              widths: ['70%', '30%'],

                              body: bodyDet
                            }
                          }
                    ]
                ],
                margin: [10,20,10,15]
            },
            {
                layout: {
                    hLineWidth: function(i, node) {
                     return (i === 0 || i === node.table.body.length) ? 0.5 : 0.5;
                    },
                    vLineWidth: function(i, node) {
                     return (i === 0 || i === node.table.widths.length) ? 0.5 : 0.5;
                    },
                    hLineColor: function (i, node) {
                        return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
                    },
                    vLineColor: function(i, node) {
                        return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
                    }
                },
                width: 515,
                table: {
                  headerRows: 1,
                  widths: ['100%'],
                  body: [
                      [{text: 'Sus pagos depositar al banco Credito',
                      fillColor: '#008CD9',color:'#FFF',bold: true,fontSize: 10}],
                      [
                        {
                            columns: [
                                [{
                                    text: [
                                        {
                                            text: 'Cuenta en Soles   : ',
                                            // bold: true,
                                            fontSize: 10
                                        },
                                        {   text: '191-2039372-0-16',
                                        // bold: true,
                                        fontSize: 10
                                        }
                                    ]
                                },
                                {
                                    text: [
                                        {
                                            text: 'Cuenta en Dolares  : ',
                                            // bold: true,
                                            fontSize: 10
                                        },
                                        {   text: '191-1985270-1-41',
                                        // bold: true,
                                        fontSize: 10
                                        }
                                    ]
                                }]
                            ]
                        }
                      ]
                ]
                }
            }
            ]
        ],
        margin: [40,0]
    },

      content: [
        //   {qr: 'text'},
        {
            columns: [
                {
                    width: 50,
                    height: 70,
                    image: this.logoDataUrl
                },
                [
                    {
                        width: 350,
                        noWrap: false,
                        maxHeight: 70,
                        text: [
                            {
                                text: 'Pag.Web : ',
                                bold:true
                            },
                            {
                                text: 'WWW.CDSI.COM.PE/RYSE',
                                fontSize: 8
                            }
                        ],
                        color: 'black',
                        fontSize: 9
                    },
                    {
                        width: 350,
                        noWrap: false,
                        maxHeight: 70,
                        text: [
                            {
                                text: 'Email: ',
                                bold:true
                            },
                            {
                                text: 'rysesperanza@hotmail.com',
                                fontSize: 8
                            }
                        ],
                        color: 'black',
                        fontSize: 9
                    },
                    {
                        width: 350,
                        noWrap: false,
                        maxHeight: 70,
                        text: [
                            {
                                text: 'Teléfonos : ',
                                bold:true
                            },
                            {
                                text: '01 7820798 / 965428693 / 937802577',
                                fontSize: 8
                            }
                        ],
                        color: 'black',
                        fontSize: 9
                    },
                    {
                        width: 250,
                        noWrap: false,
                        maxHeight: 70,
                        text: [
                            {
                                text: 'Domicilio Fiscal :',
                                bold:true
                            },
                            {
                                text: 'AV. AVIACION N° 1120 LA VICTORIA, LIMA, LIMA',
                                fontSize: 8
                            }
                        ],
                        color: 'black',
                        fontSize: 9
                    }
                ],
                {
                    // margin: [ 5, 0, 0, 0],
                    layout: {
                        hLineWidth: function(i, node) {
                         return (i === 0 || i === node.table.body.length) ? 0.5 : 0.5;
                        },
                        vLineWidth: function(i, node) {
                         return (i === 0 || i === node.table.widths.length) ? 0.5 : 0.5;
                        },
                        hLineColor: function (i, node) {
                            return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
                        },
                        vLineColor: function(i, node) {
                            return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
                        }
                    },
                    // layout: 'noBorders',
                    width: 110,
                    table: {
                      headerRows: 1,
                      widths: [100],
                      body: [
                          [{text: 'FACTURA ELECTRÓNICA',fillColor: '#008CD9',color:'#FFF',bold: true}],
                          [
                            {
                                text: 'RUC: '+'20213092571'+' '+this.detalle.arfafePK.noFactu,
                                bold: true,
                                fontSize: 10
                            }
                          ]
                    ]
                    },
                    style: 'anotherStyle'
                }
            ],
            margin: [ 0, 0, 0, 6],
            columnGap: 15
        },
        {
            stack: [
                {
                    canvas: [
                        {
                            type: 'rect',
                            x: 0,
                            y: 0,
                            w: 515,
                            h: 56,
                            lineWidth: 0.05,
                            lineColor: 'grey'
                        }
                    ]
                },
                {
                    columns: [
                        [
                            {
                                columns: [
                                    {
                                        width: 350,
                                        noWrap: false,
                                        maxHeight: 70,
                                        text: [
                                            {
                                                text: 'Cliente            : ',
                                                bold:true
                                            },
                                            {
                                                text: this.detalle.nbr_CLIENTE,
                                                fontSize: 8
                                            }
                                        ],
                                        color: 'black',
                                        fontSize: 9
                                    },
                                    {
                                        width: 165,
                                        noWrap: false,
                                        maxHeight: 70,
                                        text: [
                                            {
                                                text: 'RUC  :',
                                                bold:true
                                            },
                                            {
                                                text: this.detalle.no_CLIENTE,
                                                fontSize: 8
                                            }
                                        ],
                                        color: 'black',
                                        fontSize: 9
                                    }
                                ]
                            },
                            {
                                width: 515,
                                noWrap: false,
                                maxHeight: 70,
                                text: [
                                    {
                                        text: 'Dirección       : ',
                                        bold:true
                                    },
                                    {
                                        text: this.detalle.direccion,
                                        fontSize: 8
                                    }
                                ],
                                color: 'black',
                                fontSize: 9
                            },
                            {
                                columns: [
                                    {
                                        width: 515/2,
                                        noWrap: false,
                                        maxHeight: 70,
                                        text: [
                                            {
                                                text: 'F. Emisión      : ',
                                                bold:true
                                            },
                                            {
                                                text: this.datepipe.transform(this.detalle.fecha,'dd/MM/yyyy'),
                                                fontSize: 8
                                            }
                                        ],
                                        color: 'black',
                                        fontSize: 9
                                    },
                                    {
                                        width: 515/2,
                                        noWrap: false,
                                        maxHeight: 70,
                                        text: [
                                            {
                                                text: 'Condición Pago : ',
                                                bold:true
                                            },
                                            {
                                                text: this.arfafp.descripcion,
                                                fontSize: 8
                                            }
                                        ],
                                        color: 'black',
                                        fontSize: 9
                                    }
                                ]
                            },
                            {
                                columns: [
                                    {
                                        width: 160,
                                        noWrap: false,
                                        maxHeight: 70,
                                        text: [
                                            {
                                                text: 'Orden Compra : ',
                                                bold:true
                                            },
                                            {
                                                text: this.detalle.no_SOLIC,
                                                fontSize: 8
                                            }
                                        ],
                                        color: 'black',
                                        fontSize: 9
                                    },
                                    {
                                        width: '*',
                                        noWrap: false,
                                        maxHeight: 70,
                                        text: [
                                            {
                                                text: 'Guía Remisión : ',
                                                bold:true
                                            },
                                            {
                                                text: this.detalle.no_GUIA,
                                                fontSize: 8
                                            }
                                        ],
                                        color: 'black',
                                        fontSize: 9
                                    },
                                    {
                                        width: '*',
                                        noWrap: false,
                                        maxHeight: 70,
                                        text: [
                                            {
                                                text: 'Moneda : ',
                                                bold:true
                                            },
                                            {
                                                text: this.detalle.moneda,
                                                fontSize: 8
                                            }
                                        ],
                                        color: 'black',
                                        fontSize: 9
                                    },
                                    {
                                        width: '*',
                                        noWrap: false,
                                        maxHeight: 70,
                                        text: [
                                            {
                                                text: 'Vendedor : ',
                                                bold:true
                                            },
                                            {
                                                text: this.detalle.cuser,
                                                fontSize: 8
                                            }
                                        ],
                                        color: 'black',
                                        fontSize: 9
                                    }
                                ]
                            }
                        ]
                    ],
                    margin : [5,6,5,0]
                    ,
                    relativePosition: {
                    x: 0,
                    y: -56
                    }
                }
            ]
        },
        // 'texto antes de tabla',
        {
          margin: [ 0, 5, 0, 0],
          layout: 'noBorders',
          table: {
            headerRows: 1,
            widths: ['7%', '41%', '5%', '8%','10%', '5%', '7%', '7%','10%'],

            body: body
          }
        }
      ],
      styles: {
        anotherStyle: {
        //   italics: true,
          alignment: 'center',
          lineWidth: 0.05
        }
      }
    };
    pdfMake.createPdf(documentDefinition).open();
  }




  }

