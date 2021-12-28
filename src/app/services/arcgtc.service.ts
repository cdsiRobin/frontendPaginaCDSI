import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Informacion} from '../interfaces/informacion';
import {Arcgtc} from '../models/arcgtc';
import {GenericoService} from './generico/generico.service';
import { catchError, map } from 'rxjs/operators';
import {ArcgtcPK} from '../models/arcgtc-pk';
import { Infor } from '../interfaces/infor';
import { Guardar } from '../interfaces/guardar';
import { Sunattc } from '../models/sunattc';

@Injectable({
  providedIn: 'root'
})
export class ArcgtcService extends GenericoService{

  constructor(public http: HttpClient) { super(); }

  //VAMOS A TRER LOS TIPOS DE CAMBIOS DE SUNAT
  public listaTipoCambioSunat(fecha: string):Observable<Sunattc>{
     return this.http.get<Sunattc>(`https://api.apis.net.pe/v1/tipo-cambio-sunat?fecha=${fecha}`);
  }

  //METODO PARA GUARDAR EL PEDDIO
  public saveTipoCambio(arcgtc: Arcgtc): Observable<Arcgtc>{
    const body = JSON.stringify(arcgtc);
    //console.log(body);
    return this.http.post<Guardar<Arcgtc>>(this.url + `/arcgtc/save`, body, this.options).pipe(
      map( (responde : Guardar<Arcgtc>) => {
        return responde.detalle;
      })
    );
  }

  // VAMOS A TRAER EL TIPO DE CAMBIO POR LA CLASE 02 Y LA FECHA
  public getTipoCambioClaseAndFecha( clase: string, fecha: string): Observable<Infor<Arcgtc>> {
    return this.http.get<Infor<Arcgtc>>(this.url + `/arcgtc/id?clase=${clase}&fecha=${fecha}`, this.options).pipe(
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
  // VAMOS A TRAER TODAS LAS FECHAS
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
