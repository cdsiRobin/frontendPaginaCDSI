import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Arpfoe } from 'src/app/models/Arpfoe';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ArpfoeService } from '../../../services/arpfoe.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listaped',
  templateUrl: './listaped.component.html'
})
export class ListapedComponent implements OnInit {
  fBuscar: FormGroup;
  fecha: Date;
  arpfoes: Array<Arpfoe>

  displayedColumns: string[] = ['arpfoePK.noOrden','noCliente','codTPed','fRecepcion','centro','estado','moneda','tPrecio','detalle'];
  dataSource: MatTableDataSource<Arpfoe>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  cia: string;
  centro: string;
  fec1: string;
  fec2: string;
  spin= false;
  fecDesde: Date;
  fecHasta: Date;

  constructor(public datepipe: DatePipe,
    public arpfoeServi: ArpfoeService,
    private router: Router) { }

  ngOnInit(): void {
    this.cia = sessionStorage.getItem('cia');
    this.centro = sessionStorage.getItem('centro');
    this.fecDesde = new Date();
    this.fecHasta = new Date();
    this.iniciarFormulario();
    this.buscar();
  }
  // BUSCAR PEDIDOS
  public buscar(): void{
    this.fec1 = this.datepipe.transform(this.fBuscar.get('desde').value,'dd/MM/yyyy');
    this.fec2 = this.datepipe.transform(this.fBuscar.get('hasta').value,'dd/MM/yyyy');
    this.listarPedidoXFecha(this.fec1, `${this.fec2} 23:59`);
  }
  // FIN
  // INICIAR FORMULARIO
  private iniciarFormulario(): void{
    this.fecDesde.setMonth(this.fecDesde.getMonth()-1);
    this.fBuscar = new FormGroup({
      pedido: new FormControl({value: '', disabled: true }),
      rucDni: new FormControl(''),
      estado: new FormControl({value: '0', disabled: true }),
      centro: new FormControl({value: this.centro, disabled: true }),
      desde: new FormControl({value: this.fecDesde, disabled: false }, [Validators.required]),
      hasta: new FormControl({value: this.fecHasta, disabled: false }, [Validators.required]),
      pv: new FormControl('S')
    });
  }
  // FIN
  // LISTAR LOS PEDIDOS POR LA FECHA
  private listarPedidoXFecha(fec1: string, fec2: string): void {
    this.arpfoeServi.listarPedidosPV(this.cia,'S',fec1,fec2).subscribe(p => {
      this.arpfoes = p;
    }, error => {
        Swal.fire('Error al consultar los pedidos.')
    });
    this.dataSource = new MatTableDataSource(this.arpfoes);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  // FIN
  // BUSCAMOS UN PEDIDO O CLIENTE POR SU RUC O DNI
  public buscarPedido(event: Event): void{
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  // FIN
  // BUSCAMOS EL PEDIDO(PROFORMA)
  public buscarProforma(noOrden: string){
    this.router.navigate(['pedido/nuevo'],{ queryParams: {noOrden: noOrden}});
  }
  // FIN
}
