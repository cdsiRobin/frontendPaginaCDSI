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
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-detail-arfafe',
  templateUrl: './detail-arfafe.component.html',
  styleUrls: []
})

export class DetailArfafeComponent implements OnInit {

    tipoComprobante: string = 'Factura';
    detalle:Arfafe = new Arfafe();
    arfacc:Arfacc = new Arfacc();
    arfafp: Arfafp = new Arfafp();
    arfatp: Arfatp = new Arfatp();
    cia: string;
    doc: string;
    fact: string;
    tipoCambio: number;
    logoDataUrl: string;
    nomCentro: string;
    centro: string = sessionStorage.getItem('centro');
    totalIGV:number = 0;

  constructor(private route: ActivatedRoute,
    private arfafeService: ArfafeService,
    public clienteServices: ArccmcService,
    private arcgtcService: ArcgtcService,
    private arfatpService: ArfatpService,
    private arfafpservice: ArfafpService,
    private arfacfservice: ArfacfService,
    public datepipe: DatePipe) { }

  ngOnInit(): void {
    this.cargar();      
    Utils.getImageDataUrlFromLocalPath1('assets/Logo2.jpg').then(
      result => this.logoDataUrl = result
    )
  }

  cargar(){
    this.route.queryParams.subscribe(p => {
      this.cia = p['nocia'];
      this.doc = p['docu'];
      this.fact = p['factura'];
      if(this.doc == 'B') this.tipoComprobante = 'Boleta';
      this.arfafeService.arfafeDetalle(new ArfafeDTO(this.cia,this.doc,this.fact))
      .subscribe(a => {
          this.detalle = a.resultado;
          this.traeCliente();
          this.formaPago(a.resultado.cod_FPAGO);
          this.listaPrecio(a.resultado.tipo_PRECIO);
          this.TCambio();
          this.cargarExtras();
          console.log(a.resultado);
          console.log(a.resultado.arfaflList);
        }
      )
    });
    this.centroEmisor();
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
            {text: 0.00, bold: false, fontSize: 8, alignment: 'right'},
            {text: l.imp_IGV, bold: false, fontSize: 8, alignment: 'right'},
            {text: l.total, bold: false, fontSize: 8, alignment: 'right'}
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

