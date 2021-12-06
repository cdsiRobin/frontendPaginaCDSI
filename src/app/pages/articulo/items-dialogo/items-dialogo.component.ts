import { Varinda1psService } from './../../../services/varinda1ps.service';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BuscarItem } from '../../../models/buscar-item';

import { MatTableDataSource } from '@angular/material/table';
import { Varinda1ps } from '../../../models/varinda1ps';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  varinda1pss2 : Varinda1ps[] = [];
  cantidadItems: number = 0;

  constructor(
    public dialogRef: MatDialogRef<ItemsDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) private data:BuscarItem,
    public varinda1psService: Varinda1psService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
     this.buscarItem = this.data;
     this.paginarItems();
  }

  //LISTAR ITEMS
  public paginarItems(): void{
    this.varinda1psService.pageItemsCiaAndLpAndDescrip(this.buscarItem).subscribe( v => {
      this.varinda1pss = v.resultado;
      this.dataSource = new MatTableDataSource(this.varinda1pss);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

  }
  //BUSCAR ITEMS
  public filtrarItem(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //METODO QUE NOS PERMIE A CAPTURAR UN ITEM
  public AgregarItems(v: Varinda1ps){
    if(v.stock == 0){
      this.snackBar.open(`No se agrego el articulo porque tiene stock CERO`,'Salir',
      {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    }else{
      this.verificarItems(v);
      this.cantidadItems = this.varinda1pss2.length;
    }

  }
  //CERRAR LA VENTANA DEL MODAL DE ARTICULOS
  onNoClick(): void {
    this.dialogRef.close();
  }
  //VERIFICAR DUPLICADO DE ITEMS
  public verificarItems(va: Varinda1ps): void {
     if (this.varinda1pss2.length == 0){
         this.varinda1pss2.push(va);
         this.snackBar.open(`Se agrego el articulo ${va.descripcion}`,'Salir',
         {
           duration: 1000,
           verticalPosition: 'top',
           horizontalPosition: 'center'
         });
     } else {
        let cod = va.noArti;
        let valor = 'N';
        for (var i in this.varinda1pss2){
            if(cod == this.varinda1pss2[i].noArti){
              valor = 'S';
              break;
            }
        }
        if(valor == 'N'){
          this.varinda1pss2.push(va);
          this.snackBar.open(`Se agrego el articulo ${va.descripcion}`,'Salir',
            {
              duration: 1000,
              verticalPosition: 'top',
              horizontalPosition: 'center'
            });
        }
     }

  }

}
