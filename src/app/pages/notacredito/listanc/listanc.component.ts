import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ArfafeService } from '../../../services/arfafe.service';
import { NotaCreditoDto } from '../../../models/nota-credito-dto';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-listanc',
  templateUrl: './listanc.component.html',
  styleUrls: ['./listanc.component.css']
})
export class ListancComponent implements OnInit {
  //,'tipoRefeFactu'
  //,'tipoRefeFactu'
  displayedColumns = ['noFactu', 'fecha', 'noRefeFactu',
   'codTped','estado','noCliente','nombreCli','moticoNc','moneda','total'];
  dataSource: MatTableDataSource<NotaCreditoDto>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private router: Router, private arfafeService: ArfafeService) { }

  ngOnInit(): void {
     this.arfafeService.getNotaCreditoCambio().subscribe(data => {
         this.dataSource = new MatTableDataSource(data);
         this.dataSource.sort = this.sort;
         this.dataSource.paginator = this.paginator;
     });
     this.arfafeService.listaNotasCredito(sessionStorage.getItem('cia'),'NC','S').subscribe(data => {
         this.dataSource = new MatTableDataSource(data);
         this.dataSource.sort = this.sort;
         this.dataSource.paginator = this.paginator;
     });
  }

  private mostrarListaNotasCredito(): void{

  }

  public newNotaCredito(nc: string): void{
    if(nc === 'C'){
      this.router.navigate(['pedido/notacredito/items']);
    }else{
      this.router.navigate(['pedido/notacredito/sinitem']);
    }
  }

  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

}
