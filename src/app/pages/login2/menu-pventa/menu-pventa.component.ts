import Swal from 'sweetalert2';
import { Arcaaccaj } from './../../../models/Arcaaccaj';
import { TapUsuPven } from './../../../models/TapUsuPven';
import { DatosCajaDTO } from './../../../DTO/DatosCajaDTO';
import { ArcaaccajService } from './../../../services/arcaaccaj.service';
import { TapusupvenService } from './../../../services/tapusupven.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MenuDTO } from './../../../DTO/MenuDTO';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-menu-pventa',
  templateUrl: './menu-pventa.component.html',
  styleUrls: ['./menu-pventa.component.css']
})
export class MenuPventaComponent implements OnInit {
  menu: MenuDTO[] = [
    { codigo: '1', nombre: 'Venta' },
    { codigo: '2', nombre: 'Articulos' }];
  menuSeleccionado: string;
  maxFecha: Date = new Date();
  empleados: TapUsuPven[] = [];
  empleadoSeleccionado: TapUsuPven;
  cajas: Arcaaccaj[] = [];
  cajaSeleccionada: Arcaaccaj;
  codEmp: string;
  cia: string;
  constructor(private router: Router,
    public usuService: TapusupvenService,
    public cajaService: ArcaaccajService,
    public dialogRef: MatDialogRef<MenuPventaComponent>) { }

  ngOnInit(): void {
    this.cia = sessionStorage.getItem('cia');
    this.codEmp = sessionStorage.getItem('codEmp');
    this.maxFecha.setHours(0);
    this.maxFecha.setMinutes(0);
    this.maxFecha.setSeconds(0);
    this.maxFecha.setMilliseconds(0);
    this.listaUsuarios();
  }
  listaUsuarios() {
    this.usuService.traerUsuario(this.cia, this.codEmp).subscribe(data => {
      this.empleados = data;
    })
  }
  cajasAbiertasCajero() {
    if (this.empleadoSeleccionado != null) {
      sessionStorage.setItem('centro', this.empleadoSeleccionado.centro);
      sessionStorage.setItem('usuario', this.empleadoSeleccionado.idUsuario.usuario);

      let datos = new DatosCajaDTO(this.cia, this.empleadoSeleccionado.centro,
        null, this.codEmp);
      if (this.empleadoSeleccionado.tipusua == "04") {
        this.cajaService.caja(datos).subscribe(data => {
          this.cajas = data;
        });
      }
    }
  }
  aceptar() {
    if (this.menuSeleccionado == "1") {
      if (this.empleadoSeleccionado != null) {
        let datos = new DatosCajaDTO(this.cia, this.empleadoSeleccionado.centro,
          null, this.codEmp);
        datos.fecha = moment(this.maxFecha).format('YYYY-MM-DDTHH:mm:ss');
        if (this.cajas.length >= 1) {
          if (this.empleadoSeleccionado.centro != null) {
            this.cajaService.totalCajas(datos).subscribe(data => {
              this.cajaService.cajasCreadas.next(data);
            })
            this.cancelar();
            this.router.navigateByUrl('/pedido');
          } else {
            Swal.close();
            Swal.fire({
              allowOutsideClick: false,
              icon: 'info',
              title: 'Seleccione Usuario'
            });
          }
        } else {
          Swal.close();
          Swal.fire({
            allowOutsideClick: false,
            icon: 'info',
            title: `El usuario: ${this.empleadoSeleccionado.nombre} no tiene una caja abierta activa`
          });
          this.cajaService.totalCajas(datos).subscribe(data => {
            this.cajaService.cajasCreadas.next(data);
          })
          this.cancelar();
          this.router.navigateByUrl('/pedido');
        }
      }else{
        Swal.close();
          Swal.fire({
            allowOutsideClick: false,
            icon: 'info',
            title: `El usuario: ${sessionStorage.getItem('nombre')}, no tiene permiso de hacer una venta`
          });
      }
    } else {
      if (this.menuSeleccionado == "2") {
        this.cancelar();
        this.router.navigateByUrl('/articulo');
      }
    }
  }
  cancelar() {
    this.dialogRef.close();
  }

}
