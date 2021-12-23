// new factura .ts component
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatTableDataSource } from '@angular/material/table';
import { merge, Observable, of } from 'rxjs';
import { Arccmc } from 'src/app/models/Arccmc';
import { ArccmcService } from 'src/app/services/arccmc.service';
import { ArticuloService } from 'src/app/services/articulo.service';
import { PedidoService } from 'src/app/services/pedido.service';

@Component({
  selector: 'app-arfafe-new',
  templateUrl: './arfafe-new.component.html',
  styleUrls: []
})
export class NewArfafeComponent implements OnInit {
  groupEmpresa:FormGroup;
  groupArticulo:FormGroup;

  detalle: Arfafl[];
  options: Arccmc[] = [];

  factuOptions: Arccmc[];
  codProd = '';
  desProd = '';
  cantProd = 1;
  totalFactu:number = 0;

  displayedColumns: string[] = ['item', 'codigo', 'medida', 'descripcion', 'tipoAfec', 'cantidad',
'pu', 'descu','icbCop', 'IGV', 'total','eliminar'];
  dataSource = new MatTableDataSource<FacturaElement>(ELEMENT_DATA);

  constructor(public pedidoService: PedidoService,
    public clienteServices: ArccmcService,
    public arindaService: ArticuloService) { }


  ngOnInit(): void {
    this.groupEmpresa = new FormGroup({
      ruc: new FormControl(),
      racSoc: new FormControl()
    });
    this.groupArticulo = new FormGroup({
      codProd: new FormControl(),
      desProd: new FormControl(),
      cantProd: new FormControl()
    });

    /*this.factuOptions = this.groupEmpresa.controls['ruc'].valueChanges
    .pipe(
      debounceTime(300),
      map(value => this._filter(value))
    );*/

    // this.groupEmpresa.get("ruc").valueChanges.subscribe( value => {

    // });

    // this.groupEmpresa.get("ruc").valueChanges.pipe(
    //   debounceTime(300),
    //   map(value => this._filter(value))
    // );

    this.groupEmpresa.get("ruc").valueChanges.subscribe(valueChange => {
      if(valueChange.length > 3)
      this.clienteServices.listaClientesRucLike('01',valueChange).subscribe(
        rs => {
          this.factuOptions = rs.resultado;
        }
      );
      else
      this.factuOptions = null;
    })

  }

  private _filter(value: string){

    if(value.length > 3) {
      this.clienteServices.listaClientesRucLike('01',value).subscribe(
        datos => {
          this.options = datos.resultado;
        }
      );
      return this.options;
    } else {
      return [];
    }

  }

addElement() {
  ELEMENT_DATA.push({item: this.getItemNumber(), codigo: this.groupArticulo.controls['codProd'].value, medida:0,
  descripcion: this.groupArticulo.controls['desProd'].value, tipoAfec: 0,cantidad: this.groupArticulo.controls['cantProd'].value, pu: 0, descu: 0, icbCop: 0, IGV: 0, total: 0})
   this.dataSource = new MatTableDataSource(ELEMENT_DATA);
}

getItemNumber():number {
  if (ELEMENT_DATA.length == 0) { return 1;}
  else {
    return ELEMENT_DATA.length + 1;
  }
}

onKeypressRucEvent($event: any){
  /*if ($event.target.value.length > 7) {
    console.log($event.target.value);
    const filterValue = $event.target.value;
    this.factuOptions = this.clienteServices.listaClientesRucLike('01',filterValue);

  } else if ($event.target.value.length > 3) {
    this.factuOptions = this.groupEmpresa.get("ruc").valueChanges
    .pipe(
      debounceTime(300),
      map(value => this._filter(value))
    );
  } else {
    this.factuOptions = this.groupEmpresa.controls['ruc'].valueChanges
    .pipe(
      debounceTime(300),
      map(value => this._filter(value))
    );
  }*/
}

setFormData($event: MatAutocompleteSelectedEvent) {
  let factuOptions = $event.option.value;
  if(factuOptions){
    this.groupEmpresa.controls['ruc'].setValue(factuOptions.ruc, {emitEvent: false});
    this.groupEmpresa.controls['racSoc'].setValue(factuOptions.nombre, {emitEvent: false});
  }
}

deleteDetail(index: number) {
  ELEMENT_DATA.splice(index-1, 1);

  this.reOrderItems();
  this.dataSource = new MatTableDataSource(ELEMENT_DATA);
}

reOrderItems(){
  for(let i=0; i< ELEMENT_DATA.length; i++){
    ELEMENT_DATA[i].item = i+1;
  }
}

getTotal(){
  for (let i = 0; i < this.detalle.length; i++) {
    this.totalFactu += this.detalle[i].total;
  }
}

}

export interface EmpresaElement{
  ruc: string;
  razon: string;
}

export interface FacturaElement {
  item: number;
  codigo: string;
  medida: number;
  descripcion: string;
  tipoAfec: number;
  cantidad: number;
  pu: number;
  descu: number;
  icbCop: number;
  IGV: number;
  total: number;
}

export interface Arfafl{
  total: number;
}

const ELEMENT_DATA: FacturaElement[] = [
  //{item: 1, codigo: "", medida:0, descripcion: "", ta: 0,cantidad: 0, pu: 0, descu: 0, icbCop: 0, IGV: 0, total: 0}
];
