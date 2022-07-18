import { Component, Inject, OnInit } from '@angular/core';
import { ArfaccService } from '../../services/arfacc.service';
import { SerieDocumento } from '../../DTO/serie-documento';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IserieDocuInput } from '../../interfaces/Iserie-docu-input';

@Component({
  selector: 'app-arfacc',
  templateUrl: './arfacc.component.html',
  styleUrls: ['./arfacc.component.css']
})
export class ArfaccComponent implements OnInit {

  displayedColumns: string[] = ['centro', 'tipoDoc', 'descripcion', 'serie','consDesde'];
  dataSource: MatTableDataSource<SerieDocumento>;
  serieDocumentos: SerieDocumento[];

  constructor(private arfaccService: ArfaccService,
    public dialogRef: MatDialogRef<SerieDocumento>,
    @Inject(MAT_DIALOG_DATA) public data: IserieDocuInput ) { }

  ngOnInit(): void {
    this.listaDirecionesLegales();
  }

  private listaDirecionesLegales(): void{
    this.arfaccService.listaSerieDocumento( this.data.cia,this.data.tipDoc,this.data.centro,this.data.activo ).subscribe(result => {
      this.serieDocumentos = result
    }, error => {
      console.warn(error);
    }, () => {
      this.dataSource = new MatTableDataSource(this.serieDocumentos);
    }
    );
  }

  public dobleClick(row: SerieDocumento){
    localStorage.removeItem('seriedocu');
    localStorage.setItem('seriedocu', JSON.stringify(row));
    this.dialogRef.close();
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
