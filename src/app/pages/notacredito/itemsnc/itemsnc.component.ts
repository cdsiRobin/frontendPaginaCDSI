import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Arccmcdto } from '../../../models/arccmcdto';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ArccmcService } from '../../../services/arccmc.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Iarccmcdto } from '../../../interfaces/iarccmcdto';
import { MatDialog } from '@angular/material/dialog';
import { ComprobIngreDialogoComponent } from '../comprob-ingre-dialogo/comprob-ingre-dialogo.component';
import { ComprabanteIngresodto } from '../../../DTO/comprabante-ingresodto';
import { IComprabanteIngresodto } from '../../../interfaces/icomprabante-ingresodto';

@Component({
  selector: 'app-itemsnc',
  templateUrl: './itemsnc.component.html'
})
export class ItemsncComponent implements OnInit {
  cia: string;
  grupoArccmcdto: FormGroup;
  arccmcdtos: Observable<Array<Arccmcdto>>;
  comprobIngresoDto: ComprabanteIngresodto;

  constructor(private router: Router,
              public  dialog: MatDialog,
              private arccmcService: ArccmcService) { }

  ngOnInit(): void {

    this.cia = sessionStorage.getItem('cia');
    this.grupoArccmcdto = new FormGroup({
      id: new FormControl({value: '', disabled: false}, [Validators.required,Validators.minLength(1),Validators.pattern(/^-?(0|[0-9]\d*)?$/)]),
      nombre: new FormControl({value: '', disabled: false}, [Validators.required,Validators.minLength(2)])
    });

    this.grupoArccmcdto.get('id').valueChanges.subscribe(valueChange => {
      if (valueChange.length >= 3) {
          this.arccmcdtos = this.arccmcService.listaClienteDtoByCiaAndId(this.cia, valueChange);
      }
    });

  }

  public getCliente($event: MatAutocompleteSelectedEvent): void {
    const arccmcdto: Iarccmcdto = $event.option.value;
    this.grupoArccmcdto.controls.id.setValue(arccmcdto.noCliente , {emitEvent: false});
    this.grupoArccmcdto.controls.nombre.setValue(arccmcdto.nombre , {emitEvent: false});
  }

  public openComprobIngresoDialog(): void {

    if(this.grupoArccmcdto.get('id').value !== '') {
        this.comprobIngresoDto = new ComprabanteIngresodto();
        this.comprobIngresoDto.noCliente = this.grupoArccmcdto.get('id').value;
        const dialogRef = this.dialog.open(ComprobIngreDialogoComponent,{
          width: '100%',
          data: this.comprobIngresoDto //{noCli: this.grupoArccmcdto.get('id').value}
        });

        dialogRef.afterClosed().subscribe(result => {
           const comprobIngresoDto: IComprabanteIngresodto = JSON.parse(localStorage.getItem('ci'));
           console.log(comprobIngresoDto);
        });
    }

  }

  public atras(): void {
    this.router.navigate(['pedido/notacredito/list']);
  }

}
