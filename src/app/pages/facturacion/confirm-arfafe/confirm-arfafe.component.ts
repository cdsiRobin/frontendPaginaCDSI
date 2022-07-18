import { DatePipe } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Arcktb } from 'src/app/models/Arcktb';
import { Arfafe } from 'src/app/models/Arfafe';
import { Artsopp } from 'src/app/models/Artsopp';
import { Artstar } from 'src/app/models/Artstar';
import { ArtstrdPVen } from 'src/app/models/ArtstrdPVen';
import { ArtstrdPVenPK } from 'src/app/models/ArtstrdPVenPK';
import { Artsttropi } from 'src/app/models/Artsttropi';
import { ArcgtcService } from 'src/app/services/arcgtc.service';
import { ArcktbService } from 'src/app/services/arcktb.service';
import { ArtstarService } from 'src/app/services/artstar.service';
import { ArtstrdPVenService } from 'src/app/services/artstrdPVen.service';

@Component({
  selector: 'app-confirm-arfafe',
  templateUrl: './confirm-arfafe.component.html',
  styleUrls: ['./confirm-arfafe.component.scss']
})
export class ConfirmArfafeComponent implements OnInit {

  arfafe: Arfafe = new Arfafe();
  artstrdPven: ArtstrdPVen = new ArtstrdPVen();
  artsopp: Artsopp[] = [];
  artstar: Artstar[] = [];
  arcktb: Arcktb[] = [];
  artsttropi: Artsttropi[] = [];
  tmpOP: TempOperPago[] = [];
  tempSelec: TempOperPago = new TempOperPago();

  selecc = 0;
  dol = null;
  convDol = null;
  sol = null;
  impCaja = null;
  vuelto = this.impCaja- this.sol;
  xMon: boolean = true;
  chkTarjeta: boolean = false;
  cTarj: string = '';
  numDoc: string = '';
  ePago: string = '';
  monSol: boolean = false;
  monDol: boolean = false;
  ePay = '';
  cambio3: number = null;  

  constructor(
    public dialogo: MatDialogRef<ConfirmArfafeComponent>,
    private artdtrdPVenService: ArtstrdPVenService,
    private artstarService: ArtstarService,
    private arcktbService: ArcktbService,
    private arcgtcService: ArcgtcService,
    public datepipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: {mensaje: string, detalle: Arfafe}) { 
      this.arfafe = data.detalle;
    }

    close(): void {
      this.dialogo.close();
    }

    confirm(): void {
      this.confirmFormaPago();
      this.dialogo.close(this.artstrdPven);
    }

    fillSelect(): void {
      let n = 0;
      for(let i= 0; i<this.artsopp.length;i++){
        for(let j = 0; j<this.artsttropi.length; j++){
            if(this.artsopp[i].artsoppPk.tipoOper === this.artsttropi[j].artsttropiPK.tipoOperItem &&
              this.artsopp[i].artsoppPk.codOper === this.artsttropi[j].artsttropiPK.codOperItem &&
              this.artsttropi[j].artsttropiPK.tipoM === this.arfafe.cod_T_PED &&
              this.artsopp[i].estado === 'A'){
                let o:TempOperPago = new TempOperPago();
                o.id = n;
                o.tipoOper = this.artsttropi[j].artsttropiPK.tipoOperItem;
                o.codOper = this.artsttropi[j].artsttropiPK.codOperItem;
                o.descrip = this.artsopp[i].descripcion;
                o.clasTransc = this.artsttropi[j].claseTransc;
                this.tmpOP.push(o);
                n++;
            }
        }
      }
      for(let i=0; i<this.tmpOP.length;i++){
        if(this.tmpOP[i].codOper === 'EF'){
          this.selecc = this.tmpOP[i].id;
        }
      }
      for(let i=0; i<this.tmpOP.length;i++){
        if(this.tmpOP[i].id === this.selecc){
          this.tempSelec = this.tmpOP[i];
        }
      }
    }

    cargar(): void {
      this.artdtrdPVenService.listArtsopp(sessionStorage.getItem('cia'))
      .subscribe(l =>{
        this.artsopp = l;
        this.artdtrdPVenService.listArtsttropi(sessionStorage.getItem('cia'))
      .subscribe(list => {
        this.artsttropi = list;
        this.fillSelect();
        this.llenarData();
        this.buscarTipoCambio();
      });
      });
      this.artstarService.listar(sessionStorage.getItem('cia')).subscribe(l => this.artstar = l);
      this.arcktbService.listar().subscribe(l =>this.arcktb = l);
    }

    llenarData(): void{
      if(this.arfafe.moneda === 'SOL') {
        this.sol = this.arfafe.total; this.xMon = true; this.monSol = true; this.ePay = 'SOL';
      }  
      else {
        this.dol = this.arfafe.total;this.convDol = this.dol*this.arfafe.tipo_CAMBIO;
         this.xMon = false; this.monDol = true; this.ePay = 'DOL';
        }

      this.impCaja = this.arfafe.total;

    }

  confirmFormaPago(){
    this.artstrdPven.artstrdPVenPK = new ArtstrdPVenPK();
    this.artstrdPven.artstrdPVenPK.noCia = this.arfafe.arfafePK.noCia;
    this.artstrdPven.artstrdPVenPK.noFactu = this.arfafe.arfafePK.noFactu;
    this.artstrdPven.artstrdPVenPK.tipoDoc = this.arfafe.arfafePK.tipoDoc;
    this.artstrdPven.artstrdPVenPK.noLinea = "1";
    
    this.artstrdPven.claseTransc = this.tmpOP[this.selecc].clasTransc;
    this.artstrdPven.tipoM = this.arfafe.cod_T_PED;
    this.artstrdPven.tAcc = "1";
    this.artstrdPven.codEntidad = this.arfafe.no_CLIENTE;
    this.artstrdPven.fecha = this.datepipe.transform(new Date(),'dd/MM/yyyy');
    this.artstrdPven.importe = this.impCaja;
    this.artstrdPven.tipoCabaOri = 'C';
    this.artstrdPven.codCabaOri = 'C12';
    this.artstrdPven.tipoCabaDes = 'C';
    this.artstrdPven.codCabaDes = 'C12';
    this.artstrdPven.tipoOper = this.tempSelec.tipoOper;
    this.artstrdPven.codOper = this.tempSelec.codOper;

    if ( this.arfafe.moneda === 'SOL' ){
      if( this.ePay === 'SOL' ){
        this.artstrdPven.impSol = this.sol;
        this.artstrdPven.vuelto = this.vuelto;
      }
      else {
        this.artstrdPven.impDol = +this.trunc(this.arfafe.total/this.cambio3);
        this.artstrdPven.vuelto = this.vuelto;
      }
    }
    else {
      if( this.ePay === 'DOL') {
        this.artstrdPven.impDol = this.dol;
        this.artstrdPven.vuelto = this.vuelto;
      }
      else {
        this.artstrdPven.impSol = +this.trunc(this.arfafe.total*this.cambio3);
        this.artstrdPven.vuelto = this.vuelto;
      }
    }
    /*this.artstrdPven.impDol = this.dol;
    this.artstrdPven.impSol = this.sol;
    this.artstrdPven.vuelto = this.vuelto;*/

    if( this.chkTarjeta ){

      this.artstrdPven.codBanco = this.ePago;
      this.artstrdPven.claseTarj = this.cTarj;
      this.artstrdPven.noDocuParteDiario = this.numDoc;

    }
  }

  buscarTipoCambio(){
    const date = new Date();
    const day = `${(date.getDate())}`.padStart(2, '0');
    const month = `${(date.getMonth() + 1)}`.padStart(2, '0');
    const year = date.getFullYear();

    this.arcgtcService.getTipoCambioClaseAndFecha('03', `${day}/${month}/${year}`).subscribe(json => {
         this.cambio3 = +json.resultado;
         //this.tipocambio = this.arcgtc.tipoCambio;
    
    }, error =>
    {this.cambio3 = this.arfafe.tipo_CAMBIO-0.05; }
    );
  }

  ngOnInit() {
    this.cargar();
  }

  onItemChange(value){
    this.ePay = value;
    this.onChangeCajaValue();
    // console.log(this.ePay);
 }

 trunc (x, de = 0) {
  return Number(Math.round(parseFloat(x + 'e' + de)) + 'e-' + de).toFixed(de);
}

  onChangeCajaValue(){
    if(this.arfafe.moneda === 'SOL'){
      if(this.ePay === 'SOL'){
        this.vuelto = this.impCaja - this.arfafe.total;
        this.vuelto = +this.trunc(this.vuelto,2);
      }
      else {
        this.vuelto = this.impCaja - (this.arfafe.total/this.cambio3);
        this.vuelto = +this.trunc(this.vuelto,2);
      }
    }
    else if(this.arfafe.moneda === 'DOL'){
      if(this.ePay === 'DOL'){
        this.vuelto = this.impCaja - this.arfafe.total;
        this.vuelto = +this.trunc(this.vuelto,2);
      }
      else {
        this.vuelto = this.impCaja - (this.arfafe.total*this.cambio3);
        this.vuelto = +this.trunc(this.vuelto,2);
      }
    }
    
  }

  onCheckTarjeta(){
    this.impCaja = this.arfafe.total;
    if(this.xMon === true) { this.sol = this.arfafe.total; this.dol = null; this.convDol = null;}
    else {this.dol = this.arfafe.total;this.convDol = this.dol*this.arfafe.tipo_CAMBIO; this.sol=null;}
    this.vuelto = null;
    this.cTarj = '';
    this.numDoc = '';
    this.ePago = '';
  
  }

}

export class TempOperPago {
  id: number;
  tipoOper: string;
  codOper : string;
  descrip : string;
  clasTransc: string;
  constructor(){}
}