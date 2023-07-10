import { Component, Inject, OnInit } from '@angular/core';
import { DirecLegal } from '../../DTO/direc-legal';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ArccmcService } from '../../services/arccmc.service';

@Component({
  selector: 'app-arcctda',
  templateUrl: './arcctda.component.html',
  styleUrls: ['./arcctda.component.css']
})
export class ArcctdaComponent implements OnInit {

  cia: string;
  displayedColumns: string[] = ['direccion', 'nombre', 'codTienda', 'descripcion'];
  dataSource: MatTableDataSource<DirecLegal>;
  direcLegals: DirecLegal[];

  constructor(public dialogRef: MatDialogRef<DirecLegal>,
    private arccmcService: ArccmcService,
    @Inject(MAT_DIALOG_DATA) public data: string) { }

  ngOnInit(): void {
    this.cia = sessionStorage.getItem('cia');
    this.listaDirecionesLegales();
  }

  private listaDirecionesLegales(): void {
    this.arccmcService.listaDirecionesLegal(this.cia, this.data).subscribe(result => {
      this.direcLegals = result
    }, error => {
      console.warn(error);
    }, () => {
      this.dataSource = new MatTableDataSource(this.direcLegals);
    }
    );
  }

  public dobleClick(row: DirecLegal){
    localStorage.removeItem('direccion');
    localStorage.setItem('direccion', JSON.stringify(row));
    this.dialogRef.close();
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
