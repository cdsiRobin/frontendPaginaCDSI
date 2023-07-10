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
import { Artsccb } from '../../../../models/artsccb';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-caja-edicion',
  templateUrl: './caja-edicion.component.html'
})
export class CajaEdicionComponent implements OnInit {

  fArcaaccaj: FormGroup;
  public fActual: string;
  public arcaaccaj: Arcaaccaj;

  constructor(
    private snackBar: MatSnackBar,
    public arcaaccajService: ArcaaccajService,
    public usuService: TapusupvenService,
    private router: Router,
    public dialogRef: MatDialogRef<CajaEdicionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Artsccb
  ) { }

  ngOnInit(): void {
    this.crearReloj();
    this.initForm();
  }

  private initForm() {
    this.fArcaaccaj = new FormGroup({
      caja : new FormControl({value: `${this.data.artsccbPK.noCaba} - ${this.data.descCaba}`, disabled: true }),
      fecha : new FormControl({value: this.fActual, disabled: true }),
      monto : new FormControl({value: 0, disabled: false })
    });
  }

  public operar(): void {
    Swal.fire({
      title: `Está seguro de Aperturar la caja ${this.data.artsccbPK.noCaba} ?`,
      showDenyButton: true,
      confirmButtonText: 'SI'
    }).then((result) => {
      if (result.isConfirmed) {
          this.guardarAperturaCaja();
      }
    });

  }
  // METODO QUE NOS PERMITE  GUARDAR LA APERTURA DE UNA CAJA
  private guardarAperturaCaja(): void{
    const fecha = new Date();
    const idArcaja = new IdArcaaccaj();
    idArcaja.cia = sessionStorage.getItem('cia');
    idArcaja.centro = sessionStorage.getItem('centro');
    idArcaja.codCaja = this.data.artsccbPK.noCaba;
    idArcaja.codAper = '';
    const arcaaccaj = new Arcaaccaj();
    arcaaccaj.idArcaja = idArcaja;
    arcaaccaj.fecha = moment(fecha.toISOString()).format('YYYY-MM-DDTHH:mm:ss');
    arcaaccaj.cajera = sessionStorage.getItem('codEmp');
    arcaaccaj.saldoInicial = this.fArcaaccaj.get('monto').value;
    // arcaaccaj.fechaCierre = '';
    arcaaccaj.estado = 'A';
    arcaaccaj.hora = fecha.getHours() + ':' + fecha.getMinutes();
    this.arcaaccajService.aperturarCaja(arcaaccaj).subscribe(resul => {
      Swal.fire(`Se Aperturo la Caja ${this.data.artsccbPK.noCaba}`);
    }, err => {
        console.warn(err);
    }, () => {
        this.snackBar.open(`Se Aperturo la Caja ${this.data.artsccbPK.noCaba}`,'Cerrar',
        {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
        this.cancelar();
    });
  }
  // FIN
  public cancelar() {
    this.dialogRef.close();
    this.router.navigate( ['pedido/empresa']);
  }
  // CREAR RELOJ
  private crearReloj(): void{
    const fecha = new Date();
    this.fActual = String(fecha.getDate()).padStart(2,'0')+'/'+String(fecha.getMonth() + 1).padStart(2,'0')+'/'+fecha.getFullYear();
  }


}
