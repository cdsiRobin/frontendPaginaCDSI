import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {OtherService} from './other.service';
import {Informacion} from '../interfaces/informacion';
import {IArfacc} from '../interfaces/IArfacc';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Arfacc} from '../models/arfacc';
import {IarfaccPK} from '../interfaces/IarfaccPK';
import {GenericoService} from './generico/generico.service';

@Injectable({
  providedIn: 'root'
})
export class ArfaccService extends GenericoService{

  constructor(
    private http: HttpClient
  ) { super(); }

  // VAMOS A CONSULTAR LA SERIE Y CORRELATIVO
  public getSerieAndCorrelativoPedido(arfacc: Arfacc): Observable< Informacion<Arfacc> >{
    const body = JSON.stringify(arfacc);
    return this.http.post<Informacion<Arfacc>>(this.url + `/arfacc/id`, body, this.options).pipe(
      catchError(err => {
        if (err.status === 400 || err.status === 500){
          console.error(err);
          return throwError(err);
        }
        if (err.error.mensaje) {
          console.error(err.error.mensaje);
        }
        return  throwError(err);
      })
    );
  }

}
