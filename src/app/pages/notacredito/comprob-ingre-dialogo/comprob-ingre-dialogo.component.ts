import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Arinme1Service } from '../../../services/arinme1.service';
import { IComprabanteIngresodto } from '../../../interfaces/icomprabante-ingresodto';
import { MatTableDataSource } from '@angular/material/table';
import { ComprabanteIngresodto } from '../../../DTO/comprabante-ingresodto';

@Component({
  selector: 'app-comprob-ingre-dialogo',
  templateUrl: './comprob-ingre-dialogo.component.html',
  styleUrls: ['./comprob-ingre-dialogo.component.css']
})
export class ComprobIngreDialogoComponent implements OnInit {
  cia: string;
  comproIngresoDtos: IComprabanteIngresodto[];
  //comproIngresoDto: ComprabanteIngresodto;
  displayedColumns: string[] = ['almacen', 'tipoDoc', 'noDocu', 'fecha','noCliente','tipoDocRem','serieDocRem','corrDocRem','tipoDocRec2','corrDocRec2','estado'];
  dataSource: MatTableDataSource<ComprabanteIngresodto>;

  constructor(public dialogRef: MatDialogRef<ComprobIngreDialogoComponent>,
    private arinme1Service: Arinme1Service,
    @Inject(MAT_DIALOG_DATA) public data: IComprabanteIngresodto) { }

  ngOnInit(): void {
    this.cia = sessionStorage.getItem('cia');
    this.listaComprobanteIngreso();
  }

  private listaComprobanteIngreso(): void{
      this.arinme1Service.listaComprobanteIngreso(this.cia, this.data.noCliente).subscribe(result => {
        this.comproIngresoDtos = result
      }, error => {
        console.warn(error);
      }, () => {
        this.dataSource = new MatTableDataSource(this.comproIngresoDtos);
      }
      );
  }

  //EVENTO DOBLE CLICK CUANDO SE ESCOGE UN C.I (event: MouseEvent)
  public dobleClick(row: IComprabanteIngresodto){
      localStorage.removeItem('ci');
      localStorage.setItem('ci', JSON.stringify(row));
      this.dialogRef.close();
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
