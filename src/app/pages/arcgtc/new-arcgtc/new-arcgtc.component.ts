import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ArcgtcService } from '../../../services/arcgtc.service';
import { Sunattc } from '../../../models/sunattc';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-arcgtc',
  templateUrl: './new-arcgtc.component.html'
})
export class NewArcgtcComponent implements OnInit {

  public sunattcs: Sunattc[] = [];
  displayedColumns: string[] = ['clase','descripcion','monto'];
  dataSource: MatTableDataSource<Sunattc>;
  fechaf = new Date();

  constructor(
    public datepipe: DatePipe,
    public arcgtcService: ArcgtcService
    ) { }

  ngOnInit(): void {
    this.findTipoCAmbio();
  }

  //METODO QUE NOS PERMITE TRAER POR FECHA EL TIPO DE CAMBIO($)
  public findTipoCAmbio(){
    //let fecha = this.datepipe.transform(new Date,'dd/MM/yyyy');
    let fecha = this.datepipe.transform(this.fechaf,'dd/MM/yyyy');
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Buscando tipo de cambio '+fecha,
      showConfirmButton: false,
      timer: 1500
    })
    this.arcgtcService.getDTOTipoCambioXFecha(fecha).subscribe( value => {
      this.sunattcs = value;
      //console.log(this.sunattcs);
      this.llenarTabla();
    });
  }

  //LLENAR TABLA
  private llenarTabla(): void{
    this.dataSource = new MatTableDataSource(this.sunattcs);
  }

}
