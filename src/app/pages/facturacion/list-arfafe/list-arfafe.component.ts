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
  fecHasta = new Date;
  fecDesde = new Date((new Date().getMonth())+'/'+new Date().getDate()+'/'+new Date().getFullYear());

  arfafe: Arfafe[];
  displayedColumns: string[] = ['detalle','arfafePK.tipoDoc','arfafePK.noFactu',
  'fecha','no_GUIA','no_ORDEN','no_CLIENTE','moneda','total'];
  dataSource = new MatTableDataSource<Arfafe>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  arf: Arfafe;

  constructor(private arfafeService: ArfafeService,private router: Router, public route: ActivatedRoute) { }

  ngOnInit(): void {
    //console.log(new Date()+' - '+new Date().getDate()+'/'+(new Date().getMonth())+'/'+new Date().getFullYear());
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    this.dataSource.data = [];
    this.arfafeService.listaArfafe('01','F').subscribe(list => {
      this.arfafe = list;
      for(var i = 0; i<list.length; i++){
        this.dataSource.data.push(list[i]);
        }
      this.dataSource.paginator = this.paginator;
    });
    console.log(this.dataSource.data);
    console.log(this.fecDesde + '  --  '+this.fecHasta);
  }

  // getAllArfafe(){
  //   for(let i in this.arfafe){
  //     // console.log(this.arfafe[i]);
  //     ELEMENT_DATA.push(this.arfafe[i]);
  //   }
  //   // for(var i = 0; i<this.arfafe.length; i++){
  //   //   facturas.push(this.arfafe[i]);
  //   // }    
  //   // this.arfafeService.listaArfafe(this.cia)
  //   // .subscribe(list => {
  //   //   this.facturas = list;
  //   //   console.log(this.facturas);
  //   // });
  // }

  getArfafeDetalle(cia: string, doc: string, factu: string){
    this.router.navigate(['/arfafe/detail'],{ queryParams: {nocia: cia,docu: doc,factura: factu}});
    // this.arfafeService.arfafeDetalle(new ArfafeDTO(cia,doc,factu)).
    // subscribe(n => {
    //   this.arfafe = n.resultado;
    //   //this.arf = this.arfafe
    //   console.log(this.arfafe);
    //   this.router.navigate(['/arfafe/detail'],{ queryParams: {data: this.arfafe}});
    // });
  }

}

