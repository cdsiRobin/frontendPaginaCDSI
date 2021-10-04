import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Informacion} from '../interfaces/informacion';
import {Arcgtc} from '../models/arcgtc';
import {GenericoService} from './generico/generico.service';
import {catchError} from 'rxjs/operators';
import {ArcgtcPK} from '../models/arcgtc-pk';

@Injectable({
  providedIn: 'root'
})
export class ArcgtcService extends GenericoService{

  constructor(public http: HttpClient) { super(); }

  // VAMOS A TRAER EL TOTAL DE LOS TIPOS DE CAMBIO
  public getTotalArcgtc(): Observable<Informacion<Arcgtc>> {
    return this.http.get<Informacion<Arcgtc>>(this.url + `/arcgtc/listar`, this.options).pipe(
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
  // VAMOS A TRAER EL TIPO DE CAMBIO POR ArcgtcPK
  public getTraerArcgtcFecha( arcgtcpk: ArcgtcPK): Observable<Informacion<Arcgtc>> {
    const body = JSON.stringify(arcgtcpk);
    return this.http.post<Informacion<Arcgtc>>( this.url + `/arcgtc/listar`, body, this.options ).pipe(
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
