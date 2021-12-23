import { MatDialog } from '@angular/material/dialog';
import { TapusupvenService } from './../../services/tapusupven.service';
import { ArcaaccajService } from './../../services/arcaaccaj.service';
import { CompanyService } from './../../services/company.service';
import { ArccvcService } from './../../services/arccvc.service';
import { Arinmr } from './../../models/Arinmr';
import { ArinmrService } from './../../services/Arinmr.service';
import { ArfatpService } from './../../services/arfatp.service';
import { Arinbo1Service } from './../../services/arinbo1.service';
import { Familia } from './../../models/Familia';
import { FamiliaService } from './../../services/familia.service';
import { SublineaService } from './../../services/sublinea.service';
import { SubLinea } from './../../models/SubLinea';
import { LineaService } from './../../services/linea.service';
import { Linea } from './../../models/Linea';
import { Observable } from 'rxjs';
import { CatalogoService } from './../../services/catalogo.service';
import Swal from 'sweetalert2';
import { Usuario } from './../../models/usuario';
import { ArticuloService } from './../../services/articulo.service';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Catalogo } from 'src/app/models/Catalogo';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { Arinbo1 } from 'src/app/models/Arinbo1';
import { Arfatp } from 'src/app/models/Arfatp';
import { Articulo } from 'src/app/models/Articulo';

@Component({
  selector: 'app-larti',
  templateUrl: './larti.component.html',
  styleUrls: ['./larti.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class LartiComponent implements OnInit {

  displayedColumns = ['idArti', 'descripcion','medida', 'precio', 'compromiso', 'disponible'];
  dataSource: MatTableDataSource<Articulo>;
  paginador: any;
  catalogo: string = '1';
  almacenes$: Observable<Arinbo1[]>;
  tipos$: Observable<Arfatp[]>;
  marcas$:Observable<Arinmr[]>;
  catalogos$: Observable<Catalogo[]>;
  lineas$: Observable<Linea[]>;
  sublineas$: Observable<SubLinea[]>;
  familias$: Observable<Familia[]>;
  //lineas$: Linea[];
  idCatalogoSeleccionado: string;
  fecha=Date.now();
  //linea:Linea;
  /*length: number;
  pageSize:number=8;*/
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog,
    public serviArti: ArticuloService, public serviCat: CatalogoService,
    public actiRouter: ActivatedRoute, public serviLin: LineaService,
    public serviSub: SublineaService, public serviFam: FamiliaService,
    public serviAlma: Arinbo1Service, public serviPre: ArfatpService,
    public servMar:ArinmrService, public vende: ArccvcService, public comp:CompanyService,
    public cajaService: ArcaaccajService, public usuService: TapusupvenService,
    private router: Router) {
  }
  pageEvent: PageEvent;
  usu = new Usuario();
  marca:string;
  linea: string;
  sublinea: string;
  familia: string;
  almacen: string;
  tipo: string;
  nombre:any;
  vendedor:string;
  codEmp:string
  nombre_vendedor:string;
  nombre_cia:string;

  ngOnInit() {
    this.usu.cia = sessionStorage.getItem('cia');
    this.nombre_cia= sessionStorage.getItem('nomCia');
    this.vendedor = sessionStorage.getItem('cod');
    this.codEmp = sessionStorage.getItem('codEmp');
    this.nombre_vendedor = sessionStorage.getItem('nombre');
    this.almacen='1A001';
    this.tipo= 'F8';
    this.listarCatalogos();
    this.listarAlmacenes();
    //this.listarPrecios();
    this.listarLineas();
    this.listarMarcas();
    this.filtrarCatalogo();

  }
  regresarLogin(){
    this.router.navigateByUrl('/log_arti');
  }
  listarAlmacenes() {
    this.almacenes$ = this.serviAlma.getAlmacenes(this.usu);
  }
  /*
  listarPrecios() {
    this.tipos$ = this.serviPre.getAllListaPrecio(this.usu.cia,'S');
  }
  */
  listarMarcas() {
    this.marcas$ = this.servMar.getMarcas(this.usu);
  }
  listarCatalogos() {
    this.catalogos$ = this.serviCat.getCatalogos(this.usu);
  }
  listarLineas() {
    this.lineas$ = this.serviLin.getLineas(this.usu, this.catalogo);

  }
  listarSubLineas() {
    this.sublineas$ = this.serviSub.getSubLineas(this.usu, this.catalogo,this.linea);
  }
  listarFamilias() {
    this.familias$ = this.serviFam.getFamilias(this.usu, this.catalogo,this.linea,this.sublinea);
  }
  filtrarMarca() {
    this.dataSource.filterPredicate = function(data, filter: string):boolean{
      return (data.marca.toLowerCase().includes(filter));
    };
    this.dataSource.filter =this.marca.trim().toLowerCase();

  }
  filtrar(valor:any) {
    this.dataSource.filterPredicate = function(data, filter: string):boolean{
      return (data.descripcion.toLowerCase().includes(filter)||data.no_arti.toLowerCase().includes(filter));
    };
    this.dataSource.filter = valor.trim().toLowerCase();
  }
  filtrarData() {
    if(typeof this.linea ==='undefined' && typeof this.sublinea ==='undefined' && typeof this.familia ==='undefined' ||
    this.linea ==='' &&  this.sublinea ==='' &&  this.familia ===''){
      this.filtrarCatalogo();
    }
    if(typeof this.linea !== 'undefined' && typeof this.sublinea ==='undefined' && typeof this.familia ==='undefined' ||
    typeof this.linea !== 'undefined' &&  this.sublinea ==='' &&  this.familia ===''){
      this.filtrarLinea();
    }
      if(typeof this.linea !== 'undefined' && typeof this.sublinea !== 'undefined' && typeof this.familia ==='undefined' ||
      typeof this.linea === 'undefined' &&  typeof this.sublinea ==='undefined' &&  this.familia ===''){
        this.filtrarSubLinea();
      }
        if(typeof this.linea !== 'undefined' && typeof this.sublinea !== 'undefined' && typeof this.familia !== 'undefined'){
          this.filtrarCompleto()
        }
      }
  borrarFiltros(){
    this.linea= '';
    this.sublinea='';
    this.familia='';
    this.marca='';
    this.filtrarCatalogo();
  }
  filtrarCatalogo(){
      // ALERTA
      Swal.fire({

        allowOutsideClick: false, // CLICK FUERA
        icon: 'info',
        text: 'Espere por favor...'
      });
      Swal.showLoading();
      this.serviArti.getPageCata(this.usu, this.catalogo, this.almacen, this.tipo).subscribe(data => {
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          Swal.close();
        });
      }
  filtrarLinea(){
      // ALERTA
      Swal.fire({
        allowOutsideClick: false, // CLICK FUERA
        icon: 'info',
        text: 'Espere por favor...'
      });
      Swal.showLoading();
      this.serviArti.getPageAllLinea(this.usu, this.catalogo,this.linea, this.almacen, this.tipo).subscribe(data => {
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          Swal.close();
        });
      }
  filtrarSubLinea(){
      // ALERTA
      Swal.fire({
        allowOutsideClick: false, // CLICK FUERA
        icon: 'info',
        text: 'Espere por favor...'
      });
      Swal.showLoading();
      this.serviArti.getPageAllSubLinea(this.usu, this.catalogo, this.linea,this.sublinea,this.almacen, this.tipo).subscribe(data => {
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          Swal.close();
        });
      }
  filtrarCompleto(){
      // ALERTA
      Swal.fire({
        allowOutsideClick: false, // CLICK FUERA
        icon: 'info',
        text: 'Espere por favor...'
      });
      Swal.showLoading();

      this.serviArti.getPageAll(this.usu, this.catalogo, this.linea, this.sublinea, this.familia,
        this.almacen, this.tipo).subscribe(data => {
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          Swal.close();
        });
    }
}
