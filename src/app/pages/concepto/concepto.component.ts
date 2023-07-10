import { Component, OnInit } from '@angular/core';
import { ConceptoDto } from '../../DTO/concepto-dto';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogRef } from '@angular/material/dialog';
import { ArfacrService } from '../../services/arfacr.service';

@Component({
  selector: 'app-concepto',
  templateUrl: './concepto.component.html',
  styleUrls: ['./concepto.component.css']
})
export class ConceptoComponent implements OnInit {

  cia: string;
  displayedColumns: string[] = ['concepto', 'descripcion', 'indConDeta', 'codSunat'];
  dataSource: MatTableDataSource<ConceptoDto>;
  conceptoDto: ConceptoDto[];

  constructor(public dialogRef: MatDialogRef<ConceptoDto>,
              private arfacrSevice: ArfacrService) { }

  ngOnInit(): void {
    this.cia = sessionStorage.getItem('cia');
    this.listaConcepto();
  }

  private listaConcepto(): void{
    this.arfacrSevice.listaConcepto(this.cia, 'S').subscribe(result => {
      this.conceptoDto = result
    }, error => {
      console.warn(error);
    }, () => {
      this.dataSource = new MatTableDataSource(this.conceptoDto);
    }
    );
  }

  public dobleClick(row: ConceptoDto){
    localStorage.removeItem('concepto');
    localStorage.setItem('concepto', JSON.stringify(row));
    this.dialogRef.close();
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
