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
import { Tapfopa } from 'src/app/models/tapfopa';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { ArccmcService } from 'src/app/services/arccmc.service';
import { ArcgtcService } from 'src/app/services/arcgtc.service';
import { ArfaccService } from 'src/app/services/arfacc.service';
import { ArfafeService } from 'src/app/services/arfafe.service';
import { ArfatpService } from 'src/app/services/arfatp.service';
import { ArticuloService } from 'src/app/services/articulo.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { TapfopaService } from 'src/app/services/tapfopa.service';
import { Utils } from "../utils";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-arfafe-new',
  templateUrl: './arfafe-new.component.html',
  styleUrls: []
})
export class NewArfafeComponent implements OnInit {

    detalle:Arfafe = new Arfafe();
    arfacc:Arfacc = new Arfacc();
    tapfopa: Tapfopa = new Tapfopa();
    arfatp: Arfatp = new Arfatp();
    cia: string;
    doc: string;
    fact: string;
    logoDataUrl: string;

  totalFactu:number = 0;

  noCia: string;
  noOrden: string;
  tipoDoc: string;
  tipoCambio: number;


  constructor(public pedidoService: PedidoService,
    private route: ActivatedRoute,
    public clienteServices: ArccmcService,
    public arindaService: ArticuloService,
    private arfafeService: ArfafeService,
    private arfaccService: ArfaccService,
    private tapfopaService: TapfopaService,
    private arcgtcService: ArcgtcService,
    private arfatpService: ArfatpService,
    public datepipe: DatePipe,
    private router: Router) { }


  ngOnInit(): void {
    Utils.getImageDataUrlFromLocalPath1('assets/Logo2.jpg').then(
    result => this.logoDataUrl = result
  )
    this.route.queryParams.subscribe(p => {
      let idArpfoe: IdArpfoe = new IdArpfoe();
      this.noCia = p['noCia'];
      this.noOrden = p['noOrden'];
      // this.tipoArfafe = p['tipoA'];
      idArpfoe.noCia = this.noCia;
      idArpfoe.noOrden = this.noOrden;
      console.log(idArpfoe);
      this.pedidoService.pedidoParaFactura(idArpfoe).pipe(
        map((response: Infor<Arpfoe>) => response.resultado)).
        subscribe(d => {console.log(d);this.setArfafe(d)});
    });
  }

  traerData(){
      let idArpfoe: IdArpfoe = new IdArpfoe();
      this.route.queryParams.subscribe(p => {
        this.noCia = p['noCia'];
        this.noOrden = p['noOrden'];
        idArpfoe.noCia = this.noCia;
        idArpfoe.noOrden = this.noOrden;
        this.pedidoService.pedidoParaFactura(idArpfoe).pipe(
          map((response: Infor<Arpfoe>) => response.resultado)).
          subscribe(d => {console.log(d);this.setArfafe(d)});
      });
  }
  addArfafe(){

    this.detalle.fecha = new Date();

    this.arfafeService.addArfafe(this.detalle)
    .subscribe(data => console.log(data), error => console.log(error));

    this.arfaccService.saveArfacc(this.arfacc)
    .subscribe(data => console.log(data), error => console.log(error));

    setTimeout(() => {this.ProperDesing();
      this.router.navigate(['pedido/arfafe/list'])},1000
    );
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
      corre.activo = 'S';

      this.arfaccService.getSerieAndCorrelativoPedido(corre).subscribe(d => {

        this.arfacc = d[0];

        //creacion llave primaria
        this.detalle.arfafePK = new ArfafePK();

        this.detalle.arfafePK.noCia = sessionStorage.getItem('cia');
        //creacion correlativo
        let correlativo = '0000000';
        let cortar = d[0].consDesde.toString().length  * -1;
        this.detalle.arfafePK.noFactu = d[0].arfaccPK.serie+correlativo.slice(0,cortar)+d[0].consDesde;
        // this.detalle.arfafePK.noFactu = 'F0010002212';
        this.detalle.arfafePK.tipoDoc = this.tipoDoc;

        //insercion data adicional
        this.detalle.ind_PVENT = arfoe.indPvent;
        this.detalle.no_ORDEN = arfoe.arpfoePK.noOrden;
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
        this.detalle.num_DOC_CLI = arfoe.numDocCli;
        this.detalle.alm_DESTINO = arfoe.almaDestino;
        this.detalle.bodega = arfoe.bodega;
        this.detalle.centro = arfoe.centro;
        this.detalle.centro_COSTO = arfoe.centroCosto;
        this.detalle.cod_CAJA = arfoe.codCaja;

        this.listaPrecio(arfoe.tipoPrecio);
        this.TCambio();
        this.formaPago(arfoe.tipoFpago);
        //detalle productos
        this.detalle.arfaflList = [];
        arfoe.arpfolList.forEach(
          list => {
            let arfafl: Arfafl = new Arfafl();
            arfafl.arfaflPK = new arfaflPK();
            arfafl.arfaflPK.noCia = this.detalle.arfafePK.noCia;
            arfafl.arfaflPK.tipoDoc = this.detalle.arfafePK.tipoDoc;
            arfafl.arfaflPK.noFactu = this.detalle.arfafePK.noFactu;
            arfafl.arfaflPK.consecutivo = list.noLinea;
            arfafl.no_ARTI = list.arpfolPK.noArti;
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


      });

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
    let list: Tapfopa[] = [];
     this.tapfopaService.listarFormaPagoCiaAndEstado(sessionStorage.getItem('cia'),'A').subscribe(data => {
        list = data.resultado;
        for (const l of list) {
          if (l.tapfopaPK.codFpago === cod) {
            this.tapfopa = l;
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
            {text: 'UND', bold: false, fontSize: 8},
            {text: l.cantidad_ENTR, bold: false, fontSize: 8, alignment: 'right'},
            {text: l.precio_UNIT, bold: false, fontSize: 8, alignment: 'right'},
            {text: l.p_DSCTO3, bold: false, fontSize: 8, alignment: 'right'},
            {text: l.oper_INAFECTAS, bold: false, fontSize: 8, alignment: 'right'},
            {text: l.imp_IGV, bold: false, fontSize: 8, alignment: 'right'},
            {text: l.total, bold: false, fontSize: 8, alignment: 'right'}
            ]
        );
      });
    const documentDefinition = {
      content: [
        //   {qr: 'text'},
        {
            columns: [
                {
                    width: 70,
                    height: 100,
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
                                text: 'WWW.HS-IMPORT.COM',
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
                                text: 'VENTAS@HS-IMPORT.COM',
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
                                text: '01 3545576 / 983537208',
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
                                text: 'AV. SANTA ANA MZ A 33 LT:36 CULTURA PERUANA MODERNA (SANTA ANITA) - SANTA ANITA - LIMA - LIMA',
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
                                text: 'RUC: '+this.detalle.no_CLIENTE+' '+this.detalle.arfafePK.noFactu,
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
                                                text: this.tapfopa.descripcion,
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

