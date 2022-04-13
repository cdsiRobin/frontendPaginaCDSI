// new factura .ts component
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatosClienteDTO } from 'src/app/DTO/DatosClienteDTO';
import { Arfacc } from 'src/app/models/arfacc';
import { ArfaccPK } from 'src/app/models/arfaccPK';
import { Arfafe } from 'src/app/models/Arfafe';
import { ArfafePK } from 'src/app/models/ArfafePK';
import { Arfafl } from 'src/app/models/arfafl';
import { arfaflPK } from 'src/app/models/arfaflPK';
import { Arfatp } from 'src/app/models/Arfatp';
import { Arpfoe } from 'src/app/models/Arpfoe';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { ArccmcService } from 'src/app/services/arccmc.service';
import { ArcgtcService } from 'src/app/services/arcgtc.service';
import { ArfaccService } from 'src/app/services/arfacc.service';
import { ArfafeService } from 'src/app/services/arfafe.service';
import { ArfatpService } from 'src/app/services/arfatp.service';
import { ArticuloService } from 'src/app/services/articulo.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { ArfamcService } from 'src/app/services/arfamc.service';
import { Utils } from "../utils";
import { ArfacfService } from 'src/app/services/arfacf.service';
import { ArfafpService } from 'src/app/services/arfafp.service';
import { Arfafp } from 'src/app/models/Arfafp';
import { Arfacfpk } from 'src/app/models/Arfacfpk';
import { ArpffeService } from 'src/app/services/arpffe.service';
import { Arpffe } from 'src/app/models/arpffe';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ArfafpPK } from 'src/app/models/ArfafpPK';
import { Arfcree } from 'src/app/models/Arfcree';
import { Arfcred } from 'src/app/models/Arfcred';
import { ArfcredPK } from 'src/app/models/ArfcredPK';
import { ArfcreePK } from 'src/app/models/ArfcreePK';
import { ArfcreeService } from 'src/app/services/arfcree.service';
import { ConfirmArfafeComponent } from '../confirm-arfafe/confirm-arfafe.component';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { ArcgmoService } from 'src/app/services/arcgmo.service';
import { UtilsArfafe } from '../utils-arfafe/utils-arfafe';
import { PdfArfafe } from '../utils-arfafe/pdf-arfafe';
import { ArcctdaEntity } from 'src/app/models/arcctda-entity';
import { Arccdi } from 'src/app/models/arccdi';
import { Arccpr } from 'src/app/models/arccpr';
import { Arccdp } from 'src/app/models/arccdp';
import { ArtstrdPVenService } from 'src/app/services/artstrdPVen.service';
import { ArtstrdPVen } from 'src/app/models/ArtstrdPVen';
import { MatCheckboxChange } from '@angular/material/checkbox'; 
import { TabSunatFeService } from 'src/app/services/tabSunatFe.service';
import { TabSunatFe } from 'src/app/models/TabSunatFe';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-arfafe-new',
  templateUrl: './arfafe-new.component.html',
  styleUrls: ['./arfafe-new.component.scss']
})
export class NewArfafeComponent implements OnInit {

    detalle:Arfafe = new Arfafe();
    arfacc:Arfacc = new Arfacc();

    arfafpList: Arfafp[];
    arfafp: Arfafp = new Arfafp();
    tipoFp: boolean = true;
    tempFp: string;
    btnFp: boolean = false;
    edtCuote: boolean = true;
    arfcree: Arfcree= new Arfcree();
    xCuota: boolean = true;
    arfcredCuota: string = '';
    arfcredDate: string = '';
    arfcredPrice: number = null;

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
    chkDetrac: boolean = false;
    chkRetenc: boolean = false;
    chkPercep: boolean = false;

    noCia: string;
    noGuia: string;
    noOrden: string;
    tipoDoc: string;
    tipoCambio: number;

    arccdi:Arccdi = new Arccdi();
    arccdp:Arccdp = new Arccdp();
    arccpr:Arccpr = new Arccpr();

    codDetrac: string = '037';
    valDetrac: number = null;
    monDetrac: number = null;
    listDetrac: TabSunatFe[] = [];

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
    private arfcreeService: ArfcreeService,
    private arcgmoService: ArcgmoService,
    private arfamcService: ArfamcService,
    private arccmcService: ArccmcService,
    private artdtrdPVenService: ArtstrdPVenService,
    private tabSunatService: TabSunatFeService,
    public datepipe: DatePipe,
    private router: Router,
    private sb: MatSnackBar,
    private dialog: MatDialog) { }


  ngOnInit(): void {
    this.arfafp.arfafpPK = new ArfafpPK();
    Utils.getImageDataUrlFromLocalPath1('assets/Logo'+sessionStorage.getItem('cia')+'.jpg').then(
        result => this.logoDataUrl = result
    )
    this.arfacc.arfaccPK = new ArfaccPK();
    this.detalle.arfafePK = new ArfafePK();
    this.centroEmisor();
    this.traerData();
    this.tabSunatService.listar('54').subscribe( l => {
        this.listDetrac = l;
        console.log(l);
        this.codDetrac = this.listDetrac[0].codigo;
        this.onChangeDetrac(this.codDetrac);
        // console.log(this.cod);
    });

  }
  public arcctdas: ArcctdaEntity[] = [];
  public arcctda: ArcctdaEntity;

  onChangeDetrac(cod: string){
    for(const o of this.listDetrac){
        if(o.codigo === cod){
            this.valDetrac = +o.valor;
            this.monDetrac = parseFloat(this.trunc(this.totalFactu*this.valDetrac,2));
        }
    }
  }

  traerData(){
      this.route.queryParams.subscribe(p => {
        this.noCia = p['noCia'];
        this.noOrden = p['noOrden'];
        this.noGuia = p['guia'];
        this.pedidoService.pedidoParaFactura(this.noCia, this.noOrden).
          subscribe(d => {
            //   console.log(d);
              this.setArfafe(d);
              this.traerGuia(d.bodega);
            });
      });
  }

  traerGuia(bodega: string){
    this.arpffeService.consultarGuia(this.noCia,bodega,this.noGuia)
    .subscribe( data => {
        this.arpffe = data;
        // console.log(this.arpffe);
    })
  }

  updateGuia(){
    this.arpffe.estado = 'F';
    this.arpffe.tipoDoc = this.detalle.arfafePK.tipoDoc;
    this.arpffe.noFactu = this.detalle.arfafePK.noFactu;

    // console.log(this.arpffe);
    this.arpffeService.guardar(this.arpffe)
    // .subscribe(data => console.log(data), error => console.log(error));
    .subscribe();
  }

  envioDataFE(){
      this.arfafeService.envioParaFE(this.detalle.arfafePK.noCia,
        '001',
        this.detalle.arfafePK.tipoDoc,
        // this.detalle.arfafePK.noFactu).subscribe(data => console.log(data), error => console.log(error));
        this.detalle.arfafePK.noFactu).subscribe();
  }

  confirm(){
      let t: string = '';
      if(this.detalle.arfafePK.tipoDoc === 'F') t = 'Factura';
      else t = 'Boleta';
    if(this.selecc === undefined) {
        const snackBar = this.sb.open('Debe seleccionar una serie','Cerrar',{ duration : 3000});
        snackBar.onAction().subscribe(() => this.sb.dismiss());
    }
    else {
        this.dialog
        .open(ConfirmArfafeComponent, {
            height: '40%',
            width: '80%',
            data: {
                mensaje: `¿Desea crear `+t+`?`,
                detalle: this.detalle
            }
        })
        .afterClosed()
        .subscribe( (data:ArtstrdPVen) => {
        if (data != null) {
            this.addArfafe(data);
            // console.log(data);
        }
        
        });
    }
  }

  addArfafe(o: ArtstrdPVen){

    if(this.selecc === undefined) {
        const snackBar = this.sb.open('Debe seleccionar una serie','Cerrar',{ duration : 3000});
        snackBar.onAction().subscribe(() => this.sb.dismiss());
    }
    else {
        
        if(this.arfafp.arfafpPK.tipoFpago != '20' && this.detalle.arfafePK.tipoDoc === 'B'){
            const snackBar = this.sb.open('Pago con Boleta no permite Cuotas','Entendido',{ duration : 3000});
            snackBar.onAction().subscribe(() => this.sb.dismiss());
        } else {
            if(this.arfafp.arfafpPK.tipoFpago != '20'){
                this.getCuotas();
            }
            
            this.detalle.fecha = new Date();
            this.arfafeService.addArfafe(this.detalle)
            // .subscribe(data => console.log(data), error => console.log(error));
            .subscribe();

            this.updateGuia();

            this.arfaccService.saveArfacc(this.arfacc)
            //.subscribe(data => console.log(data), error => console.log(error));
            .subscribe();

            if(this.arfafp.arfafpPK.tipoFpago != '20'){
                this.arfcreeService.createArfcree(this.arfcree)
                // .subscribe(data => console.log(data), error => console.log(error));
                .subscribe();
            }

            if(o != null){
                this.artdtrdPVenService.save(o).subscribe();
            }

            setTimeout(() => {this.report();
            this.envioDataFE();
            this.router.navigate(['pedido/arfafe/list'])},1000
            );
            } 
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

      this.detalle.fecha_VENCE = new Date();
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
        // this.detalle.codi_PROV = this.arccmc
        this.listaPrecio(arfoe.tipoPrecio);
        // this.TCambio();
        this.detalle.tipo_FPAGO = arfoe.tipoFpago;
        this.detalle.cod_FPAGO = arfoe.codFpago;
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
            if(list.dscto != null) arfafl.p_DSCTO3 = list.dscto;
            else arfafl.p_DSCTO3 = 0;
            arfafl.tipo_BS = list.tipoBs;
            arfafl.imp_IGV = parseFloat(this.trunc(list.impIgv,2));
            arfafl.igv = list.igv;
            this.uniMed.push(list.medida);
            
            arfafl.precio_UNIT = parseFloat(this.trunc(list.precio-(list.precio*(list.dscto/100)),5));

            //arfafl.total = parseFloat(this.trunc((arfafl.precio_UNIT*list.cantEntreg),2));
            arfafl.total = parseFloat(this.trunc(list.totalLin,2));
            arfafl.precio_UNIT_ORIG = parseFloat(this.trunc(list.precio,5));
            arfafl.tipo_AFECTACION = list.tipoAfectacion;
            arfafl.tipo_ARTI = list.tipoArti;
            arfafl.total_LIN = list.totalLin;
            this.detalle.oper_GRAVADAS += parseFloat(this.trunc(arfafl.precio_UNIT*arfafl.cantidad_FACT,2));
            this.detalle.sub_TOTAL += parseFloat(this.trunc((arfafl.cantidad_FACT*arfafl.precio_UNIT),5));
            this.totalFactu += list.totalLin;
            this.totalIGV += arfafl.imp_IGV;
            this.detalle.impuesto += arfafl.imp_IGV;
            this.detalle.arfaflList.push(arfafl);
          }
        );
        this.totalFactu = parseFloat(this.trunc(this.totalFactu,3));
        this.detalle.total = this.totalFactu;
        this.detalle.total_BRUTO = this.totalFactu;
        this.detalle.cajera = sessionStorage.getItem('usuario');
        this.detalle.valor_VENTA = this.detalle.sub_TOTAL;
        this.detalle.m_DSCTO_GLOBAL = 0;
        this.detalle.descuento = 0;
        this.detalle.t_DESCUENTO = 0;
        // this.detalle.total_b
        // console.log(this.detalle);
        
        this.arccmcService.getClientXCodigo(sessionStorage.getItem('cia'),this.detalle.no_CLIENTE).subscribe(data => {
            // console.log(data);
            
            this.listarDepartamento(sessionStorage.getItem('cia'),data.arcctdaEntity[0].codiDepa,
            this.arccmcService);
            this.listarProvincia(sessionStorage.getItem('cia'),data.arcctdaEntity[0].codiDepa,
            data.arcctdaEntity[0].codiProv,
            this.arccmcService);
            this.listarDistrito(sessionStorage.getItem('cia'),data.arcctdaEntity[0].codiDepa,
            data.arcctdaEntity[0].codiProv,data.arcctdaEntity[0].codiDist,this.arccmcService);
        });
      });


    }

    trunc (x, de = 0) {
        return Number(Math.round(parseFloat(x + 'e' + de)) + 'e-' + de).toFixed(de);
      }

    traeCliente() {
      let cli = new DatosClienteDTO(sessionStorage.getItem('cia'));
      // cli.documento = this.detalle.no_CLIENTE;
      cli.id = this.detalle.no_CLIENTE;
    //   console.log(cli);
      this.clienteServices.traeCliente(cli).subscribe(data => {
        this.detalle.direccion = data.arcctdaEntity[0].direccion;
        this.detalle.codi_DEPA = data.arcctdaEntity[0].codiDepa;
        this.detalle.codi_PROV = data.arcctdaEntity[0].codiProv;
        this.detalle.codi_DIST = data.arcctdaEntity[0].codiDist;
        this.detalle.nbr_CLIENTE = data.nombre;
        // console.log(data);
      })
    }

    toogleDivCuotas(){
        
        if(this.selecc === undefined) {
            const snackBar = this.sb.open('Debe seleccionar una serie','Cerrar',{ duration : 3000});
            snackBar.onAction().subscribe(() => this.sb.dismiss());
        } else {
            if(this.arfafp.arfafpPK.tipoFpago === '20'){
                const snackBar = this.sb.open('Forma de pago no necesita cuotas','Entendido',{ duration : 3000});
                snackBar.onAction().subscribe(() => this.sb.dismiss());
            } 
            else if(this.detalle.arfafePK.tipoDoc === 'B'){
                const snackBar = this.sb.open('Pago con Boleta no permite Cuotas','Entendido',{ duration : 3000});
                snackBar.onAction().subscribe(() => this.sb.dismiss());
            } 
            else {
                this.getCuotas();
                this.btnFp = !this.btnFp;
            }
        }
    }

    cerrarDivCuote(){
        let s = 0;
        for(let a of this.arfcree.arfcredList){
            s += a.monto;
        }
        if(this.detalle.total === s) this.btnFp = !this.btnFp;
        else {this.sb.open('Sumatoria de cuotas no coincide con total de factura'
        ,'Cerrar',{ duration : 3000})
        .onAction().subscribe(() => this.sb.dismiss());}
        
    }

    editCuota(){
        // console.log('Entro editCuota - cuota '+c);
        this.edtCuote = !this.edtCuote;
        
        // console.log(this.arfcree.arfcredList);
    }

    createCuota(){
    // console.log(this.arfcredCuota+' - '+ this.arfcredDate+' - '+this.arfcredPrice);
    // this.arfcree.arfcredList = [];
    let rs = moment(this.arfcredDate, 'DD/MM/YYYY',true).isValid();
    
    if(this.arfcredCuota === '' || this.arfcredDate === '' || this.arfcredPrice === null) {
        this.sb.open('Llenar todos los datos'
        ,'Cerrar',{ duration : 3000})
        .onAction().subscribe(() => this.sb.dismiss());
    } else {
    let d: Arfcred = new Arfcred();
    d.arfcredPk = new ArfcredPK();
    d.arfcredPk.noCia = this.detalle.arfafePK.noCia;
    d.arfcredPk.noCliente = this.detalle.no_CLIENTE;
    d.arfcredPk.noOrden = this.detalle.arfafePK.noFactu;
    d.arfcredPk.noCredito = this.arfcredCuota;
    // d.tiempoPago = c[i];
    d.monto = this.arfcredPrice
    // e.setDate(e.getDate()+c[i]);
    // d.fechaPago = this.datepipe.transform(e,'dd/MM/yyyy');
    d.fechaPago = this.arfcredDate;
    // g.push(d);
    console.log(d);
    console.log(this.arfcree.arfcredList);
    this.arfcree.arfcredList.push(d);

    this.arfcredCuota = 'Cuota00'+(this.arfcree.arfcredList.length+1);
    this.arfcredDate = '';
    this.arfcredPrice = null;
    }
    }

    getCuotas(){
        let a: number = -1;
        let b: Arfafp = new Arfafp();
        let tempd: ArfcreePK = new ArfcreePK();
        let e: Date = new Date();
        this.xCuota = true;
        let g: Arfcred[] = [];
        tempd.noCia = this.detalle.arfafePK.noCia;
        tempd.noOrden = this.detalle.arfafePK.noFactu;
        tempd.noCliente = this.detalle.no_CLIENTE;
        b = this.arfafp;
        let c: number[] = [b.plazo,b.plazo2,b.plazo3,b.plazo4,b.plazo5,b.plazo6,b.plazo7,b.plazo8,
        b.plazo9,b.plazo10,b.plazo11,b.plazo12];

        this.arfcree.arfcreePk = tempd;
         if (c[0] != null && this.arfcree.arfcredList.length === 0) this.arfcree.arfcredList = [];
        
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
        if(g.length === 0){
            this.xCuota = !this.xCuota;
            this.arfcredCuota = 'Cuota00'+(this.arfcree.arfcredList.length+1);
        }
        if (g.length > 0 && this.arfcree.arfcredList.length === 0) this.arfcree.arfcredList = g;

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
        
    }

    onChangeFP(){
        this.arfafp = new Arfafp();
        this.arfafp.arfafpPK = new ArfafpPK();
        for(const l of this.arfafpList){
            if(l.arfafpPK.codFpago === this.tempFp){
                this.arfafp = l;
                this.detalle.tipo_FPAGO =l.arfafpPK.tipoFpago;
                this.detalle.cod_FPAGO = l.arfafpPK.codFpago;
                
                this.arfcree = new Arfcree();
                this.arfcree.arfcreePk = new ArfcreePK();
                this.arfcree.arfcredList = [];
                
            }
        }
    }

    public formaPago(cod: string){
        this.arfafpservice.listarFPFactu(sessionStorage.getItem('cia'),'A').subscribe(data => {
            this.arfafpList = data.resultado;
            // console.log(data);
            this.tempFp = cod;
            this.onChangeFP();
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

public listarDistrito(cia:string, depa:string, prov:string,dist:string,arccmcService: ArccmcService): void{
  arccmcService.listarDistritoXciaAndDepartAndProvinc
  (cia,depa,prov)
  .subscribe( data => {
    //   console.log(data);
    for (const t of data) {
      if (t.arccdiPK.codiDist === dist) {
          this.arccdi = t;
        //   console.log(this.arccdi);
          break;
      }
    }
  });
 }

 public listarProvincia(cia:string, depa:string,prov:string,arccmcService: ArccmcService): void{
  arccmcService.listarProvincXciaAndDepart(cia,depa).subscribe( data => {
    // console.log(data);
    for (const t of data) {
      if (t.arccprPK.codiProv === prov) {
          this.arccpr = t;
        //   console.log(this.arccpr);
          break;
      }
    }
  });
}

  public listarDepartamento(cia:string, depa:string,arccmcService: ArccmcService){
  arccmcService.listarDepartXcia(cia).subscribe( data =>{
      for(const o of data){
          if(o.arccdpPK.codiDepa === depa){
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
                
            this.arfamcService.buscarId(sessionStorage.getItem('cia')).subscribe(rs => {
                
                if(this.arfafp.arfafpPK.tipoFpago === "20")
                new PdfArfafe().ProperDesing(rs,this.detalle,this.uniMed,this.arfafp,this.datepipe, txt,false,new Arfcree(),this.arccdi,this.arccdp,this.arccpr);    
                else
                new PdfArfafe().ProperDesing(rs,this.detalle,this.uniMed,this.arfafp,this.datepipe, txt,true, this.arfcree,this.arccdi,this.arccdp,this.arccpr); 
                                
            });
            }
        })
    });
      
  }

  }

