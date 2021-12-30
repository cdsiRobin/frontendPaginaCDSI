import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ArcgtcService } from '../../../services/arcgtc.service';
import { Sunattc } from '../../../models/sunattc';


@Component({
  selector: 'app-new-arcgtc',
  templateUrl: './new-arcgtc.component.html'
})
export class NewArcgtcComponent implements OnInit {

  public sunattc: Sunattc;

  constructor(
    public datepipe: DatePipe,
    public arcgtcService: ArcgtcService
    ) { }

  ngOnInit(): void {
    this.buscarTipoCambioSunat();
  }


  //METODO QUE NOS PERMITE TRAER POR FECHA EL TIPO DE CAMBIO($)
  public buscarTipoCambioSunat(){
    let fecha = this.datepipe.transform(new Date,'yyyy-MM-dd');
    this.arcgtcService.getTipoCambioSunatXFecha(fecha).subscribe( value => {
      this.sunattc = value;
      console.log(this.sunattc);
    });

  }

}
