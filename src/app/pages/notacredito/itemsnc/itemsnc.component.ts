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
import { ArfacrService } from '../../../services/arfacr.service';
import { ConceptoComponent } from '../../concepto/concepto.component';
import { ConceptoDto } from '../../../DTO/concepto-dto';


@Component({
  selector: 'app-itemsnc',
  templateUrl: './itemsnc.component.html'
})
export class ItemsncComponent implements OnInit {
  cia: string;
  grupoArccmcdto: FormGroup;
  gNotaCredito: FormGroup;
  arccmcdtos: Observable<Array<Arccmcdto>>;
  comprobIngresoDto: ComprabanteIngresodto;
  conceptoDto: ConceptoDto;

  constructor(private router: Router,
              public  dialog: MatDialog,
              private arfacrService: ArfacrService,
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

    this.gNotaCredito = new FormGroup({
      centro: new FormControl({value: '', disabled: true}),
      tipoDocRem:   new FormControl({value: '', disabled: false}),
      serieDocRem:  new FormControl({value: '', disabled: true}),
      corrDocRem: new FormControl({value: '', disabled: true}),
      almacen: new FormControl({value: '', disabled: true}),
      descAlmacen: new FormControl({value: '', disabled: true}),
      tipoDoc: new FormControl({value: '', disabled: true}),
      descTipoDoc: new FormControl({value: '', disabled: true}),
      noDocu: new FormControl({value: '', disabled: true}),
      concepto: new FormControl({value: '', disabled: false}),
      descConcepto: new FormControl({value: '', disabled: true})
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
           this.comprobIngresoDto = JSON.parse(localStorage.getItem('ci'));
           this.gNotaCredito.controls.tipoDocRem.setValue(this.comprobIngresoDto.tipoDocRem , {emitEvent: false});
           this.gNotaCredito.controls.serieDocRem.setValue(this.comprobIngresoDto.serieDocRem , {emitEvent: false});
           this.gNotaCredito.controls.corrDocRem.setValue(this.comprobIngresoDto.corrDocRem , {emitEvent: false});
           this.gNotaCredito.controls.almacen.setValue(this.comprobIngresoDto.almacen , {emitEvent: false});
           this.gNotaCredito.controls.tipoDoc.setValue(this.comprobIngresoDto.tipoDoc , {emitEvent: false});
           this.gNotaCredito.controls.noDocu.setValue(this.comprobIngresoDto.noDocu , {emitEvent: false});
        });
    }

  }

  public dcConcepto(){
    const dialogRef = this.dialog.open(ConceptoComponent,{
      width: '100%'
    });

    dialogRef.afterClosed().subscribe(result => {
       this.conceptoDto = JSON.parse(localStorage.getItem('concepto'));
       this.gNotaCredito.controls.concepto.setValue(this.conceptoDto.concepto , {emitEvent: false});
       this.gNotaCredito.controls.descConcepto.setValue(this.conceptoDto.descripcion , {emitEvent: false});
    });
  }

  public atras(): void {
    this.router.navigate(['pedido/notacredito/list']);
  }

}
