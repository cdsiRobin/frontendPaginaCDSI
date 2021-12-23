import { Usuario } from './../models/usuario';
import { Arfatp } from './../models/Arfatp';
import { OtherService } from './other.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Informacion } from '../interfaces/informacion';
import { Observable, throwError } from 'rxjs';
import { GenericoService } from './generico/generico.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ArfatpService extends GenericoService {

  constructor(private http:HttpClient) {  super(); }

  // METODO QUE NOS PERMITE TRAER LA LISTA  DE PRECIO DE PUNTO DE VENTA
  public getAllListaPrecio( cia: string, pv: string): Observable<Informacion<Arfatp>> {
    return this.http.get<Informacion<Arfatp>>(this.url + `/listaprecios/list?cia=${cia}&pv=${pv}`, this.options).pipe(
      catchError(err => {
        if (err.status === 400 || err.status === 500) {
          console.error(err.erro.message);
          return throwError(err);
        }
        if (err.error.mensaje) {
          console.error(err.error.message);
        }
        return  throwError(err);
      })
    );
  }

}
