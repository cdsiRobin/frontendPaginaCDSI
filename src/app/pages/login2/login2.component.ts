import { MenuPventaComponent } from './menu-pventa/menu-pventa.component';
import { MatDialog } from '@angular/material/dialog';
import { TapUsuPven } from './../../models/TapUsuPven';
import { VendedorDTO } from './../../DTO/VendedorDTO';
import { Company } from './../../models/company';
import { IdArccvc } from './../../models/IdArccvc';
import { Arccvc } from './../../models/Arccvc';
import { Router} from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { ArccvcService } from './../../services/arccvc.service';
import { CompanyService } from './../../services/company.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { TapusupvenService } from '../../services/tapusupven.service';
import { Licencia } from '../../models/licencia';
import { LicenciaService } from '../../services/licencia.service';
import { DatePipe } from '@angular/common';
import { UsuacService } from '../../services/usuac.service';
import { Usuac } from '../../models/usuac';
import { Usuacpk } from '../../models/usuacpk';

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
  private licencia: Licencia;
  private usuacs: Array<Usuac>;
  private usuac: Usuac;

  constructor(
    private licenciaService: LicenciaService,
    private usuacService: UsuacService,
    private ciaServ: CompanyService,
    private usuService: TapusupvenService,
    private venServ: ArccvcService,
    private router: Router,
    private datePipe: DatePipe,
    private dialog: MatDialog) { }

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
    }, () => {  // -------------------------------------------------------------->>>>>>>>>>>>>>>>>>>>>>
      this.traerUsuarioAndCentro();
    });
  }
  // VEFICAR SI COMPAÑIA TIENE LICENCIA
  private verificarLicenciaCompany(): void{
     this.licenciaService.consultarCia(this.company.cia).subscribe( data => {
          this.licencia = data;
     },err => {
          console.log(err);
          Swal.fire('Error al traer la Licencia de la compañia.')
     }, () => {
          this.verificarFechaFinalAndCantidadUsu();
     });
  }
  // FIN
  // VERIFICAR FECHA DE FINALIZACION Y CANTIDAD DE USUARIO
  private verificarFechaFinalAndCantidadUsu(): void{
     const fechaActual = Date.now();
     if(fechaActual <= Date.parse(this.datePipe.transform(this.licencia.fecFinaliza, 'yyyy-MM-dd'))){
         this.consultarUsuActivo();
     }else{
        Swal.fire(`Tu Licencia expiro el día ${this.datePipe.transform(this.licencia.fecFinaliza, 'dd/MM/yyyy')}.`);
     }

  }
  // FIN
  // CONSULTAR LA CANTIDAD DE USUARIOS ACTIVO
  private consultarUsuActivo(): void {
     this.usuacService.listarUsuariosActivos(this.company.cia,'A').subscribe( data => {
       this.usuacs = data;
     },err => {
        console.log(err);
     }, () =>{
         if(this.licencia.usuAc >= this.usuacs.length){
              // BUSCAR SI EL USUARIO ESTA ACTIVO EN OTRA PC
              const x = this.usuacs.find( r => {
                if(r.usuacPK.usuario === this.empleadoSeleccionado.idUsuario.usuario){
                    return r;
                }
              });
              if(x === undefined){
                  // GUARDAMOS O ACTUALIZAMOS EL USUARIO
                  this.guardarUsuario();
              }else{
                this.verificarUsuarioActivo(x.usuacPK.usuario);
              }
         }else{
            Swal.fire(`No puede superar cantidad de usuarios permitidos por tu Licencia ${this.licencia.nroLicencia}`);
         }
     });
  }
  // FIN
  // GUARDAMOS O ACTUaLIZAMOS EL USUARIO
  private guardarUsuario(): void{
     const usupk: Usuacpk = new Usuacpk();
     usupk.noCia = this.company.cia;
     usupk.usuario = this.empleadoSeleccionado.idUsuario.usuario;
     const usuac = new Usuac();
     usuac.usuacPK = usupk;
     usuac.activo = 'A';
     usuac.modulo = 'PVEN';
     usuac.entrada = this.datePipe.transform(Date.now(), 'yyyy-MM-ddTHH:mm:ss');
     this.usuacService.guardar(usuac).subscribe(data => {
          this.usuac = data;
     }, err =>{
        console.log(err);
     }, () =>{
        this.guardarCampos();
        Swal.close();
        this.router.navigateByUrl('/pedido/empresa');
     });
  }
  // FIN

  private verificarUsuarioActivo(usurio: string): void{
    if (this.validarLicencia()){
        this.guardarUsuario();
    } else {
        this.actualizarLicencia();
    }
  }

  private actualizarLicencia(): void {
     const llave: string = Math.random().toString(36);
     this.licenciaService.actualizar(this.licencia.licenciaPK.noCia, this.licencia.licenciaPK.ruc, llave).subscribe( value => {
        this.licencia = value;
     }, err => {
        console.error(err);
     }, () => {
         this.guardarUsuario();
     });
  }

  private validarLicencia(): boolean{
    return this.licencia.llave === localStorage.getItem('licencia') ? true : false;
  }

  // EVENTO CLICK DEL LOGIN
  public obtenerVendedor(): void {

    Swal.fire({
      allowOutsideClick: false,
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
          title: 'DNI o Contraseña es incorrecta !!'
         });
      }
    }, () => {
      this.getCia();
    });
  }
  // FIN
  private guardarCampos(): void {
      sessionStorage.setItem('cia', this.vendedor.idArc.cia);
      sessionStorage.setItem('nomCia', this.company.nombre);
      sessionStorage.setItem('cod', this.vendedor.idArc.codigo);
      sessionStorage.setItem('nombre',  this.vendedor.descripcion);
      sessionStorage.setItem('codEmp', this.vendedor.idArc.codigo);

      sessionStorage.setItem('centro', this.empleadoSeleccionado.centro);
      sessionStorage.setItem('usuario', this.empleadoSeleccionado.idUsuario.usuario);

      localStorage.setItem('licencia', this.licencia.llave);
      sessionStorage.setItem('ruc', this.company.ruc);
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
      }, err => {
         console.log(err);
         Swal.fire('No se pudo traer el usuario y su centro emisor.');
      }, () => {
           this.verificarLicenciaCompany();
      });

  }
  //FIN
}
