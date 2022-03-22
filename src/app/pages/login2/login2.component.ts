import { MenuPventaComponent } from './menu-pventa/menu-pventa.component';
import { MatDialog } from '@angular/material/dialog';
import { TapUsuPven } from './../../models/TapUsuPven';
import { VendedorDTO } from './../../DTO/VendedorDTO';
import { Company } from './../../models/company';
import { IdArccvc } from './../../models/IdArccvc';
import { Arccvc } from './../../models/Arccvc';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { ArccvcService } from './../../services/arccvc.service';
import { CompanyService } from './../../services/company.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { TapusupvenService } from '../../services/tapusupven.service';

@Component({
  selector: 'app-login2',
  templateUrl: './login2.component.html',
  styleUrls: ['./login2.component.css']
})
export class Login2Component implements OnInit {

  id: number;
  company: Company;
  companySeleccionada: Company;
  vendedor: Arccvc;
  idVende: IdArccvc;
  usuario: TapUsuPven[] = [];
  form: FormGroup;
  codEmpleado: string;
  empleadoSeleccionado: TapUsuPven;

  constructor(
    private route: ActivatedRoute,
    private ciaServ: CompanyService,
    public usuService: TapusupvenService,
    private venServ: ArccvcService,
    private router: Router,
    public dialog: MatDialog) { }

  ngOnInit() {
    //this.listarCias();
    this.idVende = new IdArccvc();
    this.vendedor = new Arccvc();
    this.form = new FormGroup({
      // 'cia': new FormControl(''),
      'codigo': new FormControl(''),
      'pass': new FormControl('')
    });

  }

  private getCia() {
    this.ciaServ.getCompany(this.vendedor.idArc.cia).subscribe(data => {
      this.company = data;
    }, err => {
        console.warn(err)
    }, () => {
      this.guardarCampos();
      this.traerUsuarioAndCentro();
      Swal.close();
      // this.router.navigateByUrl('/pedido');
      this.router.navigateByUrl('/pedido/empresa');
    });
  }

  obtenerVendedor() {

    Swal.fire({
      allowOutsideClick: false, // CLICK FUERA
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();

    //this.companySeleccionada = this.form.value['cia'];
    this.idVende.codigo = this.form.value['codigo'];
    this.vendedor.pass = this.form.value['pass'];

    let vende = new VendedorDTO(this.form.value['codigo'], this.form.value['pass']);
    this.venServ.getVendedor(vende).subscribe(data => {
      this.vendedor = data;
    }, err => {
      if (err.status == 404) {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          title: 'Usuario o Clave incorrecta !!'
        });
      }
    }, () => {
      this.getCia();

    });
  }
  guardarCampos() {
      sessionStorage.setItem('cia', this.vendedor.idArc.cia);
      sessionStorage.setItem('nomCia', this.company.nombre);
      sessionStorage.setItem('cod', this.vendedor.idArc.codigo);
      sessionStorage.setItem('nombre',  this.vendedor.descripcion);
      sessionStorage.setItem('codEmp', this.vendedor.idArc.codigo);
  }
  abrirDialogo() {
    this.dialog.open(MenuPventaComponent, {
      width: '250px'
    });
  }
  // VAMOS A TRAER EL USUARIO Y CENTRO EMISOR
  public traerUsuarioAndCentro(): void{
      this.usuService.traerUsuario(this.vendedor.idArc.cia, this.vendedor.idArc.codigo).subscribe(data => {
        this.empleadoSeleccionado = data
        sessionStorage.setItem('centro', this.empleadoSeleccionado.centro);
        sessionStorage.setItem('usuario', this.empleadoSeleccionado.idUsuario.usuario);
      });

  }
  //FIN
}
