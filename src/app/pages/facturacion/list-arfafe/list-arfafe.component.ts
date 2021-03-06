import { DatePipe } from "@angular/common";
import { AfterViewInit,  Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { Arfafe } from "src/app/models/Arfafe";
import { ArfafeService } from "src/app/services/arfafe.service";


const ELEMENT_DATA: Arfafe[] = [];

@Component({
  selector: 'app-list-arfafe',
  templateUrl: './list-arfafe.component.html',
  styleUrls: ['./list-arfafe.component.scss']
})

export class ListArfafeComponent implements OnInit, AfterViewInit, OnDestroy {

  cia: string= sessionStorage.getItem('cia');
  compania: string = 'Nombre de compañia';
  centroEmi: string = 'Centro';
  public ConEstado = 'All';
  public ConCosto = 'Central';
  tipoDoc = 'B';
  docChange = () => { if (this.tipoDoc === 'B') return 'Boleta'; else return 'Factura' };
  docL = this.docChange();
  factu= '';
  pven= true;
  spin= false;
  pv: string;
  fecHasta = new Date;
  // fecDesde = new Date((new Date().getMonth())+'/'+new Date().getDate()+'/'+new Date().getFullYear());
  fecDesde = new Date;
  totalD = 0;

  fec1: string;
  fec2: string;

  arfafe: Arfafe[];
  displayedColumns: string[] = ['detalle','arfafePK.noFactu',
  'fecha','no_GUIA','no_ORDEN','no_CLIENTE','moneda','total'];
  dataSource = new MatTableDataSource<Arfafe>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  arf: Arfafe;

  private mediaSub: Subscription;
  constructor(private arfafeService: ArfafeService,private router: Router, public route: ActivatedRoute,
    public datepipe: DatePipe) { }

  ngOnInit(): void {
    this.cargarData();
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    if(this.mediaSub){
      this.mediaSub.unsubscribe();
    }
  }

  cargarData(){
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    this.dataSource.data = [];
    this.fec1 = this.datepipe.transform(this.fecDesde.setMonth(this.fecDesde.getMonth()-1),'dd/MM/yyyy');
    this.fec2 = this.datepipe.transform(this.fecHasta,'dd/MM/yyyy');
    if(this.pven) this.pv = 'S'; else this.pv = 'N';
    this.arfafeService.listaArfafe(this.cia,this.pv,this.tipoDoc,this.fec1,this.fec2,this.factu)
    .subscribe(list => {
      this.arfafe = list;
      this.totalD = 0;
      for(var i = 0; i<list.length; i++){
        this.dataSource.data.push(list[i]);
        this.totalD = this.totalD += list[i].total;
        }
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

  }

  _filtrarList(){
    this.spin = true;
    this.dataSource.data = [];
    this.fec1 = this.datepipe.transform(this.fecDesde,'dd/MM/yyyy');
    this.fec2 = this.datepipe.transform(this.fecHasta,'dd/MM/yyyy');
    if(this.pven) this.pv = 'S'; else this.pv = 'N';
    this.arfafeService.listaArfafe(this.cia,this.pv,this.tipoDoc,this.fec1,this.fec2,this.factu)
    .subscribe(list => {
      this.arfafe = list;
      this.totalD = 0;
      for(var i = 0; i<list.length; i++){
        this.dataSource.data.push(list[i]);
        this.totalD = this.totalD += list[i].total;
        }
      this.spin = false;
      this.dataSource.paginator = this.paginator;
    });
    this.docL = this.docChange();
    // console.log(this.dataSource.data);
    // console.log(this.tipoDoc);
    // console.log(this.factu);
    // console.log(this.fec1 + '  --  '+this.fec2);
  }

  getArfafeDetalle(cia: string, doc: string, factu: string){
    this.router.navigate(['pedido/arfafe/detail'],{ queryParams: {nocia: cia,docu: doc,factura: factu}});
  }

}

