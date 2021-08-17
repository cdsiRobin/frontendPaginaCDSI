import { Component, OnInit } from '@angular/core';
import { OtherService } from '../../services/other.service';
import { GelocationService } from '../../services/gelocation.service';
import { Gelocation } from '../../models/gelocation';
import { Usuario } from '../../models/usuario';
import { CompanyService } from '../../services/company.service';
import { Company } from 'src/app/models/company';

@Component({
  selector: 'app-cabezera',
  templateUrl: './cabezera.component.html',
})
export class CabezeraComponent implements OnInit {
  public usuario = new Usuario();
  public gelocation = new Gelocation();
  public company = new Company();

  nombre: string;
  apellido: string;
  email: string;
  
  constructor(public other: OtherService, public serviGelo: GelocationService, public serviCompa: CompanyService) { 
    this.getGeloByCiaAndUser();
    this.getCompany();
   }

  ngOnInit() {}
  // METODOS QUE TRAE LOS DATOS DE LA GEOLOCALIZACION DEL USUARIO POR COMPAÑIA
  public getGeloByCiaAndUser() {
    // this.usuario = new Usuario();
    this.usuario = JSON.parse(sessionStorage.getItem('usuario'));
    this.serviGelo.getGelocation(this.usuario).subscribe(
      rest => {
        // console.warn(rest);
        this.gelocation = new Gelocation();
        this.gelocation = rest;
      }
    );
    this.informacionUser();
  }
  // METODO QUE NOS PERMITE TRAER EL NOMBRE DE LA COMPAÑIA
  public getCompany() {
    // this.usuario = new Usuario();
    this.usuario = JSON.parse(sessionStorage.getItem('usuario'));
    // console.log(this.usuario);
    this.serviCompa.getCompany(this.usuario).subscribe(
      rest => {
        // console.warn(rest);
        // this.company = new Company();
        this.company = rest;
      }
    );
  }

  //METODO DONDE VAMOS A TENER EL NOMBRE, APELLIDO Y EMAIL DEL USUARIO
  public informacionUser(){
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
    //this.nombre = this.usuario.nombre;
  }

}

