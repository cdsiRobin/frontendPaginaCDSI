import { TapusupvenService } from './../../../../services/tapusupven.service';
import { DatosCajaDTO } from '../../../../DTO/DatosCajaDTO';
import { switchMap } from 'rxjs/operators';
import { EstadosDTO } from '../../../../DTO/EstadosDTO';
import { CajaDTO } from '../../../../DTO/CajaDTO';
import { Observable } from 'rxjs';
import { ArcaaccajService } from '../../../../services/arcaaccaj.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { IdArcaaccaj } from '../../../../models/IdArcaaccaj';
import { TapUsuPven } from '../../../../models/TapUsuPven';
import { Arcaaccaj } from '../../../../models/Arcaaccaj';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';

@Component({
  selector: 'app-caja-edicion',
  templateUrl: './caja-edicion.component.html',
  styleUrls: ['./caja-edicion.component.css']
})
export class CajaEdicionComponent implements OnInit {

  form: FormGroup;
  edicion: boolean;
  idCaja: IdArcaaccaj;
  cajeros$: Observable<TapUsuPven[]>;
  cajas$: Observable<CajaDTO[]>;
  cajeroSeleccionado: string;
  cajaSeleccionada: string;
  estados: EstadosDTO[] = [
    { codigo: 'A', nombre: 'Abierto' },
    { codigo: 'C', nombre: 'Cerrado' }];
  estadoSeleccionado: string;
  maxFecha: Date = new Date();
  maxFecha1: Date = new Date();
  constructor(
    public cajaService: ArcaaccajService,
    public usuService: TapusupvenService,
    public route: ActivatedRoute,
    public router: Router,
    public dialogRef: MatDialogRef<CajaEdicionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Arcaaccaj
  ) { }

  ngOnInit(): void {
    if (this.data.cajera == null) {
      this.edicion = false;
      this.form = new FormGroup({
        cia: new FormControl(sessionStorage.getItem('cia')),
        centro: new FormControl(sessionStorage.getItem('centro')),
        caja: new FormControl(''),
        codAper: new FormControl(''),
        fecha: new FormControl(this.maxFecha),
        hora: new FormControl(moment(this.maxFecha).format('HH:mm')),
        cajera: new FormControl(''),
        saldoInicial: new FormControl(0),
        estado: new FormControl('A'),
        fechaCierre: new FormControl(),
        horaCierre: new FormControl('')
      })
    } else {
      this.edicion = true;
      this.initForm();
    }
    this.listaCajeros();
    this.listaCajas();
  }
  initForm() {
    this.form = new FormGroup({
      cia: new FormControl(this.data.idArcaja.cia),
      centro: new FormControl(this.data.idArcaja.centro),
      caja: new FormControl(this.data.idArcaja.codCaja, [Validators.required]),
      codAper: new FormControl(this.data.idArcaja.cod_aper),
      fecha: new FormControl(this.data.fecha, [Validators.required]),
      hora: new FormControl(this.data.hora, [Validators.required]),
      cajera: new FormControl(this.data.cajera, [Validators.required]),
      saldoInicial: new FormControl(this.data.saldoInicial),
      estado: new FormControl(this.data.estado),
      fechaCierre: new FormControl(this.data.fechaCierre),
      horaCierre: new FormControl(this.data.horaCierre)
    })
    this.cajaSeleccionada = this.form.value['caja'];
    this.cajeroSeleccionado = this.form.value['cajera'];
  }
  listaCajeros() {
    this.cajeros$ = this.usuService.cajeros(sessionStorage.getItem('cia'), sessionStorage.getItem('centro'));
  }
  listaCajas() {
    if (this.edicion) {
      this.cajas$ = this.cajaService.cajaSeleccianda(sessionStorage.getItem('cia'), sessionStorage.getItem('centro'));
    } else {
      this.cajas$ = this.cajaService.cajaRegistro(sessionStorage.getItem('cia'), sessionStorage.getItem('centro'));
    }
    //this.cajas$ = this.cajaService.cajas(sessionStorage.getItem('cia'), sessionStorage.getItem('centro'));
  }
  validaCaja() {
    return (this.edicion);
  }
  operar() {
    let idCaja = new IdArcaaccaj();
    idCaja.cia = this.form.value['cia'];
    idCaja.centro = this.form.value['centro'];
    idCaja.codCaja = this.form.value['caja'];
    idCaja.cod_aper = this.form.value['codAper'];
    let caja = new Arcaaccaj();
    caja.idArcaja = idCaja;
    caja.fecha = this.form.value['fecha'];
    caja.hora = this.form.value['hora'];
    caja.cajera = this.form.value['cajera'];
    caja.saldoInicial = this.form.value['saldoInicial'];
    caja.estado = this.form.value['estado'];
    caja.fechaCierre = this.form.value['fechaCierre'];
    caja.horaCierre = this.form.value['horaCierre'];

    this.maxFecha.setHours(0);
    this.maxFecha.setMinutes(0);
    this.maxFecha.setSeconds(0);
    this.maxFecha.setMilliseconds(0);
    let datos = new DatosCajaDTO(idCaja.cia, idCaja.centro, idCaja.codCaja,
      caja.cajera)
    datos.fecha = moment(this.maxFecha).format('YYYY-MM-DDTHH:mm:ss');
    if (caja.estado == 'A') {

      if (this.edicion) {
        this.cajaService.actualizaCaja(caja).pipe(switchMap(() => {
          return this.cajaService.totalCajas(datos);
        })).subscribe(data => {
          this.cajaService.cajasCreadas.next(data);
          this.cajaService.mensajeCambio.next('SE ACTUALIZÓ');
        });
      } else {
        this.cajaService.aperturaCaja(caja).pipe(switchMap(() => {
          return this.cajaService.totalCajas(datos);
        })).subscribe(data => {
          this.cajaService.cajasCreadas.next(data);
          this.cajaService.mensajeCambio.next('SE REGISTRÓ');
        });
      }
      this.cancelar();
    }
  }
  cancelar() {
    this.dialogRef.close();
  }
  validaBoton() {
    return (this.form.value['estado'] == 'C' || this.form.value['fecha'] == null || this.form.value['hora'] == null || this.form.value['cajera'] == null || this.form.value['caja'] == null);
  }
}
