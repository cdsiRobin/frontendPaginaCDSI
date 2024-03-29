import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ArfafeDTO } from "src/app/DTO/arfafeDTO";
import { DatosClienteDTO } from "src/app/DTO/DatosClienteDTO";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Arfacc } from "src/app/models/arfacc";
import { Arfafe } from "src/app/models/Arfafe";
import { Arfatp } from "src/app/models/Arfatp";
import { ArccmcService } from "src/app/services/arccmc.service";
import { ArcgtcService } from "src/app/services/arcgtc.service";
import { ArfafeService } from "src/app/services/arfafe.service";
import { ArfatpService } from "src/app/services/arfatp.service";
import { Utils } from "../utils";
import { ArfafpService } from "src/app/services/arfafp.service";
import { ArfacfService } from "src/app/services/arfacf.service";
import { Arfafp } from "src/app/models/Arfafp";
import { Arfacfpk } from "src/app/models/Arfacfpk";
import { PedidoService } from "src/app/services/pedido.service";
import { IdArpfoe } from "src/app/models/IdArpfoe";
import { Infor } from "src/app/interfaces/infor";
import { Arpfoe } from "src/app/models/Arpfoe";
import { map } from "rxjs/operators";
import { ArfafePK } from "src/app/models/ArfafePK";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ArfcreeService } from "src/app/services/arfcree.service";
import { Arfcree } from "src/app/models/Arfcree";
import { Arfcred } from "src/app/models/Arfcred";
import { ArfcredPK } from "src/app/models/ArfcredPK";
import { ArfcreePK } from "src/app/models/ArfcreePK";
import { ArfamcService } from "src/app/services/arfamc.service";
import { Arfamc } from "src/app/models/arfamc";
import { UtilsArfafe } from "../utils-arfafe/utils-arfafe";
import { ArcgmoService } from "src/app/services/arcgmo.service";
import { PdfArfafe } from "../utils-arfafe/pdf-arfafe";
import { Arccdi } from "src/app/models/arccdi";
import { Arccdp } from "src/app/models/arccdp";
import { Arccpr } from "src/app/models/arccpr";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-detail-arfafe',
  templateUrl: './detail-arfafe.component.html',
  styleUrls: ['./detail-arfafe.component.scss']
})

export class DetailArfafeComponent implements OnInit {

    tipoComprobante: string = 'Factura';
    detalle:Arfafe = new Arfafe();
    arfacc:Arfacc = new Arfacc();
    arfafp: Arfafp = new Arfafp();
    arfatp: Arfatp = new Arfatp();

    arfcree: Arfcree = new Arfcree();
    arfcred: Arfcred = new Arfcred();

    cia: string;
    doc: string;
    fact: string;
    nomCentro: string;
    centro: string = sessionStorage.getItem('centro');
    totalIGV:number = 0;
    arfamc: Arfamc = new Arfamc();

    btnFp: boolean = false;
    uniMed: string[] = ['Med'];

  constructor(private route: ActivatedRoute,
    private arfafeService: ArfafeService,
    public clienteServices: ArccmcService,
    private arfatpService: ArfatpService,
    private arfafpservice: ArfafpService,
    private arfacfservice: ArfacfService,
    public pedidoService: PedidoService,
    public arfcreeService: ArfcreeService,
    public arfamcService: ArfamcService,
    private arcgmoService: ArcgmoService,
    private arccmcService: ArccmcService,
    private sb: MatSnackBar,
    public datepipe: DatePipe) { }

  ngOnInit(): void {
    this.detalle.arfafePK = new ArfafePK();
    this.cargar();
  }

  cargar(){
    // console.log('assets/Logo'+sessionStorage.getItem('cia')+'.jpg');
    this.route.queryParams.subscribe(p => {
      this.cia = p['nocia'];
      this.doc = p['docu'];
      this.fact = p['factura'];
      if(this.doc == 'B') this.tipoComprobante = 'Boleta';
      this.arfafeService.arfafeDetalle(new ArfafeDTO(this.cia,this.doc,this.fact))
      .subscribe(a => {
        // console.log(a.resultado);
          this.detalle = a;
            let idArpfoe: IdArpfoe = new IdArpfoe();
            idArpfoe.noCia = a.arfafePK.noCia;
            idArpfoe.noOrden = a.no_ORDEN;
            // console.log(idArpfoe);
            // this.detalle.arfafePK = new ArfafePK();
            this.traeCliente();
            this.formaPago(a.cod_FPAGO);
            this.listaPrecio(a.tipo_PRECIO);
            this.cargarExtras();
            if(a.tipo_FPAGO === '40'){
              let data: ArfcreePK = new ArfcreePK();
              data.noCia = this.cia;
              data.noCliente = this.detalle.no_CLIENTE;
              data.noOrden = this.detalle.arfafePK.noFactu;
              this.arfcreeService.findArfcree(data).subscribe( obj => {
                // console.log(obj.resultado);
                this.arfcree = obj.resultado;
                this.arfcree.arfcredList.forEach( o => {
                  o.fechaPago = this.datepipe.transform(o.fechaPago,'dd/MM/yyyy');
                });
              });
            }
            // console.log(a.resultado);
            //console.log(a.resultado.arfaflList);
            this.listarDistrito(sessionStorage.getItem('cia'),this.detalle,this.arccmcService);
            this.listarProvincia(sessionStorage.getItem('cia'),this.detalle,this.arccmcService);
            this.listarDepartamento(sessionStorage.getItem('cia'),this.detalle,this.arccmcService);
          this.pedidoService.pedidoParaFactura(idArpfoe.noCia, idArpfoe.noOrden).
            subscribe(d => {
                // console.log(d);
                d.arpfolList.forEach(
                    list => {
                      this.uniMed.push(list.medida);
                    }
                  );
                //this.traerGuia(d.bodega);
              });

        }
      )
    });
    this.centroEmisor();
  }

  ponerUniMed(arpfoe: Arpfoe){
    arpfoe.arpfolList.forEach(
        list => {
          this.uniMed.push(list.medida);
        }
      );
  }

  traeCliente() {
    let cli = new DatosClienteDTO(sessionStorage.getItem('cia'));
    // cli.documento = this.detalle.no_CLIENTE;
    cli.id = this.detalle.no_CLIENTE;
    // console.log(cli);
    this.clienteServices.traeCliente(cli).subscribe(data => {
      this.detalle.direccion = data.arcctdaEntity[0].direccion;
      this.detalle.codi_DEPA = data.arcctdaEntity[0].codiDepa;
      this.detalle.codi_PROV = data.arcctdaEntity[0].codiProv;
      this.detalle.codi_DIST = data.arcctdaEntity[0].codiDist;
      this.detalle.nbr_CLIENTE = data.nombre;
    //   console.log(data);
    })
  }

  toogleDivCuotas(){
        
     if(this.arfafp.arfafpPK.tipoFpago === '20'){
            const snackBar = this.sb.open('Forma de pago no necesita cuotas','Entendido',{ duration : 3000});
            snackBar.onAction().subscribe(() => this.sb.dismiss());
        } 
        else if(this.detalle.arfafePK.tipoDoc === 'B'){
            const snackBar = this.sb.open('Pago con Boleta no permite Cuotas','Entendido',{ duration : 3000});
            snackBar.onAction().subscribe(() => this.sb.dismiss());
        } 
        else {
            // this.getCuotas();
            this.btnFp = !this.btnFp;
        }
}

  getCuotas(){
    let a: number = -1;
    let b: Arfafp = new Arfafp();
    let tempd: ArfcreePK = new ArfcreePK();
    let e: Date = new Date();
    let g: Arfcred[] = [];
    tempd.noCia = this.detalle.arfafePK.noCia;
    tempd.noOrden = this.detalle.arfafePK.noFactu;
    tempd.noCliente = this.detalle.no_CLIENTE;
    b = this.arfafp;
    let c: number[] = [b.plazo,b.plazo2,b.plazo3,b.plazo4,b.plazo5,b.plazo6,b.plazo7,b.plazo8,
    b.plazo9,b.plazo10,b.plazo11,b.plazo12];

    this.arfcree = new Arfcree();
    this.arfcree.arfcreePk = new ArfcreePK();
    this.arfcree.arfcreePk = tempd;
    this.arfcree.arfcredList = [];
    
    for(let i= 0;i<=c.length;i++){
        if(c[i] != null) a++;
        else break;
    }
    let f: number = 0;
    for(let i= 0; i <= a; i++ ){
        let d: Arfcred = new Arfcred();
        d.arfcredPk = new ArfcredPK();
        d.arfcredPk.noCia = tempd.noCia;
        d.arfcredPk.noCliente = tempd.noCliente;
        d.arfcredPk.noOrden = tempd.noOrden;
        d.arfcredPk.noCredito = 'Cuota00'+(i+1);
        d.tiempoPago = c[i];
        if(i === a) d.monto = parseFloat(this.trunc((this.detalle.total-f),2));else 
        {
            d.monto = parseFloat(this.trunc(this.detalle.total/(a+1),2));
            f += d.monto;
        }
        e.setDate(e.getDate()+c[i]);
        d.fechaPago = this.datepipe.transform(e,'dd/MM/yyyy');
        g.push(d);
    }
    this.arfcree.arfcredList = g;

    this.arfcree.monto = this.detalle.total;
    this.arfcree.codFP = this.arfafp.arfafpPK.codFpago;
    this.arfcree.cuota = a+1;
    this.arfcree.fecEmi = this.datepipe.transform(new Date(),'dd/MM/yyyy')
    this.arfcree.detrac = 'N';
    this.arfcree.retencion = 'N';
    this.arfcree.percepcion = 'N';
    this.arfcree.saldoDRP = 0;
    this.arfcree.porcenDetrac = 0;
    this.arfcree.porcenPercep = 0;
    this.arfcree.porcenRetenc = 0;
    this.arfcree.imporDRP = 0;
    // console.log(this.arfcree);

  }

  public formaPago(cod: string){
    let list: Arfafp[] = [];
    this.arfafpservice.listarFPFactu(sessionStorage.getItem('cia'),'A').subscribe(data => {
        list = data.resultado;
        // console.log(data);
        for (const l of list) {
          if (l.arfafpPK.codFpago === cod) {
            this.arfafp = l;
            break;
          }
        }
    })
  }

  public cargarExtras(){
    this.totalIGV = 0;
    this.detalle.arfaflList.forEach(
        a => this.totalIGV += a.imp_IGV
    );
  }

  envioDataFE(){
    this.arfafeService.envioParaFE(this.detalle.arfafePK.noCia,
      '001',
      this.detalle.arfafePK.tipoDoc,
      this.detalle.arfafePK.noFactu).subscribe(data => console.log(data), error => console.log(error));
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

  trunc (x, de = 0) {
    return Number(Math.round(parseFloat(x + 'e' + de)) + 'e-' + de).toFixed(de);
  }


  arccdi:Arccdi = new Arccdi();
  arccdp:Arccdp = new Arccdp();
  arccpr:Arccpr = new Arccpr();

public listarDistrito(cia:string, detalle:Arfafe,arccmcService: ArccmcService): void{
  arccmcService.listarDistritoXciaAndDepartAndProvinc
  (cia,detalle.codi_DEPA,detalle.codi_PROV)
  .subscribe( data => {
    for (const t of data) {
      if (t.arccdiPK.codiDist === detalle.codi_DIST) {
          this.arccdi = t;
          break;
      }
    }
  });
 }
 public listarProvincia(cia:string, detalle:Arfafe,arccmcService: ArccmcService): void{
  arccmcService.listarProvincXciaAndDepart(cia,detalle.codi_DEPA).subscribe( data => {
    for (const t of data) {
      if (t.arccprPK.codiProv === detalle.codi_PROV) {
          this.arccpr = t;
          break;
      }
    }
  });
}
  public listarDepartamento(cia:string, detalle:Arfafe,arccmcService: ArccmcService){
  arccmcService.listarDepartXcia(cia).subscribe( data =>{
      for(const o of data){
          if(o.arccdpPK.codiDepa === detalle.codi_DEPA){
              this.arccdp = o;
              break;
          }
      }
   });
}

  report(){
      
    this.arcgmoService.listarArcgmo().subscribe( b => {
        b.resultado.forEach( obj => {
            if(obj.moneda === this.detalle.moneda){
                let txt = new UtilsArfafe().NumeroALetras(this.detalle.total,obj.descripcion);
                
            this.arfamcService.buscarId(this.cia).subscribe(rs => {
                
                if(this.arfafp.arfafpPK.tipoFpago === "20")
                new PdfArfafe().ProperDesing(rs,this.detalle,this.uniMed,this.arfafp,this.datepipe, txt,false,new Arfcree(),this.arccdi,this.arccdp,this.arccpr);    
                else
                new PdfArfafe().ProperDesing(rs,this.detalle,this.uniMed,this.arfafp,this.datepipe, txt,true, this.arfcree,this.arccdi,this.arccdp,this.arccpr); 
                                
            });
            }
        })
    });
      
  }

//   ProperDesingA5() {
//     var body = [];
//     body.push([
//         {text: 'Código', bold: true, fontSize: 6, alignment: 'center',fillColor: '#008CD9',color:'#FFF'},
//         {text: 'Descripción', bold: true, fontSize: 6,fillColor: '#008CD9',color:'#FFF'},
//         {text: 'UM', bold: true, fontSize: 6, alignment: 'center',fillColor: '#008CD9',color:'#FFF'},
//         {text: 'Cantidad', bold: true, fontSize: 6, alignment: 'center',fillColor: '#008CD9',color:'#FFF'},
//         {text: 'Valor Unitario', bold: true, fontSize: 6, alignment: 'center',fillColor: '#008CD9',color:'#FFF'},
//         {text: 'Desc', bold: true, fontSize: 6, alignment: 'center',fillColor: '#008CD9',color:'#FFF'},
//         {text: 'ICBPER', bold: true, fontSize: 6, alignment: 'center',fillColor: '#008CD9',color:'#FFF'},
//         {text: 'IGV', bold: true, fontSize: 6, alignment: 'center',fillColor: '#008CD9',color:'#FFF'},
//         {text: 'Valor Total', bold: true, fontSize: 6, alignment: 'center',fillColor: '#008CD9',color:'#FFF'}]);
//     this.detalle.arfaflList.forEach(l => {
//         body.push(
//             [{text: l.no_ARTI, bold: false, fontSize: 6},
//             {text: l.descripcion, bold: false, fontSize: 6},
//             {text: this.uniMed[l.arfaflPK.consecutivo], bold: false, fontSize: 6},
//             {text: l.cantidad_ENTR, bold: false, fontSize: 6, alignment: 'right'},
//             {text: l.precio_UNIT, bold: false, fontSize: 6, alignment: 'right'},
//             {text: l.p_DSCTO3, bold: false, fontSize: 6, alignment: 'right'},
//             {text: 0.00, bold: false, fontSize: 6, alignment: 'right'},
//             {text: l.imp_IGV, bold: false, fontSize: 6, alignment: 'right'},
//             {text: this.trunc(l.total,2), bold: false, fontSize: 6, alignment: 'right'}
//             ]
//         );
//       });
//     var bodyDet = [];
//     bodyDet.push([
//         {text: 'Descuento Global',margin:[2,0,0,0], bold: true, fontSize: 6,fillColor: '#008CD9',color:'#FFF'},
//         {
//             columns: [
//                 {text: 'S/ ', alignment: 'left'},
//                 {text: this.trunc(this.detalle.descuento,2), alignment: 'right'}
//             ],
//             bold: true, fontSize: 6,fillColor: '#008CD9',color:'#FFF',
//             margin: [0,0,2,0]
//         }
//         // {text: [
//         //     {text: 'S/ ', alignment: 'left'},
//         //     {text: this.detalle.descuento, alignment: 'right'}],
//         //      bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'}
//     ]);
//     bodyDet.push([
//         {text: ' Total Valor Venta - Operaciones Gravadas:',margin:[2,0,0,0], bold: true, fontSize: 6,fillColor: '#008CD9',color:'#FFF'},
//         // {text: 'S/ '+this.detalle.oper_GRAVADAS, bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'}
//         {
//             columns: [
//                 {text: 'S/ ', alignment: 'left'},
//                 {text: this.trunc((this.detalle.oper_GRAVADAS+this.totalIGV),2), alignment: 'right'}
//             ],
//             bold: true, fontSize: 6,fillColor: '#008CD9',color:'#FFF',
//             margin: [0,0,2,0]
//         }
//     ]);
//     bodyDet.push([
//         {text: ' ICBPER',margin:[2,0,0,0], bold: true, fontSize: 6,fillColor: '#008CD9',color:'#FFF'},
//         // {text: 'S/ 0', bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'}
//         {
//             columns: [
//                 {text: 'S/ ', alignment: 'left'},
//                 {text: '0.00', alignment: 'right'}
//             ],
//             bold: true, fontSize: 6,fillColor: '#008CD9',color:'#FFF',
//             margin: [0,0,2,0]
//         }
//     ]);
//     bodyDet.push([
//         {text: ' IGV',margin:[2,0,0,0], bold: true, fontSize: 6,fillColor: '#008CD9',color:'#FFF'},
//         // {text: 'S/ '+this.totalIGV, bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'}
//         {
//             columns: [
//                 {text: 'S/ ', alignment: 'left'},
//                 {text: this.trunc(this.totalIGV,2), alignment: 'right'}
//             ],
//             bold: true, fontSize: 6,fillColor: '#008CD9',color:'#FFF',
//             margin: [0,0,2,0]
//         }
//     ]);
//     bodyDet.push([
//         {text: ' Importe Total',margin:[2,0,0,0], bold: true, fontSize: 6,fillColor: '#008CD9',color:'#FFF'},
//         // {text: 'S/ '+this.detalle.total, bold: true, fontSize: 9,fillColor: '#008CD9',color:'#FFF'}
//         {
//             columns: [
//                 {text: 'S/ ', alignment: 'left'},
//                 {text: this.trunc(this.detalle.total,2)+'', alignment: 'right'}
//             ],
//             bold: true, fontSize: 6,fillColor: '#008CD9',color:'#FFF',
//             margin: [0,0,2,0]
//         }
//     ]);
//     bodyDet.push([
//         {text: ' Redondeo',margin:[2,0,0,0], bold: true, fontSize: 6,fillColor: '#008CD9',color:'#FFF'},
//         // {text: 'S/ 0', bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'}
//         {
//             columns: [
//                 {text: 'S/ ', alignment: 'left'},
//                 {text: '0.00', alignment: 'right'}
//             ],
//             bold: true, fontSize: 6,fillColor: '#008CD9',color:'#FFF',
//             margin: [0,0,2,0]
//         }
//     ]);
//     bodyDet.push([
//         {text: ' Descuentos Totales',margin:[2,0,0,0], bold: true, fontSize: 6,fillColor: '#008CD9',color:'#FFF'},
//         // {text: 'S/.'+this.detalle.descuento, bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'}
//         {
//             columns: [
//                 {text: 'S/ ', alignment: 'left'},
//                 {text: this.trunc(this.detalle.descuento,2), alignment: 'right'}
//             ],
//             bold: true, fontSize: 6,fillColor: '#008CD9',color:'#FFF',
//             margin: [0,0,2,0]
//         }
//     ]);

//     const documentDefinition = {
//     pageSize: 'A4',
//     //   pageOrientation: 'landscape',
//     pageMargins: [20, 20, 235, 440],
//       footer: {
//         columns: [
//             [
//             {
//                 columns: [
//                     [
//                          {qr: 'pagina de FE qr. k', fit: '50' },
//                          {text: ' '},
//                          {text: 'Representación Impresa de la Factura electrónica',
//                         fontSize: 6}
//                     ],
//                     [
//                         {
//                             margin: [ 0, 5, 0, 0],
//                             layout: 'noBorders',
//                             table: {
//                               headerRows: 0,
//                               widths: ['70%', '30%'],

//                               body: bodyDet
//                             }
//                           }
//                     ]
//                 ],
//                 margin: [10,20,5,15]
//             },
//             {
//                 layout: {
//                     hLineWidth: function(i, node) {
//                      return (i === 0 || i === node.table.body.length) ? 0.5 : 0.5;
//                     },
//                     vLineWidth: function(i, node) {
//                      return (i === 0 || i === node.table.widths.length) ? 0.5 : 0.5;
//                     },
//                     hLineColor: function (i, node) {
//                         return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
//                     },
//                     vLineColor: function(i, node) {
//                         return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
//                     }
//                 },
//                 width: 320,
//                 table: {
//                   headerRows: 1,
//                   widths: ['100%'],
//                   body: [
//                       [{text: 'Sus pagos depositar al banco Interbank',
//                       fillColor: '#008CD9',color:'#FFF',bold: true,fontSize: 8}],
//                       [
//                         {
//                             columns: [
//                                 [{
//                                     text: [
//                                         {
//                                             text: 'Cuenta en Soles   : ',
//                                             // bold: true,
//                                             fontSize: 8
//                                         },
//                                         {   text: '191-2039372-0-16',
//                                         // bold: true,
//                                         fontSize: 8
//                                         }
//                                     ]
//                                 },
//                                 {
//                                     text: [
//                                         {
//                                             text: 'Cuenta en Dolares  : ',
//                                             // bold: true,
//                                             fontSize: 8
//                                         },
//                                         {   text: '191-1985270-1-41',
//                                         // bold: true,
//                                         fontSize: 8
//                                         }
//                                     ]
//                                 }]
//                             ]
//                         }
//                       ]
//                 ]
//                 },
//                 margin: [10,0,5,0]
//             }
//             ]
//         ],
//         margin: [10,0,235,0]
//     },

//       content: [
//         //   {qr: 'text'},
//         {
//             columns: [
//                 {
//                     width: 50,
//                     height: 70,
//                     image: this.logoDataUrl
//                 },
//                 [
//                     {
//                         width: 350,
//                         noWrap: false,
//                         maxHeight: 70,
//                         text: [
//                             {
//                                 text: 'Pag.Web : ',
//                                 bold:true
//                             },
//                             {
//                                 text: 'WWW.CDSI.COM.PE/RYSE',
//                                 fontSize: 6
//                             }
//                         ],
//                         color: 'black',
//                         fontSize: 7
//                     },
//                     {
//                         width: 350,
//                         noWrap: false,
//                         maxHeight: 70,
//                         text: [
//                             {
//                                 text: 'Email: ',
//                                 bold:true
//                             },
//                             {
//                                 text: 'rysesperanza@hotmail.com',
//                                 fontSize: 6
//                             }
//                         ],
//                         color: 'black',
//                         fontSize: 7
//                     },
//                     {
//                         width: 350,
//                         noWrap: false,
//                         maxHeight: 70,
//                         text: [
//                             {
//                                 text: 'Teléfonos : ',
//                                 bold:true
//                             },
//                             {
//                                 text: '01 7820798 / 965428693 / 937802577',
//                                 fontSize: 6
//                             }
//                         ],
//                         color: 'black',
//                         fontSize: 7
//                     },
//                     {
//                         width: 250,
//                         noWrap: false,
//                         maxHeight: 70,
//                         text: [
//                             {
//                                 text: 'Domicilio Fiscal :',
//                                 bold:true
//                             },
//                             {
//                                 text: 'AV. AVIACION N° 1120 LA VICTORIA, LIMA, LIMA',
//                                 fontSize: 6
//                             }
//                         ],
//                         color: 'black',
//                         fontSize: 7
//                     }
//                 ],
//                 {
//                     // margin: [ 5, 0, 0, 0],
//                     layout: {
//                         hLineWidth: function(i, node) {
//                          return (i === 0 || i === node.table.body.length) ? 0.5 : 0.5;
//                         },
//                         vLineWidth: function(i, node) {
//                          return (i === 0 || i === node.table.widths.length) ? 0.5 : 0.5;
//                         },
//                         hLineColor: function (i, node) {
//                             return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
//                         },
//                         vLineColor: function(i, node) {
//                             return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
//                         }
//                     },
//                     // layout: 'noBorders',
//                     width: 110,
//                     table: {
//                       headerRows: 1,
//                       widths: [100],
//                       body: [
//                           [{text: 'FACTURA ELECTRÓNICA',fillColor: '#008CD9',color:'#FFF',bold: true}],
//                           [
//                             {
//                                 text: 'RUC: '+this.detalle.no_CLIENTE+' '+this.detalle.arfafePK.noFactu,
//                                 bold: true,
//                                 fontSize: 10
//                             }
//                           ]
//                     ]
//                     },
//                     style: 'anotherStyle'
//                 }
//             ],
//             margin: [ 0, 0, 0, 6],
//             columnGap: 15
//         },
//         {
//             stack: [
//                 {
//                     canvas: [
//                         {
//                             type: 'rect',
//                             x: 0,
//                             y: 0,
//                             w: 340,
//                             h: 46,
//                             lineWidth: 0.05,
//                             lineColor: 'grey'
//                         }
//                     ]
//                 },
//                 {
//                     columns: [
//                         [
//                             {
//                                 columns: [
//                                     {
//                                         width: 260,
//                                         noWrap: false,
//                                         maxHeight: 70,
//                                         text: [
//                                             {
//                                                 text: 'Cliente            : ',
//                                                 bold:true
//                                             },
//                                             {
//                                                 text: this.detalle.nbr_CLIENTE,
//                                                 fontSize: 7
//                                             }
//                                         ],
//                                         color: 'black',
//                                         fontSize: 8
//                                     },
//                                     {
//                                         width: 165,
//                                         noWrap: false,
//                                         maxHeight: 70,
//                                         text: [
//                                             {
//                                                 text: 'RUC  :',
//                                                 bold:true
//                                             },
//                                             {
//                                                 text: this.detalle.no_CLIENTE,
//                                                 fontSize: 7
//                                             }
//                                         ],
//                                         color: 'black',
//                                         fontSize: 8
//                                     }
//                                 ]
//                             },
//                             {
//                                 width: 340,
//                                 noWrap: false,
//                                 maxHeight: 70,
//                                 text: [
//                                     {
//                                         text: 'Dirección       : ',
//                                         bold:true
//                                     },
//                                     {
//                                         text: this.detalle.direccion,
//                                         fontSize: 7
//                                     }
//                                 ],
//                                 color: 'black',
//                                 fontSize: 8
//                             },
//                             {
//                                 columns: [
//                                     {
//                                         width: 340/2,
//                                         noWrap: false,
//                                         maxHeight: 70,
//                                         text: [
//                                             {
//                                                 text: 'F. Emisión      : ',
//                                                 bold:true
//                                             },
//                                             {
//                                                 text: this.datepipe.transform(this.detalle.fecha,'dd/MM/yyyy'),
//                                                 fontSize: 7
//                                             }
//                                         ],
//                                         color: 'black',
//                                         fontSize: 8
//                                     },
//                                     {
//                                         width: 340/2,
//                                         noWrap: false,
//                                         maxHeight: 70,
//                                         text: [
//                                             {
//                                                 text: 'Condición Pago : ',
//                                                 bold:true
//                                             },
//                                             {
//                                                 text: this.arfafp.descripcion,
//                                                 fontSize: 7
//                                             }
//                                         ],
//                                         color: 'black',
//                                         fontSize: 8
//                                     }
//                                 ]
//                             },
//                             {
//                                 columns: [
//                                     {
//                                         width: 100,
//                                         noWrap: false,
//                                         maxHeight: 70,
//                                         text: [
//                                             {
//                                                 text: 'Orden Compra : ',
//                                                 bold:true
//                                             },
//                                             {
//                                                 text: this.detalle.no_SOLIC,
//                                                 fontSize: 7
//                                             }
//                                         ],
//                                         color: 'black',
//                                         fontSize: 8
//                                     },
//                                     {
//                                         width: 105,
//                                         noWrap: false,
//                                         maxHeight: 70,
//                                         text: [
//                                             {
//                                                 text: 'Guía Remisión : ',
//                                                 bold:true
//                                             },
//                                             {
//                                                 text: this.detalle.no_GUIA,
//                                                 fontSize: 7
//                                             }
//                                         ],
//                                         color: 'black',
//                                         fontSize: 8
//                                     },
//                                     {
//                                         width: 55,
//                                         noWrap: false,
//                                         maxHeight: 70,
//                                         text: [
//                                             {
//                                                 text: 'Moneda : ',
//                                                 bold:true
//                                             },
//                                             {
//                                                 text: this.detalle.moneda,
//                                                 fontSize: 7
//                                             }
//                                         ],
//                                         color: 'black',
//                                         fontSize: 8
//                                     },
//                                     {
//                                         width: '*',
//                                         noWrap: false,
//                                         maxHeight: 70,
//                                         text: [
//                                             {
//                                                 text: 'Vendedor : ',
//                                                 bold:true
//                                             },
//                                             {
//                                                 text: this.detalle.cuser,
//                                                 fontSize: 7
//                                             }
//                                         ],
//                                         color: 'black',
//                                         fontSize: 8
//                                     }
//                                 ]
//                             }
//                         ]
//                     ],
//                     margin : [5,6,5,0]
//                     ,
//                     relativePosition: {
//                     x: 0,
//                     y: -46
//                     }
//                 }
//             ]
//         },
//         // 'texto antes de tabla',
//         {
//           margin: [ 0, 5, 0, 0],
//           layout: 'noBorders',
//           table: {
//             headerRows: 1,
//             widths: ['6%', '40%', '5%', '9%','11%', '4%', '8%', '7%','10%'],

//             body: body
//           }
//         }
//       ],
//       styles: {
//         anotherStyle: {
//         //   italics: true,
//           alignment: 'center',
//           lineWidth: 0.05
//         }
//       }
//     };
//     pdfMake.createPdf(documentDefinition).open();
//   }

//   ProperDesingTicket() {
//     var body = [];
//     body.push([
//         {text: 'DESCRIPCION', bold: true, fontSize: 6},
//         {text: 'P.U.', bold: true, fontSize: 6, alignment: 'right'},
//         {text: 'TOTAL', bold: true, fontSize: 6, alignment: 'right'}
//     ]);
//     this.detalle.arfaflList.forEach(l => {
//         body.push(
//             [
//                 {
//                     text: [
//                             '[',
//                             l.cantidad_ENTR.toFixed(2),
//                             '] ',
//                             l.descripcion
//                         ],
//                          bold: false, fontSize: 6
//                 },
//             {text:
//                 parseFloat(this.trunc((l.precio_UNIT+l.imp_IGV),2)),
//                  bold: false, fontSize: 6, alignment: 'right'},
//             {text: l.total, bold: false, fontSize: 6, alignment: 'right'}
//             ]
//         );
//       });
//     var bodyDet = [];
//     bodyDet.push([
//         {text: 'Descuento Global', bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'},
//         {
//             columns: [
//                 {text: 'S/ ', alignment: 'left'},
//                 {text: this.detalle.descuento, alignment: 'right'}
//             ],
//             bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF',
//             margin: [0,0,5,0]
//         }
//         // {text: [
//         //     {text: 'S/ ', alignment: 'left'},
//         //     {text: this.detalle.descuento, alignment: 'right'}],
//         //      bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'}
//     ]);
//     bodyDet.push([
//         {text: 'Total Valor Venta - Operaciones Gravadas:', bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'},
//         // {text: 'S/ '+this.detalle.oper_GRAVADAS, bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'}
//         {
//             columns: [
//                 {text: 'S/ ', alignment: 'left'},
//                 {text: this.detalle.oper_GRAVADAS, alignment: 'right'}
//             ],
//             bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF',
//             margin: [0,0,5,0]
//         }
//     ]);
//     bodyDet.push([
//         {text: 'ICBPER', bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'},
//         // {text: 'S/ 0', bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'}
//         {
//             columns: [
//                 {text: 'S/ ', alignment: 'left'},
//                 {text: '0', alignment: 'right'}
//             ],
//             bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF',
//             margin: [0,0,5,0]
//         }
//     ]);
//     bodyDet.push([
//         {text: 'IGV', bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'},
//         // {text: 'S/ '+this.totalIGV, bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'}
//         {
//             columns: [
//                 {text: 'S/ ', alignment: 'left'},
//                 {text: this.totalIGV, alignment: 'right'}
//             ],
//             bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF',
//             margin: [0,0,5,0]
//         }
//     ]);
//     bodyDet.push([
//         {text: 'Importe Total', bold: true, fontSize: 9,fillColor: '#008CD9',color:'#FFF'},
//         // {text: 'S/ '+this.detalle.total, bold: true, fontSize: 9,fillColor: '#008CD9',color:'#FFF'}
//         {
//             columns: [
//                 {text: 'S/ ', alignment: 'left'},
//                 {text: this.detalle.total, alignment: 'right'}
//             ],
//             bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF',
//             margin: [0,0,5,0]
//         }
//     ]);
//     bodyDet.push([
//         {text: 'Redondeo', bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'},
//         // {text: 'S/ 0', bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'}
//         {
//             columns: [
//                 {text: 'S/ ', alignment: 'left'},
//                 {text: '0', alignment: 'right'}
//             ],
//             bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF',
//             margin: [0,0,5,0]
//         }
//     ]);
//     bodyDet.push([
//         {text: 'Descuentos Totales', bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'},
//         // {text: 'S/.'+this.detalle.descuento, bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'}
//         {
//             columns: [
//                 {text: 'S/ ', alignment: 'left'},
//                 {text: this.detalle.descuento, alignment: 'right'}
//             ],
//             bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF',
//             margin: [0,0,5,0]
//         }
//     ]);

//     const documentDefinition = {
//         pageSize: {
//             width: 307.09,
//             height: 779.53
//         },

//         pageMargins: [20, 30, 20, 30],
//       content: [

//         {
//             columns: [
//                 [
//                     {
//                         width: 350,
//                         noWrap: false,
//                         maxHeight: 70,
//                         text: [
//                             {
//                                 text: 'Pag.Web : ',
//                                 bold:true
//                             },
//                             {
//                                 text: 'WWW.HS-IMPORT.COM',
//                                 fontSize: 8
//                             }
//                         ],
//                         color: 'black',
//                         fontSize: 9
//                     },
//                     {
//                         width: 350,
//                         noWrap: false,
//                         maxHeight: 70,
//                         text: [
//                             {
//                                 text: 'Email: ',
//                                 bold:true
//                             },
//                             {
//                                 text: 'VENTAS@HS-IMPORT.COM',
//                                 fontSize: 8
//                             }
//                         ],
//                         color: 'black',
//                         fontSize: 9
//                     },
//                     {
//                         width: 350,
//                         noWrap: false,
//                         maxHeight: 70,
//                         text: [
//                             {
//                                 text: 'Teléfonos : ',
//                                 bold:true
//                             },
//                             {
//                                 text: '01 3545576 / 983537208',
//                                 fontSize: 8
//                             }
//                         ],
//                         color: 'black',
//                         fontSize: 9
//                     },
//                     {
//                         width: 250,
//                         noWrap: false,
//                         maxHeight: 70,
//                         text: [
//                             {
//                                 text: 'Domicilio Fiscal :',
//                                 bold:true
//                             },
//                             {
//                                 text: 'AV. SANTA ANA MZ A 33 LT:36 CULTURA PERUANA MODERNA (SANTA ANITA) - SANTA ANITA - LIMA - LIMA',
//                                 fontSize: 8
//                             }
//                         ],
//                         color: 'black',
//                         fontSize: 9
//                     }
//                 ],
//                 {
//                     // margin: [ 5, 0, 0, 0],
//                     layout: {
//                         hLineWidth: function(i, node) {
//                          return (i === 0 || i === node.table.body.length) ? 0.5 : 0.5;
//                         },
//                         vLineWidth: function(i, node) {
//                          return (i === 0 || i === node.table.widths.length) ? 0.5 : 0.5;
//                         },
//                         hLineColor: function (i, node) {
//                             return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
//                         },
//                         vLineColor: function(i, node) {
//                             return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
//                         }
//                     },
//                     // layout: 'noBorders',
//                     width: 110,
//                     table: {
//                       headerRows: 1,
//                       widths: [100],
//                       body: [
//                           [{text: 'FACTURA ELECTRÓNICA',fillColor: '#008CD9',color:'#FFF',bold: true}],
//                           [
//                             {
//                                 text: 'RUC: '+this.detalle.no_CLIENTE+' '+this.detalle.arfafePK.noFactu,
//                                 bold: true,
//                                 fontSize: 10
//                             }
//                           ]
//                     ]
//                     },
//                     style: 'anotherStyle'
//                 }
//             ],
//             margin: [ 0, 0, 0, 6],
//             columnGap: 15
//         },
//         {
//             stack: [
//                 {
//                     canvas: [
//                         {
//                             type: 'rect',
//                             x: 0,
//                             y: 0,
//                             w: 515,
//                             h: 56,
//                             lineWidth: 0.05,
//                             lineColor: 'grey'
//                         }
//                     ]
//                 },
//                 {
//                     columns: [
//                         [
//                             {
//                                 columns: [
//                                     {
//                                         width: 350,
//                                         noWrap: false,
//                                         maxHeight: 70,
//                                         text: [
//                                             {
//                                                 text: 'Cliente            : ',
//                                                 bold:true
//                                             },
//                                             {
//                                                 text: this.detalle.nbr_CLIENTE,
//                                                 fontSize: 8
//                                             }
//                                         ],
//                                         color: 'black',
//                                         fontSize: 9
//                                     },
//                                     {
//                                         width: 165,
//                                         noWrap: false,
//                                         maxHeight: 70,
//                                         text: [
//                                             {
//                                                 text: 'RUC  :',
//                                                 bold:true
//                                             },
//                                             {
//                                                 text: this.detalle.no_CLIENTE,
//                                                 fontSize: 8
//                                             }
//                                         ],
//                                         color: 'black',
//                                         fontSize: 9
//                                     }
//                                 ]
//                             },
//                             {
//                                 width: 515,
//                                 noWrap: false,
//                                 maxHeight: 70,
//                                 text: [
//                                     {
//                                         text: 'Dirección       : ',
//                                         bold:true
//                                     },
//                                     {
//                                         text: this.detalle.direccion,
//                                         fontSize: 8
//                                     }
//                                 ],
//                                 color: 'black',
//                                 fontSize: 9
//                             },
//                             {
//                                 columns: [
//                                     {
//                                         width: 515/2,
//                                         noWrap: false,
//                                         maxHeight: 70,
//                                         text: [
//                                             {
//                                                 text: 'F. Emisión      : ',
//                                                 bold:true
//                                             },
//                                             {
//                                                 text: this.datepipe.transform(this.detalle.fecha,'dd/MM/yyyy'),
//                                                 fontSize: 8
//                                             }
//                                         ],
//                                         color: 'black',
//                                         fontSize: 9
//                                     },
//                                     {
//                                         width: 515/2,
//                                         noWrap: false,
//                                         maxHeight: 70,
//                                         text: [
//                                             {
//                                                 text: 'Condición Pago : ',
//                                                 bold:true
//                                             },
//                                             {
//                                                 text: this.arfafp.descripcion,
//                                                 fontSize: 8
//                                             }
//                                         ],
//                                         color: 'black',
//                                         fontSize: 9
//                                     }
//                                 ]
//                             },
//                             {
//                                 columns: [
//                                     {
//                                         width: 160,
//                                         noWrap: false,
//                                         maxHeight: 70,
//                                         text: [
//                                             {
//                                                 text: 'Orden Compra : ',
//                                                 bold:true
//                                             },
//                                             {
//                                                 text: this.detalle.no_SOLIC,
//                                                 fontSize: 8
//                                             }
//                                         ],
//                                         color: 'black',
//                                         fontSize: 9
//                                     },
//                                     {
//                                         width: '*',
//                                         noWrap: false,
//                                         maxHeight: 70,
//                                         text: [
//                                             {
//                                                 text: 'Guía Remisión : ',
//                                                 bold:true
//                                             },
//                                             {
//                                                 text: this.detalle.no_GUIA,
//                                                 fontSize: 8
//                                             }
//                                         ],
//                                         color: 'black',
//                                         fontSize: 9
//                                     },
//                                     {
//                                         width: '*',
//                                         noWrap: false,
//                                         maxHeight: 70,
//                                         text: [
//                                             {
//                                                 text: 'Moneda : ',
//                                                 bold:true
//                                             },
//                                             {
//                                                 text: this.detalle.moneda,
//                                                 fontSize: 8
//                                             }
//                                         ],
//                                         color: 'black',
//                                         fontSize: 9
//                                     },
//                                     {
//                                         width: '*',
//                                         noWrap: false,
//                                         maxHeight: 70,
//                                         text: [
//                                             {
//                                                 text: 'Vendedor : ',
//                                                 bold:true
//                                             },
//                                             {
//                                                 text: this.detalle.cuser,
//                                                 fontSize: 8
//                                             }
//                                         ],
//                                         color: 'black',
//                                         fontSize: 9
//                                     }
//                                 ]
//                             }
//                         ]
//                     ],
//                     margin : [5,6,5,0]
//                     ,
//                     relativePosition: {
//                     x: 0,
//                     y: -56
//                     }
//                 }
//             ]
//         },
//         {
//             text: '--------------------------------------------------------------------'
//         },
//         {
//           margin: [ 0, 5, 0, 0],
//           layout: 'noBorders',
//           table: {
//             headerRows: 1,
//             widths: ['60%', '20%','20%'],

//             body: body
//           }
//         }
//       ],
//       styles: {
//         anotherStyle: {
//         //   italics: true,
//           alignment: 'center',
//           lineWidth: 0.05
//         }
//       }
//     };
//     pdfMake.createPdf(documentDefinition).open();
//   }

//   PriceFormat = (number) => {
//     const exp = /(\d)(?=(\d{3})+(?!\d))/g;
//     const rep = '$1,';
//     let arr = number.toString().split('.');
//     arr[0] = arr[0].replace(exp,rep);
//     return arr[1] ? arr.join('.'): arr[0];
//   }

//   ProperDesing() {

//     this.arfamcService.buscarId(this.cia).subscribe( result => {
//         this.arfamc = result;
//         console.log(this.arfamc);
//     var body = [];
//     body.push([
//         {text: 'Código', bold: true, fontSize: 8, alignment: 'center',fillColor: '#008CD9',color:'#FFF'},
//         {text: 'Descripción', bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'},
//         {text: 'UM', bold: true, fontSize: 8, alignment: 'center',fillColor: '#008CD9',color:'#FFF'},
//         {text: 'Cantidad', bold: true, fontSize: 8, alignment: 'center',fillColor: '#008CD9',color:'#FFF'},
//         {text: 'Valor Unitario', bold: true, fontSize: 8, alignment: 'center',fillColor: '#008CD9',color:'#FFF'},
//         {text: '% Desc', bold: true, fontSize: 8, alignment: 'center',fillColor: '#008CD9',color:'#FFF'},
//         {text: 'ICBPER', bold: true, fontSize: 8, alignment: 'center',fillColor: '#008CD9',color:'#FFF'},
//         {text: 'IGV', bold: true, fontSize: 8, alignment: 'center',fillColor: '#008CD9',color:'#FFF'},
//         {text: 'Valor Total', bold: true, fontSize: 8, alignment: 'center',fillColor: '#008CD9',color:'#FFF'}]);
//     this.detalle.arfaflList.forEach(l => {
//         body.push(
//             [
//             {text: l.no_ARTI, bold: false, fontSize: 7,lineHeight: 0.8},
//             {text: l.descripcion, bold: false, fontSize: 7, lineHeight: 0.8},
//             {text: this.uniMed[l.arfaflPK.consecutivo], bold: false, fontSize: 8},
//             {text: l.cantidad_ENTR, bold: false, fontSize: 7, alignment: 'right'},
//             {text: this.trunc(l.precio_UNIT_ORIG,5), bold: false, fontSize: 7, alignment: 'right'},
//             {text: l.p_DSCTO3, bold: false, fontSize: 7, alignment: 'right'},
//             {text: 0.00, bold: false, fontSize: 7, alignment: 'right'},
//             {text: l.imp_IGV.toFixed(2), bold: false, fontSize: 7, alignment: 'right'},
//             {text: l.total.toFixed(2), bold: false, fontSize: 7, alignment: 'right'}
//             ]
//         );
//       });
//     var bodyDet = [];
//     bodyDet.push([
//         {text: 'Descuento Global',margin:[2,0,0,0], bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'},
//         {
//             columns: [
//                 {text: 'S/ ', alignment: 'left'},
//                 {text: this.PriceFormat(this.trunc(this.detalle.descuento,2)), alignment: 'right'}
//             ],
//             bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF',
//             margin: [0,0,5,0]
//         }
//         // {text: [
//         //     {text: 'S/ ', alignment: 'left'},
//         //     {text: this.detalle.descuento, alignment: 'right'}],
//         //      bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'}
//     ]);
//     bodyDet.push([
//         {text: 'Total Valor Venta - Operaciones Gravadas:',margin:[2,0,0,0], bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'},
//         // {text: 'S/ '+this.detalle.oper_GRAVADAS, bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'}
//         {
//             columns: [
//                 {text: 'S/ ', alignment: 'left'},
//                 {text: this.PriceFormat(this.trunc(this.detalle.oper_GRAVADAS,2)), alignment: 'right'}
//             ],
//             bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF',
//             margin: [0,0,5,0]
//         }
//     ]);
//     bodyDet.push([
//         {text: 'ICBPER',margin:[2,0,0,0], bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'},
//         // {text: 'S/ 0', bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'}
//         {
//             columns: [
//                 {text: 'S/ ', alignment: 'left'},
//                 {text: '0.00', alignment: 'right'}
//             ],
//             bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF',
//             margin: [0,0,5,0]
//         }
//     ]);
//     bodyDet.push([
//         {text: 'IGV',margin:[2,0,0,0], bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'},
//         // {text: 'S/ '+this.totalIGV, bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'}
//         {
//             columns: [
//                 {text: 'S/ ', alignment: 'left'},
//                 {text: this.PriceFormat(this.trunc(this.totalIGV,2)), alignment: 'right'}
//             ],
//             bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF',
//             margin: [0,0,5,0]
//         }
//     ]);
//     bodyDet.push([
//         {text: 'Importe Total',margin:[2,0,0,0], bold: true, fontSize: 9,fillColor: '#008CD9',color:'#FFF'},
//         // {text: 'S/ '+this.detalle.total, bold: true, fontSize: 9,fillColor: '#008CD9',color:'#FFF'}
//         {
//             columns: [
//                 {text: 'S/ ', alignment: 'left'},
//                 {text: this.PriceFormat(this.trunc(this.detalle.total,2)), alignment: 'right'}
//             ],
//             bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF',
//             margin: [0,0,5,0]
//         }
//     ]);
//     bodyDet.push([
//         {text: 'Redondeo',margin:[2,0,0,0], bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'},
//         // {text: 'S/ 0', bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'}
//         {
//             columns: [
//                 {text: 'S/ ', alignment: 'left'},
//                 {text: '0.00', alignment: 'right'}
//             ],
//             bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF',
//             margin: [0,0,5,0]
//         }
//     ]);
//     bodyDet.push([
//         {text: 'Descuentos Totales',margin:[2,0,0,0], bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'},
//         // {text: 'S/.'+this.detalle.descuento, bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'}
//         {
//             columns: [
//                 {text: 'S/ ', alignment: 'left'},
//                 {text: this.PriceFormat(this.trunc(this.detalle.descuento,2)), alignment: 'right'}
//             ],
//             bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF',
//             margin: [0,0,5,0]
//         }
//     ]);

//     const documentDefinition = {
//     // pageSize: 'A5',
//     //   pageOrientation: 'landscape',
//     pageMargins: [40, 20, 40, 600],
//     footer: {
//         columns: [
//             [
//                 {
//                     columns: [
//                         [
//                         {
//                             columns: [
//                                 [
//                                      {qr: 'pagina de FE qr. k', fit: '60' },
//                                      {text: ' '},
//                                      {text: 'Representación Impresa de la Factura electrónica',
//                                     fontSize: 8}
//                                 ],
//                                 [
//                                     {
//                                         margin: [ 0, 5, 0, 0],
//                                         layout: 'noBorders',
//                                         table: {
//                                           headerRows: 0,
//                                           widths: ['70%', '30%'],
            
//                                           body: bodyDet
//                                         }
//                                       }
//                                 ]
//                             ],
//                             margin: [10,20,10,15]
//                         },
//                         {
//                             layout: {
//                                 hLineWidth: function(i, node) {
//                                  return (i === 0 || i === node.table.body.length) ? 0.5 : 0.5;
//                                 },
//                                 vLineWidth: function(i, node) {
//                                  return (i === 0 || i === node.table.widths.length) ? 0.5 : 0.5;
//                                 },
//                                 hLineColor: function (i, node) {
//                                     return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
//                                 },
//                                 vLineColor: function(i, node) {
//                                     return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
//                                 }
//                             },
//                             width: 515,
//                             table: {
//                               headerRows: 1,
//                               widths: ['100%'],
//                               body: [
//                                   [{text: 'Sus pagos depositar al banco Interbank',
//                                   fillColor: '#008CD9',color:'#FFF',bold: true,fontSize: 10}],
//                                   [
//                                     {
//                                         columns: [
//                                             [{
//                                                 text: [
//                                                     {
//                                                         text: 'Cuenta en Soles      : ',
//                                                         // bold: true,
//                                                         fontSize: 10
//                                                     },
//                                                     {   text: result.cuentaSol,
//                                                     // bold: true,
//                                                     fontSize: 10
//                                                     }
//                                                 ]
//                                             },
//                                             {
//                                                 text: [
//                                                     {
//                                                         text: 'Cuenta en Dolares  : ',
//                                                         // bold: true,
//                                                         fontSize: 10
//                                                     },
//                                                     {   text: result.cuentaDol,
//                                                     // bold: true,
//                                                     fontSize: 10
//                                                     }
//                                                 ]
//                                             }]
//                                         ]
//                                     }
//                                   ]
//                             ]
//                             }
//                         }
//                         ]
//                     ]
//                 }
//             ]
//         ],
//         margin: [40, 0]
//     },
//             content: [
//         //   {qr: 'text'},
//         {
//             columns: [
//                 {
//                     width: 50,
//                     height: 70,
//                     image: this.logoDataUrl
//                 },
//                 [
//                     {
//                         width: 350,
//                         noWrap: false,
//                         maxHeight: 70,
//                         text: result.nombre,
//                         color: 'black',
//                         // fontSize: 11,
//                         alignment: 'center',
//                         bold: true
//                     },
//                     {
//                         width: 350,
//                         noWrap: false,
//                         maxHeight: 70,
//                         text: result.descripcion,
//                         color: 'black',
//                         fontSize: 9,
//                     },
//                     {
//                         width: 350,
//                         noWrap: false,
//                         maxHeight: 70,
//                         text: [
//                             {
//                                 text: 'Email: ',
//                                 bold:true
//                             },
//                             {
//                                 text: result.email,
//                                 fontSize: 8
//                             },
//                             {text : '               '},
//                             {
//                                 text: 'Pag.Web : ',
//                                 bold:true
//                             },
//                             {
//                                 text: 'WWW.CDSI.COM.PE/RYSE',
//                                 fontSize: 8
//                             }
//                         ],
//                         color: 'black',
//                         fontSize: 9
//                     },
//                     {
//                         width: 350,
//                         noWrap: false,
//                         maxHeight: 70,
//                         text: [
//                             {
//                                 text: 'Teléfonos : ',
//                                 bold:true
//                             },
//                             {
//                                 text: '01 7820798 / 965428693 / 937802577',
//                                 fontSize: 8
//                             }
//                         ],
//                         color: 'black',
//                         fontSize: 9
//                     },
//                     {
//                         width: 250,
//                         noWrap: false,
//                         maxHeight: 70,
//                         text: [
//                             {
//                                 text: 'Domicilio Fiscal :',
//                                 bold:true
//                             },
//                             {
//                                 text: 'AV. AVIACION N° 1120 LA VICTORIA, LIMA, LIMA',
//                                 fontSize: 8
//                             }
//                         ],
//                         color: 'black',
//                         fontSize: 9
//                     }
//                 ],
//                 {
//                     // margin: [ 5, 0, 0, 0],
//                     layout: {
//                         hLineWidth: function(i, node) {
//                          return (i === 0 || i === node.table.body.length) ? 0.5 : 0.5;
//                         },
//                         vLineWidth: function(i, node) {
//                          return (i === 0 || i === node.table.widths.length) ? 0.5 : 0.5;
//                         },
//                         hLineColor: function (i, node) {
//                             return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
//                         },
//                         vLineColor: function(i, node) {
//                             return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
//                         }
//                     },
//                     // layout: 'noBorders',
//                     width: 110,
//                     table: {
//                       headerRows: 1,
//                       widths: [100],
//                       body: [
//                           [{text: 'FACTURA ELECTRÓNICA',fillColor: '#008CD9',color:'#FFF',bold: true}],
//                           [
//                             {
//                                 text: 'RUC: '+result.ruc+' '+this.detalle.arfafePK.noFactu,
//                                 bold: true,
//                                 fontSize: 10
//                             }
//                           ]
//                     ]
//                     },
//                     style: 'anotherStyle'
//                 }
//             ],
//             margin: [ 0, 0, 0, 6],
//             columnGap: 15
//         },
//         {
//             stack: [
//                 {
//                     canvas: [
//                         {
//                             type: 'rect',
//                             x: 0,
//                             y: 0,
//                             w: 515,
//                             h: 50,
//                             lineWidth: 0.05,
//                             lineColor: 'grey'
//                         }
//                     ]
//                 },
//                 {
//                     columns: [
//                         [
//                             {
//                                 columns: [
//                                     {
//                                         width: 350,
//                                         noWrap: false,
//                                         maxHeight: 70,
//                                         text: [
//                                             {
//                                                 text: 'Cliente            : ',
//                                                 bold:true
//                                             },
//                                             {
//                                                 text: this.detalle.nbr_CLIENTE,
//                                                 fontSize: 8
//                                             }
//                                         ],
//                                         color: 'black',
//                                         fontSize: 9
//                                     },
//                                     {
//                                         width: 165,
//                                         noWrap: false,
//                                         maxHeight: 70,
//                                         text: [
//                                             {
//                                                 text: 'RUC  :',
//                                                 bold:true
//                                             },
//                                             {
//                                                 text: this.detalle.no_CLIENTE,
//                                                 fontSize: 8
//                                             }
//                                         ],
//                                         color: 'black',
//                                         fontSize: 9
//                                     }
//                                 ]
//                             },
//                             {
//                                 width: 515,
//                                 noWrap: false,
//                                 maxHeight: 70,
//                                 text: [
//                                     {
//                                         text: 'Dirección       : ',
//                                         bold:true
//                                     },
//                                     {
//                                         text: this.detalle.direccion,
//                                         fontSize: 8
//                                     }
//                                 ],
//                                 color: 'black',
//                                 fontSize: 9
//                             },
//                             {
//                                 columns: [
//                                     {
//                                         width: 515/2,
//                                         noWrap: false,
//                                         maxHeight: 70,
//                                         text: [
//                                             {
//                                                 text: 'F. Emisión      : ',
//                                                 bold:true
//                                             },
//                                             {
//                                                 text: this.datepipe.transform(this.detalle.fecha,'dd/MM/yyyy'),
//                                                 fontSize: 8
//                                             }
//                                         ],
//                                         color: 'black',
//                                         fontSize: 9
//                                     },
//                                     {
//                                         width: 515/2,
//                                         noWrap: false,
//                                         maxHeight: 70,
//                                         text: [
//                                             {
//                                                 text: 'Condición Pago : ',
//                                                 bold:true
//                                             },
//                                             {
//                                                 text: this.arfafp.descripcion,
//                                                 fontSize: 8
//                                             }
//                                         ],
//                                         color: 'black',
//                                         fontSize: 9
//                                     }
//                                 ]
//                             },
//                             {
//                                 columns: [
//                                     {
//                                         width: 160,
//                                         noWrap: false,
//                                         maxHeight: 70,
//                                         text: [
//                                             {
//                                                 text: 'Orden Compra : ',
//                                                 bold:true
//                                             },
//                                             {
//                                                 text: this.detalle.no_SOLIC,
//                                                 fontSize: 8
//                                             }
//                                         ],
//                                         color: 'black',
//                                         fontSize: 9
//                                     },
//                                     {
//                                         width: '*',
//                                         noWrap: false,
//                                         maxHeight: 70,
//                                         text: [
//                                             {
//                                                 text: 'Pedido : ',
//                                                 bold:true
//                                             },
//                                             {
//                                                 text: this.detalle.no_ORDEN,
//                                                 fontSize: 8
//                                             }
//                                         ],
//                                         color: 'black',
//                                         fontSize: 9
//                                     },
//                                     {
//                                         width: '*',
//                                         noWrap: false,
//                                         maxHeight: 70,
//                                         text: [
//                                             {
//                                                 text: 'Moneda : ',
//                                                 bold:true
//                                             },
//                                             {
//                                                 text: this.detalle.moneda,
//                                                 fontSize: 8
//                                             }
//                                         ],
//                                         color: 'black',
//                                         fontSize: 9
//                                     },
//                                     {
//                                         width: '*',
//                                         noWrap: false,
//                                         maxHeight: 70,
//                                         text: [
//                                             {
//                                                 text: 'Vendedor : ',
//                                                 bold:true
//                                             },
//                                             {
//                                                 text: this.detalle.cuser,
//                                                 fontSize: 8
//                                             }
//                                         ],
//                                         color: 'black',
//                                         fontSize: 9
//                                     }
//                                 ]
//                             }
//                         ]
//                     ],
//                     margin : [5,10,5,-8]
//                     ,
//                     relativePosition: {
//                     x: 0,
//                     y: -56
//                     }
//                 }
//             ]
//         },
//         // 'texto antes de tabla',
//         {
//         //   margin: [ 0, 1, 0, 0],
//           layout: 'noBorders',
//           table: {
//             headerRows: 1,
//             widths: ['7%', '41%', '5%', '8%','10%', '5%', '7%', '7%','10%'],

//             body: body
//           }
//         }
//       ],
//       styles: {
//         anotherStyle: {
//         //   italics: true,
//           alignment: 'center',
//           lineWidth: 0.05
//         }
//       }
//     };
//     pdfMake.createPdf(documentDefinition).open();
    
// });
//   }

//   ProperDesingBack() {
//     var body = [];
//     body.push([
//         {text: 'Código', bold: true, fontSize: 8, alignment: 'center',fillColor: '#008CD9',color:'#FFF'},
//         {text: 'Descripción', bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'},
//         {text: 'UM', bold: true, fontSize: 8, alignment: 'center',fillColor: '#008CD9',color:'#FFF'},
//         {text: 'Cantidad', bold: true, fontSize: 8, alignment: 'center',fillColor: '#008CD9',color:'#FFF'},
//         {text: 'Valor Unitario', bold: true, fontSize: 8, alignment: 'center',fillColor: '#008CD9',color:'#FFF'},
//         {text: '% Desc', bold: true, fontSize: 8, alignment: 'center',fillColor: '#008CD9',color:'#FFF'},
//         {text: 'ICBPER', bold: true, fontSize: 8, alignment: 'center',fillColor: '#008CD9',color:'#FFF'},
//         {text: 'IGV', bold: true, fontSize: 8, alignment: 'center',fillColor: '#008CD9',color:'#FFF'},
//         {text: 'Valor Total', bold: true, fontSize: 8, alignment: 'center',fillColor: '#008CD9',color:'#FFF'}]);
//     this.detalle.arfaflList.forEach(l => {
//         body.push(
//             [{text: l.no_ARTI, bold: false, fontSize: 8},
//             {text: l.descripcion, bold: false, fontSize: 8},
//             {text: this.uniMed[l.arfaflPK.consecutivo], bold: false, fontSize: 8},
//             {text: l.cantidad_ENTR, bold: false, fontSize: 8, alignment: 'right'},
//             {text: l.precio_UNIT, bold: false, fontSize: 8, alignment: 'right'},
//             {text: l.p_DSCTO3, bold: false, fontSize: 8, alignment: 'right'},
//             {text: 0.00, bold: false, fontSize: 8, alignment: 'right'},
//             {text: l.imp_IGV.toFixed(2), bold: false, fontSize: 8, alignment: 'right'},
//             {text: l.total.toFixed(2), bold: false, fontSize: 8, alignment: 'right'}
//             ]
//         );
//       });
//     var bodyDet = [];
//     bodyDet.push([
//         {text: 'Descuento Global', bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'},
//         {
//             columns: [
//                 {text: 'S/ ', alignment: 'left'},
//                 {text: this.detalle.descuento, alignment: 'right'}
//             ],
//             bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF',
//             margin: [0,0,5,0]
//         }
//         // {text: [
//         //     {text: 'S/ ', alignment: 'left'},
//         //     {text: this.detalle.descuento, alignment: 'right'}],
//         //      bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'}
//     ]);
//     bodyDet.push([
//         {text: 'Total Valor Venta - Operaciones Gravadas:', bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'},
//         // {text: 'S/ '+this.detalle.oper_GRAVADAS, bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'}
//         {
//             columns: [
//                 {text: 'S/ ', alignment: 'left'},
//                 {text: this.detalle.oper_GRAVADAS, alignment: 'right'}
//             ],
//             bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF',
//             margin: [0,0,5,0]
//         }
//     ]);
//     bodyDet.push([
//         {text: 'ICBPER', bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'},
//         // {text: 'S/ 0', bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'}
//         {
//             columns: [
//                 {text: 'S/ ', alignment: 'left'},
//                 {text: '0', alignment: 'right'}
//             ],
//             bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF',
//             margin: [0,0,5,0]
//         }
//     ]);
//     bodyDet.push([
//         {text: 'IGV', bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'},
//         // {text: 'S/ '+this.totalIGV, bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'}
//         {
//             columns: [
//                 {text: 'S/ ', alignment: 'left'},
//                 {text: this.totalIGV, alignment: 'right'}
//             ],
//             bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF',
//             margin: [0,0,5,0]
//         }
//     ]);
//     bodyDet.push([
//         {text: 'Importe Total', bold: true, fontSize: 9,fillColor: '#008CD9',color:'#FFF'},
//         // {text: 'S/ '+this.detalle.total, bold: true, fontSize: 9,fillColor: '#008CD9',color:'#FFF'}
//         {
//             columns: [
//                 {text: 'S/ ', alignment: 'left'},
//                 {text: this.detalle.total, alignment: 'right'}
//             ],
//             bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF',
//             margin: [0,0,5,0]
//         }
//     ]);
//     bodyDet.push([
//         {text: 'Redondeo', bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'},
//         // {text: 'S/ 0', bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'}
//         {
//             columns: [
//                 {text: 'S/ ', alignment: 'left'},
//                 {text: '0', alignment: 'right'}
//             ],
//             bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF',
//             margin: [0,0,5,0]
//         }
//     ]);
//     bodyDet.push([
//         {text: 'Descuentos Totales', bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'},
//         // {text: 'S/.'+this.detalle.descuento, bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'}
//         {
//             columns: [
//                 {text: 'S/ ', alignment: 'left'},
//                 {text: this.detalle.descuento, alignment: 'right'}
//             ],
//             bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF',
//             margin: [0,0,5,0]
//         }
//     ]);

//     const documentDefinition = {
//     // pageSize: 'A5',
//     //   pageOrientation: 'landscape',
//     pageMargins: [40, 20, 40, 220],
//       footer: {
//         columns: [
//             [
//             {
//                 columns: [
//                     [
//                          {qr: 'pagina de FE qr. k', fit: '60' },
//                          {text: ' '},
//                          {text: 'Representación Impresa de la Factura electrónica',
//                         fontSize: 8}
//                     ],
//                     [
//                         {
//                             margin: [ 0, 5, 0, 0],
//                             layout: 'noBorders',
//                             table: {
//                               headerRows: 0,
//                               widths: ['70%', '30%'],

//                               body: bodyDet
//                             }
//                           }
//                     ]
//                 ],
//                 margin: [10,20,10,15]
//             },
//             {
//                 layout: {
//                     hLineWidth: function(i, node) {
//                      return (i === 0 || i === node.table.body.length) ? 0.5 : 0.5;
//                     },
//                     vLineWidth: function(i, node) {
//                      return (i === 0 || i === node.table.widths.length) ? 0.5 : 0.5;
//                     },
//                     hLineColor: function (i, node) {
//                         return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
//                     },
//                     vLineColor: function(i, node) {
//                         return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
//                     }
//                 },
//                 width: 515,
//                 table: {
//                   headerRows: 1,
//                   widths: ['100%'],
//                   body: [
//                       [{text: 'Sus pagos depositar al banco Interbank',
//                       fillColor: '#008CD9',color:'#FFF',bold: true,fontSize: 10}],
//                       [
//                         {
//                             columns: [
//                                 [{
//                                     text: [
//                                         {
//                                             text: 'Cuenta en Soles   : ',
//                                             // bold: true,
//                                             fontSize: 10
//                                         },
//                                         {   text: '191-2039372-0-16',
//                                         // bold: true,
//                                         fontSize: 10
//                                         }
//                                     ]
//                                 },
//                                 {
//                                     text: [
//                                         {
//                                             text: 'Cuenta en Dolares  : ',
//                                             // bold: true,
//                                             fontSize: 10
//                                         },
//                                         {   text: '191-1985270-1-41',
//                                         // bold: true,
//                                         fontSize: 10
//                                         }
//                                     ]
//                                 }]
//                             ]
//                         }
//                       ]
//                 ]
//                 }
//             }
//             ]
//         ],
//         margin: [40,0]
//     },

//       content: [
//         //   {qr: 'text'},
//         {
//             columns: [
//                 {
//                     width: 50,
//                     height: 70,
//                     image: this.logoDataUrl
//                 },
//                 [
//                     {
//                         width: 350,
//                         noWrap: false,
//                         maxHeight: 70,
//                         text: [
//                             {
//                                 text: 'Pag.Web : ',
//                                 bold:true
//                             },
//                             {
//                                 text: 'WWW.CDSI.COM.PE/RYSE',
//                                 fontSize: 8
//                             }
//                         ],
//                         color: 'black',
//                         fontSize: 9
//                     },
//                     {
//                         width: 350,
//                         noWrap: false,
//                         maxHeight: 70,
//                         text: [
//                             {
//                                 text: 'Email: ',
//                                 bold:true
//                             },
//                             {
//                                 text: 'rysesperanza@hotmail.com',
//                                 fontSize: 8
//                             }
//                         ],
//                         color: 'black',
//                         fontSize: 9
//                     },
//                     {
//                         width: 350,
//                         noWrap: false,
//                         maxHeight: 70,
//                         text: [
//                             {
//                                 text: 'Teléfonos : ',
//                                 bold:true
//                             },
//                             {
//                                 text: '01 7820798 / 965428693 / 937802577',
//                                 fontSize: 8
//                             }
//                         ],
//                         color: 'black',
//                         fontSize: 9
//                     },
//                     {
//                         width: 250,
//                         noWrap: false,
//                         maxHeight: 70,
//                         text: [
//                             {
//                                 text: 'Domicilio Fiscal :',
//                                 bold:true
//                             },
//                             {
//                                 text: 'AV. AVIACION N° 1120 LA VICTORIA, LIMA, LIMA',
//                                 fontSize: 8
//                             }
//                         ],
//                         color: 'black',
//                         fontSize: 9
//                     }
//                 ],
//                 {
//                     // margin: [ 5, 0, 0, 0],
//                     layout: {
//                         hLineWidth: function(i, node) {
//                          return (i === 0 || i === node.table.body.length) ? 0.5 : 0.5;
//                         },
//                         vLineWidth: function(i, node) {
//                          return (i === 0 || i === node.table.widths.length) ? 0.5 : 0.5;
//                         },
//                         hLineColor: function (i, node) {
//                             return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
//                         },
//                         vLineColor: function(i, node) {
//                             return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
//                         }
//                     },
//                     // layout: 'noBorders',
//                     width: 110,
//                     table: {
//                       headerRows: 1,
//                       widths: [100],
//                       body: [
//                           [{text: 'FACTURA ELECTRÓNICA',fillColor: '#008CD9',color:'#FFF',bold: true}],
//                           [
//                             {
//                                 text: 'RUC: '+'20213092571'+' '+this.detalle.arfafePK.noFactu,
//                                 bold: true,
//                                 fontSize: 10
//                             }
//                           ]
//                     ]
//                     },
//                     style: 'anotherStyle'
//                 }
//             ],
//             margin: [ 0, 0, 0, 6],
//             columnGap: 15
//         },
//         {
//             stack: [
//                 {
//                     canvas: [
//                         {
//                             type: 'rect',
//                             x: 0,
//                             y: 0,
//                             w: 515,
//                             h: 56,
//                             lineWidth: 0.05,
//                             lineColor: 'grey'
//                         }
//                     ]
//                 },
//                 {
//                     columns: [
//                         [
//                             {
//                                 columns: [
//                                     {
//                                         width: 350,
//                                         noWrap: false,
//                                         maxHeight: 70,
//                                         text: [
//                                             {
//                                                 text: 'Cliente            : ',
//                                                 bold:true
//                                             },
//                                             {
//                                                 text: this.detalle.nbr_CLIENTE,
//                                                 fontSize: 8
//                                             }
//                                         ],
//                                         color: 'black',
//                                         fontSize: 9
//                                     },
//                                     {
//                                         width: 165,
//                                         noWrap: false,
//                                         maxHeight: 70,
//                                         text: [
//                                             {
//                                                 text: 'RUC  :',
//                                                 bold:true
//                                             },
//                                             {
//                                                 text: this.detalle.no_CLIENTE,
//                                                 fontSize: 8
//                                             }
//                                         ],
//                                         color: 'black',
//                                         fontSize: 9
//                                     }
//                                 ]
//                             },
//                             {
//                                 width: 515,
//                                 noWrap: false,
//                                 maxHeight: 70,
//                                 text: [
//                                     {
//                                         text: 'Dirección       : ',
//                                         bold:true
//                                     },
//                                     {
//                                         text: this.detalle.direccion,
//                                         fontSize: 8
//                                     }
//                                 ],
//                                 color: 'black',
//                                 fontSize: 9
//                             },
//                             {
//                                 columns: [
//                                     {
//                                         width: 515/2,
//                                         noWrap: false,
//                                         maxHeight: 70,
//                                         text: [
//                                             {
//                                                 text: 'F. Emisión      : ',
//                                                 bold:true
//                                             },
//                                             {
//                                                 text: this.datepipe.transform(this.detalle.fecha,'dd/MM/yyyy'),
//                                                 fontSize: 8
//                                             }
//                                         ],
//                                         color: 'black',
//                                         fontSize: 9
//                                     },
//                                     {
//                                         width: 515/2,
//                                         noWrap: false,
//                                         maxHeight: 70,
//                                         text: [
//                                             {
//                                                 text: 'Condición Pago : ',
//                                                 bold:true
//                                             },
//                                             {
//                                                 text: this.arfafp.descripcion,
//                                                 fontSize: 8
//                                             }
//                                         ],
//                                         color: 'black',
//                                         fontSize: 9
//                                     }
//                                 ]
//                             },
//                             {
//                                 columns: [
//                                     {
//                                         width: 160,
//                                         noWrap: false,
//                                         maxHeight: 70,
//                                         text: [
//                                             {
//                                                 text: 'Orden Compra : ',
//                                                 bold:true
//                                             },
//                                             {
//                                                 text: this.detalle.no_SOLIC,
//                                                 fontSize: 8
//                                             }
//                                         ],
//                                         color: 'black',
//                                         fontSize: 9
//                                     },
//                                     {
//                                         width: '*',
//                                         noWrap: false,
//                                         maxHeight: 70,
//                                         text: [
//                                             {
//                                                 text: 'Guía Remisión : ',
//                                                 bold:true
//                                             },
//                                             {
//                                                 text: this.detalle.no_GUIA,
//                                                 fontSize: 8
//                                             }
//                                         ],
//                                         color: 'black',
//                                         fontSize: 9
//                                     },
//                                     {
//                                         width: '*',
//                                         noWrap: false,
//                                         maxHeight: 70,
//                                         text: [
//                                             {
//                                                 text: 'Moneda : ',
//                                                 bold:true
//                                             },
//                                             {
//                                                 text: this.detalle.moneda,
//                                                 fontSize: 8
//                                             }
//                                         ],
//                                         color: 'black',
//                                         fontSize: 9
//                                     },
//                                     {
//                                         width: '*',
//                                         noWrap: false,
//                                         maxHeight: 70,
//                                         text: [
//                                             {
//                                                 text: 'Vendedor : ',
//                                                 bold:true
//                                             },
//                                             {
//                                                 text: this.detalle.cuser,
//                                                 fontSize: 8
//                                             }
//                                         ],
//                                         color: 'black',
//                                         fontSize: 9
//                                     }
//                                 ]
//                             }
//                         ]
//                     ],
//                     margin : [5,6,5,0]
//                     ,
//                     relativePosition: {
//                     x: 0,
//                     y: -56
//                     }
//                 }
//             ]
//         },
//         // 'texto antes de tabla',
//         {
//           margin: [ 0, 5, 0, 0],
//           layout: 'noBorders',
//           table: {
//             headerRows: 1,
//             widths: ['7%', '41%', '5%', '8%','10%', '5%', '7%', '7%','10%'],

//             body: body
//           }
//         },
//         {
//             columns: [
//                 [
//                 {
//                     columns: [
//                         [
//                              {qr: 'pagina de FE qr. k', fit: '60' },
//                              {text: ' '},
//                              {text: 'Representación Impresa de la Factura electrónica',
//                             fontSize: 8}
//                         ],
//                         [
//                             {
//                                 margin: [ 0, 5, 0, 0],
//                                 layout: 'noBorders',
//                                 table: {
//                                   headerRows: 0,
//                                   widths: ['70%', '30%'],
    
//                                   body: bodyDet
//                                 }
//                               }
//                         ]
//                     ],
//                     margin: [10,20,10,15]
//                 },
//                 {
//                     layout: {
//                         hLineWidth: function(i, node) {
//                          return (i === 0 || i === node.table.body.length) ? 0.5 : 0.5;
//                         },
//                         vLineWidth: function(i, node) {
//                          return (i === 0 || i === node.table.widths.length) ? 0.5 : 0.5;
//                         },
//                         hLineColor: function (i, node) {
//                             return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
//                         },
//                         vLineColor: function(i, node) {
//                             return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
//                         }
//                     },
//                     width: 515,
//                     table: {
//                       headerRows: 1,
//                       widths: ['100%'],
//                       body: [
//                           [{text: 'Sus pagos depositar al banco Interbank',
//                           fillColor: '#008CD9',color:'#FFF',bold: true,fontSize: 10}],
//                           [
//                             {
//                                 columns: [
//                                     [{
//                                         text: [
//                                             {
//                                                 text: 'Cuenta en Soles   : ',
//                                                 // bold: true,
//                                                 fontSize: 10
//                                             },
//                                             {   text: '191-2039372-0-16',
//                                             // bold: true,
//                                             fontSize: 10
//                                             }
//                                         ]
//                                     },
//                                     {
//                                         text: [
//                                             {
//                                                 text: 'Cuenta en Dolares  : ',
//                                                 // bold: true,
//                                                 fontSize: 10
//                                             },
//                                             {   text: '191-1985270-1-41',
//                                             // bold: true,
//                                             fontSize: 10
//                                             }
//                                         ]
//                                     }]
//                                 ]
//                             }
//                           ]
//                     ]
//                     }
//                 }
//                 ]
//             ],
//             margin: [40,0]
//         }
//       ],
//       styles: {
//         anotherStyle: {
//         //   italics: true,
//           alignment: 'center',
//           lineWidth: 0.05
//         }
//       }
//     };
//     pdfMake.createPdf(documentDefinition).open();
//   }
}

