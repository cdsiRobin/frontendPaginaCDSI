import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { GenericoService } from './generico/generico.service';
import { HttpClient } from '@angular/common/http';
import { Consulta } from '../interfaces/consulta';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class TokenService extends GenericoService {

  constructor(private router: Router,private http: HttpClient ) { super(); }

  public validar(): Observable<boolean> {
      const cia : string = sessionStorage.getItem('cia');
      const ruc : string = sessionStorage.getItem('ruc');
      const lleveLocal: string = localStorage.getItem('licencia') || '';

      return this.http.get(this.url+`/licencia/validar?cia=${cia}&ruc=${ruc}&llave=${lleveLocal}`,
          this.options).pipe(
          // tap(rest => console.log(rest)),
          map( (rest: Consulta<boolean> ) => rest.resultado),
          catchError( error => of(false) )
          );
  }
  /*
  public validarLicencia():void {
      const cia : string = sessionStorage.getItem('cia');
      const ruc : string = sessionStorage.getItem('ruc');
      const lleveLocal: string = localStorage.getItem('licencia');

      this.licenciaService.consultarId(cia,ruc).subscribe(value => {
        this.licencia = value
      },err => {
        console.error(err);
      },() => {
          if(lleveLocal != this.licencia.llave){
              this.actualizarSesionUsuario();
          }
      });
  }

  private actualizarSesionUsuario(): void{
       alert('El usuario cerro sesión en este dispositivo.');
       sessionStorage.clear();
       localStorage.clear();
       this.router.navigate(['dashboard/log_arti']);
  }
  */



}
