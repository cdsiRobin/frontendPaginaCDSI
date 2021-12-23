import { DatosCajaDTO } from './../../../DTO/DatosCajaDTO';
import { ArcaaccajService } from './../../../services/arcaaccaj.service';
import { switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Arcaaccaj } from 'src/app/models/Arcaaccaj';
import * as moment from 'moment';
import { CajaEdicionComponent } from './caja-edicion/caja-edicion.component';
import {MatSnackBar} from '@angular/material/snack-bar';
@Component({
  selector: 'app-caja',
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.css']
})
export class CajaComponent implements OnInit {

  form: FormGroup;
  maxFecha: Date = new Date();
  fechaSeleccionada: Date = new Date();
  displayedColumns = ['fecha', 'hora', 'codCaja', 'cajera', 'saldoInicial', 'estado', 'fechaCierre', 'horaCierre', 'acciones'];
  dataSource: MatTableDataSource<Arcaaccaj>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  caja: string;
  cajera: string;
  centro: string;

  constructor(
    public cajaService: ArcaaccajService,
    public snackBar: MatSnackBar,
    public route: ActivatedRoute,
    public dialog: MatDialog,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.centro = sessionStorage.getItem('centro');
    this.maxFecha.setHours(0);
    this.maxFecha.setMinutes(0);
    this.maxFecha.setSeconds(0);
    this.maxFecha.setMilliseconds(0);
    this.form = new FormGroup({
          centro: new FormControl(this.centro),
          fecha: new FormControl(this.maxFecha)
        });
    this.cajaService.cajasCreadas.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
    this.cajaService.mensajeCambio.subscribe(data => {
      this.snackBar.open(data, 'AVISO', {
        duration: 2000,
      });
    });
  }
  regresar(): void {
    this.router.navigateByUrl('/pedido');
  }
  buscar(): void {
    this.datosCaja();
  }
  datosCaja(): void {
    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setSeconds(0);
    this.fechaSeleccionada.setMilliseconds(0);
    let datos = new DatosCajaDTO(sessionStorage.getItem('cia'), this.centro, this.caja, this.cajera);
    datos.fecha = moment(this.fechaSeleccionada).format('YYYY-MM-DDTHH:mm:ss');
    if (datos.centro) {
      delete datos.caja;
      delete datos.cajera;
    }
    this.cajaService.totalCajas(datos).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }
  eliminar(caja: Arcaaccaj): void {
    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setSeconds(0);
    this.fechaSeleccionada.setMilliseconds(0);
    let datos = new DatosCajaDTO(caja.idArcaja.cia, caja.idArcaja.centro, caja.idArcaja.codCaja, caja.cajera)
    datos.fecha = moment(this.fechaSeleccionada).format('YYYY-MM-DDTHH:mm:ss');
    this.cajaService.eliminar(caja.idArcaja).pipe(switchMap(() => {
      return this.cajaService.totalCajas(datos);
    })).subscribe(data => {
      this.cajaService.cajasCreadas.next(data);
      this.cajaService.mensajeCambio.next('SE ELIMINÓ');
    })
  }

  abrirDialogo(caja?: Arcaaccaj): void {
    let caj = caja != null ? caja : new Arcaaccaj();
    this.dialog.open(CajaEdicionComponent, {
      maxWidth: '35%',
      data: caj
    });
  }
}
