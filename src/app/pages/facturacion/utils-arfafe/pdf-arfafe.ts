import { DatePipe } from '@angular/common';
import pdfMake from 'pdfmake/build/pdfmake';
import { Arccdi } from 'src/app/models/arccdi';
import { Arccdp } from 'src/app/models/arccdp';
import { Arccpr } from 'src/app/models/arccpr';
import { Arfafe } from 'src/app/models/Arfafe';
import { Arfafp } from 'src/app/models/Arfafp';
import { Arfamc } from 'src/app/models/arfamc';
import { Arfcree } from 'src/app/models/Arfcree';
import { ArccmcService } from 'src/app/services/arccmc.service';
import { Utils } from "../utils";

export class PdfArfafe {


    trunc (x, de = 0) {
        return Number(Math.round(parseFloat(x + 'e' + de)) + 'e-' + de).toFixed(de);
    }

    PriceFormat = (number) => {
        const exp = /(\d)(?=(\d{3})+(?!\d))/g;
        const rep = '$1,';
        let arr = number.toString().split('.');
        arr[0] = arr[0].replace(exp,rep);
        return arr[1] ? arr.join('.'): arr[0];
      }
    
  ProperDesing(arfamc: Arfamc, 
    detalle: Arfafe,
    uniMed: string[],
    arfafp:Arfafp,
    datepipe: DatePipe,
    txt: string,
    xCuote: boolean,
    arfcree: Arfcree,
    arccdi:Arccdi,
    arccdp:Arccdp,
    arccpr:Arccpr,
  ) {
    var body = [];
    let totalIGV = 0;
    let logoDataUrl = ''; 
    let doc = '';
    if(detalle.arfafePK.tipoDoc === 'F') doc = 'FACTURA';
    else doc = 'BOLETA';
    Utils.getImageDataUrlFromLocalPath1('assets/Logo'+sessionStorage.getItem('cia')+'.jpg').then(
        result => {logoDataUrl = result;
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
        detalle.arfaflList.forEach(l => {
            totalIGV += l.imp_IGV;
            body.push(
                [
                {text: l.no_ARTI, bold: false, fontSize: 7,lineHeight: 0.8},
                {text: l.descripcion, bold: false, fontSize: 7, lineHeight: 0.8},
                {text: uniMed[l.arfaflPK.consecutivo], bold: false, fontSize: 8},
                {text: l.cantidad_ENTR, bold: false, fontSize: 7, alignment: 'right'},
                {text: this.PriceFormat(this.trunc(l.precio_UNIT_ORIG,5)), bold: false, fontSize: 7, alignment: 'right'},
                {text: l.p_DSCTO3, bold: false, fontSize: 7, alignment: 'right'},
                {text: 0.00, bold: false, fontSize: 7, alignment: 'right'},
                {text: l.imp_IGV.toFixed(2), bold: false, fontSize: 7, alignment: 'right'},
                {text: this.PriceFormat(this.trunc(l.total.toFixed(2),2)), bold: false, fontSize: 7, alignment: 'right'}
                ]
            );
          });
        var bodyDet = [];
        bodyDet.push([
            {text: 'Descuento Global',margin:[2,0,0,0], bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'},
            {
                columns: [
                    {text: 'S/ ', alignment: 'left'},
                    {text: this.PriceFormat(this.trunc(detalle.descuento,2)), alignment: 'right'}
                ],
                bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF',
                margin: [0,0,5,0]
            }
            // {text: [
            //     {text: 'S/ ', alignment: 'left'},
            //     {text: detalle.descuento, alignment: 'right'}],
            //      bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'}
        ]);
        bodyDet.push([
            {text: 'Total Valor Venta - Operaciones Gravadas:',margin:[2,0,0,0], bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'},
            // {text: 'S/ '+detalle.oper_GRAVADAS, bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'}
            {
                columns: [
                    {text: 'S/ ', alignment: 'left'},
                    {text: this.PriceFormat(this.trunc(detalle.oper_GRAVADAS,2)), alignment: 'right'}
                ],
                bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF',
                margin: [0,0,0,0]
            }
        ]);
        bodyDet.push([
            {text: 'ICBPER',margin:[2,0,0,0], bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'},
            // {text: 'S/ 0', bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'}
            {
                columns: [
                    {text: 'S/ ', alignment: 'left'},
                    {text: '0.00', alignment: 'right'}
                ],
                bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF',
                margin: [0,0,5,0]
            }
        ]);
        bodyDet.push([
            {text: 'IGV',margin:[2,0,0,0], bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'},
            // {text: 'S/ '+this.totalIGV, bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'}
            {
                columns: [
                    {text: 'S/ ', alignment: 'left'},
                    {text: this.PriceFormat(this.trunc(totalIGV,2)), alignment: 'right'}
                ],
                bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF',
                margin: [0,0,5,0]
            }
        ]);
        bodyDet.push([
            {text: 'Importe Total',margin:[2,0,0,0], bold: true, fontSize: 9,fillColor: '#008CD9',color:'#FFF'},
            // {text: 'S/ '+detalle.total, bold: true, fontSize: 9,fillColor: '#008CD9',color:'#FFF'}
            {
                columns: [
                    {text: 'S/ ', alignment: 'left'},
                    {text: this.PriceFormat(this.trunc(detalle.total,2)), alignment: 'right'}
                ],
                bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF',
                margin: [0,0,5,0]
            }
        ]);
        bodyDet.push([
            {text: 'Redondeo',margin:[2,0,0,0], bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'},
            // {text: 'S/ 0', bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'}
            {
                columns: [
                    {text: 'S/ ', alignment: 'left'},
                    {text: '0.00', alignment: 'right'}
                ],
                bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF',
                margin: [0,0,5,0]
            }
        ]);
        bodyDet.push([
            {text: 'Descuentos Totales',margin:[2,0,0,0], bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'},
            // {text: 'S/.'+detalle.descuento, bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF'}
            {
                columns: [
                    {text: 'S/ ', alignment: 'left'},
                    {text: this.PriceFormat(this.trunc(detalle.descuento,2)), alignment: 'right'}
                ],
                bold: true, fontSize: 8,fillColor: '#008CD9',color:'#FFF',
                margin: [0,0,5,0]
            }
        ]);

        var cuote;
        if(!xCuote) cuote = { text: ''};
        else {
            var tbCuote = [];
            tbCuote.push(
                [
                    {text: 'cuota' ,fontSize: 6, alignment: 'center', bold: true},
                    {text: 'Vto' ,fontSize: 6, alignment: 'center', bold: true},
                    {text: 'monto' ,fontSize: 6, alignment: 'center', bold: true}
                ]
            );
            arfcree.arfcredList.forEach( obj => {
                tbCuote.push(
                    [
                        {text: obj.arfcredPk.noCredito, fontSize: 6, alignment: 'left'},
                        {text: obj.fechaPago,fontSize: 6, alignment: 'center'},
                        {text: this.PriceFormat(this.trunc(obj.monto,2)), fontSize: 6, alignment: 'right'}
                    ]
                )
            })
            cuote = {
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
                width: 135,
                table: {
                headerRows: 1,
                widths: [45,45,45],
                body: tbCuote
                },
                style: 'anotherStyle'
                };
        }
    
        const documentDefinition = {
        pageMargins: [40, 20, 40, 600],
        footer: {
            columns: [
                [
                    {
                        columns: [
                            [
                            {
                                columns: [
                                    [
                                         {text: txt, fontSize: 8},
                                        //  {text: ' '},
                                        { columns:[
                                            {
                                                width: '25%',  
                                                qr: 'pagina de FE qr. k', 
                                                fit: '60' 
                                            },
                                            cuote ],
                                            margin: [0,5]
                                        },
                                        //  {text: ' '},
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
                                margin: [10,20,10,2]
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
                                      [{text: 'Sus pagos depositar al banco Interbank',
                                      fillColor: '#008CD9',color:'#FFF',bold: true,fontSize: 9}],
                                      [
                                        {
                                            columns: [
                                                [{
                                                    text: [
                                                        {
                                                            text: 'Cuenta en Soles      : ',
                                                            // bold: true,
                                                            fontSize: 9
                                                        },
                                                        {   text: arfamc.cuentaSol,
                                                        // bold: true,
                                                        fontSize: 9
                                                        }
                                                    ]
                                                },
                                                {
                                                    text: [
                                                        {
                                                            text: 'Cuenta en Dolares  : ',
                                                            // bold: true,
                                                            fontSize: 9
                                                        },
                                                        {   text: arfamc.cuentaDol,
                                                        // bold: true,
                                                        fontSize: 9
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
                        ]
                    }
                ]
            ],
            margin: [40, 0]
        },
                content: [
            //   {qr: 'text'},
            {
                columns: [
                    {
                        width: 50,
                        height: 70,
                        image: logoDataUrl
                    },
                    [
                        {
                            width: 350,
                            noWrap: false,
                            maxHeight: 70,
                            text: arfamc.nombre,
                            color: 'black',
                            // fontSize: 11,
                            alignment: 'center',
                            bold: true
                        },
                        {
                            width: 350,
                            noWrap: false,
                            maxHeight: 70,
                            text: arfamc.descripcion,
                            color: 'black',
                            fontSize: 9,
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
                                    text: arfamc.email,
                                    fontSize: 8
                                },
                                {text : '               '},
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
                              [{text: doc+' ELECTRÓNICA',fillColor: '#008CD9',color:'#FFF',bold: true}],
                              [
                                {
                                    text: 'RUC: '+arfamc.ruc+' '+detalle.arfafePK.noFactu,
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
                                h: 50,
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
                                                    text: detalle.nbr_CLIENTE,
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
                                                    text: detalle.no_CLIENTE,
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
                                            text: [
                                                {text: detalle.direccion},
                                                {text: ', '+arccdi.descDist},
                                                {text: ', '+arccpr.descProv},
                                                {text: ', '+arccdp.descDepa}
                                            ],
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
                                                    text: datepipe.transform(detalle.fecha,'dd/MM/yyyy'),
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
                                                    text: arfafp.descripcion,
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
                                                    text: detalle.no_SOLIC,
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
                                                    text: 'Pedido : ',
                                                    bold:true
                                                },
                                                {
                                                    text: detalle.no_ORDEN,
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
                                                    text: detalle.moneda,
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
                                                    text: detalle.cuser,
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
                        margin : [5,10,5,-8]
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
            //   margin: [ 0, 1, 0, 0],
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

    
    );
  }
}