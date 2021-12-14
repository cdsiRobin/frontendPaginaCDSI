import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { Arfafe } from "src/app/models/Arfafe";
import { ArfafeService } from "src/app/services/arfafe.service";


const ELEMENT_DATA: Arfafe[] = [];

@Component({
  selector: 'app-list-arfafe',
  templateUrl: './list-arfafe.component.html',
  styleUrls: []
})

export class ListArfafeComponent implements OnInit {

  cia: string= '01';
  compania: string = 'Nombre de compañia';
  centroEmi: string = 'Centro';
  public ConEstado = 'All';
  public ConCosto = 'Central';
  tipoDoc = 'F';
  factu= '';
  pven= true;
  spin= false;
  pv: string;
  fecHasta = new Date;
  fecDesde = new Date((new Date().getMonth())+'/'+new Date().getDate()+'/'+new Date().getFullYear());

  fec1: string;
  fec2: string;

  arfafe: Arfafe[];
  displayedColumns: string[] = ['detalle','arfafePK.tipoDoc','arfafePK.noFactu',
  'fecha','no_GUIA','no_ORDEN','no_CLIENTE','moneda','total'];
  dataSource = new MatTableDataSource<Arfafe>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  arf: Arfafe;

  constructor(private arfafeService: ArfafeService,private router: Router, public route: ActivatedRoute,
    public datepipe: DatePipe) { }

  ngOnInit(): void {
    this.cargarData();
  }

  cargarData(){
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    this.dataSource.data = [];
    this.fec1 = this.datepipe.transform(this.fecDesde,'dd/MM/yyyy');
    this.fec2 = this.datepipe.transform(this.fecHasta,'dd/MM/yyyy');
    if(this.pven) this.pv = 'S'; else this.pv = 'N';
    this.arfafeService.listaArfafe('01',this.pv,this.tipoDoc,this.fec1,this.fec2,this.factu)
    .subscribe(list => {
      this.arfafe = list;
      for(var i = 0; i<list.length; i++){
        this.dataSource.data.push(list[i]);
        }
      this.dataSource.paginator = this.paginator;
    });
    console.log(this.dataSource.data);
    console.log(this.fec1 + '  --  '+this.fec2);
  }

  _filtrarList(){
    this.spin = true;
    this.dataSource.data = [];
    this.fec1 = this.datepipe.transform(this.fecDesde,'dd/MM/yyyy');
    this.fec2 = this.datepipe.transform(this.fecHasta,'dd/MM/yyyy');
    if(this.pven) this.pv = 'S'; else this.pv = 'N';
    this.arfafeService.listaArfafe('01',this.pv,this.tipoDoc,this.fec1,this.fec2,this.factu)
    .subscribe(list => {
      this.arfafe = list;
      for(var i = 0; i<list.length; i++){
        this.dataSource.data.push(list[i]);
        }
      this.spin = false;
      this.dataSource.paginator = this.paginator;
    });
    console.log(this.dataSource.data);
    console.log(this.tipoDoc);
    console.log(this.factu);
    console.log(this.fec1 + '  --  '+this.fec2);
  }

  getArfafeDetalle(cia: string, doc: string, factu: string){
    this.router.navigate(['/arfafe/detail'],{ queryParams: {nocia: cia,docu: doc,factura: factu}});
  }

}

