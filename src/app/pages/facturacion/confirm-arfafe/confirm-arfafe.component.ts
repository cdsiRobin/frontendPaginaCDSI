import { DatePipe } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Arfafe } from 'src/app/models/Arfafe';
import { Artsopp } from 'src/app/models/Artsopp';
import { ArtstrdPVen } from 'src/app/models/ArtstrdPVen';
import { ArtstrdPVenPK } from 'src/app/models/ArtstrdPVenPK';
import { Artsttropi } from 'src/app/models/Artsttropi';
import { ArtstrdPVenService } from 'src/app/services/artstrdPVen.service';

@Component({
  selector: 'app-confirm-arfafe',
  templateUrl: './confirm-arfafe.component.html',
  styleUrls: []
})
export class ConfirmArfafeComponent implements OnInit {

  arfafe: Arfafe = new Arfafe();
  artstrdPven: ArtstrdPVen = new ArtstrdPVen();
  artsopp: Artsopp[] = [];
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

  constructor(
    public dialogo: MatDialogRef<ConfirmArfafeComponent>,
    private artdtrdPVenService: ArtstrdPVenService,
    public datepipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: {mensaje: string, detalle: Arfafe}) { 
      this.arfafe = data.detalle;
    }

    close(): void {
      this.dialogo.close();
      // this.fillSelect();
      // console.log(this.artsopp);
      // console.log(this.artsttropi);
      // console.log(this.tmpOP);
    }
    confirm(): void {
      this.confirmFormaPago();
      this.dialogo.close(this.artstrdPven);
    }

    fillSelect(): void {
      // console.log(this.artsopp.length+' - '+this.artsttropi.length);
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
      // console.log(this.artsopp);
      // console.log(this.tempSelec);
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
      });
      });
    }

    llenarData(): void{
      if(this.arfafe.moneda === 'SOL') {this.sol = this.arfafe.total; this.xMon = true;}  
      else {this.dol = this.arfafe.total;this.convDol = this.dol*this.arfafe.tipo_CAMBIO; this.xMon = false;}

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
    this.artstrdPven.impSol = this.sol;
    this.artstrdPven.vuelto = this.vuelto;
    // console.log(this.artstrdPven);
  }

  ngOnInit() {
    this.cargar();
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