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
import { ConceptoComponent } from '../../concepto/concepto.component';
import { ConceptoDto } from '../../../DTO/concepto-dto';
import { DirecLegal } from '../../../DTO/direc-legal';
import { ArcctdaComponent } from '../../arcctda/arcctda.component';
import { ArfaccComponent } from '../../arfacc/arfacc.component';
import { IserieDocuInput } from '../../../interfaces/Iserie-docu-input';
import { SeridocuInput } from '../../../models/seridocu-input';
import { SerieDocumento } from '../../../DTO/serie-documento';
import { SputilsService } from '../../../services/sputils.service';
import { NotaCreditoci } from '../../../DTO/nota-creditoci';
import Swal from 'sweetalert2';
import { OnExit } from '../../../guards/exit.guard';
import { RtlScrollAxisType } from '@angular/cdk/platform';

@Component({
  selector: 'app-itemsnc',
  templateUrl: './itemsnc.component.html'
})
export class ItemsncComponent implements OnInit, OnExit {
  cia: string;
  centro: string;
  grupoArccmcdto:    FormGroup;
  gNotaCredito:      FormGroup;
  arccmcdtos:        Observable<Array<Arccmcdto>>;
  comprobIngresoDto: ComprabanteIngresodto;
  conceptoDto:       ConceptoDto;
  direcLegal:        DirecLegal;
  seriedocuInput:    IserieDocuInput;
  notaCreditoci:     NotaCreditoci;

  constructor(private router: Router,
              public  dialog: MatDialog,
              private sputilsService: SputilsService,
              private arccmcService: ArccmcService) { }

  ngOnInit(): void {

    this.cia = sessionStorage.getItem('cia');
    this.centro = sessionStorage.getItem('centro');
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
      centro: new FormControl({value: this.centro, disabled: true}),
      tipoDocRem:   new FormControl({value: '', disabled: false}),
      serieDocRem:  new FormControl({value: '', disabled: true}),
      corrDocRem: new FormControl({value: '', disabled: true}),
      almacen: new FormControl({value: '', disabled: true}),
      descAlmacen: new FormControl({value: '', disabled: true}),
      tipoDoc: new FormControl({value: '', disabled: true}),
      descTipoDoc: new FormControl({value: '', disabled: true}),
      noDocu: new FormControl({value: '', disabled: true}),
      concepto: new FormControl({value: '', disabled: false}),
      descConcepto: new FormControl({value: '', disabled: true}),
      sucursal: new FormControl({value: '', disabled: false}),
      direccion: new FormControl({value: '', disabled: true}),
      moneda: new FormControl({value: 'SOL', disabled: false}),
      referencia: new FormControl({value: '', disabled: false}),
      noFactu: new FormControl({value: '', disabled: false}),
      tipNc: new FormControl({value: 'NC', disabled: true}),
      serieNc: new FormControl({value: '', disabled: false}),
      correNc: new FormControl({value: '', disabled: true}),
      fechaNc: new FormControl({value: '', disabled: false}),
      sustento: new FormControl({value: 'DEVOLUCIÓN POR ÍTEM', disabled: false}),
      tipoOpe: new FormControl({value: '0101', disabled: false}),
      operacion: new FormControl({value: 'Venta interna/No Domiciliado', disabled: true}),
      motivo: new FormControl({value: '0', disabled: false}),
      contingencia: new FormControl({value: 'Facturación Electronica-Normal', disabled: true})
    });

  }

  onExist() {
     if( this.grupoArccmcdto.dirty || this.gNotaCredito.dirty){
         const rta = confirm('Esta seguro de salir?');
         return rta;
     }else {
         return true;
     }
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
           this.gNotaCredito.controls.referencia.setValue(this.comprobIngresoDto.tipoDocRec2 , {emitEvent: false});
           this.gNotaCredito.controls.noFactu.setValue(this.comprobIngresoDto.corrDocRec2 , {emitEvent: false});
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

  public dobleClickDirecc(): void {
    if(this.grupoArccmcdto.get('id').value !== '') {

        const dialogRef = this.dialog.open(ArcctdaComponent,{
          width: '100%',
          data: this.grupoArccmcdto.get('id').value
        });

        dialogRef.afterClosed().subscribe(result => {
           this.direcLegal = JSON.parse(localStorage.getItem('direccion'));
           this.gNotaCredito.controls.sucursal.setValue(this.direcLegal.codTienda , {emitEvent: false});
           this.gNotaCredito.controls.direccion.setValue(this.direcLegal.direccion , {emitEvent: false});
           localStorage.clear();
        });
    }
  }

  public dobleClickSerieDocumento(): void {
        //var serieDocuInput: SerieDocuInput { "centro": localStorage.getItem('centro') };
        this.seriedocuInput        = new SeridocuInput();
        this.seriedocuInput.cia    = this.cia;
        this.seriedocuInput.tipDoc = this.gNotaCredito.get('tipNc').value;
        this.seriedocuInput.centro = this.centro;
        this.seriedocuInput.activo = 'S';

        const dialogRef = this.dialog.open(ArfaccComponent,{
          width: '100%',
          data: this.seriedocuInput
        });

        dialogRef.afterClosed().subscribe(result => {
           const serieDocumento: SerieDocumento = JSON.parse(localStorage.getItem('seriedocu'));
           this.gNotaCredito.controls.serieNc.setValue(serieDocumento.serie , {emitEvent: false});
           this.gNotaCredito.controls.correNc.setValue(serieDocumento.consDesde , {emitEvent: false});
           localStorage.clear();
        });
  }

  public guardarNotaCreditoCi() {
      Swal.fire({
        title: 'Esá seguro de crear la Nota de Credito?',
        showDenyButton: true,
        confirmButtonText: 'Guardar',
        denyButtonText: `Salir`,
      }).then((result) => {
        if (result.isConfirmed) {
            this.saveNotaCredito();
        }
      });
  }

  private saveNotaCredito(){
    let respuesta: string;
    this.notaCreditoci = new NotaCreditoci();
    this.notaCreditoci.wnocia         = this.cia;
    this.notaCreditoci.wbodega        = this.gNotaCredito.get('almacen').value;
    this.notaCreditoci.wtipodoc       = this.gNotaCredito.get('tipoDoc').value;
    this.notaCreditoci.wnodocu        = this.gNotaCredito.get('noDocu').value;
    this.notaCreditoci.wcliente       = this.grupoArccmcdto.get('id').value;
    this.notaCreditoci.wtiporefefactu = this.gNotaCredito.get('referencia').value;
    this.notaCreditoci.wnorefefactu   = this.gNotaCredito.get('noFactu').value;
    this.notaCreditoci.wcodtienda     = this.gNotaCredito.get('sucursal').value;
    this.notaCreditoci.wmoneda        = this.gNotaCredito.get('moneda').value;
    this.notaCreditoci.wmotivonc      = this.gNotaCredito.get('concepto').value;
    this.notaCreditoci.wsustento      = this.gNotaCredito.get('sustento').value;
    this.notaCreditoci.wcentro        = this.centro;
    this.notaCreditoci.wserie         = this.gNotaCredito.get('serieNc').value;

    this.sputilsService.crearNotaCreditoCi(this.notaCreditoci).subscribe( result => {
        respuesta = result;
    }, error => {
        console.warn(error);
        Swal.fire({
          title: 'Error!',
          text: 'No se puedo crear la nota de credito',
          icon: 'error',
          confirmButtonText: 'Okey'
        })
    }, () => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: respuesta,
          showConfirmButton: false,
          timer: 1500
        });
        this.limpiarFormulario();
    } );
  }

  private limpiarFormulario(){
    this.gNotaCredito = new FormGroup({
      centro: new FormControl({value: this.centro, disabled: true}),
      tipoDocRem:   new FormControl({value: '', disabled: false}),
      serieDocRem:  new FormControl({value: '', disabled: true}),
      corrDocRem: new FormControl({value: '', disabled: true}),
      almacen: new FormControl({value: '', disabled: true}),
      descAlmacen: new FormControl({value: '', disabled: true}),
      tipoDoc: new FormControl({value: '', disabled: true}),
      descTipoDoc: new FormControl({value: '', disabled: true}),
      noDocu: new FormControl({value: '', disabled: true}),
      concepto: new FormControl({value: '', disabled: false}),
      descConcepto: new FormControl({value: '', disabled: true}),
      sucursal: new FormControl({value: '', disabled: false}),
      direccion: new FormControl({value: '', disabled: true}),
      moneda: new FormControl({value: 'SOL', disabled: false}),
      referencia: new FormControl({value: '', disabled: false}),
      noFactu: new FormControl({value: '', disabled: false}),
      tipNc: new FormControl({value: 'NC', disabled: true}),
      serieNc: new FormControl({value: '', disabled: false}),
      correNc: new FormControl({value: '', disabled: true}),
      fechaNc: new FormControl({value: '', disabled: false}),
      sustento: new FormControl({value: 'DEVOLUCIÓN POR ÍTEM', disabled: false}),
      tipoOpe: new FormControl({value: '0101', disabled: false}),
      operacion: new FormControl({value: 'Venta interna/No Domiciliado', disabled: true}),
      motivo: new FormControl({value: '0', disabled: false}),
      contingencia: new FormControl({value: 'Facturación Electronica-Normal', disabled: true})
    });
  }

  public atras(): void {
    this.router.navigate(['pedido/notacredito/list']);
  }

}
