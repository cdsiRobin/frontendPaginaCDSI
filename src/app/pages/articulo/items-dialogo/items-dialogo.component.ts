import { Varinda1psService } from './../../../services/varinda1ps.service';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BuscarItem } from '../../../models/buscar-item';

import { MatTableDataSource } from '@angular/material/table';
import { Varinda1ps } from '../../../models/varinda1ps';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-items-dialogo',
  templateUrl: './items-dialogo.component.html',
  styles: [
  ]
})
export class ItemsDialogoComponent implements OnInit {
  displayedColumns: string[] = ['Codigo', 'UM', 'Nombre', 'Precio','Stock'];
  dataSource: MatTableDataSource<Varinda1ps>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  buscarItem: BuscarItem;
  varinda1pss: Varinda1ps[];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data:BuscarItem,
    public varinda1psService: Varinda1psService
  ) { }

  ngOnInit(): void {
     this.buscarItem = this.data;
     this.paginarItems();
  }

  //LISTAR ITEMS
  public paginarItems(): void{
    this.varinda1psService.pageItemsCiaAndLpAndDescrip(this.buscarItem).subscribe( v => {
      this.varinda1pss = v.resultado;
      console.log(this.varinda1pss);
      this.dataSource = new MatTableDataSource(this.varinda1pss);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
     /*
     this.varinda1psService.pageItemsCiaAndLp(this.buscarItem).pipe(
       map( value => value.resultado)
     );
     console.log(this.varinda1pss);
     */
  }
  //BUSCAR ITEMS
  public filtrarItem(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
